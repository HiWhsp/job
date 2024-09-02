<template>
  <div class="sixin-container">
    <el-dialog
      title="客服二维码"
      width="350px"
      :visible.sync="show"
      :before-close="onModal_close"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      custom-class="modal-custom"
    >
      <div class="modal-inner">
        <div class="">
          <div class="img-box">
            <img :src="kefu_img" alt="">
          </div>
          <div class="text">
            扫描上方二维码
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button class="quxiao" @click="show = false">取 消</el-button>
        <el-button class="queding" @click="show = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>


import { mapState } from "vuex";
import shengshiqu from "@/components/address/area_select.vue"; //新增地址

export default {
  name: "address-add",
  components: {
    shengshiqu,
  },
  props: [],
  data() {
    return {
      show: false,
      tihuoma: "", //
    };
  },
  computed: {
    ...mapState(["baseInfo", 'kefu_weixin']),

    kefu_img() {
      let ret = '';
      if(this.kefu_weixin && this.kefu_weixin.length) {
        ret = this.kefu_weixin[0].originalPic
      }
      return ret
    }
  },
  watch: {
 
  },

  created() {},

  mounted() {
    // this.creatQrCode();
  },

  beforeDestroy() {
  
  },

  methods: {
  
    // 新建地址 / 编辑地址
    submit_tihuoma() {
      this.$parent.submit_order_tihuoma(this.tihuoma)
    },


    
  },
};
</script>


<style scoped lang="less">
.biaoqing-box {
  text-align: left;
  margin-top: 10px;
}
/*私信 */
/deep/ .modal-custom {
  min-width: 600px;
  .modal-inner {
    padding: 40px;
    .item {
      margin-bottom: 20px;
      .flex();
      .text {
        min-width: 120px;
        text-align: left;
      }
    }
    .send {
      margin-top: 30px;
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
}

/deep/ .el-textarea {
  .el-textarea__inner {
    background-color: #f5f5f5;
  }
}
/deep/ .el-input {
  .el-input__inner {
    background: #f2f2f2;
    &:disabled {
      background-color: #eee;
      color: #666;
    }
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  .queding {
    width: 119px;
    background: #ec6618;
    border-radius: 3px;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 300;
    color: #ffffff;
  }
  .quxiao {
    width: 119px;
    background: #fff;
    border-radius: 3px;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 300;
    color: #414040;
    border-color: #aaa;
  }
}
</style>
