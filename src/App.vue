<template>
  <div id="app">
    <!-- El menú solo se muestra si la ruta no tiene hideMenu en su meta -->
    <Menu v-if="!$route.meta.hideMenu" />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Menu from './components/layout/Menu.vue';

export default {
  components: {
    Menu,
  },
};
</script>

<style src="./assets/main.css"></style>
