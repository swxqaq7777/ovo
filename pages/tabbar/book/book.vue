<template>
  <view class="container" style="padding: 20rpx; background: #F9FAFB;">
    <view v-for="book in books" :key="book.id" class="book-card" @click="goToDetail(book.id)">
      <img :src="book.cover" mode="aspectFill" class="book-cover" />
      <view class="book-info">
        <text class="book-title">{{ book.title }}</text>
        <text class="book-author">作者：{{ book.author }}</text>
        <text class="book-desc" number-of-lines="3">{{ book.description }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      books: [
        {
          id: 1,
          title: "百年孤独",
          author: "加西亚·马尔克斯",
          description: "魔幻现实主义的经典作品，讲述布恩迪亚家族七代人的传奇故事，融合现实与幻想。",
          cover: "../../../static/bainiangudu.jpg"
        },
        {
          id: 2,
          title: "三体",
          author: "刘慈欣",
          description: "中国科幻文学的里程碑，宏大的宇宙观和深刻的哲学思考，探讨文明存亡与科技发展。",
          cover: "../../../static/santi.jpg"
        },
        {
          id: 3,
          title: "哈利·波特与魔法石",
          author: "J.K.罗琳",
          description: "魔法世界的奇幻冒险，少年巫师哈利·波特在霍格沃茨的成长与挑战。",
          cover: "../../../static/hali.jpg"
        },
        {
          id: 4,
          title: "追风筝的人",
          author: "卡勒德·胡赛尼",
          description: "感人至深的友情与救赎故事，描绘阿富汗动荡年代的人性光辉。",
          cover: "../../../static/zhuifengzhengderen.png"
        },
        {
          id: 5,
          title: "挪威的森林",
          author: "村上春树",
          description: "青春与孤独的诗意表达，探索生命的意义与情感的复杂。",
          cover: "../../../static/nuowei.png"
        }
      ]
    };
  },
  methods: {
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/tabbar/book/bookDetail?id=${id}`
      });
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #F9FAFB;
}

.book-card {
  flex-direction: row;
  display: flex;
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 15rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  align-items: center;
}

.book-cover {
  width: 120rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  object-fit: cover;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #222;
  margin-bottom: 8rpx;
}

.book-author {
  font-size: 22rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.book-desc {
  font-size: 20rpx;
  color: #555;
  line-height: 1.4;
}
</style>
