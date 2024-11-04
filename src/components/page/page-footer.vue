<template>
    <div class="container">
        <div class="main info">
            <div class="item1">
                <p class="tit">
                    <i></i>
                    <span>0592-2882590</span>
                </p>
                <div class="e-richText">
                    <p>
                        <span>电话： 13599519926(微信同号）</span>
                    </p>
                    <p>
                        <span>邮箱：chueh@xmu.edu.cn;</span>
                    </p>
                    <p>
                        <span>wangwb@xmu.edu.cn</span>
                    </p>
                    <p>
                        <span>地址：厦门大学翔安校区能源材料大楼3号楼3309</span>
                    </p>
                </div>
            </div>
            <div class="item2">
                <div class="tit">
                    <p>友情链接</p>
                </div>
                <div class="link">
                    <span>嘉庚创新实验室</span>
                    <span>厦门大学</span>
                    <span>厦门市科学技术局</span>
                    <span>福建省科技厅</span>
                </div>
            </div>
            <div class="item3">
                <div class="tit">
                    <p>订阅我们，获取更多行业动态</p>
                </div>
                <div class="content">
                    <div class="input-group">
                        <el-input placeholder="请输入您的邮箱"></el-input>
                        <div class="formItem">

                        </div>
                    </div>
                    <div class="websiteShare">
                        <a href="#">
                            <img src="@/assets/img/base/Share/share-weibo.png" alt="">
                        </a>
                        <a href="#">
                            <img src="@/assets/img/base/Share/share-wechat.png" alt="">
                        </a>
                        <a href="#">
                            <img src="@/assets/img/base/Share/share-qq.png" alt="">
                        </a>
                        <a href="#">
                            <img src="@/assets/img/base/Share/share-qzone.png" alt="">
                        </a>
                        <a href="#">
                            <img src="@/assets/img/base/Share/share-copyLink.png" alt="">
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="cbox">
            <div class="main">
                Copyright ©嘉析检测技术服务（ 厦门） 有限公司 闽ICP备2022011529号-1
            </div>
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.container {
  background-color: rgba(16, 35, 62, 1);

  .main {
    width: 1400px;
    margin: 0 auto;
  }

  .info {
    height: 335px;
    padding: 50px 0;
    display: flex;
    justify-content: space-between;

    .item1 {
      .tit {
        display: flex;
        align-items: center;

        i {
          display: inline-block;
          width: 50px;
          height: 50px;
          background: #fff;
          border-radius: 50%;
          margin-right: 10px;
        }

        span {
          font-size: 40px;
          font-family: 'Oswald', sans-serif;
          font-weight: 400;
          color: #fff;
          display: inline-block;
        }
      }

      .e-richText {
        margin-top: 20px;

        p {
          width: 350px;

          span {
            font-size: 16px;
            color: #fff;
            line-height: 36px;
          }
        }
      }
    }

    .item2 {
      .tit {
        p {
          font-size: 20px;
          color: #fff;
          font-weight: 600;

          &:after {
            content: '';
            margin: 20px 0;
            width: 30px;
            background: @theme;
            display: block;
            height: 2px;
          }
        }
      }

      .link {
        width: 300px;
        margin-top: 20px;

        span {
          cursor: pointer;
          display: inline-block;
          margin-right: 20px;
          font-size: 16px;
          color: #fff;
          line-height: 36px;
        }
      }
    }

    .item3 {
      .tit {
        p {
          font-size: 20px;
          color: #fff;
          font-weight: 400;
        }
      }

      .content {
        margin-top: 20px;

        .input-group {
          display: flex;

          .el-input {
            width: 300px;
            height: 46px;
          }

          /deep/ .el-input__inner {
            width: 300px;
            height: 46px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
          }

          .formItem {
            text-align: center;
            width: 80px;
            border-radius: 0;
            padding: 0;
            line-height: 46px;
            height: 46px;
            border: none;
            background: @theme;
            font-size: 20px;
            color: #fff;
          }
        }

        .websiteShare {
          margin-top: 20px;
            text-align: right;

          a {
            height: 100%;
            display: inline-block;
            margin-right: 10px;
          }

          img {
            width: 30px;
            filter: grayscale(1);
            transition: all 0.5s;
          }

          img:hover {
            filter: grayscale(0);
          }
        }
      }
    }
  }

  .cbox {
    background: #00479d;
    height: 65px;
    line-height: 65px;
    color: #fff;
    font-size: 14px;
  }
}
</style>
