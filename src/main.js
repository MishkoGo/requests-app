import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

Vue.prototype.$http = axios;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
