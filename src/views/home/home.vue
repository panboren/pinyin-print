<!-- src/views/home/HomeView.vue -->
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

    <!-- 电影级开场黑屏 -->
    <div
      v-else-if="!animationComplete"
      class="cinematic-intro"
      :data-animation-type="animationType"
      aria-hidden="true"
    >
      <div class="fade-out" />
      <div class="title-card">
        <div
          class="particles-container"
          aria-hidden="true"
        >
          <div
            v-for="i in particleCount"
            :key="i"
            class="particle"
            :style="getParticleStyle(i)"
            :aria-hidden="true"
          />
        </div>
        <h1>ZOOOW</h1>
        <p>IMMERSIVE EXPERIENCE</p>
        <div
          class="scanlines"
          aria-hidden="true"
        />
        <div
          class="lens-flare"
          aria-hidden="true"
        />
      </div>

      <!-- 添加动态效果层，特别是为史诗俯冲 -->
      <div
        v-if="animationType === 'epic-dive'"
        class="dynamic-effects"
        aria-hidden="true"
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
      role="region"
      aria-label="动画控制"
    >
      <label for="animation-type">动画类型:</label>
      <select
        id="animation-type"
        v-model="animationType"
        aria-label="选择开场动画类型"
        @change="resetAnimation"
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

    <!-- 视角控制面板 -->
    <div
      class="view-controls"
      role="region"
      aria-label="视角控制面板"
    >
      <h4>视角控制</h4>
      <div class="view-buttons">
        <button
          class="view-btn"
          aria-label="正前方视角"
          @click="setCameraView('front')"
        >
          正前方
        </button>
        <button
          class="view-btn"
          aria-label="右侧视角"
          @click="setCameraView('right')"
        >
          右侧
        </button>
        <button
          class="view-btn"
          aria-label="左侧视角"
          @click="setCameraView('left')"
        >
          左侧
        </button>
        <button
          class="view-btn"
          aria-label="后方视角"
          @click="setCameraView('back')"
        >
          后方
        </button>
        <button
          class="view-btn"
          aria-label="仰视角"
          @click="setCameraView('up')"
        >
          仰视
        </button>
        <button
          class="view-btn"
          aria-label="俯视角"
          @click="setCameraView('down')"
        >
          俯视
        </button>
        <button
          class="view-btn default"
          aria-label="默认视角"
          @click="setCameraView('default')"
        >
          默认
        </button>
      </div>
    </div>

    <div class="controls-hint">
      <p>🖱️ 左键拖拽旋转 | 🔍 滚轮缩放 | 📱 触摸手势控制</p>
      <p>🔄 双击切换自动旋转 | 🎯 使用视角按钮快速定位</p>
    </div>
  </div>
</template>

<script setup>
/**
 * Home View Component
 * 主页视图组件，包含3D全景展示和交互控制
 *
 * @file src/views/home/HomeView.vue
 * @author ZOOOW Team
 * @version 1.0.0
 * @license MIT
 */

// 导入依赖
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { gsap } from 'gsap'
import { onMounted, ref, onUnmounted, computed } from 'vue'

// 导入本地图片资源
import homeImage from '@/assets/image/home1.png'

// 响应式引用
const containerRef = ref(null)
const canvasRef = ref(null)

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
const particleCount = 50
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
    animateToDefaultView()
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
    const geometry = new THREE.SphereGeometry(500, 256, 128)
    geometry.scale(-1, 1, 1)
    geometry.computeVertexNormals()

    const material = new THREE.MeshBasicMaterial({
      map: null, // 纹理将在加载完成后设置
      side: THREE.DoubleSide,
      transparent: false,
      opacity: 1.0,
      toneMapped: true,
      precision: 'highp',
      depthTest: true,
      depthWrite: false
    })

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  } catch (error) {
    console.error('创建球体几何体失败:', error)
  }
}

/**
 * 设置轨道控制器
 */
