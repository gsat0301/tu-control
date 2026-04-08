'use client';

import { useState } from 'react';
import { FileDown, FileSpreadsheet, Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ReportsPage() {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [generatingExcel, setGeneratingExcel] = useState(false);

  const exportPDF = async () => {
    setGeneratingPdf(true);
    try {
      const { jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const element = document.getElementById('report-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f1117',
        scale: 2,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`tuControl-reporte-${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('Error al generar el PDF. Intenta de nuevo.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const exportExcel = async () => {
    setGeneratingExcel(true);
    try {
      const res = await fetch('/api/transactions?limit=1000');
      const transactions = await res.json();

      const { utils, writeFile } = await import('xlsx');

      const data = transactions.map((tx: any) => ({
        'Descripción': tx.description,
        'Tipo': tx.type === 'expense' ? 'Gasto' : tx.type === 'income' ? 'Ingreso' : 'Ahorro',
        'Categoría': tx.category,
        'Portafolio': tx.portfolio?.name ?? '',
        'Fecha': new Date(tx.date).toLocaleDateString('es-ES'),
        'Monto': tx.amount,
      }));

      const ws = utils.json_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Transacciones');

      writeFile(wb, `tuControl-transacciones-${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.xlsx`);
    } catch (err) {
      console.error('Error generando Excel:', err);
      alert('Error al generar el Excel.');
    } finally {
      setGeneratingExcel(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Reportes</h1>
        <p className="text-text-secondary text-sm mt-1">
          Exporta tus datos financieros en PDF o Excel
        </p>
      </div>

      {/* Export buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="card-hover text-center p-8" onClick={exportPDF}>
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <FileDown className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Exportar PDF</h3>
          <p className="text-text-muted text-sm mb-6">
            Genera un reporte visual de tus finanzas con gráficos y métricas
          </p>
          <button
            id="export-pdf-btn"
            onClick={(e) => { e.stopPropagation(); exportPDF(); }}
            disabled={generatingPdf}
            className="btn-danger w-full justify-center"
          >
            {generatingPdf ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generando PDF...</>
            ) : (
              <><FileDown className="w-4 h-4" /> Descargar PDF</>
            )}
          </button>
        </div>

        <div className="card-hover text-center p-8" onClick={exportExcel}>
          <div className="w-16 h-16 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mx-auto mb-4">
            <FileSpreadsheet className="w-8 h-8 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Exportar Excel</h3>
          <p className="text-text-muted text-sm mb-6">
            Descarga todas tus transacciones en formato .xlsx para análisis adicional
          </p>
          <button
            id="export-excel-btn"
            onClick={(e) => { e.stopPropagation(); exportExcel(); }}
            disabled={generatingExcel}
            className="btn-primary w-full justify-center"
          >
            {generatingExcel ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generando Excel...</>
            ) : (
              <><FileSpreadsheet className="w-4 h-4" /> Descargar Excel</>
            )}
          </button>
        </div>
      </div>

      {/* Report content to capture for PDF */}
      <div id="report-content" className="space-y-4 p-6 bg-surface rounded-2xl border border-surface-border">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              tu<span className="text-brand-400">Control</span> — Reporte Financiero
            </h2>
            <p className="text-text-muted text-sm">
              Generado el {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <p className="text-text-secondary text-sm">
          Para ver el contenido completo del reporte, navega a tus portafolios y luego exporta el PDF desde esta página.
          El reporte capturará el contenido visible en pantalla.
        </p>
      </div>
    </div>
  );
}
