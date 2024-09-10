<template>
  <div class="page">
    <div class="main-title">
      <span>我的优惠券</span>

      <!-- <b @click="$router.push('/coupon')">领券中心</b> -->
    </div>

    <div class="page-ctx">
      <div class="inner">
        <div class="tab-wrap">
          <div class="tab-box">
            <div class="tab-item" v-for="(item, index) in list_tab" :key="index" @click="tab_toggle(item)"
                 :class="status == item.status ? 'active' : ''">
              {{ item.title }}
            </div>
          </div>
        </div>

        <div class="ctx-box">
          <div class="list" v-if="list.length">
            <div class="item-wrap">
              <div class="item" v-for="item in list" :key="item">
                <div class="type flex">
                  <label for="">问题类型：</label>
                  <p>问题类型</p>
                </div>
                <div class="desc flex">
                  <label for="">问题说明：</label>
                  <p>
                    问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字问题说明文字</p>
                </div>
                <div class="date flex">
                  <label for="">反馈时间：</label>
                  <p>2024-05-08 15:30:30</p>
                </div>
                <div class="reply" v-if="status == 2">
                  <div class="it flex">
                    <label for="">回复内容：</label>
                    <p>回复内容回复内容回复内容回复内容回复内容回复内容回复内容回复内容回复内容回复内容回复内容回复内容回复内容</p>
                  </div>
                  <div class="it flex">
                    <label for="">回复时间：</label>
                    <p>2024-05-08 15:30:30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-empty v-if="!list.length" description="暂无数据..."></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "my-feedback",
  components: {},
  data() {
    return {
      status: 1,
      list_tab: [
        {title: "待回复", status: 1},
        {title: "已回复", status: 2},
      ],

      list: [1],
    };
  },
  watch: {},
  created() {
  },
  methods: {
    tab_toggle(item) {
      if (this.status != item.status) {
        this.list = [];
        this.status = item.status;
      }
    },
  },
};
</script>


<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

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

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #A66600;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 24px;
  padding: 24px 32px 40px 32px;
  background: #fff;
}

.inner {
  padding-bottom: 80px;

  .tab-wrap {
    position: relative;
    margin-bottom: 30px;
    .flex-between();

    .tab-box {
      flex: 2;
      // border-bottom: 1px solid #eee;

      .flex();

      .tab-item {
        cursor: pointer;
        padding-bottom: 10px;
        border-bottom: 3px solid transparent;
        margin-right: 60px;

        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333333;

        &.active {
          border-bottom: 3px solid #A66600;
          font-weight: bold;
          color: #A66600;
        }
      }
    }

  }

}

.list {
  .item-wrap {
    .item {
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid #E2E2E2;

      label {
        width: 70px;
      }

      p {
        flex: 1;
      }

      .desc {
        align-items: start;
      }

      .type, .desc, .date {
        font-size: 14px;
        color: #333;
        margin-bottom: 16px;
      }

      .reply {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        height: 95px;
        background: #F6F5F4;
        padding: 17px;
        .it {
          margin-bottom: 19px;
        }
      }
    }
  }
}
</style>


<style scoped lang="less" src="@/assets/h5css/user/myCoupon.less"></style>

