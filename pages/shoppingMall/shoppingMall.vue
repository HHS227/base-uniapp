<template>
	<BeeTabbarVue active-tab="shoppingMall"></BeeTabbarVue>
	<view class="container">
		<view class="floating-btn cart-btn">
			<image src="/static/images/cart.png" mode="aspectFit" class="cart-icon"></image>
			<view class="btn-text">购物车</view>
		</view>
		<view class="floating-btn message-btn" @click="gotoMessage">
			<image src="/static/images/message.png" mode="aspectFit" class="cart-icon"></image>
			<view class="btn-text">消息</view>
		</view>
		<scroll-view scroll-y="true" class="scroll-view" enable-flex>
			<view class="goods-item" v-for="item in 10">
				<image src="/static/logo.png" mode="" class="goods-image"></image>
				<view class="goods-title">天然蜂蜜天然商品标题天然蜂蜜天然商品标题</view>
				<view class="goods-info">
					<view class="goods-weight">
						重量：
						<text>22kg</text>
					</view>
					<view class="goods-weight">已售268</view>
				</view>
				<view class="goods-handle">
					<view class="goods-price">
						￥
						<text>76</text>
						<view class="normal-price">￥82</view>
					</view>
					<view>

						<button class="buy-btn">购买</button>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="tabbar-bottom"></view>
	</view>
</template>

<script setup>
import BeeTabbarVue from '../../components/BeeTabbar.vue';

const gotoMessage =()=>{
	uni.navigateTo({
		url:'/pages/messagePage/messagePage'
	})
}
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f7f7f7;

	.cart-btn {
		bottom: 384rpx;

		.cart-icon {
			width: 45rpx;
			height: 41rpx;
		}
	}

	.message-btn {
		bottom: 257rpx;

		.cart-icon {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.floating-btn {
		z-index: 999;
		position: fixed;
		right: 0;
		width: 89rpx;
		height: 107rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 2rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 20rpx 0rpx 0rpx 20rpx;
		border: 1rpx solid #EEEEEE;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.btn-text {
			margin-top: 8rpx;
			font-size: 22rpx;
			color: #202120;
			line-height: 20rpx;
		}
	}

	.scroll-view {
		flex: 1;
		height: 720rpx;
		box-sizing: border-box;
		padding: 32rpx 24rpx 0;

		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.goods-item {
			height: 510rpx;
			width: 343rpx;
			background: #ffffff;
			margin-bottom: 16rpx;

			.goods-image {
				width: 100%;
				height: 335rpx;
			}

			.goods-title {
				width: 295rpx;
				margin: auto;
				margin-top: 16rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.goods-info {
				margin-top: 4rpx;
				padding: 0 24rpx;
				display: flex;
				justify-content: space-between;

				.goods-weight {
					font-weight: 400;
					font-size: 24rpx;
					color: #999999;
					line-height: 36rpx;

					text {
						font-weight: 500;
						font-size: 24rpx;
						color: #101010;
					}
				}
			}

			.goods-handle {
				display: flex;
				height: 44rpx;
				margin-top: 20rpx;
				justify-content: space-between;
				padding: 0 24rpx;

				.goods-price {
					display: flex;
					font-weight: 500;
					font-size: 24rpx;
					color: #EB5C20;
					align-items: center;

					text {
						font-weight: bold;
						font-size: 36rpx;
					}

					.normal-price {
						margin-left: 8rpx;
						font-weight: 400;
						font-size: 24rpx;
						color: #999999;
						text-decoration-line: line-through;
					}
				}

				.buy-btn {
					width: 128rpx;
					height: 44rpx;
					background: #FF6F0E;
					border-radius: 130rpx 130rpx 130rpx 130rpx;
					line-height: 44rpx;
					font-weight: 500;
					font-size: 24rpx;
					color: #FFFFFF;
				}
			}
		}
	}
}
</style>
