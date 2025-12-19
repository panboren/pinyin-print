<!-- src/components/ViewControls.vue -->
<template>
  <div class="view-controls">
    <h4>视角控制</h4>
    <div class="view-buttons">
      <button
        class="view-btn"
        @click="setView('front')"
      >
        正前方
      </button>
      <button
        class="view-btn"
        @click="setView('right')"
      >
        右侧
      </button>
      <button
        class="view-btn"
        @click="setView('left')"
      >
        左侧
      </button>
      <button
        class="view-btn"
        @click="setView('back')"
      >
        后方
      </button>
      <button
        class="view-btn"
        @click="setView('up')"
      >
        仰视
      </button>
      <button
        class="view-btn"
        @click="setView('down')"
      >
        俯视
      </button>
      <button
        class="view-btn default"
        @click="setView('default')"
      >
        默认
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// 注入父组件提供的方法和依赖
const setCameraView = inject('setCameraView')

const setView = (view) => {
  if (setCameraView) {
    setCameraView(view)
  }
}
</script>

<style scoped lang="scss">
.view-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  color: white;
  z-index: 100;
  min-width: 200px;

  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    opacity: 0.9;
    text-align: center;
  }

  .view-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;

    .view-btn {
      padding: 8px 4px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: white;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }

      &.default {
        grid-column: span 3;
        background: rgba(76, 175, 80, 0.3);
        border-color: rgba(76, 175, 80, 0.5);

        &:hover {
          background: rgba(76, 175, 80, 0.4);
        }
      }
    }
  }

  // 移动端优化
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    padding: 12px;
    min-width: 160px;

    h4 {
      font-size: 12px;
    }

    .view-buttons {
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;

      .view-btn {
        padding: 6px 3px;
        font-size: 11px;
      }
    }
  }
}
</style>
