// === SIMULACIÓN DE API ===
// En producción estas funciones realizarán fetch() reales al backend .NET
class TaskFlowAPI {
  static baseUrl = AppConfig.API_BASE_URL;

  static async login(credentials) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, token: 'jwt-token-example', user: { id: 1, name: 'Juan Pérez', role: 'admin' } });
      }, 800);
    });
  }

  static async getProjects() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, data: [
          { id: 1, name: 'TaskFlow Manager', status: 'active' },
          { id: 2, name: 'API Development', status: 'active' }
        ]});
      }, 600);
    });
  }

  static async createTask(taskData) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, data: { id: Date.now(), ...taskData } }), 500);
    });
  }
}
async function fetchProjects() {
    const response = await fetch("https://localhost:81/api/projectes");
    if (!response.ok) throw new Error("Error al obtener proyectos");
    return await response.json();
}
