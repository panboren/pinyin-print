<!-- src/components/CinematicIntro.vue -->
<template>
  <div>
    <div
      v-if="!animationComplete"
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
      <span>动画类型11:</span>
      <select
        v-model="animationType"
        @change="(e) => resetAnimation(e.target.value)"
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'

// 添加 THREE 的导入
import * as THREE from 'three'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  },
  /*  animationType: {
    type: String,
    default: 'epic-dive'
  },*/
  camera: {
    type: Object,
    default: () => null
  },
  controls: {
    type: Object,
    default: () => null
  },
  renderer: {
    type: Object,
    default: () => null
  },
  scene: {
    type: Object,
    default: () => null
  }
})






let animationType = defineModel({type: String, default: 'epic-dive'})

const emit = defineEmits(['complete'])

const animationComplete = ref(false)

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

// 创建自定义对象来保存相机旋转值，这样GSAP可以动画
const cameraRotation = {
  x: 0,
  y: 0,
  z: 0
}

// 动画1: 史诗俯冲
const animateEpicDive = () => {
  if (!props.camera || !props.controls) return

  // 起始相机位置：从更高更远的位置开始
  const startPos = new THREE.Vector3(2000, 2500, 2000)
  props.camera.position.copy(startPos)

  // 初始FOV：更极端的广角视野
  props.camera.fov = 170
  props.camera.updateProjectionMatrix()

  // 初始渲染
  if (props.scene) {
    props.renderer.render(props.scene, props.camera)
  }

  // 暂时禁用用户交互
  props.controls.enabled = false

  // 创建辅助变量用于螺旋效果
  let spiralIntensity = { value: 0 }
  let cameraVelocity = { x: 0, y: 0, z: 0 }

  const tl = gsap.timeline({
    onComplete: () => {
      console.log('优化后的史诗俯冲动画完成')
      props.controls.enabled = true
      animationComplete.value = true
      emit('complete',true)
    }
  })

  // 第一阶段：空中悬浮观察
  tl.to(props.camera.position, {
    x: 1800,
    y: 2200,
    z: 1800,
    duration: 1,
    ease: 'power2.inOut',
    onUpdate: () => {
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  })

  // 第二阶段：开始加速俯冲，轻微螺旋
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
    onUpdate: () => {
      // 添加螺旋效果
      const time = tl.time()
      const spiralX = Math.sin(time * 2) * 30 * spiralIntensity.value
      const spiralZ = Math.cos(time * 2) * 30 * spiralIntensity.value
      props.camera.position.x += spiralX * 0.1
      props.camera.position.z += spiralZ * 0.1
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 1)

  // 同时开始收缩FOV，增强速度感
  tl.to(props.camera, {
    fov: 140,
    duration: 1.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 1.5)

  // 第三阶段：高速俯冲，剧烈螺旋
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
    onUpdate: () => {
      // 增强螺旋效果
      const time = tl.time()
      const spiralX = Math.sin(time * 3) * 50 * spiralIntensity.value
      const spiralZ = Math.cos(time * 3) * 50 * spiralIntensity.value
      props.camera.position.x += spiralX * 0.2
      props.camera.position.z += spiralZ * 0.2
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 2.5)

  // 快速收缩FOV，增强速度冲击感
  tl.to(props.camera, {
    fov: 100,
    duration: 1,
    ease: 'power2.in',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 3)

  // 第四阶段：穿越云层，减速开始
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
    onUpdate: () => {
      // 减弱螺旋效果
      const time = tl.time()
      const spiralX = Math.sin(time * 2) * 20 * spiralIntensity.value
      const spiralZ = Math.cos(time * 2) * 20 * spiralIntensity.value
      props.camera.position.x += spiralX * 0.15
      props.camera.position.z += spiralZ * 0.15
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 3.8)

  // 继续收缩FOV
  tl.to(props.camera, {
    fov: 85,
    duration: 1,
    ease: 'power2.out',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 4)

  // 第五阶段：接近地面，稳定视角
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
    onUpdate: () => {
      // 微弱螺旋
      const time = tl.time()
      const spiralX = Math.sin(time * 1.5) * 5 * spiralIntensity.value
      const spiralZ = Math.cos(time * 1.5) * 5 * spiralIntensity.value
      props.camera.position.x += spiralX * 0.1
      props.camera.position.z += spiralZ * 0.1
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 5)

  // 调整FOV到接近正常
  tl.to(props.camera, {
    fov: 78,
    duration: 0.8,
    ease: 'power2.out',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 6)

  // 第六阶段：最终精准定位
  tl.to(spiralIntensity, {
    value: 0,
    duration: 0.5,
    ease: 'power1.out'
  }, 6.3)

  tl.to(props.camera.position, {
    x: 0.01,
    y: 0.01,
    z: 0.01,
    duration: 0.8,
    ease: 'power1.out',
    onUpdate: () => {
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 6.3)

  // 完全正常FOV
  tl.to(props.camera, {
    fov: 75,
    duration: 0.5,
    ease: 'power1.out',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 6.5)

  // 第七阶段：平滑旋转到最终视角
  tl.to(cameraRotation, {
    x: 0,
    y: Math.PI / 2.5,
    z: 0,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: function() {
      // 使用球坐标更新相机位置
      const spherical = new THREE.Spherical()
      spherical.radius = 0.01
      spherical.theta = cameraRotation.y
      spherical.phi = Math.PI / 1.9

      props.camera.position.setFromSpherical(spherical)
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 6.8)

  // 添加视觉冲击效果 - 快速闪烁
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
}

// 动画2: 空间扭曲
const animateSpaceWarp = () => {
  if (!props.camera || !props.controls) return

  // 初始设置：从黑洞中心观察
  props.camera.position.set(0, 0, 1000)

  // 初始FOV：极广角
  props.camera.fov = 170
  props.camera.updateProjectionMatrix()

  // 初始渲染
  if (props.scene) {
    props.renderer.render(props.scene, props.camera)
  }

  // 暂时禁用用户交互
  props.controls.enabled = false

  // 重置旋转对象
  cameraRotation.x = 0
  cameraRotation.y = 0
  cameraRotation.z = 0

  const tl = gsap.timeline({
    onComplete: () => {
      console.log('空间扭曲动画完成')
      props.controls.enabled = true
      animationComplete.value = true
      emit('complete')
    }
  })

  // 第一阶段：剧烈扭曲，快速拉近
  tl.to(props.camera.position, {
    x: 0,
    y: 0,
    z: 100,
    duration: 2,
    ease: 'power4.in',
    onUpdate: () => {
      // 添加扭曲效果
      const time = tl.time()
      const warpAmount = 1 - (props.camera.position.z / 1000)

      // 使用自定义旋转对象来应用扭曲效果
      cameraRotation.z = Math.sin(time * 5) * warpAmount * 0.1
      props.camera.rotation.z = cameraRotation.z

      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  })

  // 第二阶段：FOV快速收缩，模拟时空压缩
  tl.to(props.camera, {
    fov: 120,
    duration: 1,
    ease: 'power2.inOut',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 1.5)

  tl.to(props.camera.position, {
    x: 10,
    y: 5,
    z: 10,
    duration: 1,
    ease: 'power2.inOut',
    onUpdate: () => {
      // 减弱扭曲效果
      const time = tl.time()
      const warpAmount = props.camera.position.z / 100
      cameraRotation.z = Math.sin(time * 3) * warpAmount * 0.05
      props.camera.rotation.z = cameraRotation.z

      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 1.5)

  // 第三阶段：螺旋下降
  tl.to(props.camera, {
    fov: 85,
    duration: 1,
    ease: 'power2.inOut',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 2.5)

  tl.to(props.camera.position, {
    x: 2,
    y: 1,
    z: 2,
    duration: 1,
    ease: 'power2.inOut',
    onUpdate: () => {
      // 螺旋旋转
      const time = tl.time()
      const spiralRadius = props.camera.position.z * 0.5
      const spiralX = Math.cos(time * 2) * spiralRadius
      const spiralZ = Math.sin(time * 2) * spiralRadius
      props.camera.position.x = spiralX
      props.camera.position.z = spiralZ
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 2.5)

  // 第四阶段：最终定位
  tl.to(props.camera, {
    fov: 75,
    duration: 0.5,
    ease: 'power1.out',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 3.5)

  // 重置扭曲旋转
  tl.to(cameraRotation, {
    z: 0,
    duration: 0.5,
    ease: 'power1.out',
    onUpdate: function() {
      props.camera.rotation.z = cameraRotation.z
    }
  }, 3.5)

  tl.to(props.camera.position, {
    x: 0.01,
    y: 0.01,
    z: 0.01,
    duration: 0.5,
    ease: 'power1.out',
    onUpdate: () => {
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 3.5)

  // 第五阶段：平滑旋转到最终视角
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

      props.camera.position.setFromSpherical(spherical)
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 4)
}

// 动画3: 黑客帝国
const animateMatrixHack = () => {
  if (!props.camera || !props.controls) return

  // 初始设置：从顶部俯视
  props.camera.position.set(0, 500, 0)
  props.camera.lookAt(0, 0, 0)

  // 初始FOV：鸟瞰视角
  props.camera.fov = 120
  props.camera.updateProjectionMatrix()

  // 初始渲染
  if (props.scene) {
    props.renderer.render(props.scene, props.camera)
  }

  // 暂时禁用用户交互
  props.controls.enabled = false

  const tl = gsap.timeline({
    onComplete: () => {
      console.log('黑客帝国动画完成')
      props.controls.enabled = true
      animationComplete.value = true
      emit('complete')
    }
  })

  // 第一阶段：下落效果
  tl.to(props.camera.position, {
    y: 50,
    duration: 2,
    ease: 'power4.in',
    onUpdate: () => {
      // 添加轻微摇晃效果
      const time = tl.time()
      const wobbleX = Math.sin(time * 10) * 0.5
      const wobbleZ = Math.cos(time * 10) * 0.5
      props.camera.position.x = wobbleX
      props.camera.position.z = wobbleZ
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  })

  // 第二阶段：减速并调整视角
  tl.to(props.camera.position, {
    y: 10,
    x: 5,
    z: 5,
    duration: 1,
    ease: 'power2.out',
    onUpdate: () => {
      // 逐渐减小摇晃
      const time = tl.time()
      const wobbleX = Math.sin(time * 5) * 0.2
      const wobbleZ = Math.cos(time * 5) * 0.2
      props.camera.position.x = 5 + wobbleX
      props.camera.position.z = 5 + wobbleZ
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 2)

  tl.to(props.camera, {
    fov: 90,
    duration: 1,
    ease: 'power2.inOut',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 2)

  // 第三阶段：平移到最终位置
  tl.to(props.camera.position, {
    x: 0.01,
    y: 0.01,
    z: 0.01,
    duration: 1,
    ease: 'power2.inOut',
    onUpdate: () => {
      // 进一步减小摇晃
      const time = tl.time()
      const wobbleX = Math.sin(time * 3) * 0.05
      const wobbleZ = Math.cos(time * 3) * 0.05
      props.camera.position.x = wobbleX
      props.camera.position.z = wobbleZ
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 3)

  tl.to(props.camera, {
    fov: 75,
    duration: 0.5,
    ease: 'power1.out',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 3.5)

  // 第五阶段：平滑旋转到最终视角
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

      props.camera.position.setFromSpherical(spherical)
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 4)
}

// 动画4: 量子跃迁
const animateQuantumShift = () => {
  if (!props.camera || !props.controls) return

  // 初始设置：从随机位置开始
  const randomTheta = Math.random() * Math.PI * 2
  const randomPhi = Math.random() * Math.PI
  const randomRadius = 1000

  const randomPos = new THREE.Vector3()
  randomPos.setFromSphericalCoords(randomRadius, randomPhi, randomTheta)
  props.camera.position.copy(randomPos)

  // 初始FOV：极广角
  props.camera.fov = 170
  props.camera.updateProjectionMatrix()

  // 初始渲染
  if (props.scene) {
    props.renderer.render(props.scene, props.camera)
  }

  // 暂时禁用用户交互
  props.controls.enabled = false

  const tl = gsap.timeline({
    onComplete: () => {
      console.log('量子跃迁动画完成')
      props.controls.enabled = true
      animationComplete.value = true
      emit('complete')
    }
  })

  // 第一阶段：多次跃迁
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
      onUpdate: () => {
        props.camera.lookAt(props.controls.target)
        props.controls.update()
      }
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

  // 第二阶段：最终跃迁到附近
  tl.to(props.camera.position, {
    x: 10,
    y: 15,
    z: 10,
    duration: 0.5,
    ease: 'power1.inOut',
    onUpdate: () => {
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 1.5)

  tl.to(props.camera, {
    fov: 120,
    duration: 0.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 1.5)

  // 第三阶段：稳定接近
  tl.to(props.camera.position, {
    x: 2,
    y: 3,
    z: 2,
    duration: 1,
    ease: 'power2.inOut',
    onUpdate: () => {
      // 添加轻微量子抖动
      const time = tl.time()
      const wobbleX = (Math.random() - 0.5) * 0.1
      const wobbleY = (Math.random() - 0.5) * 0.1
      const wobbleZ = (Math.random() - 0.5) * 0.1
      props.camera.position.x = 2 + wobbleX
      props.camera.position.y = 3 + wobbleY
      props.camera.position.z = 2 + wobbleZ
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 2)

  tl.to(props.camera, {
    fov: 90,
    duration: 0.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 2.5)

  // 第四阶段：最终定位
  tl.to(props.camera.position, {
    x: 0.01,
    y: 0.01,
    z: 0.01,
    duration: 0.5,
    ease: 'power1.out',
    onUpdate: () => {
      // 进一步减小抖动
      const time = tl.time()
      const wobbleX = (Math.random() - 0.5) * 0.02
      const wobbleY = (Math.random() - 0.5) * 0.02
      const wobbleZ = (Math.random() - 0.5) * 0.02
      props.camera.position.x = wobbleX
      props.camera.position.y = wobbleY
      props.camera.position.z = wobbleZ
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 3)

  tl.to(props.camera, {
    fov: 75,
    duration: 0.5,
    ease: 'power1.out',
    onUpdate: () => {
      props.camera.updateProjectionMatrix()
    }
  }, 3.5)

  // 第五阶段：平滑旋转到最终视角
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

      props.camera.position.setFromSpherical(spherical)
      props.camera.lookAt(props.controls.target)
      props.controls.update()
    }
  }, 4)
}

// 根据类型执行动画
const playAnimation = () => {
  animationComplete.value = false

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
}

// 修改后的 animateToDefaultView 函数
const animateToDefaultView = () => {
  if (!props.camera || !props.controls) return

  // 确保目标点在球心
  props.controls.target.set(0, 0, 0)

  // 播放开场动画
  if (playAnimation) {
    playAnimation()
  }
}

// 重置动画
const resetAnimation = (value) => {
  if(value) {
    animationType.value = value
  }
  emit('complete', false)
  setTimeout(() => {
    animateToDefaultView()
  }, 100)
}

defineExpose({
  playAnimation
})
</script>

<style scoped lang="scss">
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
  &[data-animation-type="epic-dive"] .title-card {
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
</style>
