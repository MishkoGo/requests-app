<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>Редактировать заявку</h2>
      <form @submit.prevent="submitForm">
        <label>Адрес</label>
        <input v-model="request.premise" />
      
        <button type="submit">Сохранить</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    request: {
      type: Object,
      required: true,
    },
  },
  methods: {
    submitForm() {
      fetch(`https://dev.moydomonline.ru/api/appeals/v1.0/appeals/${this.request.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.request),
      })
      .then(response => response.json())
      .then(data => {
        this.$emit('close');
      })
      .catch(error => console.error(error));
    },
  },
};
</script>
