<template>
  <view>
    <TransNavVue title="新增设备"></TransNavVue>
    <view class="container">
     
      <view class="form-content">
        <input :inputBorder="false" placeholder-class="place" v-model="formData.facilityName" placeholder="设备名称"
          class="form-item form-input" />
        <input :inputBorder="false" placeholder-class="place" v-model="formData.facilityType" placeholder="设备类型"
          class="form-item form-input" />
        <input :inputBorder="false" placeholder-class="place" v-model="formData.no" placeholder="设备编号"
          class="form-item form-input" />
       
          <view class="form-item image-upload">
                    
                    <view class="upload-container">
                        <view v-if="mainImage.tempFilePath" class="image-preview">
                            <view class="image-item">
                                <image :src="mainImage.tempFilePath" mode="aspectFill" @click="previewImage"></image>
                                <view class="delete-btn" @click.stop="deleteImage">
                                    <text>×</text>
                                </view>
                            </view>
                        </view>
                        <view class="upload-btn" @click="chooseImage" :style="{display: mainImage.tempFilePath ? 'none' : 'flex'}">
                            <text>+</text>
                            <text>上传图片</text>
                        </view>
                    </view>
                    <text class="upload-tips">仅支持上传1张</text>
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
  facilityName: '',
  facilityType: '',
  no: '',
  farmId: '',
  imgUrl: ''
})
const mainImage = ref({
  tempFilePath: '',
  data: ''
})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const beeFarmId = currentPage.$page.options || currentPage.options
  if (beeFarmId.id) {
    formData.value.farmId = beeFarmId.id
  } else {
    console.error('蜂场 ID 缺失')
  }
})

// 选择图片
const chooseImage = () => {
  if (mainImage.value.tempFilePath) {
    uni.showToast({
      title: '已上传一张图片',
      icon: 'none'
    });
    return;
  }

  uni.chooseImage({
    count: 1,
    success: async (res) => {
      if (!res || !res.tempFilePaths || res.tempFilePaths.length === 0) {
        uni.showToast({
          title: '未选择图片',
          icon: 'none'
        });
        return;
      }

      const tempFilePath = res.tempFilePaths[0];
      uni.showLoading({
        title: '上传中...'
      });

      try {
        
        const uploadRes = await new Promise((resolve, reject) => {
          uni.uploadFile({
            url: BASE_URL + '/app-api/infra/file/upload',
            filePath: tempFilePath,
            name: 'file',
           
            success: (response) => {
              try {
                const data = JSON.parse(response.data);
                resolve(data);
              } catch (err) {
                reject(new Error('解析响应失败'));
              }
            },
            fail: (err) => {
              reject(err);
            }
          });
        });

        if (uploadRes.code === 0) {
          mainImage.value = {
            tempFilePath,
            data: uploadRes.data
          };
          formData.value.imgUrl = uploadRes.data;

          uni.showToast({
            title: '上传成功',
            icon: 'success'
          });
        } else {
          throw new Error(uploadRes.msg || '图片上传失败');
        }
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

// 预览图片
const previewImage = () => {
  if (mainImage.value.tempFilePath) {
    uni.previewImage({
      urls: [mainImage.value.tempFilePath]
    });
  }
};

// 删除图片
const deleteImage = () => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这张图片吗？',
    success: (res) => {
      if (res.confirm) {
        mainImage.value = {
          tempFilePath: '',
          data: ''
        };
        formData.value.image = '';
      }
    }
  });
};

//提交
const enterBtn = async () => {
  try {
    // 验证表单
    if (!formData.value.facilityName) {
      uni.showToast({
        title: '请输入商品名称',
        icon: 'none'
      });
      return;
    }

    const res = await request({
      url: '/app-api/front/bee-farm/add/facility',
      showLoading: true,
      data: formData.value,
      method: 'post'
    });

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
  height: 300rpx;

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