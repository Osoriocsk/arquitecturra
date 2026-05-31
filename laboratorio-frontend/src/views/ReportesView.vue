<template>
  <MainLayout>
    <div class="page-header">
      <h1>📊 Reportes</h1>
    </div>

    <div class="tabs">
      <button :class="{ active: tab === 'equipos' }"     @click="cambiarTab('equipos')">Equipos disponibles</button>
      <button :class="{ active: tab === 'prestamos' }"   @click="cambiarTab('prestamos')">Préstamos activos</button>
      <button :class="{ active: tab === 'solicitudes' }" @click="cambiarTab('solicitudes')">Solicitudes pendientes</button>
    </div>

    <div v-if="cargando" class="estado">Cargando...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>

    <table v-else-if="tab === 'equipos'">
      <thead><tr><th>Equipo</th><th>Serial</th><th>Marca</th><th>Modelo</th><th>Categoría</th><th>Laboratorio</th><th>Sede</th></tr></thead>
      <tbody>
        <tr v-for="e in datos" :key="e.id">
          <td>{{ e.equipo }}</td><td>{{ e.serial }}</td><td>{{ e.marca }}</td>
          <td>{{ e.modelo }}</td><td>{{ e.categoria }}</td>
          <td>{{ e.laboratorio }}</td><td>{{ e.sede }}</td>
        </tr>
      </tbody>
    </table>

    <table v-else-if="tab === 'prestamos'">
      <thead><tr><th>ID</th><th>Equipo</th><th>Serial</th><th>Solicitante</th><th>Técnico</th><th>Entrega</th><th>Dev. esperada</th><th>Días restantes</th></tr></thead>
      <tbody>
        <tr v-for="p in datos" :key="p.id">
          <td>#{{ p.id }}</td><td>{{ p.equipo }}</td><td>{{ p.serial }}</td>
          <td>{{ p.solicitante }}</td><td>{{ p.tecnico }}</td>
          <td>{{ formatFecha(p.fecha_entrega) }}</td>
          <td>{{ formatFecha(p.fecha_dev_esperada) }}</td>
          <td><span :class="'badge ' + (p.dias_restantes < 0 ? 'prestado' : 'disponible')">{{ p.dias_restantes }} días</span></td>
        </tr>
      </tbody>
    </table>

    <table v-else-if="tab === 'solicitudes'">
      <thead><tr><th>ID</th><th>Solicitante</th><th>Correo</th><th>Fecha inicio</th><th>Fecha fin</th><th>Observación</th><th>Total equipos</th></tr></thead>
      <tbody>
        <tr v-for="s in datos" :key="s.id">
          <td>#{{ s.id }}</td><td>{{ s.solicitante }}</td><td>{{ s.correo }}</td>
          <td>{{ formatFecha(s.fecha_inicio) }}</td><td>{{ formatFecha(s.fecha_fin) }}</td>
          <td>{{ s.observacion || '—' }}</td><td>{{ s.total_equipos }}</td>
        </tr>
      </tbody>
    </table>

  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import api from '../services/api'

export default {
  name: 'ReportesView',
  components: { MainLayout },
  data() {
    return { tab: 'equipos', datos: [], cargando: false, error: '' }
  },
  async mounted() { await this.cargarDatos() },
  methods: {
    async cambiarTab(tab) { this.tab = tab; await this.cargarDatos() },
    async cargarDatos() {
      this.cargando = true; this.error = ''
      try {
        const endpoints = {
          equipos:     '/reportes/equipos-disponibles',
          prestamos:   '/reportes/prestamos-activos',
          solicitudes: '/reportes/solicitudes-pendientes',
        }
        const { data } = await api.get(endpoints[this.tab])
        this.datos = data.data
      } catch { this.error = 'Error al cargar el reporte' }
      finally  { this.cargando = false }
    },
    formatFecha(f) {
      if (!f) return '—'
      return new Date(f).toLocaleDateString('es-CO', { day:'2-digit', month:'2-digit', year:'numeric' })
    }
  }
}
</script>

<style scoped>
.tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
.tabs button { padding: 0.6rem 1.2rem; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; font-size: 0.9rem; }
.tabs button.active { background: #4f46e5; color: white; border-color: #4f46e5; }
</style>