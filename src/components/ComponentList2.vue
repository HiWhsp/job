<template>
  <div class="components-list ai-components-list">
    <div v-for="(item, index) in components" :key="index">
      <div class="component-item-title" v-if="depth === 0">
        {{ item.title }} 
      </div>

      <!-- 如果有子组件，递归渲染 -->
      <template v-if="item.child && item.child.length > 0">
        <ComponentList :components="item.child" :depth="depth + 1" :configOrderNumber="configOrderNumber" />
      </template>

      <!-- 如果有产品信息，渲染产品列表 -->
      <template v-else-if="item.producntInfos && item.producntInfos.length > 0">
        <div
          class="config-item-row"
          v-for="(value, i) in item.producntInfos"
          :key="i"
        >
          <template v-if="value.thumb">
            <div class="item-thumbnail">
              <img :src="value.thumb" alt="" />
            </div>
            <div class="item-details">
              <div class="item-name">{{ value.title }}</div>
              <div class="item-model">{{ value.description }}</div>
            </div>
            <div class="item-params">参数信息：{{ paramsText(value) }}</div>
            <div class="item-progress">
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
            <div class="item-price">
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
            <div class="item-edit" v-if="!configOrderNumber">
              <i class="el-icon-edit" @click="editItem(item)"></i>
            </div>
          </template>
          <template v-else>
            <div class="item-details">
              {{ item.title }}
            </div>
            <div class="item-params">
              <p>{{ value.title }}</p>
              <p>{{ paramsText(value) }}</p>
            </div>
            <div class="item-progress">
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
            <div class="item-price">
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
            <div class="item-edit" v-if="!configOrderNumber">
              <i class="el-icon-edit" @click="editItem(item)"></i>
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
    depth: {
      type: Number,
      default: 0,
    },
    configOrderNumber: {
      type: String,
      default: "",
    },
  },
  methods: {
    paramsText(item) {
      if (item.name == "其他") {
        return item.params.notes;
      } else if (item.firstTitle == "颜色" && item.name == "定制") {
        const notes = item.params.notes;
        if (notes) {
          return `${notes.pantone ? `潘通色号: ${notes.pantone}` : ""} ${
            notes.ral ? `劳尔色号: ${notes.ral}` : ""
          } ${
            notes.rgba
              ? `RGBA色彩: ${
                  notes.rgba.includes("#") ? notes.rgba : "#" + notes.rgba
                }`
              : ""
          }`;
        }
        return "";
      }
      if (item.firstTitle == "定制logo" && item.name == "定制logo") {
        return item.params.notes;
      }
      return item.spec || "";
    },
    // 编辑配置项
    editItem(item) {
      console.log("item", item);
      this.$router.push({
        path: "/",
        query: {
          id: this.id,
          edit: true,
          index: item.activeTab,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../views/aiRecommendation.less";
.components-list {
  padding: 0;
}
.config-item-row {
  display: flex;
  align-items: center;
  padding: 20px 0;
  gap: 20px;
  border-bottom: 1px solid #565656;

  .item-thumbnail {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      width: 100%;
      height: 100%;
      background: #555;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 12px;
    }
  }

  .item-details {
    flex: 1;
    min-width: 200px;

    .item-name {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 5px;
    }

    .item-model {
      font-size: 14px;
      color: #ffffff;
    }
  }

  .item-progress {
    min-width: 250px;

    .progress-bar-container {
      position: relative;
      width: 135px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .progress-bar-track {
        position: relative;
        width: 100%;
        height: 10px;
        background: linear-gradient(90deg, #a8a8a8 0%, #8a8a8a 100%);
        border-radius: 10px;
        overflow: visible;

        .progress-bar-fill {
          position: relative;
          height: 100%;
          background: linear-gradient(
            90deg,
            #10c785 0%,
            #0bb376 50%,
            #08a568 100%
          );
          border-radius: 10px;
          transition: width 0.3s ease;

          .progress-slider {
            position: absolute;
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            background: #37b182;
            border-radius: 50%;

            &::before {
              content: "";
              position: absolute;
              top: 60%;
              left: 40%;
              width: 2px;
              height: 6px;
              background: #ffffff;
              transform-origin: top center;
              transform: translate(-50%, -1px) rotate(-90deg);
              border-radius: 1px;
              z-index: 2;
            }

            &::after {
              content: "";
              position: absolute;
              top: 55%;
              left: 46%;
              width: 2px;
              height: 5px;
              background: #ffffff;
              transform-origin: top center;
              transform: translate(-50%, -1px) rotate(180deg);
              border-radius: 1px;
              z-index: 2;
            }
          }
        }
      }

      .progress-label {
        box-sizing: border-box;
        width: 100%;
        font-size: 12px;
        color: #b0b0b0;
        font-weight: 400;
      }
    }

    .progress-text {
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  }

  .item-price {
    width: 25px;
    margin-right: 50px;
    .price-icon {
      object-fit: cover;
      vertical-align: top;
      width: 100%;
    }
  }

  .item-edit {
    cursor: pointer;
    color: #999;
    font-size: 16px;
    transition: color 0.3s ease;

    &:hover {
      color: #00975d;
    }
  }
}

.item-details {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}

.item-params {
  width: 410px;
  font-size: 14px;
  color: #999;
  min-width: 150px;
  margin-right: 50px;
}
</style>
