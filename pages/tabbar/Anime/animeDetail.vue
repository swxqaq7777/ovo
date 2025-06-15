<template>
    <view class="container">
        <scroll-view scroll-y style="height: 100vh; padding: 20rpx;">
            <img :src="anime.cover" mode="aspectFill" class="cover-image" :animation="coverAnimation" />
            <view class="info" :animation="infoAnimation">
                <text class="title">{{ anime.title }}</text>

                <view class="section">
                    <text class="section-title">类型</text>
                    <text class="section-content">{{ anime.genre.join(' / ') }}</text>
                </view>

                <view class="section">
                    <text class="section-title">简介</text>
                    <text class="section-content">{{ anime.description }}</text>
                </view>

                <view class="section extra-info">
                    <view class="info-item">
                        <text class="info-label">评分：</text><text class="info-value">{{ anime.rating }}</text>
                    </view>
                    <view class="info-item">
                        <text class="info-label">集数：</text><text class="info-value">{{ anime.episodes }}</text>
                    </view>
                    <view class="info-item">
                        <text class="info-label">状态：</text><text class="info-value">{{ anime.status }}</text>
                    </view>
                    <view class="info-item">
                        <text class="info-label">播出：</text><text class="info-value">{{ anime.airDate }}</text>
                    </view>
                </view>
            </view>

            <button class="btn-watch" @click="watchAnime" :animation="btnAnimation">立即观看</button>

            <!-- 评论区域 -->
            <view class="comment-section">
                <text class="comment-title">评论区 ({{ comments.length }})</text>

                <!-- 发表评论 -->
                <view class="comment-form">
                    <view class="form-header">
                        <image class="user-avatar" src="../../../static/default-avatar.png" mode="aspectFill" />
                        <text class="form-title">发表评论</text>
                    </view>
                    <textarea class="comment-input" v-model="newComment" placeholder="说说你的看法..." maxlength="500" />
                    <view class="form-actions">
                        <view class="image-upload" @click="chooseImage">
                            <text class="upload-text">📷 添加图片</text>
                            <text class="image-count" v-if="uploadedImages.length > 0">({{ uploadedImages.length
                            }})</text>
                        </view>
                        <button class="btn-submit" @click="submitComment">发布</button>
                    </view>
                    <!-- 已选择的图片预览 -->
                    <view class="image-preview" v-if="uploadedImages.length > 0">
                        <view class="preview-item" v-for="(img, index) in uploadedImages" :key="index">
                            <image :src="img" mode="aspectFill" class="preview-image" />
                            <text class="remove-btn" @click="removeImage(index)">×</text>
                        </view>
                    </view>
                </view>

                <!-- 评论列表 -->
                <view class="comment-list">
                    <view class="comment-item" v-for="comment in comments" :key="comment.id">
                        <image :src="comment.avatar" mode="aspectFill" class="comment-avatar"
                            @click="goToUser(comment.username)" hover-class="avatar-hover" />
                        <view class="comment-content">
                            <view class="comment-header">
                                <text class="comment-username">{{ comment.username }}</text>
                                <text class="comment-date">{{ comment.date }}</text>
                            </view>
                            <text class="comment-text">{{ comment.content }}</text>
                            <!-- 评论中的图片 -->
                            <view class="comment-images" v-if="comment.images && comment.images.length > 0">
                                <image v-for="(img, index) in comment.images" :key="index" :src="img" mode="aspectFill"
                                    class="comment-image" @click="previewImage(img, comment.images)" />
                            </view>
                            <view class="comment-actions">
                                <text class="action-btn" @click="likeComment(comment.id)">
                                    👍 {{ comment.likes || 0 }}
                                </text>
                                <text class="action-btn">💬 回复</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            anime: {
                id: null,
                title: '',
                genre: [],
                description: '',
                cover: '',
                rating: '',
                episodes: '',
                status: '',
                airDate: ''
            },
            coverAnimation: {},
            infoAnimation: {},
            btnAnimation: {},
            newComment: '',
            uploadedImages: [],
            comments: [
                {
                    id: 1,
                    username: '文学爱好者',
                    avatar: '../../../static/avatar1.jpg',
                    content: '这篇文章写得真好！作者的文笔很优美，读起来很有感觉。',
                    date: '2024-01-15 14:30',
                    likes: 12,
                    images: [],
                    replies: [
                        {
                            id: 101,
                            username: '读书小达人',
                            avatar: '../../../static/avatar2.jpg',
                            content: '同感！特别是那段关于人生感悟的描述，很有深度。',
                            date: '2024-01-15 15:20',
                            likes: 3,
                            replyTo: '文学爱好者'
                        },
                        {
                            id: 102,
                            username: '作者本人',
                            avatar: '../../../static/avatar3.jpg',
                            content: '谢谢大家的支持和鼓励！会继续努力创作的。',
                            date: '2024-01-15 16:10',
                            likes: 8,
                            replyTo: '文学爱好者'
                        }
                    ]
                },
                {
                    id: 2,
                    username: '摄影师小李',
                    avatar: '../../../static/avatar4.jpg',
                    content: '配图很棒！这些照片拍得很有意境，和文章内容很搭配。',
                    date: '2024-01-14 20:15',
                    likes: 8,
                    images: ['../../../static/comment-1.jpg'],
                    replies: []
                },
                {
                    id: 3,
                    username: '思考者',
                    avatar: '../../../static/avatar5.jpg',
                    content: '文章引发了我很多思考，特别是关于生活态度的那部分。分享一张相关的图片。',
                    date: '2024-01-13 16:45',
                    likes: 15,
                    images: ['../../../static/comment-2.png', '../../../static/comment-3.jpg'],
                    replies: [
                        {
                            id: 201,
                            username: '哲学系学生',
                            avatar: '../../../static/avatar6.jpg',
                            content: '确实很有哲理性，推荐大家都读一读。',
                            date: '2024-01-13 18:30',
                            likes: 5,
                            replyTo: '思考者'
                        }
                    ]
                },
                {
                    id: 4,
                    username: '文字工作者',
                    avatar: '../../../static/avatar7.jpg',
                    content: '作为同行，我觉得这篇文章的结构很清晰，逻辑性很强，值得学习！',
                    date: '2024-01-12 09:20',
                    likes: 6,
                    images: [],
                    replies: []
                }
            ]
        };
    },
    onLoad(options) {
        const id = options.id;
        this.fetchAnimeDetail(id);
    },
    methods: {
        fetchAnimeDetail(id) {
            const animeData = {
                1: {
                    title: "进击的巨人",
                    genre: ["动作", "剧情", "悬疑"],
                    description: "人类与巨人的生死较量，揭开世界的真相与秘密。",
                    cover: "../../../static/jvren.jpg",
                    rating: "9.0",
                    episodes: "75",
                    status: "完结",
                    airDate: "2013年4月"
                },
                2: {
                    title: "鬼灭之刃",
                    genre: ["动作", "剧情", "悬疑"],
                    description: "少年为了拯救变成鬼的妹妹，踏上斩鬼之路的故事。",
                    cover: "../../../static/guimie.jpeg",
                    rating: "8.8",
                    episodes: "44",
                    status: "连载中",
                    airDate: "2019年4月"
                },
                5: {
                    title: "海贼王",
                    genre: ["冒险", "友情", "王道"],
                    description: "路飞为了成为海贼王而展开的伟大航路冒险故事。",
                    cover: "../../../static/egao.png",
                    rating: "8.1",
                    episodes: "380+",
                    status: "连载中",
                    airDate: "1999年10月"
                },
                6: {
                    title: "从零开始的异世界生活",
                    genre: ["奇幻", "悬疑", "恋爱"],
                    description: "少年在异世界获得死亡回归能力的奇幻冒险。",
                    cover: "../../../static/RAM.jpg",
                    rating: "9.2",
                    episodes: "60+",
                    status: "连载中",
                    airDate: "2013年12月"
                },
                4: {
                    title: "刀剑神域",
                    genre: ["奇幻", "悬疑", "科幻"],
                    description: "玩家被困在虚拟现实游戏中的生存冒险故事。",
                    cover: "../../../static/daojian.jpg",
                    rating: "8.3",
                    episodes: "96",
                    status: "完结",
                    airDate: "2012年7月"
                }
            };
            if (animeData[id]) {
                this.anime = { id, ...animeData[id] };
            } else {
                uni.showToast({
                    title: '未找到该动漫信息',
                    icon: 'none'
                });
                setTimeout(() => {
                    uni.navigateBack();
                }, 1500);
            }
        },
        watchAnime() {
            uni.showToast({
                title: '功能暂未开放',
                icon: 'none'
            });
        },
        chooseImage() {
            uni.chooseImage({
                count: 3 - this.uploadedImages.length,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    this.uploadedImages = [...this.uploadedImages, ...res.tempFilePaths];
                }
            });
        },
        removeImage(index) {
            this.uploadedImages.splice(index, 1);
        },
        submitComment() {
            if (!this.newComment.trim()) {
                uni.showToast({
                    title: '请输入评论内容',
                    icon: 'none'
                });
                return;
            }

            const newCommentObj = {
                id: Date.now(),
                username: '我',
                avatar: '../../../static/default-avatar.png',
                content: this.newComment,
                date: this.formatDate(new Date()),
                likes: 0,
                images: [...this.uploadedImages]
            };

            this.comments.unshift(newCommentObj);
            this.newComment = '';
            this.uploadedImages = [];

            uni.showToast({
                title: '评论发布成功',
                icon: 'success'
            });
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        },
        likeComment(commentId) {
            const comment = this.comments.find(c => c.id === commentId);
            if (comment) {
                comment.likes = (comment.likes || 0) + 1;
            }
        },
        previewImage(current, urls) {
            uni.previewImage({
                current,
                urls
            });
        },
        goToUser(username) {
            if (!username) return;
            uni.setStorage({
                key: 'user_info_username',
                data: username,
                success() {
                    uni.navigateTo({
                        url: '/pages/user/others' // 请根据实际路径调整
                    });
                }
            });
        },
    }
};
</script>

