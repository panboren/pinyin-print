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

    <!-- 原有的史诗俯冲效果 -->
    <div
        v-if="animationType === 'epic-dive'"
        class="cinematic-intro__dynamic-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__speed-lines" />
      <div class="cinematic-intro__vignette" />
      <div class="cinematic-intro__motion-blur" />
    </div>

    <!-- 新增：维度折叠效果 -->
    <div
        v-if="animationType === 'dimension-fold'"
        class="cinematic-intro__dimension-fold-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__fold-lines" />
      <div class="cinematic-intro__dimension-shift" />
      <div class="cinematic-intro__reality-glitch" />
    </div>

    <!-- 新增：能量波效果 -->
    <div
        v-if="animationType === 'energy-wave'"
        class="cinematic-intro__energy-wave-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__energy-ring" />
      <div class="cinematic-intro__shockwave" />
      <div class="cinematic-intro__energy-particles" />
    </div>

    <!-- 新增：眩晕相机效果 -->
    <div
        v-if="animationType === 'dizzy-cam'"
        class="cinematic-intro__dizzy-cam-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__spinning-overlay" />
      <div class="cinematic-intro__color-shift" />
      <div class="cinematic-intro__motion-trail" />
    </div>

    <!-- 新增：超空间跳跃效果 -->
    <div
        v-if="animationType === 'hyperspace'"
        class="cinematic-intro__hyperspace-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__star-stretch" />
      <div class="cinematic-intro__tunnel-vision" />
      <div class="cinematic-intro__light-burst" />
    </div>


    <!-- 新增：时空裂缝效果 -->
    <div
        v-if="animationType === 'time-rift'"
        class="cinematic-intro__time-rift-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__rift-cracks" />
      <div class="cinematic-intro__time-fragments" />
      <div class="cinematic-intro__reality-reassemble" />
    </div>

    <!-- 新增：星球爆炸效果 -->
    <div
        v-if="animationType === 'planet-explosion'"
        class="cinematic-intro__planet-explosion-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__explosion-core" />
      <div class="cinematic-intro__debris-field" />
      <div class="cinematic-intro__shockwave-sphere" />
    </div>

    <!-- 新增：量子纠缠效果 -->
    <div
        v-if="animationType === 'quantum-entanglement'"
        class="cinematic-intro__quantum-entanglement-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__parallel-worlds" />
      <div class="cinematic-intro__quantum-bridge" />
      <div class="cinematic-intro__reality-merge" />
    </div>

    <!-- 新增：虚拟现实效果 -->
    <div
        v-if="animationType === 'virtual-reality'"
        class="cinematic-intro__virtual-reality-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__pixelation" />
      <div class="cinematic-intro__digital-noise" />
      <div class="cinematic-intro__reality-materialize" />
    </div>




    <!-- 新增：场景漫游效果 -->
    <div
        v-if="animationType === 'scene-roaming'"
        class="cinematic-intro__scene-roaming-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__viewfinder" />
      <div class="cinematic-intro__path-indicator" />
      <div class="cinematic-intro__scene-transition" />
    </div>

    <!-- 新增：轨道环绕效果 -->
    <div
        v-if="animationType === 'orbital-rotation'"
        class="cinematic-intro__orbital-rotation-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__orbit-path" />
      <div class="cinematic-intro__gravity-well" />
      <div class="cinematic-intro__ascending-spiral" />
    </div>

    <!-- 新增：维度传送门效果 -->
    <div
        v-if="animationType === 'dimensional-portal'"
        class="cinematic-intro__dimensional-portal-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__portal-ring" />
      <div class="cinematic-intro__dimension-shift" />
      <div class="cinematic-intro__portal-particles" />
    </div>

    <!-- 新增：时空穿梭效果 -->
    <div
        v-if="animationType === 'time-travel'"
        class="cinematic-intro__time-travel-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__time-ripples" />
      <div class="cinematic-intro__past-future-shift" />
      <div class="cinematic-intro__temporal-distortion" />
    </div>


    <!-- 新增：黑洞吞噬效果 -->
    <div
        v-if="animationType === 'black-hole'"
        class="cinematic-intro__black-hole-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__event-horizon" />
      <div class="cinematic-intro__accretion-disk" />
      <div class="cinematic-intro__gravitational-lensing" />
    </div>

    <!-- 新增：宇宙大爆炸效果 -->
    <div
        v-if="animationType === 'cosmic-big-bang'"
        class="cinematic-intro__cosmic-big-bang-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__singularity" />
      <div class="cinematic-intro__explosion-wave" />
      <div class="cinematic-intro__universe-formation" />
    </div>

    <!-- 新增：维度崩溃效果 -->
    <div
        v-if="animationType === 'dimension-collapse'"
        class="cinematic-intro__dimension-collapse-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__reality-fracture" />
      <div class="cinematic-intro__dimensional-shards" />
      <div class="cinematic-intro__chaos-vortex" />
    </div>

    <!-- 新增：时空逆流效果 -->
    <div
        v-if="animationType === 'time-rewind'"
        class="cinematic-intro__time-rewind-effects"
        aria-hidden="true"
    >
      <div class="cinematic-intro__reverse-flow" />
      <div class="cinematic-intro__temporal-fragments" />
      <div class="cinematic-intro__causality-loop" />
    </div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'

/**
 * 动画配置常量 - 移到模块顶层，以便在defineProps中使用
 */



const ANIMATION_CONFIG = {
  EPIC_DIVE: 'epic-dive',
  SPACE_WARP: 'space-warp',
  MATRIX_HACK: 'matrix-hack',
  QUANTUM_SHIFT: 'quantum-shift',
  // 之前新增的动画类型
  DIMENSION_FOLD: 'dimension-fold',
  ENERGY_WAVE: 'energy-wave',
  DIZZY_CAM: 'dizzy-cam',
  HYPERSPACE: 'hyperspace',
  // 最新新增的动画类型
  TIME_RIFT: 'time-rift',
  PLANET_EXPLOSION: 'planet-explosion',
  QUANTUM_ENTANGLEMENT: 'quantum-entanglement',
  VIRTUAL_REALITY: 'virtual-reality',
  // 游走和环游类型
  SCENE_ROAMING: 'scene-roaming',
  ORBITAL_ROTATION: 'orbital-rotation',
  DIMENSIONAL_PORTAL: 'dimensional-portal',
  TIME_TRAVEL: 'time-travel',
  // 新增的炸裂动画类型
  BLACK_HOLE: 'black-hole',
  COSMIC_BIG_BANG: 'cosmic-big-bang',
  DIMENSION_COLLAPSE: 'dimension-collapse',
  TIME_REWIND: 'time-rewind',
  DEFAULT_DURATION: 7000,
  PARTICLE_COUNT: 50,
  START_FOV: 170,
  FINAL_FOV: 75,
  FINAL_POSITION: { x: 0.01, y: 0.01, z: 0.01 },
  FINAL_THETA: Math.PI / 2.5,
  FINAL_PHI: Math.PI / 1.9
}




/**
 * 错误信息常量
 */
const ERROR_MESSAGES = {
  NO_CAMERA: 'Camera not available for animation',
  NO_CONTROLS: 'Controls not available for animation',
  ANIMATION_FAILED: 'Animation failed',
  RENDER_FAILED: 'Render failed during animation'
}

/**
 * 获取动画类型列表用于验证
 */

const getAnimationTypes = () => [
  ANIMATION_CONFIG.EPIC_DIVE,
  ANIMATION_CONFIG.SPACE_WARP,
  ANIMATION_CONFIG.MATRIX_HACK,
  ANIMATION_CONFIG.QUANTUM_SHIFT,
  // 之前新增的动画类型
  ANIMATION_CONFIG.DIMENSION_FOLD,
  ANIMATION_CONFIG.ENERGY_WAVE,
  ANIMATION_CONFIG.DIZZY_CAM,
  ANIMATION_CONFIG.HYPERSPACE,
  // 最新新增的动画类型
  ANIMATION_CONFIG.TIME_RIFT,
  ANIMATION_CONFIG.PLANET_EXPLOSION,
  ANIMATION_CONFIG.QUANTUM_ENTANGLEMENT,
  ANIMATION_CONFIG.VIRTUAL_REALITY,
  // 游走和环游类型
  ANIMATION_CONFIG.SCENE_ROAMING,
  ANIMATION_CONFIG.ORBITAL_ROTATION,
  ANIMATION_CONFIG.DIMENSIONAL_PORTAL,
  ANIMATION_CONFIG.TIME_TRAVEL,
  // 新增的炸裂动画类型
  ANIMATION_CONFIG.BLACK_HOLE,
  ANIMATION_CONFIG.COSMIC_BIG_BANG,
  ANIMATION_CONFIG.DIMENSION_COLLAPSE,
  ANIMATION_CONFIG.TIME_REWIND
]



/**
 * Props定义
 */
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  },
  scene: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.isScene === 'function'
  },
  camera: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.isCamera === 'function'
  },
  renderer: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.isWebGLRenderer === 'function'
  },
  controls: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.update === 'function'
  },
  animationType: {
    type: String,
    default: 'epic-dive' // ANIMATION_CONFIG.EPIC_DIVE
  }
})

/**
 * Emits定义
 */
const emit = defineEmits({
  'animation-complete': (payload) => payload !== undefined,
  'animation-error': (error) => error instanceof Error
})

/**
 * 响应式状态
 */
const animationComplete = ref(false)
const particleCount = ref(ANIMATION_CONFIG.PARTICLE_COUNT)
const animationType = ref(props.animationType)

// 使用shallowRef来避免Vue的深度响应式处理Three.js对象
const timeline = shallowRef(null)
const cameraRotation = shallowRef({ x: 0, y: 0, z: 0 })

/**
 * 组件生命周期
 */
onMounted(() => {
  // 组件挂载后，如果已加载且动画未完成，则开始动画
  if (!props.isLoading && !animationComplete.value) {
    startAnimation()
  }
})

onUnmounted(() => {
  // 组件卸载时清理资源
  cleanup()
})

/**
 * 清理资源
 */
const cleanup = () => {
  if (timeline.value) {
    timeline.value.kill()
    timeline.value = null
  }
  // 重新启用控制器
  if (props.controls) {
    props.controls.enabled = true
  }
}

/**
 * 获取粒子样式
 */
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

/**
 * 渲染场景
 */
const renderScene = () => {
  try {
    if (props.renderer && props.scene && props.camera) {
      props.renderer.render(props.scene, props.camera)
      return true
    }
    return false
  } catch (error) {
    console.error(ERROR_MESSAGES.RENDER_FAILED, error)
    return false
  }
}

/**
 * 设置初始相机状态
 */
const setupInitialCameraState = (startPosition, fov = ANIMATION_CONFIG.START_FOV) => {
  if (!props.camera) {
    throw new Error(ERROR_MESSAGES.NO_CAMERA)
  }

  // 设置起始位置
  props.camera.position.copy(startPosition)

  // 设置FOV
  props.camera.fov = fov
  props.camera.updateProjectionMatrix()

  // 渲染初始状态
  renderScene()
}

/**
 * 设置最终相机状态
 */
const setupFinalCameraState = () => {
  // 使用球坐标系统定位最终位置
  const spherical = new THREE.Spherical()
  spherical.radius = 0.01
  spherical.theta = ANIMATION_CONFIG.FINAL_THETA
  spherical.phi = ANIMATION_CONFIG.FINAL_PHI

  props.camera.position.setFromSpherical(spherical)
  props.camera.lookAt(props.controls?.target || new THREE.Vector3(0, 0, 0))

  // 设置最终FOV
  props.camera.fov = ANIMATION_CONFIG.FINAL_FOV
  props.camera.updateProjectionMatrix()
}

/**
 * 动画完成回调
 */
const onAnimationComplete = () => {
  console.log(`${animationType.value} 动画完成`)
  animationComplete.value = true

  // 重新启用控制器
  if (props.controls) {
    props.controls.enabled = true
    props.controls.update()
  }

  // 触发完成事件
  emit('animation-complete', { type: animationType.value })
}

/**
 * 动画错误回调
 */
const onAnimationError = (error, animationName) => {
  console.error(`${animationName} 动画失败:`, error)

  // 确保控制器启用
  if (props.controls) {
    props.controls.enabled = true
  }

  // 标记动画完成，即使出错也要继续
  animationComplete.value = true

  // 触发错误事件
  emit('animation-error', error)
}

/**
 * 创建动画时间轴
 */
const createTimeline = (onComplete, onError, animationName) => {
  // 清理之前的timeline
  if (timeline.value) {
    timeline.value.kill()
  }

  // 创建新的timeline
  const tl = gsap.timeline({
    onComplete,
    // 添加错误处理回调
    callbackScope: { animationName },
    onUpdate: function() {
      try {
        // 更新控制器
        if (props.controls) {
          props.controls.update()
        }
      } catch (error) {
        console.error('控制器更新错误:', error)
      }
    }
  })

  timeline.value = tl
  return tl
}

/**
 * 安全执行相机变换
 */
const safeCameraTransform = (transformFn, errorContext) => {
  try {
    return transformFn()
  } catch (error) {
    console.error(`${errorContext}:`, error)
    return null
  }
}

// 原有的动画函数保持不变，这里省略以节省篇幅...

/**
 * 新增：维度折叠动画
 */
const animateDimensionFold = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(1500, 1000, 1500))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 重置旋转对象
    cameraRotation.value = { x: 0, y: 0, z: 0 }

    // 创建辅助变量用于维度折叠效果
    const foldIntensity = { value: 0 }
    const realityShift = { value: 0 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '维度折叠'),
        '维度折叠'
    )

    // 动画阶段1: 平稳接近
    tl.to(props.camera.position, {
      x: 800,
      y: 500,
      z: 800,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 开始维度折叠
    tl.to(foldIntensity, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 1.5)

    tl.to(props.camera.position, {
      x: 300,
      y: 200,
      z: 300,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const foldAmount = foldIntensity.value

            // 模拟维度折叠效果 - 随机位移
            const glitchX = Math.sin(time * 20) * 10 * foldAmount
            const glitchY = Math.cos(time * 15) * 8 * foldAmount
            const glitchZ = Math.sin(time * 10) * 5 * foldAmount

            props.camera.position.x += glitchX
            props.camera.position.y += glitchY
            props.camera.position.z += glitchZ

            // 相机倾斜
            cameraRotation.value.x = Math.sin(time * 3) * 0.2 * foldAmount
            cameraRotation.value.y = Math.cos(time * 2) * 0.2 * foldAmount
            cameraRotation.value.z = Math.sin(time * 5) * 0.1 * foldAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '维度折叠效果更新错误'
      )
    }, 1.5)

    // 动画阶段3: 现实转换
    tl.to(realityShift, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.5)

    tl.to(props.camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV维度折叠错误'
      )
    }, 2.5)

    // 动画阶段4: 维度稳定
    tl.to(foldIntensity, {
      value: 0.3,
      duration: 1,
      ease: 'power2.out'
    }, 3)

    tl.to(realityShift, {
      value: 0.5,
      duration: 1,
      ease: 'power2.out'
    }, 3)

    tl.to(props.camera.position, {
      x: 50,
      y: 30,
      z: 50,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const foldAmount = foldIntensity.value
            const shiftAmount = realityShift.value

            // 减少的折叠效果
            const glitchX = Math.sin(time * 10) * 3 * foldAmount
            const glitchZ = Math.cos(time * 8) * 3 * foldAmount

            props.camera.position.x += glitchX
            props.camera.position.z += glitchZ

            // 稳定的相机倾斜
            cameraRotation.value.x = Math.sin(time * 1.5) * 0.1 * shiftAmount
            cameraRotation.value.z = Math.cos(time * 1.5) * 0.05 * shiftAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '维度稳定效果更新错误'
      )
    }, 3)

    // 动画阶段5: 最终接近
    tl.to(props.camera.position, {
      x: 10,
      y: 5,
      z: 10,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const foldAmount = foldIntensity.value

            // 微小的折叠效果
            const glitchX = Math.sin(tl.time() * 5) * 1 * foldAmount
            const glitchZ = Math.cos(tl.time() * 4) * 1 * foldAmount

            props.camera.position.x += glitchX
            props.camera.position.z += glitchZ

            props.camera.lookAt(props.controls.target)
          },
          '最终接近效果更新错误'
      )
    }, 4)

    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终接近错误'
      )
    }, 4.5)

    // 动画阶段6: 最终定位
    tl.to(foldIntensity, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(realityShift, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '最终定位错误'
      )
    }, 5)

    // 动画阶段7: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 5.5)

    // 动画阶段8: 视觉冲击效果 - 闪烁
    tl.to(props.renderer.domElement, {
      opacity: 0.7,
      duration: 0.1,
      ease: 'none'
    }, 2.5)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.1,
      ease: 'none'
    }, 2.6)

    tl.to(props.renderer.domElement, {
      opacity: 0.8,
      duration: 0.1,
      ease: 'none'
    }, 3.5)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.1,
      ease: 'none'
    }, 3.6)

  } catch (error) {
    onAnimationError(error, '维度折叠')
  }
}

/**
 * 新增：能量波动画
 */
