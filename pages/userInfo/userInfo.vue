<template>
 <view>
  <TransNavVue title="设置" />
  <view class="container">
    
    <view class="content">
      <view class="item" >
        <text class="label">头像</text>
        <view class="right">
          <button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
              <image :src="userInfo.avatar" class="avatar"></image>
          </button>
          <image src="/static/images/rightBtn.png" class="arrow"></image>
        </view>
      </view>
      <view class="item" @click="showNicknameDialog">
        <text class="label">用户名</text>
        <view class="right">
          <text class="value">{{userInfo.nickname}}</text>
          <image src="/static/images/rightBtn.png" class="arrow"></image>
        </view>
      </view>
      
      <uni-popup ref="nicknamePopup" type="dialog">
          <view class="nickname-dialog">
              <text class="dialog-title">修改用户名</text>
              <input 
                  type="nickname" 
                  class="nickname-input" 
                  v-model="tempNickname" 
                  placeholder="请输入用户名"
                  confirm-type="done"
              />
              <view class="dialog-buttons">
                  <button @click="close">取消</button>
                  <button @click="confirmNickname">确定</button>
              </view>
          </view>
      </uni-popup>
      
      <view class="item" >
        <text class="label">电话</text>
        <view class="right">
          <text class="value">{{userInfo.phoneNumber}}</text>
         
        </view>
      </view>
      
      <view class="item" >
        <text class="label">性别</text>
        <view class="right">
          <text class="value">{{userInfo.gender==0?'男':'女'}}</text>
         
        </view>
      </view>
      
      <view class="item" @click="handleAddress">
        <text class="label">地址管理</text>
        <view class="right">
          <image src="/static/images/rightBtn.png" class="arrow"></image>
        </view>
      </view>
    </view>
  </view>
 </view>
</template>

<script setup>
import { ref } from 'vue'
import { request } from '@/utils/request'
import { useTokenStorage } from '../../utils/storage'
import { onMounted } from 'vue'
import TransNavVue from '../../components/TransNav.vue'
const { getAccessToken} = useTokenStorage()
const BASE_URL="https://www.cdsrh.top"

const userInfo = ref({})
const nicknamePopup = ref(null)
const tempNickname = ref('')

const handleAddress = () => {
  uni.navigateTo({ url: '/pages/userInfo/addressList' })
}

const onChooseAvatar = (e) => {
    uni.uploadFile({
            url: BASE_URL + '/app-api/infra/file/upload', 
            filePath: e.detail.avatarUrl,
            name: 'file', 
            success: (response) => {
              try {
                const data = JSON.parse(response.data);
                updateUserInfo('avatar', data.data);
              } catch (err) {
                
              }
            },
            
          });

};

const confirmNickname = () => {
    if(tempNickname.value.trim()) {
        updateUserInfo('nickname', tempNickname.value);
        nicknamePopup.value.close();
    } else {
        uni.showToast({
            title: '用户名不能为空',
            icon: 'none'
        });
    }
};
const close =()=>{
    nicknamePopup.value.close();
}
const updateUserInfo = async (type, value) => {
    try {
        const data = {};
        if (type === 'avatar') {
            data.avatar = value;
        } else if (type === 'nickname') {
            data.nickname = value;
        }
        
        const res = await request({
            url: '/app-api/weixin/user/modify/info',
            method: 'POST',
            data: data,
           
        });
        
        if (res.code === 0 || res.code === 200) {
            if (type === 'avatar') {
                userInfo.value.avatar = value;
            } else if (type === 'nickname') {
                userInfo.value.username = value;
            }
            uni.showToast({
                title: '更新成功',
                icon: 'success'
            });
        } else {
            throw new Error(res.msg || '更新失败');
        }
    } catch (err) {
        console.error('更新失败:', err);
        uni.showToast({
            title: '更新失败',
            icon: 'none'
        });
    }
};


const showNicknameDialog = () => {
    tempNickname.value = userInfo.value.username
    nicknamePopup.value.open()
}

const getUserInfo = async () => {
    try {
        const res = await request({
            url: '/app-api/weixin/user/get/myInfo',
            method: 'GET',
           
        });
        
        if (res.code === 0 || res.code === 200) {
            userInfo.value = {
                ...userInfo.value,
                ...res.data
            };
        } else {
            throw new Error(res.msg || '获取用户信息失败');
        }
    } catch (err) {
        console.error('获取用户信息失败:', err);
        uni.showToast({
            title: '获取用户信息失败',
            icon: 'none'
        });
    }
};

onMounted(() => {
    if (getAccessToken()) {
        getUserInfo();
    } else {
        uni.showModal({
            title: '提示',
            content: '请先登录',
            success: (res) => {
                if (res.confirm) {
                    uni.navigateTo({ url: '/pages/login/login' });
                }
            }
        });
    }
});
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #f7f7f7;
  
  .content {
    padding: 0 30rpx;
    
    .item {
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1rpx solid #eee;
      
      .label {
        font-size: 30rpx;
        color: #333;
      }
      
      .right {
        display: flex;
        align-items: center;
        
        .value {
          font-size: 28rpx;
          color: #999;
          margin-right: 20rpx;
        }
        
        .avatar-btn {
            background: transparent;
            padding: 0;
            margin: 0;
            border: none;
            line-height: 1;
            
            &::after {
                border: none;
            }
            
            .avatar {
                width: 80rpx;
                height: 80rpx;
                border-radius: 50%;
            }
        }
        margin-right: 20rpx;
        }
        
        .arrow {
          width: 30rpx;
          height: 30rpx;
        }
      }
    }
  }

.nickname-dialog {
    width: 100%;
    background: #fff;
    border-radius: 16rpx;
    padding: 40rpx;
    box-sizing: border-box;
    
    .dialog-title {
        font-size: 32rpx;
        color: #333;
        text-align: center;
        margin-bottom: 40rpx;
    }
    
    .nickname-input {
        width: 100%;
        height: 80rpx;
        border: 1rpx solid #eee;
        border-radius: 8rpx;
        padding: 0 20rpx;
        box-sizing: border-box;
        margin-bottom: 40rpx;
    }
    
    .dialog-buttons {
        display: flex;
        justify-content: space-between;
        
        button {
            flex: 1;
            height: 80rpx;
            line-height: 80rpx;
            font-size: 28rpx;
            border-radius: 8rpx;
            margin: 0 10rpx;
            
            &:first-child {
                background: #f7f7f7;
                color: #666;
            }
            
            &:last-child {
                background: #07c160;
                color: #fff;
            }
        }
    }
}
</style>