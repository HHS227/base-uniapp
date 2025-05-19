<template>
  <view class="notice-container">
    <view class="notice-wrapper" :style="{ height: (3 * itemHeight) + 'px' }">
      <view 
        class="notice-item" 
        v-for="(item, index) in notices" 
        :key="index"
        :style="{ transform: `translateY(${translateY}px)` }"
      >
        {{ item }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  notices: {
    type: Array,
    default: () => []
  },
  duration: {
    type: Number,
    default: 3000
  },
  itemHeight: {
    type: Number,
    default: 40
  }
})

const translateY = ref(0)
const currentIndex = ref(0)
let timer = null

const startAnimation = () => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.notices.length
    translateY.value = -currentIndex.value * props.itemHeight
    
    // 等待动画完成后再更新数组顺序
    setTimeout(() => {
      const newNotices = [...props.notices]
      const currentItem = newNotices[currentIndex.value]
      newNotices.push(currentItem)
      newNotices.shift()
      translateY.value = 0
      currentIndex.value = 0
      props.notices = newNotices
    }, 500) // 与CSS过渡时间保持一致
  }, props.duration)
}

onMounted(() => {
  if (props.notices.length > 1) {
    startAnimation()
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style lang="scss" scoped>
.notice-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: rgba(255,255,255,0.5);
}

.notice-wrapper {
  position: relative;
  overflow: hidden;
  height: calc(3 * var(--item-height, 40px));
}

.notice-item {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s ease-in-out;
  white-space: nowrap;
  background-color: rgba(0,0,0,0.1);
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
</style>