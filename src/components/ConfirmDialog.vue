<template>
  <v-dialog v-model="isOpen" width="250">
    <v-card>
      <v-card-text>
        Deseja prosseguir com esta ação?
      </v-card-text>
      <v-card-actions class="d-flex justify-space-evenly mb-2">
        <v-btn
          color="verde_w1" 
          variant="flat"
          :disabled="ableConfirmButton"
          @click="confirmAction"
        >
          Sim {{ ableConfirmButton ? `(${countdownTimer})` : '' }}
        </v-btn>
        <v-btn 
          color="vermelho_w1"
          variant="flat"
          @click="isOpen = false"
        >
          Não
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
/**
 * Modal para confirmação de uma ação sensível, por exemplo, a exclusão de um dado.
 */
export default {
  name: 'ConfirmDialog',
  props: {
    /**
     * Flag para controle de exibição do modal/dialog.
     */
    showModal: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  data() {
    return {
      // flag para habilitar/desabilitar o botão de confirmação.
      ableConfirmButton: true,
      // Tempo de executação do countdown.
      countdownTimer: 3,
      // Referência para limpar o intervalo.
      timer: null
    }
  },
  watch: {
    /**
     * Observa quando o modal abre ou fecha.
     * @param val valor da flag de manipulação do modal.
     */
    showModal(val) {
      if (val) {
        this.startCountdown();
      } else {
        this.resetState();
      }
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
        this.$emit('update:showModal', val)
      }
    }
  },
  methods: {
    /**
     * Habilita um contador junto ao botão de confirmar, evitando confirmações acidentais.
     */
    startCountdown() {
      this.timer = setInterval(() => {
        this.countdownTimer--;

        if (this.countdownTimer <= 0) {
          this.ableConfirmButton = false;
          clearInterval(this.timer);
        }
      }, 1000)
    },
    /**
     * Limpa qualquer timer rodando e reseta as variáveis.
     */
    resetState() {
      clearInterval(this.timer);
      this.ableConfirmButton = true;
      this.countdownTimer = 3;
    },
    /**
     * Emite um evento confirmando o prosseguimento da ação para o componente pai.
     */
    confirmAction() {
      this.$emit('confirm');
      this.isOpen = false;
    }
  },
  beforeUnmount() {
    // Garante que o timer seja removido ao destruir o componente.
    clearInterval(this.timer);
  }
}
</script>
<style scoped>

</style>