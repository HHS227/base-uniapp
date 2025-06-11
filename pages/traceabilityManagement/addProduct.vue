<template>
  <view>
    <TransNavVue title="新增商品" />
    <view class="container">
      <view class="topImg">  
        <view class="form-item image-upload">
          <view class="upload-container">
      
            <view class="image-preview" v-if="mainImage.tempFilePath">
              <view class="image-item">
                <image :src="mainImage.tempFilePath" mode="aspectFill" @click='previewImage'></image>
                <view class="delete-btn" @click.stop="deleteMainImage">
                  <text>×</text>
                </view>
              </view>
            </view>
            
            <view 
              class="upload-btn main-upload" 
              v-if="!mainImage.tempFilePath"
              @click="chooseMainImage"
            >
              <text>+</text>
              <text>上传主图</text>
            </view>
          </view>
          <text class="upload-tips">商品展示图（仅一张）</text>
        </view>    
      </view>
      <view class="form-content">
      
        <input :inputBorder="false" placeholder-class="place" v-model="formData.name" placeholder="商品标题"
          class="form-item form-input" />
        <input :inputBorder="false" placeholder-class="place" v-model="formData.price" placeholder="商品价格"
          class="form-item form-input" />
        <input :inputBorder="false" placeholder-class="place" v-model="formData.stock" placeholder="商品库存"
          class="form-item form-input" />
        <input :inputBorder="false" placeholder-class="place" v-model="formData.describe" placeholder="商品描述"
          class="form-item form-input" />
        <view class="form-item image-upload">
          <view class="upload-container">
            <view class="image-preview" v-if="imageList.length">
              <view class="image-item" v-for="(img, index) in imageList" :key="index">
                <image :src="img.tempFilePath" mode="aspectFill" @click="previewImages(index)"></image>
                <view class="delete-btn" @click.stop="deleteImage(index)">
                  <text>×</text>
                </view>
              </view>
            </view>
            
            <view class="upload-btn" @click="chooseImage" 
                  :style="{ display: imageList.length >= 9 ? 'none' : 'flex' }">
              <text>+</text>
              <text>上传图片</text>
            </view>
          </view>
          <text class="upload-tips">商品图片最多上传9张图片</text>
        </view>
      </view>

     
    </view>
    <view class="footer">
      <button class="add-btn" @click="enterBtn">新增</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TransNavVue from '../../components/TransNav.vue';
import { request } from '@/utils/request';


const BASE_URL = 'https://www.cdsrh.top'
const formData = ref({
  name: '',
  describe: '',
  price: '',
  imgUrls: [], // 存储多张图片的URL
  stock: '',
  beeFarmId: '',
  imgUrl:''
})
const mainImage = ref({
  tempFilePath: '',
  data: ''
})
const imageList = ref([]); //暂时储存的图片
const isEditMode = ref(false)
const productId = ref('') // 添加商品ID存储

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const beeFarmId = currentPage.$page.options || currentPage.options
  if (currentPage && currentPage.$vm) {
    const eventChannel = currentPage.$vm.getOpenerEventChannel()
    eventChannel.on('addProduct', (data) => {
      if (data && data.data.id) {
        isEditMode.value = true
        productId.value = data.data.id 
        const serverImages = data.data.imgUrls.map(url => ({
          tempFilePath: url,  
          data: url          
        }))
        imageList.value = serverImages
        formData.value = {
          ...data.data,
          imgUrls: serverImages.map(img => img.data) // 保持数据结构一致
        }
      }
    })
  }
  if (beeFarmId.id) {
    formData.value.beeFarmId = beeFarmId.id
  } else {
    console.error('蜂场 ID 缺失')
  }
})
const chooseImage = () => {
  if (imageList.value.length >= 9) {
    uni.showToast({
      title: '最多上传9张图片',
      icon: 'none'
    });
    return;
  }

  uni.chooseImage({
    count: 9 - imageList.value.length, 
    success: async (res) => {
      if (!res || !res.tempFilePaths || res.tempFilePaths.length === 0) {
        uni.showToast({
          title: '未选择图片',
          icon: 'none'
        });
        return;
      }

      uni.showLoading({
        title: '上传中...'
      });

      try {
        const uploadPromises = res.tempFilePaths.map(tempFilePath => {
          return new Promise((resolve, reject) => {
            uni.uploadFile({
              url: BASE_URL + '/app-api/infra/file/upload',
              filePath: tempFilePath,
              name: 'file',
            
              success: (response) => {
                try {
                  const data = JSON.parse(response.data);
                  resolve({
                    tempFilePath,
                    data: data.data
                  });
                } catch (err) {
                  reject(new Error('解析响应失败'));
                }
              },
              fail: (err) => {
                reject(err);
              }
            });
          });
        });

        const uploadResults = await Promise.all(uploadPromises);
        imageList.value = [...imageList.value, ...uploadResults];
        
        uni.showToast({
          title: `成功上传${uploadResults.length}张图片`,
          icon: 'success'
        });
      } catch (err) {
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        });
        console.error('图片上传失败:', err);
      } finally {
        uni.hideLoading();
      }
    },
    fail: (err) => {
      console.error('选择图片失败:', err);
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    }
  });
};

