<template>
  <v-data-table
    :headers="headers"
    :items="checkoutItems"
    class="checkout-table-container border-thin"
    density="comfortable"
    striped="odd"
    hide-default-footer
    hide-no-data
    hover
  >
    <!-- Coluna: Nome -->
    <template #item.name="{ item }">
      {{ item.name }}
    </template>

    <!-- Coluna: Preço unitário -->
    <template #item.price="{ item }">
      {{ $formatCurrency(item.price) }}
    </template>

    <!-- Coluna: Quantidade (editável) -->
    <template #item.quantity="{ item }">
      <v-text-field
        v-model.number="item.quantity"
        type="number"
        min="1"
        :max="item.stock"
        density="compact"
        hide-details
        style="width: 80px"
        @update:modelValue="updateTotals(item)"
      />
    </template>

    <!-- Coluna: Desconto (editável) -->
    <template #item.discount="{ item }">
      <v-text-field
        v-model.number="item.discount"
        type="number"
        min="0"
        max="100"
        suffix="%"
        density="compact"
        hide-details
        style="width: 80px"
        @update:modelValue="updateTotals(item)"
      />
    </template>

    <!-- Coluna: Total -->
    <template #item.total="{ item }">
      {{ $formatCurrency(item.total) }}
    </template>

    <!-- Coluna: Ações -->
    <template #item.actions="{ item }">
      <v-icon
        color="error"
        class="cursor-pointer"
        @click="removeItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
/**
 * Tabela responsável por exibir os itens do checkout da venda.
 * Nela são listados os Produtos/Serviços selecionados para compor a venda.
 */
export default {
  name: 'CheckoutItems',
  props: {
    // Item adicionado a lista de checkout
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // Colunas do cabeçalho da tabela de checkout
      headers: [
        { title: 'Item', key: 'name' },
        { title: 'Preço', key: 'price' },
        { title: 'Qtd', key: 'quantity' },
        { title: 'Desc.', key: 'discount' },
        { title: 'Total', key: 'total' },
        { title: '', key: 'actions', sortable: false },
      ]
    };
  },
  computed: {
    checkoutItems() {
      return this.items.map(item => ({
        ...item,
        quantity: 1,
        discount: 0,
        total: item.price,
      }))
    }
  },
  methods: {
    /**
     * Atualiza o valor do total do item na linha conforme são alteradas 
     * as células de quantidade (Qtd) e desconto (Desc.).
     * 
     * @param item Item da tabela de checkout
     */
    updateTotals(item) {
      // Valida quantidade
      if (item.quantity < 1) item.quantity = 1;
      if (item.quantity > item.stock) item.quantity = item.stock;

      // Calcula total com desconto
      const subtotal = item.price * item.quantity;
      const discount = (subtotal * item.discount) / 100;
      item.total = subtotal - discount;
    },
    /**
     * Exclui o item informado da lista de checkout.
     * 
     * @param item Item da tabela de checkout
     */
    removeItem(item) {
      console.log('click lixeira')
      this.checkoutItems = this.checkoutItems.filter(i => i !== item);
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.checkout-table-container {
  border-radius: 0.5rem;
  min-height: 15rem;
}
.checkout-table-container :deep(thead th) {
  background-color: rgb(var(--v-theme-roxo_w1));
  color: white;
}
</style>
