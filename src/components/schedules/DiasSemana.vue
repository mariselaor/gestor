<template>
  <div class="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md dark:text-white">
    <router-link to="/" class="link link-info text-blue-500 hover:text-blue-700 mb-4 inline-block">
      Volver a la página principal
    </router-link>
    <h2 class="text-2xl font-semibold text-center mb-6">Seleccionar Día</h2>
    <ul class="space-y-2">
      <li
        v-for="dia in dias"
        :key="dia"
        @click="selectDia(dia)"
        class="cursor-pointer p-4 rounded-lg bg-gray-100 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-800 transition-all duration-300 hover:text-blue-700 flex justify-between items-center"
      >
        <span>{{ dia }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    }
  },
  methods: {
    selectDia(dia) {
      const diaSlug = dia.replace(/\s+/g, '-').toLowerCase();
      const categoria = this.$route.query.category;
      this.$router.push({ path: `/schedule/${diaSlug}`, query: { category: categoria } });
    }
  }
}
</script>

<style scoped>
</style>
