
<p align="center">
  <img src="https://github.com/user-attachments/assets/e0620a0d-1f31-434c-9406-69eee3131f5c" style="border-radius: 25px;"/>
</p>

<h1 align="center">KAIRO - Internship Exploration Application</h1>

<br/>

Contents
========
- [Problem Statement](#problem-statement)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [File System](#file-system)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Contributors / Authors](#contributors)

<br/>
<br/>


## Problem Statement
KAIRO Software Company aims to develop an Internship Exploration Application that provides a unified platform for managing the entire internship lifecycle. The application will enable students to create digital profiles, explore and apply for opportunities that match their skills and preferences.

On the recruiter side, the system will allow companies to post internship openings, review candidate applications, manage shortlisting and interviews, and access analytics to evaluate trends in applications and selections.

The platform will focus on secure data handling, transparent communication, and efficient matching between students and recruiters.

This project will deliver a scalable and interactive solution that streamlines internship exploration, supports better decision-making for both students and recruiters, and enhances the overall internship experience.

<br/>
<br/>

## Tech Stack
 - Typescript + Next.js
 - FastAPI + OpenRouter
 - Prisma + Supabase
 - ShadcnUI
 - Tailwind CSS
 - UploadCare
 - Cloudinary
 - Nodemailer
 - Knip


<br/>
<br/>


## Architecture
<p align="center">
<img width="1213" height="723" alt="image" src="https://github.com/user-attachments/assets/daf3d52d-c241-40d3-a028-b9e4dd73238f" />
</p>


<br/>
<br/>

## File System

```shell
.
├── 📁backend                          # Python FastAPI Backend
│   ├── 📁api                          # Main API source code
│   │   ├── 📁config                   # Configuration settings
│   │   │   └── config.py              # App configuration loader
│   │   ├── 📁models                   # Pydantic models for validation
│   │   │   ├── resume_parser_models.py # Schemas for parsed resume data
│   │   │   ├── shortlister_models.py   # Schemas for AI ranking logic
│   │   │   └── skill_verifier_models.py # Schemas for skill verification
│   │   ├── 📁routers                  # API route controllers
│   │   │   ├── ai_shortlister.py       # AI candidate ranking endpoints
│   │   │   ├── resume_parser.py        # Resume parsing endpoints
│   │   │   └── skill_verifier.py       # Skill verification endpoints
│   │   ├── 📁utils                    # Helper logic and utilities
│   │   │   ├── github_url_parser.py    # GitHub data extraction logic
│   │   │   ├── pdf_utils.py            # PDF text extraction utilities
│   │   │   └── shortlister_utils.py    # Ranking algorithms
│   │   └── main.py                    # Server entry point
│   ├── .env                           # Backend environment variables
│   ├── requirements.txt               # Python dependencies
│   ├── run.py                         # Script to start Uvicorn server
│   └── vercel.json                    # Backend deployment config
├── 📁frontend                         # Next.js + TypeScript Frontend
│   ├── 📁app                          # Next.js App Router
│   │   ├── 📁api                      # Server-side API Routes
│   │   │   ├── 📁auth                 # Auth & Core Logic
│   │   │   │   ├── 📁applied          # Internship application status logic
│   │   │   │   ├── 📁applyInternship  # Logic for submitting applications
│   │   │   │   ├── 📁company          # Company data fetching
│   │   │   │   ├── 📁companyLogin     # Company specific auth
│   │   │   │   ├── 📁controllCompany  # Admin control for companies
│   │   │   │   ├── 📁findInternship   # Search/Filter internships
│   │   │   │   ├── 📁profile          # Profile CRUD Operations
│   │   │   │   │   ├── 📁about                  # Update 'About' section
│   │   │   │   │   ├── 📁add-education          # Add education entry
│   │   │   │   │   ├── 📁add-experience         # Add work experience
│   │   │   │   │   ├── 📁add-project            # Add portfolio project
│   │   │   │   │   ├── 📁addskill               # Add manual skills
│   │   │   │   │   ├── 📁CodeforcesAttach       # Link Codeforces account
│   │   │   │   │   ├── 📁delete-education       # Remove education
│   │   │   │   │   ├── 📁delete-experience      # Remove experience
│   │   │   │   │   ├── 📁delete-github-link     # Unlink GitHub
│   │   │   │   │   ├── 📁delete-leetcode-link   # Unlink LeetCode
│   │   │   │   │   ├── 📁delete-linkedin-link   # Unlink LinkedIn
│   │   │   │   │   ├── 📁delete-profilepicture  # Remove avatar
│   │   │   │   │   ├── 📁delete-project         # Remove project
│   │   │   │   │   ├── 📁delete-resume          # Remove resume file
│   │   │   │   │   ├── 📁delete-skill           # Remove skill
│   │   │   │   │   ├── 📁edit-github-link       # Update GitHub URL
│   │   │   │   │   ├── 📁edit-linkedin-link     # Update LinkedIn URL
│   │   │   │   │   ├── 📁experience             # Fetch experience data
│   │   │   │   │   ├── 📁get-resume             # Fetch resume for application
│   │   │   │   │   ├── 📁GitHubAttach           # Link GitHub account
│   │   │   │   │   ├── 📁leetcode               # Fetch LeetCode stats
│   │   │   │   │   ├── 📁LeetCodeAttach         # Link LeetCode account
│   │   │   │   │   ├── 📁LinkedinAttach         # Link LinkedIn account
│   │   │   │   │   ├── 📁update-contact         # Update phone/email
│   │   │   │   │   ├── 📁update-name            # Update display name
│   │   │   │   │   ├── 📁update-profilepicture  # Update avatar
│   │   │   │   │   ├── 📁update-project         # Edit project details
│   │   │   │   │   └── 📁upload                 # Resume upload handler
│   │   │   │   ├── 📁recruiter        # Recruiter Logic
│   │   │   │   │   ├── 📁analytics              # Dashboard analytics
│   │   │   │   │   ├── 📁applicant              # Manage applicants
│   │   │   │   │   ├── 📁company                # Company profile management
│   │   │   │   │   ├── 📁companyInternship      # Manage posted internships
│   │   │   │   │   ├── 📁hiringFunnel           # ATS funnel logic
│   │   │   │   │   ├── 📁internshipData         # Single internship stats
│   │   │   │   │   ├── 📁interviewSchedule      # Scheduling logic
│   │   │   │   │   ├── 📁myAllInternship        # List all posts
│   │   │   │   │   ├── 📁myInternship           # List specific post
│   │   │   │   │   └── 📁recentApplicant        # Recent applications feed
│   │   │   │   ├── 📁registerCompany  # Company registration
│   │   │   │   ├── 📁signin           # Login handler
│   │   │   │   ├── 📁signup           # Registration handler
│   │   │   │   │   └── 📁verify             # Email verification
│   │   │   │   ├── 📁uploadFile       # General file upload (S3/CDN)
│   │   │   │   ├── 📁uploadInternship # Post new internship
│   │   │   │   └── 📁verify           # General verification
│   │   ├── 📁company                  # Company Public Pages
│   │   │   └── 📁[companyId]          # Dynamic Company Profile
│   │   ├── 📁company-login            # Company Portal Login
│   │   ├── 📁delete-codeforces-link   # Route helper
│   │   ├── 📁email-test               # Email service testing
│   │   ├── 📁profile                  # Student Profile
│   │   │   └── 📁[Id]                 # Dynamic User Profile
│   │   ├── 📁recruiter_dashboard      # Recruiter Area
│   │   │   └── 📁[id]                 # Dynamic Dashboard
│   │   ├── 📁register-company         # Company Signup Page
│   │   ├── 📁signin                   # Login Page
│   │   ├── 📁signup                   # Signup Page
│   │   ├── 📁student_dashboard        # Student Area
│   │   │   └── 📁[id]                 # Dynamic Dashboard
│   │   │       └── 📁appliedInternship # List of applied jobs
│   │   ├── 📁terms_and_conditions     # Legal pages
│   │   ├── 📁verify-email             # Verification landing page
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout
│   │   ├── loading.tsx                # Loading state
│   │   └── page.tsx                   # Homepage
│   ├── 📁components                   # Reusable UI Components
│   │   ├── 📁profile                  # Profile Page Sections
│   │   │   ├── CodeforcesSection.tsx  # CP stats display
│   │   │   ├── ContactSection.tsx     # Contact info display
│   │   │   ├── ExperienceSection.tsx  # Work timeline
│   │   │   ├── GitHubSection.tsx      # GitHub repos/stats
│   │   │   ├── LeetCodeSection.tsx    # LeetCode stats
│   │   │   ├── LinkedInSection.tsx    # LinkedIn integration
│   │   │   ├── ProfileCard.tsx        # Main user card
│   │   │   ├── ProfileForm.tsx        # Edit profile form
│   │   │   ├── ProfileHeader.tsx      # Header with banner
│   │   │   ├── ProjectsSection.tsx    # Portfolio grid
│   │   │   ├── ResumeSection.tsx      # Resume view/upload
│   │   │   └── SkillsSection.tsx      # Skills badges
│   │   ├── 📁ui                       # Shadcn UI Library
│   │   │   ├── button.tsx             # Button component
│   │   │   ├── card.tsx               # Card component
│   │   │   ├── dialog.tsx             # Modal component
│   │   │   ├── input.tsx              # Input field
│   │   │   ├── label.tsx              # Label text
│   │   │   ├── select.tsx             # Dropdown menu
│   │   │   ├── sonner.tsx             # Toast notifications
│   │   │   ├── tabs.tsx               # Tabbed interface
│   │   │   └── textarea.tsx           # Text area input
│   │   ├── AddAboutButton.tsx         # Modal trigger: Edit About
│   │   ├── AddEducationButton.tsx     # Modal trigger: Add Edu
│   │   ├── AddExperienceButton.tsx    # Modal trigger: Add Exp
│   │   ├── AddProjectButton.tsx       # Modal trigger: Add Project
│   │   ├── AddSkillButton.tsx         # Modal trigger: Add Skill
│   │   ├── auth-provider.tsx          # NextAuth Provider
│   │   ├── CodeforcesButton.tsx       # Connect Codeforces
│   │   ├── CodeforcesDeleteButton.tsx # Disconnect Codeforces
│   │   ├── CompanyRecruiters.tsx      # Recruiter management list
│   │   ├── ContactButton.tsx          # Edit Contact Info
│   │   ├── DeleteEducationButton.tsx  # Remove Edu entry
│   │   ├── DeleteExperienceButton.tsx # Remove Exp entry
│   │   ├── DeleteProjectButton.tsx    # Remove Project
│   │   ├── DeleteResumeButton.tsx     # Remove Resume
│   │   ├── DeleteSkill.tsx            # Remove Skill
│   │   ├── EditGitHubLink.tsx         # Update GitHub URL
│   │   ├── EditLinkedInLink.tsx       # Update LinkedIn URL
│   │   ├── EditNameButton.tsx         # Update Display Name
│   │   ├── EditProjectButton.tsx      # Update Project details
│   │   ├── FileUpload.tsx             # Drag & Drop component
│   │   ├── GithubButton.tsx           # Connect GitHub
│   │   ├── GitHubDeleteButton.tsx     # Disconnect GitHub
│   │   ├── GitHubProjectButton.tsx    # Import from GitHub
│   │   ├── GoBackButton.tsx           # Navigation helper
│   │   ├── ImageManager.tsx           # Avatar upload/crop
│   │   ├── interview.tsx              # Interview scheduler
│   │   ├── Kairo_logo.jpg             # App Logo
│   │   ├── LeetCodeButton.tsx         # Connect LeetCode
│   │   ├── LeetCodeDeleteButton.tsx   # Disconnect LeetCode
│   │   ├── LinkedinButton.tsx         # Connect LinkedIn
│   │   ├── LinkedInDeleteButton.tsx   # Disconnect LinkedIn
│   │   ├── RecruiterDashboard.tsx     # Dashboard Main View
│   │   ├── Recruiter_PostInternshipModel.tsx # Post Job Modal
│   │   ├── UpdateInternship.tsx       # Edit Job Modal
│   │   └── UploadProfileForm.tsx      # Profile Setup Form
│   ├── 📁hooks                        # Custom React Hooks
│   ├── 📁lib                          # Utilities & Config
│   │   ├── auth.ts                    # Auth configuration
│   │   ├── codeforces_api.ts          # CP Platform helpers
│   │   ├── github_api.ts              # GitHub API helpers
│   │   ├── leetcode_api.ts            # LeetCode API helpers
│   │   ├── prisma.ts                  # Database client
│   │   └── utils.ts                   # CSS/General utils
│   ├── 📁prisma                       # DB Config
│   │   ├── 📁migrations               # SQL Migrations
│   │   └── schema.prisma              # Data Models
│   ├── 📁public                       # Static Assets
│   │   ├── 📁companies                # Partner Company Logos
│   │   ├── 📁homepage                 # Landing Page Assets
│   │   ├── placeholder-logo.png       # Fallback images
│   │   └── placeholder-user.jpg       # Default avatar
│   ├── 📁styles                       # CSS Files
│   │   └── globals.css                # Global styles
│   ├── middleware.ts                  # Route Protection
│   ├── next.config.mjs                # Next.js Config
│   ├── package.json                   # Dependencies
│   ├── postcss.config.mjs             # PostCSS Config
│   ├── tailwind.config.js             # Tailwind Config
│   └── tsconfig.json                  # TypeScript Config
└── .gitignore                         # Ignored files
```

<br/>
<br/>


## Frontend Setup

To run frontend
- move to frontend
```shell
cd ./frontend
``` 

- install dependencies
```shell
npm i
```

- setup .env file (format given below)
```text
NODE_ENV="development"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Connect to Supabase via connection pooling
DATABASE_URL=
# Direct connection to the database. Used for migrations
DIRECT_URL=

EMAIL_USER=
EMAIL_PASSWORD=
NEXT_PUBLIC_URL=http://localhost:3000
GITHUB_TOKEN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

UPLOADCARE_PUBLIC_KEY=
UPLOADCARE_SECRET_KEY=

LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
```

- generate a prisma client
```shell
npx prisma generate
```

- push the db tables generated to supabase
```shell
npx prisma db push
```

- start a local server at 3000 port
```shell
npm run dev
```

<br/>
<br/>

## Backend Setup

To run backend
- move to backend
```shell
cd ./backend
```

- create a venv
```shell
python3 -m venv .venv
```

- activate venv (Linux)
```shell
source .venv/bin/activate
```

- activate venv (Windows)
```shell
source .venv/Scripts/activate
```

- install dependecies
```shell
pip install -r requirements.txt
```

- start a local server at 8000 port
```shell
pyhton run.py
```

- after development to close the venv
```shell
deactivate
```


<br/>
<br/>

## Contributors
- Jevik Rakholiya - 202301276
- Shobhitchadra Chauhari - 202301403
- Dhyey Patel - 202301415
- Jiten Bharga - 202301466
- Visha Sitapara - 202301414
- Dhruv Jain - 202301272
- Rajan Chauhan - 202301427
- Jaimeen Chauhan - 202301467
- Patel Het Jitendrakumar - 202301421
