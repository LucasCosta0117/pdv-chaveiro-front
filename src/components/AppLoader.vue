<template>
  <v-overlay
    v-model="loading"
    class="d-flex align-center justify-center"
    scrim="cinza_w2"
    opacity="0.3"
  >
    <v-progress-circular
      indeterminate
      size="70"
      width="8"
      color="roxo_w1"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AppLoader',
  computed: {
    ...mapState('ui', ['loading'])
  }
}
</script>

<style scoped>
.v-overlay {
  position: fixed !important;
}
</style>