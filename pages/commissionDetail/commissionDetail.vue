<template>
	<view class="container">
		<image src="/static/images/背景.png" mode="" class="bg-image"></image>
		<TransNavVue title="蜂场数据"></TransNavVue>
		<view class="data-panel">
			<image class="panel-bg" src="/static/images/data-bg.png" mode=""></image>
			<view class="data-content">
				<view class="data-item" v-for="(value, key) in dataList"  :key="key">
					<view class="title" v-if="key!= 'nectarSourceArea'">
						<text class="title-text">{{ dataMap[key].text }} </text>
						<image :src="dataMap[key].icon" mode="aspectFill" class="data-icon"></image>
					</view>
					<view class="data-value" v-if="key!= 'nectarSourceArea'">
						<text class="value">{{ value }}</text>
						{{ dataMap[key].unit }}
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TransNavVue from '../../components/TransNav.vue';
import { request } from '@/utils/request'


const mapMarkers = ref([
	{
		id: 1,
		latitude: 30.6667,
		longitude: 104.0667,
		iconPath: '/static/images/marker.png',
		width: 34,
		height: 38,
		label: {
			content: '1',
			color: '#ffffff',
			anchorY: -36,
			anchorX: -12
		}
	}
]);
const dataMap = ref({
	countryNumber: {
		text: '国家',
		icon: '/static/images/国家.png',
		unit: '/个'
	},
	adoptionAmount: {
		text: '领养量',
		icon: '/static/images/领养量.png',
		unit: '/万箱'
	},
	outputAmount: {
		text: '产量',
		icon: '/static/images/产量.png',
		unit: '/万斤'
	},
	beeNumber: {
		text: '数量',
		icon: '/static/images/蜜蜂.png',
		unit: '/万只'
	},
	attendanceRate: {
		text: '出勤',
		icon: '/static/images/蜜蜂.png',
		unit: '%'
	},
	userAmount: {
		text: '用户量',
		icon: '/static/images/用户量.png',
		unit: '/万人'
	}
});
const dataList = ref({
	countryNumber: 192,
	adoptionAmount: 1.89,
	outputAmount: 236.8,
	beeNumber: 265.1,
	attendanceRate: 86.6,
	userAmount: 232.3
});

//获取蜂场更多数据
const getInfoData = async () => {
  try {
    const res = await request({
      url: '/app-api/WeiXinMini/index/get/info',
      showLoading: true, 
    })
    
    // 处理返回数据（兼容code=0和code=200）
    if (res.code === 0 || res.code === 200) {
    dataList.value=res.data
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取蜂场数据失败:', err)
   
  }
}
onMounted(() => {
  getInfoData()
})
</script>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	height: 100vh;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;

	.bg-image {
		width: 100%;
		height: 548rpx;
		position: absolute;
		z-index: -1;
	}
	.data-panel {
		margin: 0 auto;
		margin-top: 18rpx;
		width: 702rpx;
		height: 350rpx;
		position: relative;
		z-index: 1;
		.panel-bg {
			height: 100%;
			width: 100%;
			position: absolute;
			z-index: -1;
		}
		.data-content {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			.data-item {
				padding: 30rpx;
				border-bottom: 2rpx solid #f6f6f6;
				border-right: 2rpx solid #f6f6f6;
				height: 175rpx;
				&:nth-child(3n) {
					border-right: 0;
				}
				&:nth-child(n + 4) {
					border-bottom: 0;
				}
				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.title-text {
						font-weight: 500;
						font-size: 32rpx;
						color: #666666;
					}
					.data-icon {
						width: 58rpx;
						height: 58rpx;
					}
				}
				.data-value {
					margin-top: 16rpx;
					font-weight: 500;
					font-size: 20rpx;
					color: #999999;
					.value {
						font-weight: bold;
						font-size: 36rpx;
						color: #010022;
					}
				}
			}
		}
	}
	.bee-bar {
		margin: 6rpx 0;
		height: 158rpx;
		width: 750rpx;
		display: flex;
		position: relative;
		z-index: 1;

		.bar-bg {
			position: absolute;
			height: 158rpx;
			width: 750rpx;
			z-index: -1;
		}
		.bar-content {
			width: 100%;
			padding: 40rpx 48rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.bar-left {
				display: flex;

				.bee-image {
					width: 76rpx;
					height: 76rpx;
				}
				.bar-title {
					background: linear-gradient(181deg, #fff6d1 0%, #ffffff 100%);
					-webkit-background-clip: text;
					color: transparent;
					margin-left: 24rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 29rpx;
					.title-bt {
						width: 140rpx;
						height: 26rpx;
						background: linear-gradient(275deg, #fff6d1 0%, #ffffff 100%);
						border-radius: 23rpx;
						display: flex;
						align-items: center;
						padding: 0 10rpx;

						.icon {
							width: 18rpx;
							height: 18rpx;
						}
						.text {
						
							margin-left: 4rpx;
							font-weight: 500;
							font-size: 16rpx;
							background: linear-gradient(356deg, #49433c 0%, #756c61 100%);
							-webkit-background-clip: text;
						}
					}
				}
			}
			.bar-right {
				margin-bottom: 6rpx;
				font-weight: bold;
				font-size: 32rpx;
				color: #fffefc;
				line-height: 48rpx;
				.unit {
					font-weight: 500;
					font-size: 24rpx;
					color: #99927f;
					line-height: 48rpx;
				}
			}
		}
	}
	.map-content {
		flex: 1;
		height: 200rpx;
		.map-view {
			height: 100%;
			width: 100%;
		}
	}
}
</style>
