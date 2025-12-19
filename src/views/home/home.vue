<!-- src/views/home/home.vue -->
<template>
  <div
    ref="containerRef"
    class="home-content"
    @dblclick="toggleAutoRotate"
  >
    <canvas ref="canvasRef" />

    <!-- 电影级加载状态指示器 -->
    <div
      v-if="isLoading"
      class="loading-indicator"
    >
      <div class="loading-spinner" />
      <p>正在加载ZOOOW智慧工具...</p>
      <div class="loading-progress">
        准备进入沉浸式体验
      </div>
    </div>

    <!-- 电影级开场黑屏 -->
    <CinematicIntro
      ref="cinematicIntroRef"
      :animation-type="animationType"
      :camera="camera"
      :controls="controls"
      :renderer="renderer"
      @complete="onAnimationComplete"
    />

    <!-- 动画选择器（开发时可见，生产环境可隐藏） -->
    <div
      v-if="!isLoading"
      class="animation-selector"
    >
      <span>动画类型:</span>
      <select
        v-model="animationType"
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
      <button @click="resetAnimation">
        重新播放
      </button>
    </div>

    <!-- 视角控制面板 -->
    <ViewControls />

    <div class="controls-hint">
      <p>🖱️ 左键拖拽旋转 | 🔍 滚轮缩放 | 📱 触摸手势控制</p>
      <p>🔄 双击切换自动旋转 | 🎯 使用视角按钮快速定位</p>
    </div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { gsap } from 'gsap'
import { onMounted, ref, onUnmounted } from 'vue'
import CinematicIntro from '@/components/CinematicIntro.vue'
import ViewControls from '@/components/ViewControls.vue'
// 导入本地图片资源
import homeImage from '@/assets/image/home1.png'

const containerRef = ref(null)
const canvasRef = ref(null)
const cinematicIntroRef = ref(null)

let scene, camera, renderer, mesh
let controls
let animationId
let isLoading = ref(true)
let autoRotateEnabled = ref(false)
let animationComplete = ref(false)

// 在script setup部分添加这些变量
const animationType = ref('epic-dive') // 默认动画类型

// 初始化 Three.js 场景
const initThreeJS = () => {
  // 创建场景
  scene = new THREE.Scene()

  // 设置背景色为黑色，避免加载时的闪烁
  scene.background = new THREE.Color(0x000000)

  // 创建相机 - 专业级设置提升清晰度
  camera = new THREE.PerspectiveCamera(
    75,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    0.01,  // 更近的近裁剪面提升近距离精度
    2000   // 更远的远裁剪面
  )
  camera.position.set(0, 0, 0.01) // 最小偏移避免z-fighting

  // 设置默认视角 - 优化初始观看角度
  camera.rotation.set(0, Math.PI / 4, 0) // 默认向右旋转45度
  camera.fov = 75 // 保持合适的视野角度

  // 相机精度优化
  camera.updateProjectionMatrix()

  // 创建渲染器 - 专业级清晰度设置
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
    precision: 'highp', // 使用高精度着色器
    stencil: false,     // 禁用模板缓冲提升性能
    depth: true
  })

  // 设置渲染器尺寸和像素比 - 极致清晰度
  const pixelRatio = Math.min(window.devicePixelRatio, 4) // 提高到4倍极致清晰
  renderer.setSize(
    containerRef.value.clientWidth,
    containerRef.value.clientHeight,
    true // 更新样式
  )
  renderer.setPixelRatio(pixelRatio)

  // 高级渲染设置 - 最大化清晰度
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.3 // 进一步增加曝光
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.gammaFactor = 2.2
  renderer.gammaOutput = true
  renderer.physicallyCorrectLights = true
  renderer.shadowMap.enabled = false // 全景图不需要阴影，提升性能

  // 加载全景图纹理 - 优化加载流程
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(
    homeImage,
    (loadedTexture) => {
      // 纹理加载完成
      console.log('全景图加载完成')
      isLoading.value = false

      // 优化纹理参数 - 专业级清晰度
      loadedTexture.wrapS = THREE.ClampToEdgeWrapping
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping

      // 使用最高质量过滤
      loadedTexture.minFilter = THREE.LinearMipmapLinearFilter
      loadedTexture.magFilter = THREE.LinearFilter
      loadedTexture.generateMipmaps = true

      // 启用最大各向异性过滤，显著提升斜视角清晰度
      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
      loadedTexture.anisotropy = maxAnisotropy // 使用硬件支持的最大值

      // 确保正确的色彩空间和精度
      loadedTexture.colorSpace = THREE.SRGBColorSpace
      loadedTexture.format = THREE.RGBAFormat // 使用RGBA格式确保最佳质量

      // 纹理精度设置
      loadedTexture.type = THREE.UnsignedByteType
      loadedTexture.anisotropy = maxAnisotropy

      // 动画进入默认视角
      animateToDefaultView()
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
      gradient.addColorStop(0, '#c532f6')
      gradient.addColorStop(1, '#c4163e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 512, 512)

      const fallbackTexture = new THREE.CanvasTexture(canvas)
      mesh.material.map = fallbackTexture
      mesh.material.needsUpdate = true
    }
  )

  // 创建球体几何体 - 极致精度设置
  const geometry = new THREE.SphereGeometry(500, 256, 128) // 极高精度分段数
  geometry.scale(-1, 1, 1) // 翻转球体内部显示

  // 优化几何体属性
  geometry.computeVertexNormals() // 重新计算法向量确保正确的光照

  // 创建材质 - 专业级质量设置
  const material = new THREE.MeshBasicMaterial({
    map: texture,
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
  setCameraView('default')
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 4))
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

// 修改后的 animateToDefaultView 函数
const animateToDefaultView = () => {
  if (!camera || !controls) return

  // 确保目标点在球心
  controls.target.set(0, 0, 0)

  // 播放开场动画
  if (cinematicIntroRef.value) {
    cinematicIntroRef.value.playAnimation()
  }
}

// 重置动画
const resetAnimation = () => {
  animationComplete.value = false
  setTimeout(() => {
    animateToDefaultView()
  }, 100)
}

// 动画完成回调
const onAnimationComplete = () => {
  animationComplete.value = true
}

// 预设视角函数 - 从当前位置平滑过渡
const setCameraView = (preset) => {
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
      // 限制极角在控制器范围内
      currentSpherical.phi = Math.max(controls.minPolarAngle, Math.min(controls.maxPolarAngle, currentSpherical.phi))
      currentSpherical.makeSafe()

      // 从当前位置平滑过渡到新位置
      controls.object.position.setFromSpherical(currentSpherical)
      controls.object.lookAt(controls.target)
      controls.update()
    },
    onComplete: () => {
      console.log(`从当前位置切换到预设视角: ${preset}`)
    }
  })
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


// 提供给子组件使用的方法
provide('setCameraView', setCameraView)
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

    // 添加3D动画效果
    @keyframes titleCard3D {
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

  // 为史诗俯冲添加标题特殊效果
  .cinematic-intro[data-animation-type="epic-dive"] .title-card {
    h1 {
      animation: titleShake 8s ease-in-out forwards;
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

    select, button {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  // 增强的标题卡片样式
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

  // 动画效果定义
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

  // 修改原有的标题卡片动画
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
















}
</style>
