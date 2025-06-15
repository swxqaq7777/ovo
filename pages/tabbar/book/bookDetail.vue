<template>
    <view class="container" v-if="loading" style="background: #F9FAFB; min-height: 100vh;">
        <scroll-view class="content-wrapper" scroll-y>
            <img :src="book.cover" mode="aspectFill" class="book-cover" />
            <view class="book-info">
                <text class="book-title">{{ book.title }}</text>
                <p class="book-author">作者：{{ book.author }}</p>
                <text class="book-desc">{{ book.description }}</text>
            </view>

            <view class="quote-section" v-if="book.quotes && book.quotes.length">
                <text class="quote-title">经典语句</text>
                <view v-for="(quote, index) in book.quotes" :key="index" class="quote-item">
                    <text class="quote-text">“{{ quote }}”</text>
                </view>
            </view>

            <view class="extra-content" v-if="book.extraContent && book.extraContent.length">
                <text class="extra-title">介绍</text>
                <view v-for="(para, idx) in book.extraContent" :key="idx" class="extra-paragraph">
                    <text>{{ para }}</text>
                </view>
            </view>
            <!-- 评论区域 -->
            <view class="comment-section">
                <view class="comment-header">
                    <text class="comment-title">评论 ({{ totalComments }})</text>
                </view>

                <!-- 发表评论 -->
                <view class="comment-form">
                    <view class="form-header">
                        <image class="user-avatar" src="../../../static/default-avatar.png" mode="aspectFill" />
                        <text class="form-title">发表评论</text>
                    </view>
                    <textarea class="comment-input" v-model="newComment" placeholder="写下你的想法..." maxlength="500" />
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
                            @click="goToUserInfo(comment.username)" hover-class="avatar-hover" />
                        <view class="comment-content">
                            <view class="comment-header-info">
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
                                <text class="action-btn" @click="showReplyForm(comment.id)">
                                    💬 回复
                                </text>
                            </view>

                            <!-- 回复表单 -->
                            <view class="reply-form" v-if="replyingTo === comment.id">
                                <textarea class="reply-input" v-model="replyContent"
                                    :placeholder="`回复 @${comment.username}:`" maxlength="300" />
                                <view class="reply-actions">
                                    <button class="btn-cancel" @click="cancelReply">取消</button>
                                    <button class="btn-reply" @click="submitReply(comment.id)">回复</button>
                                </view>
                            </view>

                            <!-- 回复列表 -->
                            <view class="reply-list" v-if="comment.replies && comment.replies.length > 0">
                                <view class="reply-item" v-for="reply in comment.replies" :key="reply.id">
                                    <image :src="reply.avatar" mode="aspectFill" class="reply-avatar"
                                        @click="goToUserInfo(reply.username)" hover-class="avatar-hover" />
                                    <view class="reply-content">
                                        <view class="reply-header">
                                            <text class="reply-username">{{ reply.username }}</text>
                                            <text class="reply-to" v-if="reply.replyTo">回复 @{{ reply.replyTo }}</text>
                                            <text class="reply-date">{{ reply.date }}</text>
                                        </view>
                                        <text class="reply-text">{{ reply.content }}</text>
                                        <view class="reply-actions-sub">
                                            <text class="action-btn-small" @click="likeReply(comment.id, reply.id)">
                                                👍 {{ reply.likes || 0 }}
                                            </text>
                                            <text class="action-btn-small"
                                                @click="showReplyToReply(comment.id, reply.username)">
                                                回复
                                            </text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>

    <view v-else class="loading-container">
        <view class="loader"></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            book: {},
            loading: false,
            newComment: '',
            uploadedImages: [],
            replyingTo: null,
            replyContent: '',
            replyToUser: '',
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
                    avatar: '../../static/avatar5.jpg',
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
    computed: {
        totalComments() {
            let total = this.comments.length;
            this.comments.forEach(comment => {
                if (comment.replies) {
                    total += comment.replies.length;
                }
            });
            return total;
        }
    },
    onLoad(options) {
        const id = options.id || 1;
        this.loadBook(id);
    },
    methods: {
        loadBook(id) {
            const books = {
                1: {
                    title: "百年孤独",
                    author: "加西亚·马尔克斯",
                    description: "魔幻现实主义的经典作品，讲述布恩迪亚家族七代人的传奇故事，融合现实与幻想。",
                    cover: "../../../static/bainiangudu.jpg",
                    quotes: [
                        "生命中真正重要的东西，是看不见的。",
                        "时间是一条河流，带走了我们的青春。",
                        "孤独是人类的宿命。"
                    ],
                    extraContent: [
                        "《百年孤独》通过丰富的象征和隐喻，展现了拉丁美洲的历史与文化。小说中时间的循环、宿命的主题令人深思。",
                        "故事中人物的命运交织，既有家族的兴衰，也有个人的挣扎与救赎，体现了人类的复杂情感。",
                        "这部作品不仅是文学的瑰宝，也为读者打开了一扇通往奇幻与现实交织世界的大门，值得反复品味与探讨。"
                    ]
                },
                2: {
                    title: "三体",
                    author: "刘慈欣",
                    description: "中国科幻文学的里程碑，宏大的宇宙观和深刻的哲学思考，探讨文明存亡与科技发展。",
                    cover: "../../../static/santi.jpg",
                    quotes: [
                        "文明的进步是以牺牲为代价的。",
                        "宇宙是黑暗森林，每个文明都是带枪的猎人。",
                        "人类的未来充满未知。"
                    ],
                    extraContent: [
                        "《三体》系列以其宏大的宇宙观和复杂的科学设定，开创了中国科幻文学的新纪元。",
                        "小说探讨了文明的存亡、科技的发展与人类的未来，情节紧凑，思想深邃。",
                        "作品获得了国际科幻界的高度评价，激发了更多人对宇宙和人类命运的思考。"
                    ]
                },
                3: {
                    title: "哈利·波特与魔法石",
                    author: "J.K.罗琳",
                    description: "魔法世界的奇幻冒险，少年巫师哈利·波特在霍格沃茨的成长与挑战。",
                    cover: "../../../static/hali.jpg",
                    quotes: [
                        "幸福可以在最黑暗的时刻被找到，只要有人记得开灯。",
                        "我们选择的道路，决定了我们是谁。",
                        "勇气并不是没有恐惧，而是面对恐惧。"
                    ],
                    extraContent: [
                        "《哈利·波特》系列不仅是儿童文学的经典，也深刻影响了现代流行文化。",
                        "故事融合了友情、勇气与成长的主题，描绘了一个充满魔法与奇迹的世界。",
                        "哈利与他的朋友们共同面对黑暗势力，展开了一场场惊心动魄的冒险，激励了无数读者。"
                    ]
                },
                4: {
                    title: "追风筝的人",
                    author: "卡勒德·胡赛尼",
                    description: "感人至深的友情与救赎故事，描绘阿富汗动荡年代的人性光辉。",
                    cover: "../../../static/zhuifengzhengderen.png",
                    quotes: [
                        "为你，千千万万遍。",
                        "有些错误，只有用一生去偿还。",
                        "真正的勇气，是面对自己的过去。"
                    ],
                    extraContent: [
                        "小说深刻描绘了阿富汗社会的变迁与人性的复杂，充满了对友情、背叛与救赎的探讨。",
                        "主人公阿米尔的成长历程令人动容，展现了人类面对错误时的挣扎与勇气。",
                        "《追风筝的人》成为全球畅销书，感动了无数读者。"
                    ]
                },
                5: {
                    title: "挪威的森林",
                    author: "村上春树",
                    description: "青春与孤独的诗意表达，探索生命的意义与情感的复杂。",
                    cover: "../../../static/nuowei.png",
                    quotes: [
                        "死并非生的对立面，而作为生的一部分永存。",
                        "孤独是人生的常态。",
                        "我们都在寻找属于自己的出口。"
                    ],
                    extraContent: [
                        "《挪威的森林》以细腻的笔触描绘了青春的迷茫与孤独，探索了生命的意义。",
                        "小说中人物的情感纠葛和心理变化真实动人，充满诗意与哲理。",
                        "这部作品成为村上春树最具代表性的作品之一，影响深远。"
                    ]
                }
            };

            if (books[id]) {
                this.book = books[id];
                this.loading = true;
            } else {
                uni.showToast({
                    title: '未找到该书籍信息',
                    icon: 'none'
                });
                setTimeout(() => {
                    uni.navigateBack();
                }, 1500);
            }
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
                date: this.formatCurrentDate(),
                likes: 0,
                images: [...this.uploadedImages],
                replies: []
            };

            this.comments.unshift(newCommentObj);
            this.newComment = '';
            this.uploadedImages = [];

            uni.showToast({
                title: '评论发布成功',
                icon: 'success'
            });
        },
        showReplyForm(commentId) {
            this.replyingTo = commentId;
            this.replyContent = '';
        },
        cancelReply() {
            this.replyingTo = null;
            this.replyContent = '';
            this.replyToUser = '';
        },
        submitReply(commentId) {
            if (!this.replyContent.trim()) {
                uni.showToast({
                    title: '请输入回复内容',
                    icon: 'none'
                });
                return;
            }

            const comment = this.comments.find(c => c.id === commentId);
            if (comment) {
                const newReply = {
                    id: Date.now(),
                    username: '我',
                    avatar: '../../../static/default-avatar.png',
                    content: this.replyContent,
                    date: this.formatCurrentDate(),
                    likes: 0,
                    replyTo: this.replyToUser || comment.username
                };

                if (!comment.replies) {
                    comment.replies = [];
                }
                comment.replies.push(newReply);

                this.cancelReply();
                uni.showToast({
                    title: '回复成功',
                    icon: 'success'
                });
            }
        },
        showReplyToReply(commentId, username) {
            this.replyingTo = commentId;
            this.replyToUser = username;
            this.replyContent = '';
        },
        likeComment(commentId) {
            const comment = this.comments.find(c => c.id === commentId);
            if (comment) {
                comment.likes = (comment.likes || 0) + 1;
            }
        },
        likeReply(commentId, replyId) {
            const comment = this.comments.find(c => c.id === commentId);
            if (comment && comment.replies) {
                const reply = comment.replies.find(r => r.id === replyId);
                if (reply) {
                    reply.likes = (reply.likes || 0) + 1;
                }
            }
        },
        previewImage(current, urls) {
            uni.previewImage({
                current,
                urls
            });
        },
        formatCurrentDate() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        },
        goToUserInfo(username) {
            // 将用户名存储到本地缓存，供用户信息页读取
            uni.setStorage({
                key: 'user_info_username',
                data: username,
                success: () => {
                    uni.navigateTo({
                        url: '/pages/user/others'
                    });
                }
            });
        }
    }
};
</script>

