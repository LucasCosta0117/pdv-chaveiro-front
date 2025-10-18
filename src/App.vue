<template>
  <v-app>
    <NavBar></NavBar>
    <v-main>
      <router-view/>
      <AppSnackBar />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue';
import AppSnackBar from './components/AppSnackBar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    AppSnackBar
  },
  data: () => ({
    //
  }),
}
</script>
