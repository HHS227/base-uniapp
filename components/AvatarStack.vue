<template>
  <view class="avatar-stack">
    <view 
      v-for="(avatar, index) in avatars" 
      :key="index"
      class="avatar-item"
      :style="{
        width: size + 'rpx',
        height: size + 'rpx',
        marginLeft: index > 0 ? `-${overlap}rpx` : '0',
        zIndex: index
      }"
    >
      <image 
        :src="avatar" 
        mode="aspectFill" 
        class="avatar-image"
        :style="{
          borderRadius: '50%'
        }"
      />
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  avatars: {
    type: Array,
    required: true,
    default: () => []
  },
  size: {
    type: Number,
    default: 80
  },
  overlap: {
    type: Number,
    default: 10
  }
})
</script>

<style lang="scss" scoped>
.avatar-stack {
  display: flex;
  align-items: center;
}
.avatar-item {
  position: relative;
}
.avatar-image {
  width: 100%;
  height: 100%;
  border: 4rpx solid #ffffff;
  box-sizing: border-box;
}
</style>