<template>
  <router-view/>
</template>

<script>
import { onAuthStateChanged } from '@firebase/auth'
import { auth } from './main'
import { router } from './router'


export default {
  name: 'App',
  mounted() {
    onAuthStateChanged(auth, user => {
      if (user) {
        router.push('/')
      } else {
        router.push('/sign-in')
      }
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}
@media screen and (min-width: 820px) {
  #app {
    width: 80%;
  }
}
@media screen and (min-width: 1200px) {
  #app {
    width: 60%;
  }
}
body {
  height: 100%;
}
html {
  height: 100%;
}
</style>
