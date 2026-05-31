<template>
  <MainLayout>
    <div class="page-header">
      <h1>↩️ Devoluciones</h1>
      <button class="btn-primary" @click="abrirModal()">+ Nueva devolución</button>
    </div>

    <div v-if="cargando" class="estado">Cargando...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th><th>Préstamo</th><th>Técnico</th>
          <th>Fecha devolución</th><th>Estado equipo</th><th>Observación</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in devoluciones" :key="d.id">
          <td>#{{ d.id }}</td>
          <td>#{{ d.prestamo_id }}</td>
          <td>{{ d.tecnico }}</td>
          <td>{{ formatFecha(d.fecha_devolucion) }}</td>
          <td><span :class="'badge disponible'">{{ d.estado_equipo }}</span></td>
          <td>{{ d.observacion || '—' }}</td>
          <td>
            <button class="btn-sm" @click="abrirModal(d)">Editar</button>
            <button class="btn-sm danger" @click="eliminar(d.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <AppModal v-if="modal" :titulo="form.id ? 'Editar Devolución' : 'Nueva Devolución'" :error="modalError" @cerrar="modal=false" @guardar="guardar">
      <div class="form-group"><label>Fecha devolución</label><input v-model="form.fecha_devolucion" type="datetime-local" /></div>
      <div class="form-group"><label>Observación</label><textarea v-model="form.observacion" rows="2" /></div>
      <div class="form-group">
        <label>Estado del equipo</label>
        <select v-model="form.estado_equipo">
          <option value="bueno">Bueno</option>
          <option value="deteriorado">Deteriorado</option>
          <option value="dañado">Dañado</option>
        </select>
      </div>
      <div class="form-group">
        <label>Préstamo</label>
        <select v-model="form.prestamo_id">
          <option v-for="p in prestamos" :key="p.id" :value="p.id">#{{ p.id }} — {{ p.tecnico }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Técnico</label>
        <select v-model="form.tecnico_id">
          <option v-for="u in tecnicos" :key="u.id" :value="u.id">{{ u.nombre }}</option>
        </select>
      </div>
    </AppModal>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import AppModal   from '../components/AppModal.vue'
import api from '../services/api'

export default {
  name: 'DevolucionesView',
  components: { MainLayout, AppModal },
  data() {
    return {
      devoluciones: [], prestamos: [], tecnicos: [],
      cargando: true, error: '', modal: false, modalError: '', form: {}
    }
  },
  async mounted() { await this.cargarDatos() },
  methods: {
    async cargarDatos() {
      try {
        const [dev, pres, usuarios] = await Promise.all([
          api.get('/devoluciones'), api.get('/prestamos'), api.get('/usuarios')
        ])
        this.devoluciones = dev.data.data
        this.prestamos    = pres.data.data
        this.tecnicos     = usuarios.data.data.filter(u => u.rol === 'Técnico' || u.rol === 'Administrador')
      } catch { this.error = 'Error al cargar los datos' }
      finally  { this.cargando = false }
    },
    abrirModal(d = {}) { this.modalError = ''; this.form = { ...d }; this.modal = true },
    async guardar() {
      try {
        this.form.id
          ? await api.put(`/devoluciones/${this.form.id}`, this.form)
          : await api.post('/devoluciones', this.form)
        this.modal = false
        await this.cargarDatos()
      } catch (err) { this.modalError = err.response?.data?.message || 'Error al guardar' }
    },
    async eliminar(id) {
      if (!confirm('¿Eliminar esta devolución?')) return
      try { await api.delete(`/devoluciones/${id}`); await this.cargarDatos() }
      catch { alert('Error al eliminar') }
    },
    formatFecha(f) {
      if (!f) return '—'
      return new Date(f).toLocaleDateString('es-CO', { day:'2-digit', month:'2-digit', year:'numeric' })
    }
  }
}
</script>