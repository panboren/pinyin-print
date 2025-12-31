/**
 * 性能监控工具
 * 用于监控动画性能和帧率，确保流畅运行
 */

export class PerformanceMonitor {
  constructor() {
    this.fps = 0
    this.frameCount = 0
    this.lastTime = performance.now()
    this.lowFpsWarningCount = 0
    this.maxLowFpsWarnings = 3
  }

  /**
   * 开始帧率监控
   */
  startMonitoring() {
    this.monitorInterval = setInterval(() => {
      this.calculateFPS()
      this.checkPerformance()
    }, 1000)
  }

  /**
   * 停止监控
   */
  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval)
    }
  }

  /**
   * 计算帧率
   */
  calculateFPS() {
    const now = performance.now()
    const delta = now - this.lastTime

    if (delta > 0) {
      this.fps = Math.round((this.frameCount * 1000) / delta)
    }

    this.frameCount = 0
    this.lastTime = now
  }

  /**
   * 检查性能并发出警告
   */
  checkPerformance() {
    if (this.fps < 30 && this.lowFpsWarningCount < this.maxLowFpsWarnings) {
      console.warn(`⚠️ 性能警告: 当前帧率 ${this.fps} FPS (建议保持30+FPS)`)
      this.lowFpsWarningCount++

      if (this.lowFpsWarningCount === this.maxLowFpsWarnings) {
        console.warn('⚠️ 已禁用进一步的低帧率警告，请检查设备性能')
      }
    }
  }

  /**
   * 每帧调用
   */
  tick() {
    this.frameCount++
  }

  /**
   * 获取当前帧率
   */
  getFPS() {
    return this.fps
  }

  /**
   * 获取性能状态
   */
  getPerformanceStatus() {
    if (this.fps >= 50) return 'excellent'
    if (this.fps >= 30) return 'good'
    if (this.fps >= 20) return 'fair'
    return 'poor'
  }

  /**
   * 调整画质设置
   */
  adjustQualitySettings(currentSettings) {
    const status = this.getPerformanceStatus()

    switch (status) {
      case 'excellent':
        return {
          ...currentSettings,
          particleMultiplier: 1.0,
          quality: 'high',
          postProcessing: true
        }
      case 'good':
        return {
          ...currentSettings,
          particleMultiplier: 0.8,
          quality: 'medium',
          postProcessing: true
        }
      case 'fair':
        return {
          ...currentSettings,
          particleMultiplier: 0.6,
          quality: 'medium',
          postProcessing: false
        }
      case 'poor':
        return {
          ...currentSettings,
          particleMultiplier: 0.4,
          quality: 'low',
          postProcessing: false
        }
      default:
        return currentSettings
    }
  }
}

/**
 * 简易帧率限制器
 */
export class FrameRateLimiter {
  constructor(targetFPS = 60) {
    this.targetFPS = targetFPS
    this.frameInterval = 1000 / targetFPS
    this.lastFrameTime = 0
  }

  /**
   * 等待下一帧
   */
  async waitForNextFrame() {
    const now = performance.now()
    const elapsed = now - this.lastFrameTime

    if (elapsed < this.frameInterval) {
      await new Promise(resolve =>
        setTimeout(resolve, this.frameInterval - elapsed)
      )
    }

    this.lastFrameTime = performance.now()
  }
}

/**
 * 内存使用监控
 */
export class MemoryMonitor {
  constructor() {
    this.initialMemory = this.getMemoryUsage()
    this.leakThreshold = 50 * 1024 * 1024 // 50MB
  }

  getMemoryUsage() {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize
    }
    return 0
  }

  checkMemoryLeak() {
    const currentMemory = this.getMemoryUsage()
    const memoryIncrease = currentMemory - this.initialMemory

    if (memoryIncrease > this.leakThreshold) {
      console.warn(`⚠️ 内存泄漏警告: 内存使用增加了 ${Math.round(memoryIncrease / 1024 / 1024)}MB`)
      return true
    }

    return false
  }

  logMemoryUsage() {
    const memory = this.getMemoryUsage()
    console.log(`💾 内存使用: ${Math.round(memory / 1024 / 1024)}MB`)
  }
}

/**
 * 性能优化工具函数
 */
export const performanceUtils = {
  /**
   * 批量更新粒子位置（优化性能）
   */
  updateParticlesBatch(positions, velocities, count, deltaTime, batchSize = 1000) {
    for (let batchStart = 0; batchStart < count; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, count)

      for (let i = batchStart; i < batchEnd; i++) {
        positions[i * 3] += velocities[i * 3] * deltaTime
        positions[i * 3 + 1] += velocities[i * 3 + 1] * deltaTime
        positions[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime
      }
    }
  },

  /**
   * 节流函数调用
   */
  throttle(func, limit) {
    let inThrottle
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  /**
   * 防抖函数调用
   */
  debounce(func, wait) {
    let timeout
    return function(...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  },

  /**
   * 检测设备性能等级
   */
  detectDevicePerformance() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const memory = performance.memory ? performance.memory.jsHeapSizeLimit : 0
    const cores = navigator.hardwareConcurrency || 4

    if (isMobile || memory < 500000000 || cores < 4) {
      return 'low'
    } else if (memory < 1000000000 || cores < 8) {
      return 'medium'
    } else {
      return 'high'
    }
  },

  /**
   * 根据设备性能调整设置
   */
  getOptimizedSettings() {
    const performanceLevel = this.detectDevicePerformance()

    switch (performanceLevel) {
      case 'low':
        return {
          maxParticles: 2000,
          quality: 'low',
          shadows: false,
          antialias: false,
          postProcessing: false
        }
      case 'medium':
        return {
          maxParticles: 5000,
          quality: 'medium',
          shadows: true,
          antialias: true,
          postProcessing: true
        }
      case 'high':
        return {
          maxParticles: 10000,
          quality: 'high',
          shadows: true,
          antialias: true,
          postProcessing: true
        }
      default:
        return {
          maxParticles: 5000,
          quality: 'medium',
          shadows: true,
          antialias: true,
          postProcessing: true
        }
    }
  }
}

export default PerformanceMonitor
