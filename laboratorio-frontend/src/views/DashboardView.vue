<template>
  <MainLayout>
    <div class="page-header">
      <h1>Bienvenido, {{ auth.nombre }} 👋</h1>
      <p style="color:#666; margin-top:0.3rem">Rol: <strong>{{ auth.rol }}</strong></p>
    </div>

    <div class="cards">
      <div class="card" @click="$router.push('/equipos')">
        <span>🖥️</span><h3>Equipos</h3><p>Gestionar inventario</p>
      </div>
      <div class="card" @click="$router.push('/laboratorios')">
        <span>🏛️</span><h3>Laboratorios</h3><p>Ver laboratorios</p>
      </div>
      <div class="card" @click="$router.push('/solicitudes')">
        <span>📋</span><h3>Solicitudes</h3><p>Ver solicitudes</p>
      </div>
      <div class="card" v-if="esAdmin || esCoordinador" @click="$router.push('/reportes')">
        <span>📊</span><h3>Reportes</h3><p>Ver reportes</p>
      </div>
      <div class="card" v-if="esAdmin" @click="$router.push('/usuarios')">
        <span>👥</span><h3>Usuarios</h3><p>Gestionar usuarios</p>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'DashboardView',
  components: { MainLayout },
  setup() {
    const auth = useAuthStore()
    return { auth }
  },
  computed: {
    esAdmin()      { return this.auth.rol === 'Administrador' },
    esCoordinador(){ return this.auth.rol === 'Coordinador' },
  }
}
</script>

<style scoped>
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.2rem; }
.card { background: white; border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.07); transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
.card span { font-size: 2rem; }
.card h3 { margin: 0.5rem 0 0.2rem; font-size: 1rem; color: #1a1a2e; }
.card p { font-size: 0.8rem; color: #888; }
</style>