<template>
  <div
    ref="containerRef"
    class="home-content"
    tabindex="-1"
    @dblclick="toggleAutoRotate"
  >
    <canvas ref="canvasRef" />

    <!-- 电影级加载状态指示器 -->
    <div
      v-if="isLoading"
      class="loading-indicator"
      role="status"
      aria-live="polite"
    >
      <div
        class="loading-spinner"
        aria-hidden="true"
      />
      <p>{{ loadingText }}</p>
      <div class="loading-progress">
        {{ loadingProgress }}
      </div>
    </div>

    <!-- 电影级动画组件 -->
    <CinematicAnimations
      v-if="!isLoading"
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
      @reset="resetAnimation"
      @change="resetAnimation"
    />

    <!-- 视角控制组件 -->
    <CameraControls @set-camera-view="setCameraView" />

    <div class="controls-hint">
      <p>🖱️ 左键拖拽旋转 | 🔍 滚轮缩放 | 📱 触摸手势控制</p>
      <p>🔄 双击切换自动旋转 | 🎯 使用视角按钮快速定位</p>
    </div>
  </div>
</template>

<script setup>
/** Home View Component
 * 主页视图组件，包含3D全景展示和交互控制
 *
 * @file src/views/home/HomeView.vue
 * @author ZOOOW Team
 * @version 1.0.0
 * @license MIT
 **/

// 导入依赖
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { gsap } from 'gsap'
import { onMounted, ref, onUnmounted, computed } from 'vue'

// 导入本地图片资源
import homeImage from '@/assets/image/home1.png'
// 导入新创建的组件
import CameraControls from '@/components/viewControls.vue'
import AnimationSelector from '@/components/AnimationSelector.vue'
import CinematicAnimations from '@/components/CinematicAnimations.vue'

// 响应式引用
const containerRef = ref(null)
const canvasRef = ref(null)
const cinematicAnimationsRef = ref(null)

// Three.js 相关变量
let scene, camera, renderer, mesh
let controls
let animationId

// 状态管理
const isLoading = ref(true)
const autoRotateEnabled = ref(false)
const animationComplete = ref(false)
const animationType = ref('epic-dive')

// 常量
const CAMERA_FOV = 75
const CAMERA_NEAR = 0.01
const CAMERA_FAR = 2000
const MAX_PIXEL_RATIO = 4

// 计算属性
const loadingText = computed(() => '正在加载ZOOOW智慧工具...')
const loadingProgress = computed(() => '准备进入沉浸式体验')

/**
 * 初始化 Three.js 场景
 */
const initThreeJS = () => {
  try {
    // 创建场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    // 创建相机
    const aspectRatio = containerRef.value.clientWidth / containerRef.value.clientHeight
    camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      aspectRatio,
      CAMERA_NEAR,
      CAMERA_FAR
    )
    camera.position.set(0, 0, 0.01)
    camera.rotation.set(0, Math.PI / 4, 0)
    camera.fov = CAMERA_FOV
    camera.updateProjectionMatrix()

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      precision: 'highp',
      stencil: false,
      depth: true
    })

    // 设置渲染器尺寸和像素比
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO)
    renderer.setSize(
      containerRef.value.clientWidth,
      containerRef.value.clientHeight,
      true
    )
    renderer.setPixelRatio(pixelRatio)

    // 高级渲染设置
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.gammaFactor = 2.2
    renderer.gammaOutput = true
    renderer.physicallyCorrectLights = true
    renderer.shadowMap.enabled = false

    // 加载纹理
    loadTexture()

    // 创建球体几何体
    createSphereGeometry()

    // 创建轨道控制器
    setupOrbitControls()

    // 设置事件监听器
    setupEventListeners()

    // 启动渲染循环
    animate()
  } catch (error) {
    console.error('初始化 Three.js 失败:', error)
    isLoading.value = false
  }
}

/**
 * 加载纹理
 */
const loadTexture = () => {
  const textureLoader = new THREE.TextureLoader()
  textureLoader.load(
    homeImage,
    onTextureLoadSuccess,
    onTextureLoadProgress,
    onTextureLoadError
  )
}

/**
 * 纹理加载成功回调
 */
