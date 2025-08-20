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
