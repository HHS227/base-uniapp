<template>
	<view class="container">
		<TransNavVue title="确认订单"></TransNavVue>
		<view class="pay-center">
			<view v-if="addrdessList.consigneeName" class="name-box">
				<view class="address-header">
					<text>{{ addrdessList.consigneeName }}</text>
					<text class="change-btn" @click="openAddressPopup">更换地址</text>
				</view>
				<view >
          <text>{{addrdessList.province}} </text>
          <text>{{addrdessList.city}} </text>
          <text>{{addrdessList.region}} </text>
          {{addrdessList.addressDetail}}
        </view>
			</view>
			<view v-else class="empty-address" @click="goToAddAddress">
				<text>暂无收货地址，去添加</text>
				<image src="/static/images/myPapeImages/向右箭头.png" mode="aspectFit"></image>
			</view>
			<view class="pay-details" v-for="(item, index) in selectedItems" :key="index">
				<view class="details-box">
					<image :src="item.sku.picUrl" class="details-img" mode="aspectFill"></image>
					<view class="info">
						<text>{{item.name}}</text>
						<view class="details-price">￥{{(item.sku.price/100).toFixed(2) ||'-'}}</view>
					</view>
				</view>
				<view class="details-info">
					<text>商品价格</text>
					<text>￥{{(item.sku.price/100).toFixed(2) ||'-'}}</text>
				</view>
				<view class="details-info">
					<text>购买数量</text>
					<text>{{item.count}}</text>
				</view>
			</view>
			<view class="sale-box">
				<text>优惠券</text>
			</view>
		
			<view class="pay-method">
			  <text class="method-title">支付方式</text>
			  <view class="payment-option" >
			    <view class="option-icon">
			      <image  mode="scaleToFill"></image>
			    </view>
			    <view class="option-content">
			      <text class="option-name">微信支付</text>
			      <view class="option-desc">使用微信快捷支付</view>
			    </view>
			    <view class="option-radio">
			      <radio-group bindchange="radioChange">
			        <label>
			          <radio value="wechatPay" ></radio>
			        </label>
			      </radio-group>
			    </view>
			  </view>
			</view>
		</view>
		<view class="pay-bottom">
			<view class="pay-content" >
				<view class="total">
					合计：
					<view class="price">
						
						{{(totalPrice/100).toFixed(2) ||'-'}}
					</view>
				</view>
				<view class="pay-btn">
					<button class="settle-btn" @click="getPayList">确认支付</button>
				</view>
			</view>
			
		</view>

		<!-- 地址选择弹窗 -->
		<uni-popup ref="addressPopup" type="bottom">
			<view class="address-popup">
				<view class="popup-header">
					<text class="popup-title">选择收货地址</text>
					<text class="popup-close" @click="addressPopupClose">×</text>
				</view>
				<scroll-view scroll-y class="address-list">
					<view 
						v-for="(item, index) in addressList" 
						:key="index" 
						class="address-item"
						@click="selectAddress(item)"
					>
						<radio :checked="item.isDefault" color="#ff6f0e"></radio>
						<view class="address-info">
							<view class="address-name">
								<text>{{item.consigneeName}}</text>
								<text>{{item.phoneNumber}}</text>
							</view>
							<text class="address-detail">{{item.addressDetail}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	padding-bottom:40rpx ;
	height: 100vh;
	
	.pay-center{
		padding: 30rpx 30rpx 0rpx;
		.name-box{
			background-color: #fff;
			height: 150rpx;
			border-radius: 20rpx;
			padding: 20rpx;
			.name{
				margin-top: 20rpx;
				color: #000;
				font-weight: 600;
			}
		}
		.pay-details{
			margin-top: 20rpx;
			background-color: #fff;
			height: 300rpx;
			border-radius: 20rpx;
			padding: 20rpx;
			
			.details-box{
				display: flex;
			
				.details-img{
					width: 150rpx;
					height: 150rpx;
					background-color: #c3c3c3;
					border-radius: 5rpx;
				}
				.info{
					margin-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.details-price{
						color: orange;
					}
				}
			}
			.details-info{
				margin-top: 10rpx;
				color: #bbb;
				display: flex;
				justify-content: space-between;
			}
		}
		.sale-box{
			margin-top: 20rpx;
			background-color: #fff;
			height: 80rpx;
			border-radius: 20rpx;
			padding: 20rpx;
		}	
		.pay-method{
			margin-top: 20rpx;
			background-color: #fff;
			height: 200rpx;
			border-radius: 20rpx;
			padding: 20rpx;
			.method-title {
			  color: #999;
			  font-size: 30rpx;
			  margin-bottom: 15rpx;
			}
			.payment-option {
			  display: flex;
			  align-items: center;
			  justify-content: space-between;
			}
			.option-icon {
			  width: 60rpx;
			  height: 60rpx;
			  margin-right: 20rpx;
			}
			.option-icon image {
			  width: 100%;
			  height: 100%;
			}
			.option-content {
			margin-top: 10rpx;
			  flex: 1;
			}
			.option-name {
			  font-size: 36rpx;
			  color: #333;
			}
			.option-desc {
			  font-size: 28rpx;
			  color: #999;
			  margin-top: 5rpx;
			}
			.option-radio {
			  width: 40rpx;
			  height: 40rpx;
			}
		}
	}
	
	.pay-bottom {
		position: fixed;
		width: 100%;
		bottom: 0px;
		height: 148rpx;
		padding: 0 32rpx;
		background: #ffffff;
		border-top: 1rpx solid #eeeeee;
	
		.pay-content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100%;
	
			.pay-btn {
				.settle-btn {
					width: 280rpx;
					height: 96rpx;
					background: #ff6f0e;
					border-radius: 50rpx 50rpx 50rpx 50rpx;
					font-weight: 500;
					font-size: 32rpx;
					color: #ffffff;
					line-height: 96rpx;
				}
			}
	
			.total {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;
	
				.price {
					display: flex;
					align-items: center;
					font-weight: bold;
					font-size: 48rpx;
					color: #fa4b46;
	
					text {
						font-size: 28rpx;
					}
				}
			}
		}
	}
	
	
}
.empty-address {
  background-color: #fff;
  height: 150rpx;
  border-radius: 20rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ff6f0e;
  font-size: 32rpx;
  
  image {
    width: 40rpx;
    height: 40rpx;
  }
}
.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .change-btn {
    color: #ff6f0e;
    font-size: 28rpx;
  }
  
}

