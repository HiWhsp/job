<script>
export default {
  name: "fastQuotation",
  data() {
    return {
      visible: false,
      activeName: 'first',
      list: [1, 2, 3]
    }
  },
  methods: {
    handleClick() {

    }
  }
}
</script>

<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="prod-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部产品" name="first">
          <div class="batch-input">
            <div class="virtual-list">
              <div class="batch-title-box">
                <div class="left-box">
                  产品信息录入
                </div>
                <div class="right-box box-size">
                  匹配结果展示
                </div>
              </div>
              <div class="batch-input-header">
                <div class="left-box">
                  <el-row :gutter="24">
                    <el-col :span="3">
                      <div class="item-col-check item table-cell-left-width">
                        <el-checkbox></el-checkbox>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="item">
                        我的需求
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="item">
                        购买数量
                      </div>
                    </el-col>
                    <el-col :span="3">
                      <div class="item">
                        附件
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="right-box">
                  <el-row :gutter="24">
                    <el-col :span="3">
                      <div class="item left-spilt">结果</div>
                    </el-col>
                    <el-col :span="8">
                      <div class="item">推荐匹配商品</div>
                    </el-col>
                    <el-col :span="4">
                      <div class="item">操作</div>
                    </el-col>
                    <el-col :span="3">
                      <div class="item">库存/交期</div>
                    </el-col>
                    <el-col :span="3">
                      <div class="item">单价/含税</div>
                    </el-col>
                    <el-col :span="3">
                      <div class="item">小计/含税</div>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="infinite-list-container">
                <div class="infinite-list" v-for="(item, index) in list" :key="index">
                  <div class="left-box">
                    <el-row :gutter="24">
                      <el-col :span="3">
                        <div class="item-col-check item table-cell-left-width">
                          <div>
                            <el-checkbox></el-checkbox>
                            <span style="margin-left: 14px;">{{ index + 1 }}</span>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="item">
                          <div class="flex">
                            <label for="">我的型号：</label>
                            <el-input placeholder="请输入内容"></el-input>
                          </div>
                          <div class="flex">
                            <label for="">我的型号：</label>
                            <el-input placeholder="请输入内容"></el-input>
                          </div>
                          <div class="flex">
                            <label for="">我的型号：</label>
                            <el-input placeholder="请输入内容"></el-input>
                          </div>
                          <div class="flex">
                            <label for="">我的型号：</label>
                            <el-input placeholder="请输入内容"></el-input>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div class="item number-item">
                          <el-input type="number"
                                    placeholder="请输入内容"></el-input>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="item file-item">
                          <!--                          <el-upload class="upload-demo">-->
                          <!--                            <span style="color: #A66600;">上传</span>-->
                          <!--                          </el-upload>-->
                          <el-popover
                              placement="top"
                              width="55"
                              trigger="click"
                          >
                            <div class="flex flex-center pointer">
                              <div class="">del</div>
                              <div style="margin-left: 15px;">down</div>
                            </div>
                            <span slot="reference" style="color: #A66600;">上传</span>
                          </el-popover>
                        </div>
                        <div class="delete-item">
                          <el-popover
                              placement="top"
                              width="160"
                              v-model="visible">
                            <p>确定删除吗？</p>
                            <div style="text-align: right; margin: 0">
                              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                              <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
                            </div>
                            <span slot="reference">删除</span>
                          </el-popover>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="right-box">
                    <el-row :gutter="24">
                      <el-col :span="3">
                        <div class="item textCenter">未匹配</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="item  prod-info">
                          <img src="../../static/home/promation-img.png" alt="">
                          <div class="info">
                            <p class="title ellipsis-1">FUS-U30系列28电机 本体宽30mm</p>
                            <p class="desc ellipsis-2">
                              型号：28电机*梯形丝杆导程0802*行程50mm(FUS-U30-B28-L0802-T050)</p>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="item">相似型号</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="item">
                          <p class="static">需订货</p>
                          <p class="fahuo">7天内发货</p>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="item">
                          $764.22
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="item">
                          $764.22
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已报价产品" name="second">已报价产品</el-tab-pane>
        <el-tab-pane label="需询价产品" name="third">需询价产品</el-tab-pane>
      </el-tabs>
    </div>
    <div class="footer-sticky flex flex-between">
      <div class="left-box flex">
        <div class="select">
          <el-checkbox></el-checkbox>
          <span>全选</span>
        </div>
        <div class="add-num flex">
          <p>新增</p>
          <el-input type="number"></el-input>
          <p>条</p>
          <div class="pointer submit">确定</div>
        </div>
        <div class="btn">
          <div class="btn-item">点击上传BOM文件</div>
          <div class="btn-item">下载BOM模版</div>
        </div>
      </div>
      <div class="right-box">
        <el-checkbox></el-checkbox>
        <span>我同意并已知晓</span>
        <span class="batch-input-footer-protocol">《保密协议》</span>
        <el-button>去询价</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.page {
  width: 100%;
  padding: 20px 30px
}

