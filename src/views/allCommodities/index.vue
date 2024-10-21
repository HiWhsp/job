<template>
    <div class="container">
        <div class="main">
            <breadcrumb :list="['首页', '商品分类']"></breadcrumb>
            <div class="category-con">
                <ul class="row" @click="handleItemClick($event, 0)">
                    <li class="one">分类</li>
                    <div class="li-wrap" :class="{'li-wrap__all': allRow[0]}">
                        <li :class="['row-li']" v-for="(item, index) in categoryList" :key="index">
                        <span class="pointer item" :data-id="item.id"
                              :data-name="item.title">{{ item.title }}</span>
                        </li>
                    </div>
                    <div class="icon-wrap" @click="hiddenRow(0)">
                        <span class="all">全部</span>
                        <img class="all-icon" src="../../assets/img/allCommodities/icon2.png" alt="icon"/>
                    </div>
                </ul>
                <ul class="row" v-if="secondLevelCategory.length" @click="handleItemClick($event, 1)">
                    <li class="one">二级分类</li>
                    <div class="li-wrap" :class="{'li-wrap__all': allRow[1]}">
                        <li :class="['row-li']" v-for="(item, index) in secondLevelCategory"
                            :key="index">
                        <span class="pointer item" :data-id="item.id"
                              :data-name="item.title">{{ item.title }}</span>
                        </li>
                    </div>
                    <div class="icon-wrap" @click="hiddenRow(1)">
                        <span class="all">全部</span>
                        <img class="all-icon" src="../../assets/img/allCommodities/icon2.png" alt="icon"/>
                    </div>
                </ul>
                <ul class="row" v-if="thirdLevelCategory.length" @click="handleItemClick($event, 2)">
                    <li class="one">三级分类</li>
                    <div class="li-wrap" :class="{'li-wrap__all': allRow[2]}">
                        <li :class="['row-li']" v-for="(item, index) in thirdLevelCategory" :key="index">
                            <span class="pointer item" :data-id="item.id" :data-name="item.title">{{
                                item.title
                                }}</span>
                        </li>
                    </div>
                    <div class="icon-wrap" @click="hiddenRow(2)">
                        <span class="all">全部</span>
                        <img class="all-icon" src="../../assets/img/allCommodities/icon2.png" alt="icon"/>
                    </div>
                </ul>
                <ul class="row">
                    <li class="one">筛选</li>
                    <li :class="['filter-li-wrap']">
                        <div class="filter-li" v-for="(item, index) in filter" :key="index" @click="handleFilter(item)">
                            <el-popover
                                    placement="bottom"
                                    width="50"
                                    trigger="click">
                                <span slot="reference">{{ item }}</span>
                                <img slot="reference" class="icon" src="../../assets/img/allCommodities/icon3.png"
                                     alt="icon"/>
                                <div class="file-item">
                                    <div class="item pointer" v-for="(it) in filterItem" :key="it.title"
                                         @click="filterItemClick(it, item)">
                                        {{ it.title }}
                                    </div>
                                </div>
                            </el-popover>
                        </div>
                    </li>
                </ul>
                <ul class="last-row">
                    <li class="one">当前筛选</li>
                    <div class="li-wrap">
                        <div class="li" v-for="(item,index) in selectFilterList" :key="item.id">
                            {{ item.name }}
                            <img class="closeIcon" src="../../assets/img/allCommodities/closeIcon.png" alt="icon"
                                 @click="close(index)"/>
                        </div>
                    </div>
                    <div class="icon-wrap  pointer" @click="selectFilterList = []">
                        <img class="all-icon" src="../../assets/img/allCommodities/allDel.png" alt="icon"/>
                        <span class="all">清除所选</span>
                    </div>
                </ul>
            </div>
            <!--综合排序-->
            <div class="sort-wrap">
                <div class="filter-item">
                    <div class="val">
                        <div class="sort-box">
                            <div class="item" v-for="(item, index) in sortList" :key="index"
                                 :class="orderByColumn == item.ziduan ? 'active' : ''" @click="onClickSort(item)">
                                <div class="text">{{ item.title }}</div>
                                <div class="sanjiao-box" v-if="!item.not">
                                    <div class="top"
                                         :class="orderByColumn == item.ziduan && isAsc == 'asc' ? 'active' : ''"></div>
                                    <div class="bottom"
                                         :class="orderByColumn == item.ziduan && isAsc == 'desc' ? 'active' : ''"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--商品列表-->
            <div class="commodity-list">
                <div class="commodity-wrap" v-for="(item, index) in commodityList" :key="index">
                    <div class="commodity-img-wrap" @click="onRouteTo(item)">
                        <img :src="item.thumb" alt="商品"/>
                    </div>
                    <div class="desc-wrap">
                        <div class="desc ellipsis-1">{{ item.title }}</div>
                        <div class="price">￥{{ item.priceSale }}</div>
                        <div class="bottom">
                            <div class="text">
                                <div class="text-img-wrap">
                                    <img src="../../assets/img/allCommodities/icon4.png" alt="icon"/>
                                </div>
                                加入对比
                            </div>
                            <div class="cart-wrap pointer">
                                <div class="cart-text" @click="onRouteTo(item)">立即下单</div>
                                <div class="img-wrap">
                                    <img src="../../assets/img/allCommodities/cart.png" alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--分页器-->
            <div class="pagination-box" v-if="count">
                <el-pagination background layout="total, prev, pager, next, jumper" :total="count"
                               :current-page="pagination.page"
                               :page-size="pagination.pageNum" @current-change="changePage"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumb";

