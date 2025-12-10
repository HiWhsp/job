import Vue from "vue";

// 动态导入组件
const componentMap = {
  "delivery-method": () => import("@/components/order/delivery-method.vue"),
  // 可以在这里添加更多组件映射
};

// Modal 实例管理
let modalInstance = null;

const Modal = {
  open(options = {}) {
    const {
      title = "提示",
      component,
      data = {},
      width = "500px",
      height = "auto",
      zIndex = 2000,
      showClose = true,
      showFooter = true,
      showHeader = true,
    } = options;

    // 如果组件名不存在，提示错误
    if (!component || !componentMap[component]) {
      console.error(`组件 ${component} 不存在`);
      return;
    }

    // 动态加载组件
    componentMap[component]().then((module) => {
      const Component = module.default || module;

      // 创建 Vue 实例
      const ModalComponent = Vue.extend({
        template: `
          <el-dialog
            :title="title"
            :width="width"
            :close-on-click-modal="true"
            :visible.sync="visible"
            :before-close="handleClose"
            :z-index="zIndex"
            custom-class="custom-modal-wrap"
          >
            <component
              :is="component"
              v-bind="componentData"
              ref="componentRef"
            ></component>
            <span slot="footer" class="dialog-footer" v-if="showFooter">
              <el-button @click="handleClose">关闭</el-button>
            </span>
          </el-dialog>
        `,
        data() {
          return {
            title,
            width,
            height,
            zIndex,
            showClose,
            showFooter,
            showHeader,
            visible: true,
            component: Component,
            componentData: data,
          };
        },
        methods: {
          handleClose() {
            this.visible = false;
            // 延迟销毁，等待动画完成
            const instance = this;
            setTimeout(() => {
              if (instance && instance.$el && instance.$el.parentNode) {
                instance.$destroy();
                instance.$el.parentNode.removeChild(instance.$el);
                if (modalInstance === instance) {
                  modalInstance = null;
                }
              }
            }, 300);
          },
        },
      });

      // 创建并挂载实例
      modalInstance = new ModalComponent();
      modalInstance.$mount();
      document.body.appendChild(modalInstance.$el);
    });
  },
  close() {
    if (modalInstance) {
      modalInstance.handleClose();
    }
  },
};

// 安装插件
const install = function (Vue) {
  Vue.prototype.$modal = Modal;
};

export default {
  install,
};

