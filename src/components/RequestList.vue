<template>
  <div class="appeals-list">
    <h1>Список заявок</h1>
    <div class="search">
      <div class="pod_menu">
        <input v-model="searchQuery" placeholder="Поиск (№ заявки, название)" @input="fetchAppeals" />
        <button @click="openCreateModal">Создать</button>
      </div>
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Создана</th>
          <th>Адрес</th>
          <th>Заявитель</th>
          <th>Описание</th>
          <th>Срок</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appeal in appeals" :key="appeal.id">
          <td @click="openEditModal(appeal.id)">
            <div class="id">
              {{ appeal.number }}
            </div>
          </td>
          <td>{{ formatDate(appeal.created_at) }}</td>
          <td>{{ formatAddress(appeal.premise, appeal.apartment) }}</td>
          <td>{{ formatApplicant(appeal.applicant) }}</td>
          <td>{{ appeal.description }}</td>
          <td>{{ formatDateTime(appeal.due_date) }}</td>
          <td>{{ appeal.status.name }}</td>
        </tr>
      </tbody>
    </table>
    <pagination 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @change-page="fetchAppeals" 
    />
    <edit-modal 
      v-if="isModalOpen" 
      @close="closeEditModal" 
      :appeal-id="selectedAppealId" 
      @update="fetchAppeals" 
    />
    <CreateRequestModal 
      :isOpen="isCreateModalOpen" 
      @close="closeCreateModal" 
      @requestCreated="refreshRequestList" 
    />
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import EditModal from '@/components/EditModal.vue';
import Pagination from '@/components/PaginationComponent.vue';
import CreateRequestModal from './CreateRequestModal.vue';

export default {
  components: {
    EditModal,
    Pagination,
    CreateRequestModal
  },
  data() {
    return {
      appeals: [],
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      isModalOpen: false,
      selectedAppealId: null,
      isCreateModalOpen: false,
      pageSize: 10 
    };
  },
  mounted() {
    this.checkAuth();
    this.fetchAppeals();
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.$router.push('/login');
      }
    },
    formatApplicant(applicant) {
      if (!applicant) return '';

      const { last_name, first_name, patronymic_name } = applicant;

      const formattedFirstName = first_name ? first_name.charAt(0).toUpperCase() + '.' : '';
      const formattedPatronymic = patronymic_name ? patronymic_name.charAt(0).toUpperCase() + '.' : '';

      return `${last_name} ${formattedFirstName} ${formattedPatronymic}`.trim();
    },
    formatDateTime(dateTime) {
      if (!dateTime) return '';

      const date = new Date(dateTime);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}.${month}.${year} ${hours}:${minutes}`;
    },
    formatDate(dateString) {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    },
    formatAddress(premise, apartment) {
      const street = premise?.street || 'улица не указана';
      const house = premise?.house || 'дом не указан';
      const apartmentNumber = apartment?.number || '';
      return `${street}, ${house}${apartmentNumber ? ', кв. ' + apartmentNumber : ''}`;
    },
    async fetchAppeals(page = 1) {
      try {
        const response = await axios.get(`https://dev.moydomonline.ru/api/appeals/v1.0/appeals/?search=${this.searchQuery}&page=${page}&page_size=${this.pageSize}`);
        this.appeals = response.data.results;
        this.currentPage = page;  
        this.totalPages = Math.ceil(response.data.count / this.pageSize); 
      } catch (error) {
        console.error(error);
      }
    },
    openEditModal(appealId) {
      this.selectedAppealId = appealId;
      this.isModalOpen = true;
    },
    closeEditModal() {
      this.selectedAppealId = null;
      this.isModalOpen = false;
    },
    openCreateModal() {
      this.isCreateModalOpen = true;
    },
    closeCreateModal() {
      this.isCreateModalOpen = false;
    },
    refreshRequestList() {
      this.fetchAppeals(this.currentPage);
    }
  }
}
</script>