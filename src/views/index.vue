<template>
  <div class="page">
    <div class="index-box-first-content flex">
      <div class="CategoryLayout">
        <ul class="category-wrapper">
          <li class="category-list">
            <a title="机械常用零件" class="link">
              <span>机械常用零件</span>
            </a>
            <div class="category-list-submenu active">
              <div class="submenu-item">
                <div class="submenu-item-name">机械常用零件</div>
                <div class="submenu-item-content">
                  <a title="平键" class="submenu-item-content__a">
                    <span>平键</span>
                  </a></div>
              </div>
            </div>
          </li>
          <li class="category-list"><a title="直线运动零件" class="link"><span>直线运动零件</span></a>
            <div class="category-list-submenu active">
              <div class="submenu-item">
                <div class="submenu-item-name">直线运动零件</div>
                <div class="submenu-item-content"><a title="导向轴" class="submenu-item-content__a"><span
                >导向轴</span></a></div>
              </div>
            </div>
          </li>
          <li class="category-list"><a title="传动零部件" class="link"><span>传动零部件</span></a>
            <div class="category-list-submenu active">
              <div class="submenu-item">
                <div class="submenu-item-name">传动零部件</div>
                <div class="submenu-item-content">
                  <a title="联轴器/万向节" class="submenu-item-content__a"><span>联轴器/万向节</span></a>
                </div>
              </div>
            </div>
          </li>
          <li class="category-list">
            <a title="门部零件/脚轮/脚杯" class="link">
              <span>门部零件/脚轮/脚杯</span>
            </a>
            <div class="category-list-submenu active">
              <div class="submenu-item">
                <div class="submenu-item-name">门部零件/脚轮/脚杯</div>
                <div class="submenu-item-content">
                  <a title="手柄" class="submenu-item-content__a">
                    <span>手柄</span>
                  </a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import dayjs from 'dayjs'

export default {
  name: "index",
  components: {},
  data() {
    return {
      todayHasPlayAni: true, //不需要展示动画
      product_list_1: [],
      product_list_2: [],
      reviews_group: []
    };
  },
  computed: {
    ...mapState([
      "index_banners",
      "index_full_ani",
      "hotSearchWords",
    ]),

  },
  watch: {},

  created() {
    // this.setView();
  },
  mounted() {
    this.handleAni()
  },
  methods: {
    handleAni() {
      if (!this.todayHasPlayAni) {
        this.todayHasPlayAni = true;
        localStorage.setItem(
            "playAniDate",
            dayjs().format('YYYY-MM-DD')
        );
        this.$nextTick(() => {
          this.$refs.order_manjian_modal.init()
        })
      }
    },

    setView() {
      this.query_product_cate1()
      this.query_product_cate2()
      this.query_reviews()
    },

    query_product_cate1() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          channelId: 780,
          page: 1,
          pageNum: 8,
        },
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          let {list, count, pages} = data;
          this.product_list_1 = list;
          // this.count = count;
        }
      });
    },
    query_product_cate2() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          channelId: 792,
          page: 1,
          pageNum: 8,
        },
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          let {list, count, pages} = data;
          this.product_list_2 = list;
          // this.count = count;
        }
      });
    },
    query_reviews() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_comments",
          page: 1,
          pageNum: 12,
          productId: 0,
          ifIndex: 1,
        },
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          let {list, count, pages} = data;
          this.reviews = list;


          let reviews_group = [];
          let items_length = 4;//4个一组
          list.forEach((v, i) => {
            let group_index = Math.floor(i / items_length);
            if (!reviews_group[group_index]) {
              reviews_group[group_index] = [];
            }
            reviews_group[group_index].push(v);
          });
          this.reviews_group = reviews_group;
        }
      });
    },
  },
}

</script>

<style scoped lang="less">

.page {
  width: 1200px;
  height: 1920px;
  padding: 21px 0 53px 0;
}

.CategoryLayout {
  position: relative;
  width: 190px;
  min-height: 440px;
  background: #fff;
  border-radius: 8px
}

.CategoryLayout .category-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px 0;
  overflow-y: auto
}

.CategoryLayout .category-wrapper .category-list {
  flex: 1;
  min-height: 26px;
  max-height: 40px;
  font-size: 14px;
  display: flex;
  align-items: center
}

.CategoryLayout .category-wrapper .category-list:hover {
  color: #0f95ec;
  background-color: #eaf7fd
}

.CategoryLayout .category-wrapper .category-list:hover .active {
  display: block !important
}

.CategoryLayout .category-wrapper .category-list .link {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  text-decoration-line: none;
  color: #000
}

.CategoryLayout .category-wrapper .category-list .link span {
  flex: 1;
  padding: 0 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}

.CategoryLayout .category-wrapper .category-list-submenu {
  display: none;
  position: absolute;
  top: 0;
  left: 190px;
  z-index: 98;
  box-sizing: border-box;
  width: 808px;
  height: 100%;
  padding: 15px 30px 8px;
  background: #fff;
  border-radius: 0 8px 8px 0;
  box-shadow: 0 2px 16px 0 rgba(1, 66, 104, .2)
}

.CategoryLayout .category-wrapper .category-list-submenu .submenu-item {
  padding-bottom: 16px;
  border-bottom: .5px solid #e6e9ea
}

.CategoryLayout .category-wrapper .category-list-submenu .submenu-item:last-child {
  border-bottom: none
}

.CategoryLayout .category-wrapper .category-list-submenu .submenu-item-name {
  font-weight: 600;
  color: #000
}

.CategoryLayout .category-wrapper .category-list-submenu .submenu-item-content {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px
}

.CategoryLayout .category-wrapper .category-list-submenu .submenu-item-content__a {
  box-sizing: border-box;
  display: flex;
  width: 33.3%;
  padding-right: 20px;
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 22px;
  color: #000;
  text-decoration-line: none
}

.CategoryLayout .category-wrapper .category-list-submenu .submenu-item-content__a:hover {
  color: #0f95ec
}

.CategoryLayout .category-wrapper .category-list-submenu .submenu-item-content__a span {
  display: flex;
  align-items: center;
  flex: 1
}
</style>