export default {
    name: "allCommodities",
    data() {
        return {
            allRow: [false, false, false], // 是否显示全部
            sortList: [ // 排序列表
                {title: "综合排序", ziduan: "ordering", not: true},
                {title: "人气排序", ziduan: "", not: true},
                {title: "价格", ziduan: "price_sale"},
                {title: "销量排序", ziduan: "orders"}
            ],
            filter: ["尺寸", "厚度", "镀膜", "材料"],
            filterItem: [], // 当前筛选
            orderByColumn: "ordering", //选择的排序方式
            categoryList: [], // 商品分类
            secondLevelCategory: [], // 二级分类
            thirdLevelCategory: [], // 三级分类
            selectFilterList: [], // 当前筛选
            commodityList: [], // 商品列表
            pagination: {
                page: 1,
                pageNum: 30,
                channelId: 0,
            },
            count: 0
        };
    },
    watch: {
        selectFilterList() {
            this.pagination = {
                page: 1,
                pageNum: 30,
            }
            this.selectFilterList.forEach(item => {
                switch (item.type) {
                    case "channelId":
                        this.pagination.channelId = item.id;
                        break;
                    case "materialId":
                        this.pagination.materialId = item.id;
                        break;
                    case "thicknessId":
                        this.pagination.thicknessId = item.id;
                        break;
                    case "coatingId":
                        this.pagination.coatingId = item.id;
                        break;
                    case "sizeId":
                        this.pagination.sizeId = item.id;
                        break;
                }
            })
            this.getList();
        }
    },
    components: {
        breadcrumb
    },
    created() {
        this.getProductChannel(0);
        this.setView();
    },
    methods: {
        async setView() {
            await this.getList();
        },
        async getList() {
            const {code, data} = await this.$api("product_plist", {
                ...this.pagination,
                orderType: this.getOrderType(this.orderByColumn),
            })
            if (code === 200) {
                this.commodityList = data.list;
                this.count = data.count;
            }
        },
        // 获取商品分类
        async getProductChannel(level, parentId = 0) {
            const {code, data} = await this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "product_channel",
                    parentId: parentId,
                },
            });
            if (code === 200) {
                if (level === 0) {
                    this.categoryList = data;
                } else if (level === 1) {
                    this.secondLevelCategory = data;
                } else if (level === 2) {
                    this.thirdLevelCategory = data;
                }
            }
        },
        // 筛选点击
        handleItemClick(event, level) {
            const target = event.target;
            if (target.tagName === "SPAN" && target.className.includes('item')) {
                const name = target.getAttribute("data-name");
                const id = target.getAttribute("data-id");

                let arr = this.selectFilterList;
                arr.push({name: name, id: id});
                if (!this.selectFilterList.includes(name)) {
                    this.selectFilterList = [{name: name, id: id, type: 'channelId'}];
                }

                if (level === 0) {
                    this.secondLevelCategory = [];
                    this.thirdLevelCategory = [];
                    this.getProductChannel(1, id);
                } else if (level === 1) {
                    this.thirdLevelCategory = [];
                    this.getProductChannel(2, id);
                }
            }
        },
        // 清空当前筛选
        close(item) {
            const index = item;
            if (index !== -1) {
                this.selectFilterList.splice(index, 1);
            }
        },
        // 跳转详情
        onRouteTo(item) {
            this.$router.push(`/productDetail?id=${item.inventoryId}`);
        },
        // 翻页
        changePage() {
            this.setView();
        },
        // 排序
        onClickSort(item) {
            if (item.ziduan == this.orderByColumn) {
                this.isAsc = this.isAsc == "asc" ? "desc" : "asc";
            } else {
                this.isAsc = "asc";
            }
            this.orderByColumn = item.ziduan;
            this.setView();
        },
        // 获取排序方式
        getOrderType(item) {
            if (item === "ordering") { // 综合
                return 0;
            } else if (item === "price_sale") { // 单价
                return this.isAsc === "asc" ? 2 : 3;
            } else if (item === "orders") { // 库存
                return 1;
            }
        },
        // 是否显示全部
        hiddenRow(index) {
            this.$set(this.allRow, index, !this.allRow[index])
        },
        // 筛选
        async handleFilter(item) {
            let res
            if (item === '尺寸') {
                res = await this.$api({
                    url: "/service.php",
                    method: "get",
                    data: {
                        action: "product_sizeList",
                    },
                });
            } else if (item === '厚度') {
                res = await this.$api({
                    url: "/service.php",
                    method: "get",
                    data: {
                        action: "product_thicknessList",
                    },
                });
            } else if (item === '镀膜') {
                res = await this.$api({
                    url: "/service.php",
                    method: "get",
                    data: {
                        action: "product_coatingList",
                    },
                });
            } else if (item === '材料') {
                res = await this.$api({
                    url: "/service.php",
                    method: "get",
                    data: {
                        action: "product_materialList",
                    },
                });
            }
            this.filterItem = res.data;
        },
        // 筛选点击
        filterItemClick(item, type) {
            const Tname = type == '尺寸' ? 'sizeId' : type == '厚度' ? 'thicknessId' : type == '镀膜' ? 'coatingId' : 'materialId';
            let arr = this.selectFilterList;
            arr.push({name: item.title, id: item.id, type: Tname});
            this.selectFilterList = [...new Set(arr.map(item => item.name))].map(name => {
                return arr.find(item => item.name === name);
            });
        }
    },
};
</script>


