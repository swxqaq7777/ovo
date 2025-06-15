<template>
    <view class="container" v-if="loading" style="background: #fff; min-height: 100vh; padding: 30rpx;">
        <scroll-view class="content-wrapper" scroll-y>
            <img :src="sport.image" mode="aspectFill" class="sport-cover" />
            <view class="sport-info">
                <text class="sport-title">{{ sport.title }}</text>
                <p class="sport-category">分类：{{ sport.category }}</p>
                <text class="sport-summary">{{ sport.summary }}</text>
            </view>

            <view class="content-section" v-if="sport.markdownContent">
                <text class="content-title">详细内容</text>
                <zero-markdown-view :markdown="sport.markdownContent" class="markdown-content" />
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
            sport: {},
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
        this.loadSportDetail(id);
    },
    methods: {
        loadSportDetail(id) {
            const sports = {
                1: {
                    title: "2024年奥运会精彩回顾",
                    category: "奥运",
                    summary: "2024年奥运会汇聚了全球顶尖运动员，精彩赛事不断，展现了体育的魅力与精神。",
                    image: "../../../static/2024aoyun.webp",
                    markdownContent: `
# 奥运会盛况

2024年奥运会在全球瞩目中成功举办，来自200多个国家的运动员齐聚一堂，展开激烈角逐。

## 赛事亮点

- 多项世界纪录被刷新
- 新兴运动项目首次亮相
- 运动员们展现了顽强拼搏的精神

![奥运会](../../../static/2024aoyun2.jpg)

> 体育不仅是竞技，更是文化的交流与融合。

## 未来展望

奥运会激励了全球更多人参与体育运动，推动了体育事业的发展。
          `
                },
                2: {
                    title: "足球世界杯最新战报",
                    category: "足球",
                    summary: "最新足球世界杯比赛战报，精彩进球与激烈对抗，带你回顾赛场上的每一个瞬间。",
                    image: "../../../static/zuqiushijiebei.webp",
                    markdownContent: `
四年一届的足球世界杯即将拉开帷幕，许多人憧憬激动人心的那一刻到来。大家清楚地记得，只要足球世界杯大赛战火燃起，身边的生活就悄然发生了变化。清晨见面的第一声问候不再是“吃了吗”，变成了“昨天看球了吗”；吃早餐时最好的佐餐添加剂就是和邻桌一起兴致勃勃地神侃球赛；单位里虽然管理严格，运行有序，但紧张之余大家还会情不自禁地谈及世界杯赛事的话题，说到情浓兴奋处，眼睛里不时闪现出跃动的光芒。一位社会学者讲，四年一次的足球世界杯产生的社会功能不可小视，它巧妙地搭建了球迷之间的桥梁，使彼此的心灵零距离沟通，人际关系也会变得温暖和谐。

事情不仅如此，随着世界杯赛事的开始，人们多年形成的生活规律被重新设计。他们不失时机地听广播，看报纸，查网站，搜罗信息，获知新闻，所关注的无一例外都是有关世界杯足球的动态。
回到家里，本来略显单调的生活陡然间变得丰富多彩。闲暇时光，徜徉或驻足街头的酒吧和餐馆，发现原本门可罗雀的生意突然人满为患，球迷自发地聚在一起，喝啤酒，看电视，抒豪情，议感受，每当有精彩进球出现，顷刻引来一片欢呼，喝彩声、击节声和鼓掌声不绝于耳，此起彼伏，俨然是一个民间的欢乐海洋。
更为有趣的是，在盛夏酷暑时分，一些居民小区的楼窗却一反常态地亮起电视荧屏的光栅，那肯定是球迷在看球。每天数场赛事的直播，真真过足了看球瘾。笔者目睹此景，忽发诗兴，信口吟出“假若你推窗眺望，闪烁的光栅恰似繁星点点，友邻传递着看不见的微笑，领悟着各自的心照不宣，是世界杯的到来，才品尝了这道精美的足球大餐，将天际苍穹装扮得绚丽璀璨”。
不妨想想看，有哪项体育赛事或娱乐活动能与世界杯大赛比肩齐眉，答案简单而坚定：没有。
只有足球才具备如此独特的魅力。这魅力来自足球问世以来生生不息、孜孜以求、不屈不挠、永不言败的进取精神，来自绿茵场上千锤百炼培养出从贝利、克鲁伊夫、贝肯鲍尔、马拉多纳到齐达内、罗纳尔多直至此次亮相南非赛场的C罗、内马尔、梅西、内塔尔等光彩照人的球星，来自发生在球坛、球场、球队和球员中间层出不穷目、不暇接的趣闻轶事，来自和足球同荣辱共命运、痴心不改一往情深的球迷，来自各方媒体对足球由此及彼、由表及里、去粗取精、去伪存真的全方位立体化的渲染梳理，来自足球这个非同凡响的载体，才有了激情四射和情感宣泄的平民舞台。当然，足球魅力的成因理念和内在元素还未被充分认识和开掘，正因如此，足球的发展才风起云涌，方兴未艾，历久不衰，常变常新。
由此可见，球迷热爱足球，其背后彰显的是足球文化，折射的是足球内涵，映衬的是足球精神，它沉淀了世间的阴晴阳缺，包容了心中的喜怒哀乐，忽而张驰有度，驾轻就熟，忽而石破天惊，峰回路转，当费尽气力到达终点后，才发现又面临新的起点，因为足球本身就是一个圆。
          `
                },
                3: {
                    title: "篮球联赛季后赛分析",
                    category: "篮球",
                    summary: "深入分析本赛季篮球联赛季后赛形势，球队表现与关键球员点评，助你掌握赛季动态。",
                    image: "../../../static/lanqiuliansai.webp",
                    markdownContent: `
2024－2025赛季CBA季后赛正如火如荼地进行，辽宁男篮3－0战胜新疆晋级四强，作为联赛中的传统强队和卫冕冠军，他们的夺冠前景备受球迷和媒体关注。

一，潜在竞争对手分析

1. 山西：山西队在本赛季堪称黑马，他们通过成功的引援和出色的战术安排，在常规赛和季后赛中都取得了优异的成绩。外援迪亚洛、古德温的冲击力极强，原帅的三分球更是球队的一大杀器。在与广东队的系列赛中，山西队展现出了强大的实力，以2－0的总比分领先，几乎锁定了一个四强席位。


然而，山西队在与广东队的系列赛中消耗过大，核心球员的体能和状态面临着严峻的考验。此外，山西队主场球迷的不文明行为被CBA官方罚款，若再犯可能面临空场比赛处罚，这无疑会对球队的士气和主场优势产生一定的影响。

2. 青岛：青岛队在本赛季展现出了强大的冲击力，尤其是在季后赛中表现出色。他们拥有出色的外援和本土球员，韦瑟斯庞、杨瀚森等球员在比赛中发挥了重要作用。韦瑟斯庞的得分能力和关键球处理能力十分突出，杨瀚森在内线的防守和篮板球保护方面也有不错的表现。

青岛队的优势在于他们的年轻活力和出色的团队配合，球员们在场上充满斗志，敢于拼搏。但与辽宁队相比，他们在季后赛经验方面存在明显的差距，在面对一些关键比赛和关键时刻的处理上，可能会因为经验不足而出现失误 。


3. 浙江广厦：广厦队在常规赛中表现出色，统治力毋庸置疑。他们拥有胡金秋与孙铭徽的“双核驱动”，这两位球员的个人能力极强，能够在比赛中创造得分机会并带动球队的进攻。胡金秋在内线的强攻和篮板球保护方面表现出色，孙铭徽的组织和突破能力也给对手的防线带来了巨大的压力。

然而，广厦队也存在明显的短板，他们的替补深度不足，主力球员的上场时间过长，这可能导致在季后赛的高强度比赛中，主力球员的体能和状态受到影响，一旦主力球员出现体能问题或者犯规麻烦，球队的整体实力将会受到较大的削弱。


二、辽宁队自身优势与隐患

1. 优势：

丰富的季后赛经验：辽宁队是CBA的老牌强队，多次闯入季后赛并多次夺冠。球队拥有一批经验丰富的球员，如赵继伟、韩德君、李晓旭等，他们在季后赛的舞台上经历过各种高强度的比赛和关键时刻的考验，具备强大的心理素质和应对能力 。

这种丰富的季后赛经验是辽宁队的宝贵财富，在比赛的关键时刻，他们能够保持冷静，按照既定的战术执行，发挥出自己的水平。

强大的阵容深度：辽宁队的阵容深度在联盟中首屈一指。球队不仅拥有实力强劲的首发阵容，替补球员也具备出色的实力。在季后赛首轮与新疆队的系列赛中，球队10人得分，这充分展示了球队深厚的阵容储备。


当首发球员出现体能问题、犯规麻烦或者战术调整时，替补球员能够及时顶上，保证球队的战斗力不出现明显的下滑。

2. 隐患：

内线球员年龄问题：内线核心韩德君38岁和李晓旭35岁，随着年龄的增长，他们的体能和移动速度下滑明显。在面对一些年轻且身体素质出色的内线球员时，可能会陷入被动。

例如，在常规赛对阵山东的比赛中，韩德君和李晓旭在面对对方年轻内线的冲击时，就暴露出了移动速度慢、体能不足的问题，这可能会成为辽宁队在季后赛中的一个隐患。

外援状态不稳定：虽然辽宁队的外援威尔斯和弗格具备较强的实力，但他们的状态存在一定的起伏。弗格本赛季的命中率下滑明显，这在一定程度上影响了球队的进攻效率。


在季后赛中，外援的状态对于球队的胜负至关重要，如果外援不能保持稳定的发挥，辽宁队的夺冠之路将会面临更大的挑战。

五、夺冠概率综合研判

综合以上因素，辽宁队在本赛季季后赛的夺冠概率较高，预计在60% - 70%之间 。从正向因素来看，球队拥有冠军底蕴、丰富的季后赛经验、强大的阵容深度、出色的团队配合以及健康的阵容。这些优势使得他们在面对其他竞争对手时占据着一定的上风。

然而，篮球比赛充满了不确定性，辽宁队也面临着一些风险因素。内线球员的年龄问题可能会在面对特定对手时成为被针对的弱点，外援状态的不稳定也可能影响球队在关键比赛中的表现。


此外，其他竞争对手如广厦、青岛、山西、北京等队也都具备一定的实力，他们在比赛中也有可能超水平发挥，给辽宁队带来麻烦。辽宁前球员贺天举说到:“辽宁这状态难夺冠。”

但总体而言，只要辽宁队能够保持健康，合理调整战术，充分发挥自身的优势，他们有很大的机会完成四连冠伟业。在接下来的半决赛和决赛中，我们期待辽宁队能够延续出色的表现，向着队史第四冠全力冲刺。
          `
                },
                4: {
                    title: "马拉松训练技巧分享",
                    category: "跑步",
                    summary: "专业马拉松训练技巧分享，帮助跑者科学备赛，提高耐力与速度，安全完成比赛。",
                    image: "../../../static/malasong.webp",
                    markdownContent: `
## 一、科学训练体系

分阶段周期化训练‌

基础期（4-6周）‌：以低强度有氧跑为主，逐步提升耐力。初级跑者周跑量20-40公里，长距离慢跑（LSD）占30%以内，心率控制在最大心率60-70%。
强化期（6-8周）‌：加入速度训练。每周1次间歇跑（如6×800米）提升最大摄氧量，1次节奏跑（目标配速的90-95%）提高乳酸阈值，长距离逐步增至25-32公里。
调整期（赛前2-3周）‌：跑量降至峰值80%→50%→30%，保留1次速度训练维持状态，充分恢复体能。

 关键训练方法‌

LSD长距离慢跑‌：距离15-35公里（根据水平调整），配速比目标慢30-40秒，增强脂肪供能能力与肌肉耐力。
抗掉速专项训练‌：长距离跑最后5公里提速至比赛配速，模拟疲劳期发力；采用长间歇（1-2公里/组）提升后程维持能力。
交叉训练‌：每周1-2次游泳/骑行，减少关节压力，强化核心肌群。
## 二、比赛策略优化
配速控制黄金法则‌
全程按目标配速±5秒波动，前半程每公里故意慢10-15秒储备体能，避免起跑冲太快导致后程崩盘。
通过赛前长距离测试（如用目标配速跑半马），校准实际能力区间。
补给时机精细化‌
赛中‌：0-10公里补水为主；10公里后每45分钟补能量胶/运动饮料；30公里后加强补给应对撞墙期。
赛后‌：30分钟内补充碳水+蛋白质（如牛肉面+醪糟），加速糖原修复。
## 三、营养与恢复
赛前碳水储备‌
赛前3天提升碳水占比至总热量60%-70%，选择燕麦、糙米等慢碳食物，避免高纤维食物引发肠胃不适。
高强度训练后修复‌
摄入高蛋白食物（如手抓羊肉、牛奶醪糟）减轻肌肉炎症，搭配坚果补充ω-3脂肪酸。
赛后48小时避免剧烈运动，用泡沫轴放松腿部肌群。
## 四、避坑指南
勿盲目堆跑量‌：周跑量增幅≤10%，单次长跑不超150分钟，过量易受伤。
装备提前磨合‌：比赛鞋需提前适应100公里以上，避免新鞋磨脚。
心理建设‌：撞墙期专注小目标（如下个补给站），分解心理压力。

💡 关键提醒：训练需适配个体能力，初跑者重点打牢有氧基础（心率130-150区间），进阶跑者强化阈值训练。赛前2周全模拟比赛作息与早餐，提升身体适应性。
          `
                },
                5: {
                    title: "网球大师赛精彩瞬间",
                    category: "网球",
                    summary: "回顾网球大师赛上的精彩瞬间，顶级选手的技术与心理较量，感受网球运动的魅力。",
                    image: "../../../static/wangqiu.webp",
                    markdownContent: `
## ‌2024年上海劳力士大师赛‌
冠军归属‌：意大利选手辛纳（Jannik Sinner）在决赛中直落两盘击败德约科维奇（Novak Djokovic），首次夺得上海大师赛冠军。
中国选手表现‌：张之臻、商竣程、吴易昺、周意和黄泽林等6名中国球员首次集体亮相，创本土选手参赛纪录。
赛事热度‌：全程覆盖国庆黄金周，总观赛人次超19.5万（截至2024年10月10日达17万），刷新历史票房记录。
## ‌蒙特卡洛大师赛亮点回顾‌
德约科维奇战绩‌：生涯共17次参赛，总战绩39胜15负，曾于2013年击败纳达尔终结其46连胜纪录，并两度夺冠（2013、2015年）。
2025年焦点‌：40岁的瓦林卡与37岁的德约科维奇可能首轮对决，瓦林卡曾于2014年在此击败费德勒夺冠。
## ‌2025年ITF国际网球大师赛（上海鹏迈站）‌
赛事规模‌：吸引全球24个国家超500人次参与，涵盖男子单打/双打35岁组等组别。
中国关联‌：重庆两江中学外籍教练Henry Prithul Mondol包揽男单35岁组（MS 35）和男双35岁组（MD 35）双冠。
## ‌历史数据补充‌
上海大师赛历届冠军‌：德约科维奇四度夺冠（2012、2013、2015、2018），穆雷三次登顶（2010、2011、2016），费德勒两度问鼎（2014、2017）。
新兴力量‌：2019年梅德韦杰夫夺冠标志新生代崛起，2023年胡尔卡奇首夺上海大师赛冠军。
## 总结

2024-2025赛季大师赛呈现两大趋势：‌新生代球员（如辛纳）持续冲击传统格局‌，‌中国网球影响力显著提升‌（本土选手突破+赛事热度创新高）。而传奇选手如德约科维奇、瓦林卡等仍在高龄段赛事中延续竞技生命力。
          `
                }
            };

            if (sports[id]) {
                this.sport = sports[id];
                this.loading = true;
            } else {
                uni.showToast({
                    title: '未找到该体育内容',
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
    background: #fff;
    min-height: 100vh;
    padding: 30rpx;
    box-sizing: border-box;
}

.content-wrapper {
    min-height: 100vh;
}

.sport-cover {
    width: 100%;
    height: 280rpx;
    border-radius: 16rpx;
    object-fit: cover;
    margin-bottom: 25rpx;
    box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.1);
}

.sport-info {
    margin-bottom: 40rpx;
}

.sport-title {
    font-size: 36rpx;
    font-weight: 800;
    color: #111;
    margin-bottom: 12rpx;
}

.sport-category {
    font-size: 22rpx;
    color: #888;
    margin-bottom: 18rpx;
    font-style: italic;
}

.sport-summary {
    font-size: 20rpx;
    color: #444;
    line-height: 1.8;
}

.content-section {
    border-top: 2rpx solid #eee;
    padding-top: 30rpx;
}

.content-title {
    font-size: 30rpx;
    font-weight: 700;
    color: #0055aa;
    margin-bottom: 20rpx;
    border-left: 6rpx solid #0055aa;
    padding-left: 12rpx;
}

.markdown-content {
    font-size: 18rpx;
    color: #333;
    line-height: 1.9;
}

.markdown-content h1 {
    font-size: 28rpx;
    color: #004080;
    margin-bottom: 20rpx;
    border-bottom: 2rpx solid #004080;
    padding-bottom: 8rpx;
}

.markdown-content h2 {
    font-size: 24rpx;
    color: #0066cc;
    margin-top: 30rpx;
    margin-bottom: 15rpx;
    border-left: 4rpx solid #0066cc;
    padding-left: 10rpx;
}

.markdown-content ul {
    margin-left: 20rpx;
    margin-bottom: 20rpx;
}

.markdown-content blockquote {
    border-left: 4rpx solid #aaa;
    color: #666;
    font-style: italic;
    margin: 20rpx 0;
    padding-left: 15rpx;
}

.markdown-content img {
    width: 100%;
    border-radius: 12rpx;
    margin: 20rpx 0;
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.loading-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #F9FAFB;
}

.loader {
    width: 60px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 10px solid #0055aa;
    animation:
        l20-1 0.8s infinite linear alternate,
        l20-2 1.6s infinite linear;
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
