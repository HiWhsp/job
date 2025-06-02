<template>
  <div class="page-wrap">
    <div class="page-inner">
      <div class="view-wrap">
        <div class="control-view" data-title="顶部操作栏">
          <div class="control-box">
            <div class="control-left">
              <div class="control-act">
                <div class="act-form">
                  <el-button type="primary" @click="do_add(1)"
                    >创建采购合同</el-button
                  >
                  <el-button type="primary" @click="do_add(2)"
                    >上传附件合同</el-button
                  >
                </div>
              </div>
            </div>

            <div class="control-right">
              <div class="control-act">
                <div class="act-form">
                  <el-input
                    v-model="search_params.email"
                    clearable
                    placeholder="请输入搜索关键字"
                    @clear="do_search()"
                  >
                  </el-input>
                </div>
              </div>

              <div class="control-act">
                <div class="act-form">
                  <el-button
                    icon="el-icon-search"
                    type="primary"
                    @click="do_search()"
                  >
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="table-view" data-title="渲染表格">
          <div class="table-box">
            <el-table
              v-loading="loading"
              :data="table_data"
              ref="baojiadanForm"
              :height="tableHeight"
            >
              <el-table-column
                label="序号"
                type="index"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column label="型号、规格" prop="specNo" width="200">
                <template slot-scope="scope">
                  {{ JSON.parse(scope.row.productJson)[0].specNo }}
                </template>
              </el-table-column>
              <el-table-column
                label="签订日期"
                prop="signDate"
                width="200"
                align="center"
              ></el-table-column>
              <el-table-column
                label="供方单位名称"
                prop="company"
                width="auto"
                align="center"
              ></el-table-column>
              <el-table-column label="数量" prop="num" width="120">
                <template slot-scope="scope">
                  {{ JSON.parse(scope.row.productJson)[0].num }}
                </template>
              </el-table-column>
              <el-table-column
                label="单价"
                prop="price"
                width="150"
              ></el-table-column>
              <el-table-column
                label="产品总金额"
                prop="price"
                width="300"
                align="center"
              ></el-table-column>
              <el-table-column fixed="right" label="操作" width="300">
                <template slot-scope="scope">
                  <div
                    :class="scope.row.status == 1 ? '' : 'disabled'"
                    class="row-acts"
                  >
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
                    <div
                      class="row-act"
                      v-if="scope.row.status == 1 && scope.row.source != 2"
                    >
                      <el-button type="text" @click="do_edit(scope.row)"
                        >编辑</el-button
                      >
                    </div>
                    <div class="row-act" v-if="scope.row.status == 1">
                      <el-button type="text" @click="do_sign(scope.row)"
                        >回签</el-button
                      >
                    </div>
                    <div class="row-act error">
                      <el-button type="text" @click="do_delete(scope.row)">{{
                        scope.row.status == 0 ? "恢复合同" : "作废"
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

    <company_detail_modal ref="company_detail_modal" @confirm="query_view" />
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
        type: 2,
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
        url: "getContractList",
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

    do_add(type) {
      if (type === 1) {
        this.$router.push("/caigouhetong-form");
      } else {
        this.$refs.company_form_modal.init();
      }
    },

    do_edit(row) {
      if (row.status == 0) {
        this.$message.error("该条记录已作废, 恢复后可编辑");
        return;
      }
      this.$router.push({
        path: "/caigouhetong-form",
        query: {
          id: row.id,
        },
      });
    },
    do_delete(row) {
      if (row.status == 0) {
        this.$confirm("确认恢复该条记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$api({
              url: `recoverContract`,
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
        return;
      }
      this.$confirm("确认作废该条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api({
            url: `cancelContract`,
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
      // 下载pdf
      const a = document.createElement("a");
      a.href = row.pdfUrl;
      a.download = row.contractNo + ".pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    // 回签
    do_sign(row) {
      this.$refs.company_detail_modal.init(row);
    },
    do_set_scope(row) {
      this.toRoute({
        path: "/caigouhetong-preview",
        query: {
          id: row.id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
