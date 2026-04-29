'use client';
import api from '@/lib/api';
import { LEAD_STATUSES, isValidEmail } from '@/lib/lead-statuses';
import { Lead } from '@/types/lead';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [comments, setComments] = useState<Lead['comments']>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    status: 'NEW',
    value: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    const fetchLead = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await api.get(`/leads/${id}`);
        setLead(data);
        setForm({
          name: data.name || '',
          email: data.email || '',
          company: data.company || '',
          status: data.status || 'NEW',
          value: data.value?.toString() || '',
          notes: data.notes || '',
        });
        setComments(data.comments || []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load lead');
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (form.email && !isValidEmail(form.email.trim())) errors.email = 'Please enter a valid email';
    return errors;
  };

  const handleFormChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: '' }));
  };

  const saveLead = async () => {
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    if (!id) return;
    setSaving(true);
    setError(null);

    try {
      const { data } = await api.patch(`/leads/${id}`, {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        company: form.company.trim() || undefined,
        status: form.status,
        value: form.value ? Number(form.value) : undefined,
        notes: form.notes.trim() || undefined,
      });
      setLead(data);
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const removeLead = async () => {
    if (!id) return;
    if (!confirm('Delete this lead? This action cannot be undone.')) return;
    setDeleteLoading(true);
    setError(null);

    try {
      await api.delete(`/leads/${id}`);
      router.push('/leads');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete lead');
    } finally {
      setDeleteLoading(false);
    }
  };

  const addComment = async () => {
    setCommentError(null);
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    if (!id) return;

    try {
      await api.post(`/leads/${id}/comments`, { text: newComment.trim() });
      const { data } = await api.get(`/leads/${id}`);
      setComments(data.comments || []);
      setNewComment('');
    } catch (err: any) {
      setCommentError(err.response?.data?.message || err.message || 'Failed to add comment');
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6 text-slate-600">Loading lead...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-6 text-red-700">{error}</div>;
  }

  if (!lead) {
    return <div className="max-w-4xl mx-auto p-6 text-slate-600">Lead not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{lead.name}</h1>
          <p className="text-sm text-slate-600">Lead details, comments and inline editing.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {editing ? 'Cancel edit' : 'Edit lead'}
          </button>
          <button
            type="button"
            onClick={removeLead}
            disabled={deleteLoading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {deleteLoading ? 'Deleting...' : 'Delete lead'}
          </button>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Company</p>
            <p className="mt-1 text-base text-slate-900">{lead.company || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-1 text-base text-slate-900">{lead.email || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-1 text-base text-slate-900">{lead.status}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Value</p>
            <p className="mt-1 text-base text-slate-900">
              {lead.value ? `$${lead.value}` : 'Not provided'}
            </p>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-sm text-slate-500">Notes</p>
          <p className="mt-2 whitespace-pre-wrap text-slate-700">{lead.notes || 'No notes yet'}</p>
        </div>
      </section>

      {editing && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Edit lead</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Name *
              <input
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              {formErrors.name ? <p className="text-sm text-red-600">{formErrors.name}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Email
              <input
                value={form.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              {formErrors.email ? <p className="text-sm text-red-600">{formErrors.email}</p> : null}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Company
              <input
                value={form.company}
                onChange={(e) => handleFormChange('company', e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Status
              <select
                value={form.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
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

          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Value
              <input
                type="number"
                value={form.value}
                onChange={(e) => handleFormChange('value', e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Notes
              <textarea
                value={form.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                rows={4}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">Name is required. Other fields are optional.</p>
            <button
              type="button"
              onClick={saveLead}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Comments</h2>
            <p className="text-sm text-slate-500">Leave feedback or add context for this lead.</p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={addComment}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add comment
            </button>
          </div>
          {commentError ? <p className="text-sm text-red-600">{commentError}</p> : null}
        </div>

        <div className="mt-5">
          {commentsLoading ? (
            <p className="text-slate-600">Loading comments...</p>
          ) : comments?.length === 0 ? (
            <p className="text-slate-600">No comments yet. Add the first comment.</p>
          ) : (
            <div className="space-y-3">
              {comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800"
                >
                  <p>{comment.text}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
