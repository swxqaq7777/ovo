<template>
  <view class="container" style="padding: 20rpx; background: #F9FAFB;">
    <view v-for="item in sportsList" :key="item.id" style="margin-bottom: 30rpx;">
      <uni-card @click="onClick(item.id)" :hover-class="'card-hover'">
        <img :src="item.image" mode="aspectFill" class="card-image" />
        <view class="card-content">
          <text class="card-title">{{ item.title }}</text>
          <text class="card-text line-clamp">{{ item.summary }}</text>
          <view class="card-meta">
            <view class="card-meta-item">
              <uni-icons type="sports" size="20" color="#999"></uni-icons>
              <text class="card-meta-text">{{ item.category }}</text>
            </view>
            <view class="card-meta-item">
              <uni-icons type="eye" size="20" color="#999"></uni-icons>
              <text class="card-meta-text">{{ item.views }}</text>
            </view>
            <view class="card-meta-item">
              <uni-icons type="heart" size="20" color="#999"></uni-icons>
              <text class="card-meta-text">{{ item.likes }}</text>
            </view>
          </view>
        </view>
      </uni-card>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      sportsList: []
    };
  },
  onReady() {
    this.loadSports();
  },
  methods: {
    loadSports() {
      this.sportsList = [
        {
          id: 1,
          title: "2024年奥运会精彩回顾",
          category: "奥运",
          summary: "2024年奥运会汇聚了全球顶尖运动员，精彩赛事不断，展现了体育的魅力与精神。",
          views: 1500,
          likes: 320,
          image: "../../../static/2024aoyun.webp"
        },
        {
          id: 2,
          title: "足球世界杯最新战报",
          category: "足球",
          summary: "最新足球世界杯比赛战报，精彩进球与激烈对抗，带你回顾赛场上的每一个瞬间。",
          views: 2100,
          likes: 450,
          image: "../../../static/zuqiushijiebei.webp"
        },
        {
          id: 3,
          title: "篮球联赛季后赛分析",
          category: "篮球",
          summary: "深入分析本赛季篮球联赛季后赛形势，球队表现与关键球员点评，助你掌握赛季动态。",
          views: 1800,
          likes: 390,
          image: "../../../static/lanqiuliansai.webp"
        },
        {
          id: 4,
          title: "马拉松训练技巧分享",
          category: "跑步",
          summary: "专业马拉松训练技巧分享，帮助跑者科学备赛，提高耐力与速度，安全完成比赛。",
          views: 1200,
          likes: 280,
          image: "../../../static/malasong.webp"
        },
        {
          id: 5,
          title: "网球大师赛精彩瞬间",
          category: "网球",
          summary: "回顾网球大师赛上的精彩瞬间，顶级选手的技术与心理较量，感受网球运动的魅力。",
          views: 1600,
          likes: 350,
          image: "../../../static/wangqiu.webp"
        }
      ];
    },
    onClick(id) {
      uni.navigateTo({
        url: `/pages/tabbar/sport/sportDetail?id=${id}`
      });
    }
  }
};
</script>

<style scoped>
.container {
  background: #F9FAFB;
}

.uni-card {
  padding: 0 !important;
  overflow: hidden;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: 180rpx;
  object-fit: cover;
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;
}

.card-content {
  padding: 20rpx;
}

.card-title {
  font-weight: 700;
  font-size: 28rpx;
  color: #222222;
  margin-bottom: 12rpx;
}

.card-text {
  font-size: 18rpx;
  color: #555555;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  justify-content: flex-start;
  gap: 30rpx;
}

.card-meta-item {
  display: flex;
  align-items: center;
  color: #999999;
  font-size: 16rpx;
}

.card-meta-text {
  margin-left: 8rpx;
}

.card-hover {
  background-color: #e6f0ff !important;
}
</style>
