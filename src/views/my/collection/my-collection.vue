<template>
  <div class="page">
    <div class="main-title">
      <span>我的收藏</span>
    </div>

    <div class="page-ctx">
      <div class="collection-list">
        <div class="collection-item" v-for="item in 10" :key="item">
          <div class="collection-item-img">
            <img src="" alt="" />
            <div class="collect-icon" @click="collect(item)">
              <img src="@/assets/img/my/collect.png" alt="" />
            </div>
          </div>
          <div class="collection-item-info">激光平面窗口片</div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>


export default {
  name: "feedback",
  components: {},
  data() {
    return {};
  },
  watch: {},
  created() {},
  methods: {
    collect(item) {
      console.log(item);
    },
  },
};
</script>
  
  
<style scoped lang="less">
.page {
  padding: 0;

  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }
}

.page-ctx {
  margin-top: 24px;
  padding: 17px 0 38px 20px;
  background: #fff;
}

.collection-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  .collection-item {
    width: 264px;
    height: 335px;
    background: #ffffff;
    box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.12);
    border-radius: 8px 8px 8px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .collection-item-img {
      position: relative;
      width: 100%;
      height: 264px;
      img {
        width: 100%;
        height: 100%;
      }
      .collect-icon {
        position: absolute;
        top: 17px;
        right: 11px;
        width: 33px;
        height: 33px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .collection-item-info {
      height: 71px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }
  }
}
</style>
  