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
      <option
        v-for="animation in animationOptions"
        :key="animation.value"
        :value="animation.value"
      >
        {{ animation.label }}
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
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'reset', 'change'])

// 动画选项数组 - 使用 v-for 渲染
const animationOptions = ref([
  { value: 'epic-dive', label: '史诗俯冲' },
  { value: 'space-warp', label: '空间扭曲' },
  { value: 'matrix-hack', label: '黑客帝国' },
  { value: 'quantum-shift', label: '量子跃迁' },
  { value: 'time-dilation', label: '时间膨胀' },
  { value: 'dimensional-portal', label: '维度传送' },
  { value: 'cosmic-explosion', label: '宇宙爆炸' },
  { value: 'gentle-intro', label: '温和进入' },
  { value: 'dramatic-reveal', label: '戏剧性揭示' },
  { value: 'cinematic-pan', label: '电影级平移' }
])

const handleChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
}

const resetAnimation = () => {
  emit('reset')
}
</script>

<style scoped lang="scss">
.animation-selector {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;

  label {
    font-weight: 500;
    margin-bottom: 5px;
    font-size: 14px;
  }

  select {
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
    }

    &:focus {
      outline: 2px solid rgba(255, 255, 255, 0.6);
      outline-offset: 2px;
    }

    option {
      background: #333;
      color: white;
    }
  }

  button {
    padding: 8px 16px;
    background: linear-gradient(45deg, #ff6b6b, #ff8e53);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  // 移动端优化
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    padding: 12px 16px;

    label {
      font-size: 13px;
    }

    select,
    button {
      font-size: 13px;
      padding: 6px 12px;
    }
  }
}
</style>