import Vue from "vue";
import LoginRequiredModal from "@/components/login/LoginRequiredModal.vue";
import router from "@/router";
import store from "@/store";

let hostVm = null;

function ensureHost() {
  if (hostVm) return hostVm;

  const Host = Vue.extend({
    name: "LoginRequiredModalHost",
    data() {
      return {
        visible: false,
        message: null,
        buttonText: null,
        loginPath: null,
        _onClose: null,
        _onAction: null,
      };
    },
    render(h) {
      const props = { visible: this.visible };
      if (this.message != null) props.message = this.message;
      if (this.buttonText != null) props.buttonText = this.buttonText;
      if (this.loginPath != null) props.loginPath = this.loginPath;

      return h(LoginRequiredModal, {
        props,
        on: {
          "update:visible": (v) => {
            this.visible = v;
          },
          close: () => {
            const fn = this._onClose;
            this._onClose = null;
            this._onAction = null;
            if (fn) fn();
          },
          action: () => {
            const fn = this._onAction;
            this._onClose = null;
            this._onAction = null;
            if (fn) fn();
          },
        },
      });
    },
  });

  hostVm = new Host({ router, store });
  hostVm.$mount();
  document.body.appendChild(hostVm.$el);
  return hostVm;
}

function open(options = {}) {
  const vm = ensureHost();
  vm.message =
    options.message !== undefined ? options.message : null;
  vm.buttonText =
    options.buttonText !== undefined ? options.buttonText : null;
  vm.loginPath =
    options.loginPath !== undefined ? options.loginPath : null;
  vm._onClose =
    typeof options.onClose === "function" ? options.onClose : null;
  vm._onAction =
    typeof options.onAction === "function" ? options.onAction : null;
  vm.visible = true;
}

function close() {
  if (hostVm) hostVm.visible = false;
}

export default function install(Vue) {
  Vue.component("LoginRequiredModal", LoginRequiredModal);
  const api = (options) => open(options);
  api.close = close;
  Vue.prototype.$LoginRequiredModal = api;
}
