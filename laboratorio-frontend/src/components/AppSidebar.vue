<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>🔬 Laboratorios</h2>
      <p>{{ auth.nombre }}</p>
      <span class="rol">{{ auth.rol }}</span>
    </div>

    <nav>
      <!-- Administrador -->
      <template v-if="esAdmin">
        <router-link to="/dashboard">🏠 Inicio</router-link>
        <router-link to="/equipos">🖥️ Equipos</router-link>
        <router-link to="/laboratorios">🏛️ Laboratorios</router-link>
        <router-link to="/solicitudes">📋 Solicitudes</router-link>
        <router-link to="/prestamos">🤝 Préstamos</router-link>
        <router-link to="/devoluciones">↩️ Devoluciones</router-link>
        <router-link to="/mantenimiento">🔧 Mantenimiento</router-link>
        <router-link to="/reportes">📊 Reportes</router-link>
        <router-link to="/usuarios">👥 Usuarios</router-link>
      </template>

      <!-- Coordinador -->
      <template v-else-if="esCoordinador">
        <router-link to="/coordinador">🏛️ Mi Panel</router-link>
      </template>

      <!-- Técnico -->
      <template v-else-if="esTecnico">
        <router-link to="/tecnico">🔧 Mi Panel</router-link>
      </template>

      <!-- Solicitante -->
      <template v-else-if="esSolicitante">
        <router-link to="/solicitante">📋 Mi Panel</router-link>
      </template>
    </nav>

    <button class="logout" @click="handleLogout">🚪 Cerrar sesión</button>
  </aside>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AppSidebar',
  setup() {
    const auth = useAuthStore()
    return { auth }
  },
  computed: {
    esAdmin()       { return this.auth.rol === 'Administrador' },
    esCoordinador() { return this.auth.rol === 'Coordinador'   },
    esTecnico()     { return this.auth.rol === 'Técnico'       },
    esSolicitante() { return this.auth.rol === 'Solicitante'   },
  },
  methods: {
    handleLogout() {
      this.auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.sidebar { width: 240px; background: #1a1a2e; color: white; display: flex; flex-direction: column; padding: 1.5rem 1rem; gap: 0.5rem; min-height: 100vh; }
.sidebar-header { text-align: center; padding-bottom: 1.5rem; border-bottom: 1px solid #ffffff20; margin-bottom: 1rem; }
.sidebar-header h2 { font-size: 1.1rem; margin-bottom: 0.4rem; }
.sidebar-header p { font-size: 0.85rem; color: #aaa; }
.rol { background: #4f46e5; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; }
nav { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
nav a { color: #ccc; text-decoration: none; padding: 0.7rem 1rem; border-radius: 8px; font-size: 0.9rem; transition: background 0.2s; }
nav a:hover, nav a.router-link-active { background: #4f46e5; color: white; }
.logout { background: #ef444420; color: #ef4444; border: 1px solid #ef444440; padding: 0.7rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
.logout:hover { background: #ef4444; color: white; }
</style>