const animateEnergyWave = () => {
  try {
    // 初始设置：从上方俯视
    setupInitialCameraState(new THREE.Vector3(0, 1500, 0))
    props.camera.lookAt(0, 0, 0)

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const waveIntensity = { value: 0 }
    const shockRadius = { value: 0 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '能量波'),
        '能量波'
    )

    // 动画阶段1: 能量聚集
    tl.to(props.camera.position, {
      y: 800,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 能量爆发
    tl.to(waveIntensity, {
      value: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 1.8)

    tl.to(props.camera.position, {
      y: 300,
      duration: 1,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const waveAmount = waveIntensity.value

            // 震动效果
            const shakeX = Math.sin(time * 30) * 5 * waveAmount
            const shakeZ = Math.cos(time * 30) * 5 * waveAmount

            props.camera.position.x = shakeX
            props.camera.position.z = shakeZ

            // 相机视角震动
            cameraRotation.value.x = Math.sin(time * 20) * 0.05 * waveAmount
            cameraRotation.value.z = Math.cos(time * 20) * 0.05 * waveAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                0,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '能量爆发效果更新错误'
      )
    }, 1.8)

    // 动画阶段3: 冲击波扩散
    tl.to(shockRadius, {
      value: 1000,
      duration: 2,
      ease: 'power2.out'
    }, 2.5)

    tl.to(props.camera, {
      fov: 110,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV冲击波错误'
      )
    }, 2.5)

    tl.to(props.camera.position, {
      y: 100,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const waveAmount = waveIntensity.value * 0.5
            const radius = shockRadius.value

            // 环绕效果
            const orbitX = Math.sin(time * 2) * 20 * waveAmount
            const orbitZ = Math.cos(time * 2) * 20 * waveAmount

            props.camera.position.x = orbitX
            props.camera.position.z = orbitZ

            // 相机轻微倾斜
            cameraRotation.value.x = Math.sin(time * 3) * 0.02 * waveAmount
            cameraRotation.value.z = Math.cos(time * 3) * 0.02 * waveAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                0,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '冲击波扩散效果更新错误'
      )
    }, 2.5)

    // 动画阶段4: 能量消散
    tl.to(waveIntensity, {
      value: 0.3,
      duration: 1,
      ease: 'power2.out'
    }, 4)

    tl.to(props.camera.position, {
      x: 30,
      y: 30,
      z: 30,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const waveAmount = waveIntensity.value

            // 微小震动
            const shakeX = Math.sin(time * 10) * 2 * waveAmount
            const shakeZ = Math.cos(time * 10) * 2 * waveAmount

            props.camera.position.x = 30 + shakeX
            props.camera.position.z = 30 + shakeZ

            // 相机轻微倾斜
            cameraRotation.value.x = Math.sin(time * 5) * 0.01 * waveAmount
            cameraRotation.value.z = Math.cos(time * 5) * 0.01 * waveAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                0,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '能量消散效果更新错误'
      )
    }, 4)

    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV能量消散错误'
      )
    }, 5)

    // 动画阶段5: 最终定位
    tl.to(waveIntensity, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5.5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '最终定位错误'
      )
    }, 5.5)

    // 动画阶段6: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 6)

    // 动画阶段7: 视觉冲击效果 - 闪烁
    tl.to(props.renderer.domElement, {
      opacity: 0.5,
      duration: 0.1,
      ease: 'none'
    }, 1.8)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 1.9)

    tl.to(props.renderer.domElement, {
      opacity: 0.7,
      duration: 0.1,
      ease: 'none'
    }, 2.5)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 2.6)

  } catch (error) {
    onAnimationError(error, '能量波')
  }
}

/**
 * 新增：眩晕相机动画
 */
const animateDizzyCam = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(1000, 500, 1000))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const spinIntensity = { value: 0 }
    const colorShift = { value: 0 }
    const motionBlur = { value: 0 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '眩晕相机'),
        '眩晕相机'
    )

    // 动画阶段1: 开始加速
    tl.to(props.camera.position, {
      x: 500,
      y: 300,
      z: 500,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 快速旋转
    tl.to(spinIntensity, {
      value: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 0.8)

    tl.to(props.camera.position, {
      x: 100,
      y: 50,
      z: 100,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const spinAmount = spinIntensity.value

            // 螺旋旋转
            const spiralRadius = props.camera.position.length()
            const spinAngle = time * 10 * spinAmount

            props.camera.position.x = Math.cos(spinAngle) * spiralRadius
            props.camera.position.z = Math.sin(spinAngle) * spiralRadius

            // 相机随机倾斜
            cameraRotation.value.x = Math.sin(time * 20) * 0.3 * spinAmount
            cameraRotation.value.y = Math.cos(time * 15) * 0.3 * spinAmount
            cameraRotation.value.z = Math.sin(time * 25) * 0.2 * spinAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '快速旋转效果更新错误'
      )
    }, 0.8)

    // 动画阶段3: 颜色变换
    tl.to(colorShift, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 1.5)

    tl.to(props.camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV颜色变换错误'
      )
    }, 1.5)

    // 动画阶段4: 运动模糊
    tl.to(motionBlur, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2)

    // 动画阶段5: 旋转减速
    tl.to(spinIntensity, {
      value: 0.2,
      duration: 1.5,
      ease: 'power2.out'
    }, 2.5)

    tl.to(colorShift, {
      value: 0.3,
      duration: 1,
      ease: 'power2.out'
    }, 2.5)

    tl.to(props.camera.position, {
      x: 20,
      y: 15,
      z: 20,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const spinAmount = spinIntensity.value
            const colorAmount = colorShift.value
            const blurAmount = motionBlur.value

            // 减缓的螺旋旋转
            const spiralRadius = props.camera.position.length()
            const spinAngle = time * 3 * spinAmount

            props.camera.position.x = Math.cos(spinAngle) * spiralRadius
            props.camera.position.z = Math.sin(spinAngle) * spiralRadius

            // 减少的相机倾斜
            cameraRotation.value.x = Math.sin(time * 5) * 0.1 * spinAmount
            cameraRotation.value.y = Math.cos(time * 4) * 0.1 * spinAmount
            cameraRotation.value.z = Math.sin(time * 6) * 0.05 * spinAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '旋转减速效果更新错误'
      )
    }, 2.5)

    tl.to(motionBlur, {
      value: 0.5,
      duration: 1,
      ease: 'power2.out'
    }, 3)

    // 动画阶段6: 最终稳定
    tl.to(spinIntensity, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 3.5)

    tl.to(colorShift, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 3.5)

    tl.to(motionBlur, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 3.5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.rotation.set(0, 0, 0)
            props.camera.lookAt(props.controls.target)
          },
          '最终稳定效果更新错误'
      )
    }, 3.5)

    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终稳定错误'
      )
    }, 3.5)

    // 动画阶段7: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 4)

  } catch (error) {
    onAnimationError(error, '眩晕相机')
  }
}

/**
 * 新增：超空间跳跃动画
 */
const animateHyperspace = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(2000, 1000, 2000))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const stretchIntensity = { value: 0 }
    const tunnelVision = { value: 0 }
    const lightBurst = { value: 0 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '超空间跳跃'),
        '超空间跳跃'
    )

    // 动画阶段1: 加速接近
    tl.to(props.camera.position, {
      x: 1000,
      y: 500,
      z: 1000,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 星星拉伸
    tl.to(stretchIntensity, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 0.8)

    tl.to(props.camera.position, {
      x: 300,
      y: 150,
      z: 300,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const stretchAmount = stretchIntensity.value

            // 星星拉伸效果 - 快速接近
            const stretchX = props.camera.position.x * (1 + stretchAmount)
            const stretchY = props.camera.position.y * (1 + stretchAmount * 0.5)
            const stretchZ = props.camera.position.z * (1 + stretchAmount)

            props.camera.position.x = stretchX
            props.camera.position.y = stretchY
            props.camera.position.z = stretchZ

            // 相机轻微抖动
            const shakeX = Math.sin(time * 30) * 0.05 * stretchAmount
            const shakeY = Math.cos(time * 25) * 0.05 * stretchAmount

            cameraRotation.value.x = shakeX
            cameraRotation.value.y = shakeY

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                0
            )

            props.camera.lookAt(props.controls.target)
          },
          '星星拉伸效果更新错误'
      )
    }, 0.8)

    // 动画阶段3: 隧道视野
    tl.to(tunnelVision, {
      value: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 2)

    tl.to(props.camera, {
      fov: 140,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV隧道视野错误'
      )
    }, 2)

    // 动画阶段4: 光线爆发
    tl.to(lightBurst, {
      value: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 2.5)

    tl.to(props.camera.position, {
      x: 50,
      y: 30,
      z: 50,
      duration: 0.5,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const stretchAmount = stretchIntensity.value
            const tunnelAmount = tunnelVision.value
            const lightAmount = lightBurst.value

            // 减少的拉伸效果
            const stretchX = props.camera.position.x * (1 + stretchAmount * tunnelAmount)
            const stretchZ = props.camera.position.z * (1 + stretchAmount * tunnelAmount)

            props.camera.position.x = stretchX
            props.camera.position.z = stretchZ

            // 相机抖动
            const shakeX = Math.sin(time * 40) * 0.1 * lightAmount
            const shakeY = Math.cos(time * 35) * 0.1 * lightAmount

            cameraRotation.value.x = shakeX
            cameraRotation.value.y = shakeY

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                0
            )

            props.camera.lookAt(props.controls.target)
          },
          '光线爆发效果更新错误'
      )
    }, 2.5)

    // 动画阶段5: 穿越完成
    tl.to(lightBurst, {
      value: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, 3)

    tl.to(tunnelVision, {
      value: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, 3)

    tl.to(stretchIntensity, {
      value: 0.2,
      duration: 0.5,
      ease: 'power2.out'
    }, 3)

    tl.to(props.camera.position, {
      x: 10,
      y: 5,
      z: 10,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const stretchAmount = stretchIntensity.value

            // 微小的拉伸效果
            const stretchX = props.camera.position.x * (1 + stretchAmount * 0.1)
            const stretchZ = props.camera.position.z * (1 + stretchAmount * 0.1)

            props.camera.position.x = stretchX
            props.camera.position.z = stretchZ

            // 微小的相机抖动
            const shakeX = Math.sin(time * 10) * 0.02 * stretchAmount
            const shakeY = Math.cos(time * 8) * 0.02 * stretchAmount

            cameraRotation.value.x = shakeX
            cameraRotation.value.y = shakeY

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                0
            )

            props.camera.lookAt(props.controls.target)
          },
          '穿越完成效果更新错误'
      )
    }, 3)

    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV穿越完成错误'
      )
    }, 4)

    // 动画阶段6: 最终定位
    tl.to(stretchIntensity, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 4.5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.rotation.set(0, 0, 0)
            props.camera.lookAt(props.controls.target)
          },
          '最终定位错误'
      )
    }, 4.5)

    // 动画阶段7: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 5)

    // 动画阶段8: 视觉冲击效果 - 光线爆发
    tl.to(props.renderer.domElement, {
      opacity: 0.9,
      duration: 0.2,
      ease: 'none'
    }, 2.5)

    tl.to(props.renderer.domElement, {
      opacity: 0.2,
      duration: 0.2,
      ease: 'none'
    }, 2.7)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 2.9)

  } catch (error) {
    onAnimationError(error, '超空间跳跃')
  }
}




/**
 * 史诗俯冲动画
 */
const animateEpicDive = () => {
  try {
    // 初始设置
    const startPos = new THREE.Vector3(2000, 2500, 2000)
    setupInitialCameraState(startPos)

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量用于螺旋效果
    const spiralIntensity = { value: 0 }

    // 创建timeline
    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '史诗俯冲'),
        '史诗俯冲'
    )

    // 动画阶段1: 空中悬浮观察
    tl.to(props.camera.position, {
      x: 1800,
      y: 2200,
      z: 1800,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.lookAt(props.controls.target)
          },
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 开始加速俯冲，轻微螺旋
    tl.to(spiralIntensity, {
      value: 1,
      duration: 0.5,
      ease: 'power1.inOut'
    }, 0.8)

    tl.to(props.camera.position, {
      x: 800,
      y: 1000,
      z: 800,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const spiralX = Math.sin(time * 2) * 30 * spiralIntensity.value
            const spiralZ = Math.cos(time * 2) * 30 * spiralIntensity.value
            props.camera.position.x += spiralX * 0.1
            props.camera.position.z += spiralZ * 0.1
            props.camera.lookAt(props.controls.target)
          },
          '螺旋效果更新错误'
      )
    }, 1)

    // 动画阶段3: 收缩FOV增强速度感
    tl.to(props.camera, {
      fov: 140,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          '相机FOV更新错误'
      )
    }, 1.5)

    // 动画阶段4: 高速俯冲，剧烈螺旋
    tl.to(spiralIntensity, {
      value: 3,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.5)

    tl.to(props.camera.position, {
      x: 200,
      y: 300,
      z: 200,
      duration: 1.5,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const spiralX = Math.sin(time * 3) * 50 * spiralIntensity.value
            const spiralZ = Math.cos(time * 3) * 50 * spiralIntensity.value
            props.camera.position.x += spiralX * 0.2
            props.camera.position.z += spiralZ * 0.2
            props.camera.lookAt(props.controls.target)
          },
          '螺旋效果增强错误'
      )
    }, 2.5)

    // 动画阶段5: 快速收缩FOV
    tl.to(props.camera, {
      fov: 100,
      duration: 1,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          '相机FOV快速更新错误'
      )
    }, 3)

    // 动画阶段6: 穿越云层，减速开始
    tl.to(spiralIntensity, {
      value: 1.5,
      duration: 1,
      ease: 'power2.out'
    }, 3.8)

    tl.to(props.camera.position, {
      x: 50,
      y: 80,
      z: 50,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const spiralX = Math.sin(time * 2) * 20 * spiralIntensity.value
            const spiralZ = Math.cos(time * 2) * 20 * spiralIntensity.value
            props.camera.position.x += spiralX * 0.15
            props.camera.position.z += spiralZ * 0.15
            props.camera.lookAt(props.controls.target)
          },
          '螺旋效果减弱错误'
      )
    }, 3.8)

    // 动画阶段7: 继续收缩FOV
    tl.to(props.camera, {
      fov: 85,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          '相机FOV持续更新错误'
      )
    }, 4)

    // 动画阶段8: 接近地面，稳定视角
    tl.to(spiralIntensity, {
      value: 0.3,
      duration: 1,
      ease: 'power2.out'
    }, 5)

    tl.to(props.camera.position, {
      x: 10,
      y: 15,
      z: 10,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const spiralX = Math.sin(time * 1.5) * 5 * spiralIntensity.value
            const spiralZ = Math.cos(time * 1.5) * 5 * spiralIntensity.value
            props.camera.position.x += spiralX * 0.1
            props.camera.position.z += spiralZ * 0.1
            props.camera.lookAt(props.controls.target)
          },
          '微弱螺旋效果错误'
      )
    }, 5)

    // 动画阶段9: 调整FOV到接近正常
    tl.to(props.camera, {
      fov: 78,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          '相机FOV调整错误'
      )
    }, 6)

    // 动画阶段10: 最终精准定位
    tl.to(spiralIntensity, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 6.3)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.8,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '最终定位错误'
      )
    }, 6.3)

    // 动画阶段11: 完全正常FOV
    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          '相机FOV最终更新错误'
      )
    }, 6.5)

    // 动画阶段12: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 6.8)

    // 动画阶段13: 视觉冲击效果 - 快速闪烁
    tl.to(props.renderer.domElement, {
      opacity: 0.8,
      duration: 0.05,
      ease: 'none'
    }, 6.3)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.05,
      ease: 'none'
    }, 6.35)

  } catch (error) {
    onAnimationError(error, '史诗俯冲')
  }
}

/**
 * 空间扭曲动画
 */
const animateSpaceWarp = () => {
  try {
    // 初始设置：从黑洞中心观察
    setupInitialCameraState(new THREE.Vector3(0, 0, 1000))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 重置旋转对象
    cameraRotation.value = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '空间扭曲'),
        '空间扭曲'
    )

    // 动画阶段1: 剧烈扭曲，快速拉近
    tl.to(props.camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const warpAmount = 1 - (props.camera.position.z / 1000)

            cameraRotation.value.z = Math.sin(time * 5) * warpAmount * 0.1
            props.camera.rotation.z = cameraRotation.value.z

            props.camera.lookAt(props.controls.target)
          },
          '空间扭曲更新错误'
      )
    })

    // 动画阶段2: FOV快速收缩，模拟时空压缩
    tl.to(props.camera, {
      fov: 120,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV时空压缩错误'
      )
    }, 1.5)

    tl.to(props.camera.position, {
      x: 10,
      y: 5,
      z: 10,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const warpAmount = props.camera.position.z / 100
            cameraRotation.value.z = Math.sin(time * 3) * warpAmount * 0.05
            props.camera.rotation.z = cameraRotation.value.z

            props.camera.lookAt(props.controls.target)
          },
          '扭曲效果减弱错误'
      )
    }, 1.5)

    // 动画阶段3: 螺旋下降
    tl.to(props.camera, {
      fov: 85,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV螺旋下降错误'
      )
    }, 2.5)

    tl.to(props.camera.position, {
      x: 2,
      y: 1,
      z: 2,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const spiralRadius = props.camera.position.z * 0.5
            const spiralX = Math.cos(time * 2) * spiralRadius
            const spiralZ = Math.sin(time * 2) * spiralRadius
            props.camera.position.x = spiralX
            props.camera.position.z = spiralZ
            props.camera.lookAt(props.controls.target)
          },
          '螺旋旋转更新错误'
      )
    }, 2.5)

    // 动画阶段4: 最终定位
    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终定位错误'
      )
    }, 3.5)

    // 重置扭曲旋转
    tl.to(cameraRotation.value, {
      z: 0,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: function() {
        safeCameraTransform(
            () => props.camera.rotation.z = cameraRotation.value.z,
            '扭曲旋转重置错误'
        )
      }
    }, 3.5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置最终定位错误'
      )
    }, 3.5)

    // 动画阶段5: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 4)
  } catch (error) {
    onAnimationError(error, '空间扭曲')
  }
}

/**
 * 黑客帝国动画
 */
const animateMatrixHack = () => {
  try {
    // 初始设置：从顶部俯视
    setupInitialCameraState(new THREE.Vector3(0, 500, 0))
    props.camera.lookAt(0, 0, 0)

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '黑客帝国'),
        '黑客帝国'
    )

    // 动画阶段1: 下落效果
    tl.to(props.camera.position, {
      y: 50,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const wobbleX = Math.sin(time * 10) * 0.5
            const wobbleZ = Math.cos(time * 10) * 0.5
            props.camera.position.x = wobbleX
            props.camera.position.z = wobbleZ
            props.camera.lookAt(props.controls.target)
          },
          '下落效果更新错误'
      )
    })

    // 动画阶段2: 减速并调整视角
    tl.to(props.camera.position, {
      y: 10,
      x: 5,
      z: 5,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const wobbleX = Math.sin(time * 5) * 0.2
            const wobbleZ = Math.cos(time * 5) * 0.2
            props.camera.position.x = 5 + wobbleX
            props.camera.position.z = 5 + wobbleZ
            props.camera.lookAt(props.controls.target)
          },
          '视角调整错误'
      )
    }, 2)

    tl.to(props.camera, {
      fov: 90,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV视角调整错误'
      )
    }, 2)

    // 动画阶段3: 平移到最终位置
    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const wobbleX = Math.sin(time * 3) * 0.05
            const wobbleZ = Math.cos(time * 3) * 0.05
            props.camera.position.x = wobbleX
            props.camera.position.z = wobbleZ
            props.camera.lookAt(props.controls.target)
          },
          '位置平移更新错误'
      )
    }, 3)

    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终更新错误'
      )
    }, 3.5)

    // 动画阶段5: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 4)
  } catch (error) {
    onAnimationError(error, '黑客帝国')
  }
}

