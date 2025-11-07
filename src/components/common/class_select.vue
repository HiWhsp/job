<template>
  <div class="company-select-wrap">
    <el-select
      filterable
      remote
      :loading="remote_loading"
      :remote-method="remote_query_options"
      clearable
      v-model="search_params.classId"
      placeholder="请选择"
      @change="on_change_schoolId"
    >
      <el-option
        v-for="item in schoolId_options"
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
      schoolId_options: [],
      remote_loading: false,

      old_search_params: {},
    };
  },
  computed: {},
  watch: {
    search_params: {
      deep: true,
      handler(new_value, old_value) {
        this.$log('class 监听 search_params new', new_value)
        this.$log('class 监听 search_params old', old_value)
        this.$log('class 监听 search_params old_search_params', this.old_search_params)

        if(new_value.schoolId != this.old_search_params.schoolId) {
          this.query_options();
        }
      },
    }
  },
  created() {
    this.query_options();
  },
  mounted() {},
  methods: {
    init(item) {
      if (item && item.schoolId) {
        let company_item = this.schoolId_options.find(
          (v) => v.schoolId == item.schoolId
        );
        if (!company_item) {
          item.id = item.schoolId;
          this.schoolId_options.push(item);
        }
      }
    },

    query_options() {
      this.old_search_params = JSON.parse(JSON.stringify(this.search_params))

      this.query_schoolId_options();
    },
    query_schoolId_options() {
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
          this.mix_format_list_id(list, "schoolId");
          this.schoolId_options = list;
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
            this.mix_format_list_id(list, "schoolId");
            // this.total = res.total
            this.$log("数据列表", list);
            this.schoolId_options = list;

            this.remote_loading = false;
          }
        });
      } else {
        this.schoolId_options = [];
      }
    },

    on_change_schoolId() {
      this.search_params.pageNum = 1;
      // this.query_view();

      this.$emit("confirm");
    },
  },
};
</script>
  
  <style scoped lang="less">
</style>