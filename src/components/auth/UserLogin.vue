<template>
  <div class="login-container flex items-center justify-center min-h-screen bg-base-200">
    <div class="w-full max-w-sm p-8 bg-base-100 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-center text-primary mb-6">Iniciar sesión</h2>
      
      <form @submit.prevent="iniciarSesion">
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
        <div class="mb-6">
          <label for="password" class="label">
            <span class="label-text">Contraseña:</span>
          </label>
          <input
            type="password"
            v-model="password"
            placeholder="Contraseña"
            required
            class="input input-bordered w-full p-3"
          />
        </div>
        
        <!-- Botón de inicio -->
        <button type="submit" class="btn btn-primary w-full">
          Iniciar sesión
        </button>

        <!-- Mensaje de error -->
        <p v-if="error" class="mt-4 text-center text-sm text-red-500">{{ error }}</p>
        
        <!-- Enlace de login como administrador -->
        <p class="mt-4 text-center">
          ¿Eres un administrador? <router-link to="/adminlogin" class="text-blue-500">Iniciar sesión como administrador</router-link>
        </p>
        
        <!-- Enlace de registro -->
        <p class="mt-4 text-center">
          ¿No tienes cuenta? <router-link to="/registro" class="text-blue-500">Regístrate aquí</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importar Firebase Authentication
import { db } from '@/stores/firebase'; // Importa la instancia de Firestore que ya has configurado
import { useAuthStore } from '@/stores/auth.store'; // Importa el store de autenticación

export default {
  data() {
    return {
      carnet: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async iniciarSesion() {
      if (this.carnet && this.password) {
        try {
          const auth = getAuth(); // Inicializa la autenticación
          const usuariosRef = collection(db, 'usuarios');
          const q = query(usuariosRef, where('carnet', '==', this.carnet)); // Filtra por el carnet

          // Realiza la consulta a Firestore para obtener el usuario con el carnet
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            this.error = 'Carnet no encontrado';
            return;
          }

          // Verificar si la contraseña coincide con la que está en Firestore
          let isAuthenticated = false;
          querySnapshot.forEach((doc) => {
            const usuariosData = doc.data();
            if (usuariosData.password === this.password) {
              isAuthenticated = true;
            }
          });

          if (isAuthenticated) {
            // Si el usuario está autenticado, guarda el estado de autenticación
            const authStore = useAuthStore();
            authStore.loginAsUser(); // Marca al usuario como autenticado

            // Redirige al usuario a la página de horario
            this.$router.push('/scheduler');
          } else {
            this.error = 'Contraseña incorrecta';
          }
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
          this.error = 'Hubo un error al verificar las credenciales.';
        }
      } else {
        this.error = 'Por favor complete todos los campos';
      }
    }
  }
};
</script>
