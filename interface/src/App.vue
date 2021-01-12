<template>
  <v-app id="app">
    <Login/>
    <router-view/>
  </v-app>
</template>

<script>

import Login from '@/views/Login.vue'

export default {
  components: {
  Login
  },  
}
</script>
