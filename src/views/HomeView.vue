<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4" style="min-height: 100vh;">
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">
          {{ saudacao }}, Lucas! 👋
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
                {{ $formatCurrency(resumo.vendasHoje) }}
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
                {{ resumo.qtdAtendimentos }}
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
                {{ $formatCurrency(resumo.ticketMedio) }}
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
            <v-btn variant="text" color="primary" size="small" @click="irParaHistorico">
              Ver Histórico Completo
            </v-btn>
          </v-card-title>
          
          <v-data-table
            :headers="headersRecentes"
            :items="vendasRecentes"
            :items-per-page="5"
            density="comfortable"
            hide-default-footer
          >
            <template #[`item.status`]="{ value }">
              <v-chip
                :color="value === 'Concluída' ? 'success' : 'warning'"
                size="small"
                variant="flat"
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
            <v-btn block color="primary" size="large" class="mb-3" prepend-icon="mdi-cart-plus" @click="irParaCaixa">
              Nova Venda / Caixa
            </v-btn>
            <v-btn block color="secondary" size="large" class="mb-3" prepend-icon="mdi-plus-box" @click="irParaCatalogo">
              Cadastrar Produto
            </v-btn>
            <v-btn block color="secondary" size="large" class="mb-3" prepend-icon="mdi-plus-box" @click="irParaCatalogo">
              Cadastrar Produto
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="rounded-lg flex-grow-1">
          <v-card-title class="pa-4 border-b text-error d-flex align-center">
            <v-icon color="error" class="mr-2">mdi-alert-circle-outline</v-icon>
            Estoque Baixo
          </v-card-title>
          <v-list lines="two" class="pa-0">
            <template v-for="(item, index) in estoqueBaixo" :key="item.id">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar color="error-lighten-4" size="40">
                    <span class="text-error font-weight-bold">{{ item.stock }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>Restam apenas {{ item.stock }} unidades</v-list-item-subtitle>
              </v-list-item>
              <v-divider v-if="index < estoqueBaixo.length - 1"></v-divider>
            </template>
            
            <v-list-item v-if="estoqueBaixo.length === 0">
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

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      // Dados simulados para você ver o layout funcionando
      resumo: {
        vendasHoje: 1450.75,
        qtdAtendimentos: 12,
        ticketMedio: 120.89
      },
      headersRecentes: [
        { title: 'Hora', key: 'hora', sortable: false },
        { title: 'Cliente/Vendedor', key: 'sellerName', sortable: false },
        { title: 'Status', key: 'status', sortable: false },
        { title: 'Valor', key: 'total', align: 'end', sortable: false }
      ],
      vendasRecentes: [
        { id: 1, hora: '10:45', sellerName: 'Lucas Costa', status: 'Concluída', total: 89.90 },
        { id: 2, hora: '10:12', sellerName: 'Lucas Costa', status: 'Concluída', total: 250.00 },
        { id: 3, hora: '09:30', sellerName: 'Maria Silva', status: 'Pendente', total: 45.50 },
        { id: 4, hora: '09:05', sellerName: 'Lucas Costa', status: 'Concluída', total: 15.00 },
      ],
      estoqueBaixo: [
        { id: 101, name: 'Controle Remoto PPA', stock: 2 },
        { id: 102, name: 'Chave Pado Lado Direito', stock: 5 },
        { id: 103, name: 'Alicate Profissional 777', stock: 1 }
      ]
    }
  },
  computed: {
    // Retorna "Bom dia", "Boa tarde" ou "Boa noite" dinamicamente
    saudacao() {
      const hora = new Date().getHours();
      if (hora >= 5 && hora < 12) return 'Bom dia';
      if (hora >= 12 && hora < 18) return 'Boa tarde';
      return 'Boa noite';
    }
  },
  methods: {
    irParaCaixa() {
      this.$router.push({ name: 'sales' });
    },
    irParaCatalogo() {
      this.$router.push({ name: 'inventory' });
    },
    irParaHistorico() {
      this.$router.push({ name: 'history' });
    }
  }
});
</script>

<style scoped>
/* Adicionando bordas coloridas nos cards superiores para destaque visual */
.border-l-4 {
  border-left: 4px solid !important;
}
.border-success {
  border-left-color: rgb(var(--v-theme-success)) !important; 
}
.border-primary {
  border-left-color: 
  rgb(var(--v-theme-primary)) !important; 
}
.border-info {
  border-left-color: rgb(var(--v-theme-info)) !important; 
}
</style>