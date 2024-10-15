<template>
  <div class="container">
    <div class="main">
      <breadcrumb :list="['首页', '商品分类']"> </breadcrumb>
      <div class="category-con" @click="handleItemClick">
        <ul class="row">
          <li :class="['row-li', { one: index === 0 }]" v-for="(item, index) in categoryList" :key="index">
            <span :class="{ 'row-li-text': index !== 0 }" :data-item="item">{{ item }}</span>
          </li>
        </ul>
        <ul class="row">
          <li :class="['row-li', { one: index === 0 }]" v-for="(item, index) in secondLevelCategory" :key="index">
            <span :class="{ 'row-li-text': index !== 0 }" :data-item="item">{{ item }}</span>
          </li>
          <div class="icon-wrap">
            <span class="all">全部</span>
            <img class="all-icon" src="../../assets/img/allCommodities/icon2.png" alt="icon" />
          </div>
        </ul>
        <ul class="row">
          <li :class="['row-li', { one: index === 0 }]" v-for="(item, index) in thirdLevelCategory" :key="index">
            <span :class="{ 'row-li-text': index !== 0 }" :data-item="item">{{ item }}</span>
          </li>
          <div class="icon-wrap">
            <span class="all">全部</span>
            <img class="all-icon" src="../../assets/img/allCommodities/icon2.png" alt="icon" />
          </div>
        </ul>
        <ul class="row">
          <li :class="[
            'filter-li-wrap',
            { one: index === 0 },
            { two: index === 1 },
          ]" v-for="(item, index) in filter" :key="index">
            <div :class="{ 'filter-li': index !== 0 }">
              <span :data-item="item">{{ item }}</span>
              <img v-if="index !== 0" class="icon" src="../../assets/img/allCommodities/icon3.png" alt="icon" />
            </div>
          </li>
        </ul>
        <ul class="last-row">
          <li class="one">当前筛选</li>
          <li class="li" v-for="item in selectFilterList" :key="item">
            {{ item }}
            <img class="closeIcon" src="../../assets/img/allCommodities/closeIcon.png" alt="icon"
              @click="close(item)" />
          </li>
        </ul>
      </div>
      <!--综合排序-->
      <div class="comprehensive-wrap">
        <div class="item">综合排序</div>
        <div class="item">人气排序</div>
        <div class="item">
          <div class="sort">
            <span class="sort-text">价格</span>
            <div class="icon-wrap">
              <img class="icon" src="../../assets/img/allCommodities/icon-top.png" alt="icon" />
              <img class="icon" src="../../assets/img/allCommodities/icon-bottom.png" alt="icon" />
            </div>
          </div>
        </div>
        <div class="item">
          <div class="sort">
            <span class="sort-text">销量排序</span>
            <div class="icon-wrap">
              <img class="icon" src="../../assets/img/allCommodities/icon-top.png" alt="icon" />
              <img class="icon" src="../../assets/img/allCommodities/icon-bottom.png" alt="icon" />
            </div>
          </div>
        </div>
      </div>
      <!--商品列表-->
      <div class="commodity-list" v-for="i in 4" :key="i">
        <div class="commodity-wrap" v-for="item in commodityList" :key="item.src">
          <div class="commodity-img-wrap" @click="onRouteTo('productDetail')">
            <img :src="item.imgSrc" alt="商品" />
          </div>
          <div class="desc-wrap">
            <div class="desc">{{ item.title }}</div>
            <div class="price">￥{{ item.price }}</div>
            <div class="bottom">
              <div class="text">
                <div class="text-img-wrap">
                  <img src="../../assets/img/allCommodities/icon4.png" alt="icon" />
                </div>
                加入对比
              </div>
              <div class="cart-wrap">
                <div class="cart-text">立即下单</div>
                <div class="img-wrap">
                  <img src="../../assets/img/allCommodities/cart.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--分页器-->
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumb";
import commodity1 from "../../assets/img/allCommodities/commodity1.png";
import commodity2 from "../../assets/img/allCommodities/commodity2.png";
import commodity3 from "../../assets/img/allCommodities/commodity3.png";
import commodity4 from "../../assets/img/allCommodities/commodity4.png";
import commodity5 from "../../assets/img/allCommodities/commodity5.png";

