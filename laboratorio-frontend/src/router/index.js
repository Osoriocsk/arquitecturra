import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login',         name: 'login',         component: () => import('../views/LoginView.vue'),         meta: { publico: true } },
    { path: '/dashboard',     name: 'dashboard',     component: () => import('../views/DashboardView.vue'),     meta: { requiereAuth: true } },
    { path: '/equipos',       name: 'equipos',       component: () => import('../views/EquiposView.vue'),       meta: { requiereAuth: true } },
    { path: '/laboratorios',  name: 'laboratorios',  component: () => import('../views/LaboratoriosView.vue'),  meta: { requiereAuth: true } },
    { path: '/solicitudes',   name: 'solicitudes',   component: () => import('../views/SolicitudesView.vue'),   meta: { requiereAuth: true } },
    { path: '/prestamos',     name: 'prestamos',     component: () => import('../views/PrestamosView.vue'),     meta: { requiereAuth: true } },
    { path: '/devoluciones',  name: 'devoluciones',  component: () => import('../views/DevolucionesView.vue'),  meta: { requiereAuth: true } },
    { path: '/mantenimiento', name: 'mantenimiento', component: () => import('../views/MantenimientoView.vue'), meta: { requiereAuth: true } },
    { path: '/usuarios',      name: 'usuarios',      component: () => import('../views/UsuariosView.vue'),      meta: { requiereAuth: true, roles: ['Administrador'] } },
    { path: '/reportes',      name: 'reportes',      component: () => import('../views/ReportesView.vue'),      meta: { requiereAuth: true, roles: ['Administrador', 'Coordinador'] } },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
    { path: '/solicitante', name: 'solicitante', component: () => import('../views/SolicitanteView.vue'), meta: { requiereAuth: true, roles: ['Solicitante'] } },
    { path: '/tecnico', name: 'tecnico', component: () => import('../views/TecnicoView.vue'), meta: { requiereAuth: true, roles: ['Técnico'] } },
    { path: '/coordinador', name: 'coordinador', component: () => import('../views/CoordinadorView.vue'), meta: { requiereAuth: true, roles: ['Coordinador'] } },
  ]
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.publico) return next()
  if (to.meta.requiereAuth && !auth.isAuthenticated) return next('/login')
  if (to.meta.roles && !to.meta.roles.includes(auth.rol)) return next('/dashboard')
  next()
})

export default router