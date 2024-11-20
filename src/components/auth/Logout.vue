<template>
    <div class="logout-page flex flex-col items-center justify-center min-h-screen bg-base-200 p-6 text-center">
      <h1 class="text-2xl font-semibold mb-6">¿Estás seguro de que deseas cerrar sesión?</h1>
      <button @click="logout" class="btn btn-error mb-4">Cerrar sesión</button>
      <router-link to="/" class="link link-info">Volver a la página principal</router-link>
    </div>
  </template>
  
  <script>
  import { getAuth, signOut } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Logout',
    setup() {
      const router = useRouter();
  
      const logout = async () => {
        const auth = getAuth();
        try {
          await signOut(auth);
          router.push('/adminlogin');
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
      };
  
      return {
        logout,
      };
    },
  };
  </script>
  
  <style scoped>
  </style>
  