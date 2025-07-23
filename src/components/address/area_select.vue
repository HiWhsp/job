<template>
  <div class="sanji-wrap">
    <div class="sanji-box">
      <el-select v-model="sheng" placeholder="please select" @change="change_sheng">
        <el-option
          v-for="item in list_sheng"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <!-- <el-select v-model="shi" placeholder="请选择市" @change="change_shi">
        <el-option
          v-for="item in list_shi"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select v-model="qu" placeholder="请选择区" @change="change_qu">
        <el-option
          v-for="item in list_qu"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select> -->
    </div>
  </div>
</template>

<script>
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

      //全部数据
      all_area_data: [],
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
        this.all_area_data = data.state_list;
        // 解析省份数据
        this.list_sheng = this.parseProvinceData(data.state_list);
      },
    });
  },

  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = null;
  },

  methods: {
    // 解析省份数据
    parseProvinceData(data) {
      return data.map((item) => ({
        id: item.id,
        name: item.nameEn,
        code: item.code,
        parentId: item.parentId,
      }));
    },

    // 根据省份ID获取城市数据
    getCityData(provinceId) {
      const province = this.all_area_data.find((item) => item.id == provinceId);
      if (province && province.child) {
        return province.child.map((item) => ({
          id: item.id,
          name: item.name,
          code: item.code,
          parentId: item.parentId,
        }));
      }
      return [];
    },

    // 根据城市ID获取区县数据
    getAreaData(cityId) {
      for (let province of this.all_area_data) {
        if (province.child) {
          const city = province.child.find((item) => item.id == cityId);
          if (city && city.child) {
            return city.child.map((item) => ({
              id: item.id,
              name: item.name,
              code: item.code,
              parentId: item.parentId,
            }));
          }
        }
      }
      return [];
    },

    clear() {
      this.sheng = "";
      this.shi = "";
      this.qu = "";

      // this.list_sheng = []
      this.list_shi = [];
      this.list_qu = [];
    },

    //更新父组件省市区
    update_shengshiqu() {
      let obj_sheng = {};
      let obj_shi = {};
      let obj_qu = {};
      if (this.sheng) {
        obj_sheng = this.list_sheng.find((v) => v.id == this.sheng);
      }
      // if (this.shi) {
      //   obj_shi = this.list_shi.find((v) => v.id == this.shi);
      // }
      // if (this.qu) {
      //   obj_qu = this.list_qu.find((v) => v.id == this.qu);
      // }

      let obj = {
        sheng: obj_sheng,
        shi: obj_shi,
        qu: obj_qu,
      };
      this.$emit("change", obj);
    },

    //父组件设置当前组件省市区数据
    async init(data) {
      this.$log("初始化", data);
      //console.log("父组件设置当前组件省市区数据", data);
      let { provinceName, provinceId } = data;

      setTimeout(() => {
        //省
        let obj_sheng =
          this.list_sheng.find((v) => v.id == provinceId || v.name == provinceName) || {};
        this.sheng = obj_sheng.id;
      }, 1000);
    },

    //查询城市
    change_sheng(id) {
      //省份被修改了
      if (this.sheng_prev && id != this.sheng_prev) {
        this.shi = "";
        this.qu = "";
      }
      this.sheng_prev = id;

      // 从全部数据中获取城市数据
      this.list_shi = this.getCityData(id);
      this.list_qu = []; // 清空区县数据
    },

    //查询区县
    change_shi(id) {
      //城市被修改了
      if (this.shi_prev && id != this.shi_prev) {
        this.qu = "";
      }
      this.shi_prev = id;

      // 从全部数据中获取区县数据
      this.list_qu = this.getAreaData(id);
    },

    change_qu(id) {},

    address_getAreaList({ params, success } = opt) {
      this.$api({
        url: "provinceList",
        method: "get",
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          if (success) {
            success(data);
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-switch.is-checked .el-switch__core {
  background-color: #009f39 !important;
  border-color: #009f39 !important;
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
