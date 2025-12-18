<template>
  <div
    ref="containerRef"
    class="home-content"
    @dblclick="toggleAutoRotate"
  >
    <canvas ref="canvasRef" />
    <div class="controls-hint">
      <p>🖱️ 左键拖拽旋转 | 🔍 滚轮缩放 | 📱 触摸手势控制</p>
      <p>🔄 双击切换自动旋转</p>
    </div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { onMounted, ref, onUnmounted } from 'vue'
// 导入本地图片资源
import homeImage from '@/assets/image/home.jpg'

const containerRef = ref(null)
const canvasRef = ref(null)

let scene, camera, renderer, mesh
let controls
let animationId
let isLoading = ref(true)
let autoRotateEnabled = ref(false)

// 初始化 Three.js 场景
const initThreeJS = () => {
  // 创建场景
  scene = new THREE.Scene()

  // 设置背景色为黑色，避免加载时的闪烁
  scene.background = new THREE.Color(0x000000)

  // 创建相机 - 优化视野角度提供更好的沉浸感
  camera = new THREE.PerspectiveCamera(
    75,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 0.1) // 稍微偏移避免相机在球心

  // 创建渲染器 - 优化设置
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true, // 开启抗锯齿提升视觉质量
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false // 优化性能
  })

  // 设置渲染器尺寸和像素比
  const pixelRatio = Math.min(window.devicePixelRatio, 2)
  renderer.setSize(
    containerRef.value.clientWidth,
    containerRef.value.clientHeight
  )
  renderer.setPixelRatio(pixelRatio)

  // 优化渲染设置
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.outputColorSpace = THREE.SRGBColorSpace

  // 加载全景图纹理 - 优化加载流程
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(
    homeImage,
    (loadedTexture) => {
      // 纹理加载完成
      console.log('全景图加载完成')
      isLoading.value = false

      // 优化纹理参数
      loadedTexture.wrapS = THREE.ClampToEdgeWrapping
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping
      loadedTexture.minFilter = THREE.LinearFilter
      loadedTexture.magFilter = THREE.LinearFilter
      loadedTexture.generateMipmaps = true
      loadedTexture.anisotropy = renderer.capabilities.getMaxAnisotropy() || 4

      // 触发一次强制渲染
      renderer.render(scene, camera)
    },
    (progress) => {
      // 加载进度
      const percentComplete = (progress.loaded / progress.total) * 100
      console.log(`加载进度: ${percentComplete.toFixed(2)}%`)
    },
    (err) => {
      console.error('纹理加载失败:', err)
      isLoading.value = false

      // 创建默认的渐变背景作为fallback
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')

      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
      gradient.addColorStop(0, '#4a90e2')
      gradient.addColorStop(1, '#1a237e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 512, 512)

      const fallbackTexture = new THREE.CanvasTexture(canvas)
      mesh.material.map = fallbackTexture
      mesh.material.needsUpdate = true
    }
  )

  // 创建球体几何体 - 优化分段数平衡性能和质量
  const geometry = new THREE.SphereGeometry(500, 64, 32)
  geometry.scale(-1, 1, 1) // 翻转球体内部显示

  // 创建材质 - 优化设置
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide, // 双面渲染避免背面问题
    transparent: false,
    opacity: 1.0
  })

  // 创建网格
  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // 创建轨道控制器 - 完全优化配置
  controls = new OrbitControls(camera, renderer.domElement)

  // 基础控制设置
  controls.enableZoom = true
  controls.enablePan = false // 禁用平移，专注于旋转和缩放
  controls.autoRotate = autoRotateEnabled.value

  // 旋转速度设置
  controls.autoRotateSpeed = 0.3 // 更慢的自动旋转速度，更舒适
  controls.rotateSpeed = 0.4    // 手动旋转速度适中

  // 缩放设置
  controls.zoomSpeed = 0.8
  controls.minDistance = 0.1   // 最小缩放距离
  controls.maxDistance = 10    // 最大缩放距离，限制过度缩放

  // 阻尼设置 - 提升交互流畅度
  controls.enableDamping = true
  controls.dampingFactor = 0.04 // 更精细的阻尼控制

  // 限制设置 - 避免不自然的视角
  controls.minPolarAngle = 0.1    // 最小仰角，避免顶部视角问题
  controls.maxPolarAngle = Math.PI - 0.1 // 最大仰角
  controls.minAzimuthAngle = -Infinity  // 水平旋转无限制
  controls.maxAzimuthAngle = Infinity

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

  // 启动渲染循环
  animate()
}

// 渲染动画循环 - 优化性能
const animate = () => {
  animationId = requestAnimationFrame(animate)

  // 更新控制器（启用阻尼后必须调用）
  if (controls) {
    controls.update()
  }

  // 只在需要时渲染
  if (needsRender()) {
    renderer.render(scene, camera)
  }
}

// 渲染优化检查
let lastRenderTime = 0
const needsRender = () => {
  const now = performance.now()
  // 限制帧率到60fps，避免不必要的渲染
  if (now - lastRenderTime > 16) {
    lastRenderTime = now
    return true
  }
  return controls && (controls.autoRotate || controls.isUserInteracting)
}

// 处理窗口大小变化 - 添加节流
let resizeTimeout
const handleResize = () => {
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
  }, 100) // 100ms节流
}

// 双击切换自动旋转
const toggleAutoRotate = () => {
  if (controls) {
    autoRotateEnabled.value = !autoRotateEnabled.value
    controls.autoRotate = autoRotateEnabled.value
    console.log(`自动旋转: ${autoRotateEnabled.value ? '开启' : '关闭'}`)
  }
}

// 页面可见性变化处理 - 优化性能
const handleVisibilityChange = () => {
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
}

onMounted(() => {
  initThreeJS()
  window.addEventListener('resize', handleResize)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // 预加载纹理
  const textureLoader = new THREE.TextureLoader()
  textureLoader.load(homeImage)
})

onUnmounted(() => {
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

    // 优化移动端体验
    @media (pointer: coarse) {
      touch-action: pan-y pinch-zoom;
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
