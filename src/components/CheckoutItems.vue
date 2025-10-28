<template>
  <v-data-table
    :headers="headers"
    :items="checkoutItems"
    class="checkout-table-container"
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
      {{ formatCurrency(item.price) }}
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
      {{ formatCurrency(item.total) }}
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
export default {
  name: 'CheckoutItems',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
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
    formatCurrency(value) {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    },
    updateTotals(item) {
      // Valida quantidade
      if (item.quantity < 1) item.quantity = 1;
      if (item.quantity > item.stock) item.quantity = item.stock;

      // Calcula total com desconto
      const subtotal = item.price * item.quantity;
      const discount = (subtotal * item.discount) / 100;
      item.total = subtotal - discount;
    },
    removeItem(item) {
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
  border: solid 1px rgb(var(--v-theme-cinza_w2), 0.5);
  border-radius: 0.25rem;
}
</style>
