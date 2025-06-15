<template>
  <view class="container" v-if="loading">
    <!-- 其他用户信息头部 -->
    <view class="profile-header">
      <view class="avatar-section">
        <image :src="userInfo.avatar" mode="aspectFill" class="avatar" />
      </view>
      <view class="info-section">
        <text class="username">{{ userInfo.username }}</text>
        <text class="bio">{{ userInfo.bio }}</text>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-number">{{ userStats.posts }}</text>
        <text class="stat-label">发帖</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ userStats.comments }}</text>
        <text class="stat-label">评论</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ userStats.likes }}</text>
        <text class="stat-label">获赞</text>
      </view>
    </view>

    <!-- 滑动切换区域 -->
    <view class="tabs-section">
      <view class="tab-headers">
        <view 
          class="tab-header" 
          :class="{ active: currentTab === 0 }"
          @click="switchTab(0)"
        >
          <text>他的帖子</text>
        </view>
        <view 
          class="tab-header" 
          :class="{ active: currentTab === 1 }"
          @click="switchTab(1)"
        >
          <text>他的评论</text>
        </view>
      </view>

      <!-- 滑动内容区域 -->
      <swiper 
        class="content-swiper" 
        :current="currentTab" 
        @change="onSwiperChange"
        duration="300"
      >
        <!-- 他的帖子 -->
        <swiper-item>
          <scroll-view scroll-y class="scroll-content">
            <view class="post-list">
              <view 
                class="post-item" 
                v-for="post in userPosts" 
                :key="post.id"
                @click="viewPost(post.id)"
              >
                <view class="post-header">
                  <text class="post-title">{{ post.title }}</text>
                  <text class="post-date">{{ post.date }}</text>
                </view>
                <text class="post-summary">{{ post.summary }}</text>
                <view class="post-stats">
                  <view class="post-stat">
                    <text>👁 {{ post.views }}</text>
                  </view>
                  <view class="post-stat">
                    <text>👍 {{ post.likes }}</text>
                  </view>
                  <view class="post-stat">
                    <text>💬 {{ post.comments }}</text>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </swiper-item>

        <!-- 他的评论 -->
        <swiper-item>
          <scroll-view scroll-y class="scroll-content">
            <view class="comment-list">
              <view 
                class="comment-item" 
                v-for="comment in userComments" 
                :key="comment.id"
                @click="viewCommentPost(comment.postId)"
              >
                <view class="comment-header">
                  <text class="comment-post-title">{{ comment.postTitle }}</text>
                  <text class="comment-date">{{ comment.date }}</text>
                </view>
                <text class="comment-content">{{ comment.content }}</text>
                <view class="comment-images" v-if="comment.images && comment.images.length > 0">
                  <image 
                    v-for="(img, index) in comment.images" 
                    :key="index"
                    :src="img" 
                    mode="aspectFill" 
                    class="comment-image"
                    @click.stop="previewImage(img, comment.images)"
                  />
                </view>
                <view class="comment-stats">
                  <text>👍 {{ comment.likes }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>

  <view v-else class="loading-container">
    <view class="loader"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      loading: false,
      userInfo: {
        avatar: '../../static/default-avatar.png',
        username: '',
        bio: ''
      },
      userStats: {
        posts: 0,
        comments: 0,
        likes: 0
      },
      userPosts: [],
      userComments: []
    };
  },
  methods: {
    switchTab(index) {
      this.currentTab = index;
    },
    onSwiperChange(e) {
      this.currentTab = e.detail.current;
    },
    viewPost(postId) {
      uni.setStorage({
        key: 'content_id',
        data: postId
      });
      uni.navigateTo({
        url: '/pages/content/index'
      });
    },
    viewCommentPost(postId) {
      uni.setStorage({
        key: 'content_id',
        data: postId
      });
      uni.navigateTo({
        url: '/pages/content/index'
      });
    },
    previewImage(current, urls) {
      uni.previewImage({
        current,
        urls
      });
    },
    loadUserData() {
      uni.getStorage({
        key: 'user_info_username',
        success: (res) => {
          const username = (res.data || '').trim();
          if (!username) {
            uni.showToast({ title: '未获取到用户信息', icon: 'none' });
            setTimeout(() => uni.navigateBack(), 1500);
            return;
          }

          // 所有用户信息
          const users = {
            '文学爱好者': {
              avatar: '../../static/avatar1.jpg',
              bio: '热爱阅读与写作，分享生活中的美好瞬间。愿文字成为心灵的桥梁，连接你我他。'
            },
            '读书小达人': {
              avatar: '../../static/avatar2.jpg',
              bio: '书海泛舟，乐在其中。'
            },
            '作者本人': {
              avatar: '../../static/avatar3.jpg',
              bio: '博客作者，热爱写作和分享。'
            },
            '摄影师小李': {
              avatar: '../../static/avatar4.jpg',
              bio: '摄影爱好者，记录美好瞬间。'
            },
            '思考者': {
              avatar: '../../static/avatar5.jpg',
              bio: '喜欢思考人生，分享感悟。'
            },
            '哲学系学生': {
              avatar: '../../static/avatar6.jpg',
              bio: '哲学爱好者，探索真理。'
            },
            '文字工作者': {
              avatar: '../../static/avatar7.jpg',
              bio: '专业文字工作者，热爱写作。'
            },
            '我': {
              avatar: '../../static/default-avatar.png',
              bio: '这是你自己哦~'
            }
          };

          this.userInfo.username = username;
          this.userInfo.avatar = (users[username] && users[username].avatar) || '../../static/default-avatar.png';
          this.userInfo.bio = (users[username] && users[username].bio) || '';

          // 所有帖子数据
          const allPosts = [
            { id: 1, title: '《百年孤独》的魔幻现实主义解读', summary: '作为拉丁美洲文学的杰出代表...', date: '2024-01-15', views: 2300, likes: 45, comments: 12, author: '文学爱好者' },
            { id: 2, title: '《三体》的科幻思维与人文关怀', summary: '刘慈欣的《三体》三部曲是中国科幻文学的里程碑作品...', date: '2024-01-12', views: 3100, likes: 67, comments: 23, author: '作者本人' },
            { id: 3, title: '《哈利·波特》系列的魔法世界构建', summary: '魔法世界的奇幻冒险...', date: '2024-01-10', views: 2700, likes: 38, comments: 15, author: '文学爱好者' },
            { id: 4, title: '摄影技巧分享', summary: '分享一些实用的摄影技巧...', date: '2024-01-08', views: 1500, likes: 20, comments: 8, author: '摄影师小李' },
            { id: 5, title: '读书笔记整理方法', summary: '如何高效整理读书笔记...', date: '2024-01-05', views: 2400, likes: 30, comments: 10, author: '读书小达人' },
            { id: 6, title: '文学创作的灵感来源', summary: '探讨文学创作背后的灵感...', date: '2024-01-03', views: 1750, likes: 25, comments: 7, author: '我' },
            { id: 7, title: '现代诗歌的意境美学', summary: '现代诗歌中的意境探讨...', date: '2024-01-02', views: 1600, likes: 18, comments: 5, author: '思考者' },
            { id: 8, title: '散文写作技巧分享', summary: '提升散文写作水平的技巧...', date: '2024-01-01', views: 1400, likes: 22, comments: 9, author: '文字工作者' },
          ];

          // 所有评论数据
          const allComments = [
            { id: 1, postId: 1, postTitle: '《百年孤独》的魔幻现实主义解读', content: '这篇文章对魔幻现实主义的分析非常透彻！', date: '2024-01-16 14:30', likes: 8, username: '文学爱好者', images: [] },
            { id: 2, postId: 4, postTitle: '摄影技巧分享', content: '很实用的摄影技巧，感谢分享！', date: '2024-01-15 20:15', likes: 12, username: '摄影师小李', images: ['../../static/note1.jpg'] },
            { id: 3, postId: 2, postTitle: '《三体》的科幻思维与人文关怀', content: '三体确实是科幻文学的巅峰之作。', date: '2024-01-14 18:00', likes: 15, username: '作者本人', images: [] },
            { id: 4, postId: 5, postTitle: '读书笔记整理方法', content: '学到了很多整理笔记的方法。', date: '2024-01-13 10:20', likes: 10, username: '读书小达人', images: [] },
            { id: 5, postId: 7, postTitle: '现代诗歌的意境美学', content: '诗歌的意境真的很美。', date: '2024-01-12 09:45', likes: 7, username: '思考者', images: [] },
            { id: 6, postId: 8, postTitle: '散文写作技巧分享', content: '写作技巧很实用，受益匪浅。', date: '2024-01-11 16:30', likes: 9, username: '文字工作者', images: [] },
            { id: 7, postId: 6, postTitle: '文学创作的灵感来源', content: '灵感来源分享得很棒！', date: '2024-01-10 14:00', likes: 11, username: '我', images: [] },
          ];

          // 过滤该用户的帖子和评论
          this.userPosts = allPosts.filter(post => post.author === username);
          this.userComments = allComments.filter(comment => comment.username === username);

          // 统计数据
          this.userStats.posts = this.userPosts.length;
          this.userStats.comments = this.userComments.length;
          this.userStats.likes = this.userPosts.reduce((sum, p) => sum + (p.likes || 0), 0) + this.userComments.reduce((sum, c) => sum + (c.likes || 0), 0);

          this.loading = true;
        },
        fail: () => {
          uni.showToast({ title: '未获取到用户信息', icon: 'none' });
          setTimeout(() => uni.navigateBack(), 1500);
        }
      });
    }
  },
  mounted() {
    this.loadUserData();
  }
};
</script>

