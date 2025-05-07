<script>
export default {
  name: "video-viewer"
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
      <div class="menu">
        <div class="index">
          章节1
          <div class="index-collapse">
            课时
          </div>
        </div>
        <div class="line">
          <div class="line-inner">1</div>
        </div>
        <div class="text">第一节: 标题名称标题名称标题名称标题名称标题名称</div>
      </div>
      <div class="content">
      </div>
    </div>
    <div class="right">
      <div class="tit-info">
        <p class="title">现代教育技术应用 提高教学效果</p>
        <p class="text">课时：26 发布时间：2025-01-02</p>
      </div>
      <div class="menu-right">
        <p>目录</p>
      </div>
      <div class="menu-list">
        <div class="col"></div>
        <div class="menu">
          <div class="menu-item active">
            <p class="index">第一节</p>
            <div class="line"></div>
            <div class="text">
              <p class="title ellipsis-1">标题名称标题名称标题名称...</p>
              <p class="time">
                <img src="@/static/common/video.png" alt="">
                <span>08:52</span>
              </p>
            </div>
          </div>
          <div class="menu-item">
            <p class="index">第二节</p>
            <div class="line"></div>
            <div class="text">
              <p class="title ellipsis-1">标题名称标题名称标题名称...</p>
              <p class="time">
                <img src="@/static/common/video.png" alt="">
                <span>08:52</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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

  .menu {
    display: flex;
    align-items: center;
    position: absolute;
    top: 50px;
    left: 25px;

    .index {
      display: flex;
      justify-content: space-between;
      padding-left: 15px;
      width: 115px;
      height: 20px;
      line-height: 20px;
      background: #D8D8D8;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #3D3D3D;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;

      .index-collapse {
        width: 59px;
        line-height: 20px;
        background: #161616;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        text-align: center;
        color: #D6D6D6;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
      }
    }

    .line {
      width: 28px;
      height: 28px;
      background: #BEA069;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-left: -10px;

      .line-inner {
        width: 22px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background: #175E3D;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #FFFFFF;
        border-radius: 50%;
      }
    }

    .text {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #FFFFFF;
      margin-left: 20px;
    }
  }

  .content {
    position: absolute;
    top: 110px;
    left: 25px;
    width: 1532px;
    height: 760px;
    background: #ECECEC;
  }
}

.right {
  width: 348px;
  height: 100%;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;

  .tit-info {
    width: 348px;
    height: 109px;
    background: #D5DDE6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 20px;


    .title {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #1F253B;
    }

    .text {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #676767;
      margin-top: 20px;
    }
  }

  .menu-right {
    width: 348px;
    height: 44px;
    background: #EFF3F7;
    line-height: 42px;
    padding-left: 20px;

    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 16px;
    color: @theme;

    p {
      width: 32px;
      border-bottom: 3px solid @theme;
    }
  }

  .menu-list {
    flex: 1;
    position: relative;

    .col {
      position: absolute;
      width: 1px;
      height: 100%;
      background: #D8D8D8;
      left: 59px;
    }

    .menu {
      position: relative;
      flex: 1;
      margin-top: 27px;
      margin-left: 13px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      margin-bottom: 27px;

      .index {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #999FA4;
      }

      .line {
        width: 15px;
        height: 15px;
        background: #FFFFFF;
        border: 1px solid #D3D3D3;
        border-radius: 50%;
        margin: 0 10px 0 3px;
      }

      .text {
        display: flex;
        justify-content: space-between;
        width: 260px;
        height: 18px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #3D3D3D;

        .title {
          width: 200px;
        }

        .time {
          display: flex;
          align-items: center;

          img {
            width: 16px;
            height: 16px;
            margin-right: 5px;
          }
        }
      }

      &.active {
        .index {
          color: @theme;
        }

        .line {
          background-color: @theme;
        }

        .text {
          color: @theme;
        }
      }
    }
  }
}
</style>
