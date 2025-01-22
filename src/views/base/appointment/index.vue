<script>
import periodic from '@/components/periodic';
import {quillEditor} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default {
  components: {periodic, quillEditor},
  data() {
    return {
      typeId: '',
      selectType: '',
      isShow: true,
      dialogElementVisible: false,
      dialogVisible: false,
      detail: {}, // 预约详情
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
      selectElementList: [], // 选中的元素 多个样品
      selectElementIndex: 0, // 元素样品下标
      elementFieldId: '', // 元素id
      preOrderDetail: {}, // 订单信息
      fileList: [],  // 上传的文件
      uploadList: [], // 上传的文件
      priceList: [], // 样品价格列表
    }
  },
  watch: {
    contentList: {
      handler() {
        this.getPrice();
      },
      deep: true
    }
  },
  mounted() {
    this.preOrderDetail = JSON.parse(localStorage.getItem('preOrderDetail')) || {};
    this.preOrderDetail.product_id = this.$route.query.id;
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'get_product_form',
        method: 'post',
        data: {
          product_id: this.preOrderDetail.product_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.product_form = res.data;
          this.elementFieldId = this.product_form.find(item => item.field_type === 'element') && this.product_form.find(item => item.field_type === 'element').id
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
                yf_type: this.preOrderDetail.yf_type || '0',
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
            this.contentList = this.preOrderDetail.form.map(item => {
              this.product_form.forEach((prodItem, prodI) => {
                if (prodItem.is_custom == 1) {
                  item[prodItem.id + '-custom'] = false
                }
              })
              return {
                isShow: true,
                product_form: item
              }
            });
          } else {
            const form = this.setForm();
            this.contentList.push({
              isShow: false,
              product_form: form
            })
            this.selectElementList.push([])
          }
        }
      })
      //   获取设备详情
      this.$api({
        url: 'cms_product_detail',
        method: "post",
        data: {
          id: this.preOrderDetail.product_id
        }
      }).then(res => {
        if (res.code === 200) {
          this.detail = res.data
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
      this.selectElementList.push([])
    },
    // 设置表单的选择项
    setForm() {
      const form = {};
      this.product_form.forEach(item => {
        if (item.field_type == 'number_range') {
          form[item.id] = ['', ''];
        } else if (item.field_type == 'radio' && item.is_multiple) {
          form[item.id] = [];
        } else if (item.is_custom == 1) {
          form[item.id + '-custom'] = false
        } else {
          form[item.id] = '';
        }
      })
      return form
    },
    // 选择元素
    selectElement(list, index) {
      this.selectElementIndex = index;
      if (list.length) {
        this.elementList = list.map(item => {
          return {
            mc: item,
            isActive: false,
            isSelect: false
          }
        });
      }
      this.dialogElementVisible = true;
    },
    // 元素选择
    elementPick(item) {
      // 查找元素是否已存在 如果存在则删除 没有则新增
      const len = this.selectElementList[this.selectElementIndex].length;
      for (let i = 0; i < len; i++) {
        if (this.selectElementList[this.selectElementIndex][i].mc === item.mc) {
          this.elementDel(this.selectElementList[this.selectElementIndex][i], i);
          return
        }
      }
      this.selectElementList[this.selectElementIndex].push(item);
      this.contentList[this.selectElementIndex].product_form[this.elementFieldId] = this.selectElementList[this.selectElementIndex].map(item => item.mc).join('$');
    },
    // 删除元素
    elementDel(item, index) {
      this.$set(this.elementList, index, {
        ...item,
        isActive: false
      })
      this.selectElementList[this.selectElementIndex].splice(index, 1);
      this.contentList[this.selectElementIndex].product_form[this.elementFieldId] = this.selectElementList[this.selectElementIndex].map(item => item.mc).join('$');
    },
    // 下一步
    goUrl() {
      this.$api({
        url: 'order_pay_info',
        method: 'post',
        data: {
          yf_type: this.preOrderDetail.yf_type || '0',
          tongshebei: this.preOrderDetail.tongshebei || '',
          if_urgent: this.preOrderDetail.if_urgent || '',
          sample_type: this.preOrderDetail.sample_type || '',
          product_id: this.preOrderDetail.product_id || '',
          form: this.filterForm(this.contentList.map(item => item.product_form))
        }
      }).then(res => {
        if (res.code === 200) {
          this.preOrderDetail.attachment = JSON.stringify(this.fileList);
          this.preOrderDetail.form = this.contentList.map(item => item.product_form);
          localStorage.setItem('preOrderDetail', JSON.stringify(this.preOrderDetail));
          this.$router.push({
            path: '/appointment-info'
          })
        }
      })
    },
    // 获取价格
    getPrice() {
      this.$api({
        url: 'order_pay_info',
        method: 'post',
        data: {
          yf_type: this.preOrderDetail.yf_type || '0',
          tongshebei: this.preOrderDetail.tongshebei || '',
          if_urgent: this.preOrderDetail.if_urgent || '',
          sample_type: this.preOrderDetail.sample_type || '',
          product_id: this.preOrderDetail.product_id || '',
          form: this.setProductForm(this.contentList)
        }
      }).then(res => {
        if (res.code === 200) {
          this.priceList = res.data;
        }
      })
    },
    setProductForm(data) {
      const form = [];
      data.forEach((item, index) => {
        for (const itemKey in item.product_form) {
          if(itemKey.includes('-custom')) {
            return;
          }
          if(form[index] && Object.keys(form[index]).length) {
            form[index][itemKey] = typeof item.product_form[itemKey] === 'object' ? item.product_form[itemKey].join('$') : item.product_form[itemKey]
          } else {
            form[index] = {};
            form[index][itemKey] = typeof item.product_form[itemKey] === 'object' ? item.product_form[itemKey].join('$') : item.product_form[itemKey]
          }
        }
      })
      return form
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
    // 删除
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    delContent(index) {
      this.contentList.splice(index, 1);
      this.selectElementList.splice(index, 1);
      this.contentList[this.selectElementIndex].product_form[this.elementFieldId] = '';
    },

    // 跳转
    toUrl(url) {
      this.$router.push({
        path: url
      })
    },
    // 申请单下载
    Download() {
      window.open(this.detail.paper, "_blank")
    },
    // 播放
    playVideo() {
      this.dialogVisible = true;
    },
    // 自定义
    showCustom(index, id, customId) {
      this.contentList[index].product_form[id] = '';
      this.contentList[index].product_form[customId] = !this.contentList[index].product_form[customId];
    },
    input(e) {
      this.$forceUpdate()
    }
  }
}
</script>


<template>
  <div class="page">
    <div class="content">
      <div class="content-item" v-for="(item, index) in contentList" :key="index">
        <div class="title-top">
          <span>样品{{ index + 1 }} <i class="el-icon-delete" @click="delContent(index)"></i></span>
          <i class="el-icon-arrow-down pointer" :class="{'hide': item.isShow}" @click="item.isShow = !item.isShow"></i>
        </div>
        <div class="select" :class="{'hide': item.isShow}">
          <div class="sel-item" v-for="(field, fieldIndex) in product_form" :key="fieldIndex">
            <div class="label">
              <i v-if="field.is_require">*</i>
              <span>{{ field.title }}</span>
            </div>
            <div class="value">
              <div class="col" v-if="!contentList[index].product_form[field.id+'-custom']">
                <!--              文本-->
                <el-input v-if="field.field_type === 'text'" v-model="contentList[index].product_form[field.id]"
                          type="text" :placeholder="'请输入' + field.title"></el-input>
                <!--              数字-->
                <div class="flex" v-if="field.field_type === 'number'">
                  <el-input v-model="contentList[index].product_form[field.id]"
                            type="text"
                            @input="(e)=>contentList[index].product_form[field.id] = e.replace(/[^0-9]/g, '')"
                            :placeholder="'请输入' + field.title"></el-input>
                  <span v-if="field.unit">{{ field.unit }}</span>
                </div>
                <!--              数字区间-->
                <template v-if="field.field_type === 'number_range'">
                  <el-input v-model="contentList[index].product_form[field.id][0]"
                            type="text"
                            @input="(e)=>contentList[index].product_form[field.id][0] = e.replace(/[^0-9]/g, '')"
                            :placeholder="'请输入' + field.title"></el-input>
                  <span class="col">—</span>
                  <el-input v-model="contentList[index].product_form[field.id][1]"
                            type="text"
                            @input="(e)=>contentList[index].product_form[field.id][1] = e.replace(/[^0-9]/g, '')"
                            :placeholder="'请输入' + field.title"></el-input>
                </template>
                <!--              文本域-->
                <el-input v-if="field.field_type === 'textarea'"
                          v-model="contentList[index].product_form[field.id]"
                          type="textarea" :rows="4" :placeholder="'请输入' + field.title"></el-input>
                <!--富文本-->
                <quillEditor v-if="field.field_type === 'richtext'"
                             v-model="contentList[index].product_form[field.id]"></quillEditor>
                <!--              单选-->
                <el-radio-group v-if="field.field_type === 'radio' && field.is_multiple === 0"
                                v-model="contentList[index].product_form[field.id]">
                  <el-radio style="margin-bottom: 5px;" :label="it.text" v-for="(it, i) in field.content"
                            :key="it.text">
                    {{ it.text }}
                  </el-radio>
                </el-radio-group>
                <!--              多选-->
                <el-checkbox-group v-if="field.field_type === 'radio' && field.is_multiple === 1"
                                   v-model="contentList[index].product_form[field.id]">
                  <el-checkbox style="margin-bottom: 5px;" :label="it.text" v-for="(it, i) in field.content"
                               :key="it.text">{{ it.text }}
                  </el-checkbox>
                </el-checkbox-group>
                <!--              元素周期表-->
                <template v-if="field.field_type === 'element'">
                  <div class="flex">
                    <div class="t-item column-flex-center wrap"
                         v-for="(xItem, xI) in selectElementList[index]" :key="xI" v-if="xItem">
                      <span class="desc">{{ xItem.mc }}</span>
                      <img src="@/assets/img/base/appointment/element-del.png" class="element-del"
                           @click="elementDel(xItem, xI)"
                           alt="">
                    </div>
                    <div class="sel-element" v-if="field.field_type === 'element'"
                         @click="selectElement(field.content, index)">
                      选择元素
                    </div>
                  </div>
                </template>

                <div class="helps" v-if="field.helps">{{ field.helps }}</div>
              </div>
              <el-input v-if="contentList[index].product_form[field.id+'-custom']"
                        v-model="contentList[index].product_form[field.id]" type="text"
                        @input="input"
                        :placeholder="'请输入' + field.title"></el-input>
              <!--              点击按钮出现文本框 隐藏上面的选择项-->
              <el-button class="custom" v-if="field.is_custom == 1"
                         @click="showCustom(index, field.id, field.id+'-custom')">
                {{ contentList[index].product_form[field.id + '-custom'] ? '取消' : '其他选项' }}
              </el-button>
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
            <span class="money">¥{{ item.unit_price || 0 }} * {{ item.num || 0 }}</span>
          </div>
          <div class="item">
            <span>运费</span>
            <span class="num"> </span>
            <span class="money">¥{{ priceList.yunfei || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="right-item">
        <p>仪器图片</p>
        <div class="play">
          <!--          <img :src="detail.thumb" alt="">-->
          <el-image :src="detail.thumb" :preview-src-list="[detail.thumb]">
            <div slot="error" class="image-slot">
              <img src="@/assets/img/my/order-img.png"/>
            </div>
          </el-image>
          <img src="@/assets/img/base/appointment/play.png" class="play-btn" alt="" @click="playVideo"
               v-if="detail.video">
        </div>
        <div class="lock-detail" @click="toUrl('/analyze_detail?id=' + detail.id)">查看仪器详情 ></div>
      </div>
      <div class="right-item">
        <p>技术顾问</p>
        <div class="idea">
          <span class="tit">一对一为您答疑解惑</span>
          <img :src="detail.guwen" alt="">
          <span class="consult">立即扫码咨询</span>
        </div>
        <p style="margin-top: 40px;">申请单下载</p>
        <div class="down" @click="Download">点击下载文件</div>
      </div>
    </div>

    <el-dialog title="选择元素" :visible.sync="dialogElementVisible" width="1350px" center>
      <periodic :elementList="elementList" :selectElementList="selectElementList[selectElementIndex]"
                @handleClickElement="elementPick"></periodic>
      <div class="sel_element">
        <p class="title">您已选择 <span>{{
            selectElementList[selectElementIndex] ? selectElementList[selectElementIndex].length : 0
          }}</span> 个元素</p>
        <p class="el_it">
          <span v-for="(item, index) in selectElementList[selectElementIndex]" :key="index">{{ item.mc }}({{
              item.name
            }})</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogElementVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogElementVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="仪器视频"
        :visible.sync="dialogVisible"
        width="30%"
        center>
      <video :src="'https://jxjsjc.dx.hdapp.com.cn/' + detail.video" controls="controls" width="100%"
             class="video-mask"></video>
    </el-dialog>
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
          min-width: 50px;
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

      .helps {
        margin-top: 10px;
        font-size: 14px;
        color: @theme;
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

      .el-image {
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

.element-list {
  display: flex;

  .item {
    cursor: pointer;
    width: 68px;
    height: 68px;
    background: #FFFFFF;
    border: 1px solid #00479D;
    text-align: center;
    line-height: 68px;
    margin: 2px;

    .desc {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 20px;
      color: #00479D;
    }

    &.active {
      background-color: #00479D;

      .desc {
        color: #fff;
      }
    }
  }
}

.sel_element {
  margin-top: 20px;

  p {
    font-size: 20px;
    text-align: right;
    color: #000;

    span {
      color: @theme;
      font-weight: bold;
    }
  }

  .el_it {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;

    .el-input {
      width: 220px;
      margin-right: 10px;
    }

    span {
      font-weight: 400;
      margin-right: 10px;
      display: inline-block;
      font-size: 16px;
      color: #555;
    }
  }
}

.video-mask {
  height: 300px;
}

.el-button--primary {
  background-color: #00479D;
  color: #fff;
  border-color: #00479D;
}
</style>
