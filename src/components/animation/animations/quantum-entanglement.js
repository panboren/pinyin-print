/**
 * 量子纠缠动画
 * 模拟量子纠缠时的平行世界和现实融合效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateQuantumEntanglement(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处观察
    setupInitialCamera(camera, new THREE.Vector3(1300, 900, 1300), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建辅助变量
    const parallelWorlds = { separation: 0 }
    const quantumBridge = { intensity: 0 }
    const realityMerge = { progress: 0 }
    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'quantum-entanglement' })
      },
      onError,
      '量子纠缠'
    )

    // 动画阶段1: 接近
    tl.to(camera.position, {
      x: 700,
      y: 500,
      z: 700,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '接近阶段错误'
      )
    })

    // 动画阶段2: 平行世界分离
    tl.to(camera.position, {
      x: 400,
      y: 300,
      z: 400,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '分离阶段错误'
      )
    }, 1.2)

    tl.to(parallelWorlds, {
      separation: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.2)

    tl.to(quantumBridge, {
      intensity: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.2)

    // 调整FOV
    tl.to(camera, {
      fov: 130,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2.5)

    // 动画阶段3: 量子桥梁连接
    tl.to(camera.position, {
      x: 200,
      y: 150,
      z: 200,
      duration: 2,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const worldSeparation = parallelWorlds.separation
          const bridgeIntensity = quantumBridge.intensity

          // 平行世界分离效果
          const parallelX = Math.sin(time * 8) * 30 * worldSeparation
          const parallelY = Math.cos(time * 6) * 25 * worldSeparation
          const parallelZ = Math.sin(time * 10) * 30 * worldSeparation

          camera.position.x += parallelX * 0.5
          camera.position.y += parallelY * 0.5
          camera.position.z += parallelZ * 0.5

          // 量子桥梁连接效果
          const bridgeX = Math.sin(time * 12) * 10 * bridgeIntensity
          const bridgeY = Math.cos(time * 9) * 8 * bridgeIntensity
          const bridgeZ = Math.sin(time * 15) * 10 * bridgeIntensity

          camera.position.x += bridgeX
          camera.position.y += bridgeY
          camera.position.z += bridgeZ

          // 相机轻微旋转
          cameraRotation.x = Math.sin(time * 5) * 0.15 * bridgeIntensity
          cameraRotation.y = Math.cos(time * 4) * 0.15 * bridgeIntensity
          cameraRotation.z = Math.sin(time * 6) * 0.1 * bridgeIntensity

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '量子桥梁阶段错误'
      )
    }, 2.5)

    // 动画阶段4: 现实融合
    tl.to(parallelWorlds, {
      separation: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 4.5)

    tl.to(realityMerge, {
      progress: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 4.5)

    tl.to(camera.position, {
      x: 80,
      y: 60,
      z: 80,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const mergeProgress = realityMerge.progress
          const bridgeIntensity = quantumBridge.intensity

          // 现实融合效果
          const mergeX = Math.sin(time * 6) * 15 * bridgeIntensity * (1 - mergeProgress)
          const mergeY = Math.cos(time * 5) * 12 * bridgeIntensity * (1 - mergeProgress)
          const mergeZ = Math.sin(time * 7) * 15 * bridgeIntensity * (1 - mergeProgress)

          camera.position.x += mergeX
          camera.position.y += mergeY
          camera.position.z += mergeZ

          // 融合时的稳定效果
          cameraRotation.x = Math.sin(time * 3) * 0.08 * bridgeIntensity
          cameraRotation.y = Math.cos(time * 2.5) * 0.08 * bridgeIntensity
          cameraRotation.z = Math.sin(time * 4) * 0.05 * bridgeIntensity

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '现实融合阶段错误'
      )
    }, 4.5)

    tl.to(quantumBridge, {
      intensity: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 4.5)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 6)

  } catch (error) {
    if (onError) onError(error)
  }
}
