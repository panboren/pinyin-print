<template>
  <div
    ref="containerRef"
    class="home-content"
    tabindex="-1"
    @dblclick="toggleAutoRotate"
  >
    <canvas ref="canvasRef" />

    <!-- 电影级加载状态指示器 -->
    <LoadingIndicator
      v-if="isLoading"
      :text="loadingText"
      :progress="loadingProgress"
    />

    <!-- 电影级动画组件 -->
    <CinematicAnimations
      v-if="scene && !isLoading"
      ref="cinematicAnimationsRef"
      :is-loading="isLoading"
      :scene="scene"
      :camera="camera"
      :renderer="renderer"
      :controls="controls"
      @animation-complete="onAnimationComplete"
    />

    <!-- 动画选择器组件 -->
    <AnimationSelector
      v-if="!isLoading"
      v-model="animationType"
      @change="resetAnimation"
      @reset="resetAnimation"
    />

    <!-- 视角控制组件 -->
    <CameraControls @set-camera-view="setCameraView" />

    <ControlsHint />
  </div>
</template>

<script setup>
/**
 * Home View Component
 * 主页视图组件，包含3D全景展示和交互控制
 *
 * @component HomeView
 * @author ZOOOW Team
 * @version 2.0.0
 * @license MIT
 * @since 1.0.0
 * @description 该组件负责初始化和管理Three.js场景，包括场景、相机、渲染器
 *              以及用户交互控制。采用组合式API和模块化设计，提高代码可维护性。
 */

import { onMounted, onUnmounted, watch, ref, computed, shallowRef } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { gsap } from 'gsap'

// 导入组件
import LoadingIndicator from '@/components/ui/LoadingIndicator.vue'
import CinematicAnimations from '@/components/animation/CinematicAnimations.vue'
import AnimationSelector from '@/components/animation/AnimationSelector.vue'
import CameraControls from '@/components/animation/CameraControls.vue'
import ControlsHint from '@/components/ui/ControlsHint.vue'

// 导入资源
import homeImage from '@/assets/image/home1.png'

// 导入常量和配置
import {
  CAMERA_CONFIG,
  RENDER_CONFIG,
  CONTROLS_CONFIG,
  VIEW_PRESETS,
  PERFORMANCE_CONFIG,
  STYLE_CONFIG
} from '@/config/constants'

// 导入工具函数
import { createLogger } from '@/utils/logger'
import { debounce } from '@/utils/performance'

// 创建日志实例
const logger = createLogger('HomeView')

// ===== 响应式引用 =====
const containerRef = ref(null)
const canvasRef = ref(null)
const cinematicAnimationsRef = ref(null)

// ===== Three.js 相关变量 =====
// 使用shallowRef避免对Three.js对象进行深度响应式处理
const scene = shallowRef(null)
const camera = shallowRef(null)
const renderer = shallowRef(null)
const mesh = shallowRef(null)
const controls = shallowRef(null)
const animationId = ref(null)

// ===== 状态管理 =====
const isLoading = ref(true)
const autoRotateEnabled = ref(false)
const animationComplete = ref(false)
const animationType = ref('epic-dive')
const isInitialized = ref(false)

// ===== 计算属性 =====
const loadingText = computed(() => '正在加载ZOOOW智慧工具...')
const loadingProgress = computed(() => '准备进入沉浸式体验')

// ===== 工具函数 =====

/**
 * 创建场景
 * @returns {THREE.Scene} 创建的场景对象
 */
const createScene = () => {
  logger.debug('创建Three.js场景')
  const newScene = new THREE.Scene()
  newScene.background = new THREE.Color(STYLE_CONFIG.BACKGROUND_COLOR)
  return newScene
}

/**
 * 创建相机
 * @returns {THREE.PerspectiveCamera} 创建的相机对象
 */
