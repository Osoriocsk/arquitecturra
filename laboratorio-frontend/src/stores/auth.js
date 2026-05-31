import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token:   localStorage.getItem('token') || null,
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    rol:             state => state.usuario?.rol    || null,
    nombre:          state => state.usuario?.nombre || null,
    id:              state => state.usuario?.id     || null,
  },

  actions: {
    async login(correo, contrasena) {
      const { data } = await api.post('/auth/login', { correo, contrasena })
      this.token   = data.token
      this.usuario = data.usuario
      localStorage.setItem('token',   data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
    },

    logout() {
      this.token   = null
      this.usuario = null
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    },

    rutaSegunRol() {
      const rutas = {
        'Administrador': '/dashboard',
        'Coordinador':   '/coordinador',
        'Técnico':       '/tecnico',
        'Solicitante':   '/solicitante',
      }
      return rutas[this.rol] || '/dashboard'
    }
  },
})