// 预览大图
const previewImages = (index) => {
  if (imageList.value.length > index) {
    uni.previewImage({
      urls: imageList.value.map(img => img.tempFilePath),
      current: imageList.value[index].tempFilePath
    });
  }
};
// 预览图片
const previewImage = () => {
  if (mainImage.value.tempFilePath) {
    uni.previewImage({
      urls: [mainImage.value.tempFilePath]
    });
  }
};

// 删除图片
const deleteImage = (index) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这张图片吗？',
    success: (res) => {
      if (res.confirm) {
        // 从数组中移除图片
        imageList.value.splice(index, 1);
      }
    }
  });
};

//提交
const enterBtn = async () => {
  formData.value.imgUrls =  imageList.value.map(img => img.data);
  try {
    // 验证表单
    if (!formData.value.name) {
      uni.showToast({
        title: '请输入商品名称',
        icon: 'none'
      });
      return;
    }
    
    if (formData.value.imgUrls.length === 0) {
      uni.showToast({
        title: '请上传至少一张图片',
        icon: 'none'
      });
      return;
    }

    // 根据模式动态设置请求参数
    const requestConfig = {
      url: isEditMode.value ? 
        `/app-api/weixin/traceability/update?id=${productId.value}` : 
        '/app-api/weixin/traceability/create',
      method: isEditMode.value ? 'put' : 'post',
      data: {
        ...formData.value,
        ...(isEditMode.value && { id: productId.value })
      },
      showLoading: true
    }

    const res = await request(requestConfig)
    
    if (res.code === 0) {
      uni.navigateBack()
    } else {
      throw new Error(res.msg || '数据异常');
    }
  }
  catch (err) {
    console.error('新增失败:', err);
    uni.showToast({
      title: err.message || '新增失败',
      icon: 'none'
    });
  }
};

// 单张图上传
const chooseMainImage = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      if (res.tempFilePaths.length === 0) return
      
      uni.showLoading({ title: '上传中...' })
      try {
        const result = await uploadSingleImage(res.tempFilePaths[0])
        mainImage.value = {
          tempFilePath: res.tempFilePaths[0],
          data: result.data
        }
        formData.value.imgUrl = result.data
      } finally {
        uni.hideLoading()
      }
    }
  })
}

// 图片上传方法
const uploadSingleImage = (tempFilePath) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: BASE_URL + '/app-api/infra/file/upload',
      filePath: tempFilePath,
      name: 'file',
     
      success: (response) => {
        const data = JSON.parse(response.data)
        resolve(data)
      },
      fail: reject
    })
  })
}
// 删除主图
const deleteMainImage = () => {
  mainImage.value = { tempFilePath: '', data: '' }
  formData.value.imgUrl = ''
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
  height: 100vh;
  z-index: 1;
  padding: 20rpx;
.topImg{
  width: 100%;
  height: 300rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  border-radius: 24rpx;
}
.form-content {
width: 100%;
background: #ffffff;
border-radius: 24rpx;
padding: 20rpx;

.form-item {
  padding: 20rpx;
  margin-bottom: 28rpx;
  background: #f7f7f7;
  border-radius: 16rpx;
}

::v-deep .place {
  color: rgba(0, 0, 0, 0.25);
}

// 优化：图片上传样式
.image-upload {
  padding: 32rpx;

  .upload-title {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 24rpx;
  }

  .upload-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx; // 图片之间的间距

    .image-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx; // 图片之间的间距

      .image-item {
        position: relative;

        image {
          width: 160rpx;
          height: 160rpx;
          border-radius: 12rpx;
        }

        .delete-btn {
          position: absolute;
          top: -8rpx;
          right: 12rpx;
          width: 32rpx;
          height: 32rpx;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          text {
            font-size: 28rpx;
          }
        }
      }
    }

    .upload-btn {
      width: 160rpx;
      height: 160rpx;
      border: 2rpx dashed #ddd;
      border-radius: 12rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;

      text {
        &:first-child {
          font-size: 48rpx;
        }

        &:last-child {
          font-size: 24rpx;
        }
      }
    }
  }

  .upload-tips {
    margin-top: 16rpx;
    font-size: 24rpx;
    color: #999;
  }
}
}
 

  
}
.image-upload {
  padding: 32rpx;
 

  .upload-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx; // 图片之间的间距

    .image-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx; // 图片之间的间距

      .image-item {
        position: relative;

        image {
          width: 160rpx;
          height: 160rpx;
          border-radius: 12rpx;
        }

        .delete-btn {
          position: absolute;
          top: -8rpx;
          right: 12rpx;
          width: 32rpx;
          height: 32rpx;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          text {
            font-size: 28rpx;
          }
        }
      }
    }

    .upload-btn {
      width: 160rpx;
      height: 160rpx;
      border: 2rpx dashed #ddd;
      border-radius: 12rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;

      text {
        &:first-child {
          font-size: 48rpx;
        }

        &:last-child {
          font-size: 24rpx;
        }
      }
    }
  }

  .upload-tips {
    margin-top: 16rpx;
    font-size: 24rpx;
    color: #999;
  }
}
.footer {
   
   position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
     padding: 20rpx;
     background: #fff;
   
   .add-btn {
     background: #ff6f0e;
     color: #fff;
     height: 80rpx;
     line-height: 80rpx;
     border-radius: 40rpx;
     font-size: 32rpx;
   }
 }
</style>