const createCamera = () => {
  if (!containerRef.value) {
    throw new Error('容器元素不存在')
  }

  logger.debug('创建相机')

  const aspectRatio = containerRef.value.clientWidth / containerRef.value.clientHeight
  const newCamera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.FOV,
    aspectRatio,
    CAMERA_CONFIG.NEAR,
    CAMERA_CONFIG.FAR
  )

  // 设置相机初始位置和旋转
  newCamera.position.set(
    CAMERA_CONFIG.DEFAULT_POSITION.x,
    CAMERA_CONFIG.DEFAULT_POSITION.y,
    CAMERA_CONFIG.DEFAULT_POSITION.z
  )
  newCamera.rotation.set(
    CAMERA_CONFIG.DEFAULT_ROTATION.x,
    CAMERA_CONFIG.DEFAULT_ROTATION.y,
    CAMERA_CONFIG.DEFAULT_ROTATION.z
  )
  newCamera.fov = CAMERA_CONFIG.FOV
  newCamera.updateProjectionMatrix()

  return newCamera
}

/**
 * 创建渲染器
 * @returns {THREE.WebGLRenderer} 创建的渲染器对象
 */
const createRenderer = () => {
  if (!canvasRef.value) {
    throw new Error('Canvas元素不存在')
  }

  logger.debug('创建渲染器')

  const newRenderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: RENDER_CONFIG.ANTIALIAS,
    alpha: RENDER_CONFIG.ALPHA,
    powerPreference: RENDER_CONFIG.POWER_PREFERENCE,
    preserveDrawingBuffer: RENDER_CONFIG.PRESERVE_DRAWING_BUFFER,
    precision: RENDER_CONFIG.PRECISION,
    stencil: RENDER_CONFIG.STENCIL,
    depth: RENDER_CONFIG.DEPTH
  })

  // 设置渲染器尺寸和像素比
  const pixelRatio = Math.min(window.devicePixelRatio, RENDER_CONFIG.MAX_PIXEL_RATIO)
  newRenderer.setSize(
    containerRef.value.clientWidth,
    containerRef.value.clientHeight,
    true
  )
  newRenderer.setPixelRatio(pixelRatio)

  // 应用高级渲染设置
  applyRendererSettings(newRenderer)

  return newRenderer
}

/**
 * 应用渲染器高级设置
 * @param {THREE.WebGLRenderer} renderer - 渲染器对象
 */
const applyRendererSettings = (renderer) => {
  logger.debug('应用渲染器高级设置')

  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.3
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.gammaFactor = 2.2
  renderer.gammaOutput = true
  renderer.physicallyCorrectLights = true
  renderer.shadowMap.enabled = false
}

/**
 * 创建球体几何体
 * @returns {THREE.Mesh} 创建的球体网格对象
 */
const createSphereGeometry = () => {
  logger.debug('创建球体几何体')

  try {
    // 创建球体几何体 - 使用高精度设置
    const geometry = new THREE.SphereGeometry(500, 256, 128)
    geometry.scale(-1, 1, 1) // 翻转球体内部显示

    // 优化几何体属性
    geometry.computeVertexNormals()

    // 创建材质
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: false,
      opacity: 1.0,
      toneMapped: true,
      precision: 'highp',
      depthTest: true,
      depthWrite: false
    })

    // 创建网格
    const newMesh = new THREE.Mesh(geometry, material)
    scene.value.add(newMesh)

    return newMesh
  } catch (error) {
    logger.error('创建球体几何体失败:', error)
    throw error
  }
}

/**
 * 加载纹理
 * @returns {Promise<THREE.Texture>} 加载的纹理对象
 */
