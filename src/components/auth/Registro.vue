<template>
  <div class="login-container flex items-center justify-center min-h-screen bg-base-200">
    <div class="w-full max-w-sm p-8 bg-base-100 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-center text-primary mb-6">Registro de Usuario</h2>
      
      <form @submit.prevent="registrarUsuario">
        <!-- Número de carnet -->
        <div class="mb-4">
          <label for="carnet" class="label">
            <span class="label-text">Número de Carnet:</span>
          </label>
          <input
            type="text"
            v-model="carnet"
            placeholder="Ingresa tu número de carnet"
            required
            class="input input-bordered w-full p-3"
          />
        </div>
        
        <!-- Contraseña -->
        <div class="mb-6 relative">
          <label for="password" class="label">
            <span class="label-text">Contraseña:</span>
          </label>
          <input
            :type="passwordVisible ? 'text' : 'password'"
            v-model="password"
            placeholder="Contraseña"
            required
            class="input input-bordered w-full p-3"
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute right-3 top-8 text-sm text-blue-500"
          >
            {{ passwordVisible ? 'Ocultar' : 'Mostrar' }}
          </button>
        </div>
        
        <!-- Botón de registro -->
        <button type="submit" class="btn btn-primary w-full">
          Registrar
        </button>

        <!-- Mensaje de error -->
        <p v-if="error" class="mt-4 text-center text-sm text-red-500">{{ error }}</p>
        
        <!-- Enlace de login -->
        <p class="mt-4 text-center">
          ¿Ya tienes cuenta? <router-link to="/userlogin" class="text-blue-500">Iniciar sesión</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { collection, addDoc } from "firebase/firestore";
import { db } from '@/stores/firebase'; // Asegúrate de importar correctamente tu Firestore

export default {
  data() {
    return {
      carnet: '',
      password: '',
      error: '',
      passwordVisible: false // Controla si la contraseña es visible
    };
  },
  methods: {
    async registrarUsuario() {
      if (this.carnet && this.password) {
        try {
          // Agregar usuario a la colección 'usuarios' en Firestore
          await addDoc(collection(db, 'usuarios'), {
            carnet: this.carnet,
            password: this.password,
            rol: 'usuario'
          });
          
          // Redirigir al login después de un registro exitoso
          this.$router.push("/userlogin");
        } catch (error) {
          console.error("Error al registrar usuario:", error);
          this.error = 'Hubo un error al registrar el usuario.';
        }
      } else {
        this.error = 'Por favor complete todos los campos';
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    }
  }
};
</script>
