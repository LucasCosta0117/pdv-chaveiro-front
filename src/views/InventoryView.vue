<template>
  <v-container>
    <h3>Catálogo de Produtos</h3>
    <!-- Input para pesquisa -->
    <v-text-field
      v-model="search"
      label="Buscar produto"
      density="comfortable"
      prepend-inner-icon="mdi-magnify"
      clearable
    />

    <!-- Tabela de registros -->
    <ProductsTable
      :search="search"
      :headers="headers"
      :products="products"
    />
  </v-container>
</template>
<script>
import ProductsTable from '@/components/ProductsTable.vue';

export default {
  name: 'InventoryView',
  components: {
    ProductsTable
  },
  data() {
    return {
      headers: [],
      products: [],
      search: ''
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData(){
      this.headers = [
        { title: 'Produto', key: 'name' },
        { title: 'Categoria', key: 'category' },
        { title: 'Preço', key: 'price' },
        { title: 'Ações', key: 'actions', sortable: false },
      ];
      this.products = [
        { id: 1, name: 'Cópia de Chave Simples', category: 'Serviços', price: 10.0 },
        { id: 2, name: 'Chaveiro Metálico', category: 'Acessórios', price: 15.5 },
        { id: 3, name: 'Amolação de Tesoura', category: 'Serviços', price: 20.0 },
      ];
    }
  }
}

</script>
<style scoped>

</style>