/**
 * 量子跃迁动画
 */
const animateQuantumShift = () => {
  try {
    // 初始设置：从随机位置开始
    const randomTheta = Math.random() * Math.PI * 2
    const randomPhi = Math.random() * Math.PI
    const randomRadius = 1000

    const randomPos = new THREE.Vector3()
    randomPos.setFromSphericalCoords(randomRadius, randomPhi, randomTheta)
    setupInitialCameraState(randomPos)

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '量子跃迁'),
        '量子跃迁'
    )

    // 动画阶段1: 多次跃迁
    let targetPosition = new THREE.Vector3()
    for (let i = 0; i < 3; i++) {
      targetPosition.set(
          (Math.random() - 0.5) * 500,
          (Math.random() - 0.5) * 500,
          (Math.random() - 0.5) * 500
      )

      tl.to(props.camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 0.3,
        ease: 'power1.inOut',
        onUpdate: () => safeCameraTransform(
            () => props.camera.lookAt(props.controls.target),
            '量子跃迁位置更新错误'
        )
      }, i * 0.4)

      // 闪烁效果
      tl.to(props.renderer.domElement, {
        opacity: 0.2,
        duration: 0.1,
        ease: 'power1.inOut'
      }, i * 0.4 + 0.1)

      tl.to(props.renderer.domElement, {
        opacity: 1,
        duration: 0.1,
        ease: 'power1.inOut'
      }, i * 0.4 + 0.2)
    }

    // 动画阶段2: 最终跃迁到附近
    tl.to(props.camera.position, {
      x: 10,
      y: 15,
      z: 10,
      duration: 0.5,
      ease: 'power1.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '最终跃迁位置更新错误'
      )
    }, 1.5)

    tl.to(props.camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终跃迁错误'
      )
    }, 1.5)

    // 动画阶段3: 稳定接近
    tl.to(props.camera.position, {
      x: 2,
      y: 3,
      z: 2,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const wobbleX = (Math.random() - 0.5) * 0.1
            const wobbleY = (Math.random() - 0.5) * 0.1
            const wobbleZ = (Math.random() - 0.5) * 0.1
            props.camera.position.x = 2 + wobbleX
            props.camera.position.y = 3 + wobbleY
            props.camera.position.z = 2 + wobbleZ
            props.camera.lookAt(props.controls.target)
          },
          '量子抖动更新错误'
      )
    }, 2)

    tl.to(props.camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV稳定接近错误'
      )
    }, 2.5)

    // 动画阶段4: 最终定位
    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const wobbleX = (Math.random() - 0.5) * 0.02
            const wobbleY = (Math.random() - 0.5) * 0.02
            const wobbleZ = (Math.random() - 0.5) * 0.02
            props.camera.position.x = wobbleX
            props.camera.position.y = wobbleY
            props.camera.position.z = wobbleZ
            props.camera.lookAt(props.controls.target)
          },
          '量子抖动减小错误'
      )
    }, 3)

    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终定位错误'
      )
    }, 3.5)

    // 动画阶段5: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 4)
  } catch (error) {
    onAnimationError(error, '量子跃迁')
  }
}





/**
 * 新增：时空裂缝动画
 */
const animateTimeRift = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(1200, 800, 1200))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量用于时空裂缝效果
    const riftIntensity = { value: 0 }
    const fragmentCount = { value: 0 }
    const realityStability = { value: 1 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '时空裂缝'),
        '时空裂缝'
    )

    // 动画阶段1: 平稳接近
    tl.to(props.camera.position, {
      x: 600,
      y: 400,
      z: 600,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 时空裂缝形成
    tl.to(riftIntensity, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 1.2)

    tl.to(props.camera.position, {
      x: 200,
      y: 150,
      z: 200,
      duration: 1.5,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const riftAmount = riftIntensity.value

            // 时空扭曲效果 - 随机位移
            const riftX = Math.sin(time * 15) * 20 * riftAmount
            const riftY = Math.cos(time * 12) * 15 * riftAmount
            const riftZ = Math.sin(time * 18) * 20 * riftAmount

            props.camera.position.x += riftX
            props.camera.position.y += riftY
            props.camera.position.z += riftZ

            // 相机随机倾斜
            cameraRotation.value.x = Math.sin(time * 8) * 0.3 * riftAmount
            cameraRotation.value.y = Math.cos(time * 6) * 0.3 * riftAmount
            cameraRotation.value.z = Math.sin(time * 10) * 0.2 * riftAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '时空裂缝效果更新错误'
      )
    }, 1.2)

    // 动画阶段3: 时间碎片化
    tl.to(fragmentCount, {
      value: 100,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.5)

    tl.to(realityStability, {
      value: 0.2,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.5)

    tl.to(props.camera, {
      fov: 130,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV时间碎片化错误'
      )
    }, 2.5)

    // 动画阶段4: 现实重组
    tl.to(realityStability, {
      value: 0.8,
      duration: 1.5,
      ease: 'power2.out'
    }, 3.5)

    tl.to(riftIntensity, {
      value: 0.4,
      duration: 1.5,
      ease: 'power2.out'
    }, 3.5)

    tl.to(props.camera.position, {
      x: 50,
      y: 30,
      z: 50,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const riftAmount = riftIntensity.value
            const stability = realityStability.value

            // 减少的时空扭曲效果
            const riftX = Math.sin(time * 8) * 5 * riftAmount
            const riftY = Math.cos(time * 6) * 4 * riftAmount
            const riftZ = Math.sin(time * 10) * 5 * riftAmount

            props.camera.position.x += riftX * stability
            props.camera.position.y += riftY * stability
            props.camera.position.z += riftZ * stability

            // 稳定的相机倾斜
            cameraRotation.value.x = Math.sin(time * 4) * 0.1 * riftAmount
            cameraRotation.value.y = Math.cos(time * 3) * 0.1 * riftAmount
            cameraRotation.value.z = Math.sin(time * 5) * 0.05 * riftAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '现实重组效果更新错误'
      )
    }, 3.5)

    // 动画阶段5: 最终稳定
    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终稳定错误'
      )
    }, 5)

    tl.to(riftIntensity, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(fragmentCount, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(realityStability, {
      value: 1,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.rotation.set(0, 0, 0)
            props.camera.lookAt(props.controls.target)
          },
          '最终稳定位置错误'
      )
    }, 5)

    // 动画阶段6: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 5.5)

    // 动画阶段7: 视觉冲击效果 - 闪烁
    tl.to(props.renderer.domElement, {
      opacity: 0.7,
      duration: 0.1,
      ease: 'none'
    }, 2.5)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.1,
      ease: 'none'
    }, 2.6)

    tl.to(props.renderer.domElement, {
      opacity: 0.5,
      duration: 0.1,
      ease: 'none'
    }, 3.5)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.1,
      ease: 'none'
    }, 3.6)

  } catch (error) {
    onAnimationError(error, '时空裂缝')
  }
}

/**
 * 新增：星球爆炸动画
 */
const animatePlanetExplosion = () => {
  try {
    // 初始设置：从星球表面附近开始
    setupInitialCameraState(new THREE.Vector3(300, 200, 300))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const explosionIntensity = { value: 0 }
    const debrisField = { value: 0 }
    const shockwaveRadius = { value: 0 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '星球爆炸'),
        '星球爆炸'
    )

    // 动画阶段1: 靠近星球
    tl.to(props.camera.position, {
      x: 150,
      y: 100,
      z: 150,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 爆炸开始
    tl.to(explosionIntensity, {
      value: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 0.8)

    tl.to(props.camera.position, {
      x: 200,
      y: 150,
      z: 200,
      duration: 1,
      ease: 'power4.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const explosionAmount = explosionIntensity.value

            // 爆炸冲击效果
            const shockX = Math.sin(time * 20) * 15 * explosionAmount
            const shockY = Math.cos(time * 20) * 15 * explosionAmount
            const shockZ = Math.sin(time * 20) * 15 * explosionAmount

            props.camera.position.x += shockX
            props.camera.position.y += shockY
            props.camera.position.z += shockZ

            // 相机剧烈震动
            cameraRotation.value.x = Math.sin(time * 25) * 0.2 * explosionAmount
            cameraRotation.value.y = Math.cos(time * 25) * 0.2 * explosionAmount
            cameraRotation.value.z = Math.sin(time * 25) * 0.15 * explosionAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '爆炸冲击效果更新错误'
      )
    }, 0.8)

    // 动画阶段3: 碎片场形成
    tl.to(debrisField, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 1.5)

    tl.to(props.camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV碎片场错误'
      )
    }, 1.5)

    // 动画阶段4: 冲击波扩散
    tl.to(shockwaveRadius, {
      value: 500,
      duration: 2,
      ease: 'power2.out'
    }, 2)

    tl.to(props.camera.position, {
      x: 100,
      y: 80,
      z: 100,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const explosionAmount = explosionIntensity.value * 0.7
            const debrisAmount = debrisField.value
            const radius = shockwaveRadius.value

            // 减少的震动效果
            const shockX = Math.sin(time * 15) * 8 * explosionAmount
            const shockY = Math.cos(time * 15) * 8 * explosionAmount
            const shockZ = Math.sin(time * 15) * 8 * explosionAmount

            props.camera.position.x += shockX
            props.camera.position.y += shockY
            props.camera.position.z += shockZ

            // 碎片场效果
            const debrisX = Math.sin(time * 5) * 10 * debrisAmount
            const debrisZ = Math.cos(time * 5) * 10 * debrisAmount

            props.camera.position.x += debrisX
            props.camera.position.z += debrisZ

            // 相机轻微震动
            cameraRotation.value.x = Math.sin(time * 10) * 0.1 * explosionAmount
            cameraRotation.value.y = Math.cos(time * 10) * 0.1 * explosionAmount
            cameraRotation.value.z = Math.sin(time * 10) * 0.08 * explosionAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '冲击波扩散效果更新错误'
      )
    }, 2)

    // 动画阶段5: 能量消散
    tl.to(explosionIntensity, {
      value: 0.3,
      duration: 1,
      ease: 'power2.out'
    }, 3.5)

    tl.to(debrisField, {
      value: 0.5,
      duration: 1,
      ease: 'power2.out'
    }, 3.5)

    tl.to(props.camera.position, {
      x: 20,
      y: 15,
      z: 20,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const explosionAmount = explosionIntensity.value
            const debrisAmount = debrisField.value

            // 微小震动
            const shockX = Math.sin(time * 8) * 2 * explosionAmount
            const shockY = Math.cos(time * 8) * 2 * explosionAmount
            const shockZ = Math.sin(time * 8) * 2 * explosionAmount

            props.camera.position.x += shockX
            props.camera.position.y += shockY
            props.camera.position.z += shockZ

            // 碎片场效果
            const debrisX = Math.sin(time * 3) * 5 * debrisAmount
            const debrisZ = Math.cos(time * 3) * 5 * debrisAmount

            props.camera.position.x += debrisX
            props.camera.position.z += debrisZ

            // 相机轻微震动
            cameraRotation.value.x = Math.sin(time * 5) * 0.05 * explosionAmount
            cameraRotation.value.y = Math.cos(time * 5) * 0.05 * explosionAmount
            cameraRotation.value.z = Math.sin(time * 5) * 0.03 * explosionAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '能量消散效果更新错误'
      )
    }, 3.5)

    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV能量消散错误'
      )
    }, 4.5)

    // 动画阶段6: 最终稳定
    tl.to(explosionIntensity, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(debrisField, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.rotation.set(0, 0, 0)
            props.camera.lookAt(props.controls.target)
          },
          '最终稳定位置错误'
      )
    }, 5)

    // 动画阶段7: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 5.5)

    // 动画阶段8: 视觉冲击效果 - 闪烁
    tl.to(props.renderer.domElement, {
      opacity: 0.4,
      duration: 0.1,
      ease: 'none'
    }, 0.8)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 0.9)

    tl.to(props.renderer.domElement, {
      opacity: 0.6,
      duration: 0.1,
      ease: 'none'
    }, 1.5)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 1.6)

  } catch (error) {
    onAnimationError(error, '星球爆炸')
  }
}

/**
 * 新增：量子纠缠动画
 */
const animateQuantumEntanglement = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(1000, 700, 1000))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const entanglementStrength = { value: 0 }
    const parallelWorlds = { value: 1 }
    const realityMerge = { value: 0 }
    const quantumPositions = [
      new THREE.Vector3(500, 300, 500),
      new THREE.Vector3(-500, 300, -500),
      new THREE.Vector3(500, 300, -500),
      new THREE.Vector3(-500, 300, 500)
    ]

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '量子纠缠'),
        '量子纠缠'
    )

    // 动画阶段1: 平稳接近
    tl.to(props.camera.position, {
      x: 500,
      y: 350,
      z: 500,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 量子纠缠开始
    tl.to(entanglementStrength, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 1.2)

    // 动画阶段3: 多重空间同时出现
    for (let i = 0; i < quantumPositions.length; i++) {
      tl.to(props.camera.position, {
        x: quantumPositions[i].x,
        y: quantumPositions[i].y,
        z: quantumPositions[i].z,
        duration: 0.3,
        ease: 'power1.inOut',
        onUpdate: () => safeCameraTransform(
            () => {
              const time = tl.time()
              const entangleAmount = entanglementStrength.value

              // 量子抖动效果
              const quantumX = Math.sin(time * 30) * 5 * entangleAmount
              const quantumY = Math.cos(time * 25) * 5 * entangleAmount
              const quantumZ = Math.sin(time * 35) * 5 * entangleAmount

              props.camera.position.x += quantumX
              props.camera.position.y += quantumY
              props.camera.position.z += quantumZ

              // 相机量子旋转
              cameraRotation.value.x = Math.sin(time * 10) * 0.1 * entangleAmount
              cameraRotation.value.y = Math.cos(time * 8) * 0.1 * entangleAmount
              cameraRotation.value.z = Math.sin(time * 12) * 0.1 * entangleAmount

              props.camera.rotation.set(
                  cameraRotation.value.x,
                  cameraRotation.value.y,
                  cameraRotation.value.z
              )

              props.camera.lookAt(props.controls.target)
            },
            '量子纠缠效果更新错误'
        )
      }, 1.2 + i * 0.4)
    }

    // 动画阶段4: 现实融合
    tl.to(realityMerge, {
      value: 1,
      duration: 2,
      ease: 'power2.inOut'
    }, 3)

    tl.to(props.camera, {
      fov: 110,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV现实融合错误'
      )
    }, 3)

    tl.to(props.camera.position, {
      x: 100,
      y: 70,
      z: 100,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const entangleAmount = entanglementStrength.value
            const mergeAmount = realityMerge.value

            // 减少的量子抖动效果
            const quantumX = Math.sin(time * 20) * 3 * entangleAmount * (1 - mergeAmount)
            const quantumY = Math.cos(time * 15) * 3 * entangleAmount * (1 - mergeAmount)
            const quantumZ = Math.sin(time * 25) * 3 * entangleAmount * (1 - mergeAmount)

            props.camera.position.x += quantumX
            props.camera.position.y += quantumY
            props.camera.position.z += quantumZ

            // 相机量子旋转
            cameraRotation.value.x = Math.sin(time * 5) * 0.05 * entangleAmount * (1 - mergeAmount)
            cameraRotation.value.y = Math.cos(time * 4) * 0.05 * entangleAmount * (1 - mergeAmount)
            cameraRotation.value.z = Math.sin(time * 6) * 0.05 * entangleAmount * (1 - mergeAmount)

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '现实融合效果更新错误'
      )
    }, 3)

    // 动画阶段5: 最终稳定
    tl.to(entanglementStrength, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终稳定错误'
      )
    }, 5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.rotation.set(0, 0, 0)
            props.camera.lookAt(props.controls.target)
          },
          '最终稳定位置错误'
      )
    }, 5)

    // 动画阶段6: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 5.5)

    // 动画阶段7: 视觉冲击效果 - 闪烁
    for (let i = 0; i < quantumPositions.length; i++) {
      tl.to(props.renderer.domElement, {
        opacity: 0.7,
        duration: 0.1,
        ease: 'none'
      }, 1.2 + i * 0.4)

      tl.to(props.renderer.domElement, {
        opacity: 1,
        duration: 0.1,
        ease: 'none'
      }, 1.3 + i * 0.4)
    }

  } catch (error) {
    onAnimationError(error, '量子纠缠')
  }
}

/**
 * 新增：虚拟现实动画
 */
