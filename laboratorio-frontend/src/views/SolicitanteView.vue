<template>
  <MainLayout>
    <div class="page-header">
      <h1>📋 Panel Solicitante</h1>
      <p style="color:#666; margin-top:0.3rem">Bienvenido, {{ auth.nombre }}</p>
    </div>

    <div v-if="cargando" class="estado">Cargando...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>

    <div v-else>
      <div class="tabs">
        <button :class="{ active: tab === 'equipos' }"     @click="cambiarTab('equipos')">🖥️ Equipos disponibles</button>
        <button :class="{ active: tab === 'solicitudes' }" @click="cambiarTab('solicitudes')">📋 Mis solicitudes</button>
        <button :class="{ active: tab === 'reservas' }"    @click="cambiarTab('reservas')">📅 Mis reservas</button>
      </div>

      <!-- Equipos disponibles -->
      <div v-if="tab === 'equipos'">
        <div class="buscador">
          <input v-model="busqueda" placeholder="🔍 Buscar equipo por nombre, marca o modelo..." />
        </div>
        <div class="equipos-grid">
          <div class="equipo-card" v-for="eq in equiposFiltrados" :key="eq.id">
            <div class="equipo-icon">🖥️</div>
            <h3>{{ eq.equipo }}</h3>
            <p><strong>Marca:</strong> {{ eq.marca }}</p>
            <p><strong>Modelo:</strong> {{ eq.modelo }}</p>
            <p><strong>Categoría:</strong> {{ eq.categoria }}</p>
            <p><strong>Laboratorio:</strong> {{ eq.laboratorio }}</p>
            <p><strong>Sede:</strong> {{ eq.sede }}</p>
            <span class="badge disponible">Disponible</span>
            <button class="btn-solicitar" @click="abrirModalSolicitud(eq)">Solicitar</button>
          </div>
          <div v-if="equiposFiltrados.length === 0" class="sin-datos">
            No hay equipos disponibles
          </div>
        </div>
      </div>

      <!-- Mis solicitudes -->
      <div v-if="tab === 'solicitudes'">
        <table>
          <thead>
            <tr><th>ID</th><th>Fecha inicio</th><th>Fecha fin</th><th>Estado</th><th>Observación</th><th>Motivo rechazo</th></tr>
          </thead>
          <tbody>
            <tr v-for="s in misSolicitudes" :key="s.id">
              <td>#{{ s.id }}</td>
              <td>{{ formatFecha(s.fecha_inicio) }}</td>
              <td>{{ formatFecha(s.fecha_fin) }}</td>
              <td><span :class="'badge ' + s.estado">{{ s.estado }}</span></td>
              <td>{{ s.observacion || '—' }}</td>
              <td>{{ s.motivo_rechazo || '—' }}</td>
            </tr>
            <tr v-if="misSolicitudes.length === 0">
              <td colspan="6" style="text-align:center; color:#888">No tienes solicitudes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mis reservas -->
      <div v-if="tab === 'reservas'">
        <table>
          <thead>
            <tr><th>ID</th><th>Equipo</th><th>Fecha inicio</th><th>Fecha fin</th><th>Estado</th></tr>
          </thead>
          <tbody>
            <tr v-for="r in misReservas" :key="r.id">
              <td>#{{ r.id }}</td>
              <td>{{ r.equipo }}</td>
              <td>{{ formatFecha(r.fecha_inicio) }}</td>
              <td>{{ formatFecha(r.fecha_fin) }}</td>
              <td><span :class="'badge ' + r.estado">{{ r.estado }}</span></td>
            </tr>
            <tr v-if="misReservas.length === 0">
              <td colspan="5" style="text-align:center; color:#888">No tienes reservas activas</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal nueva solicitud -->
    <AppModal v-if="modalSolicitud" titulo="Nueva Solicitud" :error="modalError" @cerrar="modalSolicitud=false" @guardar="guardarSolicitud">
      <div class="equipo-seleccionado" v-if="equipoSeleccionado">
        <p>🖥️ <strong>{{ equipoSeleccionado.equipo }}</strong></p>
        <p style="color:#666; font-size:0.85rem">{{ equipoSeleccionado.laboratorio }} — {{ equipoSeleccionado.sede }}</p>
      </div>
      <div class="form-group"><label>Fecha inicio</label><input v-model="formSolicitud.fecha_inicio" type="datetime-local" /></div>
      <div class="form-group"><label>Fecha fin</label><input v-model="formSolicitud.fecha_fin" type="datetime-local" /></div>
      <div class="form-group"><label>Observación</label><textarea v-model="formSolicitud.observacion" rows="3" placeholder="Motivo de la solicitud..." /></div>
    </AppModal>

  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import AppModal   from '../components/AppModal.vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

