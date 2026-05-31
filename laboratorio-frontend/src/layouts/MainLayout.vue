<template>
  <div class="layout">
    <AppSidebar />
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script>
import AppSidebar from '../components/AppSidebar.vue'

export default {
  name: 'MainLayout',
  components: { AppSidebar }
}
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; }
.main { flex: 1; padding: 2rem; background: #f0f2f5; }
</style>