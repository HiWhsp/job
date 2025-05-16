<template>
  <div class="company-select-wrap">
    <el-select
      filterable
      remote
      :loading="remote_loading"
      :remote-method="remote_query_options"
      clearable
      v-model="search_params.companyId"
      placeholder="请选择"
      @change="on_change_companyId"
    >
      <el-option
        v-for="item in companyId_options"
        :key="item.id"
        :label="item.companyName"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  props: {
    search_params: {
      type: Object,
      default: function () {
        return {};
      },
      required: false,
    },
  },
  data() {
    return {
      companyId_options: [],
      remote_loading: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.query_options();
  },
  mounted() {},
  methods: {
    init(item) {
      this.$log("初始化公司项目", item);
      if (item && item.companyId) {
        let company_item = this.companyId_options.find(
          (v) => v.companyId == item.companyId
        );
        if (!company_item) {
          item.id = item.companyId;
          this.companyId_options.push(item);
        }
      }
    },

    query_options() {
      this.query_companyId_options();
    },
    query_companyId_options() {
      //分类
      this.$api({
        url: "/company/info/list",
        method: "get",
        data: {
          page: 1,
          pageNum: 100,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = res.rows;
          this.mix_format_list_id(list, "companyId");
          this.companyId_options = list;
        }
      });
    },
    remote_query_options(query) {
      if (query !== "") {
        this.remote_loading = true;
        this.$api({
          url: "/company/info/list",
          method: "get",
          data: {
            page: 1,
            pageNum: 100,
            companyName: query,
          },
        }).then((res) => {
          if (res.code == 200) {
            let list = res.rows;
            this.mix_format_list_id(list, "companyId");
            // this.total = res.total
            this.$log("数据列表", list);
            this.companyId_options = list;

            this.remote_loading = false;
          }
        });
      } else {
        this.companyId_options = [];
      }
    },

    on_change_companyId() {
      this.search_params.pageNum = 1;
      // this.query_view();

      this.$emit("confirm");
    },
  },
};
</script>

<style scoped lang="less">
</style>