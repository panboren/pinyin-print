/**
 * 能量波动画
 * 从中心向外扩散的能量波效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateEnergyWave(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处观察
    setupInitialCamera(camera, new THREE.Vector3(800, 600, 800), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建辅助对象
    const energyRing = { scale: 0, opacity: 1 }
    const shockwave = { radius: 0, opacity: 1 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'energy-wave' })
      },
      onError,
      '能量波'
    )

    // 动画阶段1: 接近
    tl.to(camera.position, {
      x: 300,
      y: 200,
      z: 300,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '接近阶段错误'
      )
    })

    // 动画阶段2: 能量波爆发
    tl.to(camera.position, {
      x: 100,
      y: 80,
      z: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          // 能量波冲击效果
          const shockX = Math.sin(time * 3) * 15 * (1 - energyRing.scale)
          const shockY = Math.cos(time * 2) * 10 * (1 - energyRing.scale)
          const shockZ = Math.sin(time * 4) * 15 * (1 - energyRing.scale)

          camera.position.x += shockX
          camera.position.y += shockY
          camera.position.z += shockZ

          // 轻微的震动
          const shakeX = (Math.random() - 0.5) * 2
          const shakeY = (Math.random() - 0.5) * 2
          const shakeZ = (Math.random() - 0.5) * 2

          camera.position.x += shakeX
          camera.position.y += shakeY
          camera.position.z += shakeZ

          camera.lookAt(controls.target)
        },
        '能量波效果更新错误'
      )
    }, 1.2)

    // 调整FOV
    tl.to(camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 3)

    // 动画阶段3: 能量波消散
    tl.to(camera.position, {
      x: 30,
      y: 20,
      z: 30,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          // 能量波消散效果
          const dissipationX = Math.sin(time * 2) * 3
          const dissipationY = Math.cos(time * 1.5) * 2
          const dissipationZ = Math.sin(time * 2.5) * 3

          camera.position.x += dissipationX
          camera.position.y += dissipationY
          camera.position.z += dissipationZ

          camera.lookAt(controls.target)
        },
        '能量波消散效果更新错误'
      )
    }, 3.5)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 5)

  } catch (error) {
    if (onError) onError(error)
  }
}
