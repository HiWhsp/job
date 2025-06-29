import ProfileCompleteModal from '@/components/common/ProfileCompleteModal.vue'

const ProfileCompleteModalPlugin = {
  install(Vue) {
    // 注册全局组件
    Vue.component('ProfileCompleteModal', ProfileCompleteModal)

    // 创建一个Vue实例来管理弹窗
    const ProfileCompleteModalConstructor = Vue.extend(ProfileCompleteModal)
    let instance = null

    // 全局方法：显示完善信息弹窗
    Vue.prototype.$showProfileComplete = function (options = {}) {
      if (!instance) {
        instance = new ProfileCompleteModalConstructor({
          data: {
            ...options
          }
        })
        instance.$mount()
        document.body.appendChild(instance.$el)
      }

      // 绑定事件监听器
      instance.$off() // 先移除所有监听器

      if (options.onSubmitSuccess) {
        instance.$on('submit-success', options.onSubmitSuccess)
      }

      if (options.onClose) {
        instance.$on('close', options.onClose)
      }

      instance.show()
      return instance
    }

    // 全局方法：隐藏完善信息弹窗
    Vue.prototype.$hideProfileComplete = function () {
      if (instance) {
        instance.hide()
      }
    }

    // 全局对象：提供更灵活的调用方式
    Vue.prototype.$profileComplete = {
      show(options = {}) {
        return Vue.prototype.$showProfileComplete(options)
      },

      hide() {
        Vue.prototype.$hideProfileComplete()
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

export default ProfileCompleteModalPlugin 