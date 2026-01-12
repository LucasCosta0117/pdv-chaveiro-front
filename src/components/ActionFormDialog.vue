<template>
  <v-dialog v-model="isOpen" height="100vh" persistent class="action-form-dialog-container">
    <v-card>
      <v-card-title class="bg-roxo_w1 d-flex justify-space-between align-center">
        <span>{{ formTitle }}</span>
        <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form ref="form">
          <v-row
            v-for="field in config"
            :key="field.key"
          >
            <v-col cols="12" class="pb-0">
              <span>{{ field.label }}</span>
            </v-col>

            <v-col cols="12" class="pt-2">
              <v-text-field
                v-if="field.type === 'qtd' || field.type === 'currency'"
                v-model.number="formData[field.key]"
                type="number"
                variant="solo"
                density="compact"
                :prefix="field.type === 'currency' ? 'R$' : ''"
              ></v-text-field>

              <v-select
                v-else-if="field.type === 'select'"
                v-model="formData[field.key]"
                :items="field.options"
                variant="solo"
                density="compact"
              ></v-select>

              <v-text-field
                v-else
                v-model="formData[field.key]"
                variant="solo"
                density="compact"
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
      return `${this.isEdit ? 'Editar' : 'Novo'} ${this.entityTitle}`;
    }
  },
  watch: {
    // Sincroniza os dados sempre que o modal abrir ou o item mudar
    showModal(val) {
      if (val) {
        this.formData = { ...this.initialData };
      }
    }
  },
  methods: {
    close() {
      this.isOpen = false;
    },
    async save() {
      console.log('Salvou: ', this.formData);
      // const actionPath = (this.isEdit) ? `${this.formData.entity}/edit` : `${this.formData.entity}/save`; //@todo corrigir este else
      // const wasSaved = await this.$store.dispatch(actionPath, this.this.formData);
      // if (wasSaved) this.close();
      this.close();
    }
  },
  created() {
    this.isEdit = this.initialData && this.initialData.id;
  }
}
</script>
<style scoped>

/* Breakpoint MD (960px - 1279px) ou superior */
@media (min-width: 960px) {
  .action-form-dialog-container {
    width: 70vw;
  }
}
</style>