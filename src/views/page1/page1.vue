<template>
  <div>
    <div class="total">
      {{ total }}
    </div>
    <van-button
      type="primary"
      @click="add"
    >
      主要按钮
    </van-button>
    <van-button
      type="success"
      @click="add"
    >
      成功按钮
    </van-button>
    <van-button
      type="default"
      @click="add"
    >
      默认按钮
    </van-button>
    <van-button
      type="warning"
      @click="add"
    >
      警告按钮
    </van-button>
    <van-button
      type="danger"
      @click="add"
    >
      危险按钮
    </van-button>
  </div>
</template>

<script setup>

let total = ref(10)

const add = ()=>{
  total.value++
}

</script>

<style scoped lang="scss">
.total{
  width: 100px;
  height: 100px;
  background: #2da690;
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
