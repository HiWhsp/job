<template>
  <div class="page">
    <div class="main-title">
      <span>我的收藏</span>
    </div>

    <div class="page-ctx">
      <div class="collection-list" v-if="count">
        <div class="collection-item" v-for="item in collectList" :key="item.id">
          <div class="collection-item-img">
            <img :src="item.thumb" alt=""/>
            <div class="collect-icon" @click="collect(item)">
              <img src="@/assets/img/my/collect.png" alt=""/>
            </div>
          </div>
          <div class="collection-item-info">{{ item.title }}</div>
        </div>
      </div>
      <div class="center">
        <div v-if="count" class="pagination-box">
          <el-pagination background layout="total, prev, pager, next" @current-change="changePage"
                         :current-page.sync="pagination.page" :page-size="pagination.pageNum"
                         :total="count"></el-pagination>
        </div>

        <el-empty v-if="!count" description="没有查询到收藏信息..."></el-empty>
      </div>
    </div>

    <el-dialog title="操作提示" width="580px" custom-class="cus-modal-wrap" :close-on-click-modal="true"
               :visible.sync="show_modal">
      <div class="modal-inner">
        <div class="text-box">
          确认取消收藏当前商品?
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn btn-ripple fit-text btn-1" @click="show_modal = false">取消</button>
        <el-button class="btn btn-ripple fit-text btn-2 btn-bg" @click="throttle_do_confirm()">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>


import orderList from "@/components/order/orderList.vue";

export default {
  name: "feedback",
  components: {orderList},
  data() {
    return {
      count: 0,
      show_modal: false,
      selItem: null,
      collectList: [],
      pagination: {
        page: 1,
        pageNum: 12,
      },
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    // 取消收藏
    collect(item) {
      this.selItem = item;
      this.show_modal = true;
    },

    throttle_do_confirm() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_operate",
          operateType: 1,
          operateSence: 1,
          productId: this.selItem.id
        },
      }).then(res => {
        if (res.code == 200) {
          this.show_modal = false;
          this.getList();
          this.$message.success(res.msg);
        }
      })
    },

    changePage() {
      this.getList();
    },

    getList() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ...this.pagination,
          shoucang: 1,
        },
      }).then(res => {
        if (res.code == 200) {
          this.collectList = res.data.list;
          this.count = res.data.count;
        }
      })
    }
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

/deep/ .el-dialog__footer {
  text-align: center;

  button {
    width: 120px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid @theme;

    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: @theme;

    & + button {
      margin-left: 16px;
    }
  }

  .btn-1 {

  }

  .btn-2 {

  }

  .btn-bg {
    background: @theme;
    color: #ffffff;
  }
}
</style>
