'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet, User, Mail, MessageSquare, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  message: z.string().min(20, 'El mensaje debe tener al menos 20 caracteres'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Error al enviar');
      }

      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error inesperado');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="glass border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">
              tu<span className="text-brand-400">Control</span>
            </span>
          </Link>
          <Link href="/" className="btn-ghost text-sm gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-text-primary mb-3">
              Solicitar <span className="gradient-text">Acceso</span>
            </h1>
            <p className="text-text-secondary text-lg">
              Llena el formulario. Revisaré tu solicitud y te enviaré las credenciales en menos de 24 horas.
            </p>
          </div>

          {status === 'success' ? (
            <div className="card border-brand-500/30 glow-brand-sm text-center p-12 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-brand-400" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">¡Solicitud enviada!</h2>
              <p className="text-text-secondary mb-6">
                Recibí tu mensaje. Te contactaré en menos de 24 horas con tus credenciales de acceso.
              </p>
              <Link href="/" className="btn-primary">
                Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="card">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {status === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="label">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      id="name"
                      type="text"
                      placeholder="Tu nombre"
                      className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                      {...register('name')}
                    />
                  </div>
                  {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" className="label">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="tu@email.com"
                      className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="label">¿Por qué quieres acceso?</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-text-muted" />
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Cuéntame un poco sobre ti y cómo usarás la app..."
                      className={`input pl-10 resize-none ${errors.message ? 'input-error' : ''}`}
                      {...register('message')}
                    />
                  </div>
                  {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full justify-center btn-lg"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Solicitud'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-surface-border">
                <p className="text-xs text-text-muted text-center">
                  Ya tienes acceso?{' '}
                  <Link href="/login" className="text-brand-400 hover:text-brand-300 transition-colors">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
