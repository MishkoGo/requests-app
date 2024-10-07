<template>
  <div class="auth">
    <h2>Авторизация</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Логин или Телефон:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label for="password">Пароль:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Войти</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://dev.moydomonline.ru/api/auth/login/', {
          username: this.username,
          password: this.password,
        });
        
        const token = response.data.key;
        localStorage.setItem('authToken', token); 
        this.$router.push('/'); 
      } catch (error) {
        this.errorMessage = 'Неправильные данные';
      }
    },
  },
};
</script>
