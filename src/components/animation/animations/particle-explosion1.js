/**
 * 粒子爆炸动画
 * 使用粒子爆炸特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createParticleExplosion } from './effects/particle-explosion'

export default function animateParticleExplosion(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处开始
    setupInitialCamera(camera, new THREE.Vector3(0, 80, 120), 150, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'particle-explosion' })
      },
      onError,
      '粒子爆炸',
      controls
    )

    // 创建粒子爆炸
    const particleExplosion = createParticleExplosion(scene, {
      particleCount: 3000,
      explosionRadius: 100
    })

    // 阶段1: 慢速接近
    tl.to(camera.position, {
      x: 40,
      y: 40,
      z: 40,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机接近错误'
      )
    })

    // 阶段2: 触发爆炸
    tl.call(() => {
      particleExplosion.animate(3)
    }, null, 2)

    // FOV调整 - 增强爆炸效果
    tl.to(camera, {
      fov: 110,
      duration: 0.3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2)

    // 阶段3: 爆炸后的冲击
    tl.to(camera.position, {
      x: 30,
      y: 30,
      z: 30,
      duration: 1,
      ease: 'back.out(1.5)',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机冲击错误'
      )
    }, 2.3)

    // 恢复FOV
    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 2.8)

    // 阶段4: 环绕观察
    tl.to(camera.position, {
      angle: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2
        const radius = 30
        camera.position.x = Math.cos(angle) * radius
        camera.position.z = Math.sin(angle) * radius
        camera.position.y = 25 + Math.sin(angle * 2) * 8
        safeCameraTransform(
          () => camera.lookAt(0, 0, 0),
          '相机环绕错误'
        )
      }
    }, 3)

    // 阶段5: 下降接近
    tl.to(camera.position, {
      x: 10,
      y: 10,
      z: 10,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机下降错误'
      )
    }, 6)

    // FOV微调
    tl.to(camera, {
      fov: 100,
      duration: 0.5,
      ease: 'power1.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV微调错误'
      )
    }, 6)

    // 恢复FOV
    tl.to(camera, {
      fov: 75,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 6.5)

    // 阶段6: 最终精确定位
    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '最终定位错误'
      )
    }, 8)

    // 清理
    tl.call(() => {
      particleExplosion.destroy()
    }, null, 10)

    // 更新循环
    const updateHandler = () => {
      particleExplosion.update(0.016, Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
