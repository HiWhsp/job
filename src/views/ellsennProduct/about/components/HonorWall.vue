<template>
  <div class="honor-wall">
    <div class="content">
      <div class="top">
        <h2>荣誉墙</h2>
        <div class="honor-list-wrap">
          <img class="img-left" src="@/assets/img/about/honor-left.png" alt="" />
          <div class="honor-list">
            <el-carousel
              :interval="5500000000"
              type="card"
              height="416px"
              indicator-position="none"
              @change="handleChange"
            >
              <el-carousel-item v-for="item in honorList.list" :key="item.id">
                <img :src="item.thumb" alt="" class="honor-img" />
              </el-carousel-item>
            </el-carousel>
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
      });
    },
    handleChange(index) {
      this.currentIndex = index;
    },
  },
};
</script>

<style scoped lang="less" src="./HonorWall.less"></style>
