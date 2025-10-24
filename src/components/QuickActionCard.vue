<template>
  <v-card class="elevation-5 pa-3">
    <div class="sale-card-title">
      <p>{{ title }}</p>
      <span :class="typeAction == 'Produto' ? productIcon : jobIcon"></span>
    </div>
    <div>
      <v-autocomplete
        variant="underlined"
        color="roxo_w1"
        :label="typeAction"
        :rules="[rules.required]"
        :items="items"
        clearable
      ></v-autocomplete>
      <v-number-input
        v-model="qtd"
        inset
        color="roxo_w1"
        controlVariant="default"
        label="Quantidade"
        variant="underlined"
        :reverse="false"
        :min="1"
      ></v-number-input>
      <div class="d-flex align-center flex-column">
        <v-btn-toggle
          v-model="payment"
          divided
          border
          color="roxo_w1"
        >
          <v-btn icon="mdi mdi-rhombus"></v-btn>
          <v-btn icon="mdi-cash-multiple"></v-btn>
          <v-btn icon="mdi-credit-card-settings"></v-btn>
          <v-btn icon="mdi-credit-card-settings-outline"></v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <div class="btn-add">
      <v-btn color="roxo_w1"> Adicionar </v-btn>
    </div>
  </v-card>
</template>
<script>
export default {
  name: 'QuickActionCard',
  props: {
    title: {
      type: String,
      default: 'Cópia Simples'
    },
    typeAction:{
      type: String,
      default: 'Produto'
    }
  },
  data() {
    return {
      productIcon: 'mdi mdi-cart-outline',
      jobIcon: 'mdi mdi-hammer-screwdriver',
      rules: {
        required: (value) => !!value || 'Preenchimento obrigatório',
      },
      items: ['Gold-1129', 'Yale-12345'],
      qtd: 1,
      payment: null
    }
  }
}
</script>
<style scoped>
.sale-card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sale-card-title p {
  font-weight: 500;
  font-size: 1.1rem;
}
.sale-card-title span {
  font-size: 1.5rem;
}
.btn-add {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}
.btn-add .v-btn {
  width: 90%;
}
</style>