const loadTexture = () => {
  return new Promise((resolve, reject) => {
    logger.info('开始加载纹理')

    const textureLoader = new THREE.TextureLoader()

    const onLoad = (loadedTexture) => {
      try {
        logger.info('纹理加载成功')
        isLoading.value = false

        // 优化纹理参数
        loadedTexture.wrapS = THREE.ClampToEdgeWrapping
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping
        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter
        loadedTexture.magFilter = THREE.LinearFilter
        loadedTexture.generateMipmaps = true

        const maxAnisotropy = renderer.value.capabilities.getMaxAnisotropy()
        loadedTexture.anisotropy = maxAnisotropy
        loadedTexture.colorSpace = THREE.SRGBColorSpace
        loadedTexture.format = THREE.RGBAFormat
        loadedTexture.type = THREE.UnsignedByteType

        // 更新材质
        if (mesh.value && mesh.value.material) {
          mesh.value.material.map = loadedTexture
          mesh.value.material.needsUpdate = true
        }

        // 动画进入默认视角
        setTimeout(() => {
          if (cinematicAnimationsRef.value) {
            cinematicAnimationsRef.value.animateToDefaultView()
          }
        }, 100)

        resolve(loadedTexture)
      } catch (error) {
        logger.error('纹理处理失败:', error)
        reject(error)
      }
    }

    const onProgress = (progress) => {
      const percentComplete = (progress.loaded / progress.total) * 100
      logger.debug(`纹理加载进度: ${percentComplete.toFixed(2)}%`)
    }

    const onError = (error) => {
      logger.error('纹理加载失败:', error)
      isLoading.value = false

      // 创建备用纹理
      try {
        createFallbackTexture()
        resolve()
      } catch (fallbackError) {
        logger.error('创建备用纹理失败:', fallbackError)
        reject(fallbackError)
      }
    }

    textureLoader.load(homeImage, onLoad, onProgress, onError)
  })
}

/**
 * 创建备用纹理
 * @returns {THREE.CanvasTexture} 创建的备用纹理
 */
const createFallbackTexture = () => {
  logger.warn('创建备用纹理')

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
  gradient.addColorStop(0, '#c532f6')
  gradient.addColorStop(1, '#c4163e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)

  const fallbackTexture = new THREE.CanvasTexture(canvas)

  if (mesh.value && mesh.value.material) {
    mesh.value.material.map = fallbackTexture
    mesh.value.material.needsUpdate = true
  }

  return fallbackTexture
}

/**
 * 设置轨道控制器
 */
const setupOrbitControls = () => {
  logger.debug('设置轨道控制器')

  try {
    // 创建轨道控制器
    controls.value = new OrbitControls(camera.value, renderer.value.domElement)

    // 应用控制器配置
    applyControlsConfig()

    // 设置交互优化
    setupInteractionOptimizations()

    // 设置自定义滚轮缩放
    setupCustomZoom()

    // 触摸设备优化
    if ('ontouchstart' in window) {
      setupTouchOptimizations()
    }

    // 确保控制器生效
    setTimeout(() => {
      renderer.value.domElement.focus()
    }, 100)

    logger.info('轨道控制器设置完成')
  } catch (error) {
    logger.error('设置轨道控制器失败:', error)
    throw error
  }
}

/**
 * 应用控制器配置
 */
const applyControlsConfig = () => {
  // 基础控制设置
  controls.value.enableZoom = CONTROLS_CONFIG.ENABLE_ZOOM
  controls.value.enablePan = CONTROLS_CONFIG.ENABLE_PAN
  controls.value.autoRotate = autoRotateEnabled.value

  // 旋转速度设置
  controls.value.autoRotateSpeed = CONTROLS_CONFIG.AUTO_ROTATE_SPEED
  controls.value.rotateSpeed = CONTROLS_CONFIG.ROTATE_SPEED

  // 阻尼设置
  controls.value.enableDamping = true
  controls.value.dampingFactor = CONTROLS_CONFIG.DAMPING_FACTOR

  // 角度限制
  controls.value.minPolarAngle = CONTROLS_CONFIG.MIN_POLAR_ANGLE
  controls.value.maxPolarAngle = CONTROLS_CONFIG.MAX_POLAR_ANGLE
  controls.value.minAzimuthAngle = CONTROLS_CONFIG.MIN_AZIMUTH_ANGLE
  controls.value.maxAzimuthAngle = CONTROLS_CONFIG.MAX_AZIMUTH_ANGLE

  // 设置默认视角
  controls.value.target.set(0, 0, 0)
  controls.value.object.rotation.set(
    CAMERA_CONFIG.DEFAULT_ROTATION.x,
    CAMERA_CONFIG.DEFAULT_ROTATION.y,
    CAMERA_CONFIG.DEFAULT_ROTATION.z
  )
  controls.value.update()

  // 其他优化设置
  controls.value.screenSpacePanning = false
  controls.value.enableKeys = false
  controls.value.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
  }
}

