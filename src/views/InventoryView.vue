<template>
  <v-container>
    <h3>Catálogo de Produtos</h3>
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
        { title: 'Produto', key: 'nome' },
        { title: 'Marca', key: 'marca' },
        { title: 'Código', key: 'codigo' },
        { title: 'Preço', key: 'preco' }
      ];
      this.products = [
        { 
          id: 1, 
          nome: 'Carimbo', 
          marca: 'Colop', 
          codigo: '123123', 
          departamento: 'vitrine', 
          categoria: 'carimbo', 
          subcategoria: 'carimbo', 
          preco: '14.50', 
          qtd_estoque: '8',
          img_url: 'https://www.papermixrj.com.br/uploads/produtos/carimbo-automatico-38-x14-mm-automatico-17456051861725198316680bd24292d33.png',
          ativo: 1
        },
        { 
          id: 2, 
          nome: 'Caixa de Som 10W', 
          marca: 'JBL', 
          codigo: 'wr123BR', 
          departamento: 'vitrine', 
          categoria: 'eletrônicos', 
          subcategoria: 'caixa de som', 
          preco: '124.50',
          qtd_estoque: '2',
          img_url: 'https://m.media-amazon.com/images/I/71HdLDJEEUL._UF1000,1000_QL80_.jpg',
          ativo: 1
        },
        { 
          id: 3, 
          nome: 'Chave Paddo Tetra EF', 
          marca: 'Paddo', 
          codigo: '590/682', 
          departamento: 'chaveiro', 
          categoria: 'chave', 
          subcategoria: 'tetra', 
          preco: '0.00',
          qtd_estoque: '20',
          img_url: 'https://reidacutelaria.vtexassets.com/arquivos/ids/174653/955522.jpg?v=637467444143030000',
          ativo: 1
        },
        { 
          id: 4, 
          nome: 'Mola de alicate', 
          marca: 'Marca Alicate', 
          codigo: '222AAA', 
          departamento: 'chaveiro',
          categoria: 'reposição',
          subcategoria: 'alicate',
          preco: '0.00',
          qtd_estoque: '50',
          img_url: 'https://www.papermixrj.com.br/uploads/produtos/carimbo-automatico-38-x14-mm-automatico-17456051861725198316680bd24292d33.png',
          ativo: 1
        }
      ];
    }
  }
}

</script>
<style scoped>

</style>