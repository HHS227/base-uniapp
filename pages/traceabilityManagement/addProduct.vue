<template>
  <view class="page-container">
    <TransNavVue title="新增商品" />
    <view class="form-container">
      <uni-forms :model="formData" :rules="rules">
        <uni-forms-item label="商品名称" name="name">
          <uni-easyinput v-model="formData.name" placeholder="请输入商品名称" />
        </uni-forms-item>
        
        <uni-forms-item label="商品描述" name="description">
          <uni-easyinput type="textarea" v-model="formData.description" placeholder="请输入商品描述" />
        </uni-forms-item>
        
        <uni-forms-item label="商品价格" name="price">
          <uni-easyinput type="number" v-model="formData.price" placeholder="请输入商品价格" />
        </uni-forms-item>
        
        <uni-forms-item label="商品图片" name="images">
          <uni-file-picker 
            v-model="formData.images"
            fileMediatype="image" 
            mode="grid"
            limit="9"
            :image-styles="imageStyles"
            @select="onSelect"
            @delete="onDelete"
          />
        </uni-forms-item>
        
        <button class="submit-btn" @click="submitForm">提交</button>
      </uni-forms>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

import TransNavVue from '../../components/TransNav.vue'

const formData = ref({
  name: '',
  description: '',
  price: '',
  images: []
})

const imageStyles = {
  width: 160,
  height: 160,
  border: {
    color: '#eee',
    width: 1,
    style: 'solid',
    radius: '4px'
  }
}

const onSelect = (e) => {
  console.log('选择文件:', e.tempFilePaths)
}

const onDelete = (e) => {
  console.log('删除文件:', e.tempFilePath)
}

const rules = {
  name: { required: true, message: '请输入商品名称' },
  price: { required: true, message: '请输入商品价格' }
}

const submitForm = () => {
  // 提交表单逻辑
  console.log('提交表单:', formData.value)
}
</script>

<style lang="scss" scoped>
.page-container {
  background-color: #f7f7f7;
  min-height: 100vh;
}

.form-container {
  padding: 20rpx;
  background: #fff;
  margin: 20rpx;
  border-radius: 10rpx;
  
  .submit-btn {
    margin-top: 40rpx;
    background: #ff6f0e;
    color: #fff;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 32rpx;
  }
}
</style>