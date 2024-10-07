<template>
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="$emit('close')">&times;</span>
        <h2>{{ isEditing ? 'Редактировать заявку' : 'Создать заявку' }}</h2>
        <form @submit.prevent="submitForm">
        <div class="house">
          <input v-model="form.premise_id" placeholder="Дом"  />
        </div>
        <div class="apartment">
          <input v-model="form.apartment_id" placeholder="Квартира"  />
        </div>
        <div class="datetime">
          <input v-model="form.due_date" type="datetime-local" />
        </div>
        <div class="lastname">
          <input v-model="form.applicant.last_name" placeholder="Фамилия" required />
        </div>
        <div class="firstname">
          <input v-model="form.applicant.first_name" placeholder="Имя" required />
        </div>
        <div class="patronymicname">
          <input v-model="form.applicant.patronymic_name" placeholder="Отчество" required />
        </div>
        <div class="tel">
          <input v-model="form.applicant.username" placeholder="Телефон" required />
        </div>
        <div class="description">
          <textarea v-model="form.description" placeholder="Описание"></textarea>
        </div>
        <div class="buttons-request">
          <button type="submit">{{ isEditing ? 'Сохранить' : 'Создать' }}</button>
        </div>
        </form>
  
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['appealId'],
    data() {
      return {
        form: {
          premise_id: '',
          apartment_id: '',
          applicant: {
            first_name: '',
            last_name: '',
            patronymic_name: '',
            username: ''
          },
          description: '',
          due_date: ''
        },
        isEditing: false,
        errorMessage: ''
      };
    },
    watch: {
      appealId: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.isEditing = true;
            this.fetchAppeal();
          } else {
            this.isEditing = false;
            this.resetForm();
          }
        }
      }
    },
    methods: {
      async fetchAppeal() {
        try {
          const response = await this.$http.get(`https://dev.moydomonline.ru/api/appeals/v1.0/appeals/${this.appealId}/`);
          this.form = response.data;
        } catch (error) {
          console.error(error);
        }
      },
      async submitForm() {
        try {
          if (this.isEditing) {
            await this.$http.patch(`https://dev.moydomonline.ru/api/appeals/v1.0/appeals/${this.appealId}/`, this.form);
          } else {
            await this.$http.post('https://dev.moydomonline.ru/api/appeals/v1.0/appeals/', this.form);
          }
          this.$emit('close');
          this.$emit('update'); 
        } catch (error) {
          this.errorMessage = error.response.data;
        }
      },
      resetForm() {
        this.form = {
          premise_id: '',
          apartment_id: '',
          applicant: {
            first_name: '',
            last_name: '',
            patronymic_name: '',
            username: ''
          },
          description: '',
          due_date: ''
        };
      }
    }
  };
  </script>
