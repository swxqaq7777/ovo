<template>
  <view class="container">
    <view class="header">
      <text class="title">热门动漫推荐</text>
    </view>

    <scroll-view class="anime-list" scroll-y="true" :scroll-with-animation="true" style="height: 80vh;">
      <view v-for="(anime, index) in animeList" :key="anime.id" class="anime-item" @click="goToDetail(anime.id)">
        <img :src="anime.cover" mode="aspectFill" class="anime-cover">
        <view class="anime-info">
          <text class="anime-title">{{ anime.title }}</text>
          <text class="anime-genre">{{ anime.genre.join(' / ') }}</text>
          <text class="anime-desc" number-of-lines="3">{{ anime.description }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      animeList: [
        {
          id: 1,
          title: "进击的巨人",
          genre: ["动作", "奇幻", "冒险"],
          description: "人类为了生存与巨人展开殊死搏斗，揭开巨人背后的秘密。",
          cover: "../../../static/jvren.jpg"
        },
        {
          id: 2,
          title: "鬼灭之刃",
          genre: ["动作", "奇幻", "冒险"],
          description: "少年炭治郎为拯救妹妹踏上斩鬼之路，展开感人冒险。",
          cover: "../../../static/guimie.jpeg"
        },
        {
          id: 5,
          title: "恶搞之家",
          genre: ["搞笑", "剧情", "家庭"],
          description: "围绕格里芬一家展开的荒诞搞笑故事，充满讽刺与幽默。",
          cover: "../../../static/egao.png"
        },
        {
          id: 6,
          title: "瑞克和莫蒂",
          genre: ["科幻", "冒险", "喜剧"],
          description: "疯狂科学家瑞克和孙子莫蒂穿越宇宙，展开荒诞冒险。",
          cover: "../../../static/RAM.jpg"
        },
        {
          id: 4,
          title: "刀剑神域",
          genre: ["科幻", "冒险", "爱情"],
          description: "玩家被困虚拟现实游戏中，展开生死逃亡与爱情故事。",
          cover: "../../../static/daojian.jpg"
        }
      ],
      loading: false,
      page: 1
    };
  },
  methods: {
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/tabbar/Anime/animeDetail?id=${id}`
      });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
  color: #000000;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #000000;
}

.anime-list {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.anime-item {
  display: flex;
  margin: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  background-color: #fafafa;
  border-radius: 8px;
}

.anime-item:hover {
  box-shadow: 0 0 3px #003366;
  background-color: #f0f8ff;
}

.anime-cover {
  width: 120px;
  height: 170px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 15px;
  flex-shrink: 0;
  box-shadow: 0 0 5px #003366;
}

.anime-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.anime-title {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 6px;
}

.anime-genre {
  font-size: 14px;
  color: #555555;
  margin-bottom: 10px;
}

.anime-desc {
  font-size: 14px;
  color: #333333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer {
  margin-top: 20px;
  text-align: center;
}

.load-more-btn {
  background-color: #003366;
  color: #ffffff;
  border-radius: 25px;
  padding: 10px 40px;
  font-weight: 700;
  font-size: 16px;
  border: none;
  outline: none;
  transition: background-color 0.3s ease;
}

.load-more-btn:disabled {
  background-color: #001a33;
  opacity: 0.7;
}
</style>
