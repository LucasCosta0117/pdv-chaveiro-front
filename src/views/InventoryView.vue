<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <TitlePage :title="title" :subtitle="subtitle" />
      </v-col>
    </v-row>

    <v-row class="align-center">
      <!-- Input para pesquisa na tabela de registros -->
      <v-col cols="7" sm="8" md="9">
        <v-text-field
          v-model="search"
          label="Pesquisar no Catálogo"
          hide-details
          density="compact"
          variant="outlined"
          color="roxo_w1"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      
      <!-- Select para definir quais registro serão exibidos na tabela -->
      <v-col cols="5" sm="4" md="3">
        <v-select
          v-model="itemType"
          :items="itemTypeOptions"
          label="Tipo de Item"
          density="compact"
          variant="outlined"
          color="roxo_w1"
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <!-- Tabela de registros -->
        <DataListTable
          :search="search"
          :headers="tableHeader"
          :items="tableItems"
          :details="tableDetails"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import DataListTable from '@/components/DataListTable.vue';
import TitlePage from '@/components/TitlePage.vue';
import { mapActions, mapGetters } from 'vuex';

/**
 * Padroniza os textos usados como Título e Subtítulo de uma View.
 */
export default {
  name: 'InventoryView',
  components: {
    DataListTable,
    TitlePage
  },
  data() {
    return {
      // Título da página
      title: 'Catálogo de Produtos/Serviços',
      // Subtítulo da página
      subtitle: 'Consulte os itens disponíveis em sua loja',
      // Array de objetos que define as colunas da tabela.
      tableHeader: [],
      // Array de objetos com os dados para exibir os detalhes adicionais no DetailsDialog.
      tableDetails: [],
      // Termo de busca para filtro no v-data-table
      search: '',
      // Variável de controle para o v-select
      itemType: 'product', 
      // Opções para o v-select
      itemTypeOptions: [
        { title: 'Produtos', value: 'product' },
        { title: 'Serviços', value: 'job' }
      ]
    }
  },
  computed: {
    ...mapGetters('products', { products: 'getItems' }),
    ...mapGetters('jobs', { jobs: 'getItems' }),
    // Array de objetos contendo os dados a serem exibidos na tabela.
    tableItems() {
      return this.itemType === 'product' ? this.products : this.jobs;
    }
  },
  watch: {
    /**
     * Dispara a lógica de filtro sempre que 'itemType' mudar
     */
    itemType: {
      handler(newType) {
        this.setFilter(newType);
      },
      immediate: true
    },
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    ...mapActions('jobs', ['fetchJobs']),
    /**
     * Define qual modulo será exibido no catálogo (Produtos ou Serviços).
     * 
     * @param {String} filter nome do módulo usado para filtrar os itens da tabela.
     *                          'product' | 'jobs'
     */
    setFilter(filter) {
      switch (filter) {
        case 'product':
          this.tableHeader = [
            { title: 'Produto', key: 'name' },
            { title: 'Marca', key: 'brand' },
            { title: 'Preço', key: 'price' },
            { title: 'Código', key: 'code' },
            { title: 'Estoque', key: 'stock' }
          ];
          this.tableDetails = [
            { title: 'Produto', key: 'name' },
            { title: 'Marca', key: 'brand' },
            { title: 'Preço', key: 'price' },
            { title: 'Código', key: 'code' },
            { title: 'Departamento', key: 'department' },
            { title: 'Categoria', key: 'category' },
            { title: 'Subcategoria', key: 'subcategory' },
            { title: 'Estoque', key: 'stock' },
            { title: 'À venda', key: 'canSale' },
            { title: 'Disponível', key: 'isActive' }
          ];

          break;
        case 'job':
          this.tableHeader = [
            { title: 'Serviço', key: 'name' },
            { title: 'Preço', key: 'price' },
            { title: 'Código', key: 'code' }
          ];
          this.tableDetails = [
            { title: 'Serviço', key: 'name' },
            { title: 'Preço', key: 'price' },
            { title: 'Código', key: 'code' },
            { title: 'Categoria', key: 'category' },
            { title: 'Subcategoria', key: 'subcategory' },
            { title: 'Disponível', key: 'isActive' }
          ];
          
          break;
      }
    }
  },
  async created() {
    if (!this.products.length) {
      await this.fetchProducts();
    }
    if (!this.jobs.length) {
      await this.fetchJobs();
    }
  }
}
</script>
<style scoped>

</style>