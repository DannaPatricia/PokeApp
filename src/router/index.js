import { createRouter, createWebHistory } from 'vue-router'
import PokeView from '../views/PokeView.vue'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // url para el NotFound.vue al momento de acceder a un pokemon que no existe
    {
      path: '/404/:resource',
      name: '404Resource',
      component: NotFound,
      props: true,
    },
    {
      path: '/',
      name: 'PokeView',
      component: PokeView,
      // obtengo el objeto con route con los valores de la url
    // Esto pasa el valor a entero y sino lo encuentra le asigna 1
      props: route => ({ page: parseInt(route.query.page) || 1 })
    },
    {
      path: '/pokemon/:pokemonName',
      name: 'PokeViewDetails',
      // debemos permitir el paso de props
      props: true,
      component: () => import ('@/views/PokeViewDetails.vue'), 
    },
  ],
})

export default router
