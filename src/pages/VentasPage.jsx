import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { SaleList } from "../features/ventas/components/SaleList";
import { SaleDetail } from "../features/ventas/components/SaleDetail";

export function VentasPage() {
  const {
    sales,
    onStatusChange,
  } = useOutletContext();

  const [selectedSale, setSelectedSale] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#17324c]">
          Gestión de Ventas
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Consulta y controla las ventas generadas desde las cotizaciones aceptadas.
        </p>
      </div>

      {selectedSale ? (
        <SaleDetail
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
          onStatusChange={(saleId, status) => {
            onStatusChange(saleId, status);

            setSelectedSale((currentSale) =>
              currentSale
                ? { ...currentSale, status }
                : currentSale
            );
          }}
        />
      ) : (
        <SaleList
          sales={sales}
          onSelect={setSelectedSale}
        />
      )}
    </div>
  );
}