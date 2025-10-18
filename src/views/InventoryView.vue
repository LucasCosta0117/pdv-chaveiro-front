<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <TitlePage :title="title" :subtitle="subtitle" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <!-- Input para pesquisa na tabela de registros -->
        <v-text-field
          v-model="search"
          label="Pesquisar"
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
          :headers="productsHeaders"
          :products="productsItems"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import ProductsTable from '@/components/ProductsTable.vue';
import TitlePage from '@/components/TitlePage.vue';
import { mapActions, mapGetters } from 'vuex';

/**
 * Padroniza os textos usados como Título e Subtítulo de uma View.
 */
export default {
  name: 'InventoryView',
  components: {
    ProductsTable,
    TitlePage
  },
  data() {
    return {
      title: 'Catálogo de Produtos',
      subtitle: 'Busque pelos itens da sua loja',
      productsHeaders: [
        { title: 'Produto', key: 'name' },
        { title: 'Marca', key: 'brand' },
        { title: 'Preço', key: 'price' },
        { title: 'Código', key: 'code' },
        { title: 'Estoque', key: 'stock' }
      ],
      search: ''
    }
  },
  computed: {
    ...mapGetters('products', { productsItems: 'getItems' })
  },
  methods: {
    ...mapActions('products', ['fetchProducts'])
  },
  async created() {
    await this.fetchProducts();
  }
}
</script>
<style scoped>

</style>