<template>
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage <= 1">&lt;</button>

    <span v-for="page in visiblePages" :key="page" 
          :class="{ active: currentPage === page }" 
          @click="changePage(page)">
      {{ page }}
    </span>

    <button @click="nextPage">&gt;</button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  computed: {
    visiblePages() {
      const pagesToShow = 5; 
      const half = Math.floor(pagesToShow / 2);

      let start = Math.max(1, this.currentPage - half);
      let end = Math.min(this.totalPages, this.currentPage + half);

      if (this.currentPage - half <= 0) {
        end = Math.min(this.totalPages, start + pagesToShow - 1);
      } else if (this.currentPage + half >= this.totalPages) {
        start = Math.max(1, end - pagesToShow + 1);
      }

      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit('change-page', this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit('change-page', this.currentPage + 1);
      }
    },
    changePage(page) {
      if (page !== this.currentPage) {
        this.$emit('change-page', page);
      }
    }
  }
}
</script>

