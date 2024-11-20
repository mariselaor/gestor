<template>
  <div class="p-6 max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg">
    <!-- Enlace para regresar a la página principal -->
    <router-link to="/" class="link link-info mb-4">Volver a la página principal</router-link>

    <!-- Mostrar el día seleccionado -->
    <h2 class="text-2xl font-bold text-primary mb-4">{{ selectedDay }}</h2>

    <!-- Mensaje de éxito o error -->
    <div v-if="message" class="mt-4 p-4" :class="{'bg-green-100 text-green-800': message.type === 'success', 'bg-red-100 text-red-800': message.type === 'error'}">
      {{ message.text }}
    </div>

    <!-- Mostrar un mensaje si no hay clases filtradas -->
    <div v-if="clasesFiltradas.length === 0" class="mt-4 text-red-500">
      <p>No se encontraron clases para el día seleccionado.</p>
    </div>

    <!-- Tabla de horarios si hay clases filtradas -->
    <table v-else class="table table-zebra w-full">
  <thead>
    <tr>
      <th>Asignatura</th>
      <th>Día</th>
      <th>Horario</th>
      <th>Docente</th>
      <th>Salón</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="clase in clasesFiltradas" :key="clase.id">
      <td>{{ clase.asignatura }}</td>
      <td>{{ clase.dia }}</td>
      <td>{{ clase.horaInicio }} - {{ clase.horaFin }}</td>
      <td>{{ clase.docente }}</td>
      <td>{{ clase.salon }}</td>
      <td>
        <button @click="editClase(clase)" class="btn btn-warning btn-sm mr-2">Editar</button>
        <button @click="askDeleteClase(clase.id)" class="btn btn-danger btn-sm">Eliminar</button>
      </td>
    </tr>
  </tbody>
