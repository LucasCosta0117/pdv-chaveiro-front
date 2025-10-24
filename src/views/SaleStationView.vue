<template>
  <v-container>
    <v-row>
      <v-col col="12">
        <TitlePage :title="title" :subtitle="subtitle" />
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12" class="d-flex">
        <h4 class="mr-2">Ações Rápidas</h4>
        <v-icon 
          :icon="showQuickActions ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          :title="showQuickActions ? 'Ocultar Ações Rápidas' : 'Exibir Ações Rápidas'"
          @click="showQuickActions = !showQuickActions"
        ></v-icon>
      </v-col>
    </v-row>
    <v-row v-if="showQuickActions">
      <v-col col="12">
        <QuickActionCard ></QuickActionCard>
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
      showQuickActions: true
    }
  }
}
</script>
<style scoped>
</style>