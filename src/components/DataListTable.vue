<template>
  <div>
    <v-data-table
      striped="even"
      hover
      class="products-table-container border-thin"
      :headers="headers"
      :items="items"
      :items-per-page="10"
      :search="search"
      @click:row="openDialog"
    >
      <template v-for="header in headers" :key="header.key" #[`item.${header.key}`]="{ value, column }">
        <!-- Formatação para coluna monetária -->
        <template v-if="column.type === 'currency'">
          {{ $formatCurrency(value) }}
        </template>

        <!-- Formatação para coluna date/time -->
        <template v-else-if="column.type === 'date'">
          {{ $formatDateTime(value) }}
        </template>

        <template v-else>
          {{ value }}
        </template>
      </template>
    </v-data-table>

    <DetailsDialog
      v-if="selectedItem"
      v-model:showModal="dialog"
      :selectedItem="selectedItem"
      :details="details"
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
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // Controla a visibilidade do diálogo de detalhes (DetailsDialog).
      dialog: false,
      // Armazena o item selecionado quando uma linha da tabela é clicada.
      selectedItem: null
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
      this.selectedItem = item
    }
  }
}
</script>
<style scoped>
.products-table-container {
  border-radius: 0.5rem;
  min-height: 25rem;
}
.products-table-container :deep(thead th) {
  background-color: rgb(var(--v-theme-roxo_w1));
  color: white;
}

/* Breakpoint LG (1280px) ou superior */
@media (min-width: 1280px) {
  .products-table-container {
    height: 40.1rem;
  }
}
</style>