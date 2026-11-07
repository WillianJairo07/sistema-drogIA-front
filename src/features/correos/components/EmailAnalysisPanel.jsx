import { useState } from "react";


const initialEmails = [
  {
    id: 1,
    sender: "compras@rodriguez.com",
    subject: "Solicitud de cotización, productos médicos",
    date: "06/10/2026",
    status: "Pendiente",
    area: "Ventas",
  },
  {
    id: 2,
    sender: "contacto@saludperu.com",
    subject: "Solicitud de productos farmaceuticos",
    date: "06/10/2026",
    status: "Analizado",
    area: "Ventas",
  },
  {
    id: 3,
    sender: "logistica@farmaciasur.com",
    subject: "Consulta de disponibilidad de productos",
    date: "05/10/2026",
    status: "Revisión manual",
    area: "Compras",
  },
];

export function EmailAnalysisPanel() {
  const [emails, setEmails] = useState(initialEmails);

  // Función para cambiar el estado del correo a "Analizado"
  const handleAnalyze = (id) => {
    setEmails((currentEmails) =>
      currentEmails.map((email) =>
        email.id === id
          ? { ...email, status: "Analizado" }
          : email
      )
    );
  };

  return (
    <div className="correos-card">
      <div className="correos-card-header">
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#17324c", margin: 0 }}>
          Correos recibidos
        </h3>

        <p className="correos-header-subtitle">
          Revisa y analiza las solicitudes recibidas por correo.
        </p>
      </div>

      <div className="correos-table-wrapper">
        <table className="correos-table">
          <thead>
            <tr>
              <th>Remitente</th>
              <th>Asunto</th>
              <th className="hidden md:table-cell">Fecha</th>
              <th className="hidden lg:table-cell">Área</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {emails.length > 0 ? (
              emails.map((email) => (
                <tr key={email.id}>
                  {/* Remitente con texto truncado si es muy largo */}
                  <td>
                    <div className="correos-truncate-sender" title={email.sender}>
                      {email.sender}
                    </div>
                  </td>

                  {/* Asunto con texto truncado */}
                  <td>
                    <div className="correos-truncate-subject" title={email.subject}>
                      {email.subject}
                    </div>
                  </td>

                  {/* Fecha (Oculta en móviles por diseño responsivo) */}
                  <td style={{ color: "#64748b" }} className="hidden md:table-cell">
                    {email.date}
                  </td>

                  {/* Área (Oculta en pantallas pequeñas) */}
                  <td style={{ color: "#64748b" }} className="hidden lg:table-cell">
                    {email.area}
                  </td>

                  {/* Estado con Badge dinámico */}
                  <td>
                    <span
                      className={`badge-correo ${
                        email.status === "Pendiente"
                          ? "badge-correo-pendiente"
                          : email.status === "Analizado"
                          ? "badge-correo-analizado"
                          : "badge-correo-revision"
                      }`}
                    >
                      {email.status}
                    </span>
                  </td>

                  {/* Acciones según el estado del correo */}
                  <td style={{ textAlign: "right" }}>
                    {email.status === "Pendiente" && (
                      <button
                        type="button"
                        onClick={() => handleAnalyze(email.id)}
                        className="correos-btn-primary"
                      >
                        Analizar
                      </button>
                    )}

                    {email.status === "Analizado" && (
                      <span className="correos-text-procesado">
                        Procesado
                      </span>
                    )}

                    {email.status === "Revisión manual" && (
                      <span className="correos-text-requiere-revision">
                        Requiere revisión
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#64748b", padding: "32px" }}>
                  No hay correos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}