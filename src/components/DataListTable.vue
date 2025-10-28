<template>
  <div>
    <v-data-table
      striped="odd"
      hover
      class="products-table-container border-thin"
      :headers="headers"
      :items="items"
      :items-per-page="10"
      :search="search"
      @click:row="openDialog"
    >
      <!-- Formatação para coluna monetária -->
      <template #item.price="{ item }">
        {{ formatCurrency(item.price) }}
      </template>
    </v-data-table>

    <DetailsDialog
      v-if="selectedProduct"
      v-model:showModal="dialog"
      :product="selectedProduct"
    />
  </div>
</template>
<script>
import DetailsDialog from './DetailsDialog.vue';

/**
 * Renderiza uma tabela listando todos os itens do array de produtos ou serviços.
 */
export default {
  name: 'DataListTable',
  components: {
    DetailsDialog
  },
  props: {
    // Termo de busca para filtrar os itens exibidos na tabela.
    search: {
      type: String,
      default: ''
    },
    // Array de objetos que define as colunas da tabela.
    headers: {
      type: Array,
      default: () => ([])
    },
    // Array de objetos contendo os dados a serem exibidos na tabela.
    items: {
      type: Array,
      default: () => ([])
    },
    // Array de objetos com os dados para exibir os detalhes adicionais no DetailsDialog.
    details: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      // Controla a visibilidade do diálogo de detalhes (DetailsDialog).
      dialog: false,
      // Armazena o item selecionado quando uma linha da tabela é clicada.
      selectedProduct: null
    }
  },
  methods: {
    /**
     * @method openDialog
     * @description
     * Abre o diálogo de detalhes (`DetailsDialog`) e define o item selecionado.
     * Disparado pelo evento `@click:row` do `v-data-table`.
     *
     * @param {Object} _ - Primeiro argumento do evento de clique (não utilizado).
     * @param {Object} options.item - O item da linha clicada a partir da desestruturação do 'objeto linha' da tabela.
     */
    openDialog(_, { item }) {
      this.dialog = true
      this.selectedProduct = item
    },
    /**
     * Formata os valores da coluna 'price' para o padrão monetário Br
     * 
     * @param value Preço (price) do item na tabela
     */
    formatCurrency(value) {
      if (value == null || value === '') return '-';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
  }
}
</script>
<style scoped>
.products-table-container {
  border-radius: 0.5rem;
  min-height: 25rem;
  max-height: 35rem;
}
.products-table-container :deep(thead th) {
  background-color: rgb(var(--v-theme-roxo_w1));
  color: white;
}
</style>