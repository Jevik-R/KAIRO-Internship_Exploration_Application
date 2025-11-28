import json
import re
from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from openai import AsyncOpenAI  # Standard library for OpenRouter/OpenAI

from api.config.config import OPEN_ROUTER_API_KEY
from api.models.resume_parser_models import ResumeUrlRequest
from api.utils.pdf_utils import load_and_extract

if not OPEN_ROUTER_API_KEY:
    raise EnvironmentError("OPEN_ROUTER_API_KEY not found")

# Initialize the Async Client for OpenRouter
client = AsyncOpenAI(
    api_key=OPEN_ROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
)

router = APIRouter()

@router.post("/parse-resume")
async def parse_resume(req: ResumeUrlRequest):
    # ---------------------------
    # 1. Extract raw text + links
    # ---------------------------
    # Run heavy PDF extraction in a separate thread to avoid blocking the event loop
    result = await run_in_threadpool(load_and_extract, req.url)

    raw_text = result["raw_text"]
    links = result["links"]

    # ---------------------------
    # 2. Prepare Prompts
    # ---------------------------
    schema = {
        "name": "string or null",
        "gender": "MALE | FEMALE | OTHER", 
        "email": "string or null",
        "phone": "string or null",
        "college": "string or null",
        "course": "string or null",
        "year": "string or null",
        "cgpa": "string or null",
        "skills": ["list", "of", "strings"],
        "experience": "string (summary of work history) or null",
        "source": "string or null",
        "appliedFor": "string or null",
        "appliedDate": "string or null",
        "status": "string or null",
        "linkedin": "string or null",
        "github": "string or null",
        "portfolio": "string or null",
        "resumeUrl": "string or null"
    }

    system_prompt = f"""
    You are an expert resume parsing API. 
    Analyze the resume text and extracted links provided by the user.
    Extract the information into a single, valid JSON object following this schema exactly:
    {json.dumps(schema)}

    Rules: 
    - Your output MUST be ONLY the raw JSON object, starting with '{{' and ending with '}}'.
    - Do NOT include markdown code blocks (```json), preambles, or explanations.
    - If a field is missing, return null (for strings) or [] (for lists). 
    - Deduce gender if possible, otherwise null.
    - Check the "EXTRACTED LINKS LIST" to fill linkedin, github, and portfolio fields.
    """

    user_content = f"""
    EXTRACTED LINKS LIST:
    {json.dumps(links)}

    RESUME TEXT:
    {raw_text}
    """

    # ---------------------------
    # 3. Call AI (OpenRouter)
    # ---------------------------
    try:
        response = await client.chat.completions.create(
            # UPDATED: Use a valid model ID. "qwen3" does not exist yet.
            # "qwen/qwen-2.5-coder-32b-instruct:free" is a currently valid free model.
            model="qwen/qwen3-4b:free",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            temperature=0.1, # Keep strictly factual
            max_tokens=2000
        )

        llm_raw_output = response.choices[0].message.content

        # ---------------------------
        # 4. Clean and Parse JSON
        # ---------------------------
        # Regex to find content between the first { and the last }
        match = re.search(r'\{.*\}', llm_raw_output, re.DOTALL)
        
        if match:
            json_str = match.group(0)
        else:
            json_str = llm_raw_output.strip()

        data = json.loads(json_str)

    except json.JSONDecodeError as e:
        print(f"JSON DECODE ERROR: {e}. Raw LLM output was: \n{llm_raw_output}")
        raise HTTPException(
            status_code=500, 
            detail=f"AI Error: Failed to parse valid JSON from LLM."
        )
    except Exception as e:
        print("OTHER ERROR:", type(e).__name__, str(e))
        raise HTTPException(500, f"AI Error: {e}")

    # ---------------------------
    # 5. Add Meta Fields
    # ---------------------------
    data["resumeUrl"] = req.url
    data["rawResumeText"] = raw_text # Optional: Store raw text for debugging
    data.setdefault("source", "Company Website")
    data.setdefault("status", "Applied")
    data.setdefault("appliedDate", None)

    return data