const animateVirtualReality = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(800, 600, 800))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const pixelation = { value: 10 }
    const digitalNoise = { value: 0 }
    const realityLevel = { value: 0 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '虚拟现实'),
        '虚拟现实'
    )

    // 动画阶段1: 像素化开始
    tl.to(props.camera.position, {
      x: 400,
      y: 300,
      z: 400,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置更新错误'
      )
    })

    tl.to(pixelation, {
      value: 30,
      duration: 1,
      ease: 'power2.inOut'
    }, 0.8)

    // 动画阶段2: 数字噪音增加
    tl.to(digitalNoise, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 1.5)

    tl.to(props.camera.position, {
      x: 200,
      y: 150,
      z: 200,
      duration: 1.5,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const pixelAmount = pixelation.value / 10
            const noiseAmount = digitalNoise.value

            // 像素化效果 - 块状移动
            const pixelSize = Math.floor(pixelAmount)
            const pixelX = Math.floor(props.camera.position.x / pixelSize) * pixelSize
            const pixelY = Math.floor(props.camera.position.y / pixelSize) * pixelSize
            const pixelZ = Math.floor(props.camera.position.z / pixelSize) * pixelSize

            props.camera.position.x = pixelX + (pixelSize / 2)
            props.camera.position.y = pixelY + (pixelSize / 2)
            props.camera.position.z = pixelZ + (pixelSize / 2)

            // 数字噪音效果
            const noiseX = (Math.random() - 0.5) * 10 * noiseAmount
            const noiseY = (Math.random() - 0.5) * 10 * noiseAmount
            const noiseZ = (Math.random() - 0.5) * 10 * noiseAmount

            props.camera.position.x += noiseX
            props.camera.position.y += noiseY
            props.camera.position.z += noiseZ

            // 相机数字抖动
            cameraRotation.value.x = (Math.random() - 0.5) * 0.1 * noiseAmount
            cameraRotation.value.y = (Math.random() - 0.5) * 0.1 * noiseAmount
            cameraRotation.value.z = (Math.random() - 0.5) * 0.05 * noiseAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '像素化效果更新错误'
      )
    }, 1.5)

    // 动画阶段3: 现实化开始
    tl.to(realityLevel, {
      value: 1,
      duration: 2,
      ease: 'power2.out'
    }, 2.5)

    tl.to(pixelation, {
      value: 5,
      duration: 2,
      ease: 'power2.out'
    }, 2.5)

    tl.to(digitalNoise, {
      value: 0.2,
      duration: 2,
      ease: 'power2.out'
    }, 2.5)

    tl.to(props.camera.position, {
      x: 50,
      y: 30,
      z: 50,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const pixelAmount = pixelation.value / 10
            const noiseAmount = digitalNoise.value
            const reality = realityLevel.value

            // 减少的像素化效果
            const pixelSize = Math.max(1, Math.floor(pixelAmount * reality))
            const pixelX = Math.floor(props.camera.position.x / pixelSize) * pixelSize
            const pixelY = Math.floor(props.camera.position.y / pixelSize) * pixelSize
            const pixelZ = Math.floor(props.camera.position.z / pixelSize) * pixelSize

            props.camera.position.x = pixelX + (pixelSize / 2)
            props.camera.position.y = pixelY + (pixelSize / 2)
            props.camera.position.z = pixelZ + (pixelSize / 2)

            // 减少的数字噪音效果
            const noiseX = (Math.random() - 0.5) * 5 * noiseAmount
            const noiseY = (Math.random() - 0.5) * 5 * noiseAmount
            const noiseZ = (Math.random() - 0.5) * 5 * noiseAmount

            props.camera.position.x += noiseX
            props.camera.position.y += noiseY
            props.camera.position.z += noiseZ

            // 减少的相机数字抖动
            cameraRotation.value.x = (Math.random() - 0.5) * 0.05 * noiseAmount
            cameraRotation.value.y = (Math.random() - 0.5) * 0.05 * noiseAmount
            cameraRotation.value.z = (Math.random() - 0.5) * 0.02 * noiseAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '现实化效果更新错误'
      )
    }, 2.5)

    // 动画阶段4: 完全现实化
    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV完全现实化错误'
      )
    }, 4.5)

    tl.to(pixelation, {
      value: 1,
      duration: 0.5,
      ease: 'power1.out'
    }, 4.5)

    tl.to(digitalNoise, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 4.5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.rotation.set(0, 0, 0)
            props.camera.lookAt(props.controls.target)
          },
          '完全现实化位置错误'
      )
    }, 4.5)

    // 动画阶段5: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 5)

    // 动画阶段6: 视觉冲击效果 - 闪烁
    tl.to(props.renderer.domElement, {
      opacity: 0.8,
      duration: 0.1,
      ease: 'none'
    }, 2.5)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.1,
      ease: 'none'
    }, 2.6)

    tl.to(props.renderer.domElement, {
      opacity: 0.9,
      duration: 0.1,
      ease: 'none'
    }, 3.5)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.1,
      ease: 'none'
    }, 3.6)

  } catch (error) {
    onAnimationError(error, '虚拟现实')
  }
}





/**
 * 新增：场景漫游动画
 */
const animateSceneRoaming = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(1500, 1000, 1500))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建场景漫游路径点
    const roamingPath = [
      new THREE.Vector3(1000, 800, 1000),   // 起点
      new THREE.Vector3(-800, 600, 1000),   // 第一站
      new THREE.Vector3(-600, 400, -900),  // 第二站
      new THREE.Vector3(800, 300, -700),    // 第三站
      new THREE.Vector3(500, 200, 500),     // 第四站
      new THREE.Vector3(50, 50, 50)        // 终点
    ]

    // 创建辅助变量
    const pathProgress = { value: 0 }
    const viewTransition = { value: 0 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '场景漫游'),
        '场景漫游'
    )

    // 动画阶段1: 开始漫游
    tl.to(pathProgress, {
      value: 1,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: function() {
        const progress = pathProgress.value
        const totalPoints = roamingPath.length - 1
        const segmentProgress = progress * totalPoints
        const currentSegment = Math.floor(segmentProgress)
        const segmentT = segmentProgress - currentSegment

        if (currentSegment < totalPoints) {
          const startPoint = roamingPath[currentSegment]
          const endPoint = roamingPath[currentSegment + 1]

          // 线性插值计算当前位置
          props.camera.position.lerpVectors(startPoint, endPoint, segmentT)

          // 平滑看向目标点
          const lookAtPoint = currentSegment < totalPoints - 1
              ? roamingPath[currentSegment + 2]
              : props.controls.target

          props.camera.lookAt(lookAtPoint)

          // 场景切换效果
          viewTransition.value = Math.sin(segmentT * Math.PI)
        }
      }
    })

    // 动画阶段2: 场景切换效果
    tl.to(props.camera, {
      fov: 85,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV场景切换错误'
      )
    }, 2)

    tl.to(props.camera, {
      fov: 100,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV场景切换错误'
      )
    }, 4)

    // 动画阶段3: 最终接近
    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 1,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终接近错误'
      )
    }, 5.5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '最终接近位置错误'
      )
    }, 6)

    // 动画阶段4: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 6.5)

    // 动画阶段5: 场景切换视觉效果
    tl.to(props.renderer.domElement, {
      opacity: 0.9,
      duration: 0.2,
      ease: 'none'
    }, 1.9)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 2.1)

    tl.to(props.renderer.domElement, {
      opacity: 0.9,
      duration: 0.2,
      ease: 'none'
    }, 3.9)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 4.1)

  } catch (error) {
    onAnimationError(error, '场景漫游')
  }
}

/**
 * 新增：轨道环绕动画
 */
const animateOrbitalRotation = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(1200, 800, 1200))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const orbitAngle = { value: 0 }
    const orbitRadius = { value: 1200 }
    const orbitHeight = { value: 800 }
    const rotationSpeed = { value: 1 }
    const gravityWell = { value: 0 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '轨道环绕'),
        '轨道环绕'
    )

    // 动画阶段1: 开始环绕
    tl.to(orbitRadius, {
      value: 1000,
      duration: 1,
      ease: 'power2.inOut'
    })

    tl.to(orbitAngle, {
      value: Math.PI * 2, // 完整一圈
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = orbitAngle.value
        const radius = orbitRadius.value
        const height = orbitHeight.value
        const speed = rotationSpeed.value

        // 计算轨道位置
        const x = Math.cos(angle * speed) * radius
        const z = Math.sin(angle * speed) * radius

        // 添加高度变化
        const y = height - (height - 100) * (angle / (Math.PI * 2))

        // 更新相机位置
        props.camera.position.set(x, y, z)

        // 始终看向中心
        props.camera.lookAt(props.controls.target)
      }
    })

    // 动画阶段2: 加速旋转
    tl.to(rotationSpeed, {
      value: 2,
      duration: 1,
      ease: 'power2.inOut'
    }, 2)

    tl.to(orbitAngle, {
      value: Math.PI * 4, // 再转两圈
      duration: 2,
      ease: 'none',
      onUpdate: function() {
        const angle = orbitAngle.value
        const radius = orbitRadius.value
        const height = orbitHeight.value
        const speed = rotationSpeed.value

        // 计算轨道位置
        const x = Math.cos(angle * speed) * radius
        const z = Math.sin(angle * speed) * radius

        // 添加高度变化
        const y = height - (height - 50) * ((angle - Math.PI * 2) / (Math.PI * 2))

        // 添加引力井效果
        const gravityEffect = gravityWell.value
        const gravityX = x * (1 - 0.5 * gravityEffect)
        const gravityZ = z * (1 - 0.5 * gravityEffect)
        const gravityY = y * (1 - 0.3 * gravityEffect)

        // 更新相机位置
        props.camera.position.set(gravityX, gravityY, gravityZ)

        // 始终看向中心
        props.camera.lookAt(props.controls.target)
      }
    }, 3)

    // 动画阶段3: 引力井效果
    tl.to(gravityWell, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 3)

    tl.to(orbitRadius, {
      value: 100,
      duration: 1.5,
      ease: 'power2.in'
    }, 4)

    // 动画阶段4: 螺旋接近
    tl.to(orbitAngle, {
      value: Math.PI * 6, // 再转两圈
      duration: 1.5,
      ease: 'none',
      onUpdate: function() {
        const angle = orbitAngle.value
        const radius = orbitRadius.value
        const gravityEffect = gravityWell.value

        // 计算螺旋轨道位置
        const spiralRadius = radius * (1 - (angle - Math.PI * 4) / (Math.PI * 2))
        const x = Math.cos(angle * 2) * spiralRadius
        const z = Math.sin(angle * 2) * spiralRadius

        // 添加高度变化
        const y = 50 - 40 * ((angle - Math.PI * 4) / (Math.PI * 2))

        // 更新相机位置
        props.camera.position.set(x, y, z)

        // 始终看向中心
        props.camera.lookAt(props.controls.target)
      }
    }, 4.5)

    // 动画阶段5: 最终定位
    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终定位错误'
      )
    }, 5.5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '最终定位位置错误'
      )
    }, 6)

    // 动画阶段6: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 6.5)

    // 动画阶段7: 视觉冲击效果 - 闪烁
    tl.to(props.renderer.domElement, {
      opacity: 0.9,
      duration: 0.2,
      ease: 'none'
    }, 2.9)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 3.1)

    tl.to(props.renderer.domElement, {
      opacity: 0.8,
      duration: 0.2,
      ease: 'none'
    }, 4.4)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 4.6)

  } catch (error) {
    onAnimationError(error, '轨道环绕')
  }
}

/**
 * 新增：维度传送门动画
 */
const animateDimensionalPortal = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(1000, 700, 1000))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const portalProgress = { value: 0 }
    const portalRotation = { value: 0 }
    const dimensionShift = { value: 0 }
    const portalSize = { value: 200 }

    // 创建多个传送门位置
    const portals = [
      { position: new THREE.Vector3(500, 300, 500), color: 0x00ffff },
      { position: new THREE.Vector3(-400, 200, 600), color: 0xff00ff },
      { position: new THREE.Vector3(300, 100, -500), color: 0xffff00 },
      { position: new THREE.Vector3(-200, 150, -300), color: 0x00ff00 }
    ]

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '维度传送门'),
        '维度传送门'
    )

    // 动画阶段1: 接近第一个传送门
    tl.to(props.camera.position, {
      x: 700,
      y: 400,
      z: 700,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(portals[0].position),
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 进入第一个传送门
    tl.to(portalProgress, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 0.8)

    tl.to(portalRotation, {
      value: Math.PI * 2,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        const progress = portalProgress.value
        const rotation = portalRotation.value
        const portal = portals[0]

        // 计算传送门入口位置
        const entranceX = portal.position.x * (1 - progress)
        const entranceY = portal.position.y * (1 - progress)
        const entranceZ = portal.position.z * (1 - progress)

        // 添加旋转效果
        const rotationRadius = 50 * (1 - progress)
        const rotationX = Math.cos(rotation) * rotationRadius
        const rotationZ = Math.sin(rotation) * rotationRadius

        // 更新相机位置
        props.camera.position.set(
            entranceX + rotationX,
            entranceY,
            entranceZ + rotationZ
        )

        // 相机旋转
        cameraRotation.value.z = rotation * progress * 0.5
        props.camera.rotation.z = cameraRotation.value.z

        // 看向传送门中心
        props.camera.lookAt(portal.position)
      }
    }, 0.8)

    // 动画阶段3: 穿越维度
    tl.to(dimensionShift, {
      value: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 1.5)

    tl.to(props.renderer.domElement, {
      opacity: 0.2,
      duration: 0.2,
      ease: 'none'
    }, 1.5)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 1.7)

    // 动画阶段4: 从第二个传送门出现
    tl.to(portalProgress, {
      value: 0,
      duration: 1,
      ease: 'power2.out',
      onUpdate: function() {
        const progress = 1 - portalProgress.value // 反向进度
        const rotation = portalRotation.value + Math.PI * 2
        const portal = portals[1]

        // 计算传送门出口位置
        const exitX = portal.position.x * progress
        const exitY = portal.position.y * progress
        const exitZ = portal.position.z * progress

        // 添加旋转效果
        const rotationRadius = 50 * progress
        const rotationX = Math.cos(rotation) * rotationRadius
        const rotationZ = Math.sin(rotation) * rotationRadius

        // 更新相机位置
        props.camera.position.set(
            exitX + rotationX,
            exitY,
            exitZ + rotationZ
        )

        // 相机旋转
        cameraRotation.value.z = rotation * (1 - progress) * 0.5
        props.camera.rotation.z = cameraRotation.value.z

        // 看向传送门中心
        props.camera.lookAt(portal.position)
      }
    }, 2)

    // 动画阶段5: 在不同维度间跳跃
    for (let i = 1; i < portals.length - 1; i++) {
      const currentPortal = portals[i]
      const nextPortal = portals[i + 1]

      // 接近当前传送门
      tl.to(props.camera.position, {
        x: currentPortal.position.x,
        y: currentPortal.position.y,
        z: currentPortal.position.z,
        duration: 0.5,
        ease: 'power2.inOut',
        onUpdate: () => safeCameraTransform(
            () => props.camera.lookAt(currentPortal.position),
            '相机位置更新错误'
        )
      }, 3 + i * 1.5)

      // 进入传送门
      tl.to(portalProgress, {
        value: 1,
        duration: 0.5,
        ease: 'power2.inOut'
      }, 3.2 + i * 1.5)

      // 维度转换
      tl.to(dimensionShift, {
        value: i % 2 === 0 ? 1 : 0,
        duration: 0.3,
        ease: 'power2.inOut'
      }, 3.5 + i * 1.5)

      tl.to(props.renderer.domElement, {
        opacity: i % 2 === 0 ? 0.2 : 0.8,
        duration: 0.2,
        ease: 'none'
      }, 3.5 + i * 1.5)

      tl.to(props.renderer.domElement, {
        opacity: 1,
        duration: 0.2,
        ease: 'none'
      }, 3.7 + i * 1.5)

      // 从下一个传送门出现
      tl.to(portalProgress, {
        value: 0,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: function() {
          const progress = 1 - portalProgress.value // 反向进度
          const portal = nextPortal

          // 计算传送门出口位置
          const exitX = portal.position.x * progress
          const exitY = portal.position.y * progress
          const exitZ = portal.position.z * progress

          // 更新相机位置
          props.camera.position.set(exitX, exitY, exitZ)

          // 看向传送门中心
          props.camera.lookAt(portal.position)
        }
      }, 4 + i * 1.5)
    }

    // 动画阶段6: 最终接近
    tl.to(props.camera.position, {
      x: 50,
      y: 30,
      z: 50,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '最终接近错误'
      )
    }, 7)

    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终接近错误'
      )
    }, 7.5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '最终接近位置错误'
      )
    }, 8)

    // 动画阶段7: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 8.5)

  } catch (error) {
    onAnimationError(error, '维度传送门')
  }
}

/**
 * 新增：时空穿梭动画
 */