export default {
  name: "allCommodities",
  data() {
    return {
      selectFilterList: [],
      currentPage: 4,
    };
  },
  components: {
    breadcrumb
  },
  created() {
    this.categoryList = [
      "分类",
      "光学元件",
      "光机械件",
      "运动控制",
      "激光光源",
      "光纤&材料",
      "分析与测量",
      "系统&仪器",
    ];
    this.secondLevelCategory = [
      "二级分类",
      "透镜",
      "窗口片",
      "滤光片",
      "反射镜",
      "棱镜",
      "光栅",
      "分束镜",
    ];
    this.thirdLevelCategory = [
      "三级分类",
      "平凸透镜",
      "双凸透镜",
      "平凹透镜",
      "双凹透镜",
      "非球面透镜",
      "消色差透镜",
      "弯月透镜",
      "柱面透镜",
      "球形透镜",
    ];
    this.filter = ["筛选", "尺寸", "厚度", "镀膜", "材料"];
    this.commodityList = [
      {
        imgSrc: commodity1,
        title: "激光平面窗口片",
        price: 5.25,
      },
      {
        imgSrc: commodity2,
        title: "激光平面窗口片",
        price: 5.25,
      },
      {
        imgSrc: commodity3,
        title: "激光平面窗口片",
        price: 5.25,
      },
      {
        imgSrc: commodity4,
        title: "激光平面窗口片",
        price: 5.25,
      },
      {
        imgSrc: commodity5,
        title: "激光平面窗口片",
        price: 5.25,
      },
    ];
  },
  methods: {
    handleItemClick(event) {
      const target = event.target;
      if (target.tagName === "SPAN") {
        const item = target.getAttribute("data-item");
        if (!this.selectFilterList.includes(item)) {
          this.selectFilterList.push(item);
        }
      }
    },
    close(item) {
      const index = this.selectFilterList.indexOf(item);
      if (index !== -1) {
        this.selectFilterList.splice(index, 1);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    onRouteTo(name) {
      this.$router.push({ name });
    },
  },
};
</script>


<style lang="less" scoped>
.container {
  background: #f4f4f6;
}

.main {
  margin: 0 260px;
}

.category-con {
  background: #fff;
  border: 1px solid #dbdbdb;

  .row {
    position: relative;
    display: flex;
    align-items: center;
    color: #333333;
    border-bottom: 1px solid #dbdbdb;

    .row-li {
      width: 125px;
      height: 69px;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;


      &.one {
        width: 113px;
        background: #fafafa;
      }

      .row-li-text {
        cursor: pointer;
      }
    }

    .icon-wrap {
      position: absolute;
      right: 60px;
      cursor: pointer;

      .all {
        font-size: 14px;
        color: #27417c;
      }

      .all-icon {
        width: 15px;
        height: 8px;
        margin-left: 8px;
      }
    }

    .filter-li-wrap {
      width: 116px;
      height: 69px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #888888;

      &.one {
        width: 113px;
        background: #fafafa;
        color: #333333;
      }

      &.two {
        width: 139px;
      }

      .filter-li {
        width: 96px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f6f6f6;
        border-radius: 16px;
        cursor: pointer;

        .filter-li-text {
          cursor: pointer;
        }

        .icon {
          width: 12px;
          height: 6px;
          margin-left: 8px;
        }
      }
    }
  }

  .last-row {
    height: 66px;
    display: flex;
    align-items: center;

    .one {
      width: 113px;
      margin-right: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .li {
      height: 30px;
      padding: 2px 13px 7px;
      margin-right: 13px;
      font-size: 14px;
      color: #27417c;
      border-radius: 15px;
      border: 1px solid #27417c;
      background: #eaeef9;
      box-sizing: border-box;

      .closeIcon {
        width: 10px;
        height: 10px;
        cursor: pointer;
      }
    }
  }
}

.comprehensive-wrap {
  margin: 18px 0 24px;
  display: flex;
  border-radius: 8px;
  border: 1px solid #e1e2e5;
  background: #fff;

  .item {
    width: 126px;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333333;
    border-left: 1px solid #e1e2e5;

    .sort {
      display: flex;

      .sort-text {
        margin-right: 11px;
      }

      .icon-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;
        cursor: pointer;

        .icon {
          width: 9px;
          height: 6px;
        }
      }
    }
  }
}

.commodity-list {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  .commodity-wrap {
    width: 264px;
    display: flex;
    flex-direction: column;
    background: #fff;

    .commodity-img-wrap {
      width: 264px;
      height: 264px;
      box-sizing: border-box;
      border: 1px dashed #000;

      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }

    .desc-wrap {
      height: 143px;
      box-sizing: border-box;

      .desc {
        padding: 24px 0 13px 21px;
        color: #333333;
      }

      .price {
        padding-left: 21px;
        color: #ed2920;
        font-size: 18px;
      }

      .bottom {
        display: flex;
        align-items: center;
        padding: 21px 0 0 21px;

        .text {
          display: flex;
          color: #52565a;
          font-size: 14px;
          cursor: pointer;
          margin-right: 48px;

          .text-img-wrap {
            position: relative;
            top: 2px;
            width: 13px;
            height: 13px;
            margin-right: 3px;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }

        .cart-wrap {
          width: 109px;
          height: 32px;
          display: flex;
          align-items: center;
          background: #27417c;
          box-sizing: border-box;
          border-radius: 16px;

          .cart-text {
            margin: 0 10px 0 12px;
            color: #fff;
            font-size: 14px;
          }

          .img-wrap {
            width: 30px;
            height: 30px;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 25px;
  padding-bottom: 60px;
}
</style>