<template>
  <view class="page-container">
    <TransNavVue title="新增商品" />
    <view class="form-container">
      <uni-forms :model="formData" :rules="rules">
        <uni-forms-item label="商品名称" name="name">
          <uni-easyinput v-model="formData.name" placeholder="请输入商品名称" />
        </uni-forms-item>
        <uni-forms-item label="商品价格" name="price">
          <uni-easyinput type="number" v-model="formData.price" placeholder="请输入商品价格" />
        </uni-forms-item>
        <uni-forms-item label="商品库存" name="stock">
          <uni-easyinput type="number" v-model="formData.stock" placeholder="请输入商品库存" />
        </uni-forms-item>
        <uni-forms-item label="商品描述" name="description">
          <uni-easyinput type="textarea" v-model="formData.describe" placeholder="请输入商品描述" />
        </uni-forms-item>
        <button class="submit-btn" @click="submitForm">提交</button>
      </uni-forms>
    </view>
  </view>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import TransNavVue from '../../components/TransNav.vue'
import { request } from '@/utils/request'

const formData = ref({
  name: '',
  describe: '',
  price: '',
  images: [],
  stock: '',
  beeFarmId:''
})

const rules = {
  name: { required: true, message: '请输入商品名称' },
  price: { required: true, message: '请输入商品价格' }
}

// 提交新增的商品
const submitForm = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/traceability/create',
      showLoading: true, 
      data:formData.value,
      method:'post'
      
    })
    
    if (res.code === 0 || res.code === 200) {
      uni.navigateTo({
        url: `/pages/traceabilityManagement/traceabilityManagement?id=${formData.value.beeFarmId}`
      });
      
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
   
  }
}

onMounted(() => {
  const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const beeFarmId  = currentPage.$page.options|| currentPage.options
	  if (beeFarmId.id) {
    formData.value.beeFarmId=beeFarmId.id
	  } else {
	    console.error('蜂场 ID 缺失')
	  }
})

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