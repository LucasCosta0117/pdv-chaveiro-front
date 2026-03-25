<template>
  <!-- NavBar Mobile -->
  <v-app-bar
    app
    flat
    height="80"
    class="light-purple-bg"
    v-if="isMobile && isAuthenticated"
  >
    <router-link to="/">
      <div class="navbar-logo-img"></div>
    </router-link>
    <v-spacer></v-spacer>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    class="light-purple-bg"
    v-if="isMobile && isAuthenticated"
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

    <template v-slot:append>
      <v-divider></v-divider>
      <v-list class="pa-4">
        <v-list-item class="px-0 mb-2">
          <v-list-item-title class="font-weight-bold text-truncate">
            <v-icon start>mdi-account-circle</v-icon>
            {{ userName }}
          </v-list-item-title>
        </v-list-item>
        <v-btn block color="error" variant="tonal" @click="handleLogout" prepend-icon="mdi-logout">
          Sair
        </v-btn>
      </v-list>
    </template>
  </v-navigation-drawer>

  <!-- Navbar Desktop -->
  <v-navigation-drawer
    v-if="!isMobile && isAuthenticated"
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

    <template v-slot:append>
      <div class="pa-4">
        <v-list-item class="px-0 mb-2">
          <v-list-item-title class="font-weight-bold text-truncate">
            <v-icon start>mdi-account-circle</v-icon>
            {{ userName }}
          </v-list-item-title>
        </v-list-item>
        <v-btn block color="error" variant="tonal" @click="handleLogout" prepend-icon="mdi-logout">
          Sair
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

/**
 * Barra de navegação (superior e lateral) da aplicação.
 * Integração com Vuex para controle de exibição por autenticação e gestão de sessão.
 * @author Lucas Costa
 * @version 1.1.0
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
    // Mapeia os estados do módulo 'auth' do Vuex
    ...mapGetters('auth', ['isAuthenticated', 'currentUser']),

    /**
     * Verifica o tamanho atual da tela do dispositivo para definir qual barra de navegação renderizar.
     */
    isMobile() {
      return this.windowWidth <= 960;
    },

    /**
     * Retorna o nome do utilizador autenticado de forma segura.
     */
    userName() {
      return this.currentUser ? this.currentUser.name : 'Carregando...';
    }
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // Traz a action de logout configurada no Vuex
    ...mapActions('auth', ['logout']),

    /**
     * Garante a reatividade da barra de navegação através do evento de resize
     */
    handleResize() {
      this.windowWidth = window.innerWidth;
    },

    /**
     * Executa o processo de logout e redireciona para a tela de login.
     */
    handleLogout() {
      this.logout();
      this.drawer = false; // Fecha o menu no mobile por precaução
      this.$router.push({ name: 'login' });
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