const setupOrbitControls = () => {
  try {
    controls = new OrbitControls(camera, renderer.domElement)

    // 基础控制设置
    controls.enableZoom = false
    controls.enablePan = false
    controls.autoRotate = autoRotateEnabled.value

    // 旋转速度设置
    controls.autoRotateSpeed = 0.3
    controls.rotateSpeed = 0.4

    // 阻尼设置
    controls.enableDamping = true
    controls.dampingFactor = 0.04

    // 限制设置
    controls.minPolarAngle = 0.1
    controls.maxPolarAngle = Math.PI - 0.1
    controls.minAzimuthAngle = -Infinity
    controls.maxAzimuthAngle = Infinity

    // 设置默认视角
    controls.target.set(0, 0, 0)
    controls.object.rotation.set(0, Math.PI / 4, 0)
    controls.update()

    // 其他优化设置
    controls.screenSpacePanning = false
    controls.enableKeys = false
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    }
  } catch (error) {
    console.error('设置轨道控制器失败:', error)
  }
}

/**
 * 设置事件监听器
 */
const setupEventListeners = () => {
  try {
    // 确保 canvas 元素可以接收焦点并优化交互
    renderer.domElement.setAttribute('tabindex', '-1')
    renderer.domElement.style.outline = 'none'
    renderer.domElement.style.cursor = 'grab'

    // 鼠标交互优化
    renderer.domElement.addEventListener('mousedown', () => {
      renderer.domElement.focus()
      renderer.domElement.style.cursor = 'grabbing'
    })

    renderer.domElement.addEventListener('mouseup', () => {
      renderer.domElement.style.cursor = 'grab'
    })

    renderer.domElement.addEventListener('mouseleave', () => {
      renderer.domElement.style.cursor = 'grab'
    })

    // 自定义滚轮缩放
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false })

    // 确保 canvas 能接收输入事件
    renderer.domElement.setAttribute('tabindex', '0')
    renderer.domElement.focus()

    // 添加点击时获取焦点
    renderer.domElement.addEventListener('mousedown', () => {
      renderer.domElement.focus()
    })

    // 触摸设备优化
    if ('ontouchstart' in window) {
      controls.enablePan = true
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      }
    }

    // 确保控制器生效
    setTimeout(() => {
      renderer.domElement.focus()
    }, 100)

    setCameraView('default')
  } catch (error) {
    console.error('设置事件监听器失败:', error)
  }
}

/**
 * 处理滚轮事件
 */
const handleWheel = (event) => {
  try {
    event.preventDefault()

    if (!camera) return

    const delta = event.deltaY * 0.001
    const currentFov = camera.fov
    const minFov = 30
    const maxFov = 120

    let newFov = currentFov + delta * 10
    newFov = Math.max(minFov, Math.min(maxFov, newFov))

    camera.fov = newFov
    camera.updateProjectionMatrix()

    if (controls) {
      controls.update()
    }

    console.log(`FOV: ${newFov.toFixed(1)}°`)
  } catch (error) {
    console.error('处理滚轮事件失败:', error)
  }
}

/**
 * 渲染动画循环
 */
const animate = () => {
  try {
    animationId = requestAnimationFrame(animate)

    if (controls) {
      controls.update()
    }

    if (needsRender()) {
      renderer.render(scene, camera)
    }
  } catch (error) {
    console.error('动画渲染失败:', error)
  }
}

/**
 * 渲染优化检查
 */
let lastRenderTime = 0
const needsRender = () => {
  const now = performance.now()
  if (now - lastRenderTime > 16) {
    lastRenderTime = now
    return true
  }
  return controls && (controls.autoRotate || controls.isUserInteracting)
}

/**
 * 处理窗口大小变化
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
    }, 100)
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
 * 获取粒子样式
 */
const getParticleStyle = (index) => {
  try {
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
  } catch (error) {
    console.error('获取粒子样式失败:', error)
    return {}
  }
}

/**
 * 重置动画
 */
const resetAnimation = () => {
  try {
    animationComplete.value = false
    setTimeout(() => {
      animateToDefaultView()
    }, 100)
  } catch (error) {
    console.error('重置动画失败:', error)
  }
}

/**
 * 动画进入默认视角
 */
