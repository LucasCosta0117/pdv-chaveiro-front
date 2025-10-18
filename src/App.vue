<template>
  <v-app>
    <NavBar></NavBar>
    <v-main>
      <router-view/>
      <AppSnackBar/>
      <AppLoader/>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue';
import AppSnackBar from './components/AppSnackBar.vue';
import AppLoader from './components/AppLoader.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    AppSnackBar,
    AppLoader
  },
  data: () => ({
    //
  }),
}
</script>
