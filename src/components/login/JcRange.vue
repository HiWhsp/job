<template>
  <div class="jc-component__range">
    <div class="jc-range" :class="rangeStatus ? 'success' : ''">
      <i
        @mousedown="rangeMove"
        :class="rangeStatus ? successIcon : startIcon"
      ></i>
      {{ rangeStatus ? successText : startText }}
    </div>
  </div>
</template>


<script>
export default {
  props: {
    // 成功之后的函数
    successFun: {
      type: Function,
    },
    //成功图标
    successIcon: {
      type: String,
      default: "el-icon-success",
    },
    //成功文字
    successText: {
      type: String,
      default: "验证成功",
    },
    //开始的图标
    startIcon: {
      type: String,
      default: "el-icon-d-arrow-right",
    },
    //开始的文字
    startText: {
      type: String,
      default: "请按住滑块，拖动到最右边",
    },
    //失败之后的函数
    errorFun: {
      type: Function,
    },
    //或者用值来进行监听
    status: {
      type: String,
    },
  },
  data() {
    return {
      disX: 0,
      rangeStatus: false,
    };
  },
  methods: {
    //滑块移动
    rangeMove(e) {
      let ele = e.target;
      let startX = e.clientX;
      let eleWidth = ele.offsetWidth;
      let parentWidth = ele.parentElement.offsetWidth;
      let MaxX = parentWidth - eleWidth;
      if (this.rangeStatus) {
        //不运行
        return false;
      }
      document.onmousemove = (e) => {
        let endX = e.clientX;
        this.disX = endX - startX;
        if (this.disX <= 0) {
          this.disX = 0;
        }
        if (this.disX >= MaxX - eleWidth) {
          //减去滑块的宽度,体验效果更好
          this.disX = MaxX;
        }
        ele.style.transition = ".1s all";
        ele.style.transform = "translateX(" + this.disX + "px)";
        e.preventDefault();
      };
      document.onmouseup = () => {
        // debugger
        if (this.disX !== MaxX) {
          ele.style.transition = ".5s all";
          ele.style.transform = "translateX(0)";
          //执行成功的函数
          this.errorFun && this.errorFun();
        } else {
          this.rangeStatus = true;
          if (this.status) {
            this.$parent[this.status] = true;
          }
          //执行成功的函数
          this.successFun && this.successFun();
        }
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
  },
};
</script>


<style scoped lang="less">
.jc-component__range {
  .jc-range {
    background-color: #e9e9e9;
    position: relative;
    transition: 1s all;
    user-select: none;
    color: #585858;

    display: flex;
    justify-content: center;
    align-items: center;

    height: 40px; /*no*/
    &.success {
      background-color: #7ac23c;
      color: #fff;
      i {
        color: #7ac23c;
      }
    }
    i {
      position: absolute;
      left: 0;
      width: 50px; /*no*/
      height: 100%;
      color: #7ac23c;
      background-color: #fff;
      border: 1px solid #d8d8d8;
      cursor: pointer;
      font-size: 24px;

      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
