import React, { useState } from 'react';
import { CrudTemplate } from '../components/CrudTemplate';
import { Pencil, Trash2 } from 'lucide-react';

export const ProductosPage = () => {
  const [productos, setProductos] = useState([
    { id: 1, codigo: 'PRD-001', producto: 'Coca Cola 1.5L', categoria: 'Gaseosas', precio: 'S/ 7.50', stock: 45, estado: 'activo' },
    { id: 2, codigo: 'PRD-002', producto: 'Hot Dog Suizo Pack', categoria: 'Embutidos', precio: 'S/ 120.00', stock: 20, estado: 'activo' },
  ]);

  const columns = [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Producto', accessor: 'producto' },
    { header: 'Categoría', accessor: 'categoria' },
    { header: 'Precio', accessor: 'precio' },
    { header: 'Stock', accessor: 'stock' },
  ];

  const renderActions = (row) => (
    <div className="flex justify-center items-center gap-2">
      <button 
        onClick={() => console.log('Editar producto', row)}
        className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition shadow-sm"
        title="Editar"
      >
        <Pencil size={16} />
      </button>
      <button 
        onClick={() => setProductos(productos.map(p => p.id === row.id ? { ...p, estado: 'inactivo' } : p))}
        className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition shadow-sm"
        title="Eliminar"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <CrudTemplate 
      title="Gestión de Productos"
      description="Administra el catálogo de productos, precios y stock disponible."
      searchPlaceholder="Buscar por código, producto o categoría..."
      columns={columns}
      data={productos}
      actions={renderActions}
      onAdd={() => console.log('Abrir modal para agregar nuevo producto')}
    />
  );
};