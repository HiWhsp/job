<template>
  <div class="section">
    <div class="title-box">
      <!-- <div class="left">重点推荐</div> -->
      <!-- <div class="right" @click="onClick_tihuan">换一换</div> -->
    </div>
    <div class="section-content">
      <div class="list" v-if="list.length">
        <a
          :href="item.url"
          target="_blank"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="item">
            <div class="poster">
              <img :src="item.images" alt="" class="poster-img" />
            </div>
            <div class="title">
              {{ item.title }}
            </div>
            <div class="sub-title">
              {{ item.sub_title }}
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
const emptyImg = require("@/assets/lehuo/test/demo.png");
import { Toast } from "vant";
import { mapState } from "vuex";
// import _ from 'lodash'

export default {
  name: "indexArticle",
  props: [""],
  data() {
    return {
      pages: 0,
      list: [],
      pagination: {
        page: "1",
        limit: "5",
      },
    };
  },

  computed: {
    ...mapState(["list_brand"]),
  },

  watch: {},

  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.query_list();
    },
    query_list() {
      this.$store.dispatch("cooperate", {}).then((res) => {
        //console.log("合作商家", res.data);
        let { code, data, pages } = res.data;
        if (code == 0) {
          this.list = data;
        }
      });
    },
    onClick_tihuan() {
      if (this.pages <= this.pagination.page) {
      } else {
        this.query_list();
      }
    },

    //进入详情
    on_detail(item) {
      //console.log({ ...item });

      this.$router.push({
        path: "/writeDetail",
        query: { id: item.id, mode: "news" },
      });
    },
  },
};
</script>


<style scoped lang="less">
.section {
  margin-bottom: 20px;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      min-width: 56px;
      height: 14px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 300;
      color: #666666;
      line-height: 14px;
    }

    .right {
      cursor: pointer;
      min-width: 42px;
      height: 14px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 300;
      color: #d36f16;
      line-height: 14px;
    }
  }
}

.section-content {
  margin-top: 23px;
  .list {
    display: flex;
    flex-wrap: wrap;

    a {
      color: #000;
      text-align: center;
      width: 330px;
      margin-right: 20px;

      &:nth-child(4n) {
        margin-right: 0;
      }
    }
    .item {
      cursor: pointer;

      .poster {
        .poster-img {
          width: 330px;
          height: 155px;
          border: none;
        }
      }
      .title {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        margin-top: 12px;
        margin-bottom: 25px;
        padding: 0 10px;

        font-size: 14px;
      }

      .sub-title {
        font-size: 14px;
      }
    }
  }
}
</style>
