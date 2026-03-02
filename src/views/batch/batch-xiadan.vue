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
            <div class="btn btn-ripple flex-center" @click="do_upload()">
              <img src="@img/batch/upload.png" alt="" />
              上传文件
            </div>
            <div class="tip">提交文件直接下单，表格最多支持100行</div>
          </div>
        </div>
        <div class="sec-2">
          <div class="table-box">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="贵司物料号" width="180">
                <template slot-scope="scope">
                  <div class="input-box">
                    <el-input v-model="scope.row.name"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="氿洲商品编码" width="180">
                <template slot-scope="scope">
                  <div class="input-box">
                    <el-input v-model="scope.row.name"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="订货数量">
                <template slot-scope="scope">
                  <div class="input-box">
                    <el-input v-model="scope.row.name"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="产品名称">
                <template slot-scope="scope">
                  <div class="input-box">
                    <div class="text">{{ scope.row.name }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="单位">
                <template slot-scope="scope">
                  <div class="input-box">
                    <div class="text">{{ scope.row.name }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="最小起订量">
                <template slot-scope="scope">
                  <div class="input-box">
                    <div class="text">{{ scope.row.name }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="单价（元）">
                <template slot-scope="scope">
                  <div class="input-box">
                    <div class="text">{{ scope.row.name }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="小计（元）">
                <template slot-scope="scope">
                  <div class="input-box">
                    <div class="text">{{ scope.row.name }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="需求描述">
                <template slot-scope="scope">
                  <div class="input-box">
                    <el-input v-model="scope.row.name"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <div class="input-box">
                    <div class="act" @click="do_row_delete(scope.row)">
                      删除
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="add-box">
            <div class="btn">+ 新增产品</div>
          </div>
        </div>
        <div class="sec-3">
          <div class="zongji">
            <span class="label"> 总计：</span>
            <span class="value">¥4520.00 </span>
          </div>
          <div class="btn-box">
            <div class="btn btn-ripple flex-center">提交订单</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "product-search",
  components: {},
  data() {
    return {
      count: 0,
      pagination: {
        page: 1,
        pageNum: 18,
      },
      tableData: [{ name: "张三" }, { name: "张三" }],
    };
  },
  computed: {
    ...mapState([""]),
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
  },
  methods: {
    toDetail(item) {
      // this.$router.push(`/product-detail?id=${item.inventoryId}`);
      window.open('/product-detail?id='+item.inventoryId,'__blank','',false)

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
    changePage(page) {
      this.pagination.page = page;
      this.setView();
    },

    do_row_add() {},
    do_row_delete(row) {},
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
      background: #ffeded;
      border-radius: 0px 0px 0px 0px;
      border: 1px solid #00306B;

      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 16px;
      color: #00306B;
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
      background: #00306B;
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
      color: #00306B;
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
      color: #1F1F1F;
    }
    .value {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 20px;
      color: #00306B;
    }
  }

  .btn-box {
    text-align: right;

    .btn {
      display: inline-flex;
      width: 191px;
      height: 46px;
      background: #00306B;

      border-radius: 0px 0px 0px 0px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
    }
  }
}
</style>
