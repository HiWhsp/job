<template>
  <div class="sort-box">
    <div
      class="item"
      v-for="(item, index) in sortList"
      :key="index"
      :class="orderByColumn == item.ziduan ? 'active' : ''"
      @click="onClickSort(item)"
    >
      <div class="text">{{item.title}}</div>
      <div class="sanjiao-box" v-if="item.title != '综合'">
        <div class="top" :class="orderByColumn == item.ziduan && isAsc == 'asc' ? 'active' : ''"></div>
        <div
          class="bottom"
          :class="orderByColumn == item.ziduan && isAsc == 'desc' ? 'active' : ''"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "commonBottom",
  components: {},
  data() {
    return {
      //排序方向 填写 desc 或者 asc 排序字段 填写 字段名称 比如时间就是createTime  阅读量就是 hits
      isAsc: "", //升asc 降序desc
      orderByColumn: "ordering", //选择的排序方式
      sortList: [
        { title: "综合", ziduan: "ordering" },
        { title: "销量", ziduan: "orders" },
        { title: "价格", ziduan: "priceSale" },
      ],
    };
  },
  computed: {},
  methods: {
    //排序方式
    onClickSort(item) {
      if (item.ziduan == this.orderByColumn) {
        this.isAsc = this.isAsc == "asc" ? "desc" : "asc";
      } else {
        this.isAsc = "asc";
      }
      this.orderByColumn = item.ziduan;

      let sortParams = {
        // orderByColumn: this.orderByColumn,
        // isAsc: this.isAsc,

        order1: this.orderByColumn,
        order2: this.orderByColumn != 'ordering' ? this.isAsc : '',
      };
      //console.log("排序参数", sortParams);

      this.$parent.set_sortParams(sortParams);
    },
  },
};
</script>




<style scoped lang="less">
.sort-box {
  height: 40px;

  display: flex;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;

  .item {
    .flex-center();
    width: 120px;
    text-align: center;
    cursor: pointer;

    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;

    &.active {
      background: @theme;
      color: #fff;
    }

    .text {
    }
    .sanjiao-box {
      margin-left: 5px;
      .top {
        border: 5px solid;
        border-color: transparent;
        border-bottom-color: #aaa;

        &.active {
          border-bottom-color: #fff;
        }
      }
      .bottom {
        margin-top: 2px;
        border: 5px solid;
        border-color: transparent;
        border-top-color: #aaa;

        &.active {
          border-top-color: #fff;
        }
      }
    }
  }
}
</style>
