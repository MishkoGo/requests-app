import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authToken: null,
    appeals: []
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      state.authToken = token;
    },
    SET_APPEALS(state, appeals) {
      state.appeals = appeals;
    }
  },
  actions: {
    async fetchAppeals({ commit }) {
      const response = await axios.get('https://dev.moydomonline.ru/api/appeals/v1.0/appeals/');
      commit('SET_APPEALS', response.data.results);
    },
    async login({ commit }, { username, password }) {
      const response = await axios.post('https://dev.moydomonline.ru/api/auth/login/', { username, password });
      commit('SET_AUTH_TOKEN', response.data.key);
    }
  }
});
