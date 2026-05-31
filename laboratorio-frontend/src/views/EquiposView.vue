<template>
  <MainLayout>
    <div class="page-header">
      <h1>🖥️ Equipos</h1>
      <button class="btn-primary" @click="abrirModal()">+ Nuevo equipo</button>
    </div>

    <div v-if="cargando" class="estado">Cargando...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>

    <table v-else>
      <thead>
        <tr>
          <th>Nombre</th><th>Serial</th><th>Marca</th><th>Modelo</th>
          <th>Estado</th><th>Laboratorio</th><th>Categoría</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="eq in equipos" :key="eq.id">
          <td>{{ eq.nombre }}</td>
          <td>{{ eq.serial }}</td>
          <td>{{ eq.marca }}</td>
          <td>{{ eq.modelo }}</td>
          <td><span :class="'badge ' + eq.estado">{{ eq.estado }}</span></td>
          <td>{{ eq.laboratorio }}</td>
          <td>{{ eq.categoria }}</td>
          <td>
            <button class="btn-sm" @click="abrirModal(eq)">Editar</button>
            <button class="btn-sm danger" @click="eliminar(eq.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <AppModal v-if="modal" :titulo="form.id ? 'Editar Equipo' : 'Nuevo Equipo'" :error="modalError" @cerrar="modal=false" @guardar="guardar">
      <div class="form-group"><label>Nombre</label><input v-model="form.nombre" placeholder="Nombre del equipo" /></div>
      <div class="form-group"><label>Serial</label><input v-model="form.serial" placeholder="Serial" /></div>
      <div class="form-group"><label>Marca</label><input v-model="form.marca" placeholder="Marca" /></div>
      <div class="form-group"><label>Modelo</label><input v-model="form.modelo" placeholder="Modelo" /></div>
      <div class="form-group"><label>Proveedor</label><input v-model="form.proveedor" placeholder="Proveedor" /></div>
      <div class="form-group"><label>Fecha adquisición</label><input v-model="form.fecha_adquisicion" type="date" /></div>
      <div class="form-group"><label>Valor</label><input v-model="form.valor" type="number" placeholder="Valor" /></div>
      <div class="form-group"><label>Vida útil (años)</label><input v-model="form.vida_util" type="number" placeholder="Vida útil" /></div>
      <div class="form-group">
        <label>Estado</label>
        <select v-model="form.estado">
          <option value="disponible">Disponible</option>
          <option value="prestado">Prestado</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="dado_de_baja">Dado de baja</option>
        </select>
      </div>
      <div class="form-group">
        <label>Laboratorio</label>
        <select v-model="form.laboratorio_id">
          <option v-for="lab in laboratorios" :key="lab.id" :value="lab.id">{{ lab.nombre }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Categoría</label>
        <select v-model="form.categoria_id">
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
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
  name: 'EquiposView',
  components: { MainLayout, AppModal },
  data() {
    return {
      equipos: [], laboratorios: [], categorias: [],
      cargando: true, error: '', modal: false, modalError: '', form: {}
    }
  },
  async mounted() { await this.cargarDatos() },
  methods: {
    async cargarDatos() {
      try {
        const [eq, labs, cats] = await Promise.all([
          api.get('/equipos'),
          api.get('/laboratorios'),
          api.get('/categorias'),
        ])
        this.equipos      = eq.data.data
        this.laboratorios = labs.data.data
        this.categorias   = cats.data.data
      } catch { this.error = 'Error al cargar los datos' }
      finally  { this.cargando = false }
    },
    abrirModal(eq = {}) { this.modalError = ''; this.form = { ...eq }; this.modal = true },
    async guardar() {
      try {
        this.form.id
          ? await api.put(`/equipos/${this.form.id}`, this.form)
          : await api.post('/equipos', this.form)
        this.modal = false
        await this.cargarDatos()
      } catch (err) { this.modalError = err.response?.data?.message || 'Error al guardar' }
    },
    async eliminar(id) {
      if (!confirm('¿Eliminar este equipo?')) return
      try { await api.delete(`/equipos/${id}`); await this.cargarDatos() }
      catch { alert('Error al eliminar') }
    }
  }
}
</script>