export const usePage1Store = defineStore('page1', () => {
  const count = ref(100)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    console.log('increment')
    count.value++
    console.log(doubleCount)
  }

  return { count, doubleCount, increment }
})