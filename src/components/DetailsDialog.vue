<template>
  <v-dialog v-model="isOpen" max-width="600px" v-if="selectedItem">
    <v-card>
      <v-card-title class="bg-roxo_w1 font-weight-bold d-flex justify-space-between align-center">
        <span>
          {{ updatedItem[details.header?.titleKey] }}
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
              :src="updatedItem[details.header?.imgKey]"
              aspect-ratio="1"
              class="rounded-lg elevation-1"
              contain
              height="180"
            />
          </v-col>

          <v-col cols="12" :sm="details.header.imgKey ? 6 : 12">
            <div v-for="value in details.fields" :key="value.key">
              <p v-if="value?.type === 'currency'"><strong>{{ value.text }}: </strong>{{ $formatCurrency(updatedItem[value.key]) }}</p>
              <p v-else-if="value?.type === 'date'"><strong>{{ value.text }}: </strong>{{ $formatDateTime(updatedItem[value.key]) }}</p>
              <p v-else-if="value?.type === 'bool'"><strong>{{ value.text }}: </strong>{{ updatedItem[value.key] == true ? 'Sim': 'Não'}}</p>
              <div v-else-if="value?.type === 'list'">
                <strong>{{ value.text }}: </strong>
                <ul>
                  <li v-for="subValue in updatedItem[value.key]" :key="subValue" class="ml-8 mb-2">
                    <p v-for="(subField, index) in value.subFields" :key="index">
                      <template v-if="subValue[subField.key]">
                        <b>{{ subField.text }}: </b>
                        <span v-if="subField.type === 'currency'">{{ $formatCurrency(subValue[subField.key]) }}</span>
                        <span v-else-if="subField.type === 'date'">{{ $formatDateTime(subValue[subField.key]) }}</span>
                        <span v-else-if="subField.type === 'bool'">{{ subValue[subField.key] == true ? label.typeBoolYes : label.typeBoolNo }}</span>
                        <span v-else>{{ subValue[subField.key]}}</span>
                      </template>
                    </p>
                  </li>
                </ul>
              </div>
              <p v-else><strong>{{ value.text }}: </strong>{{ updatedItem[value.key] }}</p>
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
          @click="showActionForm = true"
        >
          {{ actionLabel.edit }}
        </v-btn>
        <v-btn
          prepend-icon="mdi-delete" 
          color="vermelho_w1"
          variant="flat"
          @click="msgConfirm = true"
        >
          {{ actionLabel.delete}}
        </v-btn>
      </v-card-actions>
    </v-card>
    <confirm-dialog
      v-model:showModal="msgConfirm"
      @confirm="deleteItem"
    ></confirm-dialog>
    <ActionFormDialog
      v-model:showModal="showActionForm"
      :entity="updatedItem.entity"
      :config="actionFormConfig"
      :initialData="updatedItem"
    />
  </v-dialog>
</template>

<script>
import ActionFormDialog from './ActionFormDialog.vue';
import ConfirmDialog from './ConfirmDialog.vue';

/**
 * Dialog aberto ao clickar sobre um item da tabela de produtos,
 * de modo a apresentar mais detalhes do produto selecionado.
 */
