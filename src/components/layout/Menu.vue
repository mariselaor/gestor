<template>
  <div class="navbar bg-base-100">
  <div class="navbar-start">
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </div>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>
        <router-link to="/">Inicio</router-link>
      </li>
        <li>
        <router-link to="/add">Agregar Horario</router-link>
      </li>
        <li>
          <router-link to="/logout">Cerrar sesión</router-link>
        </li>
      </ul>
    </div>
  </div>
  <div class="navbar-center">
    <a>APP HORARIOS</a>
  </div>
</div>
</template>


<style scoped>
nav {
  background-color: #2d3748; /* Cambia el color de fondo según tus preferencias */
}
ul {
  list-style-type: none;
}
li {
  display: inline; /* Muestra los elementos en línea */
}
</style>
