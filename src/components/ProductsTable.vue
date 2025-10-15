<template>
  <v-data-table 
    class="products-table-container"
    :headers="headers"
    :items="products"
    :items-per-page="10"
    :search="search"
  />
</template>
<script>
export default {
  name: 'ProductsTable',
  props: {
    search: {
      type: String,
      default: ''
    },
    headers: {
      type: Array,
      default: () => ([])
    },
    products: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      //
    }
  }
}
</script>
<style scoped>
.products-table-container {
  border: solid 1px rgb(var(--v-theme-cinza_w2), 0.5);
  border-radius: 0.25rem;
}
</style>