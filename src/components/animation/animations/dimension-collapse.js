/**
 * 维度崩溃动画
 * 模拟现实维度崩塌和混沌效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateDimensionCollapse(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处观察
    setupInitialCamera(camera, new THREE.Vector3(1100, 900, 1100), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建维度崩溃参数
    const realityFracture = { cracks: 0, intensity: 0 }
    const dimensionalShards = { density: 0, chaos: 0 }
    const chaosVortex = { spin: 0, pull: 0 }
    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'dimension-collapse' })
      },
      onError,
      '维度崩溃'
    )

    // 动画阶段1: 接近
    tl.to(camera.position, {
      x: 600,
      y: 500,
      z: 600,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '接近阶段错误'
      )
    })

    // 动画阶段2: 现实裂痕出现
    tl.to(camera.position, {
      x: 350,
      y: 280,
      z: 350,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '裂痕接近错误'
      )
    }, 1.2)

    tl.to(realityFracture, {
      cracks: 1,
      intensity: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.2)

    tl.to(dimensionalShards, {
      density: 1,
      chaos: 0.5,
      duration: 1,
      ease: 'power2.in'
    }, 2.2)

    // 调整FOV
    tl.to(camera, {
      fov: 135,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2.5)

    // 动画阶段3: 混沌漩涡
    tl.to(chaosVortex, {
      spin: 1,
      pull: 1,
      duration: 2,
      ease: 'power4.inOut'
    }, 2.5)

    tl.to(camera.position, {
      x: 200,
      y: 160,
      z: 200,
      duration: 2,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const fractureIntensity = realityFracture.intensity
          const shardDensity = dimensionalShards.density
          const shardChaos = dimensionalShards.chaos
          const vortexSpin = chaosVortex.spin
          const vortexPull = chaosVortex.pull

          // 现实裂痕效果
          const crackX = Math.sin(time * 10) * 35 * fractureIntensity
          const crackY = Math.cos(time * 8) * 28 * fractureIntensity
          const crackZ = Math.sin(time * 12) * 35 * fractureIntensity

          camera.position.x += crackX
          camera.position.y += crackY
          camera.position.z += crackZ

          // 维度碎片效果
          const shardX = Math.sin(time * 15 * shardChaos) * 25 * shardDensity
          const shardY = Math.cos(time * 12 * shardChaos) * 20 * shardDensity
          const shardZ = Math.sin(time * 18 * shardChaos) * 25 * shardDensity

          camera.position.x += shardX * 0.5
          camera.position.y += shardY * 0.5
          camera.position.z += shardZ * 0.5

          // 混沌漩涡效果
          const vortexX = Math.sin(time * 8 * vortexSpin) * 40 * vortexPull
          const vortexY = Math.cos(time * 6 * vortexSpin) * 35 * vortexPull
          const vortexZ = Math.sin(time * 10 * vortexSpin) * 40 * vortexPull

          camera.position.x += vortexX * 0.6
          camera.position.y += vortexY * 0.6
          camera.position.z += vortexZ * 0.4

          // 相机剧烈旋转
          cameraRotation.x = Math.sin(time * 6 * vortexSpin) * 0.35 * vortexPull
          cameraRotation.y += 0.04 * vortexSpin
          cameraRotation.z = Math.cos(time * 8 * vortexSpin) * 0.25 * vortexPull

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '混沌漩涡阶段错误'
      )
    }, 2.5)

    tl.to(dimensionalShards, {
      chaos: 1,
      duration: 1.5,
      ease: 'power2.in'
    }, 3)

    // 动画阶段4: 维度重建
    tl.to(realityFracture, {
      cracks: 0,
      intensity: 0,
      duration: 2,
      ease: 'power2.out'
    }, 4.5)

    tl.to(chaosVortex, {
      spin: 0,
      pull: 0,
      duration: 2,
      ease: 'power2.out'
    }, 4.5)

    tl.to(dimensionalShards, {
      density: 0,
      chaos: 0,
      duration: 2,
      ease: 'power2.out'
    }, 4.5)

    tl.to(camera.position, {
      x: 80,
      y: 60,
      z: 80,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const rebuildProgress = 1 - realityFracture.intensity

          // 维度重建效果
          const rebuildX = Math.sin(time * 5) * 15 * (1 - rebuildProgress)
          const rebuildY = Math.cos(time * 4) * 12 * (1 - rebuildProgress)
          const rebuildZ = Math.sin(time * 6) * 15 * (1 - rebuildProgress)

          camera.position.x += rebuildX * 0.3
          camera.position.y += rebuildY * 0.3
          camera.position.z += rebuildZ * 0.3

          // 相机逐渐稳定
          cameraRotation.x = Math.sin(time * 3) * 0.1 * (1 - rebuildProgress)
          cameraRotation.y += 0.005
          cameraRotation.z = Math.cos(time * 4) * 0.05 * (1 - rebuildProgress)

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '维度重建阶段错误'
      )
    }, 4.5)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 6.5)

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
    }, 6.5)

  } catch (error) {
    if (onError) onError(error)
  }
}
