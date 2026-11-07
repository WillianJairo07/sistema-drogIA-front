import { EmailAnalysisPanel } from "../features/correos/components/EmailAnalysisPanel";
import "../styles/correos.css";

export function CorreosPage() {
  return (
    <div className="correos-container">
      <div className="correos-header-wrapper">
        <div>
          <h2 className="correos-header-title">
            Análisis de Correos
          </h2>

          <p className="correos-header-subtitle">
            Analiza y clasifica las solicitudes recibidas mediante correo institucional.
          </p>
        </div>
      </div>

      <EmailAnalysisPanel />
    </div>
  );
}