const animateToDefaultView = () => {
  try {
    if (!camera || !controls) return

    controls.target.set(0, 0, 0)

    switch(animationType.value) {
    case 'epic-dive':
      animateEpicDive()
      break
    case 'space-warp':
      animateSpaceWarp()
      break
    case 'matrix-hack':
      animateMatrixHack()
      break
    case 'quantum-shift':
      animateQuantumShift()
      break
    default:
      animateEpicDive()
    }
  } catch (error) {
    console.error('动画进入默认视角失败:', error)
  }
}

// 创建自定义对象来保存相机旋转值，这样GSAP可以动画
const cameraRotation = {
  x: 0,
  y: 0,
  z: 0
}

/**
 * 动画1: 史诗俯冲
 */
const animateEpicDive = () => {
  try {
    const startPos = new THREE.Vector3(2000, 2500, 2000)
    camera.position.copy(startPos)

    camera.fov = 170
    camera.updateProjectionMatrix()

    renderer.render(scene, camera)

    controls.enabled = false

    let spiralIntensity = { value: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        console.log('优化后的史诗俯冲动画完成')
        controls.enabled = true
        animationComplete.value = true
      }
    })

    tl.to(camera.position, {
      x: 1800,
      y: 2200,
      z: 1800,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.lookAt(controls.target)
        controls.update()
      }
    })

    tl.to(spiralIntensity, {
      value: 1,
      duration: 0.5,
      ease: 'power1.inOut'
    }, 0.8)

    tl.to(camera.position, {
      x: 800,
      y: 1000,
      z: 800,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => {
        const time = tl.time()
        const spiralX = Math.sin(time * 2) * 30 * spiralIntensity.value
        const spiralZ = Math.cos(time * 2) * 30 * spiralIntensity.value
        camera.position.x += spiralX * 0.1
        camera.position.z += spiralZ * 0.1
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 1)

    tl.to(camera, {
      fov: 140,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 1.5)

    tl.to(spiralIntensity, {
      value: 3,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.5)

    tl.to(camera.position, {
      x: 200,
      y: 300,
      z: 200,
      duration: 1.5,
      ease: 'power4.in',
      onUpdate: () => {
        const time = tl.time()
        const spiralX = Math.sin(time * 3) * 50 * spiralIntensity.value
        const spiralZ = Math.cos(time * 3) * 50 * spiralIntensity.value
        camera.position.x += spiralX * 0.2
        camera.position.z += spiralZ * 0.2
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 2.5)

    tl.to(camera, {
      fov: 100,
      duration: 1,
      ease: 'power2.in',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 3)

    tl.to(spiralIntensity, {
      value: 1.5,
      duration: 1,
      ease: 'power2.out'
    }, 3.8)

    tl.to(camera.position, {
      x: 50,
      y: 80,
      z: 50,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        const time = tl.time()
        const spiralX = Math.sin(time * 2) * 20 * spiralIntensity.value
        const spiralZ = Math.cos(time * 2) * 20 * spiralIntensity.value
        camera.position.x += spiralX * 0.15
        camera.position.z += spiralZ * 0.15
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 3.8)

    tl.to(camera, {
      fov: 85,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 4)

    tl.to(spiralIntensity, {
      value: 0.3,
      duration: 1,
      ease: 'power2.out'
    }, 5)

    tl.to(camera.position, {
      x: 10,
      y: 15,
      z: 10,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        const time = tl.time()
        const spiralX = Math.sin(time * 1.5) * 5 * spiralIntensity.value
        const spiralZ = Math.cos(time * 1.5) * 5 * spiralIntensity.value
        camera.position.x += spiralX * 0.1
        camera.position.z += spiralZ * 0.1
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 5)

    tl.to(camera, {
      fov: 78,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 6)

    tl.to(spiralIntensity, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 6.3)

    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 0.8,
      ease: 'power1.out',
      onUpdate: () => {
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 6.3)

    tl.to(camera, {
      fov: 75,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 6.5)

    tl.to(cameraRotation, {
      x: 0,
      y: Math.PI / 2.5,
      z: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: function() {
        const spherical = new THREE.Spherical()
        spherical.radius = 0.01
        spherical.theta = cameraRotation.y
        spherical.phi = Math.PI / 1.9

        camera.position.setFromSpherical(spherical)
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 6.8)

    tl.to(renderer.domElement, {
      opacity: 0.8,
      duration: 0.05,
      ease: 'none'
    }, 6.3)

    tl.to(renderer.domElement, {
      opacity: 1,
      duration: 0.05,
      ease: 'none'
    }, 6.35)
  } catch (error) {
    console.error('史诗俯冲动画失败:', error)
    controls.enabled = true
  }
}

/**
 * 动画2: 空间扭曲
 */
const animateSpaceWarp = () => {
  try {
    camera.position.set(0, 0, 1000)

    camera.fov = 170
    camera.updateProjectionMatrix()

    renderer.render(scene, camera)

    controls.enabled = false

    cameraRotation.x = 0
    cameraRotation.y = 0
    cameraRotation.z = 0

    const tl = gsap.timeline({
      onComplete: () => {
        console.log('空间扭曲动画完成')
        controls.enabled = true
        animationComplete.value = true
      }
    })

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => {
        const time = tl.time()
        const warpAmount = 1 - (camera.position.z / 1000)

        cameraRotation.z = Math.sin(time * 5) * warpAmount * 0.1
        camera.rotation.z = cameraRotation.z

        camera.lookAt(controls.target)
        controls.update()
      }
    })

    tl.to(camera, {
      fov: 120,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 1.5)

    tl.to(camera.position, {
      x: 10,
      y: 5,
      z: 10,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        const time = tl.time()
        const warpAmount = camera.position.z / 100
        cameraRotation.z = Math.sin(time * 3) * warpAmount * 0.05
        camera.rotation.z = cameraRotation.z

        camera.lookAt(controls.target)
        controls.update()
      }
    }, 1.5)

    tl.to(camera, {
      fov: 85,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 2.5)

    tl.to(camera.position, {
      x: 2,
      y: 1,
      z: 2,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        const time = tl.time()
        const spiralRadius = camera.position.z * 0.5
        const spiralX = Math.cos(time * 2) * spiralRadius
        const spiralZ = Math.sin(time * 2) * spiralRadius
        camera.position.x = spiralX
        camera.position.z = spiralZ
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 2.5)

    tl.to(camera, {
      fov: 75,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 3.5)

    tl.to(cameraRotation, {
      z: 0,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: function() {
        camera.rotation.z = cameraRotation.z
      }
    }, 3.5)

    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => {
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 3.5)

    tl.to(cameraRotation, {
      x: 0,
      y: Math.PI / 2.5,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        const spherical = new THREE.Spherical()
        spherical.radius = 0.01
        spherical.theta = cameraRotation.y
        spherical.phi = Math.PI / 1.9

        camera.position.setFromSpherical(spherical)
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 4)
  } catch (error) {
    console.error('空间扭曲动画失败:', error)
    controls.enabled = true
  }
}

/**
 * 动画3: 黑客帝国
 */
const animateMatrixHack = () => {
  try {
    camera.position.set(0, 500, 0)
    camera.lookAt(0, 0, 0)

    camera.fov = 120
    camera.updateProjectionMatrix()

    renderer.render(scene, camera)

    controls.enabled = false

    const tl = gsap.timeline({
      onComplete: () => {
        console.log('黑客帝国动画完成')
        controls.enabled = true
        animationComplete.value = true
      }
    })

    tl.to(camera.position, {
      y: 50,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => {
        const time = tl.time()
        const wobbleX = Math.sin(time * 10) * 0.5
        const wobbleZ = Math.cos(time * 10) * 0.5
        camera.position.x = wobbleX
        camera.position.z = wobbleZ
        camera.lookAt(controls.target)
        controls.update()
      }
    })

    tl.to(camera.position, {
      y: 10,
      x: 5,
      z: 5,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => {
        const time = tl.time()
        const wobbleX = Math.sin(time * 5) * 0.2
        const wobbleZ = Math.cos(time * 5) * 0.2
        camera.position.x = 5 + wobbleX
        camera.position.z = 5 + wobbleZ
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 2)

    tl.to(camera, {
      fov: 90,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 2)

    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        const time = tl.time()
        const wobbleX = Math.sin(time * 3) * 0.05
        const wobbleZ = Math.cos(time * 3) * 0.05
        camera.position.x = wobbleX
        camera.position.z = wobbleZ
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 3)

    tl.to(camera, {
      fov: 75,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 3.5)

    tl.to(cameraRotation, {
      x: 0,
      y: Math.PI / 2.5,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        const spherical = new THREE.Spherical()
        spherical.radius = 0.01
        spherical.theta = cameraRotation.y
        spherical.phi = Math.PI / 1.9

        camera.position.setFromSpherical(spherical)
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 4)
  } catch (error) {
    console.error('黑客帝国动画失败:', error)
    controls.enabled = true
  }
}

/**
 * 动画4: 量子跃迁
 */
const animateQuantumShift = () => {
  try {
    const randomTheta = Math.random() * Math.PI * 2
    const randomPhi = Math.random() * Math.PI
    const randomRadius = 1000

    const randomPos = new THREE.Vector3()
    randomPos.setFromSphericalCoords(randomRadius, randomPhi, randomTheta)
    camera.position.copy(randomPos)

    camera.fov = 170
    camera.updateProjectionMatrix()

    renderer.render(scene, camera)

    controls.enabled = false

    const tl = gsap.timeline({
      onComplete: () => {
        console.log('量子跃迁动画完成')
        controls.enabled = true
        animationComplete.value = true
      }
    })

    let targetPosition = new THREE.Vector3()
    for (let i = 0; i < 3; i++) {
      targetPosition.set(
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500
      )

      tl.to(camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 0.3,
        ease: 'power1.inOut',
        onUpdate: () => {
          camera.lookAt(controls.target)
          controls.update()
        }
      }, i * 0.4)

      if (renderer) {
        tl.to(renderer.domElement, {
          opacity: 0.2,
          duration: 0.1,
          ease: 'power1.inOut'
        }, i * 0.4 + 0.1)

        tl.to(renderer.domElement, {
          opacity: 1,
          duration: 0.1,
          ease: 'power1.inOut'
        }, i * 0.4 + 0.2)
      }
    }

    tl.to(camera.position, {
      x: 10,
      y: 15,
      z: 10,
      duration: 0.5,
      ease: 'power1.inOut',
      onUpdate: () => {
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 1.5)

    tl.to(camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 1.5)

    tl.to(camera.position, {
      x: 2,
      y: 3,
      z: 2,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        const time = tl.time()
        const wobbleX = (Math.random() - 0.5) * 0.1
        const wobbleY = (Math.random() - 0.5) * 0.1
        const wobbleZ = (Math.random() - 0.5) * 0.1
        camera.position.x = 2 + wobbleX
        camera.position.y = 3 + wobbleY
        camera.position.z = 2 + wobbleZ
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 2)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 2.5)

    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => {
        const time = tl.time()
        const wobbleX = (Math.random() - 0.5) * 0.02
        const wobbleY = (Math.random() - 0.5) * 0.02
        const wobbleZ = (Math.random() - 0.5) * 0.02
        camera.position.x = wobbleX
        camera.position.y = wobbleY
        camera.position.z = wobbleZ
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 3)

    tl.to(camera, {
      fov: 75,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 3.5)

    tl.to(cameraRotation, {
      x: 0,
      y: Math.PI / 2.5,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: function() {
        const spherical = new THREE.Spherical()
        spherical.radius = 0.01
        spherical.theta = cameraRotation.y
        spherical.phi = Math.PI / 1.9

        camera.position.setFromSpherical(spherical)
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 4)
  } catch (error) {
    console.error('量子跃迁动画失败:', error)
    controls.enabled = true
  }
}

/**
 * 预设视角函数
 */
const setCameraView = (preset) => {
  try {
    if (!camera || !controls) return

    controls.target.set(0, 0, 0)

    let targetTheta = 0
    let targetPhi = Math.PI / 2

    switch(preset) {
    case 'front':
      targetTheta = 0
      targetPhi = Math.PI / 2
      break
    case 'right':
      targetTheta = Math.PI / 2
      targetPhi = Math.PI / 2
      break
    case 'left':
      targetTheta = -Math.PI / 2
      targetPhi = Math.PI / 2
      break
    case 'back':
      targetTheta = Math.PI
      targetPhi = Math.PI / 2
      break
    case 'up':
      targetTheta = 0
      targetPhi = Math.PI / 2 - Math.PI / 6
      break
    case 'down':
      targetTheta = 0
      targetPhi = Math.PI / 2 + Math.PI / 6
      break
    case 'default':
    default:
      targetTheta = Math.PI / 2.5
      targetPhi = Math.PI / 1.9
      break
    }

    const currentSpherical = new THREE.Spherical()
    const offset = new THREE.Vector3()
    offset.copy(controls.object.position).sub(controls.target)
    currentSpherical.setFromVector3(offset)

    let thetaDiff = targetTheta - currentSpherical.theta
    while (thetaDiff > Math.PI) thetaDiff -= 2 * Math.PI
    while (thetaDiff < -Math.PI) thetaDiff += 2 * Math.PI

    const targetThetaAdjusted = currentSpherical.theta + thetaDiff

    gsap.to(currentSpherical, {
      theta: targetThetaAdjusted,
      phi: targetPhi,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        currentSpherical.phi = Math.max(
          controls.minPolarAngle,
          Math.min(controls.maxPolarAngle, currentSpherical.phi)
        )
        currentSpherical.makeSafe()

        controls.object.position.setFromSpherical(currentSpherical)
        controls.object.lookAt(controls.target)
        controls.update()
      },
      onComplete: () => {
        console.log(`从当前位置切换到预设视角: ${preset}`)
      }
    })
  } catch (error) {
    console.error('设置相机视角失败:', error)
  }
}

/**
 * 页面可见性变化处理
 */
const handleVisibilityChange = () => {
  try {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    } else {
      if (scene && camera && renderer) {
        animate()
      }
    }
  } catch (error) {
    console.error('处理页面可见性变化失败:', error)
  }
}

// 生命周期钩子
onMounted(() => {
  try {
    initThreeJS()
    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)

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
/**
 * Home View Styles
 * 主页视图样式
 *
 * @file src/views/home/HomeView.vue
 * @author ZOOOW Team
 * @version 1.0.0
 * @license MIT
 */

.home-content {
  width: 100vw;
  height: 100vh;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background: #000;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    outline: none;
    touch-action: none;
    user-select: none;
    background: #000;

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

  // 电影级开场效果
  .cinematic-intro {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
    pointer-events: none;

    .fade-out {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: black;
      animation: fadeOut 2s ease-out forwards;
    }

    .title-card {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: white;
      animation: titleCard 3s ease-out forwards;
      z-index: 10;

      // 添加3D透视和转换
      transform-style: preserve-3d;
      perspective: 1000px;

      h1 {
        font-size: 4rem;
        font-weight: 100;
        letter-spacing: 8px;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);

        // 3D文字效果
        transform: translateZ(20px);
        font-family: 'Orbitron', 'Arial', sans-serif;
        position: relative;

        // 添加科技感辉光效果
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

        // 添加3D边缘发光
        &::after {
          content: "ZOOOW";
          position: absolute;
          left: 2px;
          top: 2px;
          z-index: -2;
          color: rgba(0, 100, 255, 0.3);
          transform: translateZ(-5px);
        }

        // 线框效果
        text-stroke: 1px rgba(100, 200, 255, 0.3);
        -webkit-text-stroke: 1px rgba(100, 200, 255, 0.3);
      }

      p {
        font-size: 1rem;
        letter-spacing: 4px;
        margin: 0;
        opacity: 0.8;
        text-transform: uppercase;
        transform: translateZ(10px);
        font-family: 'Orbitron', 'Arial', sans-serif;

        // 添加打字机效果
        overflow: hidden;
        white-space: nowrap;
        animation: typing 3s steps(30) forwards;
        max-width: 0;
        margin: 0 auto;
      }

      // 粒子容器
      .particles-container {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        pointer-events: none;
        z-index: -1;

        .particle {
          position: absolute;
          background: rgba(100, 200, 255, 0.8);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(100, 200, 255, 0.8);
          animation: float 3s infinite ease-in-out;
        }
      }

      // 扫描线效果
      .scanlines {
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

      // 镜头光晕效果
      .lens-flare {
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

      // 不同动画类型的标题特效
      .cinematic-intro[data-animation-type="space-warp"] & {
        h1 {
          animation: titleGlitch 0.5s infinite;
        }
      }

      .cinematic-intro[data-animation-type="matrix-hack"] & {
        h1 {
          color: #0f0;
          text-shadow: 0 0 10px #0f0;

          &::before {
            color: rgba(0, 255, 0, 0.5);
            animation: matrixGlow 1s infinite alternate;
          }
        }

        p {
          color: #0f0;
        }
      }

      .cinematic-intro[data-animation-type="quantum-shift"] & {
        .particles-container .particle {
          animation: quantumFloat 1s infinite ease-in-out;
        }

        h1 {
          animation: titleFlicker 0.2s infinite;
        }
      }
    }

    // 添加相应的CSS
    .dynamic-effects {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 5;

      .speed-lines {
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

      .vignette {
        position: absolute;
        width: 100%;
        height: 100%;
        box-shadow: inset 0 0 300px rgba(0, 0, 0, 0);
        animation: vignetteAppear 8s ease-in-out forwards;
      }

      .motion-blur {
        position: absolute;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(0px);
        animation: motionBlurEffect 8s ease-in-out forwards;
      }
    }

    // 为史诗俯冲添加标题特殊效果
    &[data-animation-type="epic-dive"] .title-card {
      h1 {
        animation: titleShake 8s ease-in-out forwards;
      }
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes titleCard {
    0% {
      opacity: 0;
      transform: translate(-50%, -40%) rotateX(20deg) scale(0.8);
      filter: blur(10px);
    }
    30% {
      opacity: 1;
      transform: translate(-50%, -50%) rotateX(0deg) scale(1);
      filter: blur(0px);
    }
    70% {
      opacity: 1;
      transform: translate(-50%, -50%) rotateX(0deg) scale(1);
      filter: blur(0px);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -60%) rotateX(-10deg) scale(0.9);
      filter: blur(5px);
    }
  }

  // 添加科技感发光动画
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

  // 打字机效果
  @keyframes typing {
    0% {
      max-width: 0;
    }
    70% {
      max-width: 100%;
    }
    100% {
      max-width: 100%;
    }
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
    0%, 100% {
      transform: translateZ(20px);
    }
    20% {
      transform: translateX(-5px) translateZ(20px);
    }
    40% {
      transform: translateX(5px) translateZ(20px);
    }
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
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
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

  @keyframes titleShake {
    0%, 20% { transform: translateZ(20px); }
    40%, 45% { transform: translateZ(20px) translateX(2px); }
    50%, 55% { transform: translateZ(20px) translateX(-2px); }
    60% { transform: translateZ(20px) translateX(1px); }
    70% { transform: translateZ(20px); }
    100% { transform: translateZ(20px) translateY(-10px); }
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

  // 动画选择器样式
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

  // 视角控制面板
  .view-controls {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    color: white;
    z-index: 100;
    min-width: 200px;

    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      opacity: 0.9;
      text-align: center;
    }

    .view-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;

      .view-btn {
        padding: 8px 4px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        color: white;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }

        &.default {
          grid-column: span 3;
          background: rgba(76, 175, 80, 0.3);
          border-color: rgba(76, 175, 80, 0.5);

          &:hover {
            background: rgba(76, 175, 80, 0.4);
          }
        }
      }
    }

    // 移动端优化
    @media (max-width: 768px) {
      top: 15px;
      right: 15px;
      padding: 12px;
      min-width: 160px;

      h4 {
        font-size: 12px;
      }

      .view-buttons {
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;

        .view-btn {
          padding: 6px 3px;
          font-size: 11px;
        }
      }
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
}
</style>