/**
 * 设置交互优化
 */
const setupInteractionOptimizations = () => {
  // 确保 canvas 元素可以接收焦点并优化交互
  renderer.value.domElement.setAttribute('tabindex', '-1')
  renderer.value.domElement.style.outline = 'none'
  renderer.value.domElement.style.cursor = 'grab'

  // 鼠标交互优化
  const handleMouseDown = () => {
    renderer.value.domElement.focus()
    renderer.value.domElement.style.cursor = 'grabbing'
  }

  const handleMouseUp = () => {
    renderer.value.domElement.style.cursor = 'grab'
  }

  const handleMouseLeave = () => {
    renderer.value.domElement.style.cursor = 'grab'
  }

  renderer.value.domElement.addEventListener('mousedown', handleMouseDown)
  renderer.value.domElement.addEventListener('mouseup', handleMouseUp)
  renderer.value.domElement.addEventListener('mouseleave', handleMouseLeave)

  // 确保 canvas 能接收输入事件
  renderer.value.domElement.setAttribute('tabindex', '0')
  renderer.value.domElement.focus()

  // 添加点击时获取焦点
  renderer.value.domElement.addEventListener('mousedown', () => {
    renderer.value.domElement.focus()
  })
}

/**
 * 设置自定义滚轮缩放
 */
const setupCustomZoom = () => {
  renderer.value.domElement.addEventListener('wheel', (event) => {
    event.preventDefault()

    if (!camera.value) return

    // 计算缩放方向
    const delta = event.deltaY * 0.001
    const currentFov = camera.value.fov

    // 设置FOV范围 (30-120度)
    const minFov = 30
    const maxFov = 120

    // 计算新的FOV
    let newFov = currentFov + delta * 10
    newFov = Math.max(minFov, Math.min(maxFov, newFov))

    // 更新相机FOV
    camera.value.fov = newFov
    camera.value.updateProjectionMatrix()

    // 控制器同步
    if (controls.value) {
      controls.value.update()
    }

    logger.debug(`FOV: ${newFov.toFixed(1)}°`)
  }, { passive: false })
}

/**
 * 设置触摸设备优化
 */
const setupTouchOptimizations = () => {
  controls.value.enablePan = true // 在触摸设备上启用平移以支持双指操作
  controls.value.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  }
}

/**
 * 设置事件监听器
 */
const setupEventListeners = () => {
  logger.debug('设置事件监听器')

  // 窗口大小变化监听
  window.addEventListener('resize', handleResize)

  // 页面可见性变化监听
  document.addEventListener('visibilitychange', handleVisibilityChange)
}

/**
 * 渲染动画循环
 */
const animate = () => {
  try {
    animationId.value = requestAnimationFrame(animate)

    // 更新控制器（启用阻尼后必须调用）
    if (controls.value) {
      controls.value.update()
    }

    // 只在需要时渲染
    if (needsRender()) {
      // 确保场景、相机和渲染器都存在
      if (scene.value && camera.value && renderer.value) {
        renderer.value.render(scene.value, camera.value)
      }
    }
  } catch (error) {
    logger.error('渲染循环错误:', error)
  }
}

/**
 * 渲染优化检查
 */
