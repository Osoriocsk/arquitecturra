<template>
  <MainLayout>
    <div class="page-header">
      <h1>🔧 Panel Técnico</h1>
      <p style="color:#666; margin-top:0.3rem">Bienvenido, {{ auth.nombre }}</p>
    </div>

    <div v-if="cargando" class="estado">Cargando...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>

    <div v-else>
      <div class="tabs">
        <button :class="{ active: tab === 'devoluciones' }"  @click="cambiarTab('devoluciones')">↩️ Devoluciones</button>
        <button :class="{ active: tab === 'mantenimiento' }" @click="cambiarTab('mantenimiento')">🔧 Mantenimiento</button>
        <button :class="{ active: tab === 'incidencias' }"   @click="cambiarTab('incidencias')">⚠️ Incidencias</button>
      </div>

      <!-- Devoluciones -->
      <div v-if="tab === 'devoluciones'">
        <div class="page-header" style="margin-bottom:1rem">
          <h2 style="font-size:1.1rem">Devoluciones</h2>
          <button class="btn-primary" @click="abrirModalDevolucion()">+ Nueva devolución</button>
        </div>
        <table>
          <thead>
            <tr><th>ID</th><th>Préstamo</th><th>Equipo</th><th>Fecha devolución</th><th>Estado equipo</th><th>Observación</th></tr>
          </thead>
          <tbody>
            <tr v-for="d in devoluciones" :key="d.id">
              <td>#{{ d.id }}</td>
              <td>#{{ d.prestamo_id }}</td>
              <td>{{ d.tecnico }}</td>
              <td>{{ formatFecha(d.fecha_devolucion) }}</td>
              <td><span class="badge disponible">{{ d.estado_equipo }}</span></td>
              <td>{{ d.observacion || '—' }}</td>
            </tr>
            <tr v-if="devoluciones.length === 0">
              <td colspan="6" style="text-align:center; color:#888">Sin devoluciones</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mantenimiento -->
      <div v-if="tab === 'mantenimiento'">
        <div class="page-header" style="margin-bottom:1rem">
          <h2 style="font-size:1.1rem">Mantenimientos</h2>
          <button class="btn-primary" @click="abrirModalMantenimiento()">+ Nuevo mantenimiento</button>
        </div>
        <table>
          <thead>
            <tr><th>ID</th><th>Equipo</th><th>Tipo</th><th>Estado</th><th>Fecha inicio</th><th>Fecha fin</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            <tr v-for="m in mantenimientos" :key="m.id">
              <td>#{{ m.id }}</td>
              <td>{{ m.equipo }}</td>
              <td>{{ m.tipo }}</td>
              <td><span :class="'badge ' + (m.estado === 'completado' ? 'disponible' : 'prestado')">{{ m.estado }}</span></td>
              <td>{{ formatFecha(m.fecha_inicio) }}</td>
              <td>{{ formatFecha(m.fecha_fin) || '—' }}</td>
              <td>
                <button class="btn-sm" @click="abrirModalMantenimiento(m)">Editar</button>
              </td>
            </tr>
            <tr v-if="mantenimientos.length === 0">
              <td colspan="7" style="text-align:center; color:#888">Sin mantenimientos</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Incidencias -->
      <div v-if="tab === 'incidencias'">
        <div class="page-header" style="margin-bottom:1rem">
          <h2 style="font-size:1.1rem">Incidencias</h2>
          <button class="btn-primary" @click="abrirModalIncidencia()">+ Nueva incidencia</button>
        </div>
        <table>
          <thead>
            <tr><th>ID</th><th>Equipo</th><th>Préstamo</th><th>Fecha</th><th>Descripción</th></tr>
          </thead>
          <tbody>
            <tr v-for="i in incidencias" :key="i.id">
              <td>#{{ i.id }}</td>
              <td>{{ i.equipo }}</td>
              <td>#{{ i.prestamo_id }}</td>
              <td>{{ formatFecha(i.fecha) }}</td>
              <td>{{ i.descripcion }}</td>
            </tr>
            <tr v-if="incidencias.length === 0">
              <td colspan="5" style="text-align:center; color:#888">Sin incidencias</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Devolución -->
    <AppModal v-if="modalDevolucion" titulo="Nueva Devolución" :error="modalError" @cerrar="modalDevolucion=false" @guardar="guardarDevolucion">
      <div class="form-group">
        <label>Préstamo</label>
        <select v-model="formDevolucion.prestamo_id">
          <option v-for="p in prestamos" :key="p.id" :value="p.id">
            #{{ p.id }} — {{ p.equipo }} ({{ p.solicitante }})
          </option>
        </select>
      </div>
      <div class="form-group"><label>Fecha devolución</label><input v-model="formDevolucion.fecha_devolucion" type="datetime-local" /></div>
      <div class="form-group">
        <label>Estado del equipo</label>
        <select v-model="formDevolucion.estado_equipo">
          <option value="bueno">Bueno</option>
          <option value="deteriorado">Deteriorado</option>
          <option value="dañado">Dañado</option>
        </select>
      </div>
      <div class="form-group"><label>Observación</label><textarea v-model="formDevolucion.observacion" rows="2" /></div>
    </AppModal>

    <!-- Modal Mantenimiento -->
    <AppModal v-if="modalMantenimiento" :titulo="formMantenimiento.id ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'" :error="modalError" @cerrar="modalMantenimiento=false" @guardar="guardarMantenimiento">
      <div class="form-group">
        <label>Tipo</label>
        <select v-model="formMantenimiento.tipo">
          <option value="preventivo">Preventivo</option>
          <option value="correctivo">Correctivo</option>
        </select>
      </div>
      <div class="form-group" v-if="formMantenimiento.id">
        <label>Estado</label>
        <select v-model="formMantenimiento.estado">
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="completado">Completado</option>
        </select>
      </div>
      <div class="form-group"><label>Descripción</label><textarea v-model="formMantenimiento.descripcion" rows="3" /></div>
      <div class="form-group"><label>Fecha inicio</label><input v-model="formMantenimiento.fecha_inicio" type="date" /></div>
      <div class="form-group"><label>Fecha fin</label><input v-model="formMantenimiento.fecha_fin" type="date" /></div>
      <div class="form-group">
        <label>Equipo</label>
        <select v-model="formMantenimiento.equipo_id">
          <option v-for="e in equipos" :key="e.id" :value="e.id">{{ e.nombre }}</option>
        </select>
      </div>
    </AppModal>

    <!-- Modal Incidencia -->
    <AppModal v-if="modalIncidencia" titulo="Nueva Incidencia" :error="modalError" @cerrar="modalIncidencia=false" @guardar="guardarIncidencia">
      <div class="form-group"><label>Descripción</label><textarea v-model="formIncidencia.descripcion" rows="3" /></div>
      <div class="form-group">
        <label>Préstamo</label>
        <select v-model="formIncidencia.prestamo_id">
          <option v-for="p in prestamos" :key="p.id" :value="p.id">#{{ p.id }} — {{ p.equipo }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Equipo</label>
        <select v-model="formIncidencia.equipo_id">
          <option v-for="e in equipos" :key="e.id" :value="e.id">{{ e.nombre }}</option>
        </select>
      </div>
    </AppModal>

  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import AppModal   from '../components/AppModal.vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

