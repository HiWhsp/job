<template>
  <div>
    <h1>收藏夹详情</h1>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import { mapState } from "vuex";

export default {
  name: "List",
  props: ["favorites_id"],
  data() {
    return {
      list: [], //
    };
  },
  computed: {
    ...mapState(["origin"]),
  },

  watch: {
    favorites_id(curr) {
      this.setView();
    },
  },

  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.queryFavDetail();
    },

    //收藏夹中的作品列表
    queryFavDetail() {
      this.$store
        .dispatch("get_collect", {
          favorites_id: this.favorites_id,
        })
        .then((res) => {
          //console.log("收藏夹的作品列表", res.data);
          let { code, data, total } = res.data;
          if (code == 0) {
          }
        });
    },
  },
};
</script>


<style scoped lang="less">
.house-list {
  padding: 10px;
  background-color: #fff;
}

.doctor-item {
  position: relative;
  text-align: left;
  font-size: 12px;
  display: flex;
  align-items: center;
  color: #999;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 10px;
  margin-bottom: 10px;

  .left {
    position: relative;
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    width: calc(100% - 80px);
    height: 80px;
    padding: 0 5px 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #777;

    .name {
      font-size: 14px;
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price {
        font-size: 14px;
        color: #f00;
      }
      .img-box {
        img {
          width: 100%;
        }

        .van-button {
          border: none;
        }
      }
    }
  }
}

.del-marker {
  position: absolute;
  right: 0;
  bottom: 5px;
}

.empty-container {
  background-color: #f4f4f4;

  /deep/ .van-empty__image {
  }
}
</style>