</table>

    <!-- Formulario de edición -->
    <div v-if="editMode" class="mt-4 p-4 bg-gray-100 rounded-xl shadow-md">
      <h3 class="text-xl font-bold">Editar Clase</h3>
      <form @submit.prevent="saveClase">
        <div>
          <label for="asignatura" class="block">Asignatura</label>
          <input type="text" v-model="editableClase.asignatura" class="input input-bordered w-full" />
        </div>
        <div class="mt-2">
          <label for="dia" class="block">Día</label>
          <input type="text" v-model="editableClase.dia" class="input input-bordered w-full" />
        </div>
        <div class="mt-2">
          <label for="horario" class="block">Horario</label>
          <input type="text" v-model="editableClase.horario" class="input input-bordered w-full" />
        </div>
        <div class="mt-2">
          <label for="docente" class="block">Docente</label>
          <input type="text" v-model="editableClase.docente" class="input input-bordered w-full" />
        </div>
        <div class="mt-2">
          <label for="salon" class="block">Salón</label>
          <input type="text" v-model="editableClase.salon" class="input input-bordered w-full" />
        </div>
        <div class="mt-4">
          <button type="submit" class="btn btn-primary">Guardar cambios</button>
          <button @click.prevent="cancelEdit" class="btn btn-secondary ml-2">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Modal de confirmación de eliminación (DaisyUI) -->
    <div v-if="deletingClaseId" class="modal modal-open">
      <div class="modal-box">
        <h2 class="text-xl font-bold">Confirmar eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar esta clase? Esta acción no se puede deshacer.</p>
        <div class="modal-action">
          <button @click="deleteClase(deletingClaseId)" class="btn btn-danger">Eliminar</button>
          <button @click="cancelDelete" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/stores/firebase';
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      selectedDay: this.$route.params.day, // Obtiene el día de la URL
      clases: [],  // Array para almacenar los horarios
      editMode: false, // Controla si estamos en modo edición
      editableClase: {}, // Almacena los datos de la clase que se está editando
      message: null,  // Mensaje de éxito o error
      deletingClaseId: null,  // ID de la clase que se está eliminando
    };
  },
  computed: {
    // Filtrar las clases por el día seleccionado
    clasesFiltradas() {
      return this.clases.filter(clase => clase.dia === this.selectedDay);
    },
  },
  async created() {
    // Llamar a la función para cargar los horarios
    await this.fetchHorarios();
  },
  methods: {
    // Cargar los horarios desde Firebase
    async fetchHorarios() {
      try {
        const category = this.$route.query.category;
        if (!category) {
          console.error('No se pasó ninguna categoría en la URL');
          return;
        }

        const categoriaDoc = await getDocs(query(collection(db, 'categorias'), where('__name__', '==', category)));

        if (categoriaDoc.empty) {
          console.log("Categoría no encontrada.");
          return;
        }

        const horariosCollection = collection(categoriaDoc.docs[0].ref, 'horarios');
        const horariosSnapshot = await getDocs(horariosCollection);

        if (horariosSnapshot.empty) {
          console.log("No hay horarios disponibles para esta categoría.");
        } else {
          this.clases = horariosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
      }
    },

    // Activar el modo de edición para una clase específica
    editClase(clase) {
      this.editMode = true;
      this.editableClase = { ...clase }; // Cargar los datos de la clase seleccionada
    },

    // Guardar los cambios realizados en la clase
    async saveClase() {
      try {
        if (!this.editableClase.id) {
          console.error('ID de la clase no encontrado. No se puede guardar.');
          return;
        }

        const claseRef = doc(db, 'categorias', this.$route.query.category, 'horarios', this.editableClase.id);

        // Actualizamos los datos de la clase en Firebase
        await updateDoc(claseRef, {
          asignatura: this.editableClase.asignatura,
          dia: this.editableClase.dia,
          horario: this.editableClase.horario,
          docente: this.editableClase.docente,
          salon: this.editableClase.salon,
        });

        // Actualizamos el array local de clases con los nuevos datos
        const index = this.clases.findIndex(clase => clase.id === this.editableClase.id);
        if (index !== -1) {
          this.clases[index] = { ...this.editableClase }; // Actualizamos la clase en el array local
        }

        // Desactivamos el modo de edición y limpiamos los datos
        this.editMode = false;
        this.editableClase = {};

        // Mostrar mensaje de éxito
        this.message = {
          type: 'success',
          text: 'Cambios guardados exitosamente.'
        };

        // Eliminar mensaje después de 3 segundos
        setTimeout(() => {
          this.message = null;
        }, 3000);
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        // Mostrar mensaje de error
        this.message = {
          type: 'error',
          text: 'Hubo un error al guardar los cambios. Por favor, intenta nuevamente.'
        };

        setTimeout(() => {
          this.message = null;
        }, 3000);
      }
    },

    // Función para cancelar la edición
    cancelEdit() {
      this.editMode = false;
      this.editableClase = {}; // Limpiar los datos de la clase editable
    },

    // Activar el modo de eliminación para una clase
    askDeleteClase(id) {
      this.deletingClaseId = id; // Almacenamos el ID de la clase que se está eliminando
    },

    // Cancelar la eliminación de una clase
    cancelDelete() {
      this.deletingClaseId = null; // Limpiar el ID de la clase que se está eliminando
    },

    // Eliminar una clase de Firebase y actualizar la lista
    async deleteClase(id) {
      try {
        const claseRef = doc(db, 'categorias', this.$route.query.category, 'horarios', id);
        await deleteDoc(claseRef);

        // Actualizamos la lista local de clases
        this.clases = this.clases.filter(clase => clase.id !== id);

        // Mostrar mensaje de éxito
        this.message = {
          type: 'success',
          text: 'Clase eliminada exitosamente.'
        };

        // Eliminar mensaje después de 3 segundos
        setTimeout(() => {
          this.message = null;
        }, 3000);

        // Limpiar la clase eliminada
        this.deletingClaseId = null;
      } catch (error) {
        console.error('Error al eliminar la clase:', error);
        this.message = {
          type: 'error',
          text: 'Hubo un error al eliminar la clase. Por favor, intenta nuevamente.'
        };

        setTimeout(() => {
          this.message = null;
        }, 3000);
      }
    }
  }
};
</script>

<style scoped>
/* Estilos para los botones */
.btn-sm {
  padding: 4px 10px;
}
</style>