<style scoped>
.container {
    background-color: #F9FAFB;
    min-height: 100vh;
    padding: 20rpx;
    box-sizing: border-box;
}

.content-wrapper {
    background: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    box-sizing: border-box;
}

.book-cover {
    width: 340rpx;
    height: 460rpx;
    border-radius: 12rpx;
    object-fit: cover;
    margin-bottom: 20rpx;
}


.book-info {
    margin-bottom: 30rpx;
}

.book-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #222;
    margin-bottom: 10rpx;
}

.book-author {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 15rpx;
}

.book-desc {
    font-size: 22rpx;
    color: #555;
    line-height: 1.6;
}

.quote-section {
    border-top: 1rpx solid #eee;
    padding-top: 20rpx;
    margin-bottom: 30rpx;
}

.quote-title {
    font-size: 26rpx;
    font-weight: 600;
    color: #003366;
    margin-bottom: 15rpx;
}

.quote-item {
    margin-bottom: 15rpx;
}

.quote-text {
    font-size: 20rpx;
    font-style: italic;
    color: #444;
    line-height: 1.5;
}

.extra-content {
    border-top: 1rpx solid #eee;
    padding-top: 20rpx;
}

.extra-title {
    font-size: 26rpx;
    font-weight: 600;
    color: #003366;
    margin-bottom: 15rpx;
}