const onTextureLoadSuccess = (loadedTexture) => {
  try {
    console.log('全景图加载完成')
    isLoading.value = false

    // 优化纹理参数
    loadedTexture.wrapS = THREE.ClampToEdgeWrapping
    loadedTexture.wrapT = THREE.ClampToEdgeWrapping
    loadedTexture.minFilter = THREE.LinearMipmapLinearFilter
    loadedTexture.magFilter = THREE.LinearFilter
    loadedTexture.generateMipmaps = true

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
    loadedTexture.anisotropy = maxAnisotropy
    loadedTexture.colorSpace = THREE.SRGBColorSpace
    loadedTexture.format = THREE.RGBAFormat
    loadedTexture.type = THREE.UnsignedByteType

    // 更新材质
    if (mesh && mesh.material) {
      mesh.material.map = loadedTexture
      mesh.material.needsUpdate = true
    }

    // 动画进入默认视角
    setTimeout(() => {
      if (cinematicAnimationsRef.value) {
        cinematicAnimationsRef.value.animateToDefaultView()
      }
    }, 100)
  } catch (error) {
    console.error('纹理处理失败:', error)
  }
}

/**
 * 纹理加载进度回调
 */
const onTextureLoadProgress = (progress) => {
  const percentComplete = (progress.loaded / progress.total) * 100
  console.log(`加载进度: ${percentComplete.toFixed(2)}%`)
}

/**
 * 纹理加载错误回调
 */
const onTextureLoadError = (error) => {
  console.error('纹理加载失败:', error)
  isLoading.value = false

  try {
    // 创建默认的渐变背景作为fallback
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
    if (mesh && mesh.material) {
      mesh.material.map = fallbackTexture
      mesh.material.needsUpdate = true
    }
  } catch (fallbackError) {
    console.error('创建 fallback 纹理失败:', fallbackError)
  }
}

/**
 * 创建球体几何体
 */
const createSphereGeometry = () => {
  try {
    // 创建球体几何体 - 极致精度设置
    const geometry = new THREE.SphereGeometry(500, 256, 128) // 极高精度分段数
    geometry.scale(-1, 1, 1) // 翻转球体内部显示

    // 优化几何体属性
    geometry.computeVertexNormals() // 重新计算法向量确保正确的光照

    // 创建材质 - 专业级质量设置
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide, // 双面渲染避免背面问题
      transparent: false,
      opacity: 1.0,
      toneMapped: true, // 启用色调映射
      precision: 'highp', // 高精度着色器
      depthTest: true,
      depthWrite: false // 全景图不需要深度写入
    })

    // 创建网格
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  } catch (error) {
    console.error('创建球体几何体失败:', error)
  }
}

/**
 * 创建轨道控制器
 */
const setupOrbitControls = () => {
  try {
    // 创建轨道控制器 - 完全优化配置
    controls = new OrbitControls(camera, renderer.domElement)

    // 基础控制设置
    controls.enableZoom = false  // 禁用默认缩放，使用自定义FOV缩放
    controls.enablePan = false   // 禁用平移，专注于旋转
    controls.autoRotate = autoRotateEnabled.value

    // 旋转速度设置
    controls.autoRotateSpeed = 0.3 // 更慢的自动旋转速度，更舒适
    controls.rotateSpeed = 0.4    // 手动旋转速度适中

    // 阻尼设置 - 提升交互流畅度
    controls.enableDamping = true
    controls.dampingFactor = 0.04 // 更精细的阻尼控制

    // 限制设置 - 避免不自然的视角
    controls.minPolarAngle = 0.1    // 最小仰角，避免顶部视角问题
    controls.maxPolarAngle = Math.PI - 0.1 // 最大仰角
    controls.minAzimuthAngle = -Infinity  // 水平旋转无限制
    controls.maxAzimuthAngle = Infinity

    // 设置默认视角 - 与相机初始角度保持一致
    controls.target.set(0, 0, 0) // 目标点设在球心
    controls.object.rotation.set(0, Math.PI / 4, 0) // 设置与相机相同的初始旋转
    controls.update() // 立即更新控制器

    // 其他优化设置
    controls.screenSpacePanning = false
    controls.enableKeys = false     // 禁用键盘控制避免冲突
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    }

    // 确保 canvas 元素可以接收焦点并优化交互
    renderer.domElement.setAttribute('tabindex', '-1')
    renderer.domElement.style.outline = 'none'
    renderer.domElement.style.cursor = 'grab' // 默认抓手光标

    // 鼠标交互优化
    renderer.domElement.addEventListener('mousedown', () => {
      renderer.domElement.focus()
      renderer.domElement.style.cursor = 'grabbing' // 按下时变为抓取状态
    })

    renderer.domElement.addEventListener('mouseup', () => {
      renderer.domElement.style.cursor = 'grab' // 释放时恢复抓手
    })

    renderer.domElement.addEventListener('mouseleave', () => {
      renderer.domElement.style.cursor = 'grab' // 离开时恢复抓手
    })

    // 自定义滚轮缩放 - 使用FOV缩放适合全景图
    renderer.domElement.addEventListener('wheel', (event) => {
      event.preventDefault()

      if (!camera) return

      // 计算缩放方向
      const delta = event.deltaY * 0.001
      const currentFov = camera.fov

      // 设置FOV范围 (30-120度)
      const minFov = 30
      const maxFov = 120

      // 计算新的FOV
      let newFov = currentFov + delta * 10
      newFov = Math.max(minFov, Math.min(maxFov, newFov))

      // 更新相机FOV
      camera.fov = newFov
      camera.updateProjectionMatrix()

      // 控制器同步
      if (controls) {
        controls.update()
      }

      console.log(`FOV: ${newFov.toFixed(1)}°`)
    }, { passive: false })

    // 确保 canvas 能接收输入事件
    renderer.domElement.setAttribute('tabindex', '0')
    renderer.domElement.focus()

    // 添加点击时获取焦点
    renderer.domElement.addEventListener('mousedown', () => {
      renderer.domElement.focus()
    })

    // 触摸设备优化
    if ('ontouchstart' in window) {
      controls.enablePan = true // 在触摸设备上启用平移以支持双指操作
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      }
    }

    // 确保控制器生效
    setTimeout(() => {
      renderer.domElement.focus()
    }, 100)
  } catch (error) {
    console.error('设置轨道控制器失败:', error)
  }
}

