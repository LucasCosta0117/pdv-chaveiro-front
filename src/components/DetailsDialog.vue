<template>
  <v-dialog v-model="isOpen" max-width="600px">
    <v-card>
      <v-card-title class="bg-roxo_w1 font-weight-bold d-flex justify-space-between align-center">
        <span>
          {{ selectedItem[details.header?.titleKey] }}
        </span>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="isOpen = false"
        ></v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" v-if="details.header.imgKey">
            <v-img
              :src="selectedItem[details.header?.imgKey]"
              aspect-ratio="1"
              class="rounded-lg elevation-1"
              contain
              height="180"
            />
          </v-col>

          <v-col cols="12" :sm="details.header.imgKey ? 6 : 12">
            <div v-for="value in details.fields" :key="value.key">
              <p v-if="value?.type === 'currency'"><strong>{{ value.text }}: </strong>{{ $formatCurrency(selectedItem[value.key]) }}</p>
              <p v-else-if="value?.type === 'date'"><strong>{{ value.text }}: </strong>{{ $formatDateTime(selectedItem[value.key]) }}</p>
              <p v-else-if="value?.type === 'bool'"><strong>{{ value.text }}: </strong>{{ selectedItem[value.key] == true ? 'Sim': 'Não'}}</p>
              <div v-else-if="value?.type === 'list'">
                <strong>{{ value.text }}: </strong>
                <ul>
                  <li v-for="subValue in selectedItem[value.key]" :key="subValue" class="ml-8 mb-2">
                    <p v-for="(subField, index) in value.subFields" :key="index">
                      <template v-if="subValue[subField.key]">
                        <b>{{ subField.text }}: </b>
                        <span v-if="subField.type === 'currency'">{{ $formatCurrency(subValue[subField.key]) }}</span>
                        <span v-else-if="subField.type === 'date'">{{ $formatDateTime(subValue[subField.key]) }}</span>
                        <span v-else-if="subField.type === 'bool'">{{ subValue[subField.key] == true ? 'Sim': 'Não'}}</span>
                        <span v-else>{{ subValue[subField.key]}}</span>
                      </template>
                    </p>
                  </li>
                </ul>
              </div>
              <p v-else><strong>{{ value.text }}: </strong>{{ selectedItem[value.key] }}</p>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider color="roxo_w1" class="ma-2"></v-divider>
      <v-card-actions class="d-flex justify-space-evenly mb-2">
        <v-btn 
          prepend-icon="mdi-pencil" 
          color="roxo_w2" 
          variant="flat" 
          @click=""
        >
          Editar
        </v-btn>
        <v-btn 
          prepend-icon="mdi-delete" 
          color="vermelho_w1"
          variant="flat"
          @click="msgConfirm = true"
        >
          Excluir
        </v-btn>
      </v-card-actions>
    </v-card>
    <confirm-dialog
      v-model:showModal="msgConfirm"
      @confirm="deleteItem"
    ></confirm-dialog>
  </v-dialog>
</template>

<script>
import ConfirmDialog from './ConfirmDialog.vue';

/**
 * Dialog aberto ao clickar sobre um item da tabela de produtos,
 * de modo a apresentar mais detalhes do produto selecionado.
 */
export default {
  name: 'DetailsDialog',
  components: {
    ConfirmDialog,
  },
  data() {
    return{
      msgConfirm: false,
    }
  },
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
     * Informações do item 'clickado'.
     */
    selectedItem: {
      type: Object,
      required: true,
      default: () => ({})
    },
    /**
     * Definição a cerca das informações à serem exibidas.
     */
    details: {
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
    async deleteItem() {
      const actionPath = `${this.selectedItem.entity}/delete`;
      const wasDeleted = await this.$store.dispatch(actionPath, this.selectedItem.id);
      if (wasDeleted) this.isOpen = false;
    }
  }
}
</script>

<style scoped>
.v-img {
  border-radius: 8px;
}
</style>
