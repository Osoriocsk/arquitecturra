<template>
  <MainLayout>
    <div class="page-header">
      <h1>🏛️ Panel Coordinador</h1>
      <p style="color:#666; margin-top:0.3rem">Laboratorios a tu cargo</p>
    </div>

    <div v-if="cargando" class="estado">Cargando...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>

    <div v-else>
      <div class="tabs">
        <button :class="{ active: tab === 'laboratorios' }" @click="cambiarTab('laboratorios')">🏛️ Mis Laboratorios</button>
        <button :class="{ active: tab === 'equipos' }"      @click="cambiarTab('equipos')">🖥️ Equipos</button>
        <button :class="{ active: tab === 'solicitudes' }"  @click="cambiarTab('solicitudes')">📋 Solicitudes</button>
        <button :class="{ active: tab === 'prestamos' }"    @click="cambiarTab('prestamos')">🤝 Préstamos</button>
        <button :class="{ active: tab === 'incidencias' }"  @click="cambiarTab('incidencias')">⚠️ Incidencias</button>
        <button :class="{ active: tab === 'reportes' }"     @click="cambiarTab('reportes')">📊 Reportes</button>
      </div>

      <!-- Mis Laboratorios -->
      <div v-if="tab === 'laboratorios'">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Capacidad</th><th>Ubicación</th><th>Sede</th><th>Estado</th></tr>
          </thead>
          <tbody>
            <tr v-for="lab in laboratorios" :key="lab.id">
              <td>{{ lab.nombre }}</td>
              <td>{{ lab.capacidad }}</td>
              <td>{{ lab.ubicacion }}</td>
              <td>{{ lab.sede }}</td>
              <td><span :class="'badge ' + (lab.estado ? 'activo' : 'inactivo')">{{ lab.estado ? 'Activo' : 'Inactivo' }}</span></td>
            </tr>
            <tr v-if="laboratorios.length === 0">
              <td colspan="5" style="text-align:center; color:#888">No tienes laboratorios asignados</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Equipos -->
      <div v-if="tab === 'equipos'">
        <div class="filtro">
          <label>Laboratorio:</label>
          <select v-model="labSeleccionado" @change="cargarEquipos">
            <option v-for="lab in laboratorios" :key="lab.id" :value="lab.id">{{ lab.nombre }}</option>
          </select>
        </div>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Serial</th><th>Marca</th><th>Modelo</th><th>Estado</th><th>Categoría</th></tr>
          </thead>
          <tbody>
            <tr v-for="eq in equipos" :key="eq.id">
              <td>{{ eq.nombre }}</td>
              <td>{{ eq.serial }}</td>
              <td>{{ eq.marca }}</td>
              <td>{{ eq.modelo }}</td>
              <td><span :class="'badge ' + eq.estado">{{ eq.estado }}</span></td>
              <td>{{ eq.categoria }}</td>
            </tr>
            <tr v-if="equipos.length === 0">
              <td colspan="6" style="text-align:center; color:#888">Sin equipos en este laboratorio</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Solicitudes -->
      <div v-if="tab === 'solicitudes'">
        <table>
          <thead>
            <tr><th>ID</th><th>Usuario</th><th>Fecha inicio</th><th>Fecha fin</th><th>Estado</th><th>Observación</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            <tr v-for="s in solicitudes" :key="s.id">
              <td>#{{ s.id }}</td>
              <td>{{ s.usuario }}</td>
              <td>{{ formatFecha(s.fecha_inicio) }}</td>
              <td>{{ formatFecha(s.fecha_fin) }}</td>
              <td><span :class="'badge ' + s.estado">{{ s.estado }}</span></td>
              <td>{{ s.observacion || '—' }}</td>
              <td>
                <select
                  v-if="s.estado === 'pendiente'"
                  @change="cambiarEstadoSolicitud(s.id, $event.target.value)"
                  class="select-estado"
                >
                  <option value="">— Cambiar estado —</option>
                  <option value="aprobada">Aprobada</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
                <span v-else style="color:#888; font-size:0.8rem">{{ s.estado }}</span>
              </td>
            </tr>
            <tr v-if="solicitudes.length === 0">
              <td colspan="7" style="text-align:center; color:#888">Sin solicitudes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Préstamos -->
      <div v-if="tab === 'prestamos'">
        <table>
          <thead>
            <tr><th>ID</th><th>Equipo</th><th>Solicitante</th><th>Técnico</th><th>Entrega</th><th>Dev. esperada</th><th>Estado</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in prestamos" :key="p.id">
              <td>#{{ p.id }}</td>
              <td>{{ p.equipo }}</td>
              <td>{{ p.solicitante }}</td>
              <td>{{ p.tecnico || '—' }}</td>
              <td>{{ formatFecha(p.fecha_entrega) }}</td>
              <td>{{ formatFecha(p.fecha_dev_esperada) }}</td>
              <td><span :class="'badge ' + p.estado">{{ p.estado }}</span></td>
            </tr>
            <tr v-if="prestamos.length === 0">
              <td colspan="7" style="text-align:center; color:#888">Sin préstamos activos</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Incidencias -->
      <div v-if="tab === 'incidencias'">
        <table>
          <thead>
            <tr><th>ID</th><th>Equipo</th><th>Préstamo</th><th>Usuario</th><th>Fecha</th><th>Descripción</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            <tr v-for="i in incidencias" :key="i.id">
              <td>#{{ i.id }}</td>
              <td>{{ i.equipo }}</td>
              <td>#{{ i.prestamo_id }}</td>
              <td>{{ i.usuario }}</td>
              <td>{{ formatFecha(i.fecha) }}</td>
              <td>{{ i.descripcion }}</td>
              <td>
                <button class="btn-sm" @click="resolverIncidencia(i)">
                  ✅ Marcar resuelta
                </button>
              </td>
            </tr>
            <tr v-if="incidencias.length === 0">
              <td colspan="7" style="text-align:center; color:#888">Sin incidencias</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Reportes -->
      <div v-if="tab === 'reportes'">
        <div class="reporte-cards">
          <div class="reporte-card">
            <h3>Total equipos</h3>
            <span>{{ equipos.length }}</span>
          </div>
          <div class="reporte-card">
            <h3>Disponibles</h3>
            <span class="verde">{{ equipos.filter(e => e.estado === 'disponible').length }}</span>
          </div>
          <div class="reporte-card">
            <h3>Prestados</h3>
            <span class="amarillo">{{ equipos.filter(e => e.estado === 'prestado').length }}</span>
          </div>
          <div class="reporte-card">
            <h3>Mantenimiento</h3>
            <span class="rojo">{{ equipos.filter(e => e.estado === 'mantenimiento').length }}</span>
          </div>
          <div class="reporte-card">
            <h3>Solicitudes pendientes</h3>
            <span class="amarillo">{{ solicitudes.filter(s => s.estado === 'pendiente').length }}</span>
          </div>
          <div class="reporte-card">
            <h3>Préstamos activos</h3>
            <span class="verde">{{ prestamos.length }}</span>
          </div>
          <div class="reporte-card">
            <h3>Incidencias</h3>
            <span class="rojo">{{ incidencias.length }}</span>
          </div>
        </div>
      </div>

    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

