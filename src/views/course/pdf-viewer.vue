<script>
export default {
  name: "pdf-viewer"
}
</script>

<template>
  <div class="wrap">
    <div class="left">
      <div class="arrow">
        <div class="arrow-top">
          <img alt="" src="@/static/common/arrow-top.png">
        </div>
        <div class="col"></div>
        <div class="arrow-bottom">
          <img alt="" src="@/static/common/arrow-bottom.png">
        </div>
      </div>
      <div class="next-btn">
        <img alt="" src="@/static/common/arrow-left.png">
        <span>返回课程详情</span>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<style lang="less" scoped>
.wrap {
  display: flex;
  height: 100vh;
}

.left {
  position: relative;
  height: 100%;
  flex: 1;
  background-color: #424246;

  .arrow {
    position: absolute;
    left: 118px;
    width: 50px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .arrow-top, .arrow-bottom {
      cursor: pointer;
      width: 50px;
      height: 26px;
      background: #545662;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
      text-align: center;

      img {
        width: 24px;
        height: 24px;
      }
    }

    .col {
      height: 100%;
      width: 4px;
      background: #D8D8D8;
    }
  }

  .next-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 102px;
    height: 24px;
    background: #D8D8D8;
    margin-top: 15px;

    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #3D3D3D;
    img {
      width: 14px;
      height: 14px;
    }
  }
}

.right {
  width: 348px;
  height: 100%;
  background: #FFFFFF;
}
</style>
