<template>
  <div class="filter-box">
    <div class="filter-group">
      <div class="filter-item" style="margin-right: 30px">
        <div class="filter-label">时间：</div>
        <div class="filter-val">
          <div class="date-list">
            <div class="date-item" v-for="(item, index) in list_date_tab" :key="index" :class="{ active: item.title == select_date.title }" @click="toggle_date(item)">
              {{ item.title }}
            </div>
          </div>
        </div>
        <div class="filter-val" style="margin-left: 20px">
          <div class="date-range">
            <el-date-picker :clearable="false" size="mini" value-format="yyyy-MM-dd" v-model="params.date_range" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="change_date_range"> </el-date-picker>
          </div>
        </div>
      </div>

      <div style="margin-right: 30px">
        <!-- <granSearch :params="params" ref="granSearch" /> -->
        <div class="filter-item">
          <div class="filter-label">精度：</div>
          <div class="filter-val">
            <div class="date-list">
              <div class="date-item" v-for="(item, index) in config_gran" :key="index" :class="{ active: item.title == select_gran.title, disabled: disabled_gran.includes(item.val) }" @click="toggle_gran(item)">
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="filter-group">
      <div style="margin-right: 30px">
        <sourceSearch :params="params" ref="sourceSearch" />
      </div>
      <div style="margin-right: 30px">
        <clientDeviceSearch :params="params" ref="clientDeviceSearch" />
      </div>
      <div style="margin-right: 30px">
        <areaSearch :params="params" ref="areaSearch" />
      </div>
      <div style="margin-right: 30px">
        <visitorSearch :params="params" ref="visitorSearch" />
      </div>
    </div>
  </div>
</template>

<script>
import granSearch from "@/components/searchable/gran-search.vue";
import sourceSearch from "@/components/searchable/source-search.vue";
import clientDeviceSearch from "@/components/searchable/clientDevice-search.vue";
import areaSearch from "@/components/searchable/area-search.vue";
import visitorSearch from "@/components/searchable/visitor-search.vue";

import { mapState } from "vuex";

