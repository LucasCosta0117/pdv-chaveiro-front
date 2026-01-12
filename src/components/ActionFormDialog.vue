<template>
  <v-dialog v-model="isOpen" height="100vh" persistent class="action-form-dialog-container">
    <v-card>
      <v-card-title class="bg-roxo_w1 d-flex justify-space-between align-center text-uppercase">
        <span>{{ formTitle }}</span>
        <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
      </v-card-title>

      <v-card-text class="pt-4 d-flex justify-center align-center">
        <v-form ref="form" class="form-container">
          <v-row>
            <v-col
              v-for="field in config"
              :key="field.key"
              cols="12"
              :md="field.cols || 12"
            >
              <label>{{ field.label }}</label>

              <v-text-field
                v-if="field.type === 'currency'"
                v-model.number="formData[field.key]"
                type="number"
                variant="solo"
                density="compact"
                bg-color="grey-lighten-5"
                prefix="R$"
                min="0"
                step="0.01"
                :rules="[v => v >= 0 || 'Valor não pode ser negativo']"
                @update:model-value="handleCurrencyInput(field.key, $event)"
              ></v-text-field>

              <v-text-field
                v-else-if="field.type === 'qtd'"
                v-model.number="formData[field.key]"
                type="number"
                variant="solo"
                density="compact"
                bg-color="grey-lighten-5"
                min="1"
                step="1"
                :rules="[
                  v => v >= 1 || 'Mínimo de 1 unidade',
                  v => Number.isInteger(v) || 'Apenas números inteiros'
                ]"
                @update:model-value="handleQtdInput(field.key, $event)"
              ></v-text-field>

              <v-combobox
                v-else-if="field.type === 'select'"
                v-model="formData[field.key]"
                clearable
                :items="field.options"
                :list-props="{ bgColor: 'roxo_w3' }"
                variant="solo"
                density="compact"
                bg-color="grey-lighten-5"
              ></v-combobox>

              <v-select
                v-else-if="field.type === 'bool'"
                v-model="formData[field.key]"
                :items="[
                  { texto: 'Sim', valor: true },
                  { texto: 'Não', valor: false }
                ]"
                item-title="texto"
                item-value="valor"
                :list-props="{ bgColor: 'roxo_w3' }"
                variant="solo"
                density="compact"
                bg-color="grey-lighten-5"
              ></v-select>

              <v-text-field
                v-else
                v-model="formData[field.key]"
                variant="solo"
                density="compact"
                bg-color="grey-lighten-5"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 d-flex justify-space-evenly">
        <v-btn
          prepend-icon="mdi-content-save"
          color="roxo_w1"
          variant="flat"
          @click="save"
        >
          Salvar
        </v-btn>
        <v-btn
          prepend-icon="mdi-cancel"
          color="roxo_w2"
          variant="flat" 
          @click="close"
        >
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  /**
   * Cria um formulário dinâmico, baseado em um objeto de configuração, que permite
   * executar uma ação (Cadastrar/Editar) para uma entidade do sistema.
   */
  export default {
  name: 'ActionFormDialog',
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
     * Nome da entidade para compor o título do formulário.
     */
    entityTitle: {
      type: String,
      required: true
    },
    /**
     * Objeto inicial (ex: vazio para novo, ou o objeto carregado para editar)
     */
    initialData: {
      type: Object,
      default: () => ({})
    },
    /**
     * Objeto de configuração dos campos: [{ label: 'Estoque', key: 'stock', type: 'qtd' }]
     */
    config: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isEdit: null,
      formData: {}
    }
  },
  computed: {
    isOpen: {
      get() { 
        return this.showModal;
      },
      set(val) { 
        this.$emit('update:showModal', val);
      }
    },
    formTitle() {
      const entityNamesMap = { 
        'products': 'Produto', 
        'jobs': 'Serviço', 
        'sales': 'Venda'
      };

      return `${this.isEdit ? 'Editar' : 'Cadastrar'} ${entityNamesMap[this.entityTitle]} `;
    }
  },
  watch: {
    // Sincroniza os dados sempre que o modal abrir, ou, o item mudar.
    showModal(val) {
    if (val) {
      // Clona os dados iniciais (vazio para novo, preenchido para edit)
      const data = { ...this.initialData };

      // Verifica se é um NOVO registro (sem ID)
      const isNew = !data.id;

      if (isNew) {
        // Itera na configuração para encontrar campos 'bool' e setar default = true
        this.config.forEach(field => {
          if (field.type === 'bool' && data[field.key] === undefined) {
            data[field.key] = true; // Define 'Sim' como padrão
          }
        });
      }

      this.formData = data;
      this.isEdit = !isNew;
    }
  }
  },
  methods: {
    close() {
      this.isOpen = false;
    },
    /**
     * Trata a entrada de campos do tipo 'currency'.
     * Garante que seja sempre positivo e no máximo 2 casas decimais.
     */
    handleCurrencyInput(key, value) {
      if (value === null || value === undefined) return;
      let newValue = Math.abs(value);
      newValue = parseFloat(newValue.toFixed(2));
      this.formData[key] = newValue;
    },

    /**
     * Trata a entrada de campos do tipo 'qtd'.
     * Garante que seja sempre inteiro, positivo e no mínimo 1.
     */
    handleQtdInput(key, value) {
      if (value === null || value === undefined) return;
      let newValue = Math.floor(Math.abs(value));
      if (newValue < 1) newValue = 1;
      this.formData[key] = newValue;
    },
    async save() {
      console.log('Salvou: ', this.formData);
      // const actionPath = (this.isEdit) ? `${this.formData.entity}/edit` : `${this.formData.entity}/save`; //@todo corrigir este else
      // const wasSaved = await this.$store.dispatch(actionPath, this.this.formData);
      // if (wasSaved) this.close();
      this.close();
    }
  }
}
</script>
<style scoped>

/* Breakpoint MD (960px - 1279px) ou superior */
@media (min-width: 960px) {
  .action-form-dialog-container {
    width: 70vw;
  }
  .form-container {
    width: 60%;
  }
}
</style>