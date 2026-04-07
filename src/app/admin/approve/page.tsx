'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader2, Mail, User, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pendiente', color: '#f59e0b', icon: '⏳' },
  approved: { label: 'Aprobado', color: '#1daa52', icon: '✅' },
  rejected: { label: 'Rechazado', color: '#ef4444', icon: '❌' },
};

export default function AdminApprovePage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('pending');

  const fetchRequests = async () => {
    const res = await fetch('/api/admin/contacts');
    const data = await res.json();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchRequests();
  };

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Solicitudes de Acceso</h1>
        <p className="text-text-secondary text-sm mt-1">
          {requests.filter((r) => r.status === 'pending').length} solicitudes pendientes
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pendientes', count: requests.filter((r) => r.status === 'pending').length, color: '#f59e0b' },
          { label: 'Aprobadas', count: requests.filter((r) => r.status === 'approved').length, color: '#1daa52' },
          { label: 'Rechazadas', count: requests.filter((r) => r.status === 'rejected').length, color: '#ef4444' },
        ].map((item) => (
          <div key={item.label} className="card text-center">
            <p className="text-2xl font-bold mb-1" style={{ color: item.color }}>{item.count}</p>
            <p className="text-xs text-text-muted">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { key: 'pending', label: 'Pendientes' },
          { key: 'approved', label: 'Aprobadas' },
          { key: 'rejected', label: 'Rechazadas' },
          { key: 'all', label: 'Todas' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/50'
                : 'text-text-muted hover:text-text-secondary bg-surface-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests list */}
      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card py-14 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-text-muted">Sin solicitudes en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const config = statusConfig[req.status];
            return (
              <div key={req.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-text-muted" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-text-primary">{req.name}</p>
                          <span
                            className="badge text-xs"
                            style={{
                              color: config.color,
                              background: `${config.color}15`,
                              borderColor: `${config.color}30`,
                            }}
                          >
                            {config.icon} {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${req.email}`} className="text-brand-400 hover:underline">{req.email}</a>
                          <span>·</span>
                          <span>{formatDate(req.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-start p-3 bg-surface-muted rounded-xl">
                      <MessageSquare className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-text-secondary leading-relaxed">{req.message}</p>
                    </div>
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateStatus(req.id, 'approved')}
                        className="btn-primary btn-sm gap-1.5"
                        id={`approve-${req.id}`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Aprobar
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, 'rejected')}
                        className="btn-danger btn-sm gap-1.5"
                        id={`reject-${req.id}`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
