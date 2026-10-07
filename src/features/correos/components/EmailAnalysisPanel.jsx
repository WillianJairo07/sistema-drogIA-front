import { useState } from "react";

const initialEmails = [
  {
    id: 1,
    sender: "compras@rodriguez.com",
    subject: "Solicitud de cotización - productos médicos",
    date: "06/10/2026",
    status: "Pendiente",
    area: "Ventas",
  },
  {
    id: 2,
    sender: "contacto@saludperu.com",
    subject: "Solicitud de productos de limpieza",
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-[#17324c]">
          Correos recibidos
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Revisa y analiza las solicitudes recibidas por correo.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-medium sm:px-6">
                Remitente
              </th>

              <th className="px-4 py-3 font-medium sm:px-6">
                Asunto
              </th>

              <th className="hidden whitespace-nowrap px-6 py-3 font-medium md:table-cell">
                Fecha
              </th>

              <th className="hidden px-6 py-3 font-medium lg:table-cell">
                Área
              </th>

              <th className="w-32 whitespace-nowrap px-4 py-3 font-medium sm:px-6">
                Estado
              </th>

              <th className="w-36 whitespace-nowrap px-4 py-3 text-right font-medium sm:px-6">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {emails.map((email) => (
              <tr key={email.id} className="border-t border-slate-200">
                <td className="max-w-[180px] truncate px-4 py-4 font-medium text-slate-700 sm:px-6">
                  {email.sender}
                </td>

                <td className="max-w-[260px] truncate px-4 py-4 text-slate-600 sm:px-6">
                  {email.subject}
                </td>

                <td className="hidden whitespace-nowrap px-6 py-4 text-slate-500 md:table-cell">
                  {email.date}
                </td>

                <td className="hidden px-6 py-4 text-slate-600 lg:table-cell">
                  {email.area}
                </td>

                <td className="w-32 whitespace-nowrap px-4 py-4 sm:px-6">
                  <span
                    className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                      email.status === "Pendiente"
                        ? "bg-amber-100 text-amber-700"
                        : email.status === "Analizado"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {email.status}
                  </span>
                </td>

                <td className="w-36 whitespace-nowrap px-4 py-4 text-right sm:px-6">
                  {email.status === "Pendiente" && (
                    <button
                      type="button"
                      onClick={() => handleAnalyze(email.id)}
                      className="whitespace-nowrap rounded-lg bg-[#17324c] px-3 py-2 text-xs font-medium text-white hover:bg-[#234968]"
                    >
                      Analizar
                    </button>
                  )}

                  {email.status === "Analizado" && (
                    <span className="whitespace-nowrap text-xs text-emerald-600">
                      Procesado
                    </span>
                  )}

                  {email.status === "Revisión manual" && (
                    <span className="whitespace-nowrap text-xs text-red-600">
                      Requiere revisión
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}