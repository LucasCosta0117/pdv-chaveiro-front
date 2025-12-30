<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <TitlePage :title="title" :subtitle="subtitle" />
      </v-col>
    </v-row>

    <v-row class="align-center">
      <!-- Input para pesquisa na tabela de registros -->
      <v-col cols="12">
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
    </v-row>

    <v-row>
      <v-col cols="12">
        <!-- Tabela de registros -->
        <DataListTable
          :search="search"
          :headers="tableHeader"
          :items="sales"
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

export default {
  name:'HistoryView',
  components: {
    DataListTable,
    TitlePage
  },
  data() {
    return {
      // Título da página
      title: 'HIstórico de Vendas',
      // Subtítulo da página
      subtitle: 'Consulte as vendas realizadas em sua loja',
      // Array de objetos que define as colunas da tabela.
      tableHeader: [],
      // Array de objetos com os dados para exibir os detalhes adicionais no DetailsDialog.
      tableDetails: [],
      // Termo de busca para filtro no v-data-table
      search: ''
    }
  },
  computed: {
    // Array de objetos contendo os dados a serem exibidos na tabela.
    ...mapGetters('sales', { sales: 'getItems' }),
  },
  methods: {
    ...mapActions('sales', ['fetchSales']),
  },
  async created() {
    if (!this.sales.length) {
      await this.fetchSales();
    }
    this.tableHeader = [
      { title: 'Código', key: 'code' },
      { title: 'Data Venda', key: 'createdAt' },
      { title: 'Subtotal', key: 'subtotal' },
      { title: 'Descontos', key: 'totalDiscount' },
      { title: 'Total Pago', key: 'total'},
      { title: 'Status Pagamento', key: 'paymentStatus'}
    ];
    this.tableDetails = [
      { title: 'Código', key: 'code' },
      { title: 'Data Venda', key: 'createdAt' },
      { title: 'Subtotal', key: 'subtotal' },
      { title: 'Descontos', key: 'totalDiscount' },
      { title: 'Total Pago', key: 'total'},
      { title: 'Status Pagamento', key: 'paymentStatus'},
      { title: 'Vendedor', key: 'userId' },
      { title: 'Nota Fiscal', key: 'fiscalNumber' },
      { title: 'Produtos/Serviços', key: 'items' },
      { title: 'Pagamento', key: 'payments' }
    ];
  }
}

</script>
<style scoped>

</style>