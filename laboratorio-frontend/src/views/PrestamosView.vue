<template>
  <MainLayout>
    <div class="page-header">
      <h1>🤝 Préstamos</h1>
      <button class="btn-primary" @click="abrirModal()">+ Nuevo préstamo</button>
    </div>

    <div v-if="cargando" class="estado">Cargando...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th><th>Solicitud</th><th>Técnico</th><th>Fecha entrega</th>
          <th>Dev. esperada</th><th>Estado</th><th>Accesorios</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in prestamos" :key="p.id">
          <td>#{{ p.id }}</td>
          <td>#{{ p.solicitud_id }}</td>
          <td>{{ p.tecnico }}</td>
          <td>{{ formatFecha(p.fecha_entrega) }}</td>
          <td>{{ formatFecha(p.fecha_dev_esperada) }}</td>
          <td><span :class="'badge ' + p.estado">{{ p.estado }}</span></td>
          <td>{{ p.accesorios || '—' }}</td>
          <td>
            <button class="btn-sm" @click="abrirModal(p)">Editar</button>
            <button class="btn-sm danger" @click="eliminar(p.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <AppModal v-if="modal" :titulo="form.id ? 'Editar Préstamo' : 'Nuevo Préstamo'" :error="modalError" @cerrar="modal=false" @guardar="guardar">
      <div class="form-group"><label>Fecha entrega</label><input v-model="form.fecha_entrega" type="datetime-local" /></div>
      <div class="form-group"><label>Fecha devolución esperada</label><input v-model="form.fecha_dev_esperada" type="datetime-local" /></div>
      <div class="form-group"><label>Accesorios</label><textarea v-model="form.accesorios" rows="2" placeholder="Accesorios incluidos" /></div>
      <div class="form-group" v-if="form.id">
        <label>Estado</label>
        <select v-model="form.estado">
          <option value="activo">Activo</option>
          <option value="devuelto">Devuelto</option>
          <option value="vencido">Vencido</option>
        </select>
      </div>
      <div class="form-group">
        <label>Solicitud</label>
        <select v-model="form.solicitud_id">
          <option v-for="s in solicitudes" :key="s.id" :value="s.id">#{{ s.id }} — {{ s.usuario }}</option>
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
  name: 'PrestamosView',
  components: { MainLayout, AppModal },
  data() {
    return {
      prestamos: [], solicitudes: [], tecnicos: [],
      cargando: true, error: '', modal: false, modalError: '', form: {}
    }
  },
  async mounted() { await this.cargarDatos() },
  methods: {
    async cargarDatos() {
      try {
        const [pres, sol, usuarios] = await Promise.all([
          api.get('/prestamos'), api.get('/solicitudes'), api.get('/usuarios')
        ])
        this.prestamos   = pres.data.data
        this.solicitudes = sol.data.data
        this.tecnicos    = usuarios.data.data.filter(u => u.rol === 'Técnico' || u.rol === 'Administrador')
      } catch { this.error = 'Error al cargar los datos' }
      finally  { this.cargando = false }
    },
    abrirModal(p = {}) { this.modalError = ''; this.form = { ...p }; this.modal = true },
    async guardar() {
      try {
        this.form.id
          ? await api.put(`/prestamos/${this.form.id}`, this.form)
          : await api.post('/prestamos', this.form)
        this.modal = false
        await this.cargarDatos()
      } catch (err) { this.modalError = err.response?.data?.message || 'Error al guardar' }
    },
    async eliminar(id) {
      if (!confirm('¿Eliminar este préstamo?')) return
      try { await api.delete(`/prestamos/${id}`); await this.cargarDatos() }
      catch { alert('Error al eliminar') }
    },
    formatFecha(f) {
      if (!f) return '—'
      return new Date(f).toLocaleDateString('es-CO', { day:'2-digit', month:'2-digit', year:'numeric' })
    }
  }
}
</script>