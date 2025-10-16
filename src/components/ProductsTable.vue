<template>
  <div>
    <v-data-table
      striped="odd"
      hover
      class="products-table-container"
      :headers="headers"
      :items="products"
      :items-per-page="10"
      :search="search"
      @click:row="openDialog"
    />\

    <ProductDetailsDialog
      v-model:showModal="dialog"
      :product="selectedProduct"
    />
  </div>
</template>
<script>
import ProductDetailsDialog from './ProductDetailsDialog.vue';

export default {
  name: 'ProductsTable',
  components: {
    ProductDetailsDialog
  },
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
      dialog: false,
      selectedProduct: null
    }
  },
  methods: {
    openDialog(_, { item }) {
      this.dialog = true
      this.selectedProduct = item
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