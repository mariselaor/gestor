<template>
  <div class="p-6 max-w-md mx-auto bg-base-100 rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-primary mb-4">Añadir Nuevo Horario</h2>
    <form @submit.prevent="saveSchedule">
      <!-- Seleccionar Día -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Día:</label>
        <select v-model="dia" required class="select select-bordered w-full">
          <option value="" disabled selected>Selecciona un día</option>
          <option value="lunes">Lunes</option>
          <option value="martes">Martes</option>
          <option value="miércoles">Miércoles</option>
          <option value="jueves">Jueves</option>
          <option value="viernes">Viernes</option>
          <option value="sábado">Sábado</option>
          <option value="domingo">Domingo</option>
        </select>
      </div>

      <!-- Horas de Inicio y Fin -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Hora de Inicio:</label>
        <input type="time" v-model="horaInicio" required class="input input-bordered w-full" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Hora de Fin:</label>
        <input type="time" v-model="horaFin" required class="input input-bordered w-full" />
      </div>

      <!-- Seleccionar Materia -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Asignatura:</label>
        <select v-model="asignatura" required class="select select-bordered w-full">
          <option value="" disabled selected>Selecciona una asignatura</option>
          <option v-for="materia in materias" :key="materia.id" :value="materia.nombre">
            {{ materia.nombre }}
          </option>
        </select>
      </div>

      <!-- Seleccionar Docente -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Docente:</label>
        <select v-model="docente" required class="select select-bordered w-full">
          <option value="" disabled selected>Selecciona un docente</option>
          <option v-for="docente in docentes" :key="docente.id" :value="docente.nombre">
            {{ docente.nombre }}
          </option>
        </select>
      </div>

      <!-- Seleccionar Salón -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Salón:</label>
        <select v-model="salon" required class="select select-bordered w-full">
          <option value="" disabled selected>Selecciona un salón</option>
          <option v-for="salon in salones" :key="salon.id" :value="salon.nombre">
            {{ salon.nombre }}
          </option>
        </select>
      </div>

      <!-- Seleccionar Carrera -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Carrera:</label>
        <select v-model="categoria" required class="select select-bordered w-full">
          <option value="" disabled selected>Selecciona una carrera</option>
          <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
            {{ categoria.nombre }}
          </option>
        </select>
      </div>

      <button type="submit" class="w-full mt-4 px-4 py-2 text-white bg-green-500 hover:bg-green-400 rounded">
        Guardar
      </button>
    </form>
  </div>
</template>
<script>
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '@/stores/firebase';

export default {
  data() {
    return {
      dia: '',
      horaInicio: '',
      horaFin: '',
      asignatura: '',
      docente: '',
      salon: '',
      categoria: '',
      categorias: [],
      materias: [],
      docentes: [],
      salones: [] // Salones cargados desde Firestore
    };
  },
  async created() {
    await this.loadCategorias();
    await this.loadMaterias();
    await this.loadDocentes();
    await this.loadSalones();
  },
  methods: {
    async loadCategorias() {
      try {
        const snapshot = await getDocs(collection(db, 'categorias'));
        this.categorias = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    },
    async loadMaterias() {
      try {
        const snapshot = await getDocs(collection(db, 'materias'));
        this.materias = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error al cargar materias:', error);
      }
    },
    async loadDocentes() {
      try {
        const snapshot = await getDocs(collection(db, 'docentes'));
        this.docentes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error al cargar docentes:', error);
      }
    },
    async loadSalones() {
      try {
        const snapshot = await getDocs(collection(db, 'salones'));
        this.salones = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error al cargar salones:', error);
      }
    },
    async saveSchedule() {
      try {
        const categoriaRef = doc(db, 'categorias', this.categoria);
        const horariosCollection = collection(categoriaRef, 'horarios');

        await addDoc(horariosCollection, {
          dia: this.dia,
          horaInicio: this.horaInicio,
          horaFin: this.horaFin,
          asignatura: this.asignatura,
          docente: this.docente,
          salon: this.salon
        });
        console.log('Horario guardado con éxito');
        this.$router.push({ path: '/days', query: { category: this.categoria } });
      } catch (error) {
        console.error('Error al guardar el horario:', error);
      }
    }
  }
};
</script>
