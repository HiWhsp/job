<template>
  <div class="page">
    <div class="page-box w-1400">
      <div class="page-inner">
        <div class="sec-1 flex-center">
          <div class="download-box column-flex-center">
            <div class="btn btn-ripple flex-center" @click="do_download()">
              <img src="@img/batch/download.png" alt="" />
              点我下载
            </div>
            <div class="tip">按照模版填写可以提高匹配成功率哦</div>
          </div>
          <div class="line-box">
            <img src="@img/batch/line.png" alt="" />
          </div>
          <div class="upload-box column-flex-center">
            <el-upload
              class="upload-demo"
              :action="UPLOAD_ACTION"
              name="file"
              :data="custom_upload_data"
              accept=".xls,.xlsx,.et"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false"
              ><div class="btn btn-ripple flex-center">
                <img src="@img/batch/upload.png" alt="" />
                上传文件
              </div>
            </el-upload>

            <div class="tip">提交文件直接下单，表格最多支持100行</div>
          </div>
        </div>
        <div class="sec-2">
          <div class="table-box">
            <el-table :data="info" style="width: 100%">
              <el-table-column prop="date" label="贵司物料号" width="180">
                <template slot-scope="scope">
                  <div class="input-box">
                    <el-input v-model="scope.row.userProductNo"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="莉东商品编码" width="180">
                <template slot-scope="scope">
                  <div class="input-box">
                    <el-input v-model="scope.row.productNo"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="订货数量">
                <template slot-scope="scope">
                  <div class="input-box">
                    <el-input v-model="scope.row.num"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="产品名称">
                <template slot-scope="scope">
                  <div class="input-box">
                    <div class="text">{{ scope.row.product.title }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="单位">
                <template slot-scope="scope">
                  <div class="input-box">
                    <div class="text">{{ scope.row.product.units.title }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="最小起订量">
                <template slot-scope="scope">
                  <div class="input-box">
                    <div class="text">{{ scope.row.product.minNum }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="单价（元）">
                <template slot-scope="scope">
                  <div class="input-box">
                    <div class="text">{{ scope.row.product.price }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="小计（元）">
                <template slot-scope="scope">
                  <div class="input-box">
                    <div class="text">
                      {{ parseFloat(scope.row.product.price) * scope.row.num }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="需求描述">
                <template slot-scope="scope">
                  <div class="input-box">
                    <el-input v-model="scope.row.name">
                      {{ scope.row.requires }}
                    </el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <div class="input-box" style="cursor: pointer">
                    <div class="act" @click="do_row_delete(scope.row)">
                      删除
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="add-box">
            <el-upload
              class="upload-demo"
              :action="UPLOAD_ACTION"
              name="file"
              :data="{
                action: UPLOAD_PARAMS_ACTION,
              }"
              accept=".xls,.xlsx,.et"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false"
            >
              <div class="btn">+ 新增产品</div>
            </el-upload>
          </div>
        </div>
        <div class="sec-3">
          <div class="zongji">
            <span class="label"> 总计：</span>
            <span class="value">{{ vuex_huobi }} {{ totalPrice }}</span>
          </div>
          <div class="btn-box">
            <div class="btn btn-ripple flex-center" @click="generateReport()">
              提交订单
            </div>
          </div>
        </div>
      </div>
    </div>
    <Batch_xunjia_popup
      name="popup"
      ref="popup"
      @confirm="doConfirm"
    ></Batch_xunjia_popup>
  </div>
</template>

<script>
import Batch_xunjia_popup from "../../components/batch/batch_xunjia_popup";
import { mapState } from "vuex";
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env";
export default {
  name: "product-search",
  components: {
    Batch_xunjia_popup,
  },
  data() {
    return {
      count: 0,
      pagination: {
        page: 1,
        pageNum: 18,
      },
      tableData: [{ name: "张三" }, { name: "张三" }],
      link: "",
      UPLOAD_ACTION: "http://jzgy360.com/service.php",
      UPLOAD_NAME,
      UPLOAD_PARAMS_ACTION: "upload_uploadFile",
      info: [],
      fullInfo: {},
    };
  },
  computed: {
    ...mapState([""]),

    custom_upload_data() {
      let token = localStorage.getItem("token") || "";
      let userId = localStorage.getItem("userId") || "";

      let info = {
        action: "upload_uploadFile",
        token: token,
        userId: userId,
      };
      return info;
    },

    totalPrice() {
      let price = 0;
      for (let i = 0; i < this.info.length; i++) {
        price += this.info[i].num * parseFloat(this.info[i].product.price);
      }
      return price;
    },
  },
  watch: {},

  beforeRouteUpdate(to, from, next) {
    next({
      query: to.query,
    });
    this.setView();
  },
  created() {
    this.setView();
    this.getFile();
  },
  methods: {
    toDetail(item) {
      this.$router.push(`/product-detail?id=${item.inventoryId}`);
    },
    getFile() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_getXunjiaTemp",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.link = res.data.piliangTemplate;
        }
      });
    },
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          // channelId: 780,
          page: 1,
          pageNum: 12,
          keyword: this.$route.query.keyword || "",
        },
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          let { list, count, pages } = data;
          this.product_list = list;
          this.count = count;
        }
      });
    },
    generateReport() {
      if (this.info.length > 0) {
        this.$refs.popup.init(this.info);
      } else {
        alert("请上传文件");
      }
    },
    changePage(page) {
      this.pagination.page = page;
      this.setView();
    },
    beforeAvatarUpload(file) {},
    handleAvatarSuccess(res, file, fileList) {
      console.log(file);
      console.log(res);
      this.batchConfirm(res.data.url, file.name);
    },
    batchConfirm(url, name) {
      url = url.substring(url.lastIndexOf("/upload") + 8);
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "product_submitMulitiOrder",
          filename: name,
          filepath: url,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          if (this.fullInfo.length !== 0) {
            this.fullInfo = res.data;
          }
          console.log(res);
          this.info = this.info.concat(res.data.detail);
          console.log(this.info);
        }
      });
    },
    do_row_add() {},
    do_row_delete(row) {
      console.log(row);
      if (this.info.length === 1) {
        alert("需要至少一条数据");
      }
      let target = row.id;

      for (let j = 0; j < this.info.length; j++) {
        if ((this.info[j].id = target)) {
          this.info.splice(j, 1);
          break;
        }
      }
      alert("删除成功");
    },
    do_download() {
      window.location.href = this.link;
    },
    doConfirm(params) {
      console.log(params);
      let infos = params;
      infos.piliangId = this.fullInfo.id;
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action:
            this.vuex_user.type == 1 ? "orders_create" : "orderC_createOrder",
          ...infos,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          // this.toCart();
          this.toRoute({
            path: "/order-detail",
            query: {
              id: res.data.id,
            },
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  background: #f3f3f3;
}

.page {
  .page-box {
    // background: #f7f7f7;
    // background: #fff;
    margin: 0 auto;
  }
  .page-inner {
    margin: 0 auto;
    padding: 20px 0;
    padding-bottom: 80px;
    text-align: left;
  }
}

.sec-1 {
  margin-bottom: 10px;
  background: #fff;
  padding: 30px;
  .download-box {
    .btn {
      margin-bottom: 16px;
      width: 164px;
      height: 48px;
      background: #edf0ff;
      border-radius: 0px 0px 0px 0px;
      border: 1px solid #3B64FC;

      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 16px;
      color: #3B64FC;
      img {
        margin-right: 16px;
        width: 23px;
      }
    }
    .tip {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
    }
  }

  .line-box {
    margin: 0 60px;
    img {
      width: 221.84px;
    }
  }
  .upload-box {
    .btn {
      margin-bottom: 16px;
      width: 164px;
      height: 48px;
      background: #3B64FC;
      border-radius: 0px 0px 0px 0px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 16px;
      color: #ffffff;
      img {
        margin-right: 16px;
        width: 23px;
      }
    }
    .tip {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
    }
  }
}

.sec-2 {
  background: #fff;
  padding: 10px;
  .table-box {
  }
  .add-box {
    text-align: right;
    height: 48px;
    background: #f4f4f4;
    border-radius: 0px 0px 0px 0px;
    .btn {
      padding: 0 12px;
      height: 48px;
      line-height: 48px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 16px;
      color: #3B64FC;
    }
  }
}

.sec-3 {
  background: #fff;
  padding: 24px 30px;

  .zongji {
    margin-bottom: 20px;
    text-align: right;
    .label {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #666666;
    }
    .value {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 20px;
      color: #eb0f19;
    }
  }

  .btn-box {
    text-align: right;

    .btn {
      display: inline-flex;
      width: 191px;
      height: 46px;
      background: #3B64FC;

      border-radius: 0px 0px 0px 0px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
    }
  }
}
</style>
