<template>
  <MainLayout>
    <div class="page-header">
      <h1>🔧 Mantenimiento</h1>
      <button class="btn-primary" @click="abrirModal()">+ Nuevo mantenimiento</button>
    </div>

    <div v-if="cargando" class="estado">Cargando...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th><th>Equipo</th><th>Tipo</th><th>Estado</th>
          <th>Fecha inicio</th><th>Fecha fin</th><th>Técnico</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in mantenimientos" :key="m.id">
          <td>#{{ m.id }}</td>
          <td>{{ m.equipo }}</td>
          <td>{{ m.tipo }}</td>
          <td><span :class="'badge ' + (m.estado === 'completado' ? 'disponible' : 'prestado')">{{ m.estado }}</span></td>
          <td>{{ formatFecha(m.fecha_inicio) }}</td>
          <td>{{ formatFecha(m.fecha_fin) || '—' }}</td>
          <td>{{ m.tecnico }}</td>
          <td>
            <button class="btn-sm" @click="abrirModal(m)">Editar</button>
            <button class="btn-sm danger" @click="eliminar(m.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <AppModal v-if="modal" :titulo="form.id ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'" :error="modalError" @cerrar="modal=false" @guardar="guardar">
      <div class="form-group">
        <label>Tipo</label>
        <select v-model="form.tipo">
          <option value="preventivo">Preventivo</option>
          <option value="correctivo">Correctivo</option>
        </select>
      </div>
      <div class="form-group" v-if="form.id">
        <label>Estado</label>
        <select v-model="form.estado">
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="completado">Completado</option>
        </select>
      </div>
      <div class="form-group"><label>Descripción</label><textarea v-model="form.descripcion" rows="3" /></div>
      <div class="form-group"><label>Fecha inicio</label><input v-model="form.fecha_inicio" type="date" /></div>
      <div class="form-group"><label>Fecha fin</label><input v-model="form.fecha_fin" type="date" /></div>
      <div class="form-group">
        <label>Equipo</label>
        <select v-model="form.equipo_id">
          <option v-for="e in equipos" :key="e.id" :value="e.id">{{ e.nombre }}</option>
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
  name: 'MantenimientoView',
  components: { MainLayout, AppModal },
  data() {
    return {
      mantenimientos: [], equipos: [], tecnicos: [],
      cargando: true, error: '', modal: false, modalError: '', form: {}
    }
  },
  async mounted() { await this.cargarDatos() },
  methods: {
    async cargarDatos() {
      try {
        const [mant, equipos, usuarios] = await Promise.all([
          api.get('/mantenimientos'), api.get('/equipos'), api.get('/usuarios')
        ])
        this.mantenimientos = mant.data.data
        this.equipos        = equipos.data.data
        this.tecnicos       = usuarios.data.data.filter(u => u.rol === 'Técnico' || u.rol === 'Administrador')
      } catch { this.error = 'Error al cargar los datos' }
      finally  { this.cargando = false }
    },
    abrirModal(m = {}) { this.modalError = ''; this.form = { ...m }; this.modal = true },
    async guardar() {
      try {
        this.form.id
          ? await api.put(`/mantenimientos/${this.form.id}`, this.form)
          : await api.post('/mantenimientos', this.form)
        this.modal = false
        await this.cargarDatos()
      } catch (err) { this.modalError = err.response?.data?.message || 'Error al guardar' }
    },
    async eliminar(id) {
      if (!confirm('¿Eliminar este mantenimiento?')) return
      try { await api.delete(`/mantenimientos/${id}`); await this.cargarDatos() }
      catch { alert('Error al eliminar') }
    },
    formatFecha(f) {
      if (!f) return '—'
      return new Date(f).toLocaleDateString('es-CO', { day:'2-digit', month:'2-digit', year:'numeric' })
    }
  }
}
</script>