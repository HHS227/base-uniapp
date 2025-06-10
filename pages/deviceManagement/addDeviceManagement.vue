<template>
    <view class="page-container">
      <TransNavVue title="新增设备" />
      <view class="form-container">
        <uni-forms :model="formData" :rules="rules">
          <uni-forms-item label="设备名称" name="facilityName">
            <uni-easyinput v-model="formData.facilityName" placeholder="请输入设备名称" />
          </uni-forms-item>
          <uni-forms-item label="设备类型" name="facilityType">
            <uni-easyinput v-model="formData.facilityType" placeholder="请输入设备类型" />
          </uni-forms-item>
          <uni-forms-item label="设备型号" name="no">
            <uni-easyinput  v-model="formData.no" placeholder="请输入设备型号" />
          </uni-forms-item>
        
          
         
          
         
          
          <button class="submit-btn" @click="submitForm">提交</button>
        </uni-forms>
      </view>
    </view>
</template>
  
  <script setup>
  import { ref ,onMounted} from 'vue'
  import TransNavVue from '../../components/TransNav.vue'
  import { request } from '@/utils/request'

  const formData = ref({
    facilityName: '',
    facilityType: '',
    no: '',
    farmId:''
  })
  
  
  
  const rules = {
    name: { required: true, message: '请输入商品名称' },
    price: { required: true, message: '请输入商品价格' }
  }
  
  
  // 提交设备信息
  const submitForm = async () => {
    try {
      const res = await request({
        url: '/app-api/front/bee-farm/add/facility',
        showLoading: true, 
        data:formData.value,
        method:'post'
        
      })
      
      if (res.code === 0 || res.code === 200) {
       
        uni.navigateTo({
        url: `/pages/deviceManagement/deviceManagement?id=${formData.value.farmId}`
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
    formData.value.farmId=beeFarmId.id

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