const lastRenderTime = ref(0)
const needsRender = () => {
  try {
    const now = performance.now()

    // 限制帧率到60fps，避免不必要的渲染
    if (now - lastRenderTime.value > PERFORMANCE_CONFIG.MIN_FRAME_TIME) {
      lastRenderTime.value = now
      return true
    }

    return controls.value && (controls.value.autoRotate || controls.value.isUserInteracting)
  } catch (error) {
    logger.error('渲染优化检查错误:', error)
    return true
  }
}

/**
 * 处理窗口大小变化
 */
const handleResize = debounce(() => {
  try {
    if (camera.value && renderer.value && containerRef.value) {
      camera.value.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
      camera.value.updateProjectionMatrix()
      renderer.value.setSize(
        containerRef.value.clientWidth,
        containerRef.value.clientHeight
      )
      renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, RENDER_CONFIG.MAX_PIXEL_RATIO))

      logger.debug('窗口大小变化已处理')
    }
  } catch (error) {
    logger.error('处理窗口大小变化失败:', error)
  }
}, PERFORMANCE_CONFIG.RESIZE_DELAY)

/**
 * 页面可见性变化处理
 */
const handleVisibilityChange = () => {
  try {
    if (document.hidden) {
      // 页面隐藏时暂停渲染
      if (animationId.value) {
        cancelAnimationFrame(animationId.value)
        animationId.value = null
      }
      logger.debug('页面隐藏，暂停渲染')
    } else {
      // 页面显示时恢复渲染
      if (scene.value && camera.value && renderer.value && !animationId.value) {
        animate()
        logger.debug('页面显示，恢复渲染')
      }
    }
  } catch (error) {
    logger.error('页面可见性变化处理失败:', error)
  }
}

/**
 * 双击切换自动旋转
 */
const toggleAutoRotate = () => {
  try {
    if (controls.value) {
      autoRotateEnabled.value = !autoRotateEnabled.value
      controls.value.autoRotate = autoRotateEnabled.value
      logger.info(`自动旋转: ${autoRotateEnabled.value ? '开启' : '关闭'}`)
    }
  } catch (error) {
    logger.error('切换自动旋转失败:', error)
  }
}

/**
 * 重置动画
 */
const resetAnimation = () => {
  try {
    animationComplete.value = false
    setTimeout(() => {
      if (cinematicAnimationsRef.value) {
        cinematicAnimationsRef.value.resetAnimation()
      }
    }, 100)
  } catch (error) {
    logger.error('重置动画失败:', error)
  }
}

/**
 * 动画完成回调
 */
const onAnimationComplete = () => {
  animationComplete.value = true
  logger.debug('动画完成')
}

/**
 * 预设视角函数
 * @param {string} preset - 预设视角名称
 */
const setCameraView = (preset) => {
  try {
    if (!camera.value || !controls.value) {
      logger.warn('相机或控制器未初始化，无法设置视角')
      return
    }

    // 确保目标点在球心
    controls.value.target.set(0, 0, 0)

    // 获取预设配置
    const presetConfig = VIEW_PRESETS[preset.toUpperCase()] || VIEW_PRESETS.DEFAULT
    const { theta: targetTheta, phi: targetPhi } = presetConfig

    // 获取当前球坐标
    const currentSpherical = new THREE.Spherical()
    const offset = new THREE.Vector3()
    offset.copy(controls.value.object.position).sub(controls.value.target)
    currentSpherical.setFromVector3(offset)

    // 处理角度差异（选择最短路径）
    let thetaDiff = targetTheta - currentSpherical.theta
    while (thetaDiff > Math.PI) thetaDiff -= 2 * Math.PI
    while (thetaDiff < -Math.PI) thetaDiff += 2 * Math.PI

    const targetThetaAdjusted = currentSpherical.theta + thetaDiff

    // 使用GSAP创建流畅动画
    gsap.to(currentSpherical, {
      theta: targetThetaAdjusted,
      phi: targetPhi,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        try {
          // 限制极角在控制器范围内
          currentSpherical.phi = Math.max(
            controls.value.minPolarAngle,
            Math.min(controls.value.maxPolarAngle, currentSpherical.phi)
          )
          currentSpherical.makeSafe()

          // 从当前位置平滑过渡到新位置
          controls.value.object.position.setFromSpherical(currentSpherical)
          controls.value.object.lookAt(controls.value.target)
          controls.value.update()
        } catch (error) {
          logger.error('视角更新错误:', error)
        }
      },
      onComplete: () => {
        logger.info(`切换到预设视角: ${preset}`)
      }
    })
  } catch (error) {
    logger.error('设置预设视角失败:', error)
  }
}

