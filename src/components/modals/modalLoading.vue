<template>
  <!-- <div class="modal-loading-wrap" :class="{ shown: show }">
    <div class="modal-loading-inner">
      <img src="@img/loading.gif" alt="" class="loading-img" />
    </div>
  </div> -->

  <div class="w-loading-wrap">
    <div class="w-loading-box" :class="{ shown: show }">
      <div id="w-loading">
        <div class="w-spinner">
          <div class="w-spinner-container w-container1">
            <div class="w-circle1"></div>
            <div class="w-circle2"></div>
            <div class="w-circle3"></div>
            <div class="w-circle4"></div>
          </div>
          <div class="w-spinner-container w-container2">
            <div class="w-circle1"></div>
            <div class="w-circle2"></div>
            <div class="w-circle3"></div>
            <div class="w-circle4"></div>
          </div>
          <div class="w-spinner-container w-container3">
            <div class="w-circle1"></div>
            <div class="w-circle2"></div>
            <div class="w-circle3"></div>
            <div class="w-circle4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "modal-loading",

  data() {
    return {
      show: false,
    };
  },

  watch: {},

  methods: {
    init() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
.modal-loading-wrap {
  z-index: 1000000;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.5);
  .flex-center();

  // display: none;
  &.shown {
    display: flex;
  }

  .modal-loading-inner {
    .loading-img {
      width: 500px;
    }
  }
}

/*loading 开始*/
.w-loading-box {
  display: none;

  &.shown {
    display: block;
  }
}

#w-loading {
  display: block;
  position: absolute;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: white;
  background: #5fc4d6;
  background: rgba(0, 0, 0, 0.7);
  font-size: 1em;
  text-align: center;
  overflow: hidden;
  z-index: 9999;
}

.w-spinner {
  margin: 0 auto;
  width: 60px;
  height: 60px;
  position: relative;
  top: 40%;
}

.w-container1 > div,
.w-container2 > div,
.w-container3 > div {
  width: 15px;
  height: 15px;
  background-color: #fff;
  background-color: @theme;
  border-radius: 100%;
  position: absolute;
  -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
  animation: bouncedelay 1.2s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.w-spinner .w-spinner-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.w-container2 {
  -webkit-transform: rotateZ(45deg);
  transform: rotateZ(45deg);
}

.w-container3 {
  -webkit-transform: rotateZ(90deg);
  transform: rotateZ(90deg);
}

.w-circle1 {
  top: 0;
  left: 0;
}

.w-circle2 {
  top: 0;
  right: 0;
}

.w-circle3 {
  right: 0;
  bottom: 0;
}

.w-circle4 {
  left: 0;
  bottom: 0;
}

.w-container2 .w-circle1 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.w-container3 .w-circle1 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.w-container1 .w-circle2 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.w-container2 .w-circle2 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

.w-container3 .w-circle2 {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}

.w-container1 .w-circle3 {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}

.w-container2 .w-circle3 {
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}

.w-container3 .w-circle3 {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}

.w-container1 .w-circle4 {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}

.w-container2 .w-circle4 {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}

.w-container3 .w-circle4 {
  -webkit-animation-delay: -0.1s;
  animation-delay: -0.1s;
}

@-webkit-keyframes bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }

  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes bouncedelay {
  0%,
  80%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }

  40% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}

/*loading 结束*/

@media screen and (max-width: 1199px) {
  .w-spinner {
    margin: 0 auto;
    width: 40px;
    height: 40px;
    position: relative;
    top: 40%;
  }

  .w-container1 > div,
  .w-container2 > div,
  .w-container3 > div {
    width: 10px;
    height: 10px;
    background-color: #fff;
    background-color: @theme;
    border-radius: 100%;
    position: absolute;
    -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
    animation: bouncedelay 1.2s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
}

//
</style>
