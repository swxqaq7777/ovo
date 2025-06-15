<template>
  <view class="container" style="padding: 20rpx; background: #F9FAFB;">
    <view v-for="item in contentList" :key="item.id" style="margin-bottom: 20rpx;">
      <uni-card @click="onClick(item.id)" :hover-class="'card-hover'">
        <text class="card-title">{{ item.title }}</text>
        <text class="card-text" :class="{ 'line-clamp': true }">{{ item.summary }}</text>
        <view slot="actions" class="card-actions">
          <view class="card-actions-item">
            <uni-icons type="book" size="20" color="#999"></uni-icons>
            <text class="card-actions-item-text">{{ item.category }}</text>
          </view>
          <view class="card-actions-item">
            <uni-icons type="eye" size="20" color="#999"></uni-icons>
            <text class="card-actions-item-text">{{ item.views }}</text>
          </view>
          <view class="card-actions-item">
            <uni-icons type="heart" size="20" color="#999"></uni-icons>
            <text class="card-actions-item-text">{{ item.likes }}</text>
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
      contentList: []
    };
  },
  onReady() {
    this.loadContent();
  },
  methods: {
    loadContent() {
      const articles = [
        {
          id: 1,
          title: "《百年孤独》的魔幻现实主义解读",
          category: "文学",
          summary: "作为拉丁美洲文学的杰出代表，《百年孤独》以其独特的魔幻现实主义手法，深刻地反映了拉丁美洲的历史与现实，成为了世界文学史上的经典之作。",
          views: 2300,
          likes: 520
        },
        {
          id: 2,
          title: "《三体》的科幻思维与人文关怀",
          category: "科幻",
          summary: "刘慈欣的《三体》三部曲是中国科幻文学的里程碑作品，它不仅展现了宏大的宇宙观，更深入探讨了人类文明的未来走向。",
          views: 3100,
          likes: 780
        },
        {
          id: 3,
          title: "《哈利·波特》系列的魔法世界构建",
          category: "奇幻",
          summary: "J.K.罗琳的哈利·波特系列作品创造了一个完整而复杂的魔法世界，这个世界有着自己的历史、文化、政治和社会结构。",
          views: 2700,
          likes: 610
        },
        {
          id: 4,
          title: "《追风筝的人》的救赎主题解析",
          category: "文学",
          summary: "《追风筝的人》通过阿米尔的成长历程，深刻地探讨了背叛、愧疚与救赎这一永恒的人性主题。",
          views: 2500,
          likes: 600
        },
        {
          id: 5,
          title: "《挪威的森林》的青春迷茫与成长",
          category: "文学",
          summary: "村上春树的《挪威的森林》描绘了一代人在青春期的迷茫与成长，展现了青春的美好与残酷。",
          views: 2200,
          likes: 540
        },
        // 新增文章
        {
          id: 6,
          title: "现代诗歌的意境美学",
          category: "诗歌",
          summary: "现代诗歌作为文学艺术的重要形式，其意境美学的构建是诗人表达情感、传递思想的重要手段。探讨诗歌中意境营造的层次性和艺术价值。",
          views: 1800,
          likes: 420
        },
        {
          id: 7,
          title: "散文写作技巧分享",
          category: "写作",
          summary: "散文作为一种自由灵活的文学体裁，其写作技巧的掌握对于提升文学表达能力具有重要意义。从选材、结构到语言运用的全面指导。",
          views: 2100,
          likes: 480
        },
        {
          id: 8,
          title: "古典文学的现代价值",
          category: "文学",
          summary: "古典文学作为中华文化的瑰宝，在现代社会中仍然具有重要的价值和意义。探讨传统文学在当代的传承与创新。",
          views: 1950,
          likes: 450
        },
        {
          id: 9,
          title: "读书笔记整理方法",
          category: "学习",
          summary: "良好的读书笔记整理方法能够帮助我们更好地吸收知识，提升阅读效果。介绍康奈尔笔记法、思维导图等多种实用方法。",
          views: 2400,
          likes: 560
        },
        {
          id: 10,
          title: "文学创作的灵感来源",
          category: "创作",
          summary: "文学创作中的灵感往往是作品成功的关键因素，了解灵感的来源和培养方法对创作者具有重要意义。从生活观察到文化体验的全面探讨。",
          views: 1750,
          likes: 380
        },
        {
          id: 11,
          title: "书评写作心得",
          category: "写作",
          summary: "书评作为文学批评的重要形式，既要体现对作品的深度理解，又要具备独立的思考和判断。分享书评写作的技巧和方法。",
          views: 1650,
          likes: 350
        }
      ];

      this.contentList = articles;
    },
    onClick(id) {
      uni.setStorage({
        key: 'content_id',
        data: id,
        success: () => {
          uni.navigateTo({
            url: '/pages/content/index'
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  background: #F9FAFB;
}

.card-title {
  font-weight: 700;
  font-size: 26rpx;
  color: #222222;
}

.card-text {
  margin-top: 12rpx;
  font-size: 18rpx;
  color: #555555;
  line-height: 1.6;
  white-space: normal;
}

/* 限制文本显示行数，超出部分显示省略号 */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 50rpx;
  border-top: 1rpx solid #e0e0e0;
  padding-top: 12rpx;
}

.card-actions-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 30rpx;
}

.card-actions-item-text {
  font-size: 16rpx;
  color: #999999;
  margin-left: 8rpx;
}

.card-hover {
  background-color: #e6f0ff !important;
}
</style>
