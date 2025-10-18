<template>
  <v-container>
    <v-row>
      <v-col col="12">
        <TitlePage :title="title" :subtitle="subtitle" />
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <h4>Ações Rápidas</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card v-for="x in 3" :key="x" height="150" class="elevation-5 mb-2"></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import TitlePage from '@/components/TitlePage.vue';

export default {
  name: 'SaleStation',
  components: {
    TitlePage
  },
  data() {
    return {
      title: 'Caixa',
      subtitle: 'Estação de vendas'
    }
  }
}
</script>
<style scoped>
</style>