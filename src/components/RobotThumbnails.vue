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
            <!-- 机器人主体 -->
            <div class="mini-robot-body">
              <!-- 机器人顶部 -->
              <div class="mini-robot-top">
                <div class="mini-robot-surface"></div>
              </div>
              
              <!-- 机器人侧面轮子 -->
              <div class="mini-robot-wheel">
                <div class="mini-wheel-rim"></div>
              </div>
              
              <!-- 机器人前部传感器 -->
              <div class="mini-robot-front">
                <!-- LED灯条 -->
                <div class="mini-led-strips">
                  <div class="mini-led-strip"></div>
                  <div class="mini-led-strip"></div>
                </div>
                
                <!-- 中央传感器 -->
                <div class="mini-central-sensor">
                  <div class="mini-sensor-lens"></div>
                </div>
                
                <!-- 紧急停止按钮 -->
                <div class="mini-emergency-button"></div>
              </div>
            </div>
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
          transform: 'rotateY(0deg) rotateX(0deg)',
          angle: 'front'
        },
        {
          id: 1,
          name: '侧面视图',
          transform: 'rotateY(-45deg) rotateX(0deg)',
          angle: 'side'
        },
        {
          id: 2,
          name: '背面视图',
          transform: 'rotateY(180deg) rotateX(0deg)',
          angle: 'back'
        },
        {
          id: 3,
          name: '俯视图',
          transform: 'rotateY(0deg) rotateX(-30deg)',
          angle: 'top'
        }
      ]
    }
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
}

.mini-robot-body {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  border-radius: 8px 8px 6px 6px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.mini-robot-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.mini-robot-surface {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  border-radius: 8px 8px 0 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 60%;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, transparent 100%);
    border-radius: 4px;
  }
}

.mini-robot-wheel {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
}

.mini-wheel-rim {
  width: 100%;
  height: 100%;
  border: 2px solid #ff9800;
  border-radius: 50%;
  background: #333;
}

.mini-robot-front {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(135deg, #333 0%, #222 100%);
  border-radius: 0 0 6px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 2px;
}

.mini-led-strips {
  display: flex;
  gap: 2px;
  margin-bottom: 2px;
}

.mini-led-strip {
  width: 12px;
  height: 2px;
  background: #4CAF50;
  border-radius: 1px;
  box-shadow: 0 0 3px rgba(76, 175, 80, 0.6);
}

.mini-central-sensor {
  width: 6px;
  height: 6px;
  background: #666;
  border-radius: 50%;
  position: relative;
  margin-bottom: 2px;
}

.mini-sensor-lens {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(33, 150, 243, 0.5);
}

.mini-emergency-button {
  width: 4px;
  height: 4px;
  background: #f44336;
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(244, 67, 54, 0.5);
}

// 响应式设计
@media screen and (max-width: 768px) {
  .robot-thumbnails {
    bottom: 20px;
    left: 20px;
    right: 20px;
  }

  .thumbnails-container {
    gap: 10px;
  }

  .thumbnail-item {
    width: 60px;
    height: 45px;
  }

  .mini-robot {
    width: 35px;
    height: 22px;
  }
}
</style>
