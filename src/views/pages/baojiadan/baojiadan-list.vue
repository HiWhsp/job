<template>
  <div class="page-wrap">
    <div class="page-inner">
      <div class="view-wrap">
        <div class="control-view" data-title="顶部操作栏">
          <div class="control-box">
            <div class="control-left">
              <div class="control-act">
                <div class="act-form">
                  <el-button type="primary" @click="do_add()">创建合计报价单</el-button>
                </div>
              </div>
            </div>

            <div class="control-right">
              <div class="control-act">
                <div class="act-form">
                  <el-input
                    v-model="search_params.keyword"
                    clearable
                    placeholder="请输入搜索关键字"
                    @clear="do_search()"
                  >
                  </el-input>
                </div>
              </div>

              <div class="control-act">
                <div class="act-form">
                  <el-button icon="el-icon-search" type="primary" @click="do_search()">
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="table-view" data-title="渲染表格">
          <div class="table-box">
            <el-table
              :data="table_data"
              ref="baojiadanForm"
              :height="tableHeight"
              v-loading="loading"
            >
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column
                label="合计报价单编号"
                prop="quotationNo"
                width="200"
              ></el-table-column>
              <el-table-column
                label="签订日期"
                prop="signDate"
                width="200"
              ></el-table-column>
              <el-table-column
                label="客户名称"
                prop="customerCompany"
                width="auto"
              ></el-table-column>
              <el-table-column
                label="联系人"
                prop="customerName"
                width="120"
              ></el-table-column>
              <el-table-column
                label="手机"
                prop="customerPhone"
                width="150"
              ></el-table-column>
              <el-table-column
                label="产品总金额"
                prop="price"
                width="300"
              ></el-table-column>
              <el-table-column fixed="right" label="操作" width="300">
                <template slot-scope="scope">
                  <div :class="scope.row.status == 1 ? '' : 'disabled'" class="row-acts">
                    <div class="row-act">
                      <el-button type="text" @click="do_set_scope(scope.row)"
                        >预览</el-button
                      >
                    </div>
                    <div class="row-act">
                      <el-button type="text" @click="do_detail(scope.row)"
                        >下载</el-button
                      >
                    </div>
                    <div class="row-act" v-if="scope.row.status == 1">
                      <el-button type="text" @click="do_edit(scope.row)">编辑</el-button>
                    </div>
                    <div class="row-act error">
                      <el-button type="text" @click="do_delete(scope.row)">{{
                        scope.row.status == 0 ? "已作废" : "作废"
                      }}</el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="tool-view" v-if="total > 0">
          <div class="tool-left" data-title="批量操作"></div>
          <div class="tool-right">
            <div class="pagi-item">
              <el-pagination
                :background="true"
                :current-page="search_params.page"
                :page-size="search_params.limit"
                :page-sizes="[10, 20, 50, 100, 200]"
                :pager-count="5"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="on_pagi_size_change"
                @current-change="on_pagi_current_change"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>

    <company_detail_modal ref="company_detail_modal" />
    <company_form_modal ref="company_form_modal" @confirm="query_view" />
  </div>
</template>

<script>
import company_detail_modal from "./components/company_detail_modal.vue";
import company_form_modal from "./components/company_form_modal.vue";

export default {
  name: "company-list",
  mixins: [],
  components: {
    company_detail_modal,
    company_form_modal,
  },
  data() {
    return {
      loading: false,
      unique_key: "companyId",
      table_data: [],
      search_params: {
        keyword: "",
        page: 1,
        limit: 10,
        type: 1,
      },
      total: 0,
      tableHeight: 0,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.query_view();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.baojiadanForm.$el.offsetTop - 180;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.baojiadanForm.$el.offsetTop - 180;
      };
    });
  },
  methods: {
    query_view() {
      this.loading = true;
      this.query_list();
    },
    query_list() {
      this.$api({
        url: "getQuotationList",
        method: "post",
        data: {
          ...this.search_params,
        },
      }).then((res) => {
        this.loading = false;
        if (res.code == 200) {
          this.table_data = res.data.list;
          this.total = res.data.count;
        }
      });
    },

    do_search() {
      this.search_params.page = 1;
      this.query_view();
    },
    on_pagi_size_change(value) {
      this.search_params.limit = value;
      this.search_params.page = 1;
      this.query_view();
    },
    on_pagi_current_change(value) {
      this.search_params.page = value;
      this.query_view();
    },

    do_add() {
      this.$router.push("/baojiadan-form");
    },
    do_edit(row) {
      if (row.status == 0) {
        this.$message.error("该条记录已作废, 无法编辑");
        return;
      }
      this.$router.push({
        path: "/baojiadan-form",
        query: {
          id: row.id,
        },
      });
    },
    do_delete(row) {
      if (row.status == 0) {
        this.$message.error("该条记录已作废, 无法作废");
        return;
      }
      this.$confirm("确认作废该条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api({
            url: `cancelQuotation`,
            method: "post",
            data: {
              id: row.id,
            },
          }).then((res) => {
            alert(res);
            if (res.code == 200) {
              this.query_view();
            }
          });
        })
        .catch(() => {});
    },
    do_detail(row) {
      if (row.status == 0) {
        this.$message.error("该条记录已作废, 无法下载");
        return;
      }
      this.$refs.company_detail_modal.init(row);
    },
    do_set_scope(row) {
      if (row.status == 0) {
        this.$message.error("该条记录已作废, 无法预览");
        return;
      }
      this.toRoute({
        path: "/baojiadan-preview",
        query: {
          id: row.id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
