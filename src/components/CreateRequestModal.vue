<template>
    <div v-if="isOpen" class="modal">
      <div class="modal-content">
        <h2>Создание заявки</h2>
        
        <form @submit.prevent="createRequest">
          <div class="house">
            <input
              v-model="form.premise_id"
              list="premise-options"
              @input="searchPremises"
              required
              placeholder="Дом"
            />
            <datalist id="premise-options">
              <option v-for="premise in premises" :key="premise.id" :value="premise.id">{{ premise.address }}</option>
            </datalist>
          </div>
          
          <div class="apartment">
            <input
              v-model="form.apartment_id"
              list="apartment-options"
              @input="searchApartments"
              :disabled="!form.premise_id"
              required
              placeholder="Квартира"
            />
            <datalist id="apartment-options">
              <option v-for="apartment in apartments" :key="apartment.id" :value="apartment.id">{{ apartment.number }}</option>
            </datalist>
          </div>
          <div class="datetime">
            <input v-model="form.due_date" type="datetime-local" required placeholder="Срок" />
          </div>
          <div class="lastname">
            <input v-model="form.applicant.last_name" type="text" required placeholder="Фамилия" />
          </div>
          <div class="firstname">
            <input v-model="form.applicant.first_name" type="text" required placeholder="Имя" />
          </div>
          <div class="patronymicname">
            <input v-model="form.applicant.patronymic_name" type="text" required placeholder="Отчество" />
          </div>
  
          <div class="tel">
            <input v-model="form.applicant.username" type="text" required placeholder="Телефон" />
          </div>
  
          <div class="description">
            <textarea v-model="form.description" required placeholder="Описание заявки"></textarea>
          </div>
          <div class="buttons-request">
            <button type="submit">Создать заявку</button>
            <button @click="closeModal">Отмена</button>
          </div>
          <div v-if="error" class="error">{{ error }}</div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';

  export default {
    props: {
      isOpen: {
        type: Boolean,
        required: true
      }
    },
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
        premises: [],
        apartments: [],
        error: null
      };
    },
    methods: {
        async searchPremises() {
      try {
        const response = await axios.get('https://dev.moydomonline.ru/api/geo/v2.0/user-premises/', {
          params: { search: this.form.premise_id }
        });
        console.log(response.data);
        this.premises = response.data;
      } catch (error) {
        this.error = 'Ошибка при загрузке домов';
      }
    },


    async searchApartments() {
      try {
        const response = await axios.get('https://dev.moydomonline.ru/api/geo/v1.0/apartments/', {
          params: { premise_id: this.form.premise_id, search: this.form.apartment_id }
        });
        console.log(response.data);
        this.apartments = response.data;
      } catch (error) {
        this.error = 'Ошибка при загрузке квартир';
      }
    },
    async createRequest() {
  try {
    const localDueDate = new Date(this.form.due_date).toISOString(); 
    this.form.due_date = localDueDate.replace('Z', '+05:00'); 
    
    console.log('Отправляем данные:', JSON.stringify(this.form, null, 2));
    
    const response = await this.$http.post('https://dev.moydomonline.ru/api/appeals/v1.0/appeals', this.form);
    
    console.log('Заявка создана:', response.data);
    this.$emit('requestCreated');
    this.closeModal();
  } catch (error) {
    if (error.response) {
      console.error('Ошибка при создании заявки:', error.response.status, error.response.data);
      this.error = error.response.data.message || 'Ошибка при создании заявки';
    } else if (error.request) {
      console.error('Ошибка соединения с сервером:', error.request);
      this.error = 'Ошибка соединения с сервером.';
    } else {
      console.error('Ошибка:', error.message);
      this.error = 'Произошла ошибка.';
    }
  }
},
      closeModal() {
        this.$emit('close');
        this.error = null;
      }
    }
  };
  </script>