export default {
  name: 'CoordinadorView',
  components: { MainLayout },
  setup() {
    const auth = useAuthStore()
    return { auth }
  },
  data() {
  return {
    tab:             'laboratorios',
    laboratorios:    [],
    equipos:         [],
    todosEquipos:    [], // ← agregar esta línea
    solicitudes:     [],
    prestamos:       [],
    incidencias:     [],
    labSeleccionado: null,
    cargando:        true,
    error:           '',
  }
},
  async mounted() {
    await this.cargarLaboratorios()
  },
  methods: {
    async cargarLaboratorios() {
      try {
        const { data } = await api.get(`/laboratorios/responsable/${this.auth.id}`)
        this.laboratorios = data.data
        if (this.laboratorios.length > 0) {
          this.labSeleccionado = this.laboratorios[0].id
          await Promise.all([
            this.cargarEquipos(),
            this.cargarSolicitudes(),
            this.cargarPrestamos(),
            this.cargarIncidencias(),
          ])
        }
      } catch { this.error = 'Error al cargar los datos' }
      finally  { this.cargando = false }
    },

    async cargarEquipos() {
  try {
    const { data } = await api.get('/equipos')
    // Guardar todos los equipos de todos los laboratorios del coordinador
    const labIds = this.laboratorios.map(l => Number(l.id))
    this.todosEquipos = data.data.filter(e => labIds.includes(Number(e.laboratorio_id)))
    // Mostrar solo los del laboratorio seleccionado en la tabla
    this.equipos = this.todosEquipos.filter(e => Number(e.laboratorio_id) === Number(this.labSeleccionado))
  } catch { this.error = 'Error al cargar equipos' }
},

    async cargarSolicitudes() {
      try {
        const { data } = await api.get('/solicitudes')
        this.solicitudes = data.data
      } catch { this.error = 'Error al cargar solicitudes' }
    },

    async cargarPrestamos() {
      try {
        const { data } = await api.get('/reportes/prestamos-activos')
        this.prestamos = data.data
      } catch { this.error = 'Error al cargar préstamos' }
    },

    async cargarIncidencias() {
  try {
    const { data } = await api.get('/incidencias')
    const labIds = this.laboratorios.map(l => Number(l.id))
    // Filtrar incidencias de equipos en cualquiera de los laboratorios del coordinador
    this.incidencias = data.data.filter(i =>
      this.todosEquipos.some(e => e.nombre === i.equipo)
    )
  } catch { this.error = 'Error al cargar incidencias' }
},

   async resolverIncidencia(incidencia) {
  if (!confirm('¿Marcar esta incidencia como resuelta?')) return
  try {
    // Cambiar préstamo a devuelto
    await api.put(`/prestamos/${incidencia.prestamo_id}`, { estado: 'devuelto' })

    // Obtener solicitud_id del préstamo y cambiarla a completada
    const { data } = await api.get(`/prestamos/${incidencia.prestamo_id}`)
    if (data.data?.solicitud_id) {
      await api.put(`/solicitudes/${data.data.solicitud_id}`, { estado: 'completada' })
    }

    await this.cargarIncidencias()
    await this.cargarPrestamos()
    await this.cargarSolicitudes()
  } catch {
    alert('Error al resolver la incidencia')
  }
},

    async cambiarEstadoSolicitud(id, estado) {
      if (!estado) return
      if (!confirm(`¿Cambiar estado a "${estado}"?`)) return
      try {
        await api.put(`/solicitudes/${id}`, { estado })
        await this.cargarSolicitudes()
      } catch {
        alert('Error al actualizar el estado')
      }
    },

    async cambiarTab(tab) {
      this.tab = tab
    },

    formatFecha(f) {
      if (!f) return '—'
      return new Date(f).toLocaleDateString('es-CO', { day:'2-digit', month:'2-digit', year:'numeric' })
    }
  }
}
</script>

<style scoped>
.tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.tabs button { padding: 0.6rem 1.2rem; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
.tabs button.active { background: #4f46e5; color: white; border-color: #4f46e5; }

.filtro { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.filtro label { font-weight: 500; color: #333; }
.filtro select { padding: 0.5rem 0.9rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; }

.select-estado { padding: 0.3rem 0.6rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.8rem; cursor: pointer; }

.reporte-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
.reporte-card { background: white; border-radius: 12px; padding: 1.5rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
.reporte-card h3 { font-size: 0.85rem; color: #666; margin-bottom: 0.8rem; }
.reporte-card span { font-size: 2rem; font-weight: 700; color: #1a1a2e; }
.verde    { color: #16a34a !important; }
.amarillo { color: #ca8a04 !important; }
.rojo     { color: #dc2626 !important; }
</style>