<template>
  <div
    v-if="!isLoading && !animationComplete"
    class="cinematic-intro"
    :data-animation-type="animationType"
  >
    <div class="fade-out" />
    <div class="title-card">
      <div class="particles-container">
        <div
          v-for="i in 50"
          :key="i"
          class="particle"
          :style="getParticleStyle(i)"
        />
      </div>
      <h1>ZOOOW</h1>
      <p>IMMERSIVE EXPERIENCE</p>
      <div class="scanlines" />
      <div class="lens-flare" />
    </div>

    <!-- 添加动态效果层，特别是为史诗俯冲 -->
    <div
      v-if="animationType === 'epic-dive'"
      class="dynamic-effects"
    >
      <div class="speed-lines" />
      <div class="vignette" />
      <div class="motion-blur" />
    </div>
  </div>

  <!-- 动画选择器（开发时可见，生产环境可隐藏） -->
  <div
    v-if="!isLoading"
    class="animation-selector"
  >
    <span>动画类型:</span>
    <select
      v-model="animationType"
      @change="handleResetAnimation"
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
    <button @click="handleResetAnimation">
      重新播放
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  },
  animationComplete: {
    type: Boolean,
    default: false
  },
  cinematicAnimations: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['reset-animation'])

// 内部状态
const animationType = ref('epic-dive')

// 获取粒子样式
const getParticleStyle = (index) => {
  const size = Math.random() * 3 + 1
  const x = (Math.random() - 0.5) * 500
  const y = (Math.random() - 0.5) * 300
  const delay = Math.random() * 5
  const duration = Math.random() * 10 + 5

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

// 处理重置动画
const handleResetAnimation = () => {
  emit('reset-animation')
}

// 暴露给父组件的方法和状态
defineExpose({
  animationType
})
</script>

<style scoped lang="scss">
/* 这里放置电影级动画的所有CSS样式 */
</style>
