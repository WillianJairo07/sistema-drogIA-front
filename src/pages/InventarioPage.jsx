import { useOutletContext } from "react-router-dom";

import { InventoryList } from "../features/inventario/components/InventoryList";

export function InventarioPage() {
  const { inventory } = useOutletContext();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Gestión de Inventario
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Controla las existencias, lotes y fechas de vencimiento de los productos.
        </p>
      </div>

      <InventoryList inventory={inventory} />
    </div>
  );
}