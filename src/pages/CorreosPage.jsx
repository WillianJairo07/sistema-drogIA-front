import { EmailAnalysisPanel } from "../features/correos/components/EmailAnalysisPanel";

export function CorreosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#17324c]">
          Análisis de Correos
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Analiza y clasifica las solicitudes recibidas mediante correo
          institucional.
        </p>
      </div>

      <EmailAnalysisPanel />
    </div>
  );
}