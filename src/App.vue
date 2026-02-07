<script setup>
import { ref, onMounted } from 'vue'

const autoUpdate = ref(false)

onMounted(async () => {
  if (window.prefs) {
    autoUpdate.value = await window.prefs.get('autoUpdate')

    window.prefs.onChanged(({ key, value }) => {
      if (key === 'autoUpdate') autoUpdate.value = value
    })
  }
})

async function toggleAutoUpdate() {
  autoUpdate.value = !autoUpdate.value
  autoUpdate.value = await window.prefs.set('autoUpdate', autoUpdate.value)
}
</script>

<template>
  <div class="auto-update-toggle">
    <span class="label-text">自动更新</span>
    <button type="button" 
      :class="['switch', { on: autoUpdate }]"
      @click="toggleAutoUpdate"
      >
      <span class="knob"></span>
    </button>
  </div>
</template>

<style scoped>
.auto-update-toggle {
  display: inline-flex;
  align-items: center;  /* 中线对齐 */
  gap: 4px;
}

.switch {
  width: 40px;
  height: 20px;
  background: #ccc;
  border-radius: 999px;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  border: none;
  transition: background .18s ease;
}

.switch.on {
  background: #4ade80;
}

.switch .knob {
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  transition: transform .18s ease;
  transform: translateX(0);
}

.switch.on .knob {
  transform: translateX(20px);
}

.label-text {
  font-size: 14px;
}
</style>
