<template>
  <MainLayout>
    <div class="page-header">
      <h1>🏛️ Laboratorios</h1>
      <button class="btn-primary" @click="abrirModal()">+ Nuevo laboratorio</button>
    </div>

    <div v-if="cargando" class="estado">Cargando...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>

    <table v-else>
      <thead>
        <tr>
          <th>Nombre</th><th>Capacidad</th><th>Ubicación</th>
          <th>Sede</th><th>Responsable</th><th>Estado</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lab in laboratorios" :key="lab.id">
          <td>{{ lab.nombre }}</td>
          <td>{{ lab.capacidad }}</td>
          <td>{{ lab.ubicacion }}</td>
          <td>{{ lab.sede }}</td>
          <td>{{ lab.responsable || '—' }}</td>
          <td><span :class="'badge ' + (lab.estado ? 'activo' : 'inactivo')">{{ lab.estado ? 'Activo' : 'Inactivo' }}</span></td>
          <td>
            <button class="btn-sm" @click="abrirModal(lab)">Editar</button>
            <button class="btn-sm danger" @click="eliminar(lab.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <AppModal v-if="modal" :titulo="form.id ? 'Editar Laboratorio' : 'Nuevo Laboratorio'" :error="modalError" @cerrar="modal=false" @guardar="guardar">
      <div class="form-group"><label>Nombre</label><input v-model="form.nombre" placeholder="Nombre del laboratorio" /></div>
      <div class="form-group"><label>Capacidad</label><input v-model="form.capacidad" type="number" placeholder="Capacidad" /></div>
      <div class="form-group"><label>Ubicación</label><input v-model="form.ubicacion" placeholder="Ubicación" /></div>
      <div class="form-group">
        <label>Estado</label>
        <select v-model="form.estado">
          <option :value="true">Activo</option>
          <option :value="false">Inactivo</option>
        </select>
      </div>
      <div class="form-group">
        <label>Sede</label>
        <select v-model="form.sede_id">
          <option v-for="s in sedes" :key="s.id" :value="s.id">{{ s.nombre }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Responsable</label>
        <select v-model="form.responsable_id">
          <option :value="null">— Sin responsable —</option>
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
  name: 'LaboratoriosView',
  components: { MainLayout, AppModal },
  data() {
    return {
      laboratorios: [], sedes: [], usuarios: [],
      cargando: true, error: '', modal: false, modalError: '', form: {}
    }
  },
  async mounted() { await this.cargarDatos() },
  methods: {
    async cargarDatos() {
      try {
        const [labs, sedes, usuarios] = await Promise.all([
          api.get('/laboratorios'), api.get('/sedes'), api.get('/usuarios')
        ])
        this.laboratorios = labs.data.data
        this.sedes        = sedes.data.data
        this.usuarios     = usuarios.data.data
      } catch { this.error = 'Error al cargar los datos' }
      finally  { this.cargando = false }
    },
    abrirModal(lab = {}) { this.modalError = ''; this.form = { ...lab }; this.modal = true },
    async guardar() {
      try {
        this.form.id
          ? await api.put(`/laboratorios/${this.form.id}`, this.form)
          : await api.post('/laboratorios', this.form)
        this.modal = false
        await this.cargarDatos()
      } catch (err) { this.modalError = err.response?.data?.message || 'Error al guardar' }
    },
    async eliminar(id) {
      if (!confirm('¿Eliminar este laboratorio?')) return
      try { await api.delete(`/laboratorios/${id}`); await this.cargarDatos() }
      catch { alert('Error al eliminar') }
    }
  }
}
</script>