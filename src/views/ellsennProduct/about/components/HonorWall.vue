<template>
  <div class="honor-wall">
    <div class="content">
      <div class="top">
        <h2>荣誉墙</h2>
        <div class="honor-list-wrap">
          <img class="img-left" src="@/assets/img/about/honor-left.png" alt="" />
          <div class="honor-list">
            <button class="swiper-btn prev" @click="slidePrev">
              <i class="el-icon-arrow-left"></i>
            </button>
            <div class="swiper-container" ref="honorSwiper">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in honorList.list" :key="item.id">
                  <img :src="item.thumb" alt="" class="honor-img" />
                </div>
              </div>
            </div>
            <button class="swiper-btn next" @click="slideNext">
              <i class="el-icon-arrow-right"></i>
            </button>
          </div>
        </div>
        <div class="title-list">
          {{ honorList.list[currentIndex].title }}
        </div>
      </div>

      <div class="bottom">
        <h2>资质证书</h2>
        <div class="certificate-list">
          <div
            class="certificate-item"
            v-for="item in certificateList.list"
            :key="item.id"
          >
            <img :src="item.thumb" alt="" />
            <p>{{ item.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "HonorWall",
  data() {
    return {
      currentIndex: 0,
      honorList: [],
      certificateList: [],
      swiperInstance: null,
    };
  },
  mounted() {
    this.getHonorList();
  },
  methods: {
    getHonorList() {
      this.$api({
        url: "getCompanyHonorList",
        method: "get",
      }).then((res) => {
        this.honorList = res.data[0];
        this.certificateList = res.data[1];
        this.$nextTick(() => {
          this.initSwiper();
        });
      });
    },
    initSwiper() {
      if (this.swiperInstance) {
        this.swiperInstance.destroy(true, true);
      }
      this.swiperInstance = new Swiper(this.$refs.honorSwiper, {
        effect: "coverflow",
        grabCursor: false,
        centeredSlides: true,
        slidesPerView: 3,
        initialSlide: 1,
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 180,
          modifier: 2,
          slideShadows: false,
        },
        loop: true,
        allowTouchMove: false,
        on: {
          slideChange: () => {
            if (this.swiperInstance) {
              this.currentIndex = this.swiperInstance.realIndex;
            }
          },
        },
      });
    },
    slidePrev() {
      if (this.swiperInstance) {
        this.swiperInstance.slidePrev();
      }
    },
    slideNext() {
      if (this.swiperInstance) {
        this.swiperInstance.slideNext();
      }
    },
  },
};
</script>

<style scoped lang="less" src="./HonorWall.less"></style>
<style lang="less" scoped>
.swiper-wrapper {
  width: 870px;
}
.swiper-slide {
  // width: 308px !important;
  height: 416px !important;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.3s;
}
.swiper-btn {
  position: absolute;
  top: 50%;
  z-index: 10;
  width: 36px;
  height: 36px;
  background: #fff;
  border: none;
  border-radius: 50%;
  font-size: 28px;
  color: #333;
  cursor: pointer;
  transform: translateY(-50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 20px;
  }
}
.swiper-btn.prev {
  left: -50px;
}
.swiper-btn.next {
  right: -50px;
}
.swiper-btn:hover {
  background: #f0f0f0;
}
.honor-list {
  position: relative;
}
</style>