const animateTimeTravel = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(1000, 700, 1000))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const timeProgress = { value: 0 }
    const pastFutureShift = { value: 0 } // -1 是过去，1 是未来
    const temporalDistortion = { value: 0 }
    const timeRipples = { value: 0 }

    // 创建时间线上的关键点
    const timePoints = [
      { position: new THREE.Vector3(800, 600, 800), time: -100, color: 0x8844ff }, // 过去
      { position: new THREE.Vector3(400, 400, 400), time: -50, color: 0xaa66ff },  // 近过去
      { position: new THREE.Vector3(200, 200, 200), time: 0, color: 0xffffff },     // 现在
      { position: new THREE.Vector3(100, 100, 100), time: 50, color: 0x66aaff },   // 近未来
      { position: new THREE.Vector3(50, 30, 50), time: 100, color: 0x4488ff }     // 未来
    ]

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '时空穿梭'),
        '时空穿梭'
    )

    // 动画阶段1: 开始时间旅行
    tl.to(timeProgress, {
      value: 0.2,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        const progress = timeProgress.value
        const pointIndex = Math.floor(progress * (timePoints.length - 1))
        const localProgress = (progress * (timePoints.length - 1)) - pointIndex

        if (pointIndex < timePoints.length - 1) {
          const startPoint = timePoints[pointIndex]
          const endPoint = timePoints[pointIndex + 1]

          // 线性插值计算当前位置
          props.camera.position.lerpVectors(startPoint.position, endPoint.position, localProgress)

          // 计算时间偏移
          const timeOffset = startPoint.time + (endPoint.time - startPoint.time) * localProgress
          pastFutureShift.value = timeOffset / 100

          // 看向中心点
          props.camera.lookAt(props.controls.target)

          // 时间涟漪效果
          timeRipples.value = Math.abs(localProgress - 0.5) * 2
        }
      }
    })

    // 动画阶段2: 时空扭曲
    tl.to(temporalDistortion, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 0.8)

    tl.to(props.camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV时空扭曲错误'
      )
    }, 0.8)

    // 动画阶段3: 快速穿梭
    tl.to(timeProgress, {
      value: 0.8,
      duration: 2,
      ease: 'power4.inOut',
      onUpdate: function() {
        const progress = timeProgress.value
        const distortion = temporalDistortion.value
        const pointIndex = Math.floor(progress * (timePoints.length - 1))
        const localProgress = (progress * (timePoints.length - 1)) - pointIndex

        if (pointIndex < timePoints.length - 1) {
          const startPoint = timePoints[pointIndex]
          const endPoint = timePoints[pointIndex + 1]

          // 线性插值计算当前位置
          props.camera.position.lerpVectors(startPoint.position, endPoint.position, localProgress)

          // 计算时间偏移
          const timeOffset = startPoint.time + (endPoint.time - startPoint.time) * localProgress
          pastFutureShift.value = timeOffset / 100

          // 添加时空扭曲效果
          const time = tl.time()
          const distortionAmount = Math.sin(time * 10) * 10 * distortion

          props.camera.position.x += distortionAmount * pastFutureShift.value
          props.camera.position.y += distortionAmount * Math.abs(pastFutureShift.value) * 0.5
          props.camera.position.z += distortionAmount * pastFutureShift.value

          // 相机倾斜
          cameraRotation.value.x = Math.sin(time * 5) * 0.1 * distortion * pastFutureShift.value
          cameraRotation.value.z = Math.cos(time * 7) * 0.1 * distortion * pastFutureShift.value

          props.camera.rotation.set(
              cameraRotation.value.x,
              0,
              cameraRotation.value.z
          )

          // 看向中心点
          props.camera.lookAt(props.controls.target)

          // 时间涟漪效果
          timeRipples.value = Math.abs(localProgress - 0.5) * 2
        }
      }
    }, 1.5)

    // 动画阶段4: 时间稳定
    tl.to(temporalDistortion, {
      value: 0.2,
      duration: 1,
      ease: 'power2.out'
    }, 3)

    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV时间稳定错误'
      )
    }, 3)

    // 动画阶段5: 最终接近
    tl.to(timeProgress, {
      value: 1,
      duration: 1,
      ease: 'power2.out',
      onUpdate: function() {
        const progress = timeProgress.value
        const distortion = temporalDistortion.value
        const pointIndex = Math.floor(progress * (timePoints.length - 1))
        const localProgress = (progress * (timePoints.length - 1)) - pointIndex

        if (pointIndex < timePoints.length - 1) {
          const startPoint = timePoints[pointIndex]
          const endPoint = timePoints[pointIndex + 1]

          // 线性插值计算当前位置
          props.camera.position.lerpVectors(startPoint.position, endPoint.position, localProgress)

          // 计算时间偏移
          const timeOffset = startPoint.time + (endPoint.time - startPoint.time) * localProgress
          pastFutureShift.value = timeOffset / 100

          // 添加轻微时空扭曲效果
          const time = tl.time()
          const distortionAmount = Math.sin(time * 5) * 2 * distortion

          props.camera.position.x += distortionAmount * pastFutureShift.value
          props.camera.position.z += distortionAmount * pastFutureShift.value

          // 相机轻微倾斜
          cameraRotation.value.x = Math.sin(time * 3) * 0.02 * distortion * pastFutureShift.value
          cameraRotation.value.z = Math.cos(time * 4) * 0.02 * distortion * pastFutureShift.value

          props.camera.rotation.set(
              cameraRotation.value.x,
              0,
              cameraRotation.value.z
          )

          // 看向中心点
          props.camera.lookAt(props.controls.target)

          // 时间涟漪效果
          timeRipples.value = Math.abs(localProgress - 0.5) * 2
        }
      }
    }, 4)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.rotation.set(0, 0, 0)
            props.camera.lookAt(props.controls.target)
          },
          '最终接近位置错误'
      )
    }, 5)

    // 动画阶段6: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 5.5)

    // 动画阶段7: 视觉冲击效果 - 时间涟漪
    for (let i = 0; i < 3; i++) {
      tl.to(props.renderer.domElement, {
        opacity: 0.7,
        duration: 0.2,
        ease: 'none'
      }, 0.8 + i * 1.5)

      tl.to(props.renderer.domElement, {
        opacity: 1,
        duration: 0.2,
        ease: 'none'
      }, 1 + i * 1.5)
    }

  } catch (error) {
    onAnimationError(error, '时空穿梭')
  }
}





/**
 * 新增：黑洞吞噬动画
 */
const animateBlackHole = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(2000, 1500, 2000))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const gravityPull = { value: 0 }
    const eventHorizonRadius = { value: 1000 }
    const accretionDiskRotation = { value: 0 }
    const spaghettification = { value: 0 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '黑洞吞噬'),
        '黑洞吞噬'
    )

    // 动画阶段1: 接近黑洞
    tl.to(props.camera.position, {
      x: 1000,
      y: 750,
      z: 1000,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 开始受到引力影响
    tl.to(gravityPull, {
      value: 1,
      duration: 2,
      ease: 'power2.inOut'
    }, 1.2)

    tl.to(accretionDiskRotation, {
      value: Math.PI * 4,
      duration: 2,
      ease: 'power2.inOut'
    }, 1.2)

    tl.to(props.camera.position, {
      x: 500,
      y: 300,
      z: 500,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const pullAmount = gravityPull.value
            const rotation = accretionDiskRotation.value

            // 引力拖拽效果
            const pullDistance = props.camera.position.length()
            const targetDistance = 200 * pullAmount
            const currentDistance = pullDistance * (1 - pullAmount * 0.8)

            // 计算引力方向
            const gravityDirection = new THREE.Vector3(0, 0, 0).sub(props.camera.position).normalize()

            // 应用引力
            const gravityEffect = gravityDirection.multiplyScalar((pullDistance - currentDistance) * 0.1)
            props.camera.position.add(gravityEffect)

            // 吸积盘旋转效果
            const rotationRadius = currentDistance * 0.5
            const rotationAngle = rotation + time
            const orbitX = Math.cos(rotationAngle) * rotationRadius * pullAmount
            const orbitZ = Math.sin(rotationAngle) * rotationRadius * pullAmount

            props.camera.position.x += orbitX
            props.camera.position.z += orbitZ

            // 相机倾斜
            cameraRotation.value.x = Math.sin(time * 3) * 0.3 * pullAmount
            cameraRotation.value.y = Math.cos(time * 2) * 0.3 * pullAmount
            cameraRotation.value.z = Math.sin(time * 4) * 0.2 * pullAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '引力效果更新错误'
      )
    }, 1.2)

    // 动画阶段3: 接近事件视界
    tl.to(eventHorizonRadius, {
      value: 100,
      duration: 1.5,
      ease: 'power2.in'
    }, 3)

    tl.to(props.camera, {
      fov: 150,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV事件视界错误'
      )
    }, 3)

    tl.to(props.camera.position, {
      x: 100,
      y: 50,
      z: 100,
      duration: 1.5,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const pullAmount = gravityPull.value
            const horizonRadius = eventHorizonRadius.value

            // 事件视界扭曲效果
            const distanceFromHorizon = Math.max(0.1, props.camera.position.length() - horizonRadius)
            const distortionFactor = 1 - (distanceFromHorizon / 1000)

            // 引力透镜效果
            const gravitationalLensing = Math.sin(time * 10) * 20 * distortionFactor
            props.camera.position.x += gravitationalLensing
            props.camera.position.z += gravitationalLensing

            // 意大利面条化效果
            spaghettification.value = distortionFactor
            const stretchX = 1 + distortionFactor * 0.5
            const stretchZ = 1 - distortionFactor * 0.3

            props.camera.position.x *= stretchX
            props.camera.position.z *= stretchZ

            // 相机剧烈旋转
            cameraRotation.value.x = Math.sin(time * 15) * 0.5 * distortionFactor
            cameraRotation.value.y = Math.cos(time * 10) * 0.5 * distortionFactor
            cameraRotation.value.z = Math.sin(time * 20) * 0.3 * distortionFactor

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '事件视界扭曲错误'
      )
    }, 3)

    // 动画阶段4: 穿越事件视界
    tl.to(props.renderer.domElement, {
      opacity: 0.1,
      duration: 0.5,
      ease: 'power2.in'
    }, 4.5)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, 5)

    tl.to(gravityPull, {
      value: 0.3,
      duration: 1,
      ease: 'power2.out'
    }, 5)

    tl.to(spaghettification, {
      value: 0,
      duration: 1,
      ease: 'power2.out'
    }, 5)

    tl.to(props.camera.position, {
      x: 20,
      y: 10,
      z: 20,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const pullAmount = gravityPull.value

            // 减少的引力效果
            const distance = props.camera.position.length()
            const direction = new THREE.Vector3(0, 0, 0).sub(props.camera.position).normalize()
            const gravityEffect = direction.multiplyScalar(distance * 0.05 * pullAmount)

            props.camera.position.add(gravityEffect)

            // 减少的相机旋转
            cameraRotation.value.x = Math.sin(time * 5) * 0.1 * pullAmount
            cameraRotation.value.y = Math.cos(time * 4) * 0.1 * pullAmount
            cameraRotation.value.z = Math.sin(time * 6) * 0.05 * pullAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '穿越事件视界错误'
      )
    }, 5)

    // 动画阶段5: 最终稳定
    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终稳定错误'
      )
    }, 6)

    tl.to(gravityPull, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 6)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.rotation.set(0, 0, 0)
            props.camera.lookAt(props.controls.target)
          },
          '最终稳定位置错误'
      )
    }, 6)

    // 动画阶段6: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 6.5)

    // 动画阶段7: 视觉冲击效果 - 闪烁
    tl.to(props.renderer.domElement, {
      opacity: 0.9,
      duration: 0.2,
      ease: 'none'
    }, 3)

    tl.to(props.renderer.domElement, {
      opacity: 0.3,
      duration: 0.2,
      ease: 'none'
    }, 3.2)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 3.4)

  } catch (error) {
    onAnimationError(error, '黑洞吞噬')
  }
}

/**
 * 新增：宇宙大爆炸动画
 */
const animateCosmicBigBang = () => {
  try {
    // 初始设置：从奇点内部开始
    setupInitialCameraState(new THREE.Vector3(0.01, 0.01, 0.01))
    props.camera.fov = 10
    props.camera.updateProjectionMatrix()

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const expansion = { value: 0 }
    const inflation = { value: 0 }
    const formation = { value: 0 }
    const cooling = { value: 0 }
    const structure = { value: 0 }

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '宇宙大爆炸'),
        '宇宙大爆炸'
    )

    // 动画阶段1: 奇点状态
    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.5,
      ease: 'none'
    })

    // 动画阶段2: 暴胀期
    tl.to(inflation, {
      value: 1,
      duration: 0.5,
      ease: 'power4.inOut'
    }, 0.5)

    tl.to(props.camera, {
      fov: 170,
      duration: 0.5,
      ease: 'power4.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV暴胀期错误'
      )
    }, 0.5)

    tl.to(props.camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 0.5,
      ease: 'power4.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const inflationAmount = inflation.value
            const time = tl.time()

            // 暴胀期的随机波动
            const randomX = (Math.random() - 0.5) * 0.01 * inflationAmount
            const randomY = (Math.random() - 0.5) * 0.01 * inflationAmount
            const randomZ = (Math.random() - 0.5) * 0.01 * inflationAmount

            props.camera.position.x = 0.01 + randomX
            props.camera.position.y = 0.01 + randomY
            props.camera.position.z = 0.01 + randomZ

            // 相机剧烈震动
            cameraRotation.value.x = (Math.random() - 0.5) * 0.5 * inflationAmount
            cameraRotation.value.y = (Math.random() - 0.5) * 0.5 * inflationAmount
            cameraRotation.value.z = (Math.random() - 0.5) * 0.5 * inflationAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '暴胀期相机震动错误'
      )
    }, 0.5)

    // 动画阶段3: 快速膨胀
    tl.to(expansion, {
      value: 1,
      duration: 2,
      ease: 'power4.out'
    }, 1)

    tl.to(cooling, {
      value: 1,
      duration: 2,
      ease: 'power2.out'
    }, 1.5)

    tl.to(props.camera.position, {
      x: 1000,
      y: 1000,
      z: 1000,
      duration: 2,
      ease: 'power4.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const expansionAmount = expansion.value
            const coolingAmount = cooling.value
            const time = tl.time()

            // 膨胀效果的随机波动
            const fluctuationX = (Math.random() - 0.5) * 100 * expansionAmount * (1 - coolingAmount * 0.8)
            const fluctuationY = (Math.random() - 0.5) * 100 * expansionAmount * (1 - coolingAmount * 0.8)
            const fluctuationZ = (Math.random() - 0.5) * 100 * expansionAmount * (1 - coolingAmount * 0.8)

            props.camera.position.x = 1000 * expansionAmount + fluctuationX
            props.camera.position.y = 1000 * expansionAmount + fluctuationY
            props.camera.position.z = 1000 * expansionAmount + fluctuationZ

            // 相机震动随冷却减小
            cameraRotation.value.x = (Math.random() - 0.5) * 0.3 * expansionAmount * (1 - coolingAmount * 0.9)
            cameraRotation.value.y = (Math.random() - 0.5) * 0.3 * expansionAmount * (1 - coolingAmount * 0.9)
            cameraRotation.value.z = (Math.random() - 0.5) * 0.3 * expansionAmount * (1 - coolingAmount * 0.9)

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '快速膨胀错误'
      )
    }, 1)

    // 动画阶段4: 结构形成
    tl.to(formation, {
      value: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 3)

    tl.to(structure, {
      value: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 3.5)

    tl.to(props.camera, {
      fov: 120,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV结构形成错误'
      )
    }, 3)

    tl.to(props.camera.position, {
      x: 500,
      y: 300,
      z: 500,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const formationAmount = formation.value
            const structureAmount = structure.value
            const time = tl.time()

            // 结构形成的聚集效果
            const clusterX = Math.sin(time * 2) * 50 * structureAmount
            const clusterY = Math.cos(time * 3) * 30 * structureAmount
            const clusterZ = Math.sin(time * 4) * 40 * structureAmount

            props.camera.position.x = 500 - 200 * formationAmount + clusterX
            props.camera.position.y = 300 - 100 * formationAmount + clusterY
            props.camera.position.z = 500 - 200 * formationAmount + clusterZ

            // 相机轻微旋转
            cameraRotation.value.x = Math.sin(time * 1.5) * 0.1 * formationAmount
            cameraRotation.value.y = Math.cos(time * 2) * 0.1 * formationAmount
            cameraRotation.value.z = Math.sin(time * 1) * 0.05 * formationAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '结构形成错误'
      )
    }, 3)

    // 动画阶段5: 宇宙稳定
    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV宇宙稳定错误'
      )
    }, 4.5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.rotation.set(0, 0, 0)
            props.camera.lookAt(props.controls.target)
          },
          '宇宙稳定位置错误'
      )
    }, 4.5)

    // 动画阶段6: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 5)

    // 动画阶段7: 视觉冲击效果 - 闪光
    tl.to(props.renderer.domElement, {
      opacity: 0.1,
      duration: 0.2,
      ease: 'none'
    }, 0.5)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 0.7)

    tl.to(props.renderer.domElement, {
      opacity: 0.8,
      duration: 0.2,
      ease: 'none'
    }, 1.2)

    tl.to(props.renderer.domElement, {
      opacity: 1,
      duration: 0.2,
      ease: 'none'
    }, 1.4)

  } catch (error) {
    onAnimationError(error, '宇宙大爆炸')
  }
}

/**
 * 新增：维度崩溃动画
 */
const animateDimensionCollapse = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(1500, 1000, 1500))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const stability = { value: 1 }
    const collapse = { value: 0 }
    const chaos = { value: 0 }
    const restoration = { value: 0 }
    const dimensionLayers = [
      new THREE.Vector3(1200, 800, 1200),
      new THREE.Vector3(900, 600, 900),
      new THREE.Vector3(600, 400, 600),
      new THREE.Vector3(300, 200, 300),
      new THREE.Vector3(100, 50, 100)
    ]

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '维度崩溃'),
        '维度崩溃'
    )

    // 动画阶段1: 平稳接近
    tl.to(props.camera.position, {
      x: 1200,
      y: 800,
      z: 1200,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 维度开始不稳定
    tl.to(stability, {
      value: 0.5,
      duration: 1,
      ease: 'power2.inOut'
    }, 0.8)

    tl.to(props.camera.position, {
      x: 900,
      y: 600,
      z: 900,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const stabilityAmount = stability.value

            // 维度不稳定效果
            const instabilityX = Math.sin(time * 10) * 20 * (1 - stabilityAmount)
            const instabilityY = Math.cos(time * 8) * 15 * (1 - stabilityAmount)
            const instabilityZ = Math.sin(time * 12) * 20 * (1 - stabilityAmount)

            props.camera.position.x += instabilityX
            props.camera.position.y += instabilityY
            props.camera.position.z += instabilityZ

            // 相机轻微旋转
            cameraRotation.value.x = Math.sin(time * 5) * 0.1 * (1 - stabilityAmount)
            cameraRotation.value.y = Math.cos(time * 4) * 0.1 * (1 - stabilityAmount)
            cameraRotation.value.z = Math.sin(time * 6) * 0.05 * (1 - stabilityAmount)

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '维度不稳定错误'
      )
    }, 0.8)

    // 动画阶段3: 维度崩溃
    tl.to(collapse, {
      value: 1,
      duration: 1.5,
      ease: 'power4.in'
    }, 1.5)

    tl.to(chaos, {
      value: 1,
      duration: 1.5,
      ease: 'power4.in'
    }, 1.5)

    // 在不同维度层之间跳跃
    for (let i = 0; i < dimensionLayers.length; i++) {
      const layer = dimensionLayers[i]
      const layerStability = 1 - (i / dimensionLayers.length)

      tl.to(props.camera.position, {
        x: layer.x,
        y: layer.y,
        z: layer.z,
        duration: 0.3,
        ease: 'power1.inOut',
        onUpdate: () => safeCameraTransform(
            () => {
              const time = tl.time()
              const collapseAmount = collapse.value
              const chaosAmount = chaos.value
              const stabilityAmount = layerStability * (1 - collapseAmount)

              // 维度混乱效果
              const chaosX = (Math.random() - 0.5) * 100 * chaosAmount * (1 - stabilityAmount)
              const chaosY = (Math.random() - 0.5) * 100 * chaosAmount * (1 - stabilityAmount)
              const chaosZ = (Math.random() - 0.5) * 100 * chaosAmount * (1 - stabilityAmount)

              props.camera.position.x += chaosX
              props.camera.position.y += chaosY
              props.camera.position.z += chaosZ

              // 相机混乱旋转
              cameraRotation.value.x = (Math.random() - 0.5) * 0.5 * chaosAmount * (1 - stabilityAmount)
              cameraRotation.value.y = (Math.random() - 0.5) * 0.5 * chaosAmount * (1 - stabilityAmount)
              cameraRotation.value.z = (Math.random() - 0.5) * 0.3 * chaosAmount * (1 - stabilityAmount)

              props.camera.rotation.set(
                  cameraRotation.value.x,
                  cameraRotation.value.y,
                  cameraRotation.value.z
              )

              props.camera.lookAt(props.controls.target)
            },
            '维度混乱错误'
        )
      }, 1.5 + i * 0.3)

      // 视觉冲击效果
      if (i % 2 === 0) {
        tl.to(props.renderer.domElement, {
          opacity: 0.7,
          duration: 0.1,
          ease: 'none'
        }, 1.5 + i * 0.3)

        tl.to(props.renderer.domElement, {
          opacity: 1,
          duration: 0.1,
          ease: 'none'
        }, 1.6 + i * 0.3)
      }
    }

    // 动画阶段4: 维度重组
    tl.to(restoration, {
      value: 1,
      duration: 2,
      ease: 'power2.out'
    }, 3)

    tl.to(collapse, {
      value: 0.2,
      duration: 2,
      ease: 'power2.out'
    }, 3)

    tl.to(chaos, {
      value: 0.1,
      duration: 2,
      ease: 'power2.out'
    }, 3)

    tl.to(props.camera.position, {
      x: 100,
      y: 50,
      z: 100,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const collapseAmount = collapse.value
            const chaosAmount = chaos.value
            const restorationAmount = restoration.value

            // 减少的维度混乱效果
            const chaosX = (Math.random() - 0.5) * 20 * chaosAmount * (1 - restorationAmount * 0.9)
            const chaosY = (Math.random() - 0.5) * 20 * chaosAmount * (1 - restorationAmount * 0.9)
            const chaosZ = (Math.random() - 0.5) * 20 * chaosAmount * (1 - restorationAmount * 0.9)

            props.camera.position.x = 100 - 80 * restorationAmount + chaosX
            props.camera.position.y = 50 - 40 * restorationAmount + chaosY
            props.camera.position.z = 100 - 80 * restorationAmount + chaosZ

            // 减少的相机混乱旋转
            cameraRotation.value.x = (Math.random() - 0.5) * 0.2 * chaosAmount * (1 - restorationAmount * 0.9)
            cameraRotation.value.y = (Math.random() - 0.5) * 0.2 * chaosAmount * (1 - restorationAmount * 0.9)
            cameraRotation.value.z = (Math.random() - 0.5) * 0.1 * chaosAmount * (1 - restorationAmount * 0.9)

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '维度重组错误'
      )
    }, 3)

    // 动画阶段5: 最终稳定
    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV最终稳定错误'
      )
    }, 5)

    tl.to(collapse, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(chaos, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.rotation.set(0, 0, 0)
            props.camera.lookAt(props.controls.target)
          },
          '最终稳定位置错误'
      )
    }, 5)

    // 动画阶段6: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 5.5)

  } catch (error) {
    onAnimationError(error, '维度崩溃')
  }
}

