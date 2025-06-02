<template>
  <div class="page-table-ctx-wrap">
    <!-- 弹层类 -->
    <modal_content_base type="基础弹层" ref="modal_content_base" @eventCallback="eventCallback" />
    <modal_userBadge type="用户徽章" ref="modal_userBadge" @eventCallback="eventCallback" />
    <modal_iframe_page type="嵌入页面" ref="modal_iframe_page" @eventCallback="eventCallback" />
    <modal_news_preview type="新闻预览" ref="modal_news_preview" @eventCallback="eventCallback" />
    <!-- <modal_news_relative_news
      type="相关新闻"
      ref="modal_news_relative_news"
      @eventCallback="eventCallback"
    /> -->

    <modal_relative_news_list type="相关内容" ref="modal_relative_news_list" @eventCallback="eventCallback" />
    <!-- 弹层类 -->

    <div class="actions-box">
      <!-- 控制器 -->
      <div class="control-box">
        <div class="control-left">
          <div class="control-item" v-for="(item, index) in utilForAddSortFilter" :key="index">
            <template v-if="item.tag == 'btn'">
              <el-button :type="item.type" @click="handleCrudAction(item)">
                {{ item.title }}
                <i v-if="item.right_arrow" class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
            </template>
            <template v-else-if="item.tag == 'dropdown'">
              <el-dropdown @command="handleCommand">
                <el-button :type="item.type">
                  {{ item.title }}
                  <i v-if="item.right_arrow" class="el-icon-arrow-down el-icon--right"></i>
                </el-button>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(sub, sindex) in item.child" :key="sindex" :command="sub.title">{{ sub.title
                    }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </div>
        </div>
        <div class="control-right" v-if="!searchControl.hide">
          <div class="action-item" v-if="searchControl.actions.includes('分类筛选')">
            <formSelect :form="searchControl.searchCate.form" :item="searchControl.searchCate.option"
              @eventCallback="eventCallback" ref="formSelect" />
          </div>
          <div class="action-item" v-if="searchControl.actions.includes('产品分类筛选')">
            <formTreeSelect :form="searchControl.searchCate.form" :item="searchControl.searchCate.option"
              @eventCallback="eventCallback" ref="formTreeSelect" />
          </div>
          <div class="action-item" v-if="searchControl.actions.includes('标题搜索')">
            <el-input v-model="keyword" clearable placeholder="请输入关键词">
              <el-button slot="append" size="small" icon="el-icon-search" @click="handleSearch()">
              </el-button>
            </el-input>
          </div>

          <div class="action-item" v-if="searchControl.actions.includes('更多筛选')">
            <el-button type="primary" class="btn" @click="show_filter = !show_filter">筛选
            </el-button>
          </div>
        </div>
      </div>
      <!-- 控制器 -->

      <!-- 筛选器 -->
      <div class="filter-box" v-if="show_filter">
        <el-form ref="form" :inline="true" :model="form" label-width="80px">
          <el-form-item label="所属分类">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资讯标题">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilterSubmit">筛选</el-button>
            <el-button @click="handleFilterClear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 渲染表格 -->
    <div class="table-view">
      <el-table :data="tableData" stripe border @sort-change="handleSortChange">
        <el-table-column v-if="tableRowShowSelect" type="selection" width="40">
        </el-table-column>
        <!-- 数据循环体 -->

        <template v-for="(item, index) in tableColumns">
          <el-table-column v-if="item.type == 'image'" :key="index + item.prop" :prop="item.prop" :label="item.label"
            :width="item.width" :sortable="item.sortable" :show-overflow-tooltip="item.show_overflow_tooltip">
            <template slot-scope="scope">
              <div class="table-image-list">
                <template v-if="item.colFormat == 'jsonObjectArray'">
                  <div data-type="jsonObjectArray" class="table-image-item"
                    v-for="(sub, subindex) in scope.row[item.prop]" :key="subindex">
                    <!-- <img :src="item.image" alt="" /> -->
                    <el-image style="width: 50px; height: 50px" :src="sub.url"
                      :preview-src-list="scope.row[item.prop].map((v) => v.url)">
                    </el-image>
                  </div>
                </template>

                <template v-else-if="item.colFormat == 'jsonStringArray'">
                  <div data-type="jsonStringArray" class="table-image-item"
                    v-for="(sub, subindex) in scope.row[item.prop]" :key="subindex">
                    <el-image style="width: 50px; height: 50px" :src="sub" :preview-src-list="scope.row[item.prop]">
                    </el-image>
                  </div>
                </template>

                <template v-else>
                  <div data-type="image" class="table-image-item">
                    <!-- <img :src="scope.row[item.prop]" alt="" /> -->

                    <el-image style="width: 50px; height: 50px" :src="scope.row[item.prop]"
                      :preview-src-list="[scope.row[item.prop]]">
                    </el-image>
                  </div>
                </template>
              </div>
            </template>
          </el-table-column>

          <!-- 特殊处理 id 到 文字的展示 -->
          <el-table-column v-else-if="item.type == 'id=>text'" :key="index + item.prop" :prop="item.prop"
            :label="item.label" :width="item.width" :sortable="item.sortable"
            :show-overflow-tooltip="item.show_overflow_tooltip">
            <template slot-scope="scope">
              <div class="id-text">
                <!-- {{ scope.row | format_html }} -->
                <!-- {{ table_format_id2text(scope.row) }} -->
                <span v-if="idTextMap[item.idTextMapKey]">
                  {{ idTextMap[item.idTextMapKey][scope.row[item.prop]] }}
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-else-if="item.type == 'customRender'" :key="index + item.prop" :prop="item.prop"
            :label="item.label" :width="item.width" :sortable="item.sortable"
            :show-overflow-tooltip="item.show_overflow_tooltip">
            <template slot-scope="scope">
              <div class="customRender">
                <span>
                  {{ scope.row["customRender_" + item.prop] }}
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-else :key="index + item.prop" :prop="item.prop" :label="item.label" :width="item.width"
            :sortable="item.sortable" :show-overflow-tooltip="item.show_overflow_tooltip">
          </el-table-column>
        </template>

        <!-- 数据循环体 -->

        <!-- 操作 -->
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <div data-title="列表操作" class="row-actions-box">
              <div class="row-action" v-for="(action, aIndex) in tableRowActionButtons" :key="aIndex">
                <el-button v-if="action != '更多'" @click="handleTableRowCommand(action, scope.row)" type="text">{{ action
                  }}</el-button>

                <el-dropdown v-else @command="(command) => handleTableRowCommand(command, scope.row)">
                  <el-button type="text">更多</el-button>

                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(sub, sindex) in tableRowMoreActions" :key="sindex" :command="sub.title">{{
                      sub.title }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>

              <!-- 列表操作 -->
              <!-- <div class="row-action" v-if="tableRowActionButtons.includes('编辑')">
                <el-button @click="handleTableRowEdit(scope.row)" type="text"
                  >编辑</el-button
                >
              </div>

              <div class="row-action" v-if="tableRowActionButtons.includes('删除')">
                <el-button @click="handleTableRowDelete(scope.row)" type="text"
                  >删除</el-button
                >
              </div>

              <div class="row-action" v-if="tableRowActionButtons.includes('更多')">
                <el-dropdown
                  @command="(command) => handleTableRowCommand(command, scope.row)"
                >
                  <el-button type="text">更多</el-button>

                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(sub, sindex) in tableRowMoreActions"
                      :key="sindex"
                      :command="sub.title"
                      >{{ sub.title }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div> -->
            </div>
          </template>
        </el-table-column>
        <!-- 操作 -->
      </el-table>
    </div>
    <!-- 渲染表格 -->

    <div class="table-util">
      <div class="util-left">
        <!-- 批量选择 -->
        <template v-if="showTableBatchSelect">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
            @change="handleCheckAllChange">当页全选</el-checkbox>

          <!-- <el-button @click="toggleSelection([tableData[1], tableData[2]])"
              >当页全选</el-button
            > -->
          <!-- <el-button @click="toggleSelection()">取消选择</el-button> -->
          <span class="checked-count"> 已选10项 </span>

          <!-- 工具栏 -->
          <div class="util-items">
            <div class="item" v-for="(item, index) in utilForPublish" :key="index">
              <template v-if="item.tag == 'btn'">
                <el-button :type="item.type">
                  {{ item.title }}
                  <i v-if="item.right_arrow" class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
              </template>
              <template v-else-if="item.tag == 'dropdown'">
                <el-dropdown @command="handleUtilCommand">
                  <el-button :type="item.type">
                    {{ item.title }}
                    <i v-if="item.right_arrow" class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>

                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(sub, sindex) in item.child" :key="sindex" :command="sub.title">{{
                      sub.title }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </div>
          </div>
          <!-- 工具栏 -->
        </template>
      </div>
      <div class="util-right" v-if="showPagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pagination.page" :page-sizes="[10, 20, 50, 100, 200]" :page-size="pagination.pageNum"
          layout="total, sizes, prev, slot, next, jumper" :total="count" :pager-count="5">
          <span class="cus-current-page">
            <span> {{ pagination.page }}/{{ countPage }} </span>
          </span>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 允许配置 4个 方向上的控制工具栏
 * 1 左上角 新增排序筛选
 * 2 有上角 搜索筛选
 * 3 左上角 内容发布删除等
 * 4 右上角 列表分页
 */

