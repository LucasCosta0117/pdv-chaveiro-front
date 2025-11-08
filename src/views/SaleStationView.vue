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
            @click="addToCheckout"
            :disabled="!selectedItem"
          >
            Adicionar
          </v-btn>
        </div>
        <div>
          <CheckoutList
            v-model:checkout-items="checkoutItems"
          />
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <div>
          <CheckoutResum
            v-model:sale-resum="saleResum"
            :checkout-items="checkoutItems"
          />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          @click="finishSale"
          color="roxo_w1"
          :disabled="!this.checkoutItems.length"
        >
          Finalizar Venda
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import TitlePage from '@/components/TitlePage.vue';
import QuickActionCard from '@/components/QuickActionCard.vue';
import CheckoutList from '@/components/CheckoutList.vue';
import { mapGetters, mapActions } from 'vuex';
import CheckoutResum from '@/components/CheckoutResum.vue';

export default {
  name: 'SaleStation',
  components: {
    TitlePage,
    QuickActionCard,
    CheckoutList,
    CheckoutResum
  },
  data() {
    return {
      title: 'Caixa',
      subtitle: 'Estação de vendas',
      showQuickActions: false,
      selectedItem: null,
      search: '',
      checkoutItems: [],
      saleResum: {}
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
    addToCheckout() {
      if (this.selectedItem) {
        this.checkoutItems.push({
          ...this.selectedItem,
          quantity: 1,
          discount:  0,
          total: this.selectedItem.price
        });
        this.selectedItem = null;
      }
    },
    /**
     * Confirma a venda e persiste os dados.
     */
    finishSale() {
      // Atribui os itens da lista de checkout à ordem de venda
      this.saleResum.items = this.checkoutItems.map(item => {
        return {
          id: item.id,
          type: (item.stock) ? 'product' : 'job',
          quantity: item.quantity,
          unit_price: item.price,
          unit_discount: item.discount
        }
      });

      const verifyPaidMsg = this.verifyAmountPaid();

      if(verifyPaidMsg) {
        this.$store.dispatch('ui/notify',  { message: verifyPaidMsg, color: 'error' }, { root: true } );
        return;
      };

      console.log('this.saleResum', this.saleResum);
    },
    /**
     * Verifica se o valor total informado no pagamento está coerente com o valor total dos itens.
     */
    verifyAmountPaid() {
      const totalPaid = this.saleResum.payment.reduce(
        (acc,item) => acc + item.amount,
        0
      )
      
      const msgFail1 = `Nenhum valor informado no Pagamento.`;
      if (totalPaid == 0) return msgFail1;
      
      const msgFail2 = `O valor do Pagamento (R$ ${totalPaid.toFixed(2)}) não corresponde ao valor Total dos itens (R$ ${this.saleResum.total.toFixed(2)}).`;
      if (totalPaid !== this.saleResum.total) return msgFail2;

      return false;
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