/**
 * 新增：时空逆流动画
 */
const animateTimeRewind = () => {
  try {
    // 初始设置：从远处观察
    setupInitialCameraState(new THREE.Vector3(1200, 800, 1200))

    // 暂时禁用用户交互
    if (props.controls) {
      props.controls.target.set(0, 0, 0)
      props.controls.enabled = false
    }

    // 创建辅助变量
    const rewind = { value: 0 }
    const reverse = { value: 0 }
    const causality = { value: 1 }
    const restore = { value: 0 }
    const temporalSpeed = { value: 1 }

    // 创建时间线上的关键点（从未来到过去）
    const timePoints = [
      { position: new THREE.Vector3(1000, 700, 1000), time: 100 },   // 未来
      { position: new THREE.Vector3(700, 500, 700), time: 50 },      // 近未来
      { position: new THREE.Vector3(400, 300, 400), time: 0 },       // 现在
      { position: new THREE.Vector3(200, 150, 200), time: -50 },     // 近过去
      { position: new THREE.Vector3(50, 30, 50), time: -100 }         // 远过去
    ]

    const tl = createTimeline(
        () => onAnimationComplete(),
        (error) => onAnimationError(error, '时空逆流'),
        '时空逆流'
    )

    // 动画阶段1: 接近现在
    tl.to(props.camera.position, {
      x: 1000,
      y: 700,
      z: 1000,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => props.camera.lookAt(props.controls.target),
          '相机位置更新错误'
      )
    })

    // 动画阶段2: 开始时间倒流
    tl.to(rewind, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 0.8)

    tl.to(temporalSpeed, {
      value: -1,
      duration: 1,
      ease: 'power2.inOut'
    }, 0.8)

    tl.to(props.camera.position, {
      x: 700,
      y: 500,
      z: 700,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const rewindAmount = rewind.value
            const speedAmount = temporalSpeed.value

            // 时间逆流效果
            const reverseX = Math.sin(time * 5 * Math.abs(speedAmount)) * 10 * rewindAmount
            const reverseY = Math.cos(time * 4 * Math.abs(speedAmount)) * 8 * rewindAmount
            const reverseZ = Math.sin(time * 6 * Math.abs(speedAmount)) * 10 * rewindAmount

            props.camera.position.x += reverseX
            props.camera.position.y += reverseY
            props.camera.position.z += reverseZ

            // 相机轻微旋转
            cameraRotation.value.x = Math.sin(time * 3 * Math.abs(speedAmount)) * 0.1 * rewindAmount
            cameraRotation.value.y = Math.cos(time * 2 * Math.abs(speedAmount)) * 0.1 * rewindAmount
            cameraRotation.value.z = Math.sin(time * 4 * Math.abs(speedAmount)) * 0.05 * rewindAmount

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '时间逆流错误'
      )
    }, 0.8)

    // 动画阶段3: 快速时间倒流
    tl.to(reverse, {
      value: 1,
      duration: 2,
      ease: 'power4.inOut'
    }, 1.5)

    tl.to(temporalSpeed, {
      value: -3,
      duration: 2,
      ease: 'power4.inOut'
    }, 1.5)

    // 在时间线上逆流（从未来到过去）
    for (let i = 0; i < timePoints.length - 1; i++) {
      const startPoint = timePoints[i]
      const endPoint = timePoints[i + 1]

      tl.to(props.camera.position, {
        x: endPoint.x,
        y: endPoint.y,
        z: endPoint.z,
        duration: 0.5,
        ease: 'power1.inOut',
        onUpdate: () => safeCameraTransform(
            () => {
              const time = tl.time()
              const reverseAmount = reverse.value
              const speedAmount = temporalSpeed.value
              const causalityAmount = causality.value

              // 时间逆流增强效果
              const reverseX = Math.sin(time * 10 * Math.abs(speedAmount)) * 15 * reverseAmount
              const reverseY = Math.cos(time * 8 * Math.abs(speedAmount)) * 12 * reverseAmount
              const reverseZ = Math.sin(time * 12 * Math.abs(speedAmount)) * 15 * reverseAmount

              props.camera.position.x += reverseX * causalityAmount
              props.camera.position.y += reverseY * causalityAmount
              props.camera.position.z += reverseZ * causalityAmount

              // 因果律混乱效果
              const causalityX = (Math.random() - 0.5) * 20 * reverseAmount * (1 - causalityAmount)
              const causalityY = (Math.random() - 0.5) * 20 * reverseAmount * (1 - causalityAmount)
              const causalityZ = (Math.random() - 0.5) * 20 * reverseAmount * (1 - causalityAmount)

              props.camera.position.x += causalityX
              props.camera.position.y += causalityY
              props.camera.position.z += causalityZ

              // 相机旋转混乱
              cameraRotation.value.x = Math.sin(time * 5 * Math.abs(speedAmount)) * 0.2 * reverseAmount
              cameraRotation.value.y = Math.cos(time * 4 * Math.abs(speedAmount)) * 0.2 * reverseAmount
              cameraRotation.value.z = Math.sin(time * 6 * Math.abs(speedAmount)) * 0.1 * reverseAmount

              props.camera.rotation.set(
                  cameraRotation.value.x,
                  cameraRotation.value.y,
                  cameraRotation.value.z
              )

              props.camera.lookAt(props.controls.target)
            },
            '时间逆流增强错误'
        )
      }, 1.8 + i * 0.5)

      // 视觉冲击效果
      tl.to(props.renderer.domElement, {
        opacity: 0.8,
        duration: 0.1,
        ease: 'none'
      }, 2 + i * 0.5)

      tl.to(props.renderer.domElement, {
        opacity: 1,
        duration: 0.1,
        ease: 'none'
      }, 2.1 + i * 0.5)
    }

    // 动画阶段4: 因果律恢复
    tl.to(restore, {
      value: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 4)

    tl.to(causality, {
      value: 0.3,
      duration: 1.5,
      ease: 'power2.out'
    }, 4)

    tl.to(temporalSpeed, {
      value: -0.5,
      duration: 1.5,
      ease: 'power2.out'
    }, 4)

    tl.to(props.camera.position, {
      x: 20,
      y: 15,
      z: 20,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const reverseAmount = reverse.value
            const speedAmount = temporalSpeed.value
            const causalityAmount = causality.value
            const restoreAmount = restore.value

            // 减少的时间逆流效果
            const reverseX = Math.sin(time * 5 * Math.abs(speedAmount)) * 5 * reverseAmount * (1 - restoreAmount * 0.9)
            const reverseY = Math.cos(time * 4 * Math.abs(speedAmount)) * 4 * reverseAmount * (1 - restoreAmount * 0.9)
            const reverseZ = Math.sin(time * 6 * Math.abs(speedAmount)) * 5 * reverseAmount * (1 - restoreAmount * 0.9)

            props.camera.position.x += reverseX * causalityAmount
            props.camera.position.y += reverseY * causalityAmount
            props.camera.position.z += reverseZ * causalityAmount

            // 减少的相机旋转
            cameraRotation.value.x = Math.sin(time * 3 * Math.abs(speedAmount)) * 0.05 * reverseAmount * (1 - restoreAmount * 0.9)
            cameraRotation.value.y = Math.cos(time * 2 * Math.abs(speedAmount)) * 0.05 * reverseAmount * (1 - restoreAmount * 0.9)
            cameraRotation.value.z = Math.sin(time * 4 * Math.abs(speedAmount)) * 0.02 * reverseAmount * (1 - restoreAmount * 0.9)

            props.camera.rotation.set(
                cameraRotation.value.x,
                cameraRotation.value.y,
                cameraRotation.value.z
            )

            props.camera.lookAt(props.controls.target)
          },
          '因果律恢复错误'
      )
    }, 4)

    // 动画阶段5: 时间恢复正流
    tl.to(temporalSpeed, {
      value: 0.5,
      duration: 0.5,
      ease: 'power1.out'
    }, 5.5)

    tl.to(props.camera, {
      fov: ANIMATION_CONFIG.FINAL_FOV,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => props.camera.updateProjectionMatrix(),
          'FOV时间恢复正流错误'
      )
    }, 5.5)

    tl.to(reverse, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5.5)

    tl.to(restore, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5.5)

    tl.to(props.camera.position, {
      x: ANIMATION_CONFIG.FINAL_POSITION.x,
      y: ANIMATION_CONFIG.FINAL_POSITION.y,
      z: ANIMATION_CONFIG.FINAL_POSITION.z,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
          () => {
            props.camera.rotation.set(0, 0, 0)
            props.camera.lookAt(props.controls.target)
          },
          '时间恢复正流位置错误'
      )
    }, 5.5)

    // 动画阶段6: 平滑旋转到最终视角
    tl.to(cameraRotation.value, {
      x: 0,
      y: ANIMATION_CONFIG.FINAL_THETA,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        safeCameraTransform(
            () => {
              const spherical = new THREE.Spherical()
              spherical.radius = 0.01
              spherical.theta = cameraRotation.value.y
              spherical.phi = ANIMATION_CONFIG.FINAL_PHI

              props.camera.position.setFromSpherical(spherical)
              props.camera.lookAt(props.controls.target)
            },
            '最终视角旋转错误'
        )
      }
    }, 6)

    // 动画阶段7: 视觉冲击效果 - 闪烁
    for (let i = 0; i < 3; i++) {
      tl.to(props.renderer.domElement, {
        opacity: 0.8,
        duration: 0.1,
        ease: 'none'
      }, 2.5 + i)

      tl.to(props.renderer.domElement, {
        opacity: 0.4,
        duration: 0.1,
        ease: 'none'
      }, 2.6 + i)

      tl.to(props.renderer.domElement, {
        opacity: 1,
        duration: 0.1,
        ease: 'none'
      }, 2.7 + i)
    }

  } catch (error) {
    onAnimationError(error, '时空逆流')
  }
}










/**
 * 动画函数映射
 */


const animationFunctions = {
  [ANIMATION_CONFIG.EPIC_DIVE]: animateEpicDive,
  [ANIMATION_CONFIG.SPACE_WARP]: animateSpaceWarp,
  [ANIMATION_CONFIG.MATRIX_HACK]: animateMatrixHack,
  [ANIMATION_CONFIG.QUANTUM_SHIFT]: animateQuantumShift,
  // 之前新增的动画映射
  [ANIMATION_CONFIG.DIMENSION_FOLD]: animateDimensionFold,
  [ANIMATION_CONFIG.ENERGY_WAVE]: animateEnergyWave,
  [ANIMATION_CONFIG.DIZZY_CAM]: animateDizzyCam,
  [ANIMATION_CONFIG.HYPERSPACE]: animateHyperspace,
  // 最新新增的动画映射
  [ANIMATION_CONFIG.TIME_RIFT]: animateTimeRift,
  [ANIMATION_CONFIG.PLANET_EXPLOSION]: animatePlanetExplosion,
  [ANIMATION_CONFIG.QUANTUM_ENTANGLEMENT]: animateQuantumEntanglement,
  [ANIMATION_CONFIG.VIRTUAL_REALITY]: animateVirtualReality,
  // 游走和环游动画映射
  [ANIMATION_CONFIG.SCENE_ROAMING]: animateSceneRoaming,
  [ANIMATION_CONFIG.ORBITAL_ROTATION]: animateOrbitalRotation,
  [ANIMATION_CONFIG.DIMENSIONAL_PORTAL]: animateDimensionalPortal,
  [ANIMATION_CONFIG.TIME_TRAVEL]: animateTimeTravel,
  // 新增的炸裂动画映射
  [ANIMATION_CONFIG.BLACK_HOLE]: animateBlackHole,
  [ANIMATION_CONFIG.COSMIC_BIG_BANG]: animateCosmicBigBang,
  [ANIMATION_CONFIG.DIMENSION_COLLAPSE]: animateDimensionCollapse,
  [ANIMATION_CONFIG.TIME_REWIND]: animateTimeRewind
}


/**
 * 启动动画
 */
const startAnimation = () => {
  if (!props.camera || !props.controls) {
    console.error(ERROR_MESSAGES.NO_CAMERA, ERROR_MESSAGES.NO_CONTROLS)
    return
  }

  // 确保目标点在球心
  props.controls.target.set(0, 0, 0)

  // 根据动画类型执行相应的动画函数
  const animationFn = animationFunctions[animationType.value]
  if (animationFn) {
    animationFn()
  } else {
    // 默认使用史诗俯冲动画
    animateEpicDive()
  }
}

/**
 * 重置动画
 */
const resetAnimation = () => {
  cleanup()
  animationComplete.value = false
  setTimeout(() => {
    startAnimation()
  }, 100)
}

/**
 * 动画进入默认视角 - 添加此方法以解决home.vue中的调用错误
 */
const animateToDefaultView = () => {
  if (!props.isLoading && !animationComplete.value) {
    startAnimation()
  }
}

/**
 * 暴露给父组件的方法和状态
 */
defineExpose({
  animationType,
  animationComplete,
  resetAnimation,
  startAnimation,
  animateToDefaultView, // 添加此方法以解决home.vue中的调用错误
  getParticleStyle,
  cleanup
})
</script>

