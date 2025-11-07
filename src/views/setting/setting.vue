<template>
  <div class="page-wrap">
    <div class="page-inner">
      <div class="view-wrap">
        <div class="control-view" data-title="顶部操作栏">
          <div class="control-box">
            <div class="control-left">
              <div class="page-title">学生中心</div>
            </div>
            <div class="control-right">
              <div class="control-act">
                <div class="act-label">所属分校</div>
                <div class="act-form">
                  <school_select
                    :search_params="search_params"
                    @confirm="query_view"
                  />
                </div>
              </div>
              <div class="control-act">
                <div class="act-label">所报班级</div>
                <div class="act-form">
                  <class_select
                    :search_params="search_params"
                    @confirm="query_view"
                  />
                </div>
              </div>
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
            <div class="table-title">学生列表</div>
            <div class="table-acts">
              <el-button type="primary" @click="do_add()"> 创建账号 </el-button>
            </div>
          </div>
          <div class="table-box">
            <el-table :data="table_data" stripe border>
              <el-table-column
                prop="companyId"
                label="ID"
                width="100"
              ></el-table-column>
              <el-table-column
                prop="companyCode"
                label="企业编码"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="companyName"
                label="企业名称"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="contacts"
                label="联系人"
                width="auto"
              ></el-table-column>
              <el-table-column
                prop="contactNumber"
                label="联系电话"
                width="120"
              ></el-table-column>
              <el-table-column
                prop="email"
                label="邮箱"
                width="150"
              ></el-table-column>
              <el-table-column
                prop="address"
                label="地址"
                width="300"
              ></el-table-column>
              <el-table-column prop="images" label="营业执照" width="120">
                <template slot-scope="scope">
                  <div class="row-pic">
                    <el-image
                      fit="cover"
                      :src="scope.row.businessLicense"
                      :preview-src-list="[scope.row.businessLicense]"
                    >
                    </el-image>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                width="auto"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="row-tags">
                    <el-tag type="primary" v-if="scope.row.status == 0"
                      >启用</el-tag
                    >
                    <el-tag type="info" v-if="scope.row.status == 1"
                      >禁用</el-tag
                    >
                  </div>
                  <!-- <div class="row-switch">
                                          <el-switch v-model="scope.row.status" size="mini" active-value="1"
                                              inactive-value="0" active-color="#13ce66" inactive-color="#DDDDDD"
                                              active-text="启用" inactive-text="禁用"
                                              @change="(value) => on_change_switch(scope.row, {field: 'status', value: value})">
                                          </el-switch>
                                      </div> -->
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="300">
                <template slot-scope="scope">
                  <div class="row-acts">
                    <div class="row-act">
                      <el-button @click="do_set_scope(scope.row)" type="text"
                        >查看经营范围</el-button
                      >
                    </div>
                    <div class="row-act">
                      <el-button @click="do_detail(scope.row)" type="text"
                        >详情</el-button
                      >
                    </div>
                    <div class="row-act">
                      <el-button @click="do_edit(scope.row)" type="text"
                        >修改</el-button
                      >
                    </div>
                    <div class="row-act">
                      <el-button @click="do_delete(scope.row)" type="text"
                        >删除</el-button
                      >
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="tool-view">
            <div class="tool-left" data-title="批量操作">
              <div class="tool-act tool-act-all">
                <el-checkbox v-model="is_select_all">全选</el-checkbox>
              </div>
              <div class="tool-act">
                <el-button type="primary" @click="do_batch_delete()">
                  批量删除
                </el-button>
              </div>
              <div class="tool-act">
                <el-button type="primary" @click="do_export()">
                  导出Excel
                </el-button>
              </div>
            </div>
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
      unique_key: "companyId",
      table_data: [
        {
          companyId: 1,
          companyCode: "111111",
          companyName: "企业名称1",
          contacts: "联系人1",
          contactNumber: "13800000000",
          contacts: "联系人1",
          contactNumber: "13800000000",
          email: "EMAIL ",
          address: "地址1",
        },
      ],
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

      is_select_all: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.set_params();
    this.query_view();
    // this.query_options()
  },
  mounted() {},
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
    query_options() {},

    do_search() {
      this.search_params.pageNum = 1;
      this.query_view();
    },
    do_search_reset() {
      // this.search_params.channelId = '';
      // this.search_params.keyword = '';
      this.search_params = {
        ...this.search_params,
        ...this.origin_search_params,
      };
      this.query_view();
    },
    on_change_status() {
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

    do_import() {
      this.$refs.w_base_import_modal.init();
    },
    do_add() {
      this.$refs.company_form_modal.init();
    },
    do_edit(row) {
      this.$refs.company_form_modal.init(row);
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
        .catch(() => {});
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
    },
    on_change_switch(row, field_info) {
      this.$log("row", row);

      this.$log("field_info", field_info);

      this.$api({
        url: "/system/dict/type",
        method: "put",
        data: {
          [this.unique_key]: row[this.unique_key],
          [field_info.field]: field_info.value,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          this.query_view();
        }
      });
    },

    do_batch_delete() {
      this.$confirm("确认删除选中的记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {})
        .catch(() => {});
    },
    do_export() {
      this.$api({
        url: "/company/info/export",
        method: "get",
        data: {
          ...this.search_params,
        },
        responseType: "blob",
      }).then((res) => {
        this.download_file(res, "企业列表.xlsx");
      });
    },
  },
};
</script>
  
  <style scoped lang="less">
</style>