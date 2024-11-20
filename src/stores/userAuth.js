import { defineStore } from 'pinia';

export const useUserAuthStore = defineStore('userAuth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    // Función para iniciar sesión como usuario
    loginAsUser(userData) {
      this.isAuthenticated = true;
      this.user = userData; // Guarda los datos del usuario
    },
    // Función para cerrar sesión
    logout() {
      this.isAuthenticated = false;
      this.user = null;
    }
  }
});
