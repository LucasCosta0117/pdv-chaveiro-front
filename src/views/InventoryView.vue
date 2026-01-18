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

    <v-row>
      <v-col cols="12">
        <!-- Botão para adicionar novo item -->
        <v-btn 
          prepend-icon="mdi-plus-thick" 
          color="roxo_w1"
          variant="flat"
          @click="showActionForm = true"
        >
          {{ labelActionFormBtn }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <ActionFormDialog
        v-model:showModal="showActionForm"
        :entity="itemType"
        :config="actionFormConfig"
      />
    </v-row>
  </v-container>
</template>
<script>
import ActionFormDialog from '@/components/ActionFormDialog.vue';
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
    TitlePage,
    ActionFormDialog
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
      itemType: 'products', 
      // Opções para o v-select
      itemTypeOptions: [
        { title: 'Produtos', value: 'products' },
        { title: 'Serviços', value: 'jobs' }
      ],
      showActionForm: false,
      actionFormConfig: []
    }
  },
  computed: {
    ...mapGetters('products', { products: 'getItems' }),
    ...mapGetters('jobs', { jobs: 'getItems' }),
    // Array de objetos contendo os dados a serem exibidos na tabela.
    tableItems() {
      return this.itemType === 'products' ? this.products : this.jobs;
    },
    labelActionFormBtn() {
      return `Cadastrar novo ${(this.itemType == 'products') ? 'produto' : 'serviço'}`
    },
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
    ...mapActions('products', { fetchProducts: 'fetchAll' }),
    ...mapActions('jobs', { fetchJobs: 'fetchAll' }),
    /**
     * Define qual modulo será exibido no catálogo (Produtos ou Serviços).
     * 
     * @param {String} filter nome do módulo usado para filtrar os itens da tabela.
     *                          'products' | 'jobs'
     */
    setFilter(filter) {
      switch (filter) {
        case 'products':
          this.tableHeader = [
            { title: 'Produto', key: 'name' },
            { title: 'Código', key: 'code' },
            { title: 'Preço', key: 'price', type: 'currency' },
            { title: 'Estoque', key: 'stock' },
            { title: 'Categoria', key: 'category', filterable: true },
            { title: 'Subcategoria', key: 'subcategory', filterable: true }
          ];
          this.tableDetails = {
            header: {
              titleKey: 'name',
              imgKey: 'imgUrl'
            },
            fields: [
              { text: 'Marca', key: 'brand' },
              { text: 'Preço', key: 'price', type: 'currency' },
              { text: 'Código', key: 'code' },
              { text: 'Departamento', key: 'department' },
              { text: 'Categoria', key: 'category' },
              { text: 'Subcategoria', key: 'subcategory' },
              { text: 'Estoque', key: 'stock' },
              { text: 'À venda', key: 'canSale', type: 'bool' },
              { text: 'Disponível', key: 'isActive', type: 'bool' }
            ]
          };

          this.actionFormConfig = [
            { label: 'Nome do Produto', key: 'name', required: true },
            { label: 'Foto', key: 'imgUrl', type: 'image' },
            { label: 'Preço', key: 'price', type: 'currency', cols: 6, required: true },
            { label: 'Quantide em Estoque', key: 'stock', type: 'qtd', cols: 6, required: true },
            { label: 'Marca', key: 'brand' },
            { label: 'Código', key: 'code' },
            { label: 'Departamento', key: 'department', type: 'select', cols: 4, options: ['Vitrine', 'Insumo'] },
            { label: 'Categoria', key: 'category', type: 'select', cols: 4 },
            { label: 'Subcategoria', key: 'subcategory', type: 'select', cols: 4 },
            { label: 'À venda?', key: 'canSale', type: 'bool', cols: 6 },
            { label: 'Disponível?', key: 'isActive', type: 'bool', cols: 6 }
          ];

          break;
        case 'jobs':
          this.tableHeader = [
            { title: 'Serviço', key: 'name' },
            { title: 'Preço', key: 'price', type: 'currency' },
            { title: 'Código', key: 'code' },
            { title: 'Categoria', key: 'category', filterable: true },
            { title: 'Subcategoria', key: 'subcategory', filterable: true }
          ];
          this.tableDetails = {
            header: {
              titleKey: 'name'
            },
            fields: [
              { text: 'Preço', key: 'price', type: 'currency' },
              { text: 'Código', key: 'code' },
              { text: 'Categoria', key: 'category' },
              { text: 'Subcategoria', key: 'subcategory' },
              { text: 'Disponível', key: 'isActive', type: 'bool' }
            ]
          };

          this.actionFormConfig = [
            { label: 'Nome do Serviço', key: 'name', required: true},
            { label: 'Código', key: 'code' },
            { label: 'Preço', key: 'price', type: 'currency', cols: 6, required: true },
            { label: 'Disponível', key: 'isActive', type: 'bool', cols: 6 },
            { label: 'Categoria', key: 'category', type: 'select', cols: 6 },
            { label: 'Subcategoria', key: 'subcategory', type: 'select', cols: 6 }
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