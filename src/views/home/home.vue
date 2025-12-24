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
      :animation-type="animationType"
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
 * Home View Component - 性能优化版本
 * 主页视图组件，包含3D全景展示和交互控制
 *
 * @component HomeView
 * @author ZOOOW Team
 * @version 2.1.0 - Performance Optimized
 * @license MIT
 * @since 1.0.0
 * @description 该组件负责初始化和管理Three.js场景，包括场景、相机、渲染器
 *              以及用户交互控制。采用组合式API和模块化设计，提高代码可维护性。
 *              性能优化：减少几何体顶点数、限制像素比、优化纹理参数
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
 * 创建渲染器 - 性能优化版本
 * @returns {THREE.WebGLRenderer} 创建的渲染器对象
 */
const createRenderer = () => {
  if (!canvasRef.value) {
    throw new Error('Canvas元素不存在')
  }

  logger.debug('创建渲染器')

  const newRenderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,

    // 🔧 性能优化：关闭抗锯齿
    // 对于全景图场景，关闭抗锯齿可以显著提升性能（减少2-4倍渲染负担）
    antialias: false,

    alpha: RENDER_CONFIG.ALPHA,

    // 🔧 性能优化：优先性能
    powerPreference: 'high-performance',

    preserveDrawingBuffer: RENDER_CONFIG.PRESERVE_DRAWING_BUFFER,

    // 🔧 性能优化：使用中等精度
    // 对于全景图渲染，mediump 已经足够，可以显著提升性能
    precision: 'mediump',

    // 🔧 性能优化：关闭模板缓冲
    // 全景图场景不需要模板测试，可以节省内存
    stencil: false,

    depth: RENDER_CONFIG.DEPTH
  })

  // 🔧 性能优化：限制像素比
  // Retina屏幕可能使用 2.0 或 3.0，限制到 1.5 可以减少 25-50% 的像素渲染量
  const pixelRatio = Math.min(window.devicePixelRatio, 1.5)
  newRenderer.setSize(
    containerRef.value.clientWidth,
    containerRef.value.clientHeight,
    true
  )
  newRenderer.setPixelRatio(pixelRatio)

  // 应用高级渲染设置
  applyRendererSettings(newRenderer)

  logger.debug(`渲染器创建完成，像素比: ${pixelRatio}`)
  return newRenderer
}

/**
 * 应用渲染器高级设置 - 性能优化版本
 * @param {THREE.WebGLRenderer} renderer - 渲染器对象
 */
const applyRendererSettings = (renderer) => {
  logger.debug('应用渲染器高级设置')

  // 色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.3

  // 颜色空间设置
  renderer.outputColorSpace = THREE.SRGBColorSpace

  // 🔧 性能优化：禁用物理灯光计算
  // 全景图场景不需要物理灯光，关闭可以提升性能
  renderer.physicallyCorrectLights = false

  // 🔧 性能优化：关闭阴影贴图
  // 全景图不需要阴影，关闭可以显著提升性能
  renderer.shadowMap.enabled = false

  // 🔧 性能优化：禁用对数深度缓冲区
  // 普通场景不需要对数深度，关闭可以提升性能
  renderer.logarithmicDepthBuffer = false

  // 确保自动清除开启
  renderer.autoClear = true

  logger.debug('渲染器设置应用完成')
}

/**
 * 创建球体几何体 - 性能优化版本
 * @returns {THREE.Mesh} 创建的球体网格对象
 */
const createSphereGeometry = () => {
  logger.debug('创建球体几何体')

  try {
    // 🔧 性能优化：减少球体几何体顶点数
    // 原始：SphereGeometry(500, 256, 128) = 131,584 顶点
    // 优化：SphereGeometry(500, 80, 40) = 13,200 顶点
    // 减少：118,384 顶点 (约90% 减少)
    // 对于全景图场景，80x40 的分段已经足够保证视觉质量
    const geometry = new THREE.SphereGeometry(500, 80, 40)

    // 翻转球体以显示内部
    geometry.scale(-1, 1, 1)

    // 计算法线（虽然 MeshBasicMaterial 不需要，但保持兼容性）
    geometry.computeVertexNormals()

    // 🔧 性能优化：保持 DoubleSide 确保正常显示
    // 使用 BackSide 可能会导致某些情况下的显示问题
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: false,
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
 * 加载纹理 - 性能优化版本
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

        // 🔧 性能优化：保留 mipmap 以确保质量
        // 虽然 mipmap 会增加内存，但对于全景图场景，它提供更好的视觉质量
        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter
        loadedTexture.magFilter = THREE.LinearFilter
        loadedTexture.generateMipmaps = true

        // 🔧 性能优化：适度减少各向异性
        // 从最大值 (通常 16) 降低到 8，平衡质量和性能
        const maxAnisotropy = Math.min(8, renderer.value.capabilities.getMaxAnisotropy())
        loadedTexture.anisotropy = maxAnisotropy

        // 颜色空间设置
        loadedTexture.colorSpace = THREE.SRGBColorSpace

        // 🔧 性能优化：使用 RGBA 格式以确保兼容性
        // 虽然 RGB 格式可以节省内存，但某些纹理可能需要 alpha 通道
        loadedTexture.format = THREE.RGBAFormat

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
        const fallbackTexture = createFallbackTexture()
        resolve(fallbackTexture)
      } catch (fallbackError) {
        logger.error('创建备用纹理失败:', fallbackError)
        reject(fallbackError)
      }
    }

    textureLoader.load(homeImage, onLoad, onProgress, onError)
  })
}

