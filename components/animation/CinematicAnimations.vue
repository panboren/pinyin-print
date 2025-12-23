<template>
  <div
    v-if="!isLoading && !animationComplete"
    class="cinematic-intro"
    :class="`cinematic-intro--${animationType}`"
    aria-hidden="true"
  >
    <div class="cinematic-intro__fade-out" />
    <div class="cinematic-intro__title-card">
      <div
        class="cinematic-intro__particles-container"
        aria-hidden="true"
      >
        <div
          v-for="i in particleCount"
          :key="i"
          class="cinematic-intro__particle"
          :style="getParticleStyle(i)"
          :aria-hidden="true"
        />
      </div>
      <h1 class="cinematic-intro__title">
        ZOOOW
      </h1>
      <p class="cinematic-intro__subtitle">
        IMMERSIVE EXPERIENCE
      </p>
      <div
        class="cinematic-intro__scanlines"
        aria-hidden="true"
      />
      <div
        class="cinematic-intro__lens-flare"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  isLoading: Boolean,
  scene: Object,
  camera: Object,
  renderer: Object,
  controls: Object
})

const emit = defineEmits(['animation-complete'])

const animationType = ref('epic-dive')
const animationComplete = ref(false)
const particleCount = ref(50)

const getParticleStyle = (index) => {
  const angle = (index / particleCount.value) * Math.PI * 2
  const radius = 200 + Math.random() * 100
  const size = 2 + Math.random() * 4
  
  return {
    left: '50%',
    top: '50%',
    width: `${size}px`,
    height: `${size}px`,
    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`,
    animationDelay: `${Math.random() * 2}s`
  }
}

const animateToDefaultView = () => {
  if (!props.camera || !props.controls) return
  
  gsap.to(props.camera.position, {
    x: 0,
    y: 0,
    z: 500,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (props.controls) {
        props.controls.update()
      }
    },
    onComplete: () => {
      animationComplete.value = true
      emit('animation-complete')
    }
  })
}

const resetAnimation = () => {
  animationComplete.value = false
  animateToDefaultView()
}

// 监听外部 animationType 变化
watch(() => props.animationType, (newType) => {
  if (newType) {
    animationType.value = newType
  }
})

onMounted(() => {
  if (!props.isLoading) {
    animateToDefaultView()
  }
})

defineExpose({
  animateToDefaultView,
  resetAnimation,
  animationType
})
</script>

<style scoped lang="scss">
.cinematic-intro {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &__fade-out {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #000000, #1a1a2e, #000000);
    animation: fadeInOut 3s ease-in-out forwards;
  }

  &__title-card {
    position: relative;
    text-align: center;
    z-index: 10;
    animation: titleCardAnimation 3s ease-in-out forwards;
  }

  &__particles-container {
    position: absolute;
    width: 600px;
    height: 600px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__particle {
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: particleFloat 3s ease-in-out infinite;
  }

  &__title {
    font-size: 8rem;
    font-weight: 900;
    color: #ffffff;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
    margin: 0;
    letter-spacing: 0.2em;
    animation: titleGlow 2s ease-in-out infinite alternate;
  }

  &__subtitle {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 0.3em;
    margin: 1rem 0 0 0;
    text-transform: uppercase;
  }

  &__scanlines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.03) 2px,
      rgba(255, 255, 255, 0.03) 4px
    );
    animation: scanlines 8s linear infinite;
  }

  &__lens-flare {
    position: absolute;
    top: 20%;
    right: 20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
    animation: lensFlare 3s ease-in-out infinite alternate;
  }
}

@keyframes fadeInOut {
  0% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes titleCardAnimation {
  0% { 
    transform: scale(0.5) rotate(-10deg);
    opacity: 0;
  }
  50% { 
    transform: scale(1.1) rotate(5deg);
    opacity: 1;
  }
  100% { 
    transform: scale(1) rotate(0deg);
    opacity: 0;
  }
}

@keyframes particleFloat {
  0%, 100% { 
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  50% { 
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

@keyframes titleGlow {
  from { text-shadow: 0 0 30px rgba(255, 255, 255, 0.8); }
  to { text-shadow: 0 0 50px rgba(255, 255, 255, 1), 0 0 100px rgba(255, 255, 255, 0.5); }
}

@keyframes scanlines {
  0% { transform: translateY(0); }
  100% { transform: translateY(10px); }
}

@keyframes lensFlare {
  from { opacity: 0.3; transform: scale(1); }
  to { opacity: 0.6; transform: scale(1.2); }
}
</style>