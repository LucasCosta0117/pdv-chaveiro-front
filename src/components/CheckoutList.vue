<template>
  <v-data-table
    :headers="headers"
    :items="checkoutItems"
    class="checkout-table-container border-thin"
    density="comfortable"
    striped="even"
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
      <v-number-input
        class="d-flex"
        v-model="item.quantity"
        controlVariant="split"
        density="compact"
        variant="solo"
        flat
        inset
        :min="1"
        :max="item.stock || 999"
        style="width: 150px"
        @update:model-value="(val) => onNumbInputChange(item, val)"
      />
    </template>

    <!-- Coluna: Desconto (editável) -->
    <template #item.discount="{ item }">
      <v-text-field
        v-model.number="item.discount"
        type="number"
        :min="0"
        :max="item.price"
        density="compact"
        hide-details
        variant="solo"
        prefix="R$"
        flat
        style="width: 110px"
        @change="updateItem(item)"
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
 * Tabela responsável por exibir a lista de itens do checkout da venda.
 * Nela são apresentados os Produtos/Serviços selecionados para compor a venda.
 */
export default {
  name: 'CheckoutList',
  props: {
    // Conjunto de itens (Produtos/Serviços) adicionados a lista de checkout de vendas.
    checkoutItems: {
      type: Array,
      required: true
    },
  },
  emits: ['update:checkoutItems'],
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
      ],
    };
  },
  methods: {
    /**
     * Atualiza o valor 'Total' do item com base nas células 'Qtd' e 'Desc.''
     * 
     * @param item Item da tabela de checkout.
     */
    calcTotal(item) {
      const tot = (item.price * item.quantity) - item.discount
      return (tot < 0) ? 0 : tot;
    },
    /**
     * Garante o controle explícito sobre a atualização do v-number-input,
     * inclusive via botões de controle.
     * 
     * @param item  Item da tabela de checkout.
     * @param val   Valor atualizado dentro do v-number-input.
     */
    onNumbInputChange(item, val) {
      item.quantity = val;
      this.updateItem(item);
    },
    /**
     * Atualiza um item dentro da lista de checkout aprimorada.
     * 
     * @param updatedItem Item da tabela de checkout modificado.
     */
    updateItem(updatedItem) {
      updatedItem.total = this.calcTotal(updatedItem);
      const updatedList = this.checkoutItems.map(item =>
        item.id === updatedItem.id ? { ...updatedItem } : item
      );
      this.$emit('update:checkoutItems', updatedList);
    },
    /**
     * Exclui o item da lista de checkout aprimorada.
     * 
     * @param itemToRemove Item removido da tabela de checkout.
     */
    removeItem(itemToRemove) {
      const filtered = this.checkoutItems.filter(item => item.id !== itemToRemove.id);
      this.$emit('update:checkoutItems', filtered);
    }
  }
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
:deep(.v-number-input input) {
  font-size: 0.875rem;
}
:deep(.v-field input) {
  font-size: 0.875rem;
}
</style>