<style scoped>
/* 样式同之前保持一致 */
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx 30rpx;
  display: flex;
  align-items: center;
  color: white;
}

.avatar-section {
  margin-right: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.info-section {
  flex: 1;
}

.username {
  font-size: 32rpx;
  font-weight: 700;
  margin-bottom: 10rpx;
  display: block;
}

.bio {
  font-size: 24rpx;
  opacity: 0.9;
  line-height: 1.4;
  display: block;
}

.stats-section {
  background: white;
  display: flex;
  padding: 30rpx 0;
  margin-bottom: 20rpx;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-number {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #666;
}

.tabs-section {
  background: white;
  flex: 1;
}

.tab-headers {
  display: flex;
  border-bottom: 1rpx solid #eee;
}

.tab-header {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.tab-header text {
  font-size: 28rpx;
  color: #666;
}

.tab-header.active text {
  color: #007aff;
  font-weight: 600;
}

.tab-header.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background: #007aff;
  border-radius: 2rpx;
}

.content-swiper {
  height: calc(100vh - 400rpx);
}

.scroll-content {
  height: 100%;
  padding: 20rpx;
}

.post-list, .comment-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.post-item, .comment-item {
  background: white;
  padding: 25rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.post-header, .comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15rpx;
}

.post-title, .comment-post-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 20rpx;
}

.post-date, .comment-date {
  font-size: 20rpx;
  color: #999;
  flex-shrink: 0;
}

.post-summary {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-stats {
  display: flex;
  gap: 30rpx;
}

.post-stat {
  font-size: 20rpx;
  color: #999;
}

.comment-content {
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
  margin-bottom: 15rpx;
}

.comment-images {
  display: flex;
  gap: 10rpx;
  margin-bottom: 15rpx;
  flex-wrap: wrap;
}

.comment-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
}

.comment-stats {
  font-size: 20rpx;
  color: #999;
}

.loading-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F1F3F4;
}

.loader {
  width: 60px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 10px solid #7280ff;
  animation:
    l20-1 0.8s infinite linear alternate,
    l20-2 1.6s infinite linear;
}

@keyframes l20-1 {
  0% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)
  }
  12.5% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%)
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%)
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)
  }
  62.5% {
    clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)
  }
  75% {
    clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%)
  }
  100% {
    clip-path: polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%)
  }
}

@keyframes l20-2 {
  0% {
    transform: scaleY(1) rotate(0deg)
  }
  49.99% {
    transform: scaleY(1) rotate(135deg)
  }
  50% {
    transform: scaleY(-1) rotate(0deg)
  }
  100% {
    transform: scaleY(-1) rotate(-135deg)
  }
}
</style>
