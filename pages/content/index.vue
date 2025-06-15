<template>
  <view class="container" v-if="loading">
    <view class="content-wrapper">
      <h3 class="title">{{ info.title }}</h3>
      <view class="meta-row">
        <view class="meta-item">
          <uni-icons type="eye-filled" size="24" color="#999" />
          <text class="meta-text">{{ info.views }} 浏览</text>
        </view>
        <view class="meta-item">
          <text class="meta-text">{{ formatTimestamp(info.created) }}</text>
        </view>
      </view>
      <uni-card shadow="none" style="margin-top: 10rpx;">
        <zero-markdown-view :markdown="content" />
        <text class="modified-text">最后修改：{{ formatTimestamp(info.modified) }}</text>
      </uni-card>

      <!-- 评论区域 -->
      <view class="comment-section">
        <view class="comment-header">
          <text class="comment-title">评论 ({{ totalComments }})</text>
        </view>

        <!-- 发表评论 -->
        <view class="comment-form">
          <view class="form-header">
            <image class="user-avatar" src="../../static/default-avatar.png" mode="aspectFill" />
            <text class="form-title">发表评论</text>
          </view>
          <textarea class="comment-input" v-model="newComment" placeholder="写下你的想法..." maxlength="500" />
          <view class="form-actions">
            <view class="image-upload" @click="chooseImage">
              <text class="upload-text">📷 添加图片</text>
              <text class="image-count" v-if="uploadedImages.length > 0">({{ uploadedImages.length }})</text>
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
                <textarea class="reply-input" v-model="replyContent" :placeholder="`回复 @${comment.username}:`"
                  maxlength="300" />
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
                      <text class="action-btn-small" @click="showReplyToReply(comment.id, reply.username)">
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
    </view>

    <view class="footer">
      © 2024 个人博客 版权所有
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
      info: {},
      content: '',
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
          avatar: '../../static/avatar1.jpg',
          content: '这篇文章写得真好！作者的文笔很优美，读起来很有感觉。',
          date: '2024-01-15 14:30',
          likes: 12,
          images: [],
          replies: [
            {
              id: 101,
              username: '读书小达人',
              avatar: '../../static/avatar2.jpg',
              content: '同感！特别是那段关于人生感悟的描述，很有深度。',
              date: '2024-01-15 15:20',
              likes: 3,
              replyTo: '文学爱好者'
            },
            {
              id: 102,
              username: '作者本人',
              avatar: '../../static/avatar3.jpg',
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
          avatar: '../../static/avatar4.jpg',
          content: '配图很棒！这些照片拍得很有意境，和文章内容很搭配。',
          date: '2024-01-14 20:15',
          likes: 8,
          images: ['../../static/comment-1.jpg'],
          replies: []
        },
        {
          id: 3,
          username: '思考者',
          avatar: '../../static/avatar5.jpg',
          content: '文章引发了我很多思考，特别是关于生活态度的那部分。分享一张相关的图片。',
          date: '2024-01-13 16:45',
          likes: 15,
          images: ['../../static/comment-2.png', '../../static/comment-3.jpg'],
          replies: [
            {
              id: 201,
              username: '哲学系学生',
              avatar: '../../static/avatar6.jpg',
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
          avatar: '../../static/avatar7.jpg',
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
  methods: {
    formatTimestamp(value) {
      if (!value) return '';
      const date = new Date(value * 1000);
      return date.toLocaleDateString();
    },
    loadContent() {
      uni.getStorage({
        key: 'content_id',
        success: (res) => {
          const articles = {
            1: {
              title: "《百年孤独》的魔幻现实主义解读",
              views: 2300,
              created: 1609459200,
              modified: 1672444800,
              text: `
# 魔幻现实主义的典型代表

作为拉丁美洲文学的杰出代表，《百年孤独》以其独特的魔幻现实主义手法，深刻地反映了拉丁美洲的历史与现实，成为了世界文学史上的经典之作。

![百年孤独封面](../../static/bainianguduchahua.jpg)

## 布恩迪亚家族的兴衰史

这部作品通过布恩迪亚家族七代人的传奇故事，展现了一个家庭乃至整个民族的兴衰历程。在马尔克斯的笔下，现实与幻想交织，历史与神话并存。

> "生命中真正重要的不是你遭遇了什么，而是你记住了哪些事，又是如何铭记的。"

## 孤独的永恒主题

- 个体的孤独：每个角色都被困在自己的内心世界中，无法真正与他人沟通。
- 历史的孤独：拉丁美洲在历史长河中的边缘化地位。
- 命运的循环：家族命运的重复，象征着历史的轮回。

## 结语

通过这部作品，我们看到了一个充满魔幻色彩的世界，同时也深刻理解了人类共同面临的孤独命题。

---

![魔幻现实主义](../../static/mohuan.jpg)

### 总结

《百年孤独》以其独特的叙事手法，成为了魔幻现实主义文学的典范之作。
    `
            },
            2: {
              title: "《三体》的科幻思维与人文关怀",
              views: 3100,
              created: 1612137600,
              modified: 1675123200,
              text: `
# 宇宙社会学

刘慈欣的《三体》三部曲是中国科幻文学的里程碑作品，它不仅展现了宏大的宇宙观，更深入探讨了人类文明的未来走向。

![三体封面](../../static/santichahua.png)

## 黑暗森林法则

这部作品中最著名的理论就是"黑暗森林法则"。宇宙就像一座黑暗的森林，每个文明都是带枪的猎人，必须小心翼翼地生存。

> "宇宙就是一座黑暗森林，每个文明都是带枪的猎人。"

## 人性的思考

- 三体文明的绝望与希望
- 人类文明的脆弱性
- 宇宙中生存的残酷性

---

### 总结

《三体》不仅是一部科幻小说，更是对人类未来命运的深刻思考。
    `
            },
            3: {
              title: "《哈利·波特》系列的魔法世界构建",
              views: 2700,
              created: 1617235200,
              modified: 1680307200,
              text: `
# 魔法的世界

J.K.罗琳的哈利·波特系列作品创造了一个完整而复杂的魔法世界，这个世界有着自己的历史、文化、政治和社会结构。

![哈利·波特封面](../../static/hali.jpg)

## 霍格沃茨学校

这座魔法学校不仅是故事的主要舞台，更是整个魔法世界的缩影。哈利在这里不仅学会了魔法，更重要的是学会了友谊、勇气和爱。

> "决定我们成为什么样的人，不是我们的能力，而是我们的选择。"

## 结语

罗琳创造的这个魔法世界，不仅给读者带来了无尽的想象空间，更传达了关于成长、友谊和爱的永恒主题。
    `
            },
            4: {
              title: "《追风筝的人》的救赎主题解析",
              views: 2500,
              created: 1625097600,
              modified: 1688169600,
              text: `
# 救赎之路

《追风筝的人》通过阿米尔的成长历程，深刻地探讨了背叛、愧疚与救赎这一永恒的人性主题。

![追风筝的人封面](../../static/zhuifengzhengderen.png)

## 人性的复杂

这部作品展现了人性中最复杂的一面。背叛与忠诚、怯懦与勇敢交织在一起。

> "为你，千千万万遍。"

## 总结

通过这个故事，我们看到了人性的复杂，也看到了救赎的可能。
    `
            },
            5: {
              title: "《挪威的森林》的青春迷茫与成长",
              views: 2200,
              created: 1622505600,
              modified: 1685577600,
              text: `
# 青春的迷茫

村上春树的《挪威的森林》描绘了一代人在青春期的迷茫与成长。

![挪威的森林封面](../../static/nuowei.png)

## 人性

这部作品深刻地描绘了青春期的困惑与成长的痛苦。

> "成长就是不断告别。"

## 结语

通过这个故事，我们看到了青春的美好与残酷，也看到了成长的必然性。
    `
            },
            6: {
              title: "现代诗歌的意境美学",
              views: 1800,
              created: 1640995200,
              modified: 1673568000,
              text: `
# 诗歌中的意境营造

现代诗歌作为文学艺术的重要形式，其意境美学的构建是诗人表达情感、传递思想的重要手段。

![现代诗歌](../../static/poetry.png)

## 意境的层次性

现代诗歌的意境往往具有多重层次：
- **表层意境**：直观的画面描述
- **深层意境**：情感的暗示与象征
- **哲理意境**：思想的升华与启迪

## 意象的运用

诗人通过精心选择的意象来构建诗歌的意境：

> "落红不是无情物，化作春泥更护花。"

这种意象的选择不仅仅是为了美感，更是为了传达深层的情感和思想。

## 现代诗歌的创新

现代诗歌在继承传统的基础上，融入了更多现代元素：
- 自由诗体的运用
- 现代生活场景的融入
- 多元文化的交融

## 结语

现代诗歌的意境美学体现了诗人对生活的深刻观察和独特感悟，为读者提供了丰富的精神食粮。
    `
            },
            7: {
              title: "散文写作技巧分享",
              views: 2100,
              created: 1643673600,
              modified: 1676246400,
              text: `
# 散文写作的艺术

散文作为一种自由灵活的文学体裁，其写作技巧的掌握对于提升文学表达能力具有重要意义。

![散文写作](../../static/essay-writing.jpg)

## 选材的重要性

好的散文源于生活，高于生活：
- **真实性**：选择真实的生活素材
- **典型性**：选择具有代表性的事件
- **新颖性**：从独特角度切入

## 结构安排

散文的结构虽然自由，但仍需精心安排：

### 开头技巧
- 开门见山式
- 设置悬念式
- 情景描述式

### 主体展开
- 时间顺序
- 空间顺序
- 逻辑顺序

### 结尾升华
- 点题式结尾
- 抒情式结尾
- 哲理式结尾

## 语言运用

散文的语言应该：
- **准确**：用词精确，表达清晰
- **生动**：运用修辞手法
- **优美**：注重音韵和节奏

> "文章不是无情物，字字句句总关情。"

## 实践建议

1. 多读优秀散文作品
2. 勤于观察生活
3. 坚持写作练习
4. 注重修改完善

## 结语

散文写作是一个不断学习和实践的过程，只有持之以恒，才能写出打动人心的好作品。
    `
            },
            8: {
              title: "古典文学的现代价值",
              views: 1950,
              created: 1646265600,
              modified: 1678838400,
              text: `
# 传承与创新的平衡

古典文学作为中华文化的瑰宝，在现代社会中仍然具有重要的价值和意义。

![古典文学](../../static/gudian.jpg)

## 文化传承的载体

古典文学承载着深厚的文化内涵：
- **历史记忆**：记录了不同时代的社会风貌
- **价值观念**：体现了传统的道德理念
- **艺术成就**：展现了高超的文学技巧

## 现代启示意义

### 人生智慧
古典文学中蕴含着丰富的人生哲理：

> "山重水复疑无路，柳暗花明又一村。"

这些智慧对现代人面对困境仍有指导意义。

### 审美教育
- 培养高雅的审美情趣
- 提升文学鉴赏能力
- 增强文化自信

### 精神滋养
- 陶冶情操
- 净化心灵
- 提升境界

## 现代传播方式

古典文学需要与时俱进：
- **数字化传播**：利用网络平台
- **影视改编**：通过视觉艺术呈现
- **教育普及**：融入现代教育体系

## 面临的挑战

1. 语言障碍
2. 时代差异
3. 接受度问题

## 解决策略

- 注释解读
- 现代阐释
- 创新表达

## 结语

古典文学的现代价值在于其永恒的人文精神和艺术魅力，我们应该在传承中创新，在创新中传承。
    `
            },
            9: {
              title: "读书笔记整理方法",
              views: 2400,
              created: 1648944000,
              modified: 1681516800,
              text: `
# 高效读书笔记系统

良好的读书笔记整理方法能够帮助我们更好地吸收知识，提升阅读效果。

![读书笔记](../../static/dushubiji.jpg)

## 笔记记录原则

### 选择性记录
不是所有内容都需要记录：
- **重点内容**：核心观点和论据
- **新颖见解**：启发性的思考
- **疑问困惑**：需要进一步思考的问题

### 结构化整理
- **章节概要**：每章主要内容总结
- **关键词汇**：重要概念和术语
- **思维导图**：知识结构梳理

## 笔记方法分类

### 康奈尔笔记法
- 左侧：关键词和问题
- 右侧：详细笔记
- 底部：总结概括

### 思维导图法
- 中心主题
- 分支要点
- 细节补充

### 表格整理法
| 章节 | 主要观点 | 个人思考 | 相关联想 |
|------|----------|----------|----------|
| 第一章 | ... | ... | ... |

## 数字化工具推荐

### 笔记软件
- **印象笔记**：全平台同步
- **有道云笔记**：功能丰富
- **Notion**：模块化管理

### 思维导图工具
- **XMind**：专业思维导图
- **MindMaster**：简单易用
- **百度脑图**：在线制作

## 笔记复习策略

### 定期回顾
- **艾宾浩斯遗忘曲线**：科学复习间隔
- **主动回忆**：不看笔记回想内容
- **关联思考**：与已有知识建立联系

### 知识输出
- 写读后感
- 分享讨论
- 实践应用

## 笔记管理技巧

1. **分类标签**：便于检索
2. **定期整理**：保持系统性
3. **备份保存**：防止丢失
4. **持续优化**：改进方法

## 常见问题解决

### 记录过多
- 学会筛选重点
- 使用符号标记
- 分层次记录

### 缺乏系统
- 建立固定格式
- 使用统一工具
- 定期整理归档

## 结语

好的读书笔记不仅是知识的记录，更是思考的痕迹。通过系统的整理方法，我们能够将阅读转化为真正的智慧积累。
    `
            },
            10: {
              title: "文学创作的灵感来源",
              views: 1750,
              created: 1651536000,
              modified: 1684108800,
              text: `
# 创作灵感的奥秘

文学创作中的灵感往往是作品成功的关键因素，了解灵感的来源和培养方法对创作者具有重要意义。


## 灵感的本质

灵感并非神秘莫测的现象，而是：
- **知识积累**的厚积薄发
- **生活体验**的深度思考
- **情感共鸣**的瞬间爆发

## 主要来源渠道

### 生活观察
日常生活是最丰富的素材库：
- **人物观察**：不同性格的人物特征
- **场景描写**：各种环境的细节
- **情感体验**：真实的内心感受

### 阅读积累
广泛阅读能够：
- 拓展视野
- 丰富词汇
- 学习技巧
- 激发联想

> "读书破万卷，下笔如有神。"

### 文化体验
- **旅行见闻**：不同地域的文化差异
- **历史学习**：古今对比的思考
- **艺术欣赏**：跨领域的灵感碰撞

## 灵感培养方法

### 保持敏感性
- 细心观察周围事物
- 记录生活中的点滴
- 培养同理心

### 建立素材库
- **随身笔记**：及时记录想法
- **分类整理**：按主题归档
- **定期回顾**：重新审视旧素材

### 创造条件
- **安静环境**：有利于思考
- **规律作息**：保持良好状态
- **适度压力**：激发创作动力

## 灵感的捕捉技巧

### 即时记录
灵感稍纵即逝，需要：
- 随身携带记录工具
- 使用手机备忘录
- 语音记录想法

### 联想训练
- **自由联想**：不受限制的思维发散
- **强制联想**：将不相关事物联系
- **类比思维**：寻找相似性

## 灵感的转化过程

### 从想法到作品
1. **初步构思**：基本框架
2. **深入思考**：细节完善
3. **文字表达**：具体创作
4. **修改完善**：反复打磨

### 克服创作瓶颈
- 暂时放下，换个角度
- 与他人交流讨论
- 回到生活中寻找新素材

## 不同体裁的灵感特点

### 小说创作
- 人物塑造的灵感
- 情节设计的巧思
- 环境描写的细节

### 诗歌创作
- 意象选择的独特性
- 情感表达的深度
- 语言运用的美感

### 散文创作
- 生活感悟的真实性
- 思想表达的深刻性
- 语言风格的个性化

## 结语

文学创作的灵感来源于生活而高于生活，需要创作者用心观察、用情体验、用智慧思考。只有不断积累和培养，才能在创作中获得源源不断的灵感。
    `
            },
            11: {
              title: "书评写作心得",
              views: 1650,
              created: 1654128000,
              modified: 1686700800,
              text: `
# 书评写作的艺术

书评作为文学批评的重要形式，既要体现对作品的深度理解，又要具备独立的思考和判断。

## 书评的基本要素

### 内容概述
- **简要介绍**：作品基本信息
- **主要内容**：核心情节或观点
- **创作背景**：时代和作者情况

### 深度分析
- **主题思想**：作品要表达的核心理念
- **艺术特色**：写作技巧和风格特点
- **价值评判**：文学价值和社会意义

## 写作结构安排

### 开头部分
- 引起读者兴趣
- 简介作品基本情况
- 提出评价观点

### 主体部分
#### 内容分析
- 情节结构分析
- 人物形象塑造
- 主题思想阐述

#### 艺术评价
- 语言风格特点
- 表现手法运用
- 创新之处分析

#### 价值判断
- 文学价值评估
- 社会意义探讨
- 读者接受度分析

### 结尾部分
- 总结评价观点
- 提出阅读建议
- 展望作品影响

## 写作技巧要点

### 客观公正
- 避免主观偏见
- 基于文本分析
- 平衡优缺点评价

### 深入浅出
- 专业术语适度使用
- 举例说明观点
- 语言通俗易懂

### 独特视角
- 提出新颖见解
- 避免人云亦云
- 体现个人思考

## 常见问题及对策

### 内容空泛
**问题表现**：
- 泛泛而谈，缺乏具体分析
- 套用模板，没有针对性

**解决方法**：
- 深入阅读原作
- 找准分析角度
- 用具体例证支撑观点

### 过于主观
**问题表现**：
- 个人好恶代替客观评价
- 缺乏理论依据

**解决方法**：
- 建立评价标准
- 引用权威观点
- 注重文本分析

### 缺乏新意
**问题表现**：
- 重复他人观点
- 缺乏独立思考

**解决方法**：
- 寻找独特角度
- 结合时代背景
- 提出个人见解

## 不同类型书评特点

### 学术书评
- 理论性强
- 引用规范
- 逻辑严密

### 大众书评
- 通俗易懂
- 贴近读者
- 实用性强

### 专业书评
- 针对性强
- 专业术语适当
- 深度分析

## 提升书评质量的建议

### 广泛阅读
- 阅读经典作品
- 了解文学理论
- 关注当代创作

### 勤于思考
- 记录阅读感受
- 分析作品特点
- 形成独立观点

### 多写多练
- 坚持写作练习
- 学习优秀书评
- 接受他人建议

### 关注反馈
- 重视读者意见
- 不断改进方法
- 提升写作水平

## 结语

优秀的书评不仅能够帮助读者更好地理解作品，也是对文学创作的有益促进。通过不断学习和实践，我们能够写出更有价值的书评作品。
    `
            }
          };

          const id = res.data;
          if (articles[id]) {
            this.info = articles[id];
            this.content = articles[id].text.trim();
            this.loading = true;
          } else {
            uni.showToast({
              title: '未找到该内容',
              icon: 'none'
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        },
        fail: () => {
          uni.showToast({
            title: '未获取到内容 ID',
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
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
        avatar: '../../static/default-avatar.png',
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
          avatar: '../../static/default-avatar.png',
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
  },
  mounted() {
    this.loadContent();
  }
};
</script>

<style scoped>
.avatar-hover {
  opacity: 0.8;
  cursor: pointer;
}

.container {
  position: relative;
  min-height: 100vh;
  background: #F1F3F4;
  font-size: 20rpx;
  line-height: 1.8;
  color: #333;
  padding-bottom: 100rpx;
  box-sizing: border-box;
}

.content-wrapper {
  padding: 20rpx;
  background-color: white;
  min-height: calc(100vh - 100rpx);
  box-sizing: border-box;
}

.title {
  font-weight: bold;
  font-size: 34rpx;
  margin-bottom: 15rpx;
  color: #222;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  margin-top: 15rpx;
  margin-bottom: 15rpx;
  color: #666;
  font-size: 18rpx;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-text {
  margin-left: 8rpx;
}

.modified-text {
  margin-top: 25rpx;
  font-size: 16rpx;
  color: #999;
  text-align: right;
}

/* 评论区样式 */
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

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background-color: white;
  font-size: 18rpx;
  color: #666;
  text-align: center;
  line-height: 100rpx;
  box-shadow: 0 -1rpx 5rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
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
