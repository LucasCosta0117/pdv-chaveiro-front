<template>
  <v-dialog v-model="isOpen" height="90vh" persistent class="action-form-dialog-container">
    <v-card class="d-flex flex-column h-100">
      <v-card-title class="bg-roxo_w1 d-flex justify-space-between align-center text-uppercase flex-none">
        <span>{{ formTitle }}</span>
        <v-btn icon="mdi-close" variant="text" @click="cancel"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-4 d-flex flex-grow-1 overflow-y-auto">
        <v-form ref="form" class="form-container mx-auto">
          <v-row>
            <v-col
              v-for="field in config"
              :key="field.key"
              cols="12"
              :md="field.cols || 12"
            >
              <label>{{ field.label }}<span v-if="field.required" > *</span></label>

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
                :rules="[
                  v => v >= 0 || 'Valor não pode ser negativo',
                  v => (!field.required || !!v) || `${field.label} é obrigatório`
                ]"
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
                  v => Number.isInteger(v) || 'Apenas números inteiros',
                  v => (!field.required || !!v) || `${field.label} é obrigatório`
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
                :rules="[
                  v => (!field.required || !!v) || `${field.label} é obrigatório`
                ]"
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
                :rules="[
                  v => (!field.required || !!v) || `${field.label} é obrigatório`
                ]"
              ></v-select>

              <template v-else-if="field.type === 'image'">
                <v-img
                  :src="formData[field.key] || noImagePlaceholder"
                  class="mb-2 rounded border img-thumb"
                  cover
                ></v-img>
                <v-file-input
                  accept="image/*"
                  label="Clique para selecionar ou arraste a imagem"
                  variant="solo"
                  density="compact"
                  bg-color="grey-lighten-5"
                  prepend-icon="mdi-camera"
                  :loading="isImgUploading"
                  :disabled="isImgUploading"
                  @update:model-value="onFileSelected(field.key, $event)"
                ></v-file-input>
              </template>

              <v-text-field
                v-else
                v-model="formData[field.key]"
                variant="solo"
                density="compact"
                bg-color="grey-lighten-5"
                :rules="[
                  v => (!field.required || !!v) || `${field.label} é obrigatório`
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 d-flex justify-space-evenly flex-none">
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
          @click="cancel"
        >
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  import { uploadFile, deleteFile } from '@/services/storageService';
  import noImagePlaceholder from '@/assets/utils/no-image.webp';

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
    entity: {
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
      isImgUploading: false,
      imgUploaded: null,
      noImagePlaceholder,
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

      return `${this.isEdit ? 'Editar' : 'Cadastrar'} ${entityNamesMap[this.entity]} `;
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
    /**
     * Reseta o estado interno do formulário, limpa referências de imagens 
     * temporárias e fecha o dialog.
     */
    close() {
      this.isEdit = null;
      this.imgUploaded = null;
      this.formData = {};
      this.isOpen = false;
    },
    /**
     * Cancela a operação atual. 
     * Caso uma imagem tenha sido enviada para a nuvem durante a sessão mas não confirmada via salvamento,
     * o método tenta removê-la para evitar arquivos órfãos na núvem.
     */
    async cancel() {
      try {
        if (this.imgUploaded) {
          console.log('Removendo imagem órfã: ', this.imgUploaded);
          await deleteFile(this.imgUploaded);
        }
      } catch (error) {
        console.error("Não foi possível remover a imagem da nuvem ao cancelar o formulário.");
      } finally {
        this.close();
      }
    },
    /**
     * Intercepta e formata a entrada de campos monetários.
     * Garante valores positivos e limita a precisão para duas casas decimais.
     * @param {string} key - A chave do campo no objeto formData.
     * @param {number} value - O valor numérico inserido no input.
     */
    handleCurrencyInput(key, value) {
      if (value === null || value === undefined) return;
      let newValue = Math.abs(value);
      newValue = parseFloat(newValue.toFixed(2));
      this.formData[key] = newValue;
    },
    /**
     * Intercepta e formata a entrada de campos de quantidade.
     * Garante números inteiros, positivos e um valor mínimo de 1.
     * @param {string} key - A chave do campo no objeto formData.
     * @param {number} value - O valor numérico inserido no input.
     */
    handleQtdInput(key, value) {
      if (value === null || value === undefined) return;
      let newValue = Math.floor(Math.abs(value));
      if (newValue < 1) newValue = 1;
      this.formData[key] = newValue;
    },
    /**
     * Gerencia o upload de arquivos de imagem para o Firebase Storage.
     * Atualiza o formData com a URL pública de retorno e rastreia o upload para 
     * possíveis exclusões em caso de cancelamento.
     * @async
     * @param {string} key - A chave do campo de imagem no objeto formData.
     * @param {File} file - O arquivo binário selecionado pelo usuário.
     */
    async onFileSelected(key, file) {
      if (!file) return;

      try {
        this.isImgUploading = true;
        const url = await uploadFile(file, this.entity.toLowerCase());
        this.formData[key] = url;
        this.imgUploaded = url;

        this.$store.dispatch('ui/notify', {
          message: 'Imagem carregada com sucesso!',
          color: 'success'
        }, { root: true });
      } catch (error) {
        console.error("Erro no upload:", error);
        this.$store.dispatch('ui/notify', {
          message: 'Falha ao carregar a imagem selecionada.',
          color: 'error'
        }, { root: true });
      } finally {
        this.isImgUploading = false;
      }
    },
    /**
     * Valida os campos obrigatórios e as regras de negócio do formulário.
     * Se válido, prossegue com a persistência dos dados (Cadastro ou Edição).
     */
    async save() {
      const { valid } = await this.$refs.form.validate();

      if (!valid) {
        this.$store.dispatch('ui/notify', {
          message: 'Por favor, preencha os campos obrigatórios!',
          color: 'warning'
        }, { root: true });
        return;
      }

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
.img-thumb {
  height: 200px;
}

/* Breakpoint MD (960px - 1279px) ou superior */
@media (min-width: 960px) {
  .action-form-dialog-container {
    width: 60vw;
  }
  .form-container {
    width: 80%;
  }
  .img-thumb {
    height: 350px;
  }
}
</style>