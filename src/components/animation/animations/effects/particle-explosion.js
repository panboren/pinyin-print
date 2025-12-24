/**
 * effects/particle-explosion.js
 * 粒子爆炸特效
 * 炽热、爆炸、震撼
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建程序化粒子纹理
 */
function createParticleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  // 创建径向渐变 - 更明显的粒子
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255, 1)')
  gradient.addColorStop(0.3, 'rgba(255,255,255, 0.7)')
  gradient.addColorStop(1, 'rgba(255,255,255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

/**
 * 创建粒子爆炸
 */
export function createParticleExplosion(scene, options = {}) {
  const {
    particleCount = 600  // 大幅减少粒子数量
  } = options

  const particles = []
  const texture = createParticleTexture()

  // 创建多个粒子系统，不同颜色
  const colorGroups = [
    { color: 0xffffff, count: 0.15 }, // 白色（高温核心）
    { color: 0xffff00, count: 0.25 }, // 金黄
    { color: 0xff6600, count: 0.25 }, // 橙色
    { color: 0xff0000, count: 0.20 }, // 红色
    { color: 0x880000, count: 0.15 }  // 深红（冷却）
  ]

  colorGroups.forEach((group) => {
    const count = Math.floor(particleCount * group.count)
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0

      // 爆炸速度
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = 10 + Math.random() * 20

      velocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta)
      velocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta)
      velocities[i * 3 + 2] = speed * Math.cos(phi)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: group.color,
      size: 3,
      map: texture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    particles.push({
      points,
      geometry,
      material,
      velocities,
      count
    })
  })

  // 闪光球
  const flashGeometry = new THREE.SphereGeometry(3, 16, 16)  // 降低几何体细分
  const flashMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const flash = new THREE.Mesh(flashGeometry, flashMaterial)
  scene.add(flash)

  // 冲击波
  const shockwaveGeometry = new THREE.RingGeometry(1, 3, 32)  // 降低几何体细分
  const shockwaveMaterial = new THREE.MeshBasicMaterial({
    color: 0xff6600,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  })
  const shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial)
  shockwave.rotation.x = -Math.PI / 2
  scene.add(shockwave)

  // 彩色烟雾 - 减少数量
  const smokeClouds = []

  const smokeLayers = [
    { color: 0xff00ff, size: 16, speed: 0.8, count: 25 }, // 紫粉色
    { color: 0x00ffff, size: 14, speed: 0.9, count: 25 }, // 青色
    { color: 0xffff00, size: 12, speed: 1.0, count: 20 }, // 金黄色
    { color: 0xff6600, size: 10, speed: 1.1, count: 20 }, // 橙色
    { color: 0x00ff00, size: 14, speed: 0.85, count: 20 }  // 绿色
  ]

  smokeLayers.forEach((layer) => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(layer.count * 3)
    const velocities = new Float32Array(layer.count * 3)
    const sizes = new Float32Array(layer.count)

    for (let i = 0; i < layer.count; i++) {
      const radius = Math.random() * 5
      const angle = Math.random() * Math.PI * 2

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.random() * 3
      positions[i * 3 + 2] = Math.sin(angle) * radius

      velocities[i * 3] = (Math.random() - 0.5) * 2
      velocities[i * 3 + 1] = 2 + Math.random() * 3
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 2

      sizes[i] = layer.size + Math.random() * 4
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      color: layer.color,
      size: layer.size,
      map: texture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    smokeClouds.push({
      points,
      geometry,
      material,
      velocities,
      count: layer.count,
      sizes,
      speed: layer.speed
    })
  })

  return {
    flash,
    shockwave,
    smokeClouds,
    update(deltaTime, time) {
      // 更新爆炸粒子
      particles.forEach((particle) => {
        const positions = particle.geometry.attributes.position.array

        for (let i = 0; i < particle.count; i++) {
          positions[i * 3] += particle.velocities[i * 3] * deltaTime
          positions[i * 3 + 1] += particle.velocities[i * 3 + 1] * deltaTime
          positions[i * 3 + 2] += particle.velocities[i * 3 + 2] * deltaTime

          // 重力
          particle.velocities[i * 3 + 1] -= 15 * deltaTime

          // 阻力
          particle.velocities[i * 3] *= 0.98
          particle.velocities[i * 3 + 1] *= 0.98
          particle.velocities[i * 3 + 2] *= 0.98
        }

        particle.geometry.attributes.position.needsUpdate = true
      })

      // 更新彩色烟雾
      smokeClouds.forEach((cloud) => {
        if (cloud.material.opacity > 0.01) {
          const positions = cloud.geometry.attributes.position.array
          const sizes = cloud.geometry.attributes.size.array

          for (let i = 0; i < cloud.count; i++) {
            positions[i * 3] += cloud.velocities[i * 3] * deltaTime
            positions[i * 3 + 1] += cloud.velocities[i * 3 + 1] * deltaTime
            positions[i * 3 + 2] += cloud.velocities[i * 3 + 2] * deltaTime

            // 减慢垂直速度
            cloud.velocities[i * 3 + 1] *= 0.995

            // 扩散效果
            cloud.velocities[i * 3] *= 0.999
            cloud.velocities[i * 3 + 2] *= 0.999

            // 烟雾膨胀
            sizes[i] += deltaTime * cloud.speed * 8
          }

          cloud.geometry.attributes.position.needsUpdate = true
          cloud.geometry.attributes.size.needsUpdate = true
        }
      })
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 闪光
      tl.call(() => {
        flash.scale.setScalar(1)
        flashMaterial.opacity = 0
      })

      tl.to(flashMaterial, {
        opacity: 1,
        duration: 0.08,
        ease: 'power2.in'
      })

      tl.to(flash.scale, {
        x: 25,
        y: 25,
        z: 25,
        duration: 0.15,
        ease: 'power2.out'
      }, 0)

      tl.to(flashMaterial, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.08)

      // 冲击波
      tl.call(() => {
        shockwave.scale.setScalar(0.1)
        shockwaveMaterial.opacity = 0.8
      }, null, 0.1)

      tl.to(shockwave.scale, {
        x: 80,
        y: 80,
        z: 80,
        duration: 1.2,
        ease: 'power2.out'
      })

      tl.to(shockwaveMaterial, {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, '<')

      // 彩色烟雾
      smokeClouds.forEach((cloud, i) => {
        tl.call(() => {
          cloud.material.opacity = 0.4
        }, null, 0.15 + i * 0.02)

        tl.to(cloud.material, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })

      // 粒子透明度
      particles.forEach((particle, i) => {
        tl.to(particle.material, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, 0.2)
      })

      return tl
    },
    destroy() {
      particles.forEach((particle) => {
        scene.remove(particle.points)
        particle.geometry.dispose()
        particle.material.dispose()
      })
      scene.remove(flash)
      scene.remove(shockwave)
      smokeClouds.forEach((cloud) => {
        scene.remove(cloud.points)
        cloud.geometry.dispose()
        cloud.material.dispose()
      })
      flashGeometry.dispose()
      flashMaterial.dispose()
      shockwaveGeometry.dispose()
      shockwaveMaterial.dispose()
    }
  }
}
