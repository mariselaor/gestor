<template>
  <div class="relative p-6 max-w-full mx-auto bg-base-100 rounded-xl shadow-lg">
    <!-- Botón de Cerrar Sesión -->
    <button @click="cerrarSesion" class="absolute top-4 right-4 btn btn-sm btn-outline btn-danger">
      Cerrar sesión
    </button>

    <!-- Título de la categoría seleccionada -->
    <h2 class="text-xl font-semibold text-primary mb-4 text-center">Categoría seleccionada: {{ selectedCategoria }}</h2>

    <!-- Selección de Categoría (con botones pequeños) -->
    <div class="mb-6">
      <h3 class="text-lg font-medium text-gray-700 mb-2">Seleccionar Categoría:</h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="categoria in categoriasConHorarios" 
          :key="categoria.id" 
          @click="mostrarInformacion(categoria)"
          class="btn btn-sm btn-outline btn-primary"
        >
          {{ categoria.nombre }}
        </button>
      </div>
      <p v-if="categoriaInfo === null" class="mt-4 text-red-500">Seleccione una categoría para ver su información.</p>
    </div>

    <!-- Contenedor para la tabla y la selección de materias -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Información de las materias seleccionadas (izquierda) -->
      <div class="flex-1">
        <div class="overflow-x-auto">
          <table v-if="materiasSeleccionadas.length > 0" class="table table-zebra w-full">
            <thead>
              <tr>
                <th>Asignatura</th>
                <th>Día</th>
                <th>Horario</th>
                <th>Docente</th>
                <th>Salón</th>
                <th>Carrera</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="materia in materiasSeleccionadas" :key="materia.id">
                <td>{{ materia.asignatura }}</td>
                <td>{{ materia.dia }}</td>
                <td>{{ materia.horaInicio }} - {{ materia.horaFin }}</td>
                <td>{{ materia.docente }}</td>
                <td>{{ materia.salon }}</td>
                <td>{{ materia.carrera }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="materiasSeleccionadas.length === 0" class="mt-4 text-red-500">Seleccione al menos una materia para ver su información.</p>
        </div>
      </div>

      <!-- Selección de materias (derecha) -->
      <div class="flex-1">
        <div v-if="categoriaInfo" class="mb-4">
          <h3 class="text-lg font-medium text-gray-700 mb-4">Seleccionar Materias:</h3>
          <div class="space-y-2">
            <label v-for="materia in categoriaInfo.horarios" :key="materia.id" class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                :value="materia.id"
                v-model="materiasSeleccionadasIds"
                class="checkbox checkbox-primary"
              />
              <span>{{ materia.asignatura }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { db } from '@/stores/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      categorias: [],  // Array para almacenar las categorías
      categoriasConHorarios: [],  // Categorías que tienen horarios disponibles
      selectedCategoriaId: null,  // Id de la categoría seleccionada
      selectedCategoria: null,  // Nombre de la categoría seleccionada
      categoriaInfo: null,  // Información de la categoría seleccionada
      materiasSeleccionadasIds: JSON.parse(localStorage.getItem('materiasSeleccionadas')) || [],  // Recuperar las materias seleccionadas desde localStorage
    };
  },
  computed: {
    // Obtener las materias seleccionadas a partir de sus IDs
    materiasSeleccionadas() {
      let seleccionadas = [];
      this.categoriasConHorarios.forEach(categoria => {
        categoria.horarios.forEach(materia => {
          if (this.materiasSeleccionadasIds.includes(materia.id)) {
            seleccionadas.push(materia);
          }
        });
      });
      return seleccionadas;
    }
  },
  async created() {
    // Llamar a la función para cargar las categorías
    await this.fetchCategorias();
  },
  methods: {
    // Obtener las categorías disponibles desde la base de datos
    async fetchCategorias() {
      try {
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));

        if (categoriasSnapshot.empty) {
          console.log("No hay categorías disponibles.");
        } else {
          this.categorias = categoriasSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Filtrar solo las categorías que tienen horarios disponibles
          this.categoriasConHorarios = await this.getCategoriasConHorarios(this.categorias);
        }
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    },

    // Obtener las categorías que tienen horarios disponibles desde las subcolecciones
    async getCategoriasConHorarios(categorias) {
      const categoriasConHorarios = [];

      for (let categoria of categorias) {
        const horariosRef = collection(db, 'categorias', categoria.id, 'horarios');
        const horariosSnapshot = await getDocs(horariosRef);

        if (!horariosSnapshot.empty) {
          categoriasConHorarios.push({
            id: categoria.id,
            nombre: categoria.nombre,
            horarios: horariosSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              carrera: categoria.nombre
            })),
          });
        }
      }

      return categoriasConHorarios;
    },

    // Mostrar información de la categoría seleccionada y sus horarios
    mostrarInformacion(categoriaSeleccionada) {
      this.selectedCategoria = categoriaSeleccionada.nombre;  // Actualiza la categoría seleccionada
      this.categoriaInfo = categoriaSeleccionada;  // Guarda la información de la categoría y horarios
      this.selectedCategoriaId = categoriaSeleccionada.id; // Actualiza el id de la categoría seleccionada
    },
  },
  watch: {
    // Guardar las materias seleccionadas en localStorage cada vez que se cambien
    materiasSeleccionadasIds(newMaterias) {
      localStorage.setItem('materiasSeleccionadas', JSON.stringify(newMaterias));
    }
  }
};
</script>

<style scoped>
/* El estilo sigue siendo limpio y adaptado a DaisyUI y Tailwind */
</style>
