<template>
  <div class="wrap">
    <div class="inner">
      <div class="section page-info">
        <div class="page-title">网站概况</div>
        <div class="page-tip">
          网站概况帮助您整体了解网站情况，提供重点指标趋势图，并从来源、受访、访客等分析维度提供统计数据，可以通过“管理页面部件”选择对您最有分析价值的数据项进行默认显示。
        </div>
      </div>

      <!--  -->
      <div class="section section-pv">
        <div class="section-title">今日流量</div>
        <div class="page-tip">
          <div class="tip-item"></div>
        </div>
        <el-table :data="table_gailan" style="width: 100%">
          <el-table-column
            v-for="(item, index) in col_list"
            :key="index"
            :prop="item.col"
            :label="item.label"
            :width="item.width"
          >
          </el-table-column>
        </el-table>
      </div>

      <div class="section section-qushi">
        <div class="section-title">统计日期</div>

        <div class="date-select">
          <div
            class="date-item"
            v-for="(item, index) in list_date"
            :key="index"
            :class="{ active: item.title == select_date.title }"
            @click="toggle_date(item)"
          >
            {{ item.title }}
          </div>
        </div>

        <div class="section-title">
          <div class="section-left">流量趋势</div>
          <div class="section-right" @click="$router.push('/')">
            查看全部
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>

        <div class="chart-box">
          <div id="chart-qushi" style="width: 100%; height: 500px"></div>
        </div>

        <div class="section-title">搜索与来源</div>

        <div class="date-select">
          <div
            class="date-item"
            v-for="(item, index) in list_search"
            :key="index"
            :class="{ active: item.title == select_search.title }"
            @click="toggle_search(item)"
          >
            {{ item.title }}
          </div>
        </div>

        <div class="table-view">
          <el-table :data="table_search" style="width: 100%">
            <el-table-column prop="0" :label="select_search.label" width="auto">
            </el-table-column>
            <el-table-column prop="1" label="浏览量(PV)" width="150"> </el-table-column>
            <el-table-column prop="2" label="占比(%)" width="150"> </el-table-column>
          </el-table>
        </div>

        <!-- 访客 -->
        <div class="section-title">新老访客</div>
        <div class="vistor-info">
          <div class="vistor-pie">
            <div id="chart-fangke" style="width: 100%; height: 400px"></div>
          </div>
          <div class="vistor-table">
            <div class="vistor-table-item vistor-table-title">
              <div class="vistor-label">项目</div>
              <div class="vistor-value">新访客</div>
              <div class="vistor-value">老访客</div>
            </div>
            <div class="vistor-table-item">
              <div class="vistor-label">浏览量</div>
              <div class="vistor-value">{{ newVisitor.pv_count }}</div>
              <div class="vistor-value">{{ oldVisitor.pv_count }}</div>
            </div>
            <div class="vistor-table-item">
              <div class="vistor-label">访客数</div>
              <div class="vistor-value">{{ newVisitor.visitor_count }}</div>
              <div class="vistor-value">{{ oldVisitor.visitor_count }}</div>
            </div>
            <div class="vistor-table-item">
              <div class="vistor-label">跳出率(%)</div>
              <div class="vistor-value">{{ newVisitor.bounce_ratio }}</div>
              <div class="vistor-value">{{ oldVisitor.bounce_ratio }}</div>
            </div>
            <div class="vistor-table-item">
              <div class="vistor-label">平均访问时长</div>
              <div class="vistor-value">{{ newVisitor.avg_visit_time }}</div>
              <div class="vistor-value">{{ oldVisitor.avg_visit_time }}</div>
            </div>
            <div class="vistor-table-item">
              <div class="vistor-label">平均访问页数</div>
              <div class="vistor-value">{{ newVisitor.avg_visit_pages }}</div>
              <div class="vistor-value">{{ oldVisitor.avg_visit_pages }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "index",
  components: {},
  data() {
    return {
      //图表
      chart_qushi: null,
      chart_fangke: null,

      res_report_gailan: {}, //概览数据源
      res_report_laiyuan: {}, //数据来源

      table_gailan: [],

      //概览统计字段
      col_arr_gailan: [
        //
        "pv_count",
        "visitor_count",
        "ip_count",
        "bounce_ratio",
        "avg_visit_time",
        "trans_count",
      ],

      col_list: [
        {
          col: "date",
          label: "日期",
          width: "",
        },
        {
          col: "pv_count",
          label: "浏览次数(PV)",
          width: "",
        },
        {
          col: "visitor_count",
          label: "独立访客(UV)",
          width: "",
        },
        {
          col: "ip_count",
          label: "IP数",
          width: "",
        },
        {
          col: "bounce_ratio",
          label: "跳出率(%)",
          width: "",
        },
        {
          col: "avg_visit_time",
          label: "平均访问时长(秒)",
          width: "",
        },
        // {
        //   col: "trans_count",
        //   label: "转化次数",
        //   width: "",
        // },
      ],

      //日期筛选
      list_date: [
        {
          title: "今天",
          date: "",
        },
        {
          title: "昨天",
          date: "",
        },
        {
          title: "最近7天",
          date: "",
        },
        {
          title: "最近30天",
          date: "",
        },
      ],
      select_date: { title: "今天" },

      list_search: [
        {
          title: "Top10搜索词",
          label: "搜索词",
        },
        {
          title: "Top10来源网站",
          label: "来源网站",
        },
        {
          title: "Top10入口页面",
          label: "入口页面",
        },
        {
          title: "Top10受访页面",
          label: "受访页面",
        },
        // {
        //   title: "新老访客",
        //   label: "",
        // },
      ],
      select_search: { title: "Top10搜索词", label: "搜索词" },

      //新老访客
      newVisitor: {},
      oldVisitor: {},
    };
  },
  computed: {
    table_search() {
      let key_map = {
        Top10入口页面: "landingPage",
        Top10来源网站: "sourceSite",
        Top10受访页面: "visitPage",
        "": "visitType",
        Top10搜索词: "word",
      };
      let key = key_map[this.select_search.title];
      let data = [];
      if (this.res_report_laiyuan.result) {
        if (
          this.res_report_laiyuan.result[key] &&
          this.res_report_laiyuan.result[key].items
        ) {
          data = this.res_report_laiyuan?.result[key].items;
        }
      }
      return data;
    },
  },
  filters: {},
  watch: {},
  created() {
    // this.setView();
  },
  mounted() {
    this.setView();
    // this.init_echarts();
  },
  methods: {
    async setView() {
      let params_qushi = {
        site_id: "18534507",
        method: "overview/getTimeTrendRpt", //	string	是	通常对应要查询的报告
        //通常对应要查询的报告，与网站页面所发送请求的method参数一致。例如要获取趋势分析报告的数据，所用到的方法为"trend/time/a"。
        start_date: "20221106", //	string	是	查询起始时间，例如：20190501
        end_date: "20221112", //	string	是	查询结束时间，例如：20190531
        start_date2: "", //	string	否	对比查询起始时间
        end_date2: "", //	string	否	对比查询结束时间
        metrics: "pv_count,visitor_count,ip_count,bounce_ratio,avg_visit_time",
        //是所要获取的指标，根据不同的报告填写相关指标，与网站页面所发送请求的indicators参数一致。例如要获取浏览量(PV)、访客数(UV)、新访客数，则所填指标为"pv_count,visitor_count,new_visitor_count"。
        order: "", //	string	否	指标排序，示例：visitor_count,desc
        start_index: "0", //	uint	否	获取数据偏移，用于分页；默认是 0
        max_results: "0", //	uint	否	单次获取数据条数，用于分页；默认是 20；  0表示获取所有数据。
        gran: "day", //时间粒度(只支持有该参数的报告)：day/hour/week/month
      };
      let params_diqu = {
        site_id: "18534507",
        method: "overview/getDistrictRpt",
        start_date: "20221106",
        end_date: "20221112",
        start_index: "0",
        max_results: "0",
      };

      let params_laiyuan = {
        site_id: "18534507",
        method: "overview/getCommonTrackRpt", //	string	是	通常对应要查询的报告
        //通常对应要查询的报告，与网站页面所发送请求的method参数一致。例如要获取趋势分析报告的数据，所用到的方法为"trend/time/a"。
        start_date: "20221106", //	string	是	查询起始时间，例如：20190501
        end_date: "20221112", //	string	是	查询结束时间，例如：20190531
        start_date2: "", //	string	否	对比查询起始时间
        end_date2: "", //	string	否	对比查询结束时间
        metrics: "pv_count",
        //是所要获取的指标，根据不同的报告填写相关指标，与网站页面所发送请求的indicators参数一致。例如要获取浏览量(PV)、访客数(UV)、新访客数，则所填指标为"pv_count,visitor_count,new_visitor_count"。
        order: "", //	string	否	指标排序，示例：visitor_count,desc
        start_index: "0", //	uint	否	获取数据偏移，用于分页；默认是 0
        max_results: "0", //	uint	否	单次获取数据条数，用于分页；默认是 20；  0表示获取所有数据。
        gran: "day", //时间粒度(只支持有该参数的报告)：day/hour/week/month
      };

      let res_all = await Promise.all([
        //
        this.$api(this.$API_MAP["获取站点列表"], {}),
        this.$api(this.$API_MAP["网站概况(趋势数据)"], params_qushi),
        this.$api(this.$API_MAP["网站概况(地域分布)"], params_diqu),
        this.$api(
          this.$API_MAP["网站概况(来源网站、搜索词、入口页面、受访页面)"],
          params_laiyuan
        ),
      ]);

      let [
        //
        res_site_list,
        res_report_gailan,
        res_report_diqu,
        res_report_laiyuan,
      ] = res_all;

      console.log("获取站点列表 res_site_list", res_site_list.list);
      console.log(
        "获取报告数据 【网站概况(趋势数据)】 res_report_gailan",
        res_report_gailan.result
      );
      console.log(
        "获取报告数据 【网站概况(地域分布)】 res_report_diqu",
        res_report_diqu.result
      );
      console.log(
        "获取报告数据 【网站概况(来源网站、搜索词、入口页面、受访页面)】 res_report_laiyuan",
        res_report_laiyuan.result
      );

      let table_gailan = [];
      res_report_gailan.result.items[1].reverse().forEach((arr, item_index) => {
        let date_map = {
          0: "今天",
          1: "昨天",
          2: "前天",
        };
        let info = {
          date: date_map[item_index],
        };
        this.col_arr_gailan.forEach((col, col_index) => {
          info[col] = arr[col_index];
        });

        table_gailan.push(info);
      });

      this.table_gailan = table_gailan;

      this.res_report_gailan = res_report_gailan;
      this.res_report_laiyuan = res_report_laiyuan;
      this.newVisitor = res_report_laiyuan.result.visitType.newVisitor;
      this.oldVisitor = res_report_laiyuan.result.visitType.oldVisitor;
      // this.res_report_gailan  = res_report_gailan;

      //设置图表
      this.init_echarts();
    },

    //趋势日期切换
    toggle_date(item) {
      this.select_date = item;
    },
    //搜索切换
    toggle_search(item) {
      this.select_search = item;
    },

    //图标初始化
    init_echarts() {
      this.init_echarts_qushi();
      this.init_echarts_fangke();
    },

    //f趋势
    init_echarts_qushi() {
      let that = this;

      this.chart_qushi = echarts.init(document.getElementById("chart-qushi"));

      var option = {
        legend: {},
        tooltip: {
          show: true,
        },
        dataset: {
          // 提供一份数据。
          source: [
            // ["product", "2015", "2016", "2017"],
            // ["类目1", 43.3, 85.8, 93.7],
            // ["类目2", 83.1, 73.4, 55.1],
          ],
        },

        xAxis: {
          type: "category",
        },

        yAxis: {},

        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: [
          // 这几个系列会出现在第二个直角坐标系中，每个系列对应到 dataset 的每一列。
          { type: "line" },
          { type: "line" },
          { type: "line" },
          { type: "line" },
          { type: "line" },
        ],
      };

      //设置数据源
      // let times = this.res_report_gailan.result.items[0].flat();
      let dimensions = this.col_list.map((v) => v.label);
      let times = this.res_report_gailan.result.items[0].flat();
      let source = [
        dimensions, //首条数据
      ];
      this.res_report_gailan.result.items[1].forEach((item, item_index) => {
        source.push([times[item_index], ...item]);
      });

      option.dataset.dimensions = dimensions;
      option.dataset.source = source;

      console.log("流量趋势  option.dataset 设置", option.dataset);

      // 使用刚指定的配置项和数据显示图表。
      this.chart_qushi.setOption(option);

      window.onresize = function () {
        that.chart_qushi.resize();
      };
    },

    //访客
    init_echarts_fangke() {
      let that = this;
      this.chart_fangke = echarts.init(document.getElementById("chart-fangke"));

      var option = {
        color: ["#4da7fd", "#F56C6C"],
        legend: {},
        tooltip: {
          show: true,
        },
        series: [
          {
            type: "pie",
            data: [
              {
                value: this.newVisitor.ratio,
                name: "新用户",
              },
              {
                value: this.oldVisitor.ratio,
                name: "老用户",
              },
            ],
          },
        ],
      };
      this.chart_fangke.setOption(option);
      window.onresize = function () {
        that.chart_fangke.resize();
      };
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-table table {
  width: 100% !important;

  thead {
    th.el-table__cell {
      background: #e7e7e7;
      color: #000;
      // font-weight: bold;
    }
  }
}

.inner {
  padding: 0;
  text-align: left;

  .page-info {
    text-align: left;
    background: #fff;

    .page-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .page-tip {
      font-size: 12px;
    }
  }

  .section {
    margin-bottom: 20px;
    background: #fff;
    padding: 20px;
    border-radius: 6px;
  }

  .section-title {
    display: flex;
		align-items: center;
		justify-content: space-between;
    text-align: left;
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: bold;

    .section-right {
      display: flex;
		align-items: center;
      color: @theme;
      font-weight: normal;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .section-pv {
    // border: 1px solid #ddd;
  }

  .date-select {
    display: flex;
		align-items: center;
    margin-bottom: 20px;

    .date-item {
      min-width: 70px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      padding: 0 20px;
      cursor: pointer;
      transition: 0.3s;
      border: 1px solid #eee;
      margin-right: 20px;
      font-size: 12px;

      &:hover {
        background: #eee;
      }
      &.active {
        background: #4da7fd;
        color: #fff;
      }
    }
  }

  .table-view {
    margin-bottom: 20px;
  }
}

// 访客信息
.vistor-table {
  margin-top: 20px;

  .vistor-table-item {
    display: flex;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: #333;

    &.vistor-table-title {
      background: #e7e7e7;
      font-weight: bold;
    }

    & > div {
      padding: 0 10px;
    }
    .vistor-label {
      flex: 2;
    }
    .vistor-value {
      width: 150px;
    }
  }
}
</style>
