<template>
  <div class="page-wrap">
    <div class="page-inner">
      <div class="view-wrap">
        <div class="control-view" data-title="顶部操作栏">
          <div class="control-box">
            <div class="control-left">
              <div class="page-title">查看权限</div>
            </div>
            <div class="control-right">
              <div class="control-act">
                <div class="act-label">手动搜索</div>
                <div class="act-form">
                  <el-input
                    clearable
                    v-model="search_params.companyName"
                    placeholder="请输入"
                    @clear="do_search()"
                  >
                  </el-input>
                </div>
              </div>

              <div class="control-act">
                <div class="act-form">
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="do_search()"
                  >
                    搜索
                  </el-button>
                  <el-button
                    type="default"
                    icon="el-icon-refresh"
                    @click="do_search_reset()"
                  >
                    重置
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="table-view" data-title="渲染表格">
          <div class="table-util-bar">
            <div class="table-title">项目列表</div>
            <!-- <div class="table-acts">
              <el-button type="primary" @click="do_add()"> 创建账号 </el-button>
            </div> -->
          </div>
          <div class="table-box">
            <el-table :data="table_data" stripe>
              <el-table-column
                prop="orderNo"
                label="项目编号"
                align="center"
                width="220"
              ></el-table-column>
              <el-table-column
                prop="title"
                label="项目名称"
                align="center"
                width="220"
              ></el-table-column>
              <el-table-column
                prop="proType"
                label="项目类别"
                width="220"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.channel1Title }}
                  {{ "-" + scope.row.channel2Title }}
                </template></el-table-column
              >
              <el-table-column
                prop="contactNumber"
                label="客户名称"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.custom ? scope.row.custom.name : "--" }}
                </template>
              </el-table-column>
              <el-table-column
                prop="signTime"
                label="合同签订日期"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="signDur"
                label="合同工期"
                align="center"
              ></el-table-column>
              <el-table-column prop="payType" label="付款方式" align="center">
                <template slot-scope="scope">
                  {{ payType_options(scope.row.payType) }}
                </template>
              </el-table-column>
              <el-table-column prop="content1" label="工程内容" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="do_content(scope.row.content1, '工程内容')"
                    >查询详情</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column prop="content2" label="争议解决" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="do_content(scope.row.content2, '争议解决')"
                    >查询详情</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="created_at"
                label="创建时间"
                align="center"
                width="180"
              >
              </el-table-column>
              <el-table-column fixed="right" label="项目流程" align="center">
                <template slot-scope="scope">
                  <div class="row-acts">
                    <div class="row-act">
                      <el-button @click="do_process(scope.row)" type="text"
                        >权限设置</el-button
                      >
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="tool-view">
            <div class="tool-left" data-title="批量操作"></div>
            <div class="tool-right">
              <div class="pagi-item">
                <el-pagination
                  :background="true"
                  :total="total"
                  :pager-count="5"
                  :current-page="search_params.pageNum"
                  :page-size="search_params.pageSize"
                  :page-sizes="[10, 20, 50, 100, 200]"
                  @size-change="on_pagi_size_change"
                  @current-change="on_pagi_current_change"
                  layout="total, sizes, prev, pager, next, jumper"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <project_content_modal ref="project_content_modal" @confirm="query_view" />
    <project_permission_modal
      ref="project_permission_modal"
      @confirm="query_view"
    />
  </div>
</template>

<script>
import project_content_modal from "./components/project_content_modal.vue";
import project_permission_modal from "./components/project_permission_modal.vue";
import { mapState } from "vuex";
export default {
  name: "company-list",
  mixins: [],
  components: {
    project_content_modal,
    project_permission_modal,
  },
  data() {
    return {
      unique_key: "companyId",
      table_data: [],
      search_params: {
        page: 1,
        limit: 10,
        keyword: "",
      },
      origin_search_params: {},
      total: 0,

      is_select_all: false,
    };
  },
  computed: {
    ...mapState(["vuex_role"]),
    payType_options() {
      return (payType_id) => {
        switch (payType_id) {
          case 1:
            return "对公";
          case 2:
            return "对私";
          default:
            return "其他";
        }
      };
    },
  },
  watch: {},
  mounted() {
    this.set_params();
    this.query_view();
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
        url: "/projectList",
        method: "get",
        data: {
          ...this.search_params,
        },
      }).then((res) => {
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
    do_search_reset() {
      this.search_params = {
        ...this.search_params,
        ...this.origin_search_params,
      };
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

    do_content(content, title) {
      this.$refs.project_content_modal.init(content, title);
    },
    do_process(row) {
      this.$api({
        url: "/projectDetail",
        method: "get",
        data: {
          id: row.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          // this.$refs.project_permission_modal.init(row);
          this.$refs.project_permission_modal.init(res.data.userRoles, row.id);
        }
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