export default {
  name: "group-search",
  components: {
    granSearch,
    sourceSearch,
    clientDeviceSearch,
    areaSearch,
    visitorSearch,
  },
  props: ["params"],
  data() {
    return {
      // params: {
      //   //api 筛选参数
      //   date_range: [this.$dayjs().format("YYYY-MM-DD"), this.$dayjs().format("YYYY-MM-DD")],
      //   start_date: this.$dayjs().format("YYYYMMDD"),
      //   end_date: this.$dayjs().format("YYYYMMDD"),
      // },

      select_date: { title: "今天" },
      select_gran: { title: "按时" },

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapState([""]),

    date_range() {
      return this.params.date_range;
    },

    //日期筛选
    list_date_tab() {
      let day_0 = this.$dayjs().format("YYYY-MM-DD");
      let day_1 = this.$dayjs().subtract(1, "day").format("YYYY-MM-DD");
      let day_7 = this.$dayjs().subtract(7, "day").format("YYYY-MM-DD");
      let day_30 = this.$dayjs().subtract(30, "day").format("YYYY-MM-DD");

      let list_date_tab = [
        {
          title: "今天",
          start: day_0,
          end: day_0,
        },
        {
          title: "昨天",
          start: day_1,
          end: day_0,
        },
        {
          title: "最近7天",
          start: day_7,
          end: day_0,
        },
        {
          title: "最近30天",
          start: day_30,
          end: day_0,
        },
      ];

      return list_date_tab;
    },

    //不可选的精度
    disabled_gran() {
      let list = [
        //"hour",
        "day",
        "week",
        "month",
      ];

      let start = this.$dayjs(this.params.date_range[0], "YYYY-MM-DD");
      let end = this.$dayjs(this.params.date_range[1], "YYYY-MM-DD");

      let days = (end.unix() - start.unix()) / (60 * 60 * 24);
      // console.log("当前日期天数差days = ", days);

      if (days >= 1 && days < 14) {
        list = ["week", "month"];
      } else if (days >= 14 && days < 60) {
        list = ["month"];
      } else if (days >= 60) {
        list = [];
      }

      return list;
    },
  },
  watch: {
    params: {
      deep: true,
      handler(val) {
        // console.log("监视 params", { ...val });
      },
    },
  },

  created() {},

  methods: {
    childUpdateParentParams(newParams = {}) {
      // let params = {
      //   ...this.params,
      //   ...newParams,
      // };

      // params.date_range = [...params.date_range];
      // this.params = params;

      // this.$log({...params});

      this.$parent.childUpdateParentParams(newParams);
    },

    //趋势日期切换
    toggle_date(item) {
      console.log("toggle_date 日期选项", { ...item });
      this.select_date = item;

      //更新父组件
      this.$parent.childUpdateParentParams({
        start_date: item.start.replace(/-/gi, ""),
        end_date: item.end.replace(/-/gi, ""),
        date_range: [item.start, item.end],
      });
    },

    //切换时间
    change_date_range(date_range) {
      console.log("change_date_range 修改日期区间", date_range);
      let [start, end] = date_range;
      let item = this.list_date_tab.find((v) => v.start == start && v.end == end);
      if (item) {
        this.select_date = item;
      } else {
        this.select_date = {};
      }

      if (this.date_range[0] != start || this.date_range[1] != end) {
        //   console.log('修改了日期');
        //   let item = [...date_range];
        //   this.$parent.childUpdateParentParams({
        //   start_date: item.start.replace(/-/gi, ""),
        //   end_date: item.end.replace(/-/gi, ""),
        //   date_range: [item.start, item.end],
        // });
      }

      this.$parent.childUpdateParentParams();
    },

    //时间粒度
    toggle_gran(item) {
      console.log("toggle_gran 时间粒度选项", { ...item });
      if (this.disabled_gran.includes(item.val)) {
        return;
      }
      this.select_gran = item;

      //更新父组件
      this.$parent.childUpdateParentParams({
        gran: item.val,
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-date-editor .el-range-separator {
  width: 2em;
}
/deep/ .el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 240px;
}

.filter-box {
  .filter-group {
    margin-top: 20px;
    display: flex;
		align-items: center;

    .filter-item {
      display: flex;
		align-items: center;

      .filter-label {
        line-height: 24px;
        color: #787a7d;
      }

      .date-list {
        display: flex;
		align-items: center;

        .date-item {
          min-width: 44px;
          height: 28px;
          line-height: 28px;
          padding: 0 10px;
          color: #323437;
          background-color: #fff;
          cursor: pointer;
          transition: 0.5s;
          border: 1px solid #e1e3e4;
          border-right: none;
          border-left: none;
          &:first-child {
            border-left: 1px solid #e1e3e4;
          }
          &:last-child {
            border-right: 1px solid #e1e3e4;
          }

          &:hover {
            background: #f3f4f4;
          }
          &.active {
            background-color: #4da7fd;
            color: #fff;
            border-color: #4da7fd;
          }

          &.disabled {
            background-color: #f3f4f4;
            color: #a0a2a5;
            cursor: not-allowed;
          }
        }
      }

      .area-item {
        display: flex;
		align-items: center;
        border: 1px solid #d9dbdc;
        cursor: pointer;

        .area-input {
          height: 28px;
          width: 76px;
          padding: 0 10px;
        }
        .area-arrow {
          height: 28px;
          width: 28px;
          background-color: #fff;
          background-image: url("~@/assets/icon.png");
          background-position: 2px -400px;
          background-repeat: no-repeat;
          border-left: 1px solid #d9dbdc;
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
          transition: 0.3s;
        }

        &:hover {
          .area-arrow {
            background-color: #ececec;
          }
        }
      }
    }
  }
}
</style>
