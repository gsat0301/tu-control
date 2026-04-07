import Link from 'next/link';
import {
  TrendingUp,
  PieChart,
  FileDown,
  Shield,
  Wallet,
  BarChart2,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ===== NAVBAR ===== */}
      <nav className="glass sticky top-0 z-40 border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary">
                tu<span className="text-brand-400">Control</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="btn-ghost text-sm hidden sm:flex">
                Contacto
              </Link>
              <Link href="/login" className="btn-primary btn-sm">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-600/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/25 text-brand-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" />
              Gestión financiera inteligente — $0/mes
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-text-primary leading-tight mb-6">
              Toma el{' '}
              <span className="gradient-text">control total</span>
              {' '}de tus finanzas
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed mb-10 max-w-2xl mx-auto">
              Organiza gastos, ingresos y ahorros en portafolios personalizados.
              Visualiza tu dinero con gráficos profesionales y exporta reportes en PDF y Excel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary btn-lg gap-2">
                Solicitar Acceso
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="btn-secondary btn-lg">
                Ver Características
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-10 text-text-muted text-sm">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-brand-500" />
                Datos seguros con HTTPS
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-brand-500" />
                Acceso verificado
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-brand-500" />
                100% gratuito
              </span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="card border-brand-500/20 p-6 glow-brand-sm animate-slide-up">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-brand-500" />
                <span className="ml-2 text-text-muted text-xs font-mono">tucontrol.app/dashboard</span>
              </div>

              {/* Mock dashboard */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Balance Total', value: '$3,250.00', color: '#1daa52', icon: '💰' },
                  { label: 'Ingresos', value: '$5,000.00', color: '#1daa52', icon: '📈' },
                  { label: 'Gastos', value: '$1,250.00', color: '#ef4444', icon: '📉' },
                  { label: 'Ahorros', value: '$500.00', color: '#f59e0b', icon: '🏦' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surface-card rounded-xl p-4 border border-surface-border">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-surface-card rounded-xl p-4 border border-surface-border h-32 flex items-center justify-center">
                  <div className="flex gap-2 items-end h-16">
                    {[60, 80, 45, 90, 70, 85, 55].map((h, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-6 rounded-t-sm transition-all duration-500"
                          style={{ height: `${h}%`, background: i % 2 === 0 ? '#1daa52' : '#ef4444', opacity: 0.8 }}
                        />
                      </div>
                    ))}
                  </div>
                  <span className="ml-4 text-text-muted text-xs">Ingresos vs Gastos</span>
                </div>
                <div className="bg-surface-card rounded-xl p-4 border border-surface-border h-32 flex items-center justify-center">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 80 80" className="transform -rotate-90">
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#1e2535" strokeWidth="10" />
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#1daa52" strokeWidth="10"
                        strokeDasharray={`${0.65 * 188.5} ${188.5}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-brand-400">65%</span>
                  </div>
                  <span className="ml-3 text-xs text-text-muted">Presupuesto<br />utilizado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Todo lo que necesitas para <span className="gradient-text">controlar tu dinero</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Una plataforma completa diseñada para que tomes decisiones financieras inteligentes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card-hover group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}40` }}>
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING / DONACION ===== */}
      <section className="py-24 border-t border-surface-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Simple y <span className="gradient-text">transparente</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plan Gratuito */}
            <div className="card">
              <div className="mb-6">
                <div className="text-sm text-text-muted font-medium mb-1">PLAN GRATUITO</div>
                <div className="text-4xl font-bold text-text-primary">$0</div>
                <div className="text-text-secondary text-sm mt-1">/mes, para siempre</div>
              </div>
              <ul className="space-y-3 mb-8">
                {freePlanFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn-secondary w-full justify-center">
                Solicitar Acceso
              </Link>
            </div>

            {/* Premium via donación */}
            <div className="card border-brand-500/30 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="badge bg-brand-500/20 text-brand-400 border-brand-500/30 text-xs">
                  ⭐ Sin anuncios
                </span>
              </div>
              <div className="mb-6">
                <div className="text-sm text-brand-400 font-medium mb-1">CON DONACIÓN</div>
                <div className="text-4xl font-bold gradient-text">Sin anuncios</div>
                <div className="text-text-secondary text-sm mt-1">donación única de apoyo</div>
              </div>
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="https://ko-fi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center"
              >
                Donar en Ko-fi ☕
              </a>
              <p className="text-xs text-text-muted text-center mt-3">
                Dona → Contáctame → Activo tu acceso premium
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 border-t border-surface-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="card border-brand-500/20 glow-brand-sm p-12">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              ¿Listo para tomar el control?
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Solicita tu acceso hoy. Verificamos tu solicitud y te enviamos las credenciales.
            </p>
            <Link href="/contact" className="btn-primary btn-lg">
              Solicitar Acceso Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-surface-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-brand flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-text-secondary">
                tu<span className="text-brand-400">Control</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-text-muted">
              <Link href="/contact" className="hover:text-text-secondary transition-colors">Contacto</Link>
              <Link href="/login" className="hover:text-text-secondary transition-colors">Iniciar Sesión</Link>
              <span>© 2024 tuControl</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Wallet,
    title: 'Portafolios Personalizados',
    description: 'Crea portafolios separados: Personal, Negocio, Pareja, Vacaciones. Cada uno con sus propias métricas.',
    color: '#1daa52',
  },
  {
    icon: BarChart2,
    title: 'Gráficos Profesionales',
    description: 'Visualiza tus finanzas con gráficos de dona, barras, línea y gauge. Todo en tiempo real.',
    color: '#3b82f6',
  },
  {
    icon: TrendingUp,
    title: 'Control de Ahorros',
    description: 'Registra y visualiza la evolución de tus ahorros con gráficos de tendencia mensual.',
    color: '#f59e0b',
  },
  {
    icon: FileDown,
    title: 'Exportación PDF y Excel',
    description: 'Genera reportes profesionales en PDF o exporta tus datos a Excel con un solo clic.',
    color: '#8b5cf6',
  },
  {
    icon: PieChart,
    title: 'Categorías Personalizadas',
    description: 'Crea categorías con iconos y colores. Filtra y busca transacciones fácilmente.',
    color: '#ec4899',
  },
  {
    icon: Shield,
    title: 'Seguridad Total',
    description: 'Acceso verificado manualmente. HTTPS, contraseñas cifradas, sesiones seguras con JWT.',
    color: '#06b6d4',
  },
];

const freePlanFeatures = [
  'Portafolios ilimitados',
  'Transacciones ilimitadas',
  'Gráficos y métricas avanzadas',
  'Exportación PDF y Excel',
  'Categorías personalizadas',
  'Anuncios discretos',
];

const premiumFeatures = [
  'Todo lo del plan gratuito',
  'Sin anuncios',
  'Badge premium en tu perfil',
  'Apoyas el desarrollo',
  'Acceso prioritario a nuevas features',
];
