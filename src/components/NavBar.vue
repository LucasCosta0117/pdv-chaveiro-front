<template>
  <!-- NavBar Mobile -->
  <v-app-bar
    app
    flat
    height="80"
    class="light-purple-bg"
    v-if="isMobile"
  >
    <router-link to="/">
      <div class="navbar-logo-img"></div>
    </router-link>
    <v-spacer></v-spacer>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  </v-app-bar>
  <!-- Drawer Mobile -->
  <v-navigation-drawer
    v-model="drawer"
    class="light-purple-bg"
    v-if="isMobile"
    temporary
  >
    <v-list>
      <v-list-item
        v-for="item in menuItens" 
        :key="item.text"
        :to="item.to"
        @click="drawer = false"
        class="ml-4 rounded-menu-item"
        :class="{ 'highlighted-men-item': $route.path === item.to }"
        link
      >
        <v-list-item-title>
          <span :class="item.icon" class="menu-item-icon"></span>
          {{ item.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- Navbar Desktop -->
  <v-navigation-drawer
    v-if="!isMobile"
    class="light-purple-bg"
    permanent
  >
    <v-list>
      <v-list-item>
        <div class="navbar-logo-img"></div>
      </v-list-item>
      <v-list-item
        v-for="item in menuItens" 
        :key="item.text"
        :to="item.to"
        class="ml-4 mt-2 rounded-menu-item"
        :class="{ 'highlighted-men-item': $route.path === item.to }"
        link
      >
        <v-list-item-title>
          <span :class="item.icon" class="menu-item-icon"></span>
          {{ item.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
/**
 * Barra de navegação (superior e lateral) da aplicação.
 */
export default {
  name: 'NavBar',
  data() {
    return {
      drawer: false,
      windowWidth: window.innerWidth,
      menuItens: [
        { text: 'Início', to: '/', icon: 'mdi mdi-home-outline'},
        { text: 'Caixa', to: '/sales', icon: 'mdi mdi-point-of-sale'},
        { text: 'Catálogo', to: '/inventory', icon: 'mdi mdi-file-table-box-multiple-outline'},
        { text: 'Histórico', to: '/history', icon: 'mdi mdi-history'},
      ],
      currentSection: 'home'
    }
  },
  computed: {
    /**
     * Verifica o tamanho atual da tela do dispositivo para definir qual barra de navefação renderizar.
     */
    isMobile() {
      return this.windowWidth <= 960;
    },
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    /**
     * Garante a reatividade da barra de navegação através do evento de resize
     */
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  }
}
</script>

<style scoped>
.light-purple-bg {
  background-color: rgb(var(--v-theme-roxo_w3));
}
.navbar-logo-img {
  width: 5rem;
  height: 5rem;
  background-image: url('@/assets/company/logo-light.png');
  background-position: center;
  background-size: cover;
}
.menu-item-icon {
  font-size: 1.2rem;
}
.highlighted-men-item {
  background-color: rgb(var(--v-theme-roxo_w2));
}
.rounded-menu-item {
  border-bottom-left-radius: 1.2rem !important;
  border-top-left-radius: 1.2rem !important;
}
/**
 * Dispositivos médios/grandes
 * Vuetify 'md' Break Point
 */
@media (min-width: 960px) {

}
</style>
