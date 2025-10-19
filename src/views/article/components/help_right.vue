<template>
  <div class="news-right-wrap">
    <div class="ctx-right">
      <div class="box-item cate-wrap">
        <div class="right-title flex">
          <span class="marker"></span>
          帮助中心
        </div>
        <div class="cate-box">
          <div class="cate-list">
            <div
              class="cate-group"
              v-for="(group, index) in link_group"
              :key="index"
            >
              <div class="group-title">
                {{ group.title }}
              </div>
              <div class="child-box">
                <div
                  class="child-item"
                  v-for="(item, index) in item.newList"
                  :key="index"
                  :class="{
                    active:
                      item.id == $route.query.cid || item.id == current_cid,
                  }"
                  @click="do_toggle_cate(item)"
                >
                  {{ item.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "index",
  components: {},
  props: {
    current_cid: {
      //当前新闻分类 channelId
      type: String,
      default: "",
      required: false,
    },
  },
  data() {
    return {
      link_group: [],

      cate_list: [],
      suggest_news: [],
      first_suggest: {},
      //
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.query_links();
  },

  methods: {
    query_links() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_getIndexFooter",
          channelId: 52,
          page: 1,
          pageNum: 1000,
          orderType: 0, //排序情况：0-自然排序 1-最新
        },
      }).then((res) => {
        if (res.code == 200) {
          this.link_group = res.data;
        }
      });
    },
    do_toggle_cate(item) {
      this.mix_toRoute({
        path: "/news",
        query: {
          cid: item.id,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
.ctx-right {
  width: 300px;

  .box-item {
    background: #fff;
    margin-bottom: 24px;
    padding: 24px 20px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
  }

  .right-title {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 20px;
    color: #000000;

    .marker {
      margin-right: 13px;
      display: inline-block;
      width: 6px;
      height: 24px;
      background: #2E4C87;
      border-radius: 100px 100px 100px 100px;
    }
  }

  .cate-wrap {
    .cate-box {
      margin-top: 24px;

      .cate-list {
        .child-item {
          cursor: pointer;
          margin-bottom: 12px;
          padding: 0 20px;
          height: 45px;
          line-height: 45px;
          background: #f2f5f9;
          border-radius: 4px 4px 4px 4px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #000000;

          &.active {
            background: #2E4C87;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
