/**
 * 黑洞吞噬动画
 * 模拟黑洞视界和引力透镜效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateBlackHole(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处观察
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 2000), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建黑洞参数
    const eventHorizon = { radius: 0, intensity: 0 }
    const accretionDisk = { spin: 0, brightness: 0 }
    const gravitationalLensing = { distortion: 0 }
    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'black-hole' })
      },
      onError,
      '黑洞吞噬'
    )

    // 动画阶段1: 接近黑洞
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 1500,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '接近阶段错误'
      )
    })

    // 动画阶段2: 进入吸积盘区域
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 1000,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '吸积盘接近错误'
      )
    }, 1.2)

    tl.to(eventHorizon, {
      radius: 1,
      intensity: 1,
      duration: 1,
      ease: 'power2.in'
    }, 2.2)

    tl.to(accretionDisk, {
      spin: 1,
      brightness: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.2)

    // 调整FOV
    tl.to(camera, {
      fov: 140,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2.5)

    // 动画阶段3: 引力透镜效果
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 600,
      duration: 2,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const horizonIntensity = eventHorizon.intensity
          const diskSpin = accretionDisk.spin
          const diskBrightness = accretionDisk.brightness

          // 视界脉动效果
          const pulse = Math.sin(time * 5) * 20 * horizonIntensity
          camera.position.z += pulse * 0.2

          // 吸积盘旋转效果
          const diskX = Math.sin(time * 10 * diskSpin) * 30 * diskBrightness
          const diskY = Math.cos(time * 8 * diskSpin) * 25 * diskBrightness
          const diskZ = Math.sin(time * 12 * diskSpin) * 30 * diskBrightness

          camera.position.x += diskX * 0.4
          camera.position.y += diskY * 0.4
          camera.position.z += diskZ * 0.2

          // 引力透镜扭曲效果
          const distortX = Math.sin(time * 6) * 40 * horizonIntensity
          const distortY = Math.cos(time * 5) * 35 * horizonIntensity

          camera.position.x += distortX * 0.3
          camera.position.y += distortY * 0.3

          // 相机旋转
          cameraRotation.x = Math.sin(time * 3) * 0.25 * horizonIntensity
          cameraRotation.y += 0.015 * diskSpin
          cameraRotation.z = Math.cos(time * 4) * 0.15 * horizonIntensity

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '引力透镜阶段错误'
      )
    }, 2.5)

    tl.to(gravitationalLensing, {
      distortion: 1,
      duration: 1,
      ease: 'power2.in'
    }, 3)

    // 动画阶段4: 逃离引力
    tl.to(eventHorizon, {
      intensity: 0.5,
      duration: 2,
      ease: 'power2.out'
    }, 4.5)

    tl.to(accretionDisk, {
      spin: 0.5,
      brightness: 0.5,
      duration: 2,
      ease: 'power2.out'
    }, 4.5)

    tl.to(gravitationalLensing, {
      distortion: 0,
      duration: 2,
      ease: 'power2.out'
    }, 4.5)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const horizonIntensity = eventHorizon.intensity
          const diskSpin = accretionDisk.spin

          // 逃离引力效果
          const escapeX = Math.sin(time * 6) * 15 * horizonIntensity
          const escapeY = Math.cos(time * 5) * 12 * horizonIntensity
          const escapeZ = Math.sin(time * 7) * 15 * horizonIntensity

          camera.position.x += escapeX * 0.2
          camera.position.y += escapeY * 0.2
          camera.position.z += escapeZ * 0.2

          // 相机逐渐稳定
          cameraRotation.x = Math.sin(time * 3) * 0.1 * horizonIntensity
          cameraRotation.y += 0.01 * diskSpin
          cameraRotation.z = Math.cos(time * 4) * 0.05 * horizonIntensity

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '逃离引力阶段错误'
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
