<template>
	<view class="container">
		<!-- 购物车头部 -->
		<view class="cart-header">
			<text class="header-title" @click="editGoods" v-if='cartList.length>0'>编辑商品</text>
		</view>
		<!-- 商品列表 -->
		<scroll-view scroll-y class="goods-list">
			<view v-if="cartList.length === 0" class="empty-cart">
				
				<text class="empty-text">购物车暂无商品</text>
			</view>
			<view class="goods-item" v-for="item in cartList" :key="item.id">
				<view class="item-left">
					<checkbox-group style="transform: scale(0.7)" @change="toggleSelect(item)">
						<checkbox color="#ff6f0e" :checked="item.selected" />
					</checkbox-group>
					<image class="goods-image" :src="item.sku.picUrl" mode="aspectFill" />
					<view class="goods-info">
						<text class="goods-title">{{ item.name }}</text>
						<text class="goods-weight">{{ item.weight }}</text>
						<text class="goods-price">¥{{ (item.sku.price * item.count / 100).toFixed(2) }}</text>
					</view>
				</view>
				<view class="item-right">
					<view class="delete-btn" @click.stop="deleteItem(item)" v-if="isEdit">删除</view>
					<view class="goods-actions">
						<view class="goods-count" v-if="!isEdit">x{{ item.count }}</view>
						<view class="actions-btn" v-if="isEdit">
							<view class="count-btn minus" @click="decreaseCount(item)">-</view>
							<view class="count-num">x{{ item.count }}</view>
							<view class="count-btn plus" @click="increaseCount(item)">+</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 结算区域 -->
		<view class="settlement-bar">
			<view class="pay-content" v-if="!isEdit ">
				<view class="total">
					合计({{ selectedCount }})：
					<view class="price">
						<text>¥</text>
						{{(totalPrice/100).toFixed(2) ||'-'}}
						
					</view>
				</view>
				<view class="pay-btn">
					<button class="settle-btn" @click='payBtn'>
						立即付款
						
					</button>
				</view>
			</view>
			<view class="edit-actions" v-else>
				<button class="cancel-edit-btn" @click="isEdit = false">退出编辑</button>
				<button class="delete-btn" @click="deleteSelectedItems">删除选中</button>
			</view>
		</view>
		<view class="safe-view" style="background: #ffffff"></view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { request } from '@/utils/request'
import { useTokenStorage } from '../../utils/storage'  // 新增导入

	const { getAccessToken } = useTokenStorage()  // 新增获取token方法

const isEdit = ref(false);
const cartList = ref([]);

