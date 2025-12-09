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
              v-for="(group, index) in vuex_footer_cates"
              :key="index"
            >
              <div class="group-title">
                {{ group.title }}
              </div>
              <div class="child-box">
                <div
                  class="child-item"
                  v-for="(item, index) in group.newList"
                  :key="index"
                  :class="{
                    active:
                      item.id == $route.query.id || item.id == current_cid,
                  }"
                  @click="
                    do_toggle_cate(item.newList[0] ? item.newList[0].id : '')
                  "
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
      type: Number | String,
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
    ...mapState(["vuex_footer_cates"]),
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
    do_toggle_cate(id) {
      console.log(id);
      if (!id) {
        this.$message.error("暂无内容");
        return;
      };
      this.mix_toRoute({
        path: "/help",
        query: {
          id: id,
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
      background: #f74747;
      border-radius: 100px 100px 100px 100px;
    }
  }

  .cate-wrap {
    .cate-box {
      margin-top: 24px;

      .cate-list {
        .group-title {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #000000;
          margin-bottom: 12px;
        }
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
            background: #f74747;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
