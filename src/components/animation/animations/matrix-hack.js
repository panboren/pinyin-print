/**
 * 黑客帝国动画
 * 模拟黑客帝国中的下落和数字雨效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateMatrixHack(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从顶部俯视
    setupInitialCamera(camera, new THREE.Vector3(0, 500, 0), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'matrix-hack' })
      },
      onError,
      '黑客帝国'
    )

    // 动画阶段1: 下落效果
    tl.to(camera.position, {
      y: 50,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const wobbleX = Math.sin(time * 10) * 0.5
          const wobbleZ = Math.cos(time * 10) * 0.5
          camera.position.x = wobbleX
          camera.position.z = wobbleZ
          camera.lookAt(controls.target)
        },
        '下落效果更新错误'
      )
    })

    // 动画阶段2: 减速并调整视角
    tl.to(camera.position, {
      y: 10,
      x: 5,
      z: 5,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const wobbleX = Math.sin(time * 5) * 0.2
          const wobbleZ = Math.cos(time * 5) * 0.2
          camera.position.x = 5 + wobbleX
          camera.position.z = 5 + wobbleZ
          camera.lookAt(controls.target)
        },
        '视角调整错误'
      )
    }, 2)

    tl.to(camera, {
      fov: 90,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV视角调整错误'
      )
    }, 2)

    // 动画阶段3: 平移到最终位置
    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const wobbleX = Math.sin(time * 3) * 0.05
          const wobbleZ = Math.cos(time * 3) * 0.05
          camera.position.x = wobbleX
          camera.position.z = wobbleZ
          camera.lookAt(controls.target)
        },
        '位置平移更新错误'
      )
    }, 3)

    tl.to(camera, {
      fov: 60,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终更新错误'
      )
    }, 3.5)

  } catch (error) {
    if (onError) onError(error)
  }
}
