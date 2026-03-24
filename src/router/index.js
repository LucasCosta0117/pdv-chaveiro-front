import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store'

/**
 * Definição das Rotas do sistema.
 */
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/sales',
    name: 'sales',
    component: () => import('@/views/SaleStationView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('@/views/InventoryView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/HistoryView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // Sempre rola para o topo ao navegar entre páginas
    return { top: 0 }
  }
})

/**
 * Intercepta todas as navegações antes delas acontecerem,
 * garantindo a proteção de acesso as rotas/views (Navigation Guard).
 */
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = store.getters['auth/isAuthenticated']

  if (requiresAuth && !isAuthenticated) {
    // Cenário 1: Rota autenticada e sem token -> Redireciona para o Login
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    // Cenário 2: Possui token e tentou acessar o Login -> Redireciona para Home
    next({ name: 'home' })
  } else {
    // Cenário 3: Rota pública ou usuário autenticado.
    next()
  }
})

export default router
