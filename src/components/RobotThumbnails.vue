<template>
  <div class="robot-thumbnails">
    <div class="thumbnails-container">
      <div 
        v-for="(thumbnail, index) in thumbnails" 
        :key="index"
        :class="['thumbnail-item', { active: selectedThumbnail === index }]"
        @click="selectThumbnail(index)"
      >
        <div class="thumbnail-robot">
          <!-- 缩略图机器人模型 -->
          <div class="mini-robot" :style="{ transform: thumbnail.transform }">
            <img :src="thumbnail.image" alt="robot" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RobotThumbnails',
  data() {
    return {
      selectedThumbnail: 0,
      thumbnails: [
        {
          id: 0,
          name: '正面视图',
          image: require("@/assets/img/common/22-全屏.png"),
          angle: 'front'
        },
        {
          id: 1,
          name: '侧面视图',
          image: require("@/assets/img/common/23-全屏.png"),
          angle: 'side'
        },
        {
          id: 2,
          name: '背面视图',
          image: require("@/assets/img/common/24-全屏.png"),
          angle: 'back'
        },
        {
          id: 3,
          name: '俯视图',
          image: require("@/assets/img/common/25-全屏.png"),
          angle: 'top'
        }
      ]
    }
  },
  mounted() {
    // 组件挂载时自动选中第一项并触发事件
    this.$emit('thumbnail-change', this.thumbnails[0]);
  },
  methods: {
    selectThumbnail(index) {
      this.selectedThumbnail = index;
      this.$emit('thumbnail-change', this.thumbnails[index]);
    }
  }
}
</script>

<style lang="less" scoped>
.robot-thumbnails {
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
  z-index: 10;
}

.thumbnails-container {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
}

.thumbnail-item {
  width: 80px;
  height: 60px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.05);
  }

  &.active {
    .thumbnail-robot {
      border: 2px solid #ffffff;
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
    }
  }
}

.thumbnail-robot {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.mini-robot {
  width: 50px;
  height: 30px;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
