import { useOutletContext } from "react-router-dom";
import { InventoryList } from "../features/inventario/components/InventoryList";
import "../styles/inventario.css";

export function InventarioPage() {
  const { inventory } = useOutletContext();

  return (
    <div className="inventario-container">
      <div className="inventario-header-wrapper">
        <div>
          <h1 className="inventario-header-title">Gestión de Inventario</h1>

          <p className="inventario-header-subtitle">
            Controla las existencias, lotes y fechas de vencimiento de los productos.
          </p>
        </div>
      </div>

      <InventoryList inventory={inventory} />
    </div>
  );
}