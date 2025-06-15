<template>
  <view class="container">
    <!-- 未登录状态显示 -->
    <view class="not-login" v-if="!isLogin">
      <text class="login-tip">请先登录查看个人信息</text>
      <button class="login-btn" @click="goToLogin">立即登录</button>
    </view>

    <!-- 已登录状态显示 -->
    <view v-else>
      <!-- 个人信息头部 -->
      <view class="profile-header">
        <view class="avatar-section">
          <image :src="userInfo.avatar" mode="aspectFill" class="avatar" @click="changeAvatar" />
          <view class="camera-icon" @click="changeAvatar">📷</view>
        </view>
        <view class="info-section">
          <text class="username">{{ userInfo.username }}</text>
          <text class="bio">{{ userInfo.bio || '这个人很懒，什么都没留下' }}</text>
          <view class="edit-btn" @click="editProfile">
            <text>编辑资料</text>
          </view>
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
          <view class="tab-header" :class="{ active: currentTab === 0 }" @click="switchTab(0)">
            <text>我的帖子</text>
          </view>
          <view class="tab-header" :class="{ active: currentTab === 1 }" @click="switchTab(1)">
            <text>我的评论</text>
          </view>
        </view>

        <!-- 滑动内容区域 -->
        <swiper class="content-swiper" :current="currentTab" @change="onSwiperChange" duration="300">
          <!-- 我的帖子 -->
          <swiper-item>
            <scroll-view scroll-y class="scroll-content">
              <view class="post-list">
                <view class="post-item" v-for="post in userPosts" :key="post.id" @click="viewPost(post.id)">
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

          <!-- 我的评论 -->
          <swiper-item>
            <scroll-view scroll-y class="scroll-content">
              <view class="comment-list">
                <view class="comment-item" v-for="comment in userComments" :key="comment.id"
                  @click="viewCommentPost(comment.postId)">
                  <view class="comment-header">
                    <text class="comment-post-title">{{ comment.postTitle }}</text>
                    <text class="comment-date">{{ comment.date }}</text>
                  </view>
                  <text class="comment-content">{{ comment.content }}</text>
                  <view class="comment-images" v-if="comment.images && comment.images.length > 0">
                    <image v-for="(img, index) in comment.images" :key="index" :src="img" mode="aspectFill"
                      class="comment-image" @click.stop="previewImage(img, comment.images)" />
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

      <!-- 退出登录按钮 -->
      <view class="logout-btn" @click="logout">
        <text>退出登录</text>
      </view>

      <!-- 编辑资料弹窗 -->
      <uni-popup ref="editPopup" type="center">
        <view class="edit-popup">
          <view class="popup-header">
            <text class="popup-title">编辑资料</text>
          </view>
          <view class="popup-content">
            <view class="form-item">
              <text class="form-label">用户名</text>
              <input class="form-input" v-model="editForm.username" placeholder="请输入用户名" maxlength="20" />
            </view>
            <view class="form-item">
              <text class="form-label">个人介绍</text>
              <textarea class="form-textarea" v-model="editForm.bio" placeholder="介绍一下自己吧..." maxlength="100" />
            </view>
          </view>
          <view class="popup-actions">
            <button class="btn-cancel" @click="cancelEdit">取消</button>
            <button class="btn-save" @click="saveProfile">保存</button>
          </view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false, // 登录状态
      currentTab: 0,
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
      editForm: {
        username: '',
        bio: ''
      },
      userPosts: [],
      userComments: []
    };
  },
  onLoad() {
    this.checkLoginStatus();
  },
  onShow() {
    // 从登录页面返回时重新检查登录状态
    this.checkLoginStatus();
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = uni.getStorageSync('user_info');
      if (userInfo) {
        this.isLogin = true;
        this.userInfo = {
          ...this.userInfo,
          ...userInfo
        };
        this.loadUserData();
      } else {
        this.isLogin = false;
      }
    },

    // 加载用户数据
    loadUserData() {
      // 模拟从服务器获取数据
      uni.showLoading({ title: '加载中...' });
      setTimeout(() => {
        this.userStats = {
          posts: 12,
          comments: 48,
          likes: 156
        };
        this.userPosts = [
          {
            id: 1,
            title: '《百年孤独》的魔幻现实主义解读',
            summary: '作为拉丁美洲文学的杰出代表，《百年孤独》以其独特的魔幻现实主义手法...',
            date: '2024-01-15',
            views: 2300,
            likes: 45,
            comments: 12
          },
          {
            id: 2,
            title: '《三体》的科幻思维与人文关怀',
            summary: '刘慈欣的《三体》三部曲是中国科幻文学的里程碑作品，它不仅展现了宏大的宇宙观...',
            date: '2024-01-12',
            views: 3100,
            likes: 67,
            comments: 23
          }
        ];
        this.userComments = [
          {
            id: 1,
            postId: 6,
            postTitle: '现代诗歌的意境美学',
            content: '这篇文章对现代诗歌的解读很深刻，特别是对意境营造的分析，让我对诗歌有了新的理解。',
            date: '2024-01-16 14:30',
            likes: 8,
            images: []
          },
          {
            id: 2,
            postId: 7,
            postTitle: '散文写作技巧分享',
            content: '作者分享的写作技巧很实用，我试着按照这些方法练习，确实有所提升。',
            date: '2024-01-15 20:15',
            likes: 12,
            images: []
          }
        ];
        uni.hideLoading();
      }, 800);
    },


    // 退出登录
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('user_info');
            this.isLogin = false;
            this.resetUserData();
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            });
			uni.redirectTo({
			  url: '/pages/user/login'
			});
          }
        }
      });
    },

    // 重置用户数据
    resetUserData() {
      this.userInfo = {
        avatar: '../../static/default-avatar.png',
        username: '',
        bio: ''
      };
      this.userStats = {
        posts: 0,
        comments: 0,
        likes: 0
      };
      this.userPosts = [];
      this.userComments = [];
    },

    // 切换标签页
    switchTab(index) {
      this.currentTab = index;
    },

    // 滑动切换回调
    onSwiperChange(e) {
      this.currentTab = e.detail.current;
    },

    // 更换头像
    changeAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.userInfo.avatar = res.tempFilePaths[0];
          // 更新本地存储的用户信息
          const userInfo = uni.getStorageSync('user_info');
          uni.setStorageSync('user_info', {
            ...userInfo,
            avatar: res.tempFilePaths[0]
          });
          uni.showToast({
            title: '头像更新成功',
            icon: 'success'
          });
        }
      });
    },

    // 编辑资料
    editProfile() {
      this.editForm.username = this.userInfo.username;
      this.editForm.bio = this.userInfo.bio;
      this.$refs.editPopup.open();
    },

    // 取消编辑
    cancelEdit() {
      this.$refs.editPopup.close();
    },

    // 保存资料
    saveProfile() {
      if (!this.editForm.username.trim()) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none'
        });
        return;
      }

      this.userInfo.username = this.editForm.username;
      this.userInfo.bio = this.editForm.bio;

      // 更新本地存储的用户信息
      const userInfo = uni.getStorageSync('user_info');
      uni.setStorageSync('user_info', {
        ...userInfo,
        username: this.editForm.username,
        bio: this.editForm.bio
      });

      this.$refs.editPopup.close();
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });
    },

    viewPost(postId) {
      uni.setStorage({
        key: 'content_id',
        data: postId,
        success: () => {
          uni.navigateTo({
            url: '/pages/content/index'
          });
        }
      });
    },

    viewCommentPost(postId) {
      uni.setStorage({
        key: 'content_id',
        data: postId,
        success: () => {
          uni.navigateTo({
            url: '/pages/content/index'
          });
        }
      });
    },

    // 预览图片
    previewImage(current, urls) {
      uni.previewImage({
        current,
        urls
      });
    }
  }
};
</script>
<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 个人信息头部 */
.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx 30rpx;
  display: flex;
  align-items: center;
  color: white;
}

