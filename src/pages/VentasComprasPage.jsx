
import { useOutletContext } from "react-router-dom";

import { PurchaseRequestsPanel } from "../features/ventasCompras/components/PurchaseRequestsPanel";

export function VentasComprasPage() {
  const { purchaseRequests } = useOutletContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#17324c]">
          Panel Ventas-Compras
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Consulta las solicitudes de compra generadas desde las ventas.
        </p>
      </div>

      <PurchaseRequestsPanel
        items={purchaseRequests}
      />
    </div>
  );
}
