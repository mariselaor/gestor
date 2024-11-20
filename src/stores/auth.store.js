import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAdminAuthenticated: false,
    isUserAuthenticated: false,
  }),
  actions: {
    loginAsAdmin() {
      this.isAdminAuthenticated = true;
      this.isUserAuthenticated = false; // Si el admin inicia sesión, desactiva el usuario normal
    },
    loginAsUser() {
      this.isUserAuthenticated = true;
      this.isAdminAuthenticated = false; // Si el usuario normal inicia sesión, desactiva el admin
    },
    logout() {
      this.isAdminAuthenticated = false;
      this.isUserAuthenticated = false;
    }
  }
});
