/**
 * 宇宙大爆炸动画
 * 模拟宇宙大爆炸时的奇点和宇宙形成效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateCosmicBigBang(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从极远处的虚无开始
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 3000), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建大爆炸参数
    const singularity = { intensity: 0, collapse: 0 }
    const explosionWave = { radius: 0, speed: 0 }
    const universeFormation = { progress: 0 }
    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'cosmic-big-bang' })
      },
      onError,
      '宇宙大爆炸'
    )

    // 动画阶段1: 奇点坍缩
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 2000,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '奇点接近错误'
      )
    })

    tl.to(singularity, {
      intensity: 1,
      collapse: 1,
      duration: 1,
      ease: 'power4.in'
    }, 1.2)

    // 调整FOV
    tl.to(camera, {
      fov: 150,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2)

    // 动画阶段2: 大爆炸
    tl.to(singularity, {
      intensity: 2,
      collapse: 0,
      duration: 0.3,
      ease: 'power4.out'
    }, 2.2)

    tl.to(explosionWave, {
      radius: 1,
      speed: 1,
      duration: 0.3,
      ease: 'power4.out'
    }, 2.2)

    // 动画阶段3: 宇宙膨胀
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 1000,
      duration: 3,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const singularityIntensity = singularity.intensity
          const waveRadius = explosionWave.radius
          const waveSpeed = explosionWave.speed

          // 奇点脉动效果
          const pulse = Math.sin(time * 20) * 50 * singularityIntensity
          camera.position.z += pulse

          // 爆炸波扩散效果
          const waveX = Math.sin(time * 15 * waveSpeed) * 100 * waveRadius
          const waveY = Math.cos(time * 12 * waveSpeed) * 80 * waveRadius
          const waveZ = Math.sin(time * 18 * waveSpeed) * 100 * waveRadius

          camera.position.x += waveX * 0.6
          camera.position.y += waveY * 0.6
          camera.position.z += waveZ * 0.4

          // 相机剧烈旋转
          cameraRotation.x = Math.sin(time * 8) * 0.4 * singularityIntensity
          cameraRotation.y += 0.05 * waveSpeed
          cameraRotation.z = Math.cos(time * 10) * 0.3 * singularityIntensity

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '宇宙膨胀阶段错误'
      )
    }, 2.5)

    tl.to(universeFormation, {
      progress: 0.5,
      duration: 3,
      ease: 'power2.inOut'
    }, 2.5)

    // 动画阶段4: 星系形成
    tl.to(singularity, {
      intensity: 0.5,
      duration: 2,
      ease: 'power2.out'
    }, 5.5)

    tl.to(explosionWave, {
      radius: 3,
      speed: 0.5,
      duration: 2,
      ease: 'power2.out'
    }, 5.5)

    tl.to(universeFormation, {
      progress: 1,
      duration: 2,
      ease: 'power2.out'
    }, 5.5)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 200,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const formationProgress = universeFormation.progress

          // 星系形成效果
          const formX = Math.sin(time * 6) * 20 * (1 - formationProgress)
          const formY = Math.cos(time * 5) * 15 * (1 - formationProgress)
          const formZ = Math.sin(time * 7) * 20 * (1 - formationProgress)

          camera.position.x += formX
          camera.position.y += formY
          camera.position.z += formZ

          // 相机逐渐稳定
          cameraRotation.x = Math.sin(time * 4) * 0.15 * (1 - formationProgress)
          cameraRotation.y += 0.01
          cameraRotation.z = Math.cos(time * 5) * 0.1 * (1 - formationProgress)

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '星系形成阶段错误'
      )
    }, 5.5)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 7.5)

    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 1,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '最终定位错误'
      )
    }, 7.5)

  } catch (error) {
    if (onError) onError(error)
  }
}
