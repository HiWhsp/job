<template>
  <div class="components-list ai-components-list">
    <div v-for="(item, index) in components" :key="index">
      <div class="component-item-title">{{ item.title }}</div>

      <!-- 如果有子组件，递归渲染 -->
      <template v-if="item.child && item.child.length > 0">
        <ComponentList :components="item.child" />
      </template>

      <!-- 如果有产品信息，渲染产品列表 -->
      <template v-else-if="item.producntInfos && item.producntInfos.length > 0">
        <div
          class="component-item"
          v-for="(value, i) in item.producntInfos"
          :key="i"
        >
          <template v-if="value.thumb">
            <div class="component-icon">
              <img :src="value.thumb" alt="" />
            </div>
            <div class="component-info">
              <div class="component-name">
                {{ value.title }}
              </div>
              <div class="component-leadtime">{{ value.description }}</div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill">
                <div class="progress-bar-container">
                  <div class="progress-bar-track">
                    <div
                      class="progress-bar-fill"
                      :style="{
                        width:
                          (value.delivery_time * 20 > 100
                            ? 100
                            : value.delivery_time * 20) + '%',
                      }"
                    >
                      <span class="progress-slider"> </span>
                    </div>
                  </div>
                  <div class="progress-label">
                    {{ value.delivery_title }}
                  </div>
                </div>
              </div>
              <div class="coin-icon">
                <img
                  src="@/assets/img/icon/Group1.png"
                  alt="price"
                  class="price-icon"
                  v-if="value.price_status == 1"
                />
                <img
                  src="@/assets/img/icon/Group2.png"
                  alt="price"
                  class="price-icon"
                  v-if="value.price_status == 2"
                />
                <img
                  src="@/assets/img/icon/Group3.png"
                  alt="price"
                  class="price-icon"
                  v-if="value.price_status == 3"
                />
                <img
                  src="@/assets/img/icon/Group4.png"
                  alt="price"
                  class="price-icon"
                  v-if="value.price_status == 4"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="component-info">
              <div class="component-name">
                {{ value.title }} {{ value.description }}
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentList",
  props: {
    components: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
};
</script>

<style lang="less" scoped>
@import "../views/aiRecommendation.less";
</style>
