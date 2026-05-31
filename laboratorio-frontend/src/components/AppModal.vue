<template>
  <div class="overlay" @click.self="$emit('cerrar')">
    <div class="modal">
      <h2>{{ titulo }}</h2>
      <slot />
      <p v-if="error" class="error">{{ error }}</p>
      <div class="modal-actions">
        <button class="btn-secondary" @click="$emit('cerrar')">Cancelar</button>
        <button class="btn-primary" @click="$emit('guardar')">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppModal',
  props: {
    titulo: String,
    error:  String,
  },
  emits: ['cerrar', 'guardar']
}
</script>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: white; border-radius: 12px; padding: 2rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
.modal h2 { margin-bottom: 1.5rem; color: #1a1a2e; }
.modal-actions { display: flex; gap: 0.8rem; justify-content: flex-end; margin-top: 1.5rem; }
.btn-primary { background: #4f46e5; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
.btn-primary:hover { background: #4338ca; }
.btn-secondary { background: #f0f0f0; color: #333; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; }
.error { color: #ef4444; font-size: 0.85rem; margin-top: 0.5rem; }
</style>