<template>
	<view class="container">
		<TransNavVue title="确认订单"></TransNavVue>
		<view class="pay-center">
			<view class="name-box">
				<text>{{ addrdessList.consigneeName }}</text>
				<view class="name">{{ addrdessList.addressDetail }}</view>
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
	</view>
</template>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	padding-bottom:40rpx ;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	
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
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { request } from '@/utils/request'
import { useTokenStorage } from '../../utils/storage'  // 新增导入
import TransNavVue from '../../components/TransNav.vue';

const { getAccessToken} = useTokenStorage()  // 新增获取token方法

const selectedItems = ref([]);
const totalPrice = ref(0);
const addrdessList = ref({});

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
</script>
