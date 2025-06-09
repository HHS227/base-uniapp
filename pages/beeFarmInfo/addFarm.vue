<template>
    <view>
        <TransNavVue title="新增蜂场"/>
        <view class="container">
            <image src="/static/images/myPage/BeeEnterInfoBg.png" class="container-bg" mode=""></image>
            
            <view class="title-content">
                填写信息
                <text class="tips">填写相关信息，完成新增</text>
            </view>
            <view class="form-content">
                <picker mode="region" @change="selectCity" class="form-item">
                    <view class="picker-view" :class="{ 'has-value': formData.region }">
                        {{ formData.region || '请选择省、市、区' }}
                    </view>
                </picker>
                <input :inputBorder="false" placeholder-class="place" v-model="formData.honeySeeds" placeholder="蜜源种类" class="form-item form-input" />
                <input :inputBorder="false" placeholder-class="place" v-model="formData.name" placeholder="蜂场名称" class="form-item form-input" />
                <input :inputBorder="false" placeholder-class="place" v-model="formData.area" placeholder="蜂场面积" class="form-item form-input" />
                <input :inputBorder="false" placeholder-class="place" v-model="formData.beeType" placeholder="蜜蜂种类" class="form-item form-input" />
                <input :inputBorder="false" placeholder-class="place" v-model="formData.ownerName" placeholder="养蜂人" class="form-item form-input" />
                
        
                <view class="form-item image-upload">
                    <view class="upload-title">蜂场图片</view>
                    <view class="upload-container">
                        <view v-if="imageInfo.tempFilePath" class="image-preview">
                            <view class="image-item">
                                <image :src="imageInfo.tempFilePath" mode="aspectFill" @click="previewImage"></image>
                                <view class="delete-btn" @click.stop="deleteImage">
                                    <text>×</text>
                                </view>
                            </view>
                        </view>
                        <view class="upload-btn" @click="chooseImage" :style="{display: imageInfo.tempFilePath ? 'none' : 'flex'}">
                            <text>+</text>
                            <text>上传图片</text>
                        </view>
                    </view>
                    <text class="upload-tips">仅支持上传1张</text>
                </view>
                
                <button class="submit-btn" @click="enterBtn">新增</button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue';
import TransNavVue from '../../components/TransNav.vue';
import { request } from '@/utils/request';

const formData = ref({
    region: '',
    honeySeeds: '',
    name: '',
    area: '',
    beeType: '',
    ownerName: '',
    image: '' // 存储单张图片上传后的data
});

// 优化：图片信息
const imageInfo = ref({
    tempFilePath: '', // 本地临时路径
    data: ''          // 服务器返回的数据
});
//选择图片
const chooseImage = () => {
  if (imageInfo.value.tempFilePath) {
    uni.showToast({
      title: '已上传一张图片',
      icon: 'none'
    });
    return;
  }
  
  uni.chooseImage({
    count: 1,
    success: async (res) => {
		console.log(res,'1212')
      // 新增：校验 res 是否存在且包含 tempFilePaths
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
        const tempFilePath = res.tempFilePaths[0]; // 确保索引存在
        console.log(tempFilePath,'111')
        // 读取图片文件
        const file = await readImageFile(tempFilePath);
        console.log(file,'111')
        // 上传图片
        const uploadRes = await request({
          url: '/app-api/infra/file/upload',
          method: 'post',
          data: {
            file: file // 直接传递二进制文件
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (uploadRes.code === 0) {
          // 保存图片信息
          imageInfo.value = {
            tempFilePath,
            data: uploadRes.data
          };
          
          // 保存到表单数据
          formData.value.image = uploadRes.data;
          
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
      // 新增：处理用户取消选择等失败情况
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

// 读取图片文件内容
const readImageFile = (filePath) => {
  return new Promise((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath,
	  
      success: (res) => {
        resolve(res.data);

      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

const enterBtn = async () => {
  try {
    // 验证表单
    if (!formData.value.name) {
      uni.showToast({
        title: '请输入蜂场名称',
        icon: 'none'
      });
      return;
    }
    
    // if (!formData.value.image) {
    //   uni.showToast({
    //     title: '请上传蜂场图片',
    //     icon: 'none'
    //   });
    //   return;
    // }
    
    const res = await request({
      url: '/app-api/weixin/beeFarmApply/create',
      showLoading: true, 
      data: formData.value,
      method: 'post'
    });
   
    if (res.code === 0 ) {
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
        .submit-btn{
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
                            background: rgba(0,0,0,0.6);
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