/**
 * 清理资源
 */
const cleanup = () => {
  try {
    logger.info('开始清理Three.js资源')

    // 清理动画帧
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }

    // 清理事件监听器
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('visibilitychange', handleVisibilityChange)

    // 销毁控制器
    if (controls.value) {
      controls.value.dispose()
      controls.value = null
    }

    // 销毁渲染器
    if (renderer.value) {
      renderer.value.dispose()
      renderer.value = null
    }

    // 清理几何体和材质
    if (mesh.value) {
      if (mesh.value.geometry) mesh.value.geometry.dispose()
      if (mesh.value.material) {
        if (mesh.value.material.map) mesh.value.material.map.dispose()
        mesh.value.material.dispose()
      }
      mesh.value = null
    }

    // 清理场景
    if (scene.value) {
      scene.value.clear()
      scene.value = null
    }

    logger.info('Three.js资源清理完成')
  } catch (error) {
    logger.error('Three.js资源清理失败:', error)
  }
}

/**
 * 初始化Three.js
 */
const initThreeJS = async () => {
  try {
    logger.info('开始初始化Three.js')

    // 创建场景
    scene.value = createScene()

    // 创建相机
    camera.value = createCamera()

    // 创建渲染器
    renderer.value = createRenderer()

    // 创建球体几何体
    mesh.value = createSphereGeometry()

    // 设置轨道控制器
    setupOrbitControls()

    // 设置事件监听器
    setupEventListeners()

    // 加载纹理
    await loadTexture()

    // 启动渲染循环
    animate()

    isInitialized.value = true
    logger.info('Three.js初始化完成')
  } catch (error) {
    logger.error('初始化Three.js失败:', error)
    isLoading.value = false
    throw error
  }
}

// ===== 生命周期钩子 =====

onMounted(async () => {
  try {
    // 设置CSS变量
    const root = document.documentElement
    root.style.setProperty('--background-color', STYLE_CONFIG.BACKGROUND_COLOR)
    root.style.setProperty('--text-color', STYLE_CONFIG.TEXT_COLOR)
    root.style.setProperty('--primary-color', STYLE_CONFIG.PRIMARY_COLOR)

    await initThreeJS()

    // 预加载纹理
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(homeImage)
  } catch (error) {
    logger.error('组件挂载失败:', error)
  }
})

onUnmounted(() => {
  try {
    cleanup()
  } catch (error) {
    logger.error('组件卸载清理失败:', error)
  }
})

// ===== 监听器 =====

// 监听动画类型变化
watch(animationType, (newType) => {
  if (cinematicAnimationsRef.value) {
    cinematicAnimationsRef.value.animationType = newType
  }
})
</script>

<style scoped lang="scss">
.home-content {
  width: 100vw;
  height: 100vh;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background: var(--background-color, #000000); // 使用CSS变量，提供默认值

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    outline: none;
    touch-action: none;
    user-select: none;

    // 提升图像渲染质量
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: pixelated;

    // 优化移动端体验
    @media (pointer: coarse) {
      touch-action: pan-y pinch-zoom;
    }
  }
}
</style>