export default {
  name: 'SolicitanteView',
  components: { MainLayout, AppModal },
  setup() {
    const auth = useAuthStore()
    return { auth }
  },
  data() {
    return {
      tab:                'equipos',
      equiposDisponibles: [],
      misSolicitudes:     [],
      misReservas:        [],
      busqueda:           '',
      cargando:           true,
      error:              '',
      modalSolicitud:     false,
      modalError:         '',
      equipoSeleccionado: null,
      formSolicitud:      {},
    }
  },
  computed: {
    equiposFiltrados() {
      if (!this.busqueda) return this.equiposDisponibles
      const b = this.busqueda.toLowerCase()
      return this.equiposDisponibles.filter(e =>
        e.equipo?.toLowerCase().includes(b) ||
        e.marca?.toLowerCase().includes(b)  ||
        e.modelo?.toLowerCase().includes(b)
      )
    }
  },
  async mounted() {
    await this.cargarTodo()
  },
  methods: {
    async cargarTodo() {
      try {
        const [equipos, solicitudes, reservas] = await Promise.all([
          api.get('/reportes/equipos-disponibles'),
          api.get('/solicitudes'),
          api.get('/reservas'),
        ])
        this.equiposDisponibles = equipos.data.data
        this.misSolicitudes = solicitudes.data.data.filter(
          s => String(s.usuario_id) === String(this.auth.id)
        )
        // Solo mostrar reservas activas que pertenezcan a solicitudes del usuario
        this.misReservas = reservas.data.data.filter(r =>
          r.estado === 'activa' &&
          this.misSolicitudes.some(s => String(s.id) === String(r.solicitud_id))
        )
      } catch { this.error = 'Error al cargar los datos' }
      finally  { this.cargando = false }
    },

    cambiarTab(tab) { this.tab = tab },

    abrirModalSolicitud(equipo) {
      this.equipoSeleccionado = equipo
      this.modalError         = ''
      this.formSolicitud      = {}
      this.modalSolicitud     = true
    },

    async guardarSolicitud() {
      try {
        this.formSolicitud.usuario_id = this.auth.id

        // 1. Crear la solicitud
        const { data } = await api.post('/solicitudes', this.formSolicitud)
        const solicitudId = data.data.id

        // 2. Agregar el equipo a solicitud_equipo
        await api.post('/solicitud-equipos', {
          solicitud_id: solicitudId,
          equipo_id:    this.equipoSeleccionado.id,
          cantidad:     1,
        })

        // 3. Crear la reserva en estado pendiente
        await api.post('/reservas', {
          fecha_inicio: this.formSolicitud.fecha_inicio,
          fecha_fin:    this.formSolicitud.fecha_fin,
          solicitud_id: solicitudId,
          equipo_id:    this.equipoSeleccionado.id,
          estado:       'pendiente',
        })

        this.modalSolicitud = false
        await this.cargarTodo()
      } catch (err) {
        this.modalError = err.response?.data?.message || 'Error al guardar'
      }
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

.buscador { margin-bottom: 1.5rem; }
.buscador input { width: 100%; padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95rem; }

.equipos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.2rem; }
.equipo-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); display: flex; flex-direction: column; gap: 0.4rem; }
.equipo-icon { font-size: 2rem; text-align: center; }
.equipo-card h3 { font-size: 1rem; color: #1a1a2e; text-align: center; margin-bottom: 0.5rem; }
.equipo-card p { font-size: 0.82rem; color: #555; }
.btn-solicitar { margin-top: 0.8rem; background: #4f46e5; color: white; border: none; padding: 0.6rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600; }
.btn-solicitar:hover { background: #4338ca; }

.equipo-seleccionado { background: #f0f0ff; border-radius: 8px; padding: 0.8rem 1rem; margin-bottom: 1rem; }

.sin-datos { text-align: center; color: #888; padding: 2rem; background: white; border-radius: 12px; }
</style>