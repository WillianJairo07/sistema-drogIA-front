# DrogIA - Frontend

Frontend del sistema web **DrogIA**, desarrollado para apoyar la gestión de ventas, cotizaciones, productos, inventario y demás procesos relacionados de la droguería IGAN PERUANA S.A.

Actualmente, este proyecto corresponde únicamente al **frontend**, desarrollado con React y preparado para una futura integración con el backend.

## Tecnologías

- React
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React

## Instalación

Clonar el repositorio y acceder a la carpeta del proyecto.

Luego, instalar las dependencias:

```bash
npm install
```

## Ejecución

Para iniciar el proyecto en modo desarrollo:

```bash
npm run dev
```

El sistema estará disponible en:

```text
http://localhost:5173
```

## Usuarios de prueba

Actualmente, el inicio de sesión funciona con usuarios de prueba para validar el acceso según el rol.

| Usuario    | Contraseña | Rol           |
| ---------- | ---------- | ------------- |
| admin      | 123456     | Administrador |
| vendedor   | 123456     | Vendedor      |
| comprador  | 123456     | Comprador     |
| almacenero | 123456     | Almacenero    |

Cada rol cuenta con diferentes opciones de acceso dentro del sistema.

> **Nota:** Las credenciales actuales son únicamente para pruebas del frontend. La autenticación real se implementará posteriormente mediante el backend.