import React, { useState } from 'react';
import { CrudTemplate } from '../components/CrudTemplate';
import { Pencil, Trash2 } from 'lucide-react';

export const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([
    { id: 1, categoria: 'gaseosas', estado: 'activo' },
    { id: 2, categoria: 'embutidos', estado: 'activo' },
  ]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Categoría', accessor: 'categoria' },
  ];

  // Acciones específicas para esta tabla
  const renderActions = (row) => (
    <div className="flex justify-center items-center gap-2">
      <button 
        onClick={() => console.log('Editar', row)}
        className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition shadow-sm"
      >
        <Pencil size={16} />
      </button>
      <button 
        onClick={() => setCategorias(categorias.map(c => c.id === row.id ? { ...c, estado: 'inactivo' } : c))}
        className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition shadow-sm"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <CrudTemplate 
      title="Gestión de Categorías"
      description="Administra y controla las categorías de tus productos."
      searchPlaceholder="Buscar categoría..."
      columns={columns}
      data={categorias}
      actions={renderActions}
      onAdd={() => console.log('Abrir modal de agregar categoría')}
    />
  );
};