export default {
  name: 'DetailsDialog',
  components: {
    ConfirmDialog,
    ActionFormDialog
  },
  data() {
    return{
      // Flag para controle do dialog de confirmação da exclusão do registro
      msgConfirm: false,
      // Textos para uso nos elementos do template
      label: {
        typeBoolYes: 'Sim',
        typeBoolNo: 'Não'
      },
      // Flag para controle do dialog de inserção de novos registros
      showActionForm: false
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
     * Dados do item 'clickado' na tabela de registro.
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
    },
    /**
     * Busca a versão mais atualizada do item diretamente do estado do Vuex.
     * Isso garante que, após uma edição, o dialog exiba os valores atualizados.
     */
    updatedItem() {
      const itemsList = this.$store.state[this.selectedItem.entity].items || [];
      const currentItem = itemsList.find(item => item.id === this.selectedItem.id);

      if (currentItem) return currentItem;
      
      return this.selectedItem;
    },
    /**
     * Configuração para os campos do formulário de edição.
     */
    actionFormConfig() {
      switch (this.selectedItem.entity) {
        case 'products':
          const products = this.$store.state.products.items || [];
          const productsDepartmentOpts = [...new Set(products.map(p => p.department).filter(Boolean))].sort();
          const productsCategoryOpts = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
          const productsSubcategoryOpts = [...new Set(products.map(p => p.subcategory).filter(Boolean))].sort();

          return [
            { label: 'Nome do Produto', key: 'name', required: true },
            { label: 'Foto', key: 'imgUrl', type: 'image' },
            { label: 'Preço', key: 'price', type: 'currency', cols: 6 },
            { label: 'Quantide em Estoque', key: 'stock', type: 'qtd', cols: 6 },
            { label: 'Marca', key: 'brand' },
            { label: 'Código', key: 'code' },
            { label: 'Departamento', key: 'department', type: 'combobox', cols: 4, optionsList: productsDepartmentOpts },
            { label: 'Categoria', key: 'category', type: 'combobox', cols: 4, optionsList: productsCategoryOpts },
            { label: 'Subcategoria', key: 'subcategory', type: 'combobox', cols: 4, optionsList: productsSubcategoryOpts },
            { label: 'À venda?', key: 'canSale', type: 'select',
              optionsList: [
                { texto: 'Sim', valor: true }, 
                { texto: 'Não', valor: false }
              ],
              cols: 6
            },
            { label: 'Disponível?', key: 'isActive', type: 'select',
              optionsList: [
                { texto: 'Sim', valor: true }, 
                { texto: 'Não', valor: false }
              ],
              cols: 6
            }
          ];
        case 'sales':
          //@todo precisa melhorar a lógica para edição dos campos "Pagamento" e "Status", 
          // o "status" não está persistindo e "Pagamento" não assume o valor em forma de objeto como numa venda nova.
          const notEditable = (this.selectedItem.status == 'Pendente') ? false : true;

          return [
            { label: 'Vendedor', key: 'sellerName', readonly: true },
            { label: 'Subtotal', key: 'subtotal', type: 'currency', type: 'currency', cols: 4, readonly: true },
            { label: 'Descontos', key: 'totalDiscount', type: 'currency', type: 'currency', type: 'currency', cols: 4, readonly: true  },
            { label: 'Total Pago', key: 'total', type: 'currency', type: 'currency', type: 'currency', cols: 4, readonly: true  },
            { label: 'Número da Nota Fiscal', key: 'fiscalNumber', readonly: notEditable },
            { label: 'Observação da Nota Fiscal', key: 'fiscalNotes', readonly: notEditable },
            { label: 'Produtos/Serviços', key: 'items', type: 'multiselect', options: { title: 'itemName', value: 'id' }, readonly: true },
            { label: 'Pagamento', key: 'payments', type: 'multiselect', options: { title: 'method', value: 'id' }, readonly: notEditable, 
              optionsList: [
                  'Pix',
                  'Dinheiro',
                  'Crédito',
                  'Débido',
                  'Pendente'
                ]
            },
            { label: 'Status', key: 'status', type: 'select',
              optionsList: [
                { texto: 'Concluída', valor: 'COMPLETED' },
                { texto: 'Cancelada', valor: 'CANCELED' },
                { texto: 'Reembolsada', valor: 'REFUNDED' }
              ]
            }
          ];
        case 'jobs':
          const jobs = this.$store.state.jobs.items || [];
          const jobsCategoryOpts = [...new Set(jobs.map(p => p.category).filter(Boolean))].sort();
          const jobsSubcategoryOpts = [...new Set(jobs.map(p => p.subcategory).filter(Boolean))].sort();

          return [
            { label: 'Nome do Serviço', key: 'name', required: true},
            { label: 'Código', key: 'code' },
            { label: 'Preço', key: 'price', type: 'currency', cols: 6, required: true },
            { label: 'Disponível', key: 'isActive', type: 'select',
              optionsList: [
                { texto: 'Sim', valor: true }, 
                { texto: 'Não', valor: false }
              ],
              cols: 6
            },
            { label: 'Categoria', key: 'category', type: 'combobox', cols: 6, optionsList: jobsCategoryOpts },
            { label: 'Subcategoria', key: 'subcategory', type: 'combobox', cols: 6, optionsList: jobsSubcategoryOpts }
          ];
      }
    },
    /**
     * Define os textos do botão de ação baseado na entidade atual.
     */
    actionLabel() {
      if (this.entity === 'sales') {
        return {
          edit: 'Editar',
          delete: 'Cancelar Venda',
        };
      } else {
        return {
          edit: 'Editar',
          delete: 'Excluir',
        };
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
