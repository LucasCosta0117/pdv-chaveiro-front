<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <TitlePage :title="title" :subtitle="subtitle" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex">
        <h4 class="mr-2">Ações Rápidas</h4>
        <v-icon 
          :icon="showQuickActions ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          :title="showQuickActions ? 'Ocultar Ações Rápidas' : 'Exibir Ações Rápidas'"
          @click="showQuickActions = !showQuickActions"
          color="cinza_w2"
        ></v-icon>
      </v-col>
    </v-row>
    <v-row v-if="showQuickActions">
      <v-col cols="12">
        <QuickActionCard ></QuickActionCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h4 class="mr-2">Nova Venda</h4>
      </v-col>
      <v-col cols="12" md="8">
        <div>
          Pesquisa
        </div>
        <div>
          List Items
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <div>
          Sale Resum
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import TitlePage from '@/components/TitlePage.vue';
import QuickActionCard from '@/components/QuickActionCard.vue';

export default {
  name: 'SaleStation',
  components: {
    TitlePage,
    QuickActionCard
  },
  data() {
    return {
      title: 'Caixa',
      subtitle: 'Estação de vendas',
      showQuickActions: false
    }
  }
}
</script>
<style scoped>
</style>