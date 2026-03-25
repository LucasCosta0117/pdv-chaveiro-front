<template>
  <v-container class="fill-height login-container" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 rounded-lg">
          <v-toolbar color="roxo_w1" dark flat class="text-center">
            <v-toolbar-title class="font-weight-bold w-100">
              Acesso iZi PDV
            </v-toolbar-title>
          </v-toolbar>

          <v-card-text class="pt-6">
            <v-form @submit.prevent="handleLogin" ref="loginForm">
              <v-text-field
                label="E-mail"
                name="email"
                prepend-inner-icon="mdi-email"
                type="email"
                v-model="credentials.email"
                :rules="rules.email"
                variant="outlined"
                autocomplete="username"
                required
                @keyup.enter="handleLogin"
              ></v-text-field>

              <v-text-field
                label="Senha"
                name="password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                v-model="credentials.password"
                :rules="rules.password"
                variant="outlined"
                class="mt-2"
                autocomplete="current-password"
                required
                @click:append-inner="showPassword = !showPassword"
                @keyup.enter="handleLogin"
              ></v-text-field>

              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="mt-4"
                closable
              >
                {{ errorMessage }}
              </v-alert>
            </v-form>
          </v-card-text>

          <v-card-actions class="px-4 pb-6">
            <v-btn
              color="roxo_w1"
              size="large"
              block
              :loading="isLoading"
              @click="handleLogin"
            >
              Entrar no Sistema
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

/**
 * @component LoginView
 * @description View responsável pela interface de autenticação do sistema.
 * Coleta as credenciais do utilizador, interage com o Vuex (módulo auth) e 
 * redireciona para a Home em caso de sucesso.
 * @author Lucas Costa
 * @version 1.0.0
 */
export default {
  name: 'LoginView',
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      credentials: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          v => !!v || 'O e-mail é obrigatório.',
          v => /.+@.+\..+/.test(v) || 'Insira um e-mail válido.'
        ],
        password: [
          v => !!v || 'A senha é obrigatória.'
        ]
      },
      showPassword: false
    };
  },
  methods: {
    // Mapeia a action 'login' do módulo 'auth' do Vuex para dentro deste componente
    ...mapActions('auth', ['login']),
    /**
     * Valida o formulário e dispara o processo de autenticação.
     */
    async handleLogin() {
      // Validação do formulário Vuetify
      const { valid } = await this.$refs.loginForm.validate();
      if (!valid) return;

      this.isLoading = true;
      this.errorMessage = '';

      try {
        // Chama a action do Vuex mapeada acima
        await this.login(this.credentials);
        
        // Se a Promise do login resolver, o token foi salvo. Redireciona para a Home.
        this.$router.push({ name: 'home' });
      } catch (error) {
        // O Axios Interceptor repassa o erro 401 para cá
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'E-mail ou senha incorretos.';
        } else if (error.response && error.response.status === 403) {
          this.errorMessage = 'Acesso negado. Verifique as suas permissões.';
        } else {
          this.errorMessage = 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style>
.login-container {
  background: #c19ede;
  background: radial-gradient(circle, rgba(193, 158, 222, 1) 0%, rgba(111, 77, 161, 1) 100%);
}
</style>