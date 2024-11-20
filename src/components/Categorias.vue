<template>
  <div class="p-6 max-w-md mx-auto bg-base-100 rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-primary mb-4">Carreras</h2>
    <input
      type="text"
      placeholder="Buscar"
      v-model="search"
      class="input input-bordered w-full mb-4"
    />
    <ul class="space-y-2">
      <li
        v-for="categoria in filteredCategorias"
        :key="categoria.id"
        @click="selectCategoria(categoria.id)"
        class="p-4 bg-base-200 rounded-lg cursor-pointer hover:bg-primary hover:text-white transition-colors"
      >
        {{ categoria.nombre }}
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '@/stores/firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      search: '',
      categorias: [] // Lista de categorías desde Firestore
    };
  },
  computed: {
    filteredCategorias() {
      return this.categorias.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  mounted() {
    this.loadCategorias(); 
  },
  methods: {
    async loadCategorias() {
      try {
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        this.categorias = categoriasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    },
    // Función para seleccionar una categoría y navegar a la página correspondiente
    selectCategoria(categoriaId) {
      this.$router.push(`/days?category=${categoriaId}`);
    },
  },
};
</script>

<style scoped>
</style>