export default {
  name: 'TecnicoView',
  components: { MainLayout, AppModal },
  setup() {
    const auth = useAuthStore()
    return { auth }
  },
  data() {
    return {
      tab:            'devoluciones',
      prestamos:      [],
      devoluciones:   [],
      mantenimientos: [],
      incidencias:    [],
      equipos:        [],
      cargando:       true,
      error:          '',
      modalError:     '',
      modalDevolucion:    false,
      modalMantenimiento: false,
      modalIncidencia:    false,
      formDevolucion:     {},
      formMantenimiento:  {},
      formIncidencia:     {},
    }
  },
  async mounted() {
    await this.cargarTodo()
  },
  methods: {
    async cargarTodo() {
      try {
        const [pres, dev, mant, inc, eq] = await Promise.all([
          api.get('/reportes/prestamos-activos'),
          api.get('/devoluciones'),
          api.get('/mantenimientos'),
          api.get('/incidencias'),
          api.get('/equipos'),
        ])
        this.prestamos      = pres.data.data
        this.devoluciones   = dev.data.data.filter(d => String(d.tecnico_id) === String(this.auth.id))
        this.mantenimientos = mant.data.data.filter(m => String(m.tecnico_id) === String(this.auth.id))
        this.incidencias    = inc.data.data.filter(i => String(i.usuario_id) === String(this.auth.id))
        this.equipos        = eq.data.data
      } catch { this.error = 'Error al cargar los datos' }
      finally  { this.cargando = false }
    },

    cambiarTab(tab) { this.tab = tab },

    abrirModalDevolucion(d = {})    { this.modalError = ''; this.formDevolucion    = { ...d }; this.modalDevolucion    = true },
    abrirModalMantenimiento(m = {}) { this.modalError = ''; this.formMantenimiento = { ...m }; this.modalMantenimiento = true },
    abrirModalIncidencia(i = {})    { this.modalError = ''; this.formIncidencia    = { ...i }; this.modalIncidencia    = true },

    async guardarDevolucion() {
      try {
        this.formDevolucion.tecnico_id = this.auth.id
        await api.post('/devoluciones', this.formDevolucion)
        this.modalDevolucion = false
        await this.cargarTodo()
      } catch (err) { this.modalError = err.response?.data?.message || 'Error al guardar' }
    },

    async guardarMantenimiento() {
      try {
        this.formMantenimiento.tecnico_id = this.auth.id
        this.formMantenimiento.id
          ? await api.put(`/mantenimientos/${this.formMantenimiento.id}`, this.formMantenimiento)
          : await api.post('/mantenimientos', this.formMantenimiento)
        this.modalMantenimiento = false
        await this.cargarTodo()
      } catch (err) { this.modalError = err.response?.data?.message || 'Error al guardar' }
    },

    async guardarIncidencia() {
      try {
        this.formIncidencia.usuario_id = this.auth.id
        await api.post('/incidencias', this.formIncidencia)
        this.modalIncidencia = false
        await this.cargarTodo()
      } catch (err) { this.modalError = err.response?.data?.message || 'Error al guardar' }
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
</style>