// src/hooks/useCinematicAnimations.js

import { ref } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'

export function useCinematicAnimations(scene, camera, renderer, controls) {
  // 状态管理
  const animationComplete = ref(false)
  const animationType = ref('epic-dive')

  // 创建自定义对象来保存相机旋转值，这样GSAP可以动画
  const cameraRotation = {
    x: 0,
    y: 0,
    z: 0
  }

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

  // 重置动画
  const resetAnimation = () => {
    animationComplete.value = false
    setTimeout(() => {
      animateToDefaultView()
    }, 100)
  }

  // 修改后的 animateToDefaultView 函数
  const animateToDefaultView = () => {
    if (!camera || !controls) return

    // 确保目标点在球心
    controls.target.set(0, 0, 0)

    // 根据选择的动画类型执行不同的动画序列
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

  // 动画1: 史诗俯冲
  const animateEpicDive = () => {
    // 起始相机位置：从更高更远的位置开始
    const startPos = new THREE.Vector3(2000, 2500, 2000)
    camera.position.copy(startPos)

    // 初始FOV：更极端的广角视野
    camera.fov = 170
    camera.updateProjectionMatrix()

    // 初始渲染
    renderer.render(scene, camera)

    // 暂时禁用用户交互
    controls.enabled = false

    // 创建辅助变量用于螺旋效果
    const spiralIntensity = { value: 0 }
    const cameraVelocity = { x: 0, y: 0, z: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        console.log('优化后的史诗俯冲动画完成')
        controls.enabled = true
        animationComplete.value = true
      }
    })

    // 第一阶段：空中悬浮观察
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

    // 第二阶段：开始加速俯冲，轻微螺旋
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
        // 添加螺旋效果
        const time = tl.time()
        const spiralX = Math.sin(time * 2) * 30 * spiralIntensity.value
        const spiralZ = Math.cos(time * 2) * 30 * spiralIntensity.value
        camera.position.x += spiralX * 0.1
        camera.position.z += spiralZ * 0.1
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 1)

    // 同时开始收缩FOV，增强速度感
    tl.to(camera, {
      fov: 140,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 1.5)

    // 第三阶段：高速俯冲，剧烈螺旋
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
        // 增强螺旋效果
        const time = tl.time()
        const spiralX = Math.sin(time * 3) * 50 * spiralIntensity.value
        const spiralZ = Math.cos(time * 3) * 50 * spiralIntensity.value
        camera.position.x += spiralX * 0.2
        camera.position.z += spiralZ * 0.2
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 2.5)

    // 快速收缩FOV，增强速度冲击感
    tl.to(camera, {
      fov: 100,
      duration: 1,
      ease: 'power2.in',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 3)

    // 第四阶段：穿越云层，减速开始
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
        // 减弱螺旋效果
        const time = tl.time()
        const spiralX = Math.sin(time * 2) * 20 * spiralIntensity.value
        const spiralZ = Math.cos(time * 2) * 20 * spiralIntensity.value
        camera.position.x += spiralX * 0.15
        camera.position.z += spiralZ * 0.15
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 3.8)

    // 继续收缩FOV
    tl.to(camera, {
      fov: 85,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 4)

    // 第五阶段：接近地面，稳定视角
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
        // 微弱螺旋
        const time = tl.time()
        const spiralX = Math.sin(time * 1.5) * 5 * spiralIntensity.value
        const spiralZ = Math.cos(time * 1.5) * 5 * spiralIntensity.value
        camera.position.x += spiralX * 0.1
        camera.position.z += spiralZ * 0.1
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 5)

    // 调整FOV到接近正常
    tl.to(camera, {
      fov: 78,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 6)

    // 第六阶段：最终精准定位
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

    // 完全正常FOV
    tl.to(camera, {
      fov: 75,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
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

        camera.position.setFromSpherical(spherical)
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 6.8)

    // 添加视觉冲击效果 - 快速闪烁
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
  }

  // 动画2: 空间扭曲
  const animateSpaceWarp = () => {
    // 初始设置：从黑洞中心观察
    camera.position.set(0, 0, 1000)

    // 初始FOV：极广角
    camera.fov = 170
    camera.updateProjectionMatrix()

    // 初始渲染
    renderer.render(scene, camera)

    // 暂时禁用用户交互
    controls.enabled = false

    // 重置旋转对象
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

    // 第一阶段：剧烈扭曲，快速拉近
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => {
        // 添加扭曲效果
        const time = tl.time()
        const warpAmount = 1 - (camera.position.z / 1000)

        // 使用自定义旋转对象来应用扭曲效果
        cameraRotation.z = Math.sin(time * 5) * warpAmount * 0.1
        camera.rotation.z = cameraRotation.z

        camera.lookAt(controls.target)
        controls.update()
      }
    })

    // 第二阶段：FOV快速收缩，模拟时空压缩
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
        // 减弱扭曲效果
        const time = tl.time()
        const warpAmount = camera.position.z / 100
        cameraRotation.z = Math.sin(time * 3) * warpAmount * 0.05
        camera.rotation.z = cameraRotation.z

        camera.lookAt(controls.target)
        controls.update()
      }
    }, 1.5)

    // 第三阶段：螺旋下降
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
        // 螺旋旋转
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

    // 第四阶段：最终定位
    tl.to(camera, {
      fov: 75,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    }, 3.5)

    // 重置扭曲旋转
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

        camera.position.setFromSpherical(spherical)
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 4)
  }

  // 动画3: 黑客帝国
  const animateMatrixHack = () => {
    // 初始设置：从顶部俯视
    camera.position.set(0, 500, 0)
    camera.lookAt(0, 0, 0)

    // 初始FOV：鸟瞰视角
    camera.fov = 120
    camera.updateProjectionMatrix()

    // 初始渲染
    renderer.render(scene, camera)

    // 暂时禁用用户交互
    controls.enabled = false

    const tl = gsap.timeline({
      onComplete: () => {
        console.log('黑客帝国动画完成')
        controls.enabled = true
        animationComplete.value = true
      }
    })

    // 第一阶段：下落效果
    tl.to(camera.position, {
      y: 50,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => {
        // 添加轻微摇晃效果
        const time = tl.time()
        const wobbleX = Math.sin(time * 10) * 0.5
        const wobbleZ = Math.cos(time * 10) * 0.5
        camera.position.x = wobbleX
        camera.position.z = wobbleZ
        camera.lookAt(controls.target)
        controls.update()
      }
    })

    // 第二阶段：减速并调整视角
    tl.to(camera.position, {
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

    // 第三阶段：平移到最终位置
    tl.to(camera.position, {
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

        camera.position.setFromSpherical(spherical)
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 4)
  }

  // 动画4: 量子跃迁
  const animateQuantumShift = () => {
    // 初始设置：从随机位置开始
    const randomTheta = Math.random() * Math.PI * 2
    const randomPhi = Math.random() * Math.PI
    const randomRadius = 1000

    const randomPos = new THREE.Vector3()
    randomPos.setFromSphericalCoords(randomRadius, randomPhi, randomTheta)
    camera.position.copy(randomPos)

    // 初始FOV：极广角
    camera.fov = 170
    camera.updateProjectionMatrix()

    // 初始渲染
    renderer.render(scene, camera)

    // 暂时禁用用户交互
    controls.enabled = false

    const tl = gsap.timeline({
      onComplete: () => {
        console.log('量子跃迁动画完成')
        controls.enabled = true
        animationComplete.value = true
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

      // 闪烁效果
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

    // 第二阶段：最终跃迁到附近
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

    // 第三阶段：稳定接近
    tl.to(camera.position, {
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

    // 第四阶段：最终定位
    tl.to(camera.position, {
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

        camera.position.setFromSpherical(spherical)
        camera.lookAt(controls.target)
        controls.update()
      }
    }, 4)
  }

  // 返回所有需要的状态和方法
  return {
    animationType,
    animationComplete,
    getParticleStyle,
    resetAnimation,
    animateToDefaultView
  }
}
