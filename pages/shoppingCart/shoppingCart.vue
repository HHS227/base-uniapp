<template>
	<view>
	  <!-- 自定义导航栏 -->
	  <TransNavVue title="购物车" />
  
	  <view class="container">
		<!-- 购物车头部（编辑切换） -->
		<view class="cart-header">
		  <!-- 根据编辑状态显示“编辑商品”或“退出编辑” -->
		  <text 
			class="header-btn" 
			:style="{ color: isEdit ? '#333' : '#ff6f0e' }" 
			@click="toggleEdit"
		  >
			{{ isEdit ? '退出编辑' : '编辑商品' }}
		  </text>
		</view>
  
		<!-- 商品列表 -->
		<scroll-view 
		  scroll-y 
		  class="goods-list" 
		  :style="{ paddingBottom: isEdit ? '148rpx' : '148rpx' }"
		>
		  <!-- 空购物车提示 -->
		  <view v-if="cartList.length === 0" class="empty-cart">
			<text class="empty-text">购物车暂无商品</text>
		  </view>
  
		  <!-- 商品项循环 -->
		  <view 
			class="goods-item" 
			v-else 
			v-for="item in cartList" 
			:key="item.id"
		  >
			<!-- 左侧：选择框 + 商品信息 -->
			<view class="item-left">
			  <!-- 选择框 -->
			  <checkbox-group style="transform: scale(0.7)" @change="toggleSelect(item)">
				<checkbox color="#ff6f0e" :checked="item.selected" />
			  </checkbox-group>
  
			  <!-- 商品图片 -->
			  <image 
				class="goods-image" 
				:src="item.sku.picUrl" 
				mode="aspectFill" 
			  />
  
			  <!-- 商品信息 -->
			  <view class="goods-info">
				<text class="goods-title">{{ item.name }}</text>
				<text class="goods-weight">{{ item.weight }}</text>
				<text class="goods-price">¥{{ (item.sku.price * item.count / 100).toFixed(2) }}</text>
			  </view>
			</view>
  
			<!-- 右侧：操作区（删除/数量编辑） -->
			<view class="item-right">
			  <!-- 编辑状态下显示“删除” -->
			  <view 
				class="delete-btn" 
				@click.stop="deleteItem(item)" 
				v-if="isEdit"
			  >
				删除
			  </view>
  
			  <!-- 数量操作区 -->
			  <view class="goods-actions">
				<!-- 非编辑状态：仅显示数量 -->
				<view class="goods-count" v-if="!isEdit">x{{ item.count }}</view>
  
				<!-- 编辑状态：显示加减按钮 -->
				<view class="actions-btn" v-else>
				  <view class="count-btn minus" @click="decreaseCount(item)">-</view>
				  <view class="count-num">x{{ item.count }}</view>
				  <view class="count-btn plus" @click="increaseCount(item)">+</view>
				</view>
			  </view>
			</view>
		  </view>
		</scroll-view>
  
		<!-- 结算/编辑操作栏 -->
		<view class="settlement-bar">
		  <!-- 非编辑状态：显示合计与支付 -->
		  <view class="pay-content" v-if="!isEdit">
			<view class="total">
			  合计({{ selectedCount }})：
			  <view class="price">
				<text>¥</text>
				{{ (totalPrice / 100).toFixed(2) || '-' }}
			  </view>
			</view>
			<view class="pay-btn">
			  <button class="settle-btn" @click="payBtn">立即付款</button>
			</view>
		  </view>
  
		  <!-- 编辑状态：底部不显示任何内容（根据需求调整） -->
		  <view class="edit-actions" v-else></view>
		</view>
  
		<!-- 安全区域占位 -->
		<view class="safe-view" style="background: #ffffff"></view>
	  </view>
	</view>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { request } from '@/utils/request';
  import { useTokenStorage } from '../../utils/storage'; 
  import TransNavVue from '../../components/TransNav.vue';
  
  // 状态与数据
  const isEdit = ref(false);        // 编辑状态
  const cartList = ref([]);        // 购物车列表
  
  // 响应式计算
  const selectedCount = computed(() => 
	cartList.value.filter(item => item.selected).length
  );
  const totalPrice = computed(() => 
	cartList.value.filter(item => item.selected)
	  .reduce((total, item) => total + (item.sku.price * item.count), 0)
  );
  
  // 切换编辑状态
  const toggleEdit = () => {
	isEdit.value = !isEdit.value;
  };
  
  // 获取购物车数据
  const getCartList = async () => {
	try {
	  const res = await request({
		url: '/app-api/trade/cart/list',
		showLoading: true 
	  });
	  if ([0, 200].includes(res.code)) {
		cartList.value = res.data.validList;
	  } else {
		throw new Error(res.msg || '数据异常');
	  }
	} catch (err) {
	  console.error('获取购物车数据失败:', err);
	}
  };
  
  onMounted(() => {
	getCartList();
  });
  
  // 跳转支付
  const payBtn = () => {
	const selectedItems = cartList.value.filter(item => item.selected);
	if (selectedItems.length === 0) {
	  return uni.showToast({ title: '请选择商品', icon: 'none' });
	}
	
	uni.navigateTo({
	  url: '/pages/shoppingMall/shoppingPay',
	  success: (res) => {
		res.eventChannel.emit('acceptSelectedItems', {
		  selectedItems,
		  totalPrice: totalPrice.value
		});
	  }
	});
  };
  
  // 切换单个商品选中状态
  const toggleSelect = async (item) => {
	item.selected = !item.selected;
	try {
	  await request({
		url: '/app-api/trade/cart/update-selected',
		method: 'put',
		data: {
		  ids: [item.sku.id],
		  selected: item.selected
		}
	  });
	} catch (err) {
	  console.error('更新选中状态失败:', err);
	  item.selected = !item.selected; // 回滚
	}
  };
  
  // 更新商品数量（封装复用）
  const updateCount = async (item, newCount) => {
	const oldCount = item.count;
	item.count = newCount; // 先更新本地
	
	try {
	  await request({
		url: '/app-api/trade/cart/update-count',
		method: 'put',
		data: {
		  id: item.sku.id,
		  count: newCount
		}
	  });
	  uni.showToast({ title: '数量更新成功', icon: 'none' });
	} catch (err) {
	  console.error('更新数量失败:', err);
	  item.count = oldCount; // 回滚
	  uni.showToast({ title: '数量更新失败', icon: 'none' });
	}
  };
  
  // 减少数量
  const decreaseCount = async (item) => {
	if (item.count > 1) {
	  await updateCount(item, item.count - 1);
	} else {
	  uni.showToast({ title: '商品数量不能少于1', icon: 'none' });
	}
  };
  
  // 增加数量
  const increaseCount = async (item) => {
	await updateCount(item, item.count + 1);
  };
  
  // 删除单个商品
  const deleteItem = async (item) => {
	try {
	  const res = await request({
		url: `/app-api/trade/cart/delete?ids=${item.sku.id}`,
		method: 'delete',
		showLoading: true
	  });
	  
	  if ([0, 200].includes(res.code)) {
		uni.showToast({ title: '删除成功', icon: 'success' });
		getCartList(); // 重新拉取数据
	  } else {
		throw new Error(res.msg || '删除失败');
	  }
	} catch (err) {
	  console.error('删除商品失败:', err);
	  uni.showToast({ title: err.message || '删除失败', icon: 'none' });
	}
  };
  </script>
  
  <style lang="scss" scoped>
  .container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f6f6f6;
	position: relative;
  }
  
  /* 头部：编辑切换 */
  .cart-header {
	height: 42rpx;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin: 9rpx 0;
  
	.header-btn {
	  font-size: 22rpx;
	  margin-right: 30rpx;
	  line-height: 42rpx;
	}
  }
  
  /* 商品列表 */
  .goods-list {
	flex: 1;
	overflow-y: auto;
	padding: 0 10rpx;
  
	.goods-item {
	  display: flex;
	  padding: 20rpx;
	  margin-bottom: 20rpx;
	  background: #fff;
	  border-radius: 16rpx;
	  justify-content: space-between;
  
	  .item-left {
		display: flex;
		align-items: center;
  
		.goods-image {
		  width: 200rpx;
		  height: 200rpx;
		  margin: 0 20rpx;
		}
  
		.goods-info {
		  display: flex;
		  flex-direction: column;
  
		  .goods-title {
			font-size: 28rpx;
			color: #000;
			line-height: 42rpx;
			font-weight: 500;
		  }
  
		  .goods-weight {
			font-size: 22rpx;
			color: #707070;
			line-height: 32rpx;
			margin-top: 10rpx;
		  }
  
		  .goods-price {
			font-size: 36rpx;
			color: #fa4b46;
			line-height: 32rpx;
			margin-top: 72rpx;
			font-weight: 500;
		  }
		}
	  }
  
	  .item-right {
		position: relative;
		display: flex;
		align-items: flex-end;
		min-width: 80rpx;
  
		.delete-btn {
		  position: absolute;
		  top: 0;
		  right: 0;
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
  
		.goods-actions {
		  display: flex;
		  align-items: center;
  
		  .goods-count {
			width: 58rpx;
			height: 58rpx;
			border: 1rpx solid #bebebe;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		  }
  
		  .actions-btn {
			display: flex;
			align-items: center;
  
			.count-btn {
			  width: 58rpx;
			  height: 58rpx;
			  background: #f2f2f2;
			  border-radius: 8rpx;
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
  
  /* 空购物车 */
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
  
  /* 底部操作栏 */
  .settlement-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 148rpx;
	padding: 0 32rpx;
	background: #fff;
	border-top: 1rpx solid #eee;
	z-index: 10;
  
	.pay-content {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  height: 100%;
  
	  .total {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		display: flex;
		align-items: center; 
  
		.price {
		  display: flex;
		  align-items: center;
		  font-size: 48rpx;
		  color: #fa4b46;
		  font-weight: bold;
  
		  text {
			font-size: 28rpx;
		  }
		}
	  }
  
	  .pay-btn {
		.settle-btn {
		  width: 280rpx;
		  height: 96rpx;
		  background: #ff6f0e;
		  border-radius: 50rpx;
		  font-size: 32rpx;
		  color: #fff;
		  line-height: 96rpx;
		}
	  }
	}
  
	.edit-actions {
	  /* 编辑状态下底部不显示任何内容 */
	  display: none;
	}
  }
  </style>