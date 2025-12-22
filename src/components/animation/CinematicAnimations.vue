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
  // 新增动画类型
  DIMENSION_FOLD: 'dimension-fold',
  ENERGY_WAVE: 'energy-wave',
  DIZZY_CAM: 'dizzy-cam',
  HYPERSPACE: 'hyperspace',
  DEFAULT_DURATION: 7000, // 默认动画持续时间(ms)
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
  // 新增动画类型
  ANIMATION_CONFIG.DIMENSION_FOLD,
  ANIMATION_CONFIG.ENERGY_WAVE,
  ANIMATION_CONFIG.DIZZY_CAM,
  ANIMATION_CONFIG.HYPERSPACE
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
 * 动画函数映射
 */
const animationFunctions = {
  [ANIMATION_CONFIG.EPIC_DIVE]: animateEpicDive,
  [ANIMATION_CONFIG.SPACE_WARP]: animateSpaceWarp,
  [ANIMATION_CONFIG.MATRIX_HACK]: animateMatrixHack,
  [ANIMATION_CONFIG.QUANTUM_SHIFT]: animateQuantumShift,
  // 新增动画映射
  [ANIMATION_CONFIG.DIMENSION_FOLD]: animateDimensionFold,
  [ANIMATION_CONFIG.ENERGY_WAVE]: animateEnergyWave,
  [ANIMATION_CONFIG.DIZZY_CAM]: animateDizzyCam,
  [ANIMATION_CONFIG.HYPERSPACE]: animateHyperspace
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
</style>




