.prod-wrap {
  height: 910px;
  background: #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  margin-top: 20px;
  padding: 19px 22px;
}

.batch-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin-bottom: 64px;
  height: 840px;

  .virtual-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 1352px;
    overflow-x: hidden;
    padding-bottom: 10px;
  }

  .virtual-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 1352px;
    overflow-x: hidden;
    padding-bottom: 10px;

    .batch-title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      color: #333;
      background-color: #F6F5F4;
      height: 44px;
      min-width: 1350px;
      box-sizing: border-box;
      font-weight: 600;
      padding: 0 4px;


      .left-box {
        min-width: 736px;
        height: 100%;
        line-height: 44px;
        text-align: center;
      }

      .right-box {
        min-width: 1084px;
        height: 100%;
        line-height: 44px;
        text-align: center;
        border-left: 1px dashed #A66600;
      }
    }

    .batch-input-header {
      min-width: 1350px;
      display: flex;
      justify-content: space-between;
      height: 40px;
      color: #333;
      background: #F6F5F4;
      line-height: 40px;
      border-top: 1px solid #D4D4D4;
      padding: 0 4px;


      .el-row {
        margin: 0 !important;
      }

      .left-box {
        width: 736px;
      }

      .right-box {
        width: 1084px;
        border-left: 1px dashed #A66600;

        .left-spilt {
          text-align: center;
        }

      }
    }

    .infinite-list-container {
      overflow-x: hidden !important;
      flex: 1;
      padding: 0 4px;

      .el-row {
        margin: 0 !important;
      }


      .infinite-list {
        height: 160px;
        background: #FFFFFF;
        border: 1px solid #D4D4D4;
        display: flex;
        cursor: pointer;
        border-top-color: #fff;
        border-right-color: #fff;
        border-left-color: #fff;

        .item {
          height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          label {
            width: 100px;
          }

          /deep/ .el-input__inner {
            height: 35px;
            border: none;
          }
        }

        .number-item {
          /deep/ .el-input__inner {
            //height: 30px;
            border: 1px solid #E6E4E1;
            border-radius: 2px 2px 2px 2px;
          }
        }

        .delete-item {
          display: none;
          position: absolute;
          top: 10px;
          right: 15px;
        }

        .left-box {
          width: 736px;
          height: 160px;
        }

        .right-box {
          width: 1084px;
          height: 100%;
          border-left: 1px dashed #A66600;

          .textCenter {
            text-align: center;
          }

          .prod-info {
            display: flex;
            flex-direction: row;
            align-items: center;

            img {
              width: 98px;
              height: 98px;
            }

            .info {
              margin-left: 20px;

              .title {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 14px;
                color: #333333;
                font-style: normal;
                text-transform: none;
              }

              .desc {
                margin-top: 10px;
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 12px;
                color: #77797B;
                font-style: normal;
                text-transform: none;
              }
            }
          }
        }
      }

      .infinite-list:hover {
        position: relative;
        box-shadow: 0px 0 10px 1px rgba(84, 98, 108, .06);
        z-index: 999;
        border: 1px solid hsla(0, 0%, 100%, 0);
        .delete-item {
          display: block;
        }
      }
    }
  }
}

.footer-sticky {
  position: fixed;
  left: 0;
  bottom: 0;
  border-top: 1px solid rgba(0, 0, 0, .06);
  width: 100%;
  height: 93px;
  background: #FFFFFF;
  box-shadow: 0px 0 10px 1px rgba(0, 0, 0, 0.16);
  border-radius: 0px 0px 0px 0px;
  z-index: 999;
  padding: 23px 52px;

  .select {
    span {
      margin-left: 10px;
    }
  }

  .add-num {
    width: 264px;
    height: 49px;
    background: #E6E4E1;
    border-radius: 4px 4px 4px 4px;
    margin-left: 77px;

    p {
      width: 40px;
      text-align: center;
    }

    .submit {
      width: 50px;
      height: 30px;
      background: #A66600;
      border-radius: 2px 2px 2px 2px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 30px;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }

    .el-input {
      width: 95px;
    }

    /deep/ .el-input__inner {
      width: 95px;
      height: 30px;
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #E6E4E1;
    }
  }

  .btn {
    display: flex;
    margin-left: 24px;

    .btn-item {
      height: 30px;
      padding: 0 12px;
      line-height: 30px;
      text-align: center;
      background: #FFFFFF;
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #E6E4E1;
      margin-right: 14px;

      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      font-style: normal;
      text-transform: none;
    }
  }

  .right-box {
    cursor: pointer;

    span {
      margin-left: 5px;
    }

    .batch-input-footer-protocol {
      color: #A66600;
    }

    .el-button {
      margin-left: 22px;
      width: 191px;
      height: 46px;
      background: #A66600;
      border-radius: 4px 4px 4px 4px;
      color: #fff;
    }
  }
}
</style>
