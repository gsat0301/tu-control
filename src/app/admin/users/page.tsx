'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Loader2, UserCheck, UserX, Star, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'user']),
  isPremium: z.boolean(),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
  _count: { portfolios: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'user', isPremium: false },
  });

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchUsers();
  };

  const togglePremium = async (id: string, isPremium: boolean) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPremium: !isPremium }),
    });
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    if (!confirm('¿Eliminar este usuario? Esta acción es irreversible.')) return;
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const onSubmit = async (data: CreateUserForm) => {
    setCreating(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setShowForm(false);
        reset();
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error ?? 'Error al crear usuario');
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gestión de Usuarios</h1>
          <p className="text-text-secondary text-sm mt-1">{users.length} usuarios registrados</p>
        </div>
        <button
          id="create-user-btn"
          onClick={() => setShowForm(true)}
          className="btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Create user modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">Crear Usuario</h2>
              <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5" id="close-user-modal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Nombre</label>
                <input type="text" className={`input ${errors.name ? 'input-error' : ''}`} {...register('name')} />
                {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className={`input ${errors.email ? 'input-error' : ''}`} {...register('email')} />
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
              </div>
              <div>
                <label className="label">Contraseña temporal</label>
                <input type="text" className={`input font-mono ${errors.password ? 'input-error' : ''}`}
                  placeholder="Mínimo 8 caracteres" {...register('password')} />
                {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Rol</label>
                  <select className="input" {...register('role')}>
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('isPremium')} className="w-4 h-4 accent-brand-500" />
                    <span className="text-sm text-text-secondary">Marcar como Premium ⭐</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">
                  Cancelar
                </button>
                <button type="submit" id="submit-user" disabled={creating} className="btn-primary flex-1 justify-center">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
          </div>
        ) : (
          <div className="table-container border-0 rounded-none">
            <table className="table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Portafolios</th>
                  <th>Registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-brand-400">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-text-primary">{user.name}</p>
                            {user.isPremium && <span className="text-xs text-yellow-400">⭐</span>}
                          </div>
                          <p className="text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={user.role === 'admin' ? 'badge-admin' : 'badge bg-surface-muted text-text-secondary'}>
                        {user.role === 'admin' ? '🛡️ Admin' : '👤 Usuario'}
                      </span>
                    </td>
                    <td className="text-text-secondary">{user._count.portfolios}</td>
                    <td className="text-text-secondary text-xs">{formatDate(user.createdAt)}</td>
                    <td>
                      <span className={`badge ${user.isActive ? 'badge-income' : 'badge-expense'}`}>
                        {user.isActive ? '● Activo' : '● Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleActive(user.id, user.isActive)}
                          className={`btn-ghost p-1.5 text-xs ${user.isActive ? 'hover:text-red-400' : 'hover:text-brand-400'}`}
                          title={user.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {user.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => togglePremium(user.id, user.isPremium)}
                          className="btn-ghost p-1.5 hover:text-yellow-400"
                          title="Toggle Premium"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="btn-ghost p-1.5 hover:text-red-400"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
