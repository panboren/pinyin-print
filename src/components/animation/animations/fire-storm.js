/**
 * 火焰风暴动画
 * 使用火焰风暴特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createFireStorm } from './effects/fire-storm'

export default function animateFireStorm(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 80, 80), 100, controls)
    camera.lookAt(0, 30, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'fire-storm' })
      },
      onError,
      '火焰风暴',
      controls
    )

    // 创建火焰风暴
    const fireStorm = createFireStorm(scene, {
      particleCount: 8000,
      radius: 40,
      height: 80,
      color1: new THREE.Color(0xff2200),
      color2: new THREE.Color(0xff8800),
      color3: new THREE.Color(0xffff00)
    })

    // 阶段1: 相机俯视
    tl.to(camera.position, {
      x: 20,
      y: 40,
      z: 20,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 30, 0),
        '相机位置更新错误'
      )
    })

    // 阶段2: 火焰爆发
    tl.call(() => {
      fireStorm.animate(3)
    }, null, 2)

    // 阶段3: 相机环绕
    tl.to(camera.position, {
      angle: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2
        camera.position.x = Math.cos(angle) * 30
        camera.position.z = Math.sin(angle) * 30
        safeCameraTransform(
          () => camera.lookAt(0, 30, 0),
          '相机环绕错误'
        )
      }
    }, 2)

    // 阶段4: 最终接近
    tl.to(camera.position, {
      x: 5,
      y: 35,
      z: 5,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 30, 0),
        '最终接近错误'
      )
    }, 5)

    // 清理
    tl.call(() => {
      fireStorm.destroy()
    }, null, 7)

    // 更新循环
    const updateHandler = () => {
      fireStorm.update(0.016, Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
