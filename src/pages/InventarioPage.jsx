import { InventoryList } from "../features/inventario/components/InventoryList";

export function InventarioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#17324c]">
          Gestión de Inventario
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Consulta y controla el stock de los productos registrados.
        </p>
      </div>

      <InventoryList />
    </div>
  );
}