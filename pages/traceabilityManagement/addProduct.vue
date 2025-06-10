<template>
  <view>
    <TransNavVue title="新增商品" />
    <view class="container">
      
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
          <view class="upload-title">商品图片</view>
          <view class="upload-container">
            <!-- 展示已上传的图片 -->
            <view class="image-preview" v-if="imageList.length">
              <view class="image-item" v-for="(img, index) in imageList" :key="index">
                <image :src="img.tempFilePath" mode="aspectFill" @click="previewImage(index)"></image>
                <view class="delete-btn" @click.stop="deleteImage(index)">
                  <text>×</text>
                </view>
              </view>
            </view>
            
            <!-- 上传按钮，图片数量不足9张时显示 -->
            <view class="upload-btn" @click="chooseImage" 
                  :style="{ display: imageList.length >= 9 ? 'none' : 'flex' }">
              <text>+</text>
              <text>上传图片</text>
            </view>
          </view>
          <text class="upload-tips">最多上传9张图片</text>
        </view>

        <button class="submit-btn" @click="enterBtn">新增</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TransNavVue from '../../components/TransNav.vue';
import { request } from '@/utils/request';
import { useTokenStorage } from '../../utils/storage'
const { getAccessToken } = useTokenStorage()

const formData = ref({
  name: '',
  describe: '',
  price: '',
  imgUrls: [], // 存储多张图片的URL
  stock: '',
  beeFarmId: ''
})

// 存储所有图片信息的数组
const imageList = ref([]);

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const beeFarmId = currentPage.$page.options || currentPage.options
  if (beeFarmId.id) {
    formData.value.beeFarmId = beeFarmId.id
  } else {
    console.error('蜂场 ID 缺失')
  }
})

// 选择图片（使用uni.uploadFile）
const chooseImage = () => {
  if (imageList.value.length >= 9) {
    uni.showToast({
      title: '最多上传9张图片',
      icon: 'none'
    });
    return;
  }

  uni.chooseImage({
    count: 9 - imageList.value.length, // 最多选择剩余可上传数量的图片
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
        const BASE_URL = 'http://192.168.1.132:48080'
        const uploadPromises = res.tempFilePaths.map(tempFilePath => {
          return new Promise((resolve, reject) => {
            uni.uploadFile({
              url: BASE_URL + '/app-api/infra/file/upload',
              filePath: tempFilePath,
              name: 'file',
              header: {
                'Authorization': `Bearer ${getAccessToken()}`
              },
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

        // 并行上传所有图片
        const uploadResults = await Promise.all(uploadPromises);
        
        // 添加到图片列表
        imageList.value = [...imageList.value, ...uploadResults];
        
        // 更新表单数据中的图片URL
        formData.value.imgUrls = uploadResults.map(img => img.data);

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

// 预览图片
const previewImage = (index) => {
  if (imageList.value.length > index) {
    uni.previewImage({
      urls: imageList.value.map(img => img.tempFilePath),
      current: imageList.value[index].tempFilePath
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
        
        // 更新表单数据中的图片URL
        formData.value.imgUrls = imageList.value.map(img => img.data);
      }
    }
  });
};

const enterBtn = async () => {
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

    const res = await request({
      url: '/app-api/weixin/traceability/create',
      showLoading: true,
      data: formData.value,
      method: 'post'
    });

    if (res.code === 0) {
      uni.navigateTo({
        url: `/pages/traceabilityManagement/traceabilityManagement?id=${formData.value.beeFarmId}`
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

const selectCity = (e) => {
  // 将数组转换为空格分隔的字符串
  formData.value.region = e.detail.value.join(' ');
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
    height: 548rpx;
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
    padding: 48rpx 15rpx;
    margin: auto;
    width: 686rpx;
    background: #ffffff;
    border-radius: 24rpx;

    .form-item {
      padding-left: 32rpx;
      margin-bottom: 28rpx;
      width: 622rpx;
      background: #f6f6f6;
      border-radius: 16rpx;

      .picker-view {
        padding: 32rpx 0;
        line-height: 48rpx;
        font-size: 32rpx;

        &.has-value {
          color: #000;
        }

        &:not(.has-value) {
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }

    ::v-deep .place {
      color: rgba(0, 0, 0, 0.25);
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
</style>    