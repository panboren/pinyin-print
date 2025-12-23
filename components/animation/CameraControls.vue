<template>
  <div
    class="view-controls"
    role="region"
    aria-label="视角控制面板"
  >
    <h4>视角控制</h4>
    <div class="view-buttons">
      <button
        class="view-btn"
        aria-label="正前方视角"
        @click="setView('front')"
      >
        正前方
      </button>
      <button
        class="view-btn"
        aria-label="右侧视角"
        @click="setView('right')"
      >
        右侧
      </button>
      <button
        class="view-btn"
        aria-label="左侧视角"
        @click="setView('left')"
      >
        左侧
      </button>
      <button
        class="view-btn"
        aria-label="后方视角"
        @click="setView('back')"
      >
        后方
      </button>
      <button
        class="view-btn"
        aria-label="仰视角"
        @click="setView('up')"
      >
        仰视
      </button>
      <button
        class="view-btn"
        aria-label="俯视角"
        @click="setView('down')"
      >
        俯视
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['set-camera-view'])

const setView = (view) => {
  emit('set-camera-view', view)
}
</script>

<style scoped lang="scss">
.view-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;

  h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .view-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .view-btn {
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 12px;
    font-weight: 500;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  // 移动端优化
  @media (max-width: 768px) {
    top: 15px;
    left: 15px;
    padding: 12px 16px;

    h4 {
      font-size: 13px;
      margin-bottom: 8px;
    }

    .view-btn {
      font-size: 11px;
      padding: 6px 10px;
    }
  }
}
</style>