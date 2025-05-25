<template>
  <div class="page-wrap">
    <div class="page-inner">
      <div class="view-wrap">
        <div class="control-view" data-title="顶部操作栏">
          <div class="control-box">
            <div class="control-left">
              <div class="control-act">
                <div class="act-form">
                  <el-button type="primary" @click="do_add(1)">创建采购合同</el-button>
                  <el-button type="primary" @click="do_add(2)">上传附件合同</el-button>
                </div>
                <!-- <el-button type="" @click="do_import()">
									导入
								</el-button> -->
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
            <el-table :data="table_data" :row-class-name="table_row_class">
              <el-table-column
                  label="序号"
                  prop="companyId"
                  width="100"
                  align="center"
              ></el-table-column>
              <el-table-column
                  label="采购合同编号"
                  prop="companyCode"
                  width="auto"
                  align="center"
              ></el-table-column>
              <el-table-column
                  label="签订日期"
                  prop="companyName"
                  width="auto"
                  align="center"
              ></el-table-column>
              <el-table-column
                  label="供方单位名称"
                  prop="contacts"
                  width="auto"
                  align="center"
              ></el-table-column>
              <el-table-column
                  label="电话"
                  prop="contactNumber"
                  width="auto"
                  align="center"
              ></el-table-column>
              <el-table-column
                  label="产品总金额"
                  prop="email"
                  width="auto"
                  align="center"
              ></el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <div :class="scope.row.status == 0 ? '' : 'disabled'" class="row-acts">
                    <div class="row-act">
                      <el-button type="text" @click="do_set_scope(scope.row)">预览</el-button>
                    </div>
                    <div class="row-act">
                      <el-button type="text" @click="do_detail(scope.row)">下载</el-button>
                    </div>
                    <div class="row-act" v-if="scope.row.status == 0">
                      <el-button type="text" @click="do_edit(scope.row)">编辑</el-button>
                    </div>
                    <div class="row-act" v-if="scope.row.status == 0">
                      <el-button type="text" @click="do_sign(scope.row)">回签</el-button>
                    </div>
                    <div class="row-act error">
                      <el-button type="text" @click="do_delete(scope.row)">作废</el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="tool-view">
          <div class="tool-left" data-title="批量操作"></div>
          <div class="tool-right">
            <div class="pagi-item">
              <el-pagination
                  :background="true"
                  :current-page="search_params.pageNum"
                  :page-size="search_params.pageSize"
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

    <company_detail_modal ref="company_detail_modal"/>
    <company_form_modal ref="company_form_modal" @confirm="query_view"/>
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
      unique_key: "companyId",
      table_data: [{status: 1}, {status: 0}, {status: 1}, {status: 0}],
      search_params: {
        keyword: "",
        pageNum: 1,
        pageSize: 10,
      },
      origin_search_params: {},
      total: 0,

      status_options: [
        {
          value: 0,
          title: "正常",
        },
        {
          value: 1,
          title: "禁用",
        },
      ],
    };
  },
  computed: {
    table_row_class() {
      return ({row, rowIndex}) => {
        console.log(rowIndex)
        return "table-row-" + (rowIndex % 2 == 0 ? "even" : "odd");
      };
    }
  },
  watch: {},
  created() {
    this.set_params();
    this.query_view();
  },
  mounted() {
  },
  methods: {
    set_params() {
      this.origin_search_params = {
        ...this.search_params,
      };
    },
    query_view() {
      this.query_list();
    },
    query_list() {
      this.$api({
        url: "/company/info/list",
        method: "get",
        data: {
          ...this.search_params,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.table_data = res.rows;
          this.mix_format_list_id(this.table_data, this.unique_key);
          this.total = res.total;

          this.$log("数据列表");
        }
      });
    },
    query_options() {
    },

    do_search() {
      this.search_params.pageNum = 1;
      this.query_view();
    },
    on_pagi_size_change(value) {
      this.search_params.pageSize = value;
      this.search_params.pageNum = 1;
      this.query_view();
    },
    on_pagi_current_change(value) {
      this.search_params.pageNum = value;
      this.query_view();
    },

    do_add(type) {
      if (type === 1) {
        this.$router.push('/caigouhetong-form')
      } else {
        this.$refs.company_form_modal.init();
      }
    },
    do_edit(row) {
      this.$router.push({
        path: "/caigouhetong-form",
        query: {
          id: row.id,
        },
      })
    },
    // 回签
    do_sign(row) {
      this.$refs.company_detail_modal.init(row);
    },
    do_delete(row) {
      this.$confirm("确认删除该条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            this.$api({
              url: `/company/info/${row.id}`,
              method: "delete",
              data: {},
            }).then((res) => {
              alert(res);
              if (res.code == 200) {
                this.query_view();
              }
            });
          })
          .catch(() => {
          });
    },
    do_detail(row) {
      this.$refs.company_detail_modal.init(row);
    },
    do_set_scope(row) {
      this.toRoute({
        path: "/company-scope",
        query: {
          id: row.id,
        },
      });
    }
  },
};
</script>

<style lang="less" scoped>
</style>
