<template>
  <v-dialog v-model="isOpen" max-width="600px">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ product.name }}
      </v-card-title>

      <v-card-subtitle>{{ product.department }}</v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-img
              :src="product.imgUrl"
              aspect-ratio="1"
              class="rounded-lg elevation-1"
              contain
              height="180"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <p><strong>Preço: </strong>R$ {{ product.price }}</p>
            <p><strong>Marca: </strong>{{ product.brand }}</p>
            <p><strong>Categoria: </strong>{{ product.category }}</p>
            <p><strong>Subcategoria: </strong>{{ product.subcategory }}</p>
            <p><strong>Estoque: </strong>{{ product.stock }} unidades</p>
            <p><strong>Disponível: </strong>{{ (product.isActive) ? 'Sim' : 'Não' }}</p>
            <p><strong>À venda: </strong>{{ (product.canSale) ? 'Sim' : 'Não' }}</p>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="close">
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * Dialog aberto ao clickar sobre um item da tabela de produtos,
 * de modo a apresentar mais detalhes do produto selecionado.
 */
export default {
  name: 'ProductDetailsDialog',
  props: {
    /**
     * Flag para controle de exibição do modal/dialog.
     */
    showModal: {
      type: Boolean,
      required: true,
      default: false
    },
    /**
     * Informações do produto 'clickado'.
     */
    product: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  computed: {
    /**
     * Responsável por obter e também manipular, de forma indireta, o valor da props 'showModal'.
     */
    isOpen: {
      get() {
        return this.showModal;
      },
      set(val) {
        this.$emit('update:showModal', val);
      }
    }
  },
  methods: {
    /**
     * Fecha o modal/dialog.
     */
    close() {
      this.isOpen = false;
    }
  }
}
</script>

<style scoped>
.v-img {
  border-radius: 8px;
}
</style>