<style lang="less" scoped>
.container {
  background: #f4f4f6;
}

.main {
  margin: 0 260px;
  padding-bottom: 50px;
}

.category-con {
  background: #fff;
  border: 1px solid #dbdbdb;

  .row {
    min-height: 69px;
    position: relative;
    display: flex;
    //align-items: center;
    color: #333333;
    border-bottom: 1px solid #dbdbdb;

    .one {
      width: 64px;
      height: 69px;
      line-height: 69px;
      margin-right: 60px;
      margin-left: 22px;
      text-align: right;
    }

    .li-wrap {
      height: 69px;
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      //overflow: hidden;

      .row-li {
        height: 69px;
        line-height: 69px;
        font-size: 16px;
        color: #333;
        cursor: pointer;
        margin-right: 50px;

        &.active {
          color: @theme;
        }

        .row-li-text {
          cursor: pointer;
        }
      }
    }

    .li-wrap__all {
      height: 100%;
      overflow: auto;
    }

    .icon-wrap {
      height: 69px;
      line-height: 69px;
      margin-right: 60px;
      cursor: pointer;

      .all {
        font-size: 14px;
        color: @theme;
      }

      .all-icon {
        width: 15px;
        height: 8px;
        margin-left: 8px;
      }
    }

    .filter-li-wrap {
      color: #888888;
      display: flex;
      align-items: center;

      &.one {
        width: 113px;
        background: #fafafa;
        color: #333333;
      }

      &.two {
        width: 139px;
      }

      .filter-li {
        padding: 5px 22px;
        background: #f6f6f6;
        border-radius: 16px;
        cursor: pointer;
        margin-right: 20px;

        .filter-li-text {
          color: #888;
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
    height: 69px;
    display: flex;
    align-items: center;

    .one {
      width: 113px;
      margin-right: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .li-wrap {
      flex: 1;

      .li {
        display: inline-block;
        margin-right: 15px;
        padding: 5px 13px;
        border-radius: 16px;
        background: #EAEEF9;
        border: 1px solid @theme;
        color: @theme;

        .closeIcon {
          width: 10px;
          height: 10px;
          cursor: pointer;
        }
      }
    }

    .icon-wrap {
      display: flex;
      align-items: center;
      margin-right: 33px;

      .all-icon {
        width: 17px;
        height: 19px;
        margin-right: 7px;
      }

      .all {
        color: #6A6A6A;
      }
    }
  }
}

.sort-wrap {
  margin-top: 17px;
  height: 48px;
  background: #FFFFFF;

  .filter-item {
    display: flex;
    align-items: flex-start;
    background-color: #fff;
    border: 1px solid #E1E2E5;


    .val {
      flex: 1;
      min-height: 46px;
      background: #fff;
      display: flex;
      align-items: center;
    }

    .sort-box {
      height: 48px;

      display: flex;
      font-size: 14px;
      font-size: 14px;
      color: #545454;

      .item {
        width: 126px;
        height: 100%;
        .flex-center();
        text-align: center;
        cursor: pointer;
        border-right: 1px solid #E1E2E5;

        &.active {
          color: @theme;
        }

        .sanjiao-box {
          margin-left: 5px;

          .top {
            border: 5px solid transparent;
            border-bottom-color: #AAA;

            &.active {
              border-bottom-color: @theme;
            }
          }

          .bottom {
            margin-top: 2px;
            border: 5px solid transparent;
            border-top-color: #AAA;

            &.active {
              border-top-color: @theme;
            }
          }
        }
      }
    }
  }
}

.commodity-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;

  .commodity-wrap {
    width: 264px;
    display: flex;
    flex-direction: column;
    background: #fff;
    margin-top: 20px;
    margin-right: 20px;

    &:nth-child(5n) {
      margin-right: 0;
    }

    .commodity-img-wrap {
      width: 264px;
      height: 264px;
      box-sizing: border-box;

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
        font-size: 16px;
        padding: 24px 21px 13px;
        color: #333333;
      }

      .price {
        padding-left: 21px;
        font-weight: bold;
        font-size: 18px;
        color: #ED2920;
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
          background: @theme;
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
</style>
