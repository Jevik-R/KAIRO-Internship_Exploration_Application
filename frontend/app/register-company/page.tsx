"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterCompanyPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    industry: "",
    website: "",
    password: "",
    establishedYear: "",
    companySize: "",
    location: "",
    overview: "",
  });

  // Handle input change
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null);

    try {
      const res = await fetch("/api/auth/registerCompany", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setResponseMessage({ ok: false, msg: data.error });
        return;
      }

      setResponseMessage({
        ok: true,
        msg: `Registration Successful! Login ID: ${data.loginId}`,
      });

    } catch (err) {
      setResponseMessage({ ok: false, msg: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Register Company</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" label="Company Name" value={form.name} onChange={handleChange} required />
        <Input name="industry" label="Industry" value={form.industry} onChange={handleChange} required />
        <Input name="website" label="Website" value={form.website} onChange={handleChange} required />
        <Input name="establishedYear" label="Established Year" type="number" value={form.establishedYear} onChange={handleChange} required />
        <Input name="companySize" label="Company Size" value={form.companySize} onChange={handleChange} required />
        <Input name="location" label="Location" value={form.location} onChange={handleChange} required />

        <div>
          <label className="block text-sm font-medium mb-1">Overview</label>
          <textarea
            required
            name="overview"
            value={form.overview}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Overview of the company"
          />
        </div>

        <Input name="password" type="password" label="Password" value={form.password} onChange={handleChange} required />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          {loading ? "Registering..." : "Register Company"}
        </button>
      </form>

      {responseMessage && (
        <div className={`mt-4 p-3 rounded ${responseMessage.ok ? "bg-green-200" : "bg-red-200"}`}>
          {responseMessage.msg}
        </div>
      )}
    </main>
  );
}

// Reusable input component
function Input({ label, name, value, type = "text", onChange, ...rest }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
        {...rest}
      />
    </div>
  );
}