/**
 * 设置事件监听器
 */
const setupEventListeners = () => {
  try {
    // 窗口大小变化监听
    window.addEventListener('resize', handleResize)

    // 页面可见性变化监听
    document.addEventListener('visibilitychange', handleVisibilityChange)
  } catch (error) {
    console.error('设置事件监听器失败:', error)
  }
}

/**
 * 渲染动画循环 - 优化性能
 */
const animate = () => {
  try {
    animationId = requestAnimationFrame(animate)

    // 更新控制器（启用阻尼后必须调用）
    if (controls) {
      controls.update()
    }

    // 只在需要时渲染
    if (needsRender()) {
      renderer.render(scene, camera)
    }
  } catch (error) {
    console.error('渲染循环错误:', error)
  }
}

/**
 * 渲染优化检查
 */
let lastRenderTime = 0
const needsRender = () => {
  try {
    const now = performance.now()
    // 限制帧率到60fps，避免不必要的渲染
    if (now - lastRenderTime > 16) {
      lastRenderTime = now
      return true
    }
    return controls && (controls.autoRotate || controls.isUserInteracting)
  } catch (error) {
    console.error('渲染优化检查错误:', error)
    return true
  }
}

/**
 * 处理窗口大小变化 - 添加节流
 */
let resizeTimeout
const handleResize = () => {
  try {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }

    resizeTimeout = setTimeout(() => {
      if (camera && renderer && containerRef.value) {
        camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(
          containerRef.value.clientWidth,
          containerRef.value.clientHeight
        )
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO))
      }
    }, 100) // 100ms节流
  } catch (error) {
    console.error('处理窗口大小变化失败:', error)
  }
}

/**
 * 双击切换自动旋转
 */
const toggleAutoRotate = () => {
  try {
    if (controls) {
      autoRotateEnabled.value = !autoRotateEnabled.value
      controls.autoRotate = autoRotateEnabled.value
      console.log(`自动旋转: ${autoRotateEnabled.value ? '开启' : '关闭'}`)
    }
  } catch (error) {
    console.error('切换自动旋转失败:', error)
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
    console.error('重置动画失败:', error)
  }
}

/**
 * 动画完成回调
 */
const onAnimationComplete = () => {
  animationComplete.value = true
}

/**
 * 预设视角函数 - 从当前位置平滑过渡
 */
