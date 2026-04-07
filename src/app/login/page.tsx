'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email o contraseña incorrectos. Verifica tus credenciales.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 border-r border-surface-border relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-brand-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-brand-600/6 rounded-full blur-3xl" />
        </div>

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center glow-brand-sm">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-text-primary">
            tu<span className="text-brand-400">Control</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-6">
          <blockquote className="space-y-3">
            <p className="text-2xl font-semibold text-text-primary leading-relaxed">
              "El primer paso para controlar tu dinero es saber en dónde está."
            </p>
            <footer className="text-text-muted">— Principio de finanzas personales</footer>
          </blockquote>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Portafolios', value: 'Ilimitados', icon: '💼' },
              { label: 'Transacciones', value: 'Ilimitadas', icon: '💳' },
              { label: 'Exportación', value: 'PDF + Excel', icon: '📊' },
              { label: 'Seguridad', value: '100% cifrado', icon: '🔐' },
            ].map((item) => (
              <div key={item.label} className="card p-4">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-sm font-semibold text-text-primary">{item.value}</div>
                <div className="text-xs text-text-muted">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-text-muted relative z-10">
          © 2024 tuControl · Gestión financiera personal
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-text-primary">
            tu<span className="text-brand-400">Control</span>
          </span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-text-secondary">
              Inicia sesión para controlar tus finanzas
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`input pl-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center btn-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-border text-center">
            <p className="text-text-muted text-sm">
              ¿No tienes acceso?{' '}
              <Link href="/contact" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Solicitar acceso
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
