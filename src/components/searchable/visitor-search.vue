<template>
  <div class="clientDevice-search" @click.stop>
    <div class="filter-item">
      <div class="filter-label">访客：</div>
      <div class="filter-val">
        <div class="date-list">
          <div class="date-item" v-for="(item, index) in config_visitor" :key="index" :class="{ active: item.title == select_visitor.title }" @click="toggle_visitor(item)">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "area-search",
  components: {},
  props: [],
  data() {
    return {
      select_visitor: { title: "全部", val: '' },
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},

  created() {},

  methods: {
    //设备
    toggle_visitor(item) {
      this.select_visitor = item;

      this.$parent.childUpdateParentParams({
        visitor: item.val
      });
    },
  },
};
</script>

<style scoped lang="less">
.filter-item {
  display: flex;
		align-items: center;

  .filter-label {
    padding-right: 5px;
    line-height: 24px;
    color: #787a7d;
  }

  .date-list {
    display: flex;
		align-items: center;

    .date-item {
      min-width: 44px;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      color: #323437;
      background-color: #fff;
      cursor: pointer;
      transition: 0.5s;
      border: 1px solid #e1e3e4;
      border-right: none;
      // border-left: none;

      &:first-child {
        // border-left: 1px solid #e1e3e4;
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
    }
  }

  .area-item {
    display: flex;
		align-items: center;
    border: 1px solid #d9dbdc;
    cursor: pointer;

    .area-input {
      height: 24px;
      width: 76px;
      padding: 0 10px;
    }
    .area-arrow {
      height: 24px;
      width: 24px;
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
</style>
