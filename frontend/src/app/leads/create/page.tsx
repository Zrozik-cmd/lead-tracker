'use client';
import api from '@/lib/api';
import { LEAD_STATUSES, isValidEmail } from '@/lib/lead-statuses';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const initialForm = {
  name: '',
  email: '',
  company: '',
  status: 'NEW',
  value: '',
  notes: '',
};

export default function CreateLeadPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (form.email && !isValidEmail(form.email.trim()))
      nextErrors.email = 'Please enter a valid email';
    return nextErrors;
  };

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setServerError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    setServerError(null);

    try {
      await api.post('/leads', {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        company: form.company.trim() || undefined,
        status: form.status,
        value: form.value ? Number(form.value) : undefined,
        notes: form.notes.trim() || undefined,
      });
      router.push('/leads');
    } catch (err: any) {
      setServerError(err.response?.data?.message || err.message || 'Failed to create lead');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Lead</h1>
          <p className="text-sm text-slate-600">Add a new lead and return to the list.</p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/leads')}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          Back to leads
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Name *
            <input
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Email
            <input
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Company
            <input
              value={form.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Status
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {LEAD_STATUSES.filter((option) => option.value).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Value
            <input
              type="number"
              value={form.value}
              onChange={(e) => handleChange('value', e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Notes
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>
        </div>

        {serverError ? <div className="text-sm text-red-600">{serverError}</div> : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Only name is required. All other fields are optional.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Lead'}
          </button>
        </div>
      </form>
    </div>
  );
}