<style scoped lang="scss">
/* 电影级开场效果 - 使用BEM命名规范 */
.cinematic-intro {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  pointer-events: none;

  &__fade-out {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    animation: fadeOut 2s ease-out forwards;
  }

  &__title-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    animation: titleCard 3s ease-out forwards;
    z-index: 10;
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  &__title {
    font-size: 4rem;
    font-weight: 100;
    letter-spacing: 8px;
    margin: 0 0 10px 0;
    text-transform: uppercase;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    transform: translateZ(20px);
    font-family: 'Orbitron', 'Arial', sans-serif;
    position: relative;

    &::before {
      content: "ZOOOW";
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      color: rgba(100, 200, 255, 0.5);
      filter: blur(8px);
      transform: scale(1.05);
      animation: glowPulse 2s infinite alternate;
    }

    &::after {
      content: "ZOOOW";
      position: absolute;
      left: 2px;
      top: 2px;
      z-index: -2;
      color: rgba(0, 100, 255, 0.3);
      transform: translateZ(-5px);
    }

    text-stroke: 1px rgba(100, 200, 255, 0.3);
    -webkit-text-stroke: 1px rgba(100, 200, 255, 0.3);
  }

  &__subtitle {
    font-size: 1rem;
    letter-spacing: 4px;
    margin: 0;
    opacity: 0.8;
    text-transform: uppercase;
    transform: translateZ(10px);
    font-family: 'Orbitron', 'Arial', sans-serif;
    overflow: hidden;
    white-space: nowrap;
    animation: typing 3s steps(30) forwards;
    max-width: 0;
    margin: 0 auto;
  }

  &__particles-container {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    pointer-events: none;
    z-index: -1;
  }

  &__particle {
    position: absolute;
    background: rgba(100, 200, 255, 0.8);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(100, 200, 255, 0.8);
    animation: float 3s infinite ease-in-out;
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
            rgba(100, 200, 255, 0.03) 2px,
            rgba(100, 200, 255, 0.03) 4px
    );
    pointer-events: none;
    z-index: 1;
  }

  &__lens-flare {
    position: absolute;
    top: 20%;
    left: 30%;
    width: 40px;
    height: 40px;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(100,200,255,0.4) 40%, transparent 70%);
    border-radius: 50%;
    filter: blur(2px);
    opacity: 0;
    animation: flare 2s ease-out forwards;
    z-index: 2;
  }

  &__dynamic-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__speed-lines {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            0deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 45%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.03) 55%,
            transparent 100%
    );
    opacity: 0;
    animation: speedLinesFlash 8s ease-in-out forwards;
  }

  &__vignette {
    position: absolute;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 300px rgba(0, 0, 0, 0);
    animation: vignetteAppear 8s ease-in-out forwards;
  }

  &__motion-blur {
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(0px);
    animation: motionBlurEffect 8s ease-in-out forwards;
  }

  // 新增：维度折叠效果
  &__dimension-fold-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__fold-lines {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.05) 10px,
            rgba(255, 255, 255, 0.05) 20px
    );
    opacity: 0;
    animation: foldLinesFlash 7s ease-in-out forwards;
  }

  &__dimension-shift {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            45deg,
            rgba(100, 0, 255, 0) 0%,
            rgba(100, 0, 255, 0.1) 50%,
            rgba(0, 255, 255, 0) 100%
    );
    opacity: 0;
    animation: dimensionShiftEffect 7s ease-in-out forwards;
  }

  &__reality-glitch {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            90deg,
            rgba(255, 0, 255, 0) 0%,
            rgba(255, 0, 255, 0.05) 50%,
            rgba(255, 0, 255, 0) 100%
    );
    opacity: 0;
    animation: realityGlitchEffect 7s ease-in-out forwards;
  }

  // 新增：能量波效果
  &__energy-wave-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__energy-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 10px solid transparent;
    border-radius: 50%;
    box-shadow: 0 0 100px rgba(0, 255, 255, 0.5);
    animation: energyRingExpand 6s ease-out forwards;
  }

  &__shockwave {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(0, 255, 255, 0.8) 0%,
            rgba(0, 255, 255, 0.5) 10%,
            rgba(0, 255, 255, 0.2) 30%,
            transparent 70%
    );
    opacity: 0;
    animation: shockwaveExpand 6s ease-out forwards;
  }

  &__energy-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: energyParticlesAppear 6s ease-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(0, 255, 255, 0.8);
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
    }

    &::before {
      top: 30%;
      left: 20%;
      animation: particleFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 60%;
      right: 25%;
      animation: particleFloat2 2.5s infinite ease-in-out;
    }
  }

  // 新增：眩晕相机效果
  &__dizzy-cam-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__spinning-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(255, 0, 0, 0.1) 90deg,
            transparent 180deg,
            rgba(0, 0, 255, 0.1) 270deg,
            transparent 360deg
    );
    opacity: 0;
    animation: spinningOverlayEffect 5s ease-in-out forwards;
  }

  &__color-shift {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            45deg,
            rgba(255, 0, 0, 0.1) 0%,
            rgba(0, 255, 0, 0.1) 25%,
            rgba(0, 0, 255, 0.1) 50%,
            rgba(255, 255, 0, 0.1) 75%,
            rgba(255, 0, 255, 0.1) 100%
    );
    opacity: 0;
    animation: colorShiftEffect 5s ease-in-out forwards;
  }

  &__motion-trail {
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(0px);
    animation: motionTrailEffect 5s ease-in-out forwards;
  }

  // 新增：超空间跳跃效果
  &__hyperspace-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__star-stretch {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0px,
            rgba(255, 255, 255, 0.1) 1px,
            rgba(255, 255, 255, 0) 2px,
            rgba(255, 255, 255, 0) 10px
    );
    opacity: 0;
    animation: starStretchEffect 5s ease-in-out forwards;
  }

  &__tunnel-vision {
    position: absolute;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);
    animation: tunnelVisionEffect 5s ease-in-out forwards;
  }

  &__light-burst {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.8) 5%,
            rgba(255, 255, 255, 0.5) 10%,
            rgba(255, 255, 255, 0.2) 20%,
            transparent 40%
    );
    opacity: 0;
    animation: lightBurstEffect 5s ease-in-out forwards;
  }

  // 动画类型变体
  &--space-warp &__title {
    animation: titleGlitch 0.5s infinite;
  }

  &--matrix-hack {
    .cinematic-intro__title {
      color: #0f0;
      text-shadow: 0 0 10px #0f0;

      &::before {
        color: rgba(0, 255, 0, 0.5);
        animation: matrixGlow 1s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #0f0;
    }
  }

  &--quantum-shift &__particle {
    animation: quantumFloat 1s infinite ease-in-out;
  }

  &--quantum-shift &__title {
    animation: titleFlicker 0.2s infinite;
  }

  &--epic-dive &__title {
    animation: titleShake 8s ease-in-out forwards;
  }

  // 新增动画类型变体
  &--dimension-fold {
    .cinematic-intro__title {
      color: #f0f;
      text-shadow: 0 0 10px #f0f;

      &::before {
        color: rgba(255, 0, 255, 0.5);
        animation: dimensionGlow 1s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #f0f;
    }
  }

  &--energy-wave {
    .cinematic-intro__title {
      color: #0ff;
      text-shadow: 0 0 10px #0ff;

      &::before {
        color: rgba(0, 255, 255, 0.5);
        animation: energyGlow 0.8s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #0ff;
    }
  }

  &--dizzy-cam {
    .cinematic-intro__title {
      animation: dizzyTitleSpin 0.5s infinite;
    }
  }

  &--hyperspace {
    .cinematic-intro__title {
      animation: hyperspaceTitleStretch 0.8s ease-in-out forwards;
    }
  }




  // 新增：时空裂缝效果
  &__time-rift-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__rift-cracks {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 5px,
            rgba(255, 0, 255, 0.1) 5px,
            rgba(255, 0, 255, 0.1) 10px
    );
    opacity: 0;
    animation: riftCracksAppear 6s ease-in-out forwards;
  }

  &__time-fragments {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: timeFragmentsEffect 6s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background: rgba(255, 0, 255, 0.7);
      box-shadow: 0 0 10px rgba(255, 0, 255, 0.8);
    }

    &::before {
      top: 25%;
      left: 30%;
      animation: fragmentFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 65%;
      right: 35%;
      animation: fragmentFloat2 2.5s infinite ease-in-out;
    }
  }

  &__reality-reassemble {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            90deg,
            rgba(255, 0, 255, 0) 0%,
            rgba(255, 0, 255, 0.1) 50%,
            rgba(255, 0, 255, 0) 100%
    );
    opacity: 0;
    animation: realityReassembleEffect 6s ease-in-out forwards;
  }

  // 新增：星球爆炸效果
  &__planet-explosion-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__explosion-core {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(255, 100, 0, 0.8) 0%,
            rgba(255, 200, 0, 0.5) 10%,
            rgba(255, 255, 0, 0.2) 30%,
            transparent 70%
    );
    opacity: 0;
    animation: explosionCoreEffect 5s ease-in-out forwards;
  }

  &__debris-field {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: debrisFieldEffect 5s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 150, 0, 0.7);
      box-shadow: 0 0 10px rgba(255, 150, 0, 0.8);
    }

    &::before {
      top: 30%;
      left: 20%;
      animation: debrisFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 60%;
      right: 25%;
      animation: debrisFloat2 2.5s infinite ease-in-out;
    }
  }

  &__shockwave-sphere {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(255, 200, 0, 0) 0%,
            rgba(255, 200, 0, 0.2) 20%,
            rgba(255, 200, 0, 0.1) 40%,
            transparent 70%
    );
    opacity: 0;
    animation: shockwaveSphereEffect 5s ease-in-out forwards;
  }

  // 新增：量子纠缠效果
  &__quantum-entanglement-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__parallel-worlds {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: parallelWorldsEffect 6s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 50%;
      height: 50%;
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid rgba(0, 255, 255, 0.3);
    }

    &::before {
      top: 10%;
      left: 10%;
      animation: parallelFloat1 3s infinite ease-in-out;
    }

    &::after {
      bottom: 10%;
      right: 10%;
      animation: parallelFloat2 3.5s infinite ease-in-out;
    }
  }

  &__quantum-bridge {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: quantumBridgeEffect 6s ease-in-out forwards;
  }

  &__reality-merge {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(0, 255, 255, 0.2) 0%,
            rgba(0, 255, 255, 0.1) 20%,
            rgba(0, 255, 255, 0.05) 40%,
            transparent 70%
    );
    opacity: 0;
    animation: realityMergeEffect 6s ease-in-out forwards;
  }

  // 新增：虚拟现实效果
  &__virtual-reality-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__pixelation {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(45deg, rgba(0, 255, 0, 0.05) 25%, transparent 25%, transparent 75%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05)),
    linear-gradient(-45deg, rgba(0, 255, 0, 0.05) 25%, transparent 25%, transparent 75%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05));
    background-size: 20px 20px;
    opacity: 0;
    animation: pixelationEffect 6s ease-in-out forwards;
  }

  &__digital-noise {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(0, 255, 0, 0.1) 1px,
            rgba(0, 255, 0, 0.1) 2px
    );
    opacity: 0;
    animation: digitalNoiseEffect 6s ease-in-out forwards;
  }

  &__reality-materialize {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: realityMaterializeEffect 6s ease-in-out forwards;
  }

  // 新增动画类型变体
  &--time-rift {
    .cinematic-intro__title {
      color: #f0f;
      text-shadow: 0 0 10px #f0f;

      &::before {
        color: rgba(255, 0, 255, 0.5);
        animation: timeRiftGlow 0.8s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #f0f;
    }
  }

  &--planet-explosion {
    .cinematic-intro__title {
      color: #f50;
      text-shadow: 0 0 10px #f50;

      &::before {
        color: rgba(255, 100, 0, 0.5);
        animation: explosionGlow 0.7s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #f50;
    }
  }

  &--quantum-entanglement {
    .cinematic-intro__title {
      color: #0ff;
      text-shadow: 0 0 10px #0ff;

      &::before {
        color: rgba(0, 255, 255, 0.5);
        animation: entanglementGlow 0.6s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #0ff;
    }
  }

  &--virtual-reality {
    .cinematic-intro__title {
      color: #0f0;
      text-shadow: 0 0 10px #0f0;

      &::before {
        color: rgba(0, 255, 0, 0.5);
        animation: virtualRealityGlow 0.9s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #0f0;
    }
  }





  // 新增：场景漫游效果
  &__scene-roaming-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__viewfinder {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 20px solid transparent;
    opacity: 0;
    animation: viewfinderEffect 7s ease-in-out forwards;
  }

  &__path-indicator {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(100, 200, 255, 0.1) 25%,
            transparent 50%,
            rgba(100, 200, 255, 0.1) 75%,
            transparent 100%
    );
    opacity: 0;
    animation: pathIndicatorEffect 7s ease-in-out forwards;
  }

  &__scene-transition {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: sceneTransitionEffect 7s ease-in-out forwards;
  }

  // 新增：轨道环绕效果
  &__orbital-rotation-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__orbit-path {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px dashed rgba(100, 200, 255, 0.3);
    opacity: 0;
    animation: orbitPathEffect 6s ease-in-out forwards;
  }

  &__gravity-well {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(100, 200, 255, 0) 0%,
            rgba(100, 200, 255, 0.2) 20%,
            rgba(100, 200, 255, 0.1) 40%,
            transparent 70%
    );
    opacity: 0;
    animation: gravityWellEffect 6s ease-in-out forwards;
  }

  &__ascending-spiral {
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(100, 200, 255, 0.1) 90deg,
            transparent 180deg,
            rgba(100, 200, 255, 0.1) 270deg,
            transparent 360deg
    );
    opacity: 0;
    animation: ascendingSpiralEffect 6s ease-in-out forwards;
  }

  // 新增：维度传送门效果
  &__dimensional-portal-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__portal-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 10px solid transparent;
    opacity: 0;
    animation: portalRingEffect 9s ease-in-out forwards;
  }

  &__dimension-shift {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            45deg,
            rgba(0, 255, 255, 0) 0%,
            rgba(0, 255, 255, 0.2) 50%,
            rgba(0, 255, 255, 0) 100%
    );
    opacity: 0;
    animation: dimensionShiftEffect 9s ease-in-out forwards;
  }

  &__portal-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: portalParticlesEffect 9s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(0, 255, 255, 0.8);
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
    }

    &::before {
      top: 25%;
      left: 30%;
      animation: portalParticleFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 65%;
      right: 35%;
      animation: portalParticleFloat2 2.5s infinite ease-in-out;
    }
  }

  // 新增：时空穿梭效果
  &__time-travel-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__time-ripples {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: timeRipplesEffect 6s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid rgba(136, 68, 255, 0.5);
    }

    &::before {
      animation: rippleExpand1 3s infinite ease-out;
    }

    &::after {
      animation: rippleExpand2 3s infinite ease-out;
      animation-delay: 1.5s;
    }
  }

  &__past-future-shift {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            90deg,
            rgba(136, 68, 255, 0.2) 0%,
            rgba(255, 255, 255, 0) 50%,
            rgba(68, 136, 255, 0.2) 100%
    );
    opacity: 0;
    animation: pastFutureShiftEffect 6s ease-in-out forwards;
  }

  &__temporal-distortion {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(136, 68, 255, 0.1) 2px,
            rgba(136, 68, 255, 0.1) 4px
    );
    opacity: 0;
    animation: temporalDistortionEffect 6s ease-in-out forwards;
  }

  // 新增动画类型变体
  &--scene-roaming {
    .cinematic-intro__title {
      color: #64b5f6;
      text-shadow: 0 0 10px #64b5f6;

      &::before {
        color: rgba(100, 181, 246, 0.5);
        animation: roamingGlow 1s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #64b5f6;
    }
  }

  &--orbital-rotation {
    .cinematic-intro__title {
      color: #7b1fa2;
      text-shadow: 0 0 10px #7b1fa2;

      &::before {
        color: rgba(123, 31, 162, 0.5);
        animation: orbitalGlow 0.8s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #7b1fa2;
    }
  }

  &--dimensional-portal {
    .cinematic-intro__title {
      color: #00bcd4;
      text-shadow: 0 0 10px #00bcd4;

      &::before {
        color: rgba(0, 188, 212, 0.5);
        animation: portalGlow 0.6s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #00bcd4;
    }
  }

  &--time-travel {
    .cinematic-intro__title {
      color: #8844ff;
      text-shadow: 0 0 10px #8844ff;

      &::before {
        color: rgba(136, 68, 255, 0.5);
        animation: timeGlow 0.9s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #8844ff;
    }
  }




  // 新增：黑洞吞噬效果
  &__black-hole-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__event-horizon {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.8) 10%,
            rgba(0, 0, 0, 0.5) 20%,
            rgba(0, 0, 0, 0.2) 30%,
            transparent 50%
    );
    opacity: 0;
    animation: eventHorizonEffect 6s ease-in-out forwards;
  }

  &__accretion-disk {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 20px solid transparent;
    opacity: 0;
    animation: accretionDiskEffect 6s ease-in-out forwards;
  }

  &__gravitational-lensing {
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(255, 100, 0, 0.1) 90deg,
            transparent 180deg,
            rgba(255, 100, 0, 0.1) 270deg,
            transparent 360deg
    );
    opacity: 0;
    animation: gravitationalLensingEffect 6s ease-in-out forwards;
  }

  // 新增：宇宙大爆炸效果
  &__cosmic-big-bang-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__singularity {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.8) 5%,
            rgba(255, 200, 100, 0.5) 10%,
            rgba(255, 150, 50, 0.2) 20%,
            transparent 40%
    );
    opacity: 0;
    animation: singularityEffect 6s ease-in-out forwards;
  }

  &__explosion-wave {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 20%,
            rgba(255, 200, 100, 0.5) 40%,
            rgba(255, 150, 50, 0.2) 60%,
            transparent 80%
    );
    opacity: 0;
    animation: explosionWaveEffect 6s ease-in-out forwards;
  }

  &__universe-formation {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
            circle at center,
            rgba(0, 0, 50, 0.2) 0%,
            rgba(0, 0, 100, 0.1) 30%,
            rgba(0, 50, 200, 0.05) 60%,
            transparent 90%
    );
    opacity: 0;
    animation: universeFormationEffect 6s ease-in-out forwards;
  }

  // 新增：维度崩溃效果
  &__dimension-collapse-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__reality-fracture {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 5px,
            rgba(255, 0, 0, 0.1) 5px,
            rgba(255, 0, 0, 0.1) 10px
    );
    opacity: 0;
    animation: realityFractureEffect 6s ease-in-out forwards;
  }

  &__dimensional-shards {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: dimensionalShardsEffect 6s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
      background: rgba(255, 0, 0, 0.7);
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
    }

    &::before {
      top: 20%;
      left: 30%;
      animation: shardFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 60%;
      right: 25%;
      animation: shardFloat2 2.5s infinite ease-in-out;
    }
  }

  &__chaos-vortex {
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(255, 0, 0, 0.1) 90deg,
            transparent 180deg,
            rgba(255, 0, 0, 0.1) 270deg,
            transparent 360deg
    );
    opacity: 0;
    animation: chaosVortexEffect 6s ease-in-out forwards;
  }

  // 新增：时空逆流效果
  &__time-rewind-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }

  &__reverse-flow {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 10px,
            rgba(136, 68, 255, 0.1) 10px,
            rgba(136, 68, 255, 0.1) 20px
    );
    opacity: 0;
    animation: reverseFlowEffect 6s ease-in-out forwards;
  }

  &__temporal-fragments {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: temporalFragmentsEffect 6s ease-in-out forwards;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 25px;
      height: 25px;
      background: rgba(136, 68, 255, 0.7);
      box-shadow: 0 0 10px rgba(136, 68, 255, 0.8);
    }

    &::before {
      top: 30%;
      left: 20%;
      animation: temporalFloat1 2s infinite ease-in-out;
    }

    &::after {
      top: 65%;
      right: 25%;
      animation: temporalFloat2 2.5s infinite ease-in-out;
    }
  }

  &__causality-loop {
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 5px,
            rgba(136, 68, 255, 0.05) 5px,
            rgba(136, 68, 255, 0.05) 10px
    );
    opacity: 0;
    animation: causalityLoopEffect 6s ease-in-out forwards;
  }

  // 新增动画类型变体
  &--black-hole {
    .cinematic-intro__title {
      color: #f50;
      text-shadow: 0 0 10px #f50;

      &::before {
        color: rgba(255, 50, 0, 0.5);
        animation: blackHoleGlow 0.7s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #f50;
    }
  }

  &--cosmic-big-bang {
    .cinematic-intro__title {
      color: #fff;
      text-shadow: 0 0 10px #fff;

      &::before {
        color: rgba(255, 255, 255, 0.5);
        animation: bigBangGlow 0.8s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #fff;
    }
  }

  &--dimension-collapse {
    .cinematic-intro__title {
      color: #f00;
      text-shadow: 0 0 10px #f00;

      &::before {
        color: rgba(255, 0, 0, 0.5);
        animation: collapseGlow 0.6s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #f00;
    }
  }

  &--time-rewind {
    .cinematic-intro__title {
      color: #88f;
      text-shadow: 0 0 10px #88f;

      &::before {
        color: rgba(136, 136, 255, 0.5);
        animation: rewindGlow 0.9s infinite alternate;
      }
    }

    .cinematic-intro__subtitle {
      color: #88f;
    }
  }




}

// 原有动画定义
@keyframes fadeOut {
  0% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0; visibility: hidden; }
}

@keyframes titleCard {
  0% {
    opacity: 0;
    transform: translate(-50%, -40%);
    filter: blur(10px);
  }
  30% {
    opacity: 1;
    transform: translate(-50%, -50%);
    filter: blur(0px);
  }
  70% {
    opacity: 1;
    transform: translate(-50%, -50%);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -60%);
    filter: blur(5px);
  }
}

