import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { SaleList } from "../features/ventas/components/SaleList";
import { SaleDetail } from "../features/ventas/components/SaleDetail";
import "../styles/ventas.css";

export function VentasPage() {
  const { sales, onSaleStatusChange } = useOutletContext();
  const [selectedSale, setSelectedSale] = useState(null);

  const handleSaleStatusChange = (saleId, status) => {
    onSaleStatusChange(saleId, status);

    setSelectedSale((currentSale) =>
      currentSale ? { ...currentSale, status } : currentSale
    );
  };

  return (
    <div className="ventas-container">
      <div className="ventas-header-wrapper">
        <div>
          <h2 className="ventas-header-title">Gestión de Ventas</h2>
          <p className="ventas-header-subtitle">
            Consulta y controla las ventas generadas desde las cotizaciones aceptadas.
          </p>
        </div>
      </div>

      {selectedSale ? (
        <SaleDetail
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
          onStatusChange={handleSaleStatusChange}
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