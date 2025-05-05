<template>
  <div class="sanji-wrap">
    <div class="sanji-box">
      <el-select v-model="sheng" placeholder="请选择省" @change="change_sheng">
        <el-option v-for="item in list_sheng" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="shi" placeholder="请选择市" @change="change_shi">
        <el-option v-for="item in list_shi" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="qu" placeholder="请选择区" @change="change_qu">
        <el-option v-for="item in list_qu" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {areaData} from '@/views/product/address.js'

export default {
  name: "area_select",
  components: {},
  data() {
    return {
      //id
      sheng: "",
      shi: "",
      qu: "",

      //之前的id
      sheng_prev: "",
      shi_prev: "",
      qu_prev: "",

      //列表
      list_sheng: [],
      list_shi: [],
      list_qu: [],
    };
  },

  watch: {
    sheng() {
      this.update_shengshiqu();
    },
    shi() {
      this.update_shengshiqu();
    },
    qu() {
      this.update_shengshiqu();
    },
  },

  created() {
    this.address_getAreaList({
      params: {},
      success: (data) => {
        this.list_sheng = data;
      },
    });
  },

  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = null;
  },

  methods: {
    clear() {
      this.sheng = ''
      this.shi = ''
      this.qu = ''

      // this.list_sheng = []
      this.list_shi = []
      this.list_qu = []
    },

    //更新父组件省市区
    update_shengshiqu() {
      let obj_sheng = {};
      let obj_shi = {};
      let obj_qu = {};
      if (this.sheng) {
        obj_sheng = this.list_sheng.find((v) => v.value === this.sheng);
      }
      if (this.shi) {
        obj_shi = this.list_shi.find((v) => v.value === this.shi);
      }
      if (this.qu) {
        obj_qu = this.list_qu.find((v) => v.value === this.qu);
      }

      let obj = {
        sheng: obj_sheng,
        shi: obj_shi,
        qu: obj_qu,
      };
      this.$emit("change", obj);
    },

    //父组件设置当前组件省市区数据
    async init(data) {
      this.$log('初始化', data)
      //console.log("父组件设置当前组件省市区数据", data);
      let {province, city, area, provinceCode, cityCode, areaCode} = data;
      // this.sheng = province_id;
      // this.shi = city_id;
      // this.qu = area_id;

      //省
      let obj_sheng = this.list_sheng.find((v) => v.value == provinceCode || v.value == province) || {};
      console.log(obj_sheng)
      this.sheng = obj_sheng.value;

      //解决初始回显慢的问题
      this.list_shi = [{value: cityCode, label: city}]
      this.shi = cityCode
      this.list_qu = [{value: areaCode, label: area}]
      this.qu = areaCode
      //解决初始回显慢的问题

      //市
      let res_shi = this.change_sheng(this.sheng);
      this.list_shi = res_shi || [];
      let obj_shi = this.list_shi.find((v) => v.id == cityCode || v.id == city) || {};
      this.shi = obj_shi.value;

      //区
      let res_qu = this.change_shi(this.shi);
      this.list_qu = res_qu || [];
      let obj_qu = this.list_qu.find((v) => v.id == areaCode || v.id == area) || {};
      this.qu = obj_qu.value;

      //console.log("查询城市数据 res_shi", res_shi);
      //console.log("查询区县数据 res_qu", res_qu);
    },

    //查询城市
    change_sheng(id) {
      //省份被修改了
      if (this.sheng_prev && id != this.sheng_prev) {
        this.shi = "";
        this.qu = "";
      }
      this.sheng_prev = id;
      this.list_sheng.forEach(v => {
        if (v.value === id) {
          console.log(v.children)
          this.list_shi = v.children
        }
      })
      return this.list_shi
    },

    //查询区县
    change_shi(id) {
      //城市被修改了
      if (this.shi_prev && id != this.shi_prev) {
        this.qu = "";
      }
      this.shi_prev = id;
      this.list_shi.forEach(v => {
        if (v.value === id) {
          this.list_qu = v.children
        }
      })
      return this.list_qu
    },

    change_qu(id) {
    },

    address_getAreaList({params, success} = opt) {
      success(areaData)
      // this.$api({
      //   url: "getArea",
      //   method: "get",
      // }).then((res) => {
      //   let {code, data} = res;
      //   // debugger
      //   if (code == 200) {
      //     if (success) {
      //       success(data);
      //     }
      //   }
      // });
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .el-switch.is-checked .el-switch__core {
  background-color: @theme !important;
  border-color: @theme !important;
}

/deep/ .el-input {
  .el-input__inner {
    background: #f2f2f2;
    background: #fff;

    &:disabled {
      background-color: #eee;
      color: #666;
    }
  }
}

.sanji-box {
  display: flex;

  .el-select {
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