/**
 * 创建备用纹理 - 进一步优化版本
 * 使用更小的画布，减少内存占用
 */
const createFallbackTexture = () => {
  logger.warn('创建备用纹理')

  // 🔧 进一步优化：使用更小的画布 128x128
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  // 使用简单的渐变填充
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, '#c532f6')
  gradient.addColorStop(1, '#c4163e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)

  const fallbackTexture = new THREE.CanvasTexture(canvas)

  // 优化纹理参数
  fallbackTexture.minFilter = THREE.LinearFilter
  fallbackTexture.magFilter = THREE.LinearFilter

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
 * 设置交互优化 - 进一步优化版本
 * 移除重复的 tabindex 设置和事件监听器
 */
const setupInteractionOptimizations = () => {
  const domElement = renderer.value.domElement

  // 确保 canvas 元素可以接收焦点并优化交互
  domElement.setAttribute('tabindex', '0')
  domElement.style.outline = 'none'
  domElement.style.cursor = 'grab'

  // 鼠标交互优化 - 使用单一事件处理函数
  const handleMouseEvent = (event) => {
    if (event.type === 'mousedown') {
      domElement.style.cursor = 'grabbing'
    } else {
      domElement.style.cursor = 'grab'
    }
  }

  // 一次性绑定所有鼠标事件
  domElement.addEventListener('mousedown', handleMouseEvent)
  domElement.addEventListener('mouseup', handleMouseEvent)
  domElement.addEventListener('mouseleave', handleMouseEvent)

  // 设置初始焦点
  domElement.focus()
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
 * 渲染动画循环 - 进一步优化版本
 * 简化渲染逻辑，减少不必要的判断
 */
const animate = () => {
  try {
    animationId.value = requestAnimationFrame(animate)

    // 更新控制器（启用阻尼后必须调用）
    if (controls.value) {
      controls.value.update()
    }

    // 直接渲染，确保每一帧都能正确渲染
    // Three.js 的渲染器已经有内部优化，不需要额外的 needsRender 检查
    if (scene.value && camera.value && renderer.value) {
      renderer.value.render(scene.value, camera.value)
    }
  } catch (error) {
    logger.error('渲染循环错误:', error)
  }
}

/**
 * 渲染优化检查 - 性能优化版本
 * 智能判断是否需要渲染，避免不必要的渲染
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
 * 处理窗口大小变化 - 进一步优化版本
 * 简化逻辑，减少判断
 */
const handleResize = debounce(() => {
  if (!camera.value || !renderer.value || !containerRef.value) {
    return
  }

  // 更新相机宽高比
  camera.value.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.value.updateProjectionMatrix()

  // 更新渲染器尺寸
  renderer.value.setSize(
    containerRef.value.clientWidth,
    containerRef.value.clientHeight
  )

  // 限制像素比
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

  logger.debug('窗口大小变化已处理')
}, PERFORMANCE_CONFIG.RESIZE_DELAY)

/**
 * 页面可见性变化处理 - 进一步优化版本
 * 简化逻辑
 */
const handleVisibilityChange = () => {
  if (document.hidden) {
    // 页面隐藏时暂停渲染
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }
    logger.debug('页面隐藏，暂停渲染')
  } else {
    // 页面显示时恢复渲染
    if (!animationId.value) {
      animate()
      logger.debug('页面显示，恢复渲染')
    }
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

// 监听动画类型变化
watch(animationType, () => {
  // Prop 绑定会自动触发 CinematicAnimations 组件的 watch
  // 如果需要手动重新播放动画，可以调用 resetAnimation
  if (cinematicAnimationsRef.value?.resetAnimation) {
    cinematicAnimationsRef.value.resetAnimation()
  }
})

onUnmounted(() => {
  try {
    cleanup()
  } catch (error) {
    logger.error('组件卸载清理失败:', error)
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
