/**
 * 时空隧道动画
 * 使用时空隧道特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createTunnel } from './effects/tunnel-effect'

export default function animateTunnelEffect(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 120), 170, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'tunnel-effect' })
      },
      onError,
      '时空隧道',
      controls
    )

    // 创建时空隧道
    const tunnel = createTunnel(scene, {
      radius: 25,
      length: 150,
      color1: new THREE.Color(0x00ffff),
      color2: new THREE.Color(0xff00ff),
      speed: 3.0
    })

    // 阶段1: 相机缓慢进入隧道
    tl.to(camera.position, {
      z: 80,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, -100),
        '相机进入隧道错误'
      )
    })

    // 阶段2: 加速穿越
    tl.to(camera.position, {
      z: -50,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          // 轻微的螺旋运动
          camera.position.x = Math.sin(time * 2) * 5
          camera.position.y = Math.cos(time * 2) * 3
          camera.lookAt(0, 0, -100)
        },
        '穿越隧道错误'
      )
    })

    // 阶段3: 隧道变形
    tl.call(() => {
      tunnel.animate(2)
    }, null, 3)

    // FOV变化
    tl.to(camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 4)

    tl.to(camera, {
      fov: 75,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 5.5)

    // 阶段4: 穿出隧道
    tl.to(camera.position, {
      z: 0.01,
      x: 0,
      y: 0,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, -50),
        '穿出隧道错误'
      )
    }, 5)

    // 清理
    tl.call(() => {
      tunnel.destroy()
    }, null, 7)

    // 更新循环
    const updateHandler = () => {
      tunnel.update(Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