const setCameraView = (preset) => {
  try {
    if (!camera || !controls) return

    // 确保目标点在球心
    controls.target.set(0, 0, 0)

    // 根据预设设置目标球坐标
    let targetTheta = 0
    let targetPhi = Math.PI / 2

    switch(preset) {
    case 'front':
      // 正前方视角
      targetTheta = 0
      targetPhi = Math.PI / 2
      break
    case 'right':
      // 右侧视角 (90度)
      targetTheta = Math.PI / 2
      targetPhi = Math.PI / 2
      break
    case 'left':
      // 左侧视角 (-90度)
      targetTheta = -Math.PI / 2
      targetPhi = Math.PI / 2
      break
    case 'back':
      // 后方视角 (180度)
      targetTheta = Math.PI
      targetPhi = Math.PI / 2
      break
    case 'up':
      // 仰视视角 (向上30度)
      targetTheta = 0
      targetPhi = Math.PI / 2 - Math.PI / 6
      break
    case 'down':
      // 俯视视角 (向下30度)
      targetTheta = 0
      targetPhi = Math.PI / 2 + Math.PI / 6
      break
    case 'default':
    default:
      // 默认视角
      targetTheta = Math.PI / 2.5
      targetPhi = Math.PI / 1.9
      break
    }

    // 获取当前球坐标
    const currentSpherical = new THREE.Spherical()
    const offset = new THREE.Vector3()
    offset.copy(controls.object.position).sub(controls.target)
    currentSpherical.setFromVector3(offset)

    // 处理角度差异（选择最短路径）
    let thetaDiff = targetTheta - currentSpherical.theta
    while (thetaDiff > Math.PI) thetaDiff -= 2 * Math.PI
    while (thetaDiff < -Math.PI) thetaDiff += 2 * Math.PI

    const targetThetaAdjusted = currentSpherical.theta + thetaDiff

    // 使用GSAP创建流畅动画，保持当前半径
    gsap.to(currentSpherical, {
      theta: targetThetaAdjusted,
      phi: targetPhi,
      duration: 1.5, // 1.5秒动画
      ease: 'power2.inOut', // GSAP的缓动函数
      onUpdate: () => {
        try {
          // 限制极角在控制器范围内
          currentSpherical.phi = Math.max(controls.minPolarAngle, Math.min(controls.maxPolarAngle, currentSpherical.phi))
          currentSpherical.makeSafe()

          // 从当前位置平滑过渡到新位置
          controls.object.position.setFromSpherical(currentSpherical)
          controls.object.lookAt(controls.target)
          controls.update()
        } catch (error) {
          console.error('视角更新错误:', error)
        }
      },
      onComplete: () => {
        console.log(`从当前位置切换到预设视角: ${preset}`)
      }
    })
  } catch (error) {
    console.error('设置预设视角失败:', error)
  }
}

/**
 * 页面可见性变化处理 - 优化性能
 */
const handleVisibilityChange = () => {
  try {
    if (document.hidden) {
      // 页面隐藏时暂停渲染
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    } else {
      // 页面显示时恢复渲染
      if (scene && camera && renderer) {
        animate()
      }
    }
  } catch (error) {
    console.error('页面可见性变化处理失败:', error)
  }
}

// 监听动画类型变化
watch(animationType, (newType) => {
  if (cinematicAnimationsRef.value) {
    cinematicAnimationsRef.value.animationType = newType
  }
})

onMounted(() => {
  try {
    initThreeJS()

    // 预加载纹理
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(homeImage)
  } catch (error) {
    console.error('组件挂载失败:', error)
  }
})

onUnmounted(() => {
  try {
    // 清理动画帧
    if (animationId) {
      cancelAnimationFrame(animationId)
    }

    // 清理事件监听器
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('visibilitychange', handleVisibilityChange)

    // 销毁控制器
    if (controls) {
      controls.dispose()
    }

    // 销毁渲染器
    if (renderer) {
      renderer.dispose()
    }

    // 清理几何体和材质
    if (mesh) {
      if (mesh.geometry) mesh.geometry.dispose()
      if (mesh.material) {
        if (mesh.material.map) mesh.material.map.dispose()
        mesh.material.dispose()
      }
    }

    // 清理场景
    if (scene) {
      scene.clear()
    }
  } catch (error) {
    console.error('组件卸载清理失败:', error)
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
  background: #000; // 加载时的黑色背景

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    outline: none;
    touch-action: none; // 防止触摸干扰
    user-select: none;  // 防止文本选择干扰

    // 提升图像渲染质量
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: pixelated;

    // 优化移动端体验
    @media (pointer: coarse) {
      touch-action: pan-y pinch-zoom;
    }
  }

  // 电影级加载指示器
  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    color: white;
    background: rgba(0, 0, 0, 0.9);
    padding: 40px;
    border-radius: 20px;
    backdrop-filter: blur(20px);
    border: 2px solid rgba(255, 255, 255, 0.1);
    z-index: 100;
    text-align: center;

    .loading-spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 255, 255, 0.2);
      border-top: 4px solid #ffffff;
      border-radius: 50%;
      animation: spin 2s linear infinite;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }

    p {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      opacity: 1;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }

    .loading-progress {
      font-size: 12px;
      opacity: 0.7;
      letter-spacing: 1px;
      font-style: italic;
      animation: pulse 2s ease-in-out infinite;
    }
  }

  // 控制提示
  .controls-hint {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.5;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    pointer-events: none;
    opacity: 0.8;
    transition: opacity 0.3s ease;

    p {
      margin: 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    // 移动端优化
    @media (max-width: 768px) {
      font-size: 11px;
      padding: 10px 12px;
      bottom: 15px;
      left: 15px;
    }
  }

  // 悬停时显示完整提示
  &:hover .controls-hint {
    opacity: 1;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
}
</style>
