<template>
  <MainLayout>
    <div class="page-header">
      <h1>👥 Usuarios</h1>
      <button class="btn-primary" @click="abrirModal()">+ Nuevo usuario</button>
    </div>

    <div v-if="cargando" class="estado">Cargando...</div>
    <div v-else-if="error" class="estado error">{{ error }}</div>

    <table v-else>
      <thead>
        <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        <tr v-for="u in usuarios" :key="u.id">
          <td>{{ u.nombre }}</td>
          <td>{{ u.correo }}</td>
          <td>{{ u.rol }}</td>
          <td><span :class="'badge ' + u.estado">{{ u.estado }}</span></td>
          <td>
            <button class="btn-sm" @click="abrirModal(u)">Editar</button>
            <button class="btn-sm danger" @click="eliminar(u.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <AppModal v-if="modal" :titulo="form.id ? 'Editar Usuario' : 'Nuevo Usuario'" :error="modalError" @cerrar="modal=false" @guardar="guardar">
      <div class="form-group"><label>Nombre</label><input v-model="form.nombre" placeholder="Nombre completo" /></div>
      <div class="form-group"><label>Correo</label><input v-model="form.correo" type="email" placeholder="correo@ejemplo.com" /></div>
      <div class="form-group" v-if="!form.id">
        <label>Contraseña</label>
        <input v-model="form.contrasena" type="password" placeholder="Contraseña" />
      </div>
      <div class="form-group" v-if="form.id">
        <label>Estado</label>
        <select v-model="form.estado">
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
      <div class="form-group">
        <label>Rol</label>
        <select v-model="form.rol_id">
          <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.nombre }}</option>
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
  name: 'UsuariosView',
  components: { MainLayout, AppModal },
  data() {
    return {
      usuarios: [], roles: [],
      cargando: true, error: '', modal: false, modalError: '', form: {}
    }
  },
  async mounted() { await this.cargarDatos() },
  methods: {
    async cargarDatos() {
      try {
        const [usuarios, roles] = await Promise.all([
          api.get('/usuarios'),
          api.get('/roles'),
        ])
        this.usuarios = usuarios.data.data
        this.roles    = roles.data.data
      } catch { this.error = 'Error al cargar los datos' }
      finally  { this.cargando = false }
    },
    abrirModal(u = {}) { this.modalError = ''; this.form = { ...u }; this.modal = true },
    async guardar() {
      try {
        this.form.id
          ? await api.put(`/usuarios/${this.form.id}`, this.form)
          : await api.post('/usuarios', this.form)
        this.modal = false
        await this.cargarDatos()
      } catch (err) { this.modalError = err.response?.data?.message || 'Error al guardar' }
    },
    async eliminar(id) {
      if (!confirm('¿Eliminar este usuario?')) return
      try { await api.delete(`/usuarios/${id}`); await this.cargarDatos() }
      catch { alert('Error al eliminar') }
    }
  }
}
</script>