<template>
  <div class="delivery-method-container">
    <div class="delivery-list" v-if="fahuoInfo && fahuoInfo.length > 0">
      <div
        class="delivery-item"
        v-for="(item, index) in fahuoInfo"
        :key="index"
      >
        <div class="delivery-header">
          <span class="type-label">{{ item.type }}</span>
        </div>
        <div class="delivery-content">
          <div class="delivery-name">
            {{ item.name }}
            <span class="copy-btn" @click="copyText(item.name)" title="复制">
              <i class="el-icon-document-copy"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-tip" v-else>
      <p>暂无物流信息</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "delivery-method",
  props: {
    fahuoInfo: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    copyText(text) {
      // 使用原生方法复制
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.$message.success("复制成功");
    },
  },
};
</script>

<style scoped lang="less">
.delivery-method-container {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;

  .delivery-list {
    .delivery-item {
      margin-bottom: 20px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 4px;
      border: 1px solid #e5e5e5;

      &:last-child {
        margin-bottom: 0;
      }

      .delivery-header {
        margin-bottom: 12px;
        display: flex;
        align-items: center;

        .type-label {
          display: inline-block;
          padding: 4px 12px;
          background: #f74747;
          color: #ffffff;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
      }

      .delivery-content {
        .delivery-name {
          font-size: 14px;
          color: #333333;
          line-height: 20px;
          word-break: break-all;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .copy-btn {
            margin-left: 8px;
            cursor: pointer;
            color: #f74747;
            font-size: 16px;
            transition: all 0.3s;

            &:hover {
              color: #d63031;
              transform: scale(1.1);
            }
          }
        }
      }
    }
  }

  .empty-tip {
    text-align: center;
    padding: 40px 0;
    color: #999999;
    font-size: 14px;
  }
}
</style>
