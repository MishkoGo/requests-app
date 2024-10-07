import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/LoginComponent.vue';
import AppealsList from '@/components/RequestList.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'AppealsList',
      component: AppealsList
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); 
  
  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next(); 
  }
});

export default router;
