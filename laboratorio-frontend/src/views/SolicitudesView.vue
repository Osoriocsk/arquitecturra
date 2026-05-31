<template>
  <MainLayout>
    <div class="page-header">
      <h1>📋 Solicitudes</h1>
      <button class="btn-primary" @click="abrirModal()">+ Nueva solicitud</button>
    </div>

    <div v-if="cargando" class="estado">Cargando...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th><th>Usuario</th><th>Fecha inicio</th>
          <th>Fecha fin</th><th>Estado</th><th>Observación</th><th>Acciones</th>
        </tr>
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
            <button class="btn-sm" @click="abrirModal(s)">Editar</button>
            <button class="btn-sm danger" @click="eliminar(s.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <AppModal v-if="modal" :titulo="form.id ? 'Editar Solicitud' : 'Nueva Solicitud'" :error="modalError" @cerrar="modal=false" @guardar="guardar">
      <div class="form-group"><label>Fecha inicio</label><input v-model="form.fecha_inicio" type="datetime-local" /></div>
      <div class="form-group"><label>Fecha fin</label><input v-model="form.fecha_fin" type="datetime-local" /></div>
      <div class="form-group"><label>Observación</label><textarea v-model="form.observacion" rows="3"></textarea></div>
      <div class="form-group" v-if="form.id">
        <label>Estado</label>
        <select v-model="form.estado">
          <option value="pendiente">Pendiente</option>
          <option value="aprobada">Aprobada</option>
          <option value="rechazada">Rechazada</option>
          <option value="completada">Completada</option>
        </select>
      </div>
      <div class="form-group" v-if="form.estado === 'rechazada'">
        <label>Motivo de rechazo</label>
        <textarea v-model="form.motivo_rechazo" rows="2"></textarea>
      </div>
      <div class="form-group">
        <label>Usuario</label>
        <select v-model="form.usuario_id">
          <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.nombre }}</option>
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
  name: 'SolicitudesView',
  components: { MainLayout, AppModal },
  data() {
    return {
      solicitudes: [], usuarios: [],
      cargando: true, error: '', modal: false, modalError: '', form: {}
    }
  },
  async mounted() { await this.cargarDatos() },
  methods: {
    async cargarDatos() {
      try {
        const [sol, usuarios] = await Promise.all([
          api.get('/solicitudes'),
          api.get('/usuarios'),
        ])
        this.solicitudes = sol.data.data
        this.usuarios    = usuarios.data.data
      } catch { this.error = 'Error al cargar los datos' }
      finally  { this.cargando = false }
    },
    abrirModal(s = {}) { this.modalError = ''; this.form = { ...s }; this.modal = true },
    async guardar() {
      try {
        this.form.id
          ? await api.put(`/solicitudes/${this.form.id}`, this.form)
          : await api.post('/solicitudes', this.form)
        this.modal = false
        await this.cargarDatos()
      } catch (err) { this.modalError = err.response?.data?.message || 'Error al guardar' }
    },
    async eliminar(id) {
      if (!confirm('¿Eliminar esta solicitud?')) return
      try { await api.delete(`/solicitudes/${id}`); await this.cargarDatos() }
      catch { alert('Error al eliminar') }
    },
    formatFecha(f) {
      if (!f) return '—'
      return new Date(f).toLocaleDateString('es-CO', { day:'2-digit', month:'2-digit', year:'numeric' })
    }
  }
}
</script>