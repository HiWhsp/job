<template>
  <div class="area-search" @click.stop>
    <div id="Areas" class="filter drop-down-container">
      <span class="drop-down-label">地域：</span>
      <div class="drop-down-header" :class="{ 'btn-selected': show_level1 }" @click="toggle_area">
        <span class="drop-down-text ellipsis" data-id="all" :title="source_title">{{ source_title }}</span>
        <span class="btn-arrow">&nbsp;</span>
      </div>

      <div v-show="show_level1" class="drop-down-list hm-scroll drop-down-level1" style="width: 150px; left: 41px; top: 31px; display: block" level="1">
        <ul>
          <!-- <li class="drop-down-query-li"><span class="drop-down-search-btn">&nbsp;</span><input type="text" class="drop-down-query" placeholder="请输入关键词..." style="width: 72px" /></li> -->
          <li @mouseover="mouseover_level1('全部')" @click="click_level1('全部')" class="drop-down-li drop-down-clickable selected" :class="{ hover: select_level1 == '全部' }" data-id="all" data-children="false"><span class="drop-down-arrow-style" style="float: right; width: 6px">&nbsp;</span><span class="drop-down-li-content" title="全部">全部</span></li>
          <li @mouseover="mouseover_level1('全国')" @click="click_level1('全国')" class="drop-down-li drop-down-clickable" :class="{ hover: select_level1 == '全国' }" data-id="china" data-children="false"><span class="drop-down-arrow-style" style="float: right; width: 6px">&nbsp;</span><span class="drop-down-li-content" title="全国">全国</span></li>
          <li @mouseover="mouseover_level1('省市自治区')" @click="click_level1('省市自治区')" class="drop-down-li" :class="{ hover: select_level1 == '省市自治区' }" data-id="province" data-children="true"><span class="drop-down-arrow-style drop-down-arrow" style="float: right; width: 6px">&nbsp;</span><span class="drop-down-li-content" title="省市自治区">省市自治区</span></li>
          <li @mouseover="mouseover_level1('其他')" @click="click_level1('其他')" class="drop-down-li drop-down-clickable" :class="{ hover: select_level1 == '其他' }" data-id="other" data-children="false"><span class="drop-down-arrow-style" style="float: right; width: 6px">&nbsp;</span><span class="drop-down-li-content" title="其他">其他</span></li>
          <li class="drop-down-shortcut"><span class="drop-down-arrow-style" style="float: right; width: 6px">&nbsp;</span><span class="drop-down-li-content">快捷操作</span></li>
          <li @mouseover="mouseover_level1('北京')" @click="click_level1('北京')" class="drop-down-li drop-down-clickable shortcut-li" :class="{ hover: select_level1 == '北京' }" data-id="province,1" data-children="false"><span class="drop-down-arrow-style" style="float: right; width: 6px">&nbsp;</span><span class="drop-down-li-content" title="北京">北京</span></li>
          <li @mouseover="mouseover_level1('上海')" @click="click_level1('上海')" class="drop-down-li drop-down-clickable shortcut-li" :class="{ hover: select_level1 == '上海' }" data-id="province,2" data-children="false"><span class="drop-down-arrow-style" style="float: right; width: 6px">&nbsp;</span><span class="drop-down-li-content" title="上海">上海</span></li>
          <li @mouseover="mouseover_level1('广东')" @click="click_level1('广东')" class="drop-down-li drop-down-clickable shortcut-li" :class="{ hover: select_level1 == '广东' }" data-id="province,4" data-children="false"><span class="drop-down-arrow-style" style="float: right; width: 6px">&nbsp;</span><span class="drop-down-li-content" title="广东">广东</span></li>
        </ul>
      </div>

      <div v-show="show_level2" class="drop-down-list hm-scroll drop-down-level2" style="width: 150px; left: 193px; top: 116px" level="2">
        <ul>
          <li v-for="(item, index) in config_area" :key="index" class="drop-down-li drop-down-clickable" @mouseover="mouseover_level2(item)" @click="click_level2(item)" :class="{ hover: item.val == select_level2.val }" data-id="province,1" data-children="false">
            <span class="drop-down-arrow-style" style="float: right; width: 6px">&nbsp;</span>
            <span class="drop-down-li-content" :title="item.title">{{ item.title }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "area-search",
  components: {},
  props: ["params"],
  data() {
    return {
      show_level1: false,
      show_level2: false,
      source_title: "全部",
      select_level1: "全部",
      select_level2: {},
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {
    show(val) {
      if (val) {
      } else {
      }
    },
    search_pop_show(val) {
      if (!val) {
        this.show_level1 = false;
        this.show_level2 = false;
      } else {
      }
    },
  },

  created() {},

  methods: {
    toggle_area() {
      this.vuex_openPop();
      this.show_level1 = !this.show_level1;
    },

    mouseover_prov() {
      this.show_level2 = true;
    },
    mouseout_prov() {
      this.show_level2 = false;
    },

    mouseover_level1(type) {
      console.log("省份切换", type, new Date());
      this.select_level1 = type;
      if (type == "省市自治区") {
        this.show_level2 = true;
      } else {
        this.show_level2 = false;
      }
    },

    mouseover_level2(item) {
      console.log("省份切换", { ...item });
      this.select_level2 = item;
    },

    click_level1(item) {
      if (item == "省市自治区") {
        return;
      }

      this.show_level1 = false;
      this.show_level2 = false;
      this.select_level1 = item;

      this.source_title = item;

      let area_info = {};
      if (item == "北京" || item == "上海" || item == "广东") {
        area_info = this.config_area.find((v) => v.title == item);
      } else {
        area_info = this.config_area_tabs.find((v) => v.title == item);
      }
      this.$parent.childUpdateParentParams({
        area: area_info.val,
      });
    },
    click_level2(item) {
      this.show_level1 = false;
      this.show_level2 = false;
      this.select_level2 = item;

      this.source_title = item.title;

      this.$parent.childUpdateParentParams({
        area: item.val,
      });
    },
  },
};
</script>

<style scoped lang="less">
// 地域筛选

.hm-scroll::-webkit-scrollbar-track {
  background-color: #fff;
}

.hm-scroll::-webkit-scrollbar-thumb {
  background-color: #e1e3e4;
  background-clip: content-box;
  border-top: 5px solid rgba(255, 255, 255, 0);
  border-bottom: 5px solid rgba(255, 255, 255, 0);
  border-right: 4px solid rgba(255, 255, 255, 0);
}
.hm-scroll::-webkit-scrollbar {
  width: 8px;
}

body .ellipsis,
html .ellipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn-arrow,
.btn-hover .btn-arrow,
.btn-selected .btn-arrow {
  display: inline-block;
  height: 24px;
  width: 24px;
  border-left: 1px solid #d9dbdc;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  background-image: url("~@/assets/icon.png");

  background-position: left -403px;
  background-repeat: no-repeat;
}

.drop-down-container {
  position: relative;
}

.drop-down-container .drop-down-label {
  float: left;
  height: 26px;
  line-height: 26px;
}
.drop-down-container .drop-down-label {
  padding-right: 5px;
  color: #787a7d;
}
.drop-down-container .drop-down-header {
  display: inline-block;
  zoom: 1;
  height: 24px;
  line-height: 24px;
  border: 1px solid #d9dbdc;
  border-radius: 2px;
  cursor: pointer;
  background-color: #fff;
}
.drop-down-container .drop-down-header .drop-down-text {
  float: left;
  padding: 0 10px;
  width: 56px;
  height: 24px;
  line-height: 24px;
}

.btn-hover .btn-arrow {
  background-color: #f2f4f4;
}
.btn-selected .btn-arrow {
  background-color: #4da7fd;
  background-image: url("~@/assets/icon.png");
  background-position: left -438px;
}

:root .drop-down-list {
  border: none;
}

.drop-down-container .drop-down-list {
  z-index: 99;
  position: absolute;
  top: 31px;
  left: 0;
  padding: 5px 0;
  max-height: 260px;
  overflow-x: hidden;
  overflow-y: auto;
  // border: 1px solid #a0a2a5;
  border-radius: 2px;
  box-shadow: 0 1px 5px #ddd;
  background-color: #fff;
}
.drop-down-query {
  font-size: 12px;
}
.drop-down-container .drop-down-list ul li.drop-down-query-li .drop-down-search-btn {
  background-image: url("~@/assets/icon.png");
  float: right;
  width: 14px;
  background-position: left -564px;
  background-repeat: no-repeat;
}

.drop-down-container .drop-down-list ul li {
  padding: 0 10px;
  height: 26px;
  line-height: 26px;
  overflow: hidden;
  cursor: default;
}

.drop-down-container .drop-down-list ul li.drop-down-query-li {
  margin: 0 10px 5px;
  border: 1px solid #dedede;
  border-radius: 2px;
}
.drop-down-container .drop-down-list ul li.drop-down-clickable {
  cursor: pointer;
}
.drop-down-container .drop-down-list ul li.drop-down-li.selected {
  color: #1276e5;
}
.drop-down-container .drop-down-list ul li.drop-down-li.hover {
  background-color: #4da7fd;
  color: #fff;
}

.drop-down-container .drop-down-list ul li.drop-down-shortcut {
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  color: #787a7d;
  background-color: #f2f4f4;
}

.drop-down-container .drop-down-list ul li .drop-down-arrow {
  height: 26px;
  background-image: url("~@/assets/icon.png");
  background-position: left -1429px;
  background-repeat: no-repeat;
}

.drop-down-level2 .drop-down-li:hover {
  background-color: #4da7fd;
  color: #fff;
}

.drop-down-container .drop-down-list ul li.drop-down-li.hover .drop-down-arrow {
  background-position: left -1505px;
}
</style>
