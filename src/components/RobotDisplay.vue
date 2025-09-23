<template>
  <div class="robot-display">
    <!-- 顶部Logo区域 -->
    <div class="display-header">
      <div class="logo-section">
        <div class="logo-text">DOBOT PHOENIX</div>
        <div class="logo-chinese">翼菲科技</div>
      </div>
    </div>

    <!-- 主展示区域 -->
    <div class="main-display">
      <div class="robot-container">
        <!-- 机器人3D模型展示区域 -->
        <div class="robot-model" :class="{ selected: true }">
          <div class="robot-3d">
            <!-- 机器人主体 -->
            <div class="robot-body">
              <!-- 机器人顶部 -->
              <div class="robot-top">
                <div class="robot-surface"></div>
              </div>
              
              <!-- 机器人侧面轮子 -->
              <div class="robot-wheel">
                <div class="wheel-rim"></div>
                <div class="wheel-spokes"></div>
              </div>
              
              <!-- 机器人前部传感器 -->
              <div class="robot-front">
                <!-- LED灯条 -->
                <div class="led-strips">
                  <div class="led-strip led-strip-1"></div>
                  <div class="led-strip led-strip-2"></div>
                </div>
                
                <!-- 中央传感器 -->
                <div class="central-sensor">
                  <div class="sensor-lens"></div>
                </div>
                
                <!-- 紧急停止按钮 -->
                <div class="emergency-button"></div>
              </div>
            </div>
          </div>
          
          <!-- 选择框指示器 -->
          <div class="selection-indicator"></div>
        </div>
        
        <!-- 全屏查看图标 -->
        <div class="fullscreen-icon" @click="toggleFullscreen">
          <div class="expand-arrows">
            <div class="arrow arrow-1"></div>
            <div class="arrow arrow-2"></div>
            <div class="arrow arrow-3"></div>
            <div class="arrow arrow-4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RobotDisplay',
  methods: {
    toggleFullscreen() {
      // 全屏查看功能
      this.$emit('toggle-fullscreen');
    }
  }
}
</script>

<style lang="less" scoped>
.robot-display {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(33, 150, 243, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.display-header {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 10;
}

.logo-section {
  .logo-text {
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 2px;
    margin-bottom: 5px;
  }

  .logo-chinese {
    font-size: 16px;
    color: #4CAF50;
    font-weight: 500;
  }
}

.main-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 80px 40px 40px;
}

.robot-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.robot-model {
  position: relative;
  width: 300px;
  height: 200px;
  transform-style: preserve-3d;
  transition: all 0.3s ease;

  &.selected {
    .selection-indicator {
      opacity: 1;
      animation: pulse 2s infinite;
    }
  }
}

.selection-indicator {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px dashed #ffffff;
  border-radius: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.robot-3d {
  width: 100%;
  height: 100%;
  position: relative;
  transform: perspective(800px) rotateY(-15deg) rotateX(5deg);
}

.robot-body {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  border-radius: 20px 20px 15px 15px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.robot-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}

.robot-surface {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  border-radius: 20px 20px 0 0;
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
    border-radius: 10px;
  }
}

.robot-wheel {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
}

.wheel-rim {
  width: 100%;
  height: 100%;
  border: 4px solid #ff9800;
  border-radius: 50%;
  position: relative;
  background: #333;
}

.wheel-spokes {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid #666;
  border-radius: 50%;
  background: #555;
}

.robot-front {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(135deg, #333 0%, #222 100%);
  border-radius: 0 0 15px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
}

.led-strips {
  display: flex;
  gap: 8px;
  margin-bottom: 5px;
}

.led-strip {
  width: 40px;
  height: 6px;
  background: #4CAF50;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.6);
  animation: led-glow 2s ease-in-out infinite alternate;
}

.led-strip-2 {
  animation-delay: 0.5s;
}

@keyframes led-glow {
  0% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
  }
  100% {
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.8);
  }
}

.central-sensor {
  width: 20px;
  height: 20px;
  background: #666;
  border-radius: 50%;
  position: relative;
  margin-bottom: 5px;
}

.sensor-lens {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(33, 150, 243, 0.5);
}

.emergency-button {
  width: 12px;
  height: 12px;
  background: #f44336;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(244, 67, 54, 0.5);
  animation: emergency-pulse 1.5s ease-in-out infinite;
}

@keyframes emergency-pulse {
  0%, 100% {
    box-shadow: 0 0 5px rgba(244, 67, 54, 0.3);
  }
  50% {
    box-shadow: 0 0 15px rgba(244, 67, 54, 0.8);
  }
}

.fullscreen-icon {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
}

.expand-arrows {
  position: relative;
  width: 20px;
  height: 20px;
}

.arrow {
  position: absolute;
  width: 6px;
  height: 6px;
  border: 2px solid #ffffff;
  border-bottom: none;
  border-right: none;
  transform: rotate(45deg);

  &.arrow-1 {
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
  }

  &.arrow-2 {
    right: 0;
    top: 50%;
    transform: translateY(-50%) rotate(135deg);
  }

  &.arrow-3 {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) rotate(225deg);
  }

  &.arrow-4 {
    left: 0;
    top: 50%;
    transform: translateY(-50%) rotate(315deg);
  }
}
</style>