import modal_content_base from "@/components/modals/modal_content_base.vue";

import formSelect from "@/components/form/formSelect.vue";
import formTreeSelect from "@/components/form/formTreeSelect.vue";

import { mapState } from "vuex";
export default {
  name: "page-table-ctx",
  components: {
    modal_content_base,



    formSelect,
    formTreeSelect,
  },
  props: {
    otherQueryParams: {
      //处理页面被引入到弹窗中的场景  比如页面【新闻评论回复】被页面【新闻评论】引入 通过点击【查看回复】展示弹窗触发
      type: Object,
      default: function () {
        return {
          // newsId: option.newsId,
          // commentId: option.commentId,
        };
      },
      required: false,
    },

    otherModule: {
      //其他模块信息 eg: newsContent
      //例如新闻资讯内容页面需要设置热搜时 弹出表单需要展示热搜表单项目
      type: Object,
      default: function () {
        return {
          //   热搜: {
          //   apiConfig: {
          //     idKey: "hotSearchId",
          //     list: { method: "get", url: "/app/news/hot/search/list" },
          //     add: {
          //       method: "get",
          //       url: "/app/news/hot/search",
          //
          //     },
          //     delete: { method: "delete", url: "/app/news/hot/search/{ID}" },
          //     edit: { method: "put", url: "/app/news/hot/search" },
          //     detail: { method: "get", url: "/app/news/hot/search/{ID}" },
          //   },
          //   formColumns: [
          //     { is_required: 1, col: "newsId", label: "新闻ID",  },
          //     { is_required: 1, col: "heat", label: "热度值",  },
          //   ],
          // },
        };
      },
      required: false,
    },

    apiConfig: {
      //【接口配置】页面增删改查接口
      type: Object,
      default: function () {
        //列表接口
        //添加接口
        //删除接口
        //编辑接口
        //详情接口
        return {
          // idKey: "channelId",
          // list: {
          //   method: "get",
          //   url: "/app/system/newsChannel/list",
          //   requestNotPagination: true, //请求不需要分页参数
          //   requestParams: {//其他请求参数
          //     type: 3,
          //   },
          // },
          // add: { method: "get", url: "/app/system/newsChannel" },
          // delete: { method: "delete", url: "/app/system/newsChannel/list" },
          // edit: { method: "put", url: "/app/system/newsChannel/{channelId}" },
          // detail: { method: "get", url: "/app/system/newsChannel/{channelId}" },
        };
      },
      required: false,
    },

    utilForAddSortFilter: {
      //【左上方】新增排序筛选工具项
      type: Array,
      default: function () {
        return [
          { tag: "btn", title: "添加", type: "primary" },
          { tag: "btn", title: "分类管理" },
          {
            tag: "dropdown",
            title: "更多操作",
            right_arrow: 1,
            child: [
              { title: "自定义列显示" },
              { title: "自定义筛选" },
              { title: "导入" },
              { title: "导出" },
              { title: "回收站" },
            ],
          },
          { tag: "btn", title: "列表排序" },
        ];
      },
      required: false,
    },

    searchControl: {
      //【右上方】筛选配置项
      hide: false,
      actions: ["分类筛选", "标题搜索", "更多筛选"],
      keywordKey: "keyword", //搜索关键词key
      searchCate: {
        type: Object,
        default: function () {
          return {
            show: true,
            form: {
              channelId: "",
            },
            option: {
              is_required: 1,
              col: "channelId",
              label: "所属分类",
              val: "",
              width: "100",
              type: "select",
              labelKey: "channelName",
              valueKey: "channelId",
              apiConfig: {
                url: "/app/system/newsChannel/list",
                method: "get",
                data: {
                  page: 1,
                  pageNum: 100,
                },
              },
            },
          };
        },
        required: false,
      },
    },

    showTableBatchSelect: {
      //【左下方】是否展示批量勾选按钮
      type: Boolean,
      default: true,
      required: false,
    },

    utilForPublish: {
      //【左下方】是否展示表格勾选操作工具项
      type: Array,
      default: function () {
        return [
          {
            tag: "dropdown",
            title: "发布",
            right_arrow: 1,
            child: [{ title: "立即发布" }, { title: "撤销发布" }],
          },
          {
            tag: "dropdown",
            title: "定时任务",
            right_arrow: 1,
            child: [
              { title: "定时发布" },
              { title: "定时撤销" },
              { title: "取消定时发布" },
              { title: "取消定时撤销" },
            ],
          },
          {
            tag: "dropdown",
            title: "置顶",
            right_arrow: 1,
            child: [{ title: "置顶" }, { title: "取消置顶" }],
          },
          {
            tag: "dropdown",
            title: "状态",
            right_arrow: 1,
            child: [{ title: "显示" }, { title: "隐藏" }],
          },
          {
            tag: "btn",
            title: "转移",
          },
          {
            tag: "btn",
            title: "删除",
          },
        ];
      },
      required: false,
    },

    showPagination: {
      //【右下方】是否展示分页组件
      type: Boolean,
      default: true,
      required: false,
    },

    idTextMap: {
      //表格数据项中id需要替换为text的属性字段映射信息
      type: Object,
      default: function () {
        return {
          channelId_map: { id: "text" },
        };
      },
      required: false,
    },

    tableColumns: {
      //【表格表头】表头配置项
      type: Array,
      default: function () {
        return [
          // {
          //  prop: "id",
          //  label: "表头1",
          //  width: "auto",
          //  sortable: false, //是否可排序
          //  show_overflow_tooltip: false, //悬浮是否展示提示
          //  type: 'image' //text(默认) || image || id=>text || customRender
          //  idTextMapKey: "channelId_map", // id=>text 类型
          // },
          //   {
          //   prop: "sex",
          //   label: "性别",
          //   width: "auto",
          //   sortable: false,
          //   show_overflow_tooltip: false,
          //   type: "customRender",
          //   customRender: {
          //     type: "text",
          //     valMap: {
          //       0: "顶部",
          //       1: "侧边",
          //    },
          //   },
          // },
        ];
      },
      required: false,
    },
    formColumns: {
      //【接口-新增】 表单提交数据项
      type: Array,
      default: function () {
        return [
          //【type 类型列表】
          //input 默认
          //number 文字输入
          //textarea 文本域
          //date 日期
          //select 下拉选
          //radio 单选
          //cascader 级联选择
          //upload-image 上传图片
          //upload-file 上传文件
          //rich-editor 富文本编辑器
          //topic-card 话题卡片
          // { is_required: 1, col: "channelName", label: "标题",  },
          // { is_required: 1, col: "desc", label: "描述",  },
          // { is_required: 0, col: "sortNum", label: "排序值",  },
          // { is_required: 0, col: "sortNum", label: "图片", type: 'upload-image',  },
          // {
          //   title: '下拉选项',
          //   is_required: 1,
          //   col: "channelId",
          //   label: "所属分类",
          //   val: "",
          //   width: "100",
          //   type: "select",
          //   labelKey: "channelName",
          //   valueKey: "channelId",
          //   options: [],
          //   apiConfig: {
          //     url: "/app/system/newsChannel/list",
          //     method: "get",
          //     data: {
          //       page: 1,
          //       pageSize: 10,
          //     },
          //   },
          // },
          // {
          //   is_required: 1,
          //   col: "carouselImg",
          //   label: "图片",
          //   val: "",
          //   width: "100",
          //   type: "upload-image",
          // upload_multiple: false,
          // upload_limit: 1,
          // cache_key: "upload_file_list", //图片上传回显
          // },
          // {
          //   is_required: 1,
          //   col: "carouselImg",
          //   label: "图片",
          //   val: "",
          //   width: "100",
          //   type: "upload-image",
          // upload_multiple: false,
          // upload_limit: 1,
          // cache_key: "upload_file_list", //图片上传回显
          // },
        ];
      },
      required: false,
    },

    tableRowShowSelect: {
      //【表格行】表格行是否展示左侧勾选项目
      type: Boolean,
      default: false,
      required: false,
    },
    tableRowActionButtons: {
      //【表格行】表格行右侧操作栏按钮
      type: Array,
      default: function () {
        // return ["编辑", "删除"];
        // return ["编辑", "更多"];
        // return ["编辑", "删除", "更多"];
        return ["编辑", "更多"];
      },
      required: false,
    },

    tableRowActionButtonsEventMap: {
      //【表格行】表格行右侧操作栏按钮点击后要执行的函数 例如作品举报 - 举报审核
      type: Object,
      default: function () {
        // return {
        //   举报审核: "doEventCallback",
        // };
        return {};
      },
      required: false,
    },

    tableRowMoreActions: {
      //【表格行】表格行更多操作
      type: Array,
      default: function () {
        return [
          {
            title: "浏览",
            detail: "新闻列表-新闻预览",
            eg: ["新闻列表"],
          },
          {
            title: "撤销发布",
          },
          {
            title: "定时撤销",
          },
          {
            title: "转移",
          },
          {
            title: "隐藏",
          },
          {
            title: "删除",
          },
          {
            title: "复制",
          },
          {
            title: "分享",
          },
          {
            title: "置顶",
          },
          {
            title: "查看评论",
            eg: ["新闻列表"],
          },
          {
            title: "设为热搜",
            eg: ["新闻列表"],
          },
        ];
      },
      required: false,
    },
  },
  data() {
    return {
      keyword: "",
      isIndeterminate: false,
      checkAll: false,
      show_filter: false,

      form: {
        name: "",
        region: "",
      },

      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      // currentPage: 1,

      tableData: [
        // {
        //   id: "12987122",
        //   name: "好滋好味鸡蛋仔",
        //   category: "江浙小吃、小吃零食",
        //   desc:
        //     "淡奶，奶香浓而不腻荷兰优质淡奶，奶香浓而不腻荷兰优质淡奶，奶香浓而不腻 淡奶，奶香浓而不腻荷兰优质淡奶，奶香浓而不腻荷兰优质淡奶，奶香浓而不腻",
        //   address: "上海市普陀区真北路",
        //   shop: "王小虎夫妻店",
        //   shopId: "10333",
        // },
      ],
    };
  },
  computed: {
    countPage() {
      let pages = Math.ceil(this.count / this.pagination.pageNum);
      if (pages < 1) {
        pages = 1;
      }
      return pages;
    },
  },
  watch: {
    $route(to, from) {


      this.pagination.page = 1;
      this.setView();
    },
  },

  filters: {
    format_html(item) {
      console.warn("格式化分类选项", { ...item });
    },
  },

  created() {
    this.setView();
  },

  methods: {
    setView() {
      // this.$api("setting", {}).then((res) => {});
      console.warn("this.searchControl", JSON.parse(JSON.stringify(this.searchControl)));

      let {
        //
        action,
        method,
        requestNotPagination,
        requestParams,
        dataKey,
      } = this.apiConfig.list; //请求参数配置
      let {
        //
        searchCate,
        keywordKey,
      } = this.searchControl; //搜索参数配置

      // 分页
      let apiData = {
        // pageNums: 1,
        // pageSize: 10,
        ...this.pagination,
      };
      if (requestNotPagination) {
        apiData = {};
      }

      //如果有自己的筛选参数 不使用默认参数
      if (requestParams) {
        apiData = {
          ...apiData,
          ...requestParams,
        };
      }

      //搜索参数
      if (searchCate && searchCate.form) {
        apiData = {
          //
          ...apiData, //分页
          ...searchCate.form, //分类筛选
          [keywordKey || "keyword"]: this.keyword, //关键词
        };
      }

      //链接自带的参数
      if (this.$route.query) {
        console.warn("this.$route.query", this.$route.query);
        for (var key in this.$route.query) {
          apiData[key] = this.$route.query[key];
        }
      }

      apiData = {
        ...apiData,
        ...this.otherQueryParams,
      };

      for (var key in apiData) {
        if (apiData[key] === "") {
          delete apiData[key];
        }
      }

      this.$api({
        action: action,
        ...apiData
      }).then((res) => {
        if (res.code == 200) {
          let dataList = res.data.list ? res.data.list : res.data;
          this.$logjson(action, dataList);

          //自定义渲染内容
          let customRenderList = this.tableColumns.filter((v) => v.customRender);
          if (customRenderList.length) {
            customRenderList.forEach((customRenderItem) => {
              let { prop } = customRenderItem;
              let { valMap } = customRenderItem.customRender;
              dataList.forEach((v) => {
                v["customRender_" + prop] = valMap[v[prop]];
              });
            });
          }

          let colFormatItem = this.tableColumns.find((v) => v.colFormat);
          if (colFormatItem) {
            if (colFormatItem.colFormat == "jsonObjectArray") {
              dataList.forEach((v) => {
                if (v[colFormatItem.prop]) {
                  try {
                    v[colFormatItem.prop] = JSON.parse(v[colFormatItem.prop]);
                  } catch (error) {
                    v[colFormatItem.prop] = [];
                  }
                } else {
                  v[colFormatItem.prop] = [];
                }
                console.warn("表格行", { ...v });
              });
            } else if (colFormatItem.colFormat == "jsonStringArray") {
              dataList.forEach((v) => {
                if (v[colFormatItem.prop]) {
                  try {
                    v[colFormatItem.prop] = v[colFormatItem.prop].split(",");
                  } catch (error) {
                    v[colFormatItem.prop] = [];
                  }
                } else {
                  v[colFormatItem.prop] = [];
                }
              });
            }
          }

          this.tableData = dataList;
          this.count = res.data.count;
        }
      });
    },

    handleSearch() {
      this.setView();
    },
    handleFilterSubmit() { },
    handleFilterClear() { },

    handleSortChange({ column, prop, order }) {
      //'ascending' 升序
      //'descending' 降序
      console.log(" column, prop, order");
      console.log(column, prop, order);
    },

    //表格操作 工具栏全选
    handleCheckAllChange(val) {
      this.isIndeterminate = false;
    },
    handleTableRowEdit(row) {
      console.warn("数据行编辑", { ...row });
      //编辑
      this.doEdit(row);
    },
    handleTableRowDelete(row) {
      console.warn("数据行编辑", { ...row });
      //编辑
      this.doDelete(row);
    },

    // 表格行操作
    handleTableRowCommand(command, row) {
      this.$logjson("表格行操作 command = " + command, { ...row });

      let eventhandle = this.tableRowActionButtonsEventMap[command];
      if (eventhandle) {
        if(eventhandle.includes('emit@')) {
          let emit_name = eventhandle.split('@')[1]
          this.$emit(emit_name, {
            type: command,
            item: row
          });
        } else {
          this[eventhandle](row, command);
        }

        
        return;
      }

      if (command == "删除") {
        this.doDelete(row);
      } else if (command == "编辑") {
        this.doEdit(row);
      } else if (command == "编辑商品") {
        this.doEditProduct(row);
      } else if (command == "预览新闻") {
        //新闻列表-新闻预览
        this.doNewsPreview(row);
      } else if (command == "相关新闻") {
        //新闻列表-相关新闻
        this.doNewsRelativeNews(row);
      } else if (command == "查看评论") {
        //查看新闻列表某条新闻的评论内容
        this.doNewsComments(row);
      } else if (command == "查看回复") {
        //查看新闻评论列表某条评论的回复内容
        this.doNewsCommentsReply(row);
      } else if (command == "话题相关新闻") {
        this.doTopicRelativeNews(row);
      } else if (command == "话题相关事件") {
        this.doTopicRelativeScene(row);
      } else if (command == "设为热搜") {
        this.doNewsSetHot(row);
      } else if (command == "查看作品") {
        this.doCreationPreivew(row);
      } else if (command == "举报详情") {
        this.doEventCallback(row, command);
      } else if (command == "活动报名信息") {
        this.doActivityBooking(row);
      } else if (command == "活动作品") {
        this.doActivityCreation(row);
      } else if (command == "权限") {
        this.doRoleSetting(row);
      } else if (command == "订单详情") {
        this.doOrderDetail(row);
      } else if (command == "会员详情") {
        this.doUserDetail(row);
      }
      // else if (command == "添加事件") {
      //   this.doTopicAddScene(row);
      // }
    },

    doEventCallback(row, command) {
      let option = {
        type: command,
        item: row,
      };
      this.$emit("eventCallback", option);
    },

    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);

      this.pagination.pageNum = val;
      this.setView();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);

      this.pagination.page = val;

      this.setView();
    },
    //分页

    // 下拉选
    handleCommand(command) {
      console.log("下拉选", command);
    },
    // 下拉选
    handleUtilCommand(command) {
      console.log("下拉选", command);
    },

    handleCrudAction(item) {
      console.warn("handleCrudAction", { ...item });
      let title = item.title;
      let scene = item.scene;
      if (item.emit) {
        // debugger
        // this[eventhandle](item, title);
        this.$emit(item.emit, {
          type: item.title
        })
        return;
      }
      //
      if (title == "添加") {
        if (scene == "优惠券-添加") {
          this.$router.push("/couponAdd");
        } else if (scene == "商品-添加") {
          this.$router.push("/productForm");
        } else {
          this.doAdd();
        }
      }
    },

    // 事件回调
    parentHandleUpload(opt) {
      let { type, colName, file, res } = opt;
      console.log("父组件处理文件上传", opt);
      if (type == "上传成功") {
        // this.list_upload.push(res.data);
        if (colName == "项目附件") {
          this.list_upload_gaishu.push({
            name: file.name,
            url: res.data,
          });
        }
      } else if ("删除成功") {
        // let index = this.list_upload.findIndex((v) => v == res.data);
        // this.list_upload.splice(index, 1);
        if (colName == "项目附件") {
          let index = this.list_upload_gaishu.findIndex((v) => v.url == res.data);
          this.list_upload_gaishu.splice(index, 1);
        }
      }
    },

    // 组件事件回调
    eventCallback(option) {
      let {
        // 来源
        // 是否需要刷新
        from,
        reflush,
      } = option;

      if (reflush) {
        this.setView();
      }

      console.warn("事件回调 option", JSON.parse(JSON.stringify(option)));
    },

    // 增删改查
    doAdd() {
      this.$refs[this.apiConfig.add.modalref || "modal_content_base"].init({
        mode: "add",
        formColumns: this.formColumns,
        apiConfig: this.apiConfig,
      });
    },

    doDelete(item) {
      this.$confirm("确定删除该内容？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // this.$message({
          //   type: "success",
          //   message: "删除成功!",
          // });
          let idKey = this.apiConfig.idKey;
          let url = this.formatVariableApiUrl({
            url: this.apiConfig.delete.action,
            idKey: idKey,
            idVal: item[idKey],
          });

          this.$api({
            action: this.apiConfig.delete.action,
            [idKey]: item[idKey]
            // url: url,
          }).then((res) => {
            alert(res);
            if (res.code == 200) {
              this.setView();
            }
          });
        })
        .catch(() => {
          alertInfo("已取消删除");
        });
    },

    doEdit(item) {
      this.$refs[this.apiConfig.edit.modalref || "modal_content_base"].init({
        mode: "edit",
        idKey: this.apiConfig.idKey,
        formColumns: this.formColumns,
        apiConfig: this.apiConfig,
        data: JSON.parse(JSON.stringify(item)),
      });
    },
    doEditProduct(item) {
      this.$router.push({
        path: '/productForm',
        query: {
          id: item.id,
          ggid: item.inventoryId
        }
      });

    },

    //新闻设为热搜
    doNewsSetHot(item) {
      // console.warn("新闻资讯-设置热搜", { ...item });
      // this.$refs.modal_iframe_page.init({
      //   pageActionType: "话题-相关事件",
      //   routeName: "newsScene",
      //   modalTitle: "相关事件",
      //   data: item,
      //   hiddenColumnsForAdd: [
      //     //需要在新增弹窗中隐藏的表单项目
      //     {
      //       col: "topicId",
      //       label: "话题",
      //       val: item.topicId,
      //     },
      //   ],
      // });

      let { apiConfig, formColumns } = this.otherModule["热搜"];

      this.$refs["modal_content_base"].init({
        mode: "add",
        formColumns: formColumns,
        apiConfig: apiConfig,
        customModalTitle: "设置热搜",
        customFormData: {
          newsId: item.newsId,
        },
      });
    },

    //新闻预览
    doNewsPreview(item) {
      //新闻预览
      // this.$router.push("/newsContentComments?newsId=" + item.newsId);
      this.$refs.modal_news_preview.init({
        pageActionType: "新闻-新闻预览",
        modalTitle: "新闻预览",
        data: item,
      });
    },

    doNewsRelativeNews(item) {
      //相关新闻
      // this.$router.push("/newsContentComments?newsId=" + item.newsId);
      this.$refs.modal_relative_news_list.init({
        pageActionType: "新闻-相关新闻",
        routeName: "newsContent",
        modalTitle: "相关新闻",
        data: item,
        targetKey: "newsId",
        targetId: item.newsId,
        otherQueryParams: {
          newsId: item.newsId,
        },
      });
    },

    //评论查看
    doNewsComments(item) {
      //新闻评论
      // this.$router.push("/newsContentComments?newsId=" + item.newsId);
      this.$refs.modal_iframe_page.init({
        pageActionType: "新闻-新闻评论",
        routeName: "newsContentComments",
        modalTitle: "新闻评论",
        data: item,
        otherQueryParams: {
          newsId: item.newsId,
        },
      });
    },
    //回复查看
    doNewsCommentsReply(item) {
      this.$refs.modal_iframe_page.init({
        pageActionType: "新闻评论-评论回复",
        routeName: "newsContentCommentsReply",
        modalTitle: "评论回复",
        data: item,
        otherQueryParams: {
          newsId: item.newsId,
          commentId: item.commentId,
        },
      });
      //新闻评论回复
      // this.$router.push(
      //   "/newsContentCommentsReply?newsId=" + item.newsId + "&commentId=" + item.commentId
      // );
    },
    //话题相关新闻
    doTopicRelativeNews(item) {
      // this.$refs.modal_iframe_page.init({
      //   pageActionType: "话题-相关新闻",
      //   routeName: "newsContent",
      //   modalTitle: "相关新闻",
      //   data: item,
      //   otherQueryParams: {
      //     topicId: item.topicId,
      //   },
      // });

      this.$refs.modal_relative_news_list.init({
        pageActionType: "话题-相关新闻",
        routeName: "newsContent",
        modalTitle: "话题相关新闻",
        data: item,
        targetKey: "topicId",
        targetId: item.topicId,
        otherQueryParams: {
          topicId: item.topicId,
        },
      });
    },
    //话题相关事件
    doTopicRelativeScene(item) {
      this.$refs.modal_iframe_page.init({
        pageActionType: "话题-相关事件",
        routeName: "newsScene",
        modalTitle: "相关事件",
        data: item,
        hiddenColumnsForAdd: [
          //需要在新增弹窗中隐藏的表单项目
          {
            col: "topicId",
            label: "话题",
            val: item.topicId,
          },
        ],
        otherQueryParams: {
          topicId: item.topicId,
        },
      });
    },
    //话题添加事件
    doTopicAddScene(item) {
      // this.$refs[this.apiConfig.edit.modalref || "modal_content_base"].init({
      //   mode: "edit",
      //   idKey: this.apiConfig.idKey,
      //   formColumns: this.formColumns,
      //   apiConfig: this.apiConfig,
      //   data: JSON.parse(JSON.stringify(item)),
      // });
    },

    //作品浏览
    doCreationPreivew(item) {
      this.$refs.modal_creation_preview.init({
        pageActionType: "作品-查看作品",
        modalTitle: "作品详情",
        data: item,
      });
    },
    //活动报名信息
    doActivityBooking(item) {
      this.$router.push("/activityBooking?activity=" + item.id);
    },
    //活动作品信息
    doActivityCreation(item) {
      this.$router.push("/creationManager?activity=" + item.id);
    },

    //权限设置
    doRoleSetting(item) {
      this.$refs.modal_role_setting.init({
        pageActionType: "角色管理-设置权限",
        modalTitle: "设置权限",
        data: item,
      });
    },
    //订单
    doOrderDetail(item) {
      // this.$refs.modal_order_detail.init({
      //   pageActionType: "订单管理-订单详情",
      //   modalTitle: "订单详情",
      //   data: item,
      // });
      this.$router.push("/order-detail?id=" + item.id);
    },

    //会员
    doUserDetail(item) {
      // this.$refs.modal_order_detail.init({
      //   pageActionType: "订单管理-订单详情",
      //   modalTitle: "订单详情",
      //   data: item,
      // });
      this.$router.push("/userDetail?id=" + item.id);
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .table-image-list {
  display: flex;

  .table-image-item {
    &+.table-image-item {
      margin-left: 10px;
    }
  }
}

/deep/ .el-table table {
  width: 100% !important;

  thead {
    th.el-table__cell {
      background: #f8f8f8;
      color: #000;
      // font-weight: bold;
    }
  }
}

.page-table-ctx-wrap {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
}

// 新增
.control-box {
  display: flex;
		align-items: center;
		justify-content: space-between;

  .control-left {
    display: flex;
		align-items: center;

    .control-item {
      margin-right: 10px;
    }
  }

  .control-right {
    display: flex;
		align-items: center;

    .action-item {
      margin-left: 10px;
    }
  }
}

.table-view {
  margin-top: 20px;
  margin-bottom: 20px;
}

.filter-box {
  margin-top: 20px;
  padding: 20px;
  padding-bottom: 0;
  background: rgb(248, 249, 250);
}

// 表格工具栏
.table-util {
  display: flex;
		align-items: center;
		justify-content: space-between;

  .util-left {
    display: flex;
		align-items: center;
    min-width: 100px;

    .util-items {
      display: flex;
		align-items: center;

      .item {
        margin-right: 10px;
      }
    }
  }

  .util-right {}
}

.cus-current-page {
  text-align: center;
}

.checked-count {
  margin-left: 20px;
  margin-right: 20px;
}

.row-actions-box {
  text-align: center;
  display: flex;
	align-items: center;
	justify-content: center;

  .row-action {
    &+.row-action:before {
      content: "";
      display: inline-block;
      width: 2px;
      height: 12px;
      background: #aaa;
      margin: 0 12px;
      margin: 0 6px;
      position: relative;
      top: 2px;
    }
  }

  .divider {}
}
</style>
