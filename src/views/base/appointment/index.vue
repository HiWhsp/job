<script>

export default {
  data() {
    return {
      typeId: '',
      selectType: '',
      isShow: true,
      // 样品列表
      contentList: [
        // {
        //   isShow: true,
        //   // 表单
        //   product_form: {}
        // }
      ],
      product_form: [], // 样品表单
      elementList: [], // 元素列表
      preOrderDetail: {}, // 订单信息
      fileList: [],  // 上传的文件
      uploadList: [], // 上传的文件
      priceList: [], // 样品价格列表
    }
  },
  watch: {
    isShow() {
      this.$api({
        url: 'order_pay_info',
        method: 'post',
        data: {
          yf_type: this.preOrderDetail.yf_type || '1',
          tongshebei: this.preOrderDetail.tongshebei || '',
          if_urgent: this.preOrderDetail.if_urgent || '',
          sample_type: this.preOrderDetail.sample_type || '',
          product_id: this.preOrderDetail.product_id || '',
          form: this.contentList.map(item => item.product_form)
        }
      }).then(res => {
        if (res.code === 200) {
          this.priceList = res.data;
        }
      })
    }
  },
  mounted() {
    this.preOrderDetail = JSON.parse(localStorage.getItem('preOrderDetail')) || {};
    this.setView();
  },
  methods: {
    setView() {
      this.preOrderDetail.product_id = this.$route.query.id;
      if (this.preOrderDetail.attachment && JSON.parse(this.preOrderDetail.attachment).length) {
        const list = JSON.parse(this.preOrderDetail.attachment);
        list.forEach(item => {
          this.uploadList.push({url: item.furl, name: item.fname})
        })
      }
      if (this.preOrderDetail.form && this.preOrderDetail.form.length) {
        this.$api({
          url: 'order_pay_info',
          method: 'post',
          data: {
            yf_type: this.preOrderDetail.yf_type || '1',
            tongshebei: this.preOrderDetail.tongshebei || '',
            if_urgent: this.preOrderDetail.if_urgent || '',
            sample_type: this.preOrderDetail.sample_type || '',
            product_id: this.preOrderDetail.product_id || '',
            form: this.preOrderDetail.form
          }
        }).then(res => {
          if (res.code === 200) {
            this.priceList = res.data;
          }
        })
        this.contentList = this.preOrderDetail.form.map(item=> {
          return {
            isShow: true,
            product_form: item
          }
        });
      }
      this.$api({
        url: 'get_product_form',
        method: 'post',
        data: {
          product_id: this.preOrderDetail.product_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.product_form = res.data;
        }
      })
    },
    // 增加样品 防抖
    addContent() {
      const form = this.setForm();
      this.contentList.push({
        isShow: true,
        product_form: form
      })
    },
    // 设置表单的选择项
    setForm() {
      const form = {};
      this.product_form.forEach(item => {
        form[item.id] = '';
      })
      return form
    },
    // 删除元素
    elementDel(item) {
      this.elementList.splice(this.elementList.indexOf(item), 1)
    },
    // 下一步
    goUrl() {
      this.preOrderDetail.attachment = JSON.stringify(this.fileList);
      this.preOrderDetail.form = this.contentList.map(item => item.product_form);
      localStorage.setItem('preOrderDetail', JSON.stringify(this.preOrderDetail));
      this.$router.push({
        path: '/appointment-info'
      })
    },
    //上传相关
    upload_on_success(res, file, fileList) {
      //console.log("上传结果", res);
      let {code, data, msg} = res;
      if (code == 200) {
        fileList.forEach(item => {
          this.fileList.push({fname: item.response.data.name, furl: item.response.data.url})
        })
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    }
  }
}
</script>


<template>
  <div class="page">
    <div class="content">
      <div class="content-item" v-for="(item, index) in contentList" :key="index">
        <div class="title-top">
          <span>样品{{ index + 1 }} <i class="el-icon-delete" @click="contentList.splice(index, 1)"></i></span>
          <i class="el-icon-arrow-down pointer" :class="{'hide': item.isShow}" @click="item.isShow = !item.isShow"></i>
        </div>
        <div class="select" :class="{'hide': item.isShow}">
          <div class="sel-item" v-for="(field, fieldIndex) in product_form" :key="fieldIndex">
            <div class="label">
              <i v-if="field.is_require">*</i>
              <span>{{ field.title }}</span>
            </div>
            <div class="value">
              <!--              文本-->
              <el-input v-if="field.field_type === 'text'" v-model="contentList[index].product_form[field.id]"
                        type="text" :placeholder="'请输入' + field.title"></el-input>
              <!--              数字-->
              <el-input v-if="field.field_type === 'number'" v-model="contentList[index].product_form[field.id]"
                        type="text"
                        @input="(e)=>contentList[index].product_form[field.id] = e.replace(/[^0-9]/g, '')"
                        :placeholder="'请输入' + field.title"></el-input>
              <!--              数字区间-->
              <template v-if="field.field_type === 'number_range'">
                <el-input v-model="contentList[index].product_form[field.id]"
                          type="text"
                          @input="(e)=>contentList[index].product_form[field.id] = e.replace(/[^0-9]/g, '')"
                          :placeholder="'请输入' + field.title"></el-input>
                <span class="col">—</span>
                <el-input v-model="contentList[index].product_form[field.id]"
                          type="text"
                          @input="(e)=>contentList[index].product_form[field.id] = e.replace(/[^0-9]/g, '')"
                          :placeholder="'请输入' + field.title"></el-input>
              </template>
              <!--              文本域-->
              <el-input v-if="field.field_type === 'textarea' || field.field_type === 'richtext'"
                        v-model="contentList[index].product_form[field.id]"
                        type="textarea" :rows="4" :placeholder="'请输入' + field.title"></el-input>
              <!--              单选-->
              <el-radio-group v-if="field.field_type === 'radio'"
                              v-model="contentList[index].product_form[field.id]">
                <el-radio :label="it.text" v-for="(it, i) in field.content" :key="it.text">{{ it.text }}</el-radio>
              </el-radio-group>
              <!--              元素周期表-->
              <template v-if="field.field_type === 'element'">
                <div class="t-item column-flex-center wrap"
                     v-for="(item, index) in elementList" :key="index">
                  <span class="desc">氦(He)</span>
                  <img src="@/assets/img/base/appointment/element-del.png" class="element-del" @click="elementDel(item)"
                       alt="">
                </div>
                <div class="sel-element" v-if="field.field_type === 'element'">选择元素</div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="add-item">
        <div class="add-btn" @click="addContent">增加一组样品</div>
        <div class="sel-item">
          <div class="label">
            <span>实验留言</span>
          </div>
          <div class="value">
            <el-input type="textarea" :rows="4" placeholder="请输入" v-model="preOrderDetail.message"></el-input>
          </div>
        </div>
        <div class="sel-item">
          <div class="label">
            <span>附件</span>
          </div>
          <div class="value">
            <el-upload
                class="upload-demo"
                name="file"
                :file-list="uploadList"
                action="https://jxjsjc.dx.hdapp.com.cn/api/upload"
                :data="mix_upload_data" :on-success="upload_on_success"
                :before-upload="upload_before_upload"
                :on-remove="handleRemove"
                multiple
                :limit="3">
              <div class="upload-box">
                <img src="@/assets/img/base/appointment/load-img.png" alt="">
                <span>上传</span>
              </div>
            </el-upload>
          </div>
        </div>
      </div>

      <div class="all-money">
        <div class="money-info">
          <p>合计费用: <span>{{ vuex_huobi }}{{ priceList.total || 0 }}</span></p>
          <i class="el-icon-arrow-down" :class="{'hide': isShow}" @click="isShow = !isShow"></i>
        </div>
        <div class="next-btn" @click="goUrl()">下一步</div>

        <div class="popup" :class="{'hide': isShow}">
          <div class="item" v-for="(item, index) in priceList.data" :key="index">
            <span>{{ item.sample_title || '暂无' }}</span>
            <span class="num">样品数量：{{ item.num || 0 }}</span>
            <span class="money">¥{{ item.unit_price || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="right-item">
        <p>仪器图片</p>
        <div class="play">
          <img src="@/assets/img/base/appointment/play-img.png" alt="">
          <img src="@/assets/img/base/appointment/play.png" class="play-btn" alt="">
        </div>
        <div class="lock-detail">查看仪器详情 ></div>
      </div>
      <div class="right-item">
        <p>仪器图片</p>
        <div class="idea">
          <span class="tit">一对一为您答疑解惑</span>
          <img src="@/assets/img/base/appointment/code.png" alt="">
          <span class="consult">立即扫码咨询</span>
        </div>
        <p style="margin-top: 40px;">申请单下载</p>
        <div class="down">点击下载文件</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.page {
  width: 1400px;
  margin: 0 auto;
  padding: 30px 0 40px 0;
  display: flex;
  justify-content: space-between;
}

.content {
  width: 1100px;

  .content-item {
    margin-bottom: 20px;
  }

  .title-top {
    .flex();
    justify-content: space-between;
    padding: 18px 20px;
    font-size: 18px;
    color: #333333;
    height: 58px;
    border-bottom: 1px solid #E8E8E8;
    background-color: #fff;


    span {
      font-weight: bold;

      i {
        cursor: pointer;
        color: #00479D;
        margin-left: 5px;
        font-size: 16px;
      }
    }

    i {
      font-weight: bold;
      color: #5D5D5D;
      font-size: 24px;
      transition: all 0.5s ease-in-out;

      &.hide {
        transform: rotate(180deg);
        transition: all 0.5s ease-in-out;
      }
    }
  }

  .select {
    padding: 25px 45px;
    background: #FFFFFF;
    transition: all 0.5s ease-in-out;

    &.hide {
      // 慢慢收起
      height: 0;
      overflow: hidden;
      transition: all 0.5s ease-in-out;
      padding: 0 45px;
    }
  }

  .add-item {
    padding: 40px 45px;
    background: #FFFFFF;

    .add-btn {
      cursor: pointer;
      font-weight: 400;
      font-size: 16px;
      color: #fff;
      text-align: center;
      line-height: 42px;
      width: 149px;
      height: 42px;
      background: #00479D;
      border-radius: 21px;
      margin-bottom: 30px;
    }
  }

  .all-money {
    position: relative;
    margin-top: 20px;
    padding: 0 30px;
    height: 95px;
    background: #FFFFFF;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.11);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .money-info {
      .flex();
      font-weight: 400;
      font-size: 16px;
      color: #333333;

      span {
        color: #00479D;
      }

      i {
        margin-left: 10px;
        font-size: 18px;
        font-weight: bold;
        color: #818181;
        transition: all 0.5s ease-in-out;

        &.hide {
          transform: rotate(180deg);
          transition: all 0.5s ease-in-out;
        }
      }
    }

    .next-btn {
      cursor: pointer;
      width: 140px;
      height: 49px;
      background: #00479D;
      border-radius: 8px;
      font-weight: 400;
      font-size: 18px;
      color: #FFFFFF;
      text-align: center;
      line-height: 49px;
    }

    .popup {
      width: 100%;
      padding: 40px;
      background-color: #fff;
      box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.11);
      position: absolute;
      left: 0;
      bottom: 95px;
      transition: all 0.5s ease-in-out;

      .item {
        margin-bottom: 28px;
        display: flex;

        span {
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          margin-right: 30px;
        }

        .num {
          width: 200px;
        }

        .money {
          font-weight: 400;
          font-size: 18px;
          color: #00479D;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }

      &.hide {
        // 慢慢收起
        height: 0;
        overflow: hidden;
        transition: all 0.5s ease-in-out;
        padding: 0 45px;
      }
    }
  }

  .sel-item {
    .flex();
    margin-bottom: 30px;
    align-items: start;

    .label {
      width: 220px;
      margin-top: 7px;
      margin-right: 15px;
      display: flex;
      align-items: center;

      i {
        color: #e80000;
        font-size: 16px;
      }

      span {
        margin-left: 5px;
        display: inline-block;
        font-size: 16px;
        color: #333333;
      }
    }

    .value {
      flex: 1;
      .flex();
      flex-wrap: wrap;
      cursor: pointer;

      .col {
        margin-right: 10px;
      }

      .v-item {
        margin-top: 5px;
        padding: 7px 25px;
        background: #F7FBFF;
        border: 1px solid #DBDBDB;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        margin-right: 14px;
        border-radius: 2px;

        &.active {
          border: 1px solid #27417C;
        }
      }

      .t-item {
        position: relative;
        border: 1px solid #D9D9D9;
        padding: 6px 20px;
        border-radius: 2px;
        margin-right: 14px;
        margin-bottom: 10px;

        &.active {
          background-color: #00479D;
          color: #fff;
        }

        .element-del {
          position: absolute;
          right: -8px;
          top: -8px;
          width: 16px;
          height: 16px;
        }
      }

      .sel-element {
        width: 95px;
        height: 32px;
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #00479D;
        text-align: center;
        line-height: 32px;
        color: #00479D;
        margin-bottom: 10px;
      }

      .upload-box {
        width: 107px;
        height: 107px;
        background: #FFFFFF;
        border: 1px dashed #00479D;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
          width: 28px;
          height: 26px;
        }

        span {
          color: #00479D;
          font-size: 14px;
          margin-top: 8px;
        }
      }

      /deep/ .el-input {
        width: 220px;
        margin-right: 14px;
      }

      /deep/ .el-textarea {
        width: 685px;
        height: 136px;
      }

      /deep/ .el-textarea__inner {
        height: 100% !important;
      }
    }
  }
}

.right {
  display: flex;
  flex-direction: column;

  .right-item {
    padding: 15px 26px;
    width: 276px;
    background-color: #fff;

    &:last-child {
      margin-top: 20px;
    }

    p {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 18px;
      color: #333333;

      &:before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 20px;
        background: #00479D;
        margin-right: 10px;
      }
    }

    .play {
      position: relative;
      margin-top: 28px;
      width: 100%;
      height: 234px;

      img {
        width: 100%;
        height: 100%;
      }

      .play-btn {
        cursor: pointer;
        position: absolute;
        width: 45px;
        height: 45px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .lock-detail {
      margin-top: 20px;
      height: 34px;
      background: #00479D;
      border-radius: 4px;
      font-weight: 400;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      line-height: 34px;
      cursor: pointer;
    }

    .idea {
      margin-top: 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .tit {
        font-weight: 400;
        font-size: 14px;
        color: #666666;
      }

      img {
        width: 126px;
        height: 76px;
        margin: 24px 0;
      }

      .consult {
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
        color: #00479D;
      }
    }

    .down {
      cursor: pointer;
      margin-top: 20px;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      text-align: center;
    }
  }


}
</style>
