<template>
  <div class="login-container">
    <div class="login-card">

      <div class="login-header">
        <h1>🔬 Sistema de Laboratorios</h1>
        <p>Ingresa tus credenciales para continuar</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Correo electrónico</label>
          <input
            v-model="correo"
            type="email"
            placeholder="correo@laboratorio.edu.co"
            :disabled="cargando"
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input
            v-model="contrasena"
            type="password"
            placeholder="••••••••"
            :disabled="cargando"
          />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>

    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'LoginView',
  data() {
    return {
      correo:     '',
      contrasena: '',
      error:      '',
      cargando:   false,
    }
  },
  methods: {
    async handleLogin() {
      this.error    = ''
      this.cargando = true
      try {
        const auth = useAuthStore()
        await auth.login(this.correo, this.contrasena)
        this.$router.push(auth.rutaSegunRol())
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al iniciar sesión'
      } finally {
        this.cargando = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #666;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
}

button {
  width: 100%;
  padding: 0.85rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
}

button:hover:not(:disabled) {
  background: #4338ca;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #ef4444;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  text-align: center;
}
</style>