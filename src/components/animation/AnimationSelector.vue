<!-- src/components/AnimationSelector.vue -->
<template>
  <div
    class="animation-selector"
    role="region"
    aria-label="动画控制"
  >
    <label for="animation-type">动画类型:</label>
    <select
      id="animation-type"
      :value="modelValue"
      aria-label="选择开场动画类型"
      @change="handleChange"
    >
      <option value="epic-dive">
        史诗俯冲
      </option>
      <option value="space-warp">
        空间扭曲
      </option>
      <option value="matrix-hack">
        黑客帝国
      </option>
      <option value="quantum-shift">
        量子跃迁
      </option>
    </select>
    <button
      aria-label="重新播放动画"
      @click="resetAnimation"
    >
      重新播放
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'reset', 'change'])

const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
  emit('change', event.target.value)
}

const resetAnimation = () => {
  emit('reset')
}
</script>

<style scoped lang="scss">
.animation-selector {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;

  label {
    font-weight: 500;
    white-space: nowrap;
  }

  select, button {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    &:focus {
      outline: 2px solid rgba(100, 200, 255, 0.5);
      outline-offset: 1px;
    }
  }

  select {
    min-width: 120px;
  }
}
</style>