const getCartList = async () => {
  try {
    const res = await request({
      url: '/app-api/trade/cart/list',
      showLoading: true, 
	  
    })
	console.log(res)
    if (res.code === 0 || res.code === 200) {
	cartList.value=res.data.validList
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } 
  catch (err) {
    console.error('获取商场数据失败:', err)
  }
}

onMounted(() => {
  getCartList()
})
 
//编辑商品
const editGoods = () => {
	isEdit.value = true;
};



// 是否全选
const isAllSelected = computed(() => {
	return cartList.value.every((item) => item.selected);
});

// 选中商品数量
const selectedCount = computed(() => {
	return cartList.value.filter((item) => item.selected).length;
});

// 总价
const totalPrice = computed(() => {
	return cartList.value
		.filter((item) => item.selected)
		.reduce((total, item) => total + (item.sku.price * item.count), 0);
});



// 全选/取消全选
const toggleAllSelect = () => {
	const shouldSelect = !isAllSelected.value;
	cartList.value.forEach((item) => {
		item.selected = shouldSelect;
	});
};

// 删除选中商品
const deleteSelectedItems = () => {
	cartList.value = cartList.value.filter((item) => !item.selected);
};

// 跳转到支付页面
const payBtn = () => {
  const selectedItems = cartList.value.filter(item => item.selected);
  if (selectedItems.length === 0) {
    uni.showToast({
      title: '请选择要购买的商品',
      icon: 'none'
    });
    return;
  }
  
  uni.navigateTo({
    url: '/pages/shoppingMall/shoppingPay',
    success: (res) => {
      res.eventChannel.emit('acceptSelectedItems', {
        selectedItems: selectedItems,
        totalPrice: totalPrice.value
      });
    }
  });
};

// 修改选中状态时调用接口
const toggleSelect = async (item) => {
  item.selected = !item.selected;
  try {
    await request({
      url: '/app-api/trade/cart/update-selected',
      method: 'put',
      data: {
        ids: [item.sku.id],
        selected: item.selected
      },
     
    });
  } catch (err) {
    console.error('更新选中状态失败:', err);
    item.selected = !item.selected; // 失败时回滚状态
  }
};

// 修改商品数量时调用接口
const updateCount = async (item, newCount) => {
  const oldCount = item.count;
  item.count = newCount; // 先更新本地显示
  
  try {
    await request({
      url: '/app-api/trade/cart/update-count',
      method: 'put',
      data: {
        id: item.sku.id,
        count: newCount
      },
   
    });
    // 接口调用成功后，可以添加成功提示
    uni.showToast({
      title: '数量更新成功',
      icon: 'none'
    });
  } catch (err) {
    console.error('更新数量失败:', err);
    item.count = oldCount; // 失败时回滚数量
    uni.showToast({
      title: '数量更新失败',
      icon: 'none'
    });
  }
};

const decreaseCount = async (item) => {
  if (item.count > 1) {
    await updateCount(item, item.count - 1);
  } else {
    uni.showToast({
      title: '商品数量不能少于1',
      icon: 'none'
    });
  }
};

const increaseCount = async (item) => {
  await updateCount(item, item.count + 1);
};

// 删除单个商品
const deleteItem = async (item) => {
	const ids=[item.sku.id]
  try {
    const res = await request({
      url: `/app-api/trade/cart/delete?ids=${ids}`,
      method: 'delete',
     
      showLoading: true
    });
    
    if (res.code === 0 || res.code === 200) {
      uni.showToast({
        title: '删除成功',
        icon: 'success'
      });
      getCartList();
    } else {
      throw new Error(res.msg || '删除失败');
    }
  } catch (err) {
    console.error('删除商品失败:', err);
    uni.showToast({
      title: err.message || '删除失败',
      icon: 'none'
    });
  }
};
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f6f6f6;

	.cart-header {
		margin-top: 9rpx;
		height: 42rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;

		.header-title {
			font-weight: 400;
			font-size: 22rpx;
			color: #ff6f0e;
			line-height: 42rpx;
			margin-right: 30rpx;
		}
	}

	.goods-list {
		margin-top: 9rpx;
		flex: 1;
		height: 400rpx;

		.goods-item {
			display: flex;
			padding: 20rpx;
			margin-bottom: 20rpx;
			background: #ffffff;
			border-radius: 16rpx;
			justify-content: space-between;

			.item-left {
				display: flex;
				align-items: center;

				.goods-image {
					width: 200rpx;
					height: 200rpx;
					margin-left: 20rpx;
				}

				.goods-info {
					display: flex;
					flex-direction: column;
					margin-left: 24rpx;

					.goods-title {
						font-weight: 500;
						font-size: 28rpx;
						color: #000000;
						line-height: 42rpx;
					}

					.goods-weight {
						font-weight: 400;
						font-size: 22rpx;
						color: #707070;
						line-height: 32rpx;
						margin-top: 10rpx;
					}

					.goods-price {
						margin-top: 72rpx;
						font-weight: 500;
						font-size: 36rpx;
						color: #fa4b46;
						line-height: 32rpx;
					}
				}
			}

			.item-right {
				margin-left: 20rpx;
				display: flex;
				align-items: flex-end;
				min-width: 80rpx;

				.goods-actions {
					display: flex;
					align-items: center;

					.goods-count {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 58rpx;
						height: 58rpx;
						border-radius: 8rpx 8rpx 8rpx 8rpx;
						border: 1rpx solid #bebebe;
					}

					.actions-btn {
						display: flex;
						align-items: center;

						.count-btn {
							width: 58rpx;
							height: 58rpx;
							background: #f2f2f2;
							border-radius: 8rpx 8rpx 8rpx 8rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 32rpx;
							line-height: 58rpx;
						}

						.count-num {
							width: 80rpx;
							height: 58rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 28rpx;
						}
					}
				}
			}
		}
	}

	.settlement-bar {
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
		.edit-actions {
			display: flex;
			height: 100%;
			justify-content: space-between;
			align-items: center;
			.cancel-edit-btn,
			.delete-btn {
				margin: 0;
				width: 280rpx;
				height: 96rpx;
				border-radius: 50rpx 50rpx 50rpx 50rpx;
				font-weight: 500;
				font-size: 32rpx;
				line-height: 96rpx;
			}

			.cancel-edit-btn {
				background: #f2f2f2;
				color: #333;
			}

			.delete-btn {
				background: #fa4b46;
				color: #fff;
			}
		}
	}
}
.item-right {
  position: relative;
  
  .delete-btn {
    position: absolute;
    top: 0rpx;
    right: 0rpx;
    width: 80rpx;
    height: 40rpx;
    background: transparent;
    color: #999;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    z-index: 1;
  }
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  
 
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
