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
        <div class="mb-4 d-flex">
          <!-- Seleciona um Produto/Serviço para a lista de checkout -->
          <v-autocomplete
            v-model="selectedItem"
            v-model:search="search"
            :items="filteredItems"
            item-title="name"
            label="Buscar Produto ou Serviço"
            density="compact"
            variant="outlined"
            color="roxo_w1"
            hide-details
            hide-no-data
            clearable
            return-object
            no-filter
            :menu-props="{ maxHeight: 250 }"
          />

          <v-btn
            class="ml-2"
            color="roxo_w1"
            @click="addSelectedItem"
            :disabled="!selectedItem"
          >
            Adicionar
          </v-btn>
        </div>
        <div>
          CheckoutItems
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
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SaleStation',
  components: {
    TitlePage,
    QuickActionCard,
  },
  data() {
    return {
      title: 'Caixa',
      subtitle: 'Estação de vendas',
      showQuickActions: false,
      selectedItem: null,
      search: '',
      checkoutItems: []
    }
  },
  computed: {
    ...mapGetters('products', { products: 'getItems' }),
    ...mapGetters('jobs', { jobs: 'getItems' }),
    // Array contendo os Produtos/Serviços a serem adicionados no checkout de vendas.
    salesItems() {
      return [...this.products, ...this.jobs];
    },
    // Array de Produtos/Serviços filtrado
    filteredItems() {
      if (!this.search) return []
      return this.salesItems
        .filter(item => item.name.toLowerCase()
        .includes(this.search.toLowerCase()));
    }
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    ...mapActions('jobs', ['fetchJobs']),
    /**
     * Adiciona o item selecionado no input à lista de checkout
     */
    addSelectedItem() {
      if (this.selectedItem) {
        this.checkoutItems.push(this.selectedItem);
        this.selectedItem = null;
        console.log(this.checkoutItems);
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