.avatar-section {
  position: relative;
  margin-right: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.camera-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
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
  margin-bottom: 20rpx;
  display: block;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.2);
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  display: inline-block;
}

.edit-btn text {
  font-size: 22rpx;
}

/* 统计数据 */
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

/* 滑动切换区域 */
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

/* 帖子列表样式 */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.post-item {
  background: white;
  padding: 25rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15rpx;
}

.post-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 20rpx;
}

.post-date {
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

.logout-btn {
  margin: 40rpx;
  padding: 20rpx;
  background: #ff4d4f;
  color: white;
  text-align: center;
  border-radius: 8rpx;
}

.post-stats {
  display: flex;
  gap: 30rpx;
}

.post-stat {
  font-size: 20rpx;
  color: #999;
}

/* 评论列表样式 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.comment-item {
  background: white;
  padding: 25rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15rpx;
}

.comment-post-title {
  font-size: 24rpx;
  color: #007aff;
  flex: 1;
  margin-right: 20rpx;
}

.comment-date {
  font-size: 20rpx;
  color: #999;
  flex-shrink: 0;
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

/* 编辑弹窗样式 */
.edit-popup {
  width: 600rpx;
  background: white;
  border-radius: 12rpx;
  overflow: hidden;
}

.popup-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  text-align: center;
}

.popup-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.popup-content {
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 15rpx;
  display: block;
}

.form-input {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 24rpx;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 24rpx;
  box-sizing: border-box;
  resize: none;
}

.popup-actions {
  display: flex;
  border-top: 1rpx solid #eee;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 30rpx;
  text-align: center;
  font-size: 26rpx;
  border: none;
  background: none;
}

.btn-cancel {
  color: #666;
  border-right: 1rpx solid #eee;
}

.btn-save {
  color: #007aff;
  font-weight: 600;
}
</style>
