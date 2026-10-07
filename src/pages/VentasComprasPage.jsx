import { useOutletContext } from "react-router-dom";

import { MissingItemsPanel } from "../features/ventasCompras/components/MissingItemsPanel";

export function VentasComprasPage() {
  const {
    missingItems,
    onMissingItemStatusChange,
  } = useOutletContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#17324c]">
          Panel Ventas-Compras
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Consulta y gestiona los productos que presentan faltantes de stock.
        </p>
      </div>

      <MissingItemsPanel
        items={missingItems}
        onStatusChange={onMissingItemStatusChange}
      />
    </div>
  );
}