.address-popup {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
  max-height: 70vh;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .popup-title {
      font-size: 32rpx;
      font-weight: bold;
    }
    
    .popup-close {
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .address-list {
    max-height: 60vh;
  }
  
  .address-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eee;
    
    .address-info {
      margin-left: 20rpx;
      
      .address-name {
        display: flex;
        margin-bottom: 10rpx;
        
        text:first-child {
          margin-right: 20rpx;
          font-weight: bold;
        }
      }
      
      .address-detail {
        color: #666;
        font-size: 28rpx;
      }
    }
  }
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { request } from '@/utils/request'
import { useTokenStorage } from '../../utils/storage'  // 新增导入
import TransNavVue from '../../components/TransNav.vue';

const { getAccessToken} = useTokenStorage()  // 新增获取token方法
import { onShow } from '@dcloudio/uni-app';

const selectedItems = ref([]);
const totalPrice = ref(0);
const addrdessList = ref({});

const addressList = ref([]); // 存储所有地址列表
const addressPopup = ref(null);

// 获取地址列表
const getAddressList = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/shipping-address/list',
      showLoading: true,
    });
    
    if (res.code === 0 || res.code === 200) {
      addressList.value = res.data;
      // 设置默认地址
      const defaultAddress = res.data.find(item => item.isDefault) || res.data[0];
      if(defaultAddress) {
        addrdessList.value = defaultAddress;
      }
    }
  } catch (err) {
    console.error('获取地址列表失败:', err);
  }
};

// 选择地址
const selectAddress = (item) => {
  // 取消所有地址的选中状态
  addressList.value.forEach(addr => {
    addr.isDefault = false;
  });
  // 设置当前选中地址
  item.isDefault = true;
  addrdessList.value = item;
  addressPopup.value.close();
};

const openAddressPopup = () => {
  // 打开弹窗前确保当前地址被选中
  if (addrdessList.value.id) {
    addressList.value.forEach(addr => {
      addr.isDefault = addr.id === addrdessList.value.id;
    });
  }
  addressPopup.value.open();
};
const addressPopupClose = () => {
  
  addressPopup.value.close();
};


// 修改onShow方法
onShow(() => {
  getAddressList();
  getShoppingList();
});

const getShoppingList = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/shipping-address/list',
      showLoading: true, 
	  
    })
	console.log(res)
    if (res.code === 0 || res.code === 200) {
		addrdessList.value=res.data[0]
	
		
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } 
  catch (err) {
    console.error('获取地址失败:', err)
   
  }
}
const getPayList = async () => {
  try {
    // 1. 先创建订单
    const orderRes = await request({
      url: '/app-api/trade/cart/create/cartOrder',
	 

      data: {
        items: selectedItems.value.map(item => ({
          skuId: item.sku.id,
          count: item.count
        })),
		
        receiverName: addrdessList.value.consigneeName,
        deliveryType: 1,
        receiverMobile: addrdessList.value.phoneNumber
      },
      method: 'post',
      showLoading: true,
    });

    if (orderRes.code === 0 || orderRes.code === 200) {
		console.log(orderRes)
      
      // 2. 调用微信支付API
      const payRes = await uni.requestPayment({
        provider: 'wxpay',
        orderInfo: orderRes.data.payParams, // 假设后端返回支付参数
        success: (res) => {
          uni.showToast({
            title: '支付成功',
            icon: 'success'
          });
          // 3. 支付成功后跳转到"我的"页面
          uni.switchTab({
            url: '/pages/my/my'
          });
        },
        fail: (err) => {
          uni.showToast({
            title: '支付失败',
            icon: 'none'
          });
          console.error('支付失败:', err);
        }
      });
    } else {
      throw new Error(orderRes.msg || '订单创建失败');
    }
  } catch (err) {
    console.error('支付流程出错:', err);
    uni.showToast({
      title: err.message || '支付出错',
      icon: 'none'
    });
  }
}

onMounted(() => {
  
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (currentPage && currentPage.$vm) {
    const eventChannel = currentPage.$vm.getOpenerEventChannel();
    eventChannel.on('acceptSelectedItems', (data) => {
	
      if (data?.selectedItems) {
		console.log(data)
	selectedItems.value = data.selectedItems;
      totalPrice.value = data.totalPrice;
      getShoppingList()
      } else {
      
        uni.showToast({ title: '参数错误', icon: 'none' });
      }
    });
  }
  
  
});
const goToAddAddress = () => {
  uni.navigateTo({
    url: '/pages/userInfo/addressEdit'
  })
}

</script>
