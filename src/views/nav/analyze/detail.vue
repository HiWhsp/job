<script>
export default {
  name: "detail",
  data() {
    return {
      id: this.$route.query.id,
      inventoryId: this.$route.query.inventoryId,
      dialogVisible: false,
      detail: {},
      prodList: []
    }
  },
  watch: {
    $route() {
      this.id = this.$route.query.id;
      if (this.id !== this.detail.id) {
        this.setView();
      }
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      //   获取设备详情
      this.$api({
        url: 'cms_product_detail',
        method: "post",
        data: {
          id: this.id
        }
      }).then(res => {
        if (res.code === 200) {
          this.detail = res.data
        }
      })

      this.$api({
        url: 'cms_product_list',
        method: 'post',
        data: {
          column_id: 523,
          page: 1,
          limit: 4
        }
      }).then(res => {
        if (res.code === 200) {
          this.prodList = res.data;
        }
      })
    },
    // 立即预约
    submit(temp) {
      this.dialogVisible = temp;
      if (!temp) {
        localStorage.setItem('preOrderDetail', JSON.stringify({title: this.detail.title}));
        this.$router.push('/appointment?id=' + this.id)
      }
    },
    goUrl(item) {
      if (item) {
        this.$router.push('/analyze_detail?id=' + item.id)
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="top-box">
      <div class="img">
        <img :src="detail.thumb" alt="">
      </div>
      <div class="info">
        <p class="title">{{ detail.title }}</p>
        <p><span>仪器型号</span> <span>{{ detail.models || '无' }}</span></p>
        <p><span>预约次数</span> <span>{{ detail.orders }}次</span></p>
        <p><span>服务周期</span> <span v-html="detail.period"></span></p>
        <p><span>好评率</span> <span>{{ detail.comments }}</span></p>
        <div class="btn pointer" @click="submit(true)" v-if="detail.if_yueyue == 1">立即预约</div>
      </div>
    </div>
    <div class="detail">
      <div class="title">详细描述</div>
      <div class="content" v-html="detail.content"></div>
      <div class="prev">
        <div class="last" @click="goUrl(detail.prev_item)">上一个 {{
            detail.prev_item ? detail.prev_item.title : '无'
          }}
        </div>
        <div class="next" @click="goUrl(detail.next_item)">下一个 {{
            detail.next_item ? detail.next_item.title : '无'
          }}
        </div>
      </div>
    </div>
    <div class="tip-box">
      <div class="title">其他设备</div>
      <div class="content">
        <div class="it" v-for="i in prodList" :key="i.id" @click="goUrl(i)">
          <div class="img-box">
            <img :src="i.thumb" alt="">
          </div>
          <p class="ellipsis-1">{{ i.title }}</p>
        </div>
      </div>
    </div>

    <el-dialog
        title="预约须知"
        :visible.sync="dialogVisible"
        width="30%"
        center>
      <span>{{ detail.content2 }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="sub-btn" type="primary" @click="submit(false)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.top-box {
  height: 343px;
  padding: 35px;
  background-color: #fff;
  .flex();

  .img {
    width: 448px;
    height: 100%;
    border: 1px solid #eee;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .info {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 60px;

    .title {
      font-weight: bold;
      font-size: 24px;
      color: #333333;
    }

    p {
      font-weight: 400;
      font-size: 14px;
      color: #636363;

      span:first-child {
        display: inline-block;
        width: 90px;
      }

      span:last-child {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }
    }

    .btn {
      width: 148px;
      height: 45px;
      background: #00479D;
      text-align: center;
      line-height: 45px;
      color: #fff;
      font-size: 19px;
    }
  }
}

.detail {
  margin-top: 20px;
  background-color: #fff;

  .title {
    padding: 0 30px;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #E8E8E8;
    font-weight: 500;
    font-size: 18px;
    color: #00479D;
  }

  .content {
    padding: 30px;
  }

  .prev {
    display: flex;
    justify-content: space-between;
    padding: 30px;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    cursor: pointer;
  }
}

.tip-box {
  margin-top: 20px;
  background-color: #fff;

  .title {
    padding: 0 30px;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #E8E8E8;
    font-weight: 500;
    font-size: 18px;
    color: #00479D;
  }

  .content {
    padding: 30px;
    display: flex;

    .it {
      width: 246px;
      margin-right: 19px;

      &:last-child {
        margin-right: 0;
      }

      .img-box {
        height: 234px;
        border: 1px solid #E8E8E8;

        img {
          height: 100%;
        }
      }

      p {
        margin-top: 15px;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        text-align: center;
      }
    }
  }
}

/deep/ .el-dialog {
  border-radius: 20px;
}

/deep/ .el-dialog__header {
  background-image: url("~@/assets/img/base/appointment/dialog.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-top-right-radius: 20px;
  height: 90px;
  line-height: 60px;

  .el-dialog__title {
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }
}

.sub-btn {
  width: 175px;
  height: 43px;
  background: #00479D;
  border-radius: 4px 4px 4px 4px;
  border: none;
}
</style>
