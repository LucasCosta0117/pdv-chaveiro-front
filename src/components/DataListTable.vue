<template>
  <div>
    <v-data-table
      striped="even"
      hover
      class="products-table-container border-thin"
      :headers="headers"
      :items="filteredItems"
      :items-per-page="10"
      :search="search"
      @click:row="openDialog"
    >
      <template v-for="header in headers" :key="header.key" #[`header.${header.key}`]="{ column }">
        <div class="d-flex align-center">
          <span class="font-weight-bold">{{ column.title }}</span>
          
          <v-menu :close-on-content-click="false" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                :icon="columnFilters[column.key] ? 'mdi-filter-remove' : 'mdi-filter'"
                variant="text"
                size="x-small"
                v-bind="props"
                :class="{ 'text-black': columnFilters[column.key], 'text-white': !columnFilters[column.key] }"
              ></v-btn>
            </template>

            <v-card min-width="200" class="pa-2">
              <v-text-field
                v-model="columnFilters[column.key]"
                :label="`Filtrar ${column.title}`"
                variant="underlined"
                density="compact"
                hide-details
                clearable
                prepend-inner-icon="mdi-magnify"
                autofocus
              ></v-text-field>
            </v-card>
          </v-menu>
        </div>
      </template>

      <template v-for="header in headers" :key="header.key" #[`item.${header.key}`]="{ value, column }">
        <!-- Formatação para coluna monetária -->
        <template v-if="column.type === 'currency'">
          {{ $formatCurrency(value) }}
        </template>

        <!-- Formatação para coluna date/time -->
        <template v-else-if="column.type === 'date'">
          {{ $formatDateTime(value) }}
        </template>

        <!-- Formatação para coluna status -->       
        <template v-else-if="column.type === 'status'">
          <v-chip
            :color="getStatusColor(value)"
            size="small"
            variant="flat"
            class="font-weight-medium"
            label
          >
            {{ value }}
          </v-chip> 
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
      selectedItem: null,
      // Objeto que guardará os termos de busca de cada coluna.
      columnFilters: {}
    }
  },
  computed: {
    /**
     * Propriedade computada que filtra a lista original baseada nos filtros de coluna.
     */
    filteredItems() {
      const activeFilters = Object.keys(this.columnFilters).filter(key => !!this.columnFilters[key]);

      if (activeFilters.length === 0) {
        return this.items;
      }

      return this.items.filter(item => {
        for (const key of activeFilters) {
          const filterText = this.columnFilters[key].toLowerCase();
          
          const cellValue = String(item[key] || '').toLowerCase();

          if (!cellValue.includes(filterText)) {
            return false;
          }
        }
        return true;
      });
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
    },
    /**
     * Retorna a cor correspondente ao status.
     */
    getStatusColor(status) {
      const colors = {
        'Concluída': 'success',
        'Pendente': 'warning',
        'Cancelada': 'error',
        'Reembolsada': 'info'
      };

      return colors[status] || 'roxo_w3';
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
  white-space: nowrap;
}
.products-table-container :deep(.v-btn--icon) {
  margin-left: 0.5rem;
}

/* Breakpoint LG (1280px) ou superior */
@media (min-width: 1280px) {
  .products-table-container {
    height: 40.1rem;
  }
}
</style>