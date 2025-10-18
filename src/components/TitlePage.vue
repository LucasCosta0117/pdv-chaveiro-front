<template>
  <div>
    <h3>{{ title }}</h3>
    <p v-if="subtitle" class="subtitle-page">{{ subtitle }}</p>
  </div>
</template>
<script>
export default {
  name: 'ProductsTable',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
.subtitle-page {
  color: rgb(var(--v-theme-cinza_w2));
}
</style>