.extra-paragraph {
    font-size: 20rpx;
    color: #555;
    line-height: 1.6;
    margin-bottom: 15rpx;
}

/* 加载动画 */
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

.avatar-hover {
    opacity: 0.8;
    cursor: pointer;
}

.comment-section {
    margin-top: 40rpx;
    border-top: 1rpx solid #eee;
    padding-top: 30rpx;
}

.comment-header {
    margin-bottom: 20rpx;
}

.comment-title {
    font-size: 28rpx;
    font-weight: 700;
    color: #333;
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
    color: #007aff;
}

.btn-submit {
    background: #007aff;
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

.comment-header-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;
}

.comment-username {
    font-size: 22rpx;
    font-weight: 600;
    color: #007aff;
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
    margin-bottom: 15rpx;
}

.action-btn {
    font-size: 20rpx;
    color: #666;
    padding: 8rpx 0;
}

/* 回复表单样式 */
.reply-form {
    background: #fff;
    padding: 15rpx;
    border-radius: 8rpx;
    margin-top: 15rpx;
    border: 1rpx solid #e0e0e0;
}

.reply-input {
    width: 100%;
    min-height: 80rpx;
    border: 1rpx solid #e0e0e0;
    border-radius: 6rpx;
    padding: 10rpx;
    font-size: 22rpx;
    margin-bottom: 10rpx;
    box-sizing: border-box;
}

.reply-actions {
    display: flex;
    justify-content: flex-end;
    gap: 15rpx;
}

.btn-cancel {
    background: #f0f0f0;
    color: #666;
    padding: 8rpx 20rpx;
    border-radius: 15rpx;
    font-size: 20rpx;
}

.btn-reply {
    background: #007aff;
    color: white;
    padding: 8rpx 20rpx;
    border-radius: 15rpx;
    font-size: 20rpx;
}

/* 回复列表样式 */
.reply-list {
    margin-top: 15rpx;
    padding-left: 20rpx;
    border-left: 2rpx solid #e0e0e0;
}

.reply-item {
    display: flex;
    margin-bottom: 15rpx;
    padding: 15rpx;
    background: #fff;
    border-radius: 8rpx;
}

.reply-avatar {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    margin-right: 12rpx;
    flex-shrink: 0;
}

.reply-content {
    flex: 1;
}

.reply-header {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
    flex-wrap: wrap;
    gap: 10rpx;
}

.reply-username {
    font-size: 20rpx;
    font-weight: 600;
    color: #007aff;
}

.reply-to {
    font-size: 18rpx;
    color: #666;
}

.reply-date {
    font-size: 18rpx;
    color: #999;
}

.reply-text {
    font-size: 22rpx;
    color: #333;
    line-height: 1.4;
    margin-bottom: 10rpx;
}

.reply-actions-sub {
    display: flex;
    gap: 20rpx;
}

.action-btn-small {
    font-size: 18rpx;
    color: #666;
    padding: 5rpx 0;
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
