<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4" style="min-height: 100vh;">
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">
          {{ greeting }} 👋
        </h1>
        <p class="text-subtitle-1 text-grey-darken-1">
          Aqui está o resumo do seu caixa e estoque de hoje.
        </p>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-card elevation="2" class="rounded-lg pa-4 border-l-4 border-success">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-overline text-grey-darken-1 mb-1">Vendas Hoje</div>
              <div class="text-h4 font-weight-black text-success">
                {{ $formatCurrency(summaryTheDay.todaySales) }}
              </div>
            </div>
            <v-avatar color="success-lighten-4" size="56">
              <v-icon color="success" size="32">mdi-cash-register</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="rounded-lg pa-4 border-l-4 border-primary">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-overline text-grey-darken-1 mb-1">Atendimentos</div>
              <div class="text-h4 font-weight-black text-primary">
                {{ summaryTheDay.todayTransactions }}
              </div>
            </div>
            <v-avatar color="primary-lighten-4" size="56">
              <v-icon color="primary" size="32">mdi-account-group</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="rounded-lg pa-4 border-l-4 border-info">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-overline text-grey-darken-1 mb-1">Ticket Médio</div>
              <div class="text-h4 font-weight-black text-info">
                {{ $formatCurrency(summaryTheDay.averageTicket) }}
              </div>
            </div>
            <v-avatar color="info-lighten-4" size="56">
              <v-icon color="info" size="32">mdi-chart-line</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2" class="rounded-lg h-100">
          <v-card-title class="d-flex align-center pa-4 border-b">
            <v-icon color="grey-darken-2" class="mr-2">mdi-history</v-icon>
            Últimas Vendas
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary" size="small" @click="goToHistory">
              Ver Histórico Completo
            </v-btn>
          </v-card-title>
          
          <v-data-table
            :headers="recentSalesHeaders"
            :items="recentSales"
            density="comfortable"
            hide-default-footer
          >
            <template #[`item.createdAt`]="{ value }">
              {{ $formatDateTime(value) }}
            </template>
            <template #[`item.status`]="{ value }">
              <v-chip
                :color="getStatusColor(value)"
                size="small"
                variant="flat"
                class="font-weight-medium"
                label
              >
                {{ value }}
              </v-chip>
            </template>
            <template #[`item.total`]="{ value }">
              <span class="font-weight-bold">{{ $formatCurrency(value) }}</span>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" class="d-flex flex-column gap-4">
        <v-card elevation="2" class="rounded-lg mb-4">
          <v-card-title class="pa-4 border-b">
            <v-icon color="grey-darken-2" class="mr-2">mdi-lightning-bolt</v-icon>
            Ações Rápidas
          </v-card-title>
          <v-card-text class="pa-4">
            <v-btn block color="primary" size="large" class="mb-3" prepend-icon="mdi-cart-plus" @click="goToPos">
              Nova Venda / Caixa
            </v-btn>
            <v-btn block color="secondary" size="large" class="mb-3" prepend-icon="mdi-plus-box" @click="goToCatalog">
              Cadastrar Produto
            </v-btn>
            <v-btn block color="roxo_w1" size="large" class="mb-3" prepend-icon="mdi-plus-box" @click="goToCatalog">
              Cadastrar Serviço
            </v-btn>
            <v-btn disabled block color="cinza_w1" size="large" class="mb-3" prepend-icon="mdi-chart-bar" @click="goToReport">
              Acessar Relatórios
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="rounded-lg flex-grow-1">
          <v-card-title class="pa-4 border-b text-error d-flex align-center">
            <v-icon color="error" class="mr-2" :class="{ 'icon-blink': lowStockProducts.length !== 0 }">
              mdi-alert-circle-outline
            </v-icon>
            Estoque Baixo
          </v-card-title>
          <v-list lines="two" class="pa-0">
            <template v-for="(product, index) in lowStockProducts" :key="product.id">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar color="error-lighten-4" size="40">
                    <span class="text-error font-weight-bold">{{ product.stock }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{ product.name }}</v-list-item-title>
                <v-list-item-subtitle>Restam apenas {{ product.stock }} unidades</v-list-item-subtitle>
              </v-list-item>
              <v-divider v-if="index < lowStockProducts.length - 1"></v-divider>
            </template>
            
            <v-list-item v-if="lowStockProducts.length === 0">
              <v-list-item-title class="text-grey text-center my-4">
                Tudo certo com o estoque! 🎉
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      /**
       * Define os dados para montagem da tabela de vendas recentes. 
       */
      recentSalesHeaders: [
        { title: 'Hora', key: 'createdAt', sortable: false },
        { title: 'Vendedor', key: 'sellerName', sortable: false },
        { title: 'Status', key: 'status', sortable: false },
        { title: 'Valor', key: 'total', align: 'end', sortable: false }
      ]
    }
  },
  computed: {
    // Mapeia os estados do módulo 'auth' do Vuex
    ...mapGetters('auth', ['currentUser']),
    /**
     * Lógica para montagem da saudação dinâmica.
     */
    greeting() {
      let greetingTerm = 'Bom dia';
      const currentHour = new Date().getHours();
      if (currentHour >= 12 && currentHour < 18) greetingTerm =  'Boa tarde';
      if (currentHour >= 18 && currentHour < 5) greetingTerm = 'Boa noite';

      return `${greetingTerm}, ${this.userName}!`;
    },
    /**
     * Nome do usuário para uso na saudação
     */
    userName() {
      return this.currentUser ? this.currentUser.name : 'Carregando...';
    },
    /**
     * Retorna o total de vendas salvo na store.
     */
    salesList() {
      return this.$store.state.sales.items || [];
    },
    /**
     * Retorna a lista de produtos salvo na store.
     */
    productsList() {
      return this.$store.state.products.items || [];
    },
    /**
     * Apresenta a lista de vendas filtradas pelo dia atual.
     */
    todaySalesList() {
      const today = new Date();
      // Extrai os valores usando o fuso horário LOCAL
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayString = `${year}-${month}-${day}`;

      return this.salesList.filter(sale => sale.createdAt && sale.createdAt.startsWith(todayString));
    },
    /**
     * Define os valores para os cards de Métricas Rápidas.
     */
    summaryTheDay() {
      const todaySales = this.todaySalesList.reduce((acc, sale) => acc + (sale.total || 0), 0);
      const todayTransactions = this.todaySalesList.length;
      const averageTicket = todayTransactions > 0 ? (todaySales / todayTransactions) : 0;

      return {
        todaySales,
        todayTransactions,
        averageTicket
      };
    },
    /**
     * Retorna a lista com os dados das últimas 10 vendas.
     */
    recentSales() {
      return [...this.salesList]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
    },
    /**
     * Lista os produtos com baixa quantidade no estoque.
     */
    lowStockProducts() {
      const stockThreshold = 5;

      return this.productsList
        .filter(  product => 
          product.stock !== undefined && 
          product.stock !== 0 &&
          product.stock <= stockThreshold
        )
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);
    }
  },
  methods: {
    /**
     * Navega para a página de Vendas/Caixa
     */
    goToPos() {
      this.$router.push({ name: 'sales' });
    },
    /**
     * Navega para a página de Cadastro de Produtos
     */
    goToCatalog() {
      this.$router.push({ name: 'inventory' });
    },
    /**
     * Navega para a página de Histórico de Vendas
     */
    goToHistory() {
      this.$router.push({ name: 'history' });
    },
    /**
     * Navega para a página de Relatórios
     */
    goToReport() {
      //@todo Quando criar a página de relatórios
      this.$router.push({ name: '' });
    },
    /**
     * Retorna a cor do Vuetify correspondente ao status da venda.
     */
    getStatusColor(status) {
      const colors = {
        'Concluída': 'success',
        'Pendente': 'warning',
        'Cancelada': 'error',
        'Reembolsada': 'info'
      };

      return colors[status] || 'roxo_w3';
    }
  },
  mounted() {
    this.$store.dispatch('sales/fetchAll');
    this.$store.dispatch('products/fetchAll');
  }
});
</script>
<style scoped>
.border-l-4 {
  border-left: 4px solid !important;
}
.border-success { border-left-color: rgb(var(--v-theme-success)) !important; }
.border-primary { border-left-color: rgb(var(--v-theme-primary)) !important; }
.border-info { border-left-color: rgb(var(--v-theme-info)) !important; }

.icon-blink {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>