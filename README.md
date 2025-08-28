# 📊 ServiceTrack.Frontend

**ServiceTrack** es una aplicación web para gestión de proyectos, tareas y equipos.  
Este repositorio contiene la **capa de presentación (frontend)** construida con:

- ⚙️ HTML5 + JavaScript (modular)
- 🎨 Bootstrap 5
- 📊 Chart.js
- 💬 SweetAlert2
- 📁 Arquitectura basada en vistas dinámicas (`/views`) y módulos JS (`/assets/js`)

---

## 🚀 Características

- Navegación dinámica por secciones (Dashboard, Proyectos, Tareas, Equipo).
- Dashboard con métricas y gráficas.
- Kanban para tareas (en progreso 🚧).
- Autenticación básica (Login/Logout, con simulación).
- Separación de capas para futura integración con API en .NET.

---

## 📂 Estructura del proyecto
```bash
ServiceTrack.Frontend/
├── index.html              # Layout principal
├── login.html              # Página de inicio de sesión
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── theme.css
│   ├── js/
│   │   ├── app.js
│   │   ├── navigation.js
│   │   ├── dashboard.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── team.js
│   │   ├── auth.js
│   │   └── api.js
│   └── img/
└── views/
    ├── dashboard.html
    ├── projects.html
    ├── tasks.html
    ├── team.html
    ├── reports.html
    └── settings.html


🛠️ Instalación y uso

Clonar el repositorio:
git clone https://github.com/tuusuario/ServiceTrack.Frontend.git
Abrir index.html en tu navegador.
Navegar entre las secciones usando el sidebar.

📌 Roadmap
* Mejorar Kanban con drag & drop real. [En progreso]
* Conexión con API en .NET (Capa de Negocio). [Completado 70%]
* Autenticación JWT + Google OAuth. [Listo JWT, Falta Google]
* Exportar reportes (PDF, Excel). [En progreso]
* Deploy con Docker + Nginx.[En platicas]
* Proyectos [CRUD], Tareas [CRUD] [Completo]
* Creación de otras opciones como Configuracion, perfil del usuario, ETC [En Progreso]
* Cambiar de Gestion de Proyectos a Gestión de Facturacion [En Platicas]
