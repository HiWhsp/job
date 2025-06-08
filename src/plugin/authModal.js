import AuthModal from '@/components/common/AuthModal.vue'

const AuthModalPlugin = {
  install(Vue) {
    // 注册全局组件
    Vue.component('AuthModal', AuthModal)

    // 创建一个Vue实例来管理弹窗
    const AuthModalConstructor = Vue.extend(AuthModal)
    let instance = null

    // 全局方法：显示登录弹窗
    Vue.prototype.$showLogin = function (options = {}) {
      if (!instance) {
        instance = new AuthModalConstructor({
          data: {
            ...options
          }
        })
        instance.$mount()
        document.body.appendChild(instance.$el)
      }

      // 绑定事件监听器
      instance.$off() // 先移除所有监听器

      if (options.onLoginSuccess) {
        instance.$on('login-success', options.onLoginSuccess)
      }

      if (options.onRegisterSuccess) {
        instance.$on('register-success', options.onRegisterSuccess)
      }

      if (options.onGetCode) {
        instance.$on('get-code', options.onGetCode)
      }

      if (options.onForgotPassword) {
        instance.$on('forgot-password', options.onForgotPassword)
      }

      if (options.onPasswordLogin) {
        instance.$on('password-login', options.onPasswordLogin)
      }

      if (options.onWechatLogin) {
        instance.$on('wechat-login', options.onWechatLogin)
      }

      if (options.onClose) {
        instance.$on('close', options.onClose)
      }

      instance.show('login')
      return instance
    }

    // 全局方法：显示注册弹窗
    Vue.prototype.$showRegister = function (options = {}) {
      if (!instance) {
        instance = new AuthModalConstructor({
          data: {
            ...options
          }
        })
        instance.$mount()
        document.body.appendChild(instance.$el)
      }

      // 绑定事件监听器
      instance.$off() // 先移除所有监听器

      if (options.onLoginSuccess) {
        instance.$on('login-success', options.onLoginSuccess)
      }

      if (options.onRegisterSuccess) {
        instance.$on('register-success', options.onRegisterSuccess)
      }

      if (options.onGetCode) {
        instance.$on('get-code', options.onGetCode)
      }

      if (options.onForgotPassword) {
        instance.$on('forgot-password', options.onForgotPassword)
      }

      if (options.onPasswordLogin) {
        instance.$on('password-login', options.onPasswordLogin)
      }

      if (options.onWechatLogin) {
        instance.$on('wechat-login', options.onWechatLogin)
      }

      if (options.onClose) {
        instance.$on('close', options.onClose)
      }

      instance.show('register')
      return instance
    }

    // 全局方法：隐藏弹窗
    Vue.prototype.$hideAuth = function () {
      if (instance) {
        instance.hide()
      }
    }

    // 全局对象：提供更灵活的调用方式
    Vue.prototype.$auth = {
      showLogin(options = {}) {
        return Vue.prototype.$showLogin(options)
      },

      showRegister(options = {}) {
        return Vue.prototype.$showRegister(options)
      },

      hide() {
        Vue.prototype.$hideAuth()
      },

      // 销毁实例
      destroy() {
        if (instance) {
          instance.$destroy()
          if (instance.$el && instance.$el.parentNode) {
            instance.$el.parentNode.removeChild(instance.$el)
          }
          instance = null
        }
      }
    }
  }
}

export default AuthModalPlugin