'use client';
import api from '@/lib/api';
import { LEAD_STATUSES } from '@/lib/lead-statuses';
import { Lead } from '@/types/lead';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const LIMIT = 10;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchLeads = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await api.get('/leads', {
          params: {
            page,
            limit: LIMIT,
            search: search || undefined,
            status: status || undefined,
          },
          signal: controller.signal,
        });
        setLeads(data.data);
        setTotal(data.total);
      } catch (err: any) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        setError(err.response?.data?.message || err.message || 'Failed to load leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
    return () => controller.abort();
  }, [page, search, status]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / LIMIT)), [total]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-sm text-slate-600 mt-1">Search, filter and manage your leads.</p>
        </div>
        <Link
          href="/leads/create"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add Lead
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto] mb-6">
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, company"
            className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {LEAD_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="text-right text-sm text-slate-500">
          Showing page {page} of {totalPages}. Total leads: {total}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-600">Loading leads...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-700">{error}</div>
        ) : leads.length === 0 ? (
          <div className="p-10 text-center text-slate-600">
            No leads found. Change your search or filter and try again.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-700">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:underline">
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{lead.company || '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{lead.email || '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{lead.status}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {lead.value ? `$${lead.value}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && !loading && !error && leads.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPage(index + 1)}
              disabled={page === index + 1}
              className="rounded-md border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
