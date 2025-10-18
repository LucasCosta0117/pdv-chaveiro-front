<template>
  <v-container class="d-flex flex-column align-center justify-center text-center">
    <v-row>
      <v-col>
        <v-img
          :src="imgPath"
          alt="Page not found"
          max-width="300"
          class="mb-6"
        ></v-img>
    
        <h1 class="text-h2 font-weight-bold mb-2">404</h1>
        <p class="text-subtitle-1 mb-6">Page not found</p>
    
        <v-btn
          color="roxo_w2"
          variant="flat"
          @click="$router.push('/')"
        >
          Voltar para o início
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'NotFoundView',
  data() {
    return {
      imgPath: require('@/assets/utils/404.webp')
    }
  }
}
</script>
<style scoped>
</style>