@keyframes glowPulse {
  0% {
    filter: blur(8px);
    opacity: 0.5;
  }
  100% {
    filter: blur(12px);
    opacity: 0.8;
  }
}

@keyframes typing {
  0% { max-width: 0; }
  70% { max-width: 100%; }
  100% { max-width: 100%; }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(0, -20px) scale(1.2);
    opacity: 1;
  }
}

@keyframes quantumFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  50% {
    transform: translate(0, -30px) scale(1.5);
    opacity: 1;
  }
}

@keyframes titleGlitch {
  0%, 100% { transform: translateZ(20px); }
  20% { transform: translateX(-5px) translateZ(20px); }
  40% { transform: translateX(5px) translateZ(20px); }
}

@keyframes matrixGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(10px);
    opacity: 0.7;
  }
}

@keyframes titleFlicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes titleShake {
  0%, 20% { transform: translateZ(20px); }
  40%, 45% { transform: translateZ(20px) translateX(2px); }
  50%, 55% { transform: translateZ(20px) translateX(-2px); }
  60% { transform: translateZ(20px) translateX(1px); }
  70% { transform: translateZ(20px); }
  100% { transform: translateZ(20px) translateY(-10px); }
}

@keyframes flare {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
}

@keyframes speedLinesFlash {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.6; }
  70% { opacity: 0.4; }
  90% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes vignetteAppear {
  0% { box-shadow: inset 0 0 0 rgba(0, 0, 0, 0); }
  20% { box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.3); }
  60% { box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.5); }
  100% { box-shadow: inset 0 0 0 rgba(0, 0, 0, 0); }
}

@keyframes motionBlurEffect {
  0% { backdrop-filter: blur(0px); }
  20% { backdrop-filter: blur(0px); }
  50% { backdrop-filter: blur(2px); }
  70% { backdrop-filter: blur(1px); }
  100% { backdrop-filter: blur(0px); }
}

// 新增动画定义：维度折叠效果
@keyframes foldLinesFlash {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes dimensionShiftEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.7; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

@keyframes realityGlitchEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.6; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

// 新增动画定义：能量波效果
@keyframes energyRingExpand {
  0% {
    transform: scale(0.1);
    opacity: 1;
  }
  20% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  50% {
    transform: scale(2);
    opacity: 0.4;
  }
  80% {
    transform: scale(5);
    opacity: 0.1;
  }
  100% {
    transform: scale(10);
    opacity: 0;
  }
}

@keyframes shockwaveExpand {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  20% {
    opacity: 0.8;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.4;
    transform: scale(2);
  }
  80% {
    opacity: 0.1;
    transform: scale(5);
  }
  100% {
    opacity: 0;
    transform: scale(10);
  }
}

@keyframes energyParticlesAppear {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes particleFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -30px);
  }
}

@keyframes particleFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-25px, -20px);
  }
}

// 新增动画定义：眩晕相机效果
@keyframes spinningOverlayEffect {
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  20% {
    opacity: 0;
    transform: rotate(0deg);
  }
  40% {
    opacity: 0.8;
    transform: rotate(360deg);
  }
  60% {
    opacity: 0.4;
    transform: rotate(720deg);
  }
  80% {
    opacity: 0.2;
    transform: rotate(1080deg);
  }
  100% {
    opacity: 0;
    transform: rotate(1440deg);
  }
}

@keyframes colorShiftEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.7; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

@keyframes motionTrailEffect {
  0% { backdrop-filter: blur(0px); }
  20% { backdrop-filter: blur(0px); }
  40% { backdrop-filter: blur(2px); }
  60% { backdrop-filter: blur(1px); }
  80% { backdrop-filter: blur(0.5px); }
  100% { backdrop-filter: blur(0px); }
}

// 新增动画定义：超空间跳跃效果
@keyframes starStretchEffect {
  0% {
    opacity: 0;
    background-size: 10px 100%;
  }
  20% {
    opacity: 0;
    background-size: 10px 100%;
  }
  40% {
    opacity: 0.8;
    background-size: 1px 100%;
  }
  60% {
    opacity: 0.4;
    background-size: 5px 100%;
  }
  80% {
    opacity: 0.1;
    background-size: 20px 100%;
  }
  100% {
    opacity: 0;
    background-size: 100px 100%;
  }
}

@keyframes tunnelVisionEffect {
  0% { box-shadow: inset 0 0 0 rgba(0, 0, 0, 0); }
  20% { box-shadow: inset 0 0 100px rgba(0, 0, 0, 0); }
  40% { box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.7); }
  60% { box-shadow: inset 0 0 300px rgba(0, 0, 0, 0.3); }
  80% { box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.1); }
  100% { box-shadow: inset 0 0 0 rgba(0, 0, 0, 0); }
}

@keyframes lightBurstEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0; }
  50% { opacity: 1; }
  60% { opacity: 0.5; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

// 新增标题动画
@keyframes dimensionGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(12px);
    opacity: 0.7;
  }
}

@keyframes energyGlow {
  0% {
    filter: blur(5px);
    opacity: 0.4;
  }
  100% {
    filter: blur(10px);
    opacity: 0.8;
  }
}

@keyframes dizzyTitleSpin {
  0% { transform: translateZ(20px) rotateY(0deg); }
  25% { transform: translateZ(20px) rotateY(90deg); }
  50% { transform: translateZ(20px) rotateY(180deg); }
  75% { transform: translateZ(20px) rotateY(270deg); }
  100% { transform: translateZ(20px) rotateY(360deg); }
}

@keyframes hyperspaceTitleStretch {
  0% { transform: translateZ(20px) scaleX(1); }
  50% { transform: translateZ(20px) scaleX(1.5); }
  100% { transform: translateZ(20px) scaleX(1); }
}




// 新增动画定义：时空裂缝效果
@keyframes riftCracksAppear {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes timeFragmentsEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes fragmentFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -20px);
  }
}

@keyframes fragmentFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-25px, -15px);
  }
}

@keyframes realityReassembleEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.7; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

// 新增动画定义：星球爆炸效果
@keyframes explosionCoreEffect {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  20% {
    opacity: 1;
    transform: scale(0.5);
  }
  40% {
    opacity: 0.7;
    transform: scale(1);
  }
  70% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    opacity: 0;
    transform: scale(5);
  }
}

@keyframes debrisFieldEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes debrisFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -15px);
  }
}

@keyframes debrisFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-15px, -10px);
  }
}

@keyframes shockwaveSphereEffect {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  20% {
    opacity: 0.8;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.5);
  }
  80% {
    opacity: 0.1;
    transform: scale(3);
  }
  100% {
    opacity: 0;
    transform: scale(5);
  }
}

// 新增动画定义：量子纠缠效果
@keyframes parallelWorldsEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes parallelFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(15px, -10px);
  }
}

@keyframes parallelFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-10px, -15px);
  }
}

@keyframes quantumBridgeEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.7; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

@keyframes realityMergeEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.6; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

// 新增动画定义：虚拟现实效果
@keyframes pixelationEffect {
  0% {
    opacity: 0;
    background-size: 20px 20px;
  }
  20% {
    opacity: 0.8;
    background-size: 30px 30px;
  }
  40% {
    opacity: 0.6;
    background-size: 25px 25px;
  }
  60% {
    opacity: 0.3;
    background-size: 15px 15px;
  }
  80% {
    opacity: 0.1;
    background-size: 10px 10px;
  }
  100% {
    opacity: 0;
    background-size: 5px 5px;
  }
}

@keyframes digitalNoiseEffect {
  0% { opacity: 0; }
  20% { opacity: 0.8; }
  40% { opacity: 0.6; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

@keyframes realityMaterializeEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.7; }
  60% { opacity: 0.3; }
  80% { opacity: 0.1; }
  100% { opacity: 0; }
}

// 新增标题动画
@keyframes timeRiftGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(12px);
    opacity: 0.7;
  }
}

@keyframes explosionGlow {
  0% {
    filter: blur(5px);
    opacity: 0.4;
  }
  100% {
    filter: blur(10px);
    opacity: 0.8;
  }
}

@keyframes entanglementGlow {
  0% {
    filter: blur(7px);
    opacity: 0.35;
  }
  100% {
    filter: blur(11px);
    opacity: 0.75;
  }
}

@keyframes virtualRealityGlow {
  0% {
    filter: blur(6px);
    opacity: 0.4;
  }
  100% {
    filter: blur(10px);
    opacity: 0.8;
  }
}




// 新增动画定义：场景漫游效果
@keyframes viewfinderEffect {
  0% {
    opacity: 0;
    border-width: 20px;
  }
  20% {
    opacity: 0.8;
    border-width: 15px;
  }
  40% {
    opacity: 0.6;
    border-width: 10px;
  }
  70% {
    opacity: 0.3;
    border-width: 5px;
  }
  100% {
    opacity: 0;
    border-width: 0px;
  }
}

@keyframes pathIndicatorEffect {
  0% { opacity: 0; }
  20% { opacity: 0.7; }
  40% { opacity: 0.5; }
  70% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes sceneTransitionEffect {
  0% { opacity: 0; }
  15% { opacity: 0; }
  20% { opacity: 0.8; }
  25% { opacity: 0; }
  55% { opacity: 0; }
  60% { opacity: 0.8; }
  65% { opacity: 0; }
  100% { opacity: 0; }
}

// 新增动画定义：轨道环绕效果
@keyframes orbitPathEffect {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  20% {
    opacity: 0.7;
    transform: scale(0.9);
  }
  50% {
    opacity: 0.5;
    transform: scale(1);
  }
  80% {
    opacity: 0.2;
    transform: scale(0.5);
  }
  100% {
    opacity: 0;
    transform: scale(0.1);
  }
}

@keyframes gravityWellEffect {
  0% { opacity: 0; }
  30% { opacity: 0; }
  50% { opacity: 0.7; }
  70% { opacity: 0.3; }
  100% { opacity: 0; }
}

@keyframes ascendingSpiralEffect {
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  30% {
    opacity: 0.6;
    transform: rotate(180deg);
  }
  60% {
    opacity: 0.4;
    transform: rotate(540deg);
  }
  100% {
    opacity: 0;
    transform: rotate(1080deg);
  }
}

// 新增动画定义：维度传送门效果
@keyframes portalRingEffect {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  10% {
    opacity: 0.8;
    transform: scale(1);
  }
  25% {
    opacity: 0.6;
    transform: scale(1.1);
  }
  40% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 0;
    transform: scale(0.5);
  }
  60% {
    opacity: 0.8;
    transform: scale(1);
  }
  75% {
    opacity: 0.6;
    transform: scale(1.1);
  }
  90% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}

@keyframes dimensionShiftEffect {
  0% { opacity: 0; }
  10% { opacity: 0; }
  25% { opacity: 0.8; }
  40% { opacity: 0; }
  50% { opacity: 0; }
  60% { opacity: 0.8; }
  75% { opacity: 0; }
  90% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes portalParticlesEffect {
  0% { opacity: 0; }
  10% { opacity: 0; }
  25% { opacity: 0.8; }
  40% { opacity: 0.4; }
  50% { opacity: 0; }
  60% { opacity: 0.8; }
  75% { opacity: 0.4; }
  90% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes portalParticleFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(15px, -20px);
  }
}

@keyframes portalParticleFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, -15px);
  }
}

// 新增动画定义：时空穿梭效果
@keyframes rippleExpand1 {
  0% {
    transform: scale(0.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes rippleExpand2 {
  0% {
    transform: scale(0.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes timeRipplesEffect {
  0% { opacity: 0; }
  20% { opacity: 0.8; }
  40% { opacity: 0.4; }
  60% { opacity: 0.8; }
  80% { opacity: 0.4; }
  100% { opacity: 0; }
}

@keyframes pastFutureShiftEffect {
  0% { opacity: 0; }
  30% { opacity: 0.7; }
  50% { opacity: 0; }
  70% { opacity: 0.7; }
  100% { opacity: 0; }
}

@keyframes temporalDistortionEffect {
  0% { opacity: 0; }
  20% { opacity: 0.8; }
  40% { opacity: 0.4; }
  60% { opacity: 0.8; }
  80% { opacity: 0.4; }
  100% { opacity: 0; }
}

// 新增标题动画
@keyframes roamingGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(12px);
    opacity: 0.7;
  }
}

@keyframes orbitalGlow {
  0% {
    filter: blur(7px);
    opacity: 0.35;
  }
  100% {
    filter: blur(11px);
    opacity: 0.75;
  }
}

@keyframes portalGlow {
  0% {
    filter: blur(6px);
    opacity: 0.4;
  }
  100% {
    filter: blur(10px);
    opacity: 0.8;
  }
}

@keyframes timeGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(12px);
    opacity: 0.7;
  }
}







// 新增动画定义：黑洞吞噬效果
@keyframes eventHorizonEffect {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  20% {
    opacity: 0.8;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.7;
    transform: scale(2);
  }
  80% {
    opacity: 0.5;
    transform: scale(5);
  }
  100% {
    opacity: 0;
    transform: scale(10);
  }
}

@keyframes accretionDiskEffect {
  0% {
    opacity: 0;
    transform: rotate(0deg) scale(0.5);
  }
  20% {
    opacity: 0.8;
    transform: rotate(180deg) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: rotate(720deg) scale(1.5);
  }
  80% {
    opacity: 0.3;
    transform: rotate(1440deg) scale(2);
  }
  100% {
    opacity: 0;
    transform: rotate(2160deg) scale(3);
  }
}

@keyframes gravitationalLensingEffect {
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  20% {
    opacity: 0;
    transform: rotate(0deg);
  }
  40% {
    opacity: 0.8;
    transform: rotate(180deg);
  }
  60% {
    opacity: 0.4;
    transform: rotate(360deg);
  }
  80% {
    opacity: 0.2;
    transform: rotate(540deg);
  }
  100% {
    opacity: 0;
    transform: rotate(720deg);
  }
}

// 新增动画定义：宇宙大爆炸效果
@keyframes singularityEffect {
  0% {
    opacity: 0;
    transform: scale(0.01);
  }
  10% {
    opacity: 1;
    transform: scale(0.1);
  }
  30% {
    opacity: 0.8;
    transform: scale(1);
  }
  60% {
    opacity: 0.5;
    transform: scale(3);
  }
  100% {
    opacity: 0;
    transform: scale(10);
  }
}

@keyframes explosionWaveEffect {
  0% {
    opacity: 0;
    transform: scale(0.01);
  }
  10% {
    opacity: 0;
    transform: scale(0.01);
  }
  30% {
    opacity: 1;
    transform: scale(2);
  }
  60% {
    opacity: 0.5;
    transform: scale(5);
  }
  100% {
    opacity: 0;
    transform: scale(10);
  }
}

@keyframes universeFormationEffect {
  0% {
    opacity: 0;
    background-size: 10% 10%;
  }
  30% {
    opacity: 0;
    background-size: 10% 10%;
  }
  60% {
    opacity: 0.8;
    background-size: 50% 50%;
  }
  80% {
    opacity: 0.4;
    background-size: 80% 80%;
  }
  100% {
    opacity: 0;
    background-size: 100% 100%;
  }
}

// 新增动画定义：维度崩溃效果
@keyframes realityFractureEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes dimensionalShardsEffect {
  0% { opacity: 0; }
  20% { opacity: 0; }
  40% { opacity: 0.8; }
  60% { opacity: 0.4; }
  80% { opacity: 0.2; }
  100% { opacity: 0; }
}

@keyframes shardFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -20px);
  }
}

@keyframes shardFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-25px, -15px);
  }
}

@keyframes chaosVortexEffect {
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  20% {
    opacity: 0;
    transform: rotate(0deg);
  }
  40% {
    opacity: 0.8;
    transform: rotate(360deg);
  }
  60% {
    opacity: 0.4;
    transform: rotate(720deg);
  }
  80% {
    opacity: 0.2;
    transform: rotate(1080deg);
  }
  100% {
    opacity: 0;
    transform: rotate(1440deg);
  }
}

// 新增动画定义：时空逆流效果
@keyframes reverseFlowEffect {
  0% { opacity: 0; }
  20% { opacity: 0.8; }
  40% { opacity: 0.6; }
  60% { opacity: 0.8; }
  80% { opacity: 0.4; }
  100% { opacity: 0; }
}

@keyframes temporalFragmentsEffect {
  0% { opacity: 0; }
  20% { opacity: 0.8; }
  40% { opacity: 0.4; }
  60% { opacity: 0.8; }
  80% { opacity: 0.4; }
  100% { opacity: 0; }
}

@keyframes temporalFloat1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(25px, -20px);
  }
}

@keyframes temporalFloat2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, -15px);
  }
}

@keyframes causalityLoopEffect {
  0% { opacity: 0; }
  20% { opacity: 0.7; }
  40% { opacity: 0.5; }
  60% { opacity: 0.7; }
  80% { opacity: 0.3; }
  100% { opacity: 0; }
}

// 新增标题动画
@keyframes blackHoleGlow {
  0% {
    filter: blur(7px);
    opacity: 0.3;
  }
  100% {
    filter: blur(12px);
    opacity: 0.7;
  }
}

@keyframes bigBangGlow {
  0% {
    filter: blur(5px);
    opacity: 0.4;
  }
  100% {
    filter: blur(10px);
    opacity: 0.8;
  }
}

@keyframes collapseGlow {
  0% {
    filter: blur(8px);
    opacity: 0.3;
  }
  100% {
    filter: blur(13px);
    opacity: 0.7;
  }
}

@keyframes rewindGlow {
  0% {
    filter: blur(6px);
    opacity: 0.4;
  }
  100% {
    filter: blur(11px);
    opacity: 0.8;
  }
}










</style>




































