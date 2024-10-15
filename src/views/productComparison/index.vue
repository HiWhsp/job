<template>
  <div class="page">
    <div class="inner">
      <div class="title">产品对比</div>
      <div class="main">
        <div class="add">
          <div class="add-box">
            <div class="box-title">添加商品</div>
            <el-input
              placeholder="商品名称"
              v-model="input3"
              class="input-with-btn"
            >
              <div slot="append" class="append">添加</div>
            </el-input>
          </div>
          <div
            class="table-item-wrap"
            :class="index % 2 === 0 ? '' : 'odd'"
            v-for="(item, index) in 20"
            :key="index"
          >
            <div class="item-name">中心波长</div>
          </div>
        </div>
        <div class="item" v-for="(item, index) in 5" :key="index">
          <div class="item-desc-wrap">
            <div class="close-icon-wrap">
              <img src="@/assets/img/productComparison/close.png" alt="" />
            </div>
            <div class="product-wrap">
              <div class="product-img-wrap">
                <img src="@/assets/img/productComparison/img1.png" alt="" />
              </div>
              <div class="product-desc-wrap">
                <div class="product-name">激光平面窗口片名称位置</div>
              </div>
            </div>
            <div class="price-wrap">￥5000.00</div>
            <div class="buy-wrap">
              <el-input-number
                v-model="numberVModel"
                placeholder="string"
                size="mini"
              ></el-input-number>
              <div class="buy">购买</div>
            </div>
            <div class="collect-wrap">
              <div class="collect-icon-wrap">
                <img
                  src="@/assets/img/productComparison/collect.png"
                  alt="collect"
                />
              </div>
              <div class="collect-text">收藏</div>
            </div>
          </div>
          <div
            class="table-item-wrap"
            :class="index % 2 === 0 ? 'even' : 'odd'"
            v-for="(item, index) in 20"
            :key="index"
          >
            1064nm
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input3: "",
      numberVModel: 0,
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
::v-deep .el-input-group__append {
  width: 55px;
  padding: 0;
  border: 0;
}

.page {
  background: #f4f4f6;
  padding: 33px 260px 50px;
}

.inner {
  padding: 29px 0 46px;
  background: #fff;
  box-sizing: border-box;
}

.title {
  margin-bottom: 48px;
  font-weight: bold;
  font-size: 36px;
  color: #333333;
  text-align: center;
}

.main {
  width: 1351px;
  margin: 0 auto;
  display: flex;
  box-sizing: border-box;
  border: 1px solid #bec1c4;
  border-right: none;
  .add {
    width: 225px;
    box-sizing: border-box;
    border-right: 1px solid #bec1c4;
    .add-box {
      height: 220px;
      padding: 70px 0 0 26px;
      ::v-deep .el-input__inner {
        height: 32px;
        box-sizing: border-box;
      }
      .box-title {
        margin-bottom: 13px;
        font-size: 16px;
        color: #000000;
        line-height: 20px;
      }
      .input-with-btn {
        width: 177px;
        margin-right: 23px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #b8c4d1;
        .append {
          width: 55px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          background: #27417c;
          border-radius: 0px 4px 4px 0px;
          font-size: 14px;
          color: #ffffff;
          cursor: pointer;
        }
      }
    }
  }
  .item {
    width: 225px;
    box-sizing: border-box;
    .item-desc-wrap {
      position: relative;
      height: 220px;
      border-right: 1px solid #bec1c4;
      padding-left: 20px;
      .close-icon-wrap {
        position: absolute;
        top: 8px;
        right: 10px;
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
      .product-wrap {
        display: flex;
        padding: 33px 24px 13px 0;
        .product-img-wrap {
          flex-shrink: 0;
          width: 55px;
          height: 55px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .product-desc-wrap {
          margin-left: 14px;
          width: 112px;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          line-height: 24px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
      .price-wrap {
        margin-top: 13px;
        font-weight: bold;
        font-size: 16px;
        color: #ed2920;
        line-height: 24px;
      }
      .buy-wrap {
        display: flex;
        height: 24px;
        line-height: 24px;
        .buy {
          width: 55px;
          height: 24px;
          margin-left: 14px;
          background: #27417c;
          font-size: 14px;
          color: #ffffff;
          text-align: center;
          line-height: 24px;
          cursor: pointer;
        }
      }
      .collect-wrap {
        width: 71px;
        height: 25px;
        display: flex;
        align-items: center;
        margin: 21px 0 0 0;
        padding: 0 9px 0 12px;
        background: #fffcfb;
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #fbb98d;
        cursor: pointer;
        .collect-icon-wrap {
          width: 13px;
          height: 13px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .collect-text {
          margin-left: 3px;
          font-weight: 400;
          font-size: 14px;
          color: #ff7b23;
          line-height: 18px;
        }
      }
    }
  }
  .table-item-wrap {
    height: 50px;
    line-height: 50px;
    padding-left: 25px;
    border-top: 1px solid #bec1c4;
    border-bottom: 1px solid #bec1c4;
    border-right: 1px solid #bec1c4;
    font-weight: 400;
    font-size: 16px;
    color: #333333;
    background: #f4f4f6;
    &.odd {
      background: #fff;
    }
  }
}
</style>