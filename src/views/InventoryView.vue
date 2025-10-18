<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h3>Catálogo de Produtos</h3>
        <p>Consulte todos os itens da sua loja</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <!-- Input para pesquisa -->
        <v-text-field
          v-model="search"
          label="Buscar produto"
          hide-details
          density="compact"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <!-- Tabela de registros -->
        <ProductsTable
          :search="search"
          :headers="headers"
          :products="products"
        />
      </v-col>
    </v-row>
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
    async fetchData(){
      this.headers = [
        { title: 'Produto', key: 'name' },
        { title: 'Marca', key: 'brand' },
        { title: 'Preço', key: 'price' },
        { title: 'Código', key: 'code' },
        { title: 'Estoque', key: 'stock' }
      ];

      try {
        const response = await fetch('http://localhost:8080/api/product/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
  
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        this.products = data;
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    }
  }
}
</script>
<style scoped>

</style>