/**
 * 动画性能测试工具
 * 用于识别性能较差的动画并建议优化方案
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class AnimationPerformanceTester {
  constructor() {
    this.results = [];
    this.currentTestIndex = 0;
  }

  /**
   * 测试单个动画的性能
   */
  async testAnimation(animationFunction, animationName, duration = 10) {
    return new Promise((resolve) => {
      // 创建测试场景
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: false });
      const controls = new OrbitControls(camera, renderer.domElement);

      renderer.setSize(800, 600);
      document.body.appendChild(renderer.domElement);

      // 添加基本光照
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(50, 50, 50);
      scene.add(directionalLight);

      // 性能监控数据
      let frameCount = 0;
      let startTime = performance.now();
      let totalFrames = 0;
      let minFPS = Infinity;
      let maxFPS = 0;
      let fpsHistory = [];

      // 启动动画
      const animationResult = animationFunction({
        camera,
        renderer,
        scene,
        controls
      }, {
        onComplete: () => {
          // 动画完成后的清理
          this.cleanupTest(renderer);
          this.recordResults(animationName, {
            averageFPS: Math.round(totalFrames / duration),
            minFPS: Math.round(minFPS),
            maxFPS: Math.round(maxFPS),
            framesDropped: Math.max(0, 60 * duration - totalFrames),
            performanceScore: Math.max(0, Math.min(100, (totalFrames / (60 * duration)) * 100))
          });
          resolve();
        },
        onError: (error) => {
          console.error(`动画 ${animationName} 测试失败:`, error);
          this.cleanupTest(renderer);
          resolve();
        }
      });

      // 渲染循环
      const animate = () => {
        requestAnimationFrame(animate);

        const currentTime = performance.now();
        const elapsedTime = (currentTime - startTime) / 1000;

        if (elapsedTime > duration) {
          // 测试完成
          animationResult.updateHandler?.();
          return;
        }

        // 更新FPS统计
        const currentFPS = 1000 / (currentTime - startTime);
        fpsHistory.push(currentFPS);
        minFPS = Math.min(minFPS, currentFPS);
        maxFPS = Math.max(maxFPS, currentFPS);
        totalFrames++;
        frameCount++;
        startTime = currentTime;

        // 更新动画
        if (animationResult.updateHandler) {
          animationResult.updateHandler();
        }

        // 渲染场景
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    });
  }

  /**
   * 清理测试环境
   */
  cleanupTest(renderer) {
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    renderer.dispose();
  }

  /**
   * 记录测试结果
   */
  recordResults(animationName, metrics) {
    this.results.push({
      name: animationName,
      metrics,
      timestamp: new Date().toISOString()
    });

    console.log(`📊 动画 "${animationName}" 性能测试结果:`, metrics);
  }

  /**
   * 获取性能分析报告
   */
  getPerformanceReport() {
    const sortedResults = [...this.results].sort((a, b) =>
      a.metrics.performanceScore - b.metrics.performanceScore
    );

    const goodAnimations = sortedResults.filter(r => r.metrics.performanceScore >= 80);
    const fairAnimations = sortedResults.filter(r => r.metrics.performanceScore >= 60 && r.metrics.performanceScore < 80);
    const poorAnimations = sortedResults.filter(r => r.metrics.performanceScore < 60);

    return {
      summary: {
        totalTested: this.results.length,
        good: goodAnimations.length,
        fair: fairAnimations.length,
        poor: poorAnimations.length
      },
      goodAnimations: goodAnimations.map(a => a.name),
      fairAnimations: fairAnimations.map(a => a.name),
      poorAnimations: poorAnimations.map(a => a.name),
      detailedResults: sortedResults
    };
  }

  /**
   * 检测低性能动画
   */
  getLowPerformanceAnimations(threshold = 60) {
    return this.results.filter(result => result.metrics.performanceScore < threshold);
  }

  /**
   * 生成优化建议
   */
  generateOptimizationSuggestions() {
    const suggestions = [];

    this.results.forEach(result => {
      if (result.metrics.performanceScore < 70) {
        suggestions.push({
          animation: result.name,
          currentScore: result.metrics.performanceScore,
          suggestions: [
            '减少粒子数量',
            '优化着色器计算',
            '简化几何体复杂度',
            '使用LOD（细节层次）',
            '优化内存使用'
          ]
        });
      }
    });

    return suggestions;
  }
}

/**
 * 快速性能检查函数
 */
export function quickPerformanceCheck(animationFunction, animationName) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    let frameCount = 0;
    let fpsSamples = [];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800/600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: false });

    renderer.setSize(800, 600);

    const checkInterval = setInterval(() => {
      const currentTime = performance.now();
      const elapsed = (currentTime - startTime) / 1000;
      const fps = frameCount / elapsed;
      fpsSamples.push(fps);
      frameCount++;

      if (elapsed >= 3) { // 3秒测试
        clearInterval(checkInterval);
        const averageFPS = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;

        renderer.dispose();
        resolve({
          animation: animationName,
          averageFPS: Math.round(averageFPS),
          status: averageFPS >= 45 ? 'good' : averageFPS >= 30 ? 'fair' : 'poor'
        });
      }
    }, 1000 / 60);
  });
}

export default AnimationPerformanceTester;
