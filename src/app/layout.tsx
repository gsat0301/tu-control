import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'tuControl — Gestión Financiera Personal',
    template: '%s | tuControl',
  },
  description: 'Controla tus gastos, ingresos y ahorros de forma inteligente con tuControl. Portafolios personalizados, gráficos avanzados y exportación a PDF y Excel.',
  keywords: ['finanzas personales', 'control de gastos', 'presupuesto', 'ahorros', 'gestión financiera'],
  openGraph: {
    title: 'tuControl — Gestión Financiera Personal',
    description: 'Controla tus finanzas con portafolios inteligentes',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
