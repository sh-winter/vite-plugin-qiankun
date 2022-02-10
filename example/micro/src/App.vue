<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import imgURL from './assets/logo1.png';
</script>

<template>
  <p :style="{ textAlign: 'center' }">qiankun-micro-app</p>
  <div style="display: flex; justify-content: center">
    <figure>
      <img alt="Vue logo" class="logo" srcset="./assets/logo.png" width="125" height="125" />
      <figcaption>直接导入</figcaption>
    </figure>
    <figure>
      <img alt="Vue logo" class="logo" srcset="./assets/logo.png 600w, /src/assets/logo1.png 500w" width="125" height="125" />
      <figcaption>srcset</figcaption>
    </figure>
    <figure>
      <img alt="Vue logo" class="logo" :src="imgURL" width="125" height="125" />
      <figcaption>动态导入</figcaption>
    </figure>
  </div> 
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style>

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>