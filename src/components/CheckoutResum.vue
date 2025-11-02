<template>
  <v-container class="checkout-resum-container border-thin">
    <v-row>
      <v-col cols="7" sm="9" md="8">Subtotal</v-col>
      <v-col cols="5" sm="3" md="4" class="pb-1 pt-0">
        <v-text-field
          :value="$formatCurrency(newSale.subtotal)"
          density="compact"
          variant="solo"
          readonly
          hide-details
          flat
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="py-0">
        <v-divider :thickness="1"></v-divider>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="7" sm="9" md="8">Descontos</v-col>
      <v-col cols="5" sm="3" md="4" class="pb-1 pt-0">
        <v-text-field
          :value="`- ${$formatCurrency(newSale.discounts)}`"
          density="compact"
          variant="solo"
          readonly
          hide-details
          flat
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="py-0">
        <v-divider :thickness="1"></v-divider>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="7" sm="9" md="8" class="font-weight-bold">Total</v-col>
      <v-col cols="5" sm="3" md="4" class="pb-1 pt-0">
        <v-text-field
          :value="$formatCurrency(newSale.total)"
          density="compact"
          variant="solo"
          class="font-weight-bold"
          readonly
          hide-details
          flat
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="py-0">
        <v-divider :thickness="3"></v-divider>
      </v-col>
    </v-row>

    <!-- Lista de opções de pagamento -->
    <v-row>
      <v-col>Método de pagamento</v-col>
    </v-row>
    <v-row  
      v-for="(payment, index) in paymentOptions" 
      :key="index"
      class="d-flex"
    >
      <v-col cols="7" sm="9" md="8" class="pb-1 pt-0" @click="togglePayment(index)">
        <v-btn
          :prepend-icon="payment.icon"
          color="verde_w1"
          class="justify-start"
          :disabled="!payment.enabled"
          width="130"
        >
          {{ payment.text }}
        </v-btn>
      </v-col>
      <v-col cols="5" sm="3" md="4" class="pb-1 pt-0">
        <v-text-field
          v-model.number="payment.amount"
          :disabled="!payment.enabled"
          :min="0"
          type="number"
          density="compact"
          variant="solo"
          prefix="R$"
          hide-details
          flat
          @change="updatePaymentAmount(payment)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'CheckoutResum',
  props: {
    // Conjunto de itens (Produtos/Serviços) adicionados a lista de checkout de vendas.
    saleResum: {
      type: Object,
      required: true
    },
    // Conjunto de itens (Produtos/Serviços) adicionados a lista de checkout de vendas.
    checkoutItems: {
      type: Array,
      required: true
    }
  },
  emits:['update:saleResum'],
  data() {
    return {
      // Opções de método de pagamento
      paymentOptions: [
        { text: 'PIX', icon: 'mdi-qrcode', enabled: false, amount: 0 },
        { text: 'Dinheiro', icon: 'mdi-cash-multiple', enabled: false, amount: 0 },
        { text: 'Débito', icon: 'mdi-credit-card', enabled: false, amount: 0 },
        { text: 'Crédito', icon: 'mdi-credit-card-outline', enabled: false, amount: 0 }
      ]
    }
  },
  computed: {
    newSale: {
      get() {
        const saleValue = {};

        saleValue.subtotal = this.checkoutItems.reduce(
          (accumulator, item) => accumulator + (item.quantity * item.price),
          0
        );
        saleValue.discounts = this.checkoutItems.reduce(
          (accumulator, item) => accumulator + (item.discount),
          0
        );
        saleValue.total = saleValue.subtotal - saleValue.discounts;
        saleValue.payment = [];

        this.$emit('update:saleResum', saleValue);

        return saleValue;
      },
      set(value) {
        this.$emit('update:saleResum', value);
      }
    }
  },
  methods: {
    /**
     * Habilita uma das opções do método de pagamento dentre as disponíveis.
     * 
     * @param index Opção de pagamento.
     */
    togglePayment(index) {
      this.paymentOptions[index].enabled = !this.paymentOptions[index].enabled;
      this.paymentOptions[index].amount = this.paymentOptions[index].enabled ? this.newSale.total : 0;
      if (this.paymentOptions[index].enabled) {
        this.newSale.payment.push({
          name: this.paymentOptions[index].text,
          amount: this.paymentOptions[index].amount
        })
      } else {
        this.newSale.payment = this.newSale.payment.filter(
          p => p.name !== this.paymentOptions[index].text
        );
      }
    },
    /**
     * Atualiza o valor de um método de pagamento específico (payment.amount),
     * dentro do array final de pagamentos da venda (this.newSale.payment).
     *
     * @param {Object} payment O objeto completo do método de pagamento.
     */
    updatePaymentAmount(payment) {
      this.newSale.payment = this.newSale.payment.map( p => {
        if (p.name === payment.text) {
          p.amount = payment.amount;
        }
        
        return p;
      });
    }
  }
}
</script>
<style scoped>
.checkout-resum-container {
  border-radius: 0.5rem;
}
</style>