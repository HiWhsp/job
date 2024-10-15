
<template>
  <div class="page">
    <modalInviteUser ref="modalInviteUser" />
    <modalJIfenDuihuan ref="modalJIfenDuihuan" />

    <div class="main-title">
      <div class="left">积分商城</div>
      <div class="right" @click="$router.push('/pointsMall')">
        <img src="@img/jifen/jifen-mingxi.png" alt="" />
        <span>积分商城</span>
      </div>
    </div>

    <div class="page-ctx">
      <div class="yue-box">
        <div class="text-box">
          <div class="text-1">我的积分</div>
          <div class="text-2">
            {{ baseInfo.jifen || 0 }}
            <span class="currency">元</span>
          </div>
          <div class="text-3">
            <button @click="openInvite">邀请赚取积分</button>
          </div>
        </div>
      </div>

      <div class="wrap">
        <div class="inner">
          <div class="tab-box">
            <div class="tab-item" v-for="(item, index) in list_tab" :key="index" @click="selectTab = item" :class="item.title == selectTab.title ? 'active' : ''">
              {{ item.title }}
            </div>
          </div>

          <div class="bottom-info">
            <div class="list-wrap" v-if="list_goods.length">
              <div class="good-list">
                @click="mix_to_product(item)"
                <div class="item" v-for="(item, index) in list_goods" :key="index">
                  <div class="img-box cover">
                    <img :src="item.image" alt />
                  </div>
                  <div class="info">
                    <div class="title">{{ item.title }}</div>
                    <div class="duihuan-info">
                      <div class="jifen">
                        <b>
                          {{ item.jifen || 0 }}
                        </b>
                        <span>积分</span>
                      </div>

                      <span class="yidui">已兑 {{ item.order || 0 }}</span>
                      <button class="btn-enter" @click.stop="onClick_duihuan(item)">
                        兑换
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pagination-box" style="margin-top: 40px">
                <el-pagination
                  background
                  layout="total, prev, pager, next"
                  @current-change="changePage"
                  :current-page.sync="pagination.page"
                  :page-size="pagination.pageNum"
                  :total="count"
                ></el-pagination>
              </div>
            </div>
            <div v-else>
              <div class="product-empty" v-if="!list_goods.length">
                <el-empty description="没有查询到积分商品信息..."></el-empty>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "points-mall",
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {
   
  },
  created() {
    // this.$store.dispatch("query_user");
    // this.setView();

    //this.$store.dispatch("query_user");
    // 移除 this.setView();
    this.redirectToIntegralWinGoods();
  },

  mounted() {

  },

  methods: {
    // changePage(page) {
    //   this.pagination.page = page;
    //   this.setView();
    // },

    redirectToIntegralWinGoods(){
        this.$router.push('/integralWinGoods').catch(err => {
        console.error('Navigation failed:', err);
      });
    },

    setView() {
      //积分商品
      this.$api("money_jifenPdts", {
        ...this.pagination,
      }).then((res) => {
        let { code, data, pages, message } = res;
        this.list_goods = data;
      });
    },

    //进入详情
    click_goods(item) {
      this.$router.push({
        path: "/jifenproduct-detail",
        query: {
          id: item.inventoryId,
          jifen: item.jifen,
          order: item.order,
        },
      });
    },

    openInvite() {
      this.$refs.modalInviteUser.init();
    },

    //积分兑换
    onClick_duihuan(item) {
      //console.log("积分兑换");

      this.$refs.modalJIfenDuihuan.init(item);
    },
  },
};
</script>

<style scoped lang="less">
.banner-wrap {
  width: 100%;
  height: 545px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

