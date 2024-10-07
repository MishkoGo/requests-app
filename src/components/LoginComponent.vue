<template>
    <div class="login">
      <h1>Авторизация</h1>
      <form @submit.prevent="login">
        <div class="call"> <img src="@/assets/call.png" width="20px"><input v-model="username" type="text" placeholder="Логин или Телефон" required /></div>
       <div class="pass"> <img src="@/assets/pass.png" width="20px"> <input v-model="password" type="password" placeholder="Пароль" required /></div>
       
        <button type="submit">Войти</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await this.$http.post('https://dev.moydomonline.ru/api/auth/login/', {
            username: this.username,
            password: this.password
          });
          localStorage.setItem('authToken', response.data.key);
          this.$router.push('/');
        } catch (error) {
          this.errorMessage = 'Неправильные данные';
        }
      }
    }
  }
  </script>
