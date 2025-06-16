<template>
  <view>
    <TransNavVue title="新增蜂场" />
    <view class="container">
      <image src="/static/images/myPage/BeeEnterInfoBg.png" class="container-bg" mode=""></image>

      <view class="title-content">
        填写信息
        <text class="tips">填写相关信息，完成新增</text>
      </view>
      <view class="form-content">
        <view class="form-item " @click="chooseLocation">
          <view class="picker-view" :class="formData.address ? 'has-value' : ''">
            {{ formData.address || '请选择蜂场位置' }}
          </view>
        </view>
        <input :inputBorder="false" placeholder-class="place" v-model="formData.honeySeeds" placeholder="蜜源种类"
          class="form-item form-input" />
        <input :inputBorder="false" placeholder-class="place" v-model="formData.name" placeholder="蜂场名称"
          class="form-item form-input" />
        <input :inputBorder="false" placeholder-class="place" v-model="formData.area" placeholder="蜂场面积"
          class="form-item form-input" />
        <input :inputBorder="false" placeholder-class="place" v-model="formData.beeType" placeholder="蜜蜂种类"
          class="form-item form-input" />
        <input :inputBorder="false" placeholder-class="place" v-model="formData.ownerName" placeholder="养蜂人"
          class="form-item form-input" />
        <view class="form-item image-upload">
          <view class="upload-container">
            <view v-if="imageInfo.tempFilePath" class="image-preview">
              <view class="image-item">
                <image :src="imageInfo.tempFilePath" mode="aspectFill" @click="previewImage"></image>
                <view class="delete-btn" @click.stop="deleteImage">
                  <text>×</text>
                </view>
              </view>
            </view>
            <view class="upload-btn" @click="chooseImage" :style="{ display: imageInfo.tempFilePath ? 'none' : 'flex' }">
              <text>+</text>
              <text>上传图片</text>
            </view>
          </view>
          <text class="upload-tips">蜂场图片,仅支持上传1张</text>
        </view>
        <button class="submit-btn" @click="enterBtn">新增</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import TransNavVue from '../../components/TransNav.vue';
import { request, uploadImage } from '@/utils/request';

const formData = ref({
  honeySeeds: '',
  name: '',
  area: '',
  beeType: '',
  ownerName: '',
  imgUrl: '',
  address:'',
  latitude:'',
  longitude:''
});

// 优化：图片信息
const imageInfo = ref({
  tempFilePath: '',
  data: ''
});

//选择地址
const chooseLocation = () => {
  uni.showLoading({ title: '加载地图中...' });
  wx.chooseLocation({
    latitude: formData.value.latitude || undefined,
    longitude: formData.value.longitude || undefined,
    success: (res) => {
      uni.hideLoading();
      formData.value.address =  res.name;
      formData.value.latitude = res.latitude;
      formData.value.longitude = res.longitude;
    },
    fail: (err) => {
      uni.hideLoading();
      if (err.errMsg !== 'chooseLocation:fail cancel') {
        uni.showToast({ title: '位置选择失败', icon: 'none' });
      }
    }
  });
};


// 选择图片
const chooseImage = () => {
  if (imageInfo.value.tempFilePath) {
    uni.showToast({
      title: '已上传一张图片',
      icon: 'none'
    });
    return;
  }
  uploadImage(1)
    .then((result) => {
      imageInfo.value = result
      formData.value.imgUrl = result.data;
    })
    .catch((err) => {
      console.error('上传失败:', err);
    });

};


// 预览图片
const previewImage = () => {
  if (imageInfo.value.tempFilePath) {
    uni.previewImage({
      urls: [imageInfo.value.tempFilePath]
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
        imageInfo.value = {
          tempFilePath: '',
          data: ''
        };
        formData.value.image = '';
      }
    }
  });
};


const enterBtn = async () => {
  if (!formData.value.address || 
      !formData.value.honeySeeds || 
      !formData.value.name || 
      !formData.value.area || 
      !formData.value.beeType || 
      !formData.value.ownerName || 
      !formData.value.imgUrl) {
    uni.showToast({
      title: '请填写完整的数据',
      icon: 'none'
    });
    return;
  }
  try {
   

    const res = await request({
      url: '/app-api/weixin/beeFarmApply/create',
      showLoading: true,
      data: formData.value,
      method: 'post'
    });

    if (res.code === 0) {
      uni.navigateTo({
        url: '/pages/beeFarmerJion/jionFeedback'
      });
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
  position: relative;
  background: #f6f6f6;
  height: 100vh;
  z-index: 1;

  .container-bg {
    width: 100%;
    position: absolute;
    z-index: -1;
  }

  .title-content {
    margin-top: 70rpx;
    margin-left: 72rpx;
    display: flex;
    flex-direction: column;
    font-weight: bold;
    font-size: 48rpx;
    color: #1e1e1e;
    line-height: 72rpx;

    .tips {
      margin-top: 12rpx;
      font-size: 26rpx;
      color: #999999;
      line-height: 40rpx;
    }
  }

  .form-content {
    padding: 28rpx 15rpx;
    margin: 150rpx 20rpx 0rpx 20rpx;
    background: #ffffff;
    border-radius: 24rpx;

    .form-item {
      padding: 20rpx;
      margin-bottom: 20rpx;
      background: #f6f6f6;
      border-radius: 16rpx;
      font-size: 32rpx;
      .picker-view{
        &.has-value {
          color: #000;
        }

      &:not(.has-value) {
          color: rgba(0, 0, 0, 0.5);
      }
      }
 
      
    }


    .submit-btn {
      width: 622rpx;
      height: 96rpx;
      background: #FF6F0E;
      border-radius: 50rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #FFFFFF;
      line-height: 96rpx;
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
        .image-preview {
          .image-item {
            position: relative;

            image {
              width: 160rpx;
              height: 160rpx;
              border-radius: 12rpx;
              margin-bottom: 20rpx;
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
</style>