<style scoped>
.container {
    background-color: #ffffff;
    min-height: 100vh;
    color: #000000;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    box-sizing: border-box;
    margin-right: 20rpx;
}

.cover-image {
    width: 100%;
    max-width: 100vw;
    height: 400rpx;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    object-fit: cover;
    display: block;
    box-sizing: border-box;
}

.info {
    padding: 0 10rpx;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    box-sizing: border-box;
}

.title {
    font-size: 32rpx;
    font-weight: 700;
    color: #000000;
}

.section {
    background: #f9f9f9;
    padding: 15rpx;
    border-radius: 10rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.section-title {
    font-weight: 600;
    font-size: 26rpx;
    margin-bottom: 8rpx;
    color: #003366;
}

.section-content {
    font-size: 24rpx;
    color: #555555;
    line-height: 1.5;
    word-break: break-word;
}

.extra-info {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    color: #777777;
}

.info-item {
    display: flex;
    font-size: 24rpx;
}

.info-label {
    font-weight: 600;
    margin-right: 6rpx;
    color: #003366;
}

.info-value {
    color: #555555;
}

.btn-watch {
    background-color: #003366;
    color: white;
    font-size: 28rpx;
    padding: 15rpx 0;
    border-radius: 30rpx;
    text-align: center;
    width: 100%;
    margin-top: 30rpx;
    box-sizing: border-box;
    display: block;
}

/* 评论区样式 */
.comment-section {
    margin-top: 40rpx;
    padding: 0 10rpx;
}

.comment-title {
    font-size: 28rpx;
    font-weight: 700;
    color: #003366;
    margin-bottom: 20rpx;
}

.comment-form {
    background: #f9f9f9;
    padding: 20rpx;
    border-radius: 12rpx;
    margin-bottom: 30rpx;
}

.form-header {
    display: flex;
    align-items: center;
    margin-bottom: 15rpx;
}

.user-avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    margin-right: 15rpx;
}

.form-title {
    font-size: 24rpx;
    color: #333;
    font-weight: 600;
}

.comment-input {
    width: 100%;
    min-height: 120rpx;
    background: #fff;
    border: 1rpx solid #e0e0e0;
    border-radius: 8rpx;
    padding: 15rpx;
    font-size: 24rpx;
    margin-bottom: 15rpx;
    box-sizing: border-box;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.image-upload {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 22rpx;
}

.image-count {
    margin-left: 10rpx;
    color: #003366;
}

.btn-submit {
    background: #003366;
    color: white;
    padding: 12rpx 30rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
}

.image-preview {
    display: flex;
    gap: 10rpx;
    margin-top: 15rpx;
}

.preview-item {
    position: relative;
}

.preview-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
}

.remove-btn {
    position: absolute;
    top: -10rpx;
    right: -10rpx;
    width: 30rpx;
    height: 30rpx;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 30rpx;
    font-size: 20rpx;
}

.comment-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.comment-item {
    display: flex;
    padding: 20rpx;
    background: #f9f9f9;
    border-radius: 12rpx;
}

.comment-avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    margin-right: 15rpx;
    flex-shrink: 0;
}

.comment-content {
    flex: 1;
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;
}

.comment-username {
    font-size: 22rpx;
    font-weight: 600;
    color: #003366;
}

.comment-date {
    font-size: 20rpx;
    color: #999;
}

.comment-text {
    font-size: 24rpx;
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

.comment-actions {
    display: flex;
    gap: 30rpx;
}

.action-btn {
    font-size: 20rpx;
    color: #666;
    padding: 8rpx 0;
}
</style>
