<template>
  <div class="sanji-wrap">
    <div class="sanji-box">
      <el-select v-model="sheng" placeholder="请选择省" @change="change_sheng">
        <el-option
          v-for="item in list_sheng"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select v-model="shi" placeholder="请选择市" @change="change_shi">
        <el-option
          v-for="item in list_shi"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select v-model="qu" placeholder="请选择区" @change="change_qu">
        <el-option
          v-for="item in list_qu"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
// import address from "@/shop-actions/address";

import { mapState } from "vuex";

export default {
  name: "sanjiliandong",
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
    //查询省份
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
    //更新父组件省市区
    update_shengshiqu() {
      let obj_sheng = {};
      let obj_shi = {};
      let obj_qu = {};
      if (this.sheng) {
        obj_sheng = this.list_sheng.find((v) => v.id == this.sheng);
      }
      if (this.shi) {
        obj_shi = this.list_shi.find((v) => v.id == this.shi);
      }
      if (this.qu) {
        obj_qu = this.list_qu.find((v) => v.id == this.qu);
      }

      let obj = {
        sheng: obj_sheng,
        shi: obj_shi,
        qu: obj_qu,
      };
      this.$emit("updateAddress", obj);
    },

    //父组件设置当前组件省市区数据
    async set_shengshiqu(data) {
      // debugger;
      console.log(" *********** 数据回显 ***********", { ...data });

      // console.log("shengshiqu 父组件设置当前组件省市区数据", data);
      let { province_name, city_name, area_name, province_id, city_id, area_id } = data;
      // this.sheng = province_id;
      // this.shi = city_id;
      // this.qu = area_id;

      // debugger;
      if (!this.list_sheng.length) {
        setTimeout(() => {
          this.set_shengshiqu(data);
        }, 300);

        return;
      }

      //省
      let obj_sheng = this.list_sheng.find((v) => v.title == province_name) || {};
      this.sheng = obj_sheng.id;

      //市
      let res_shi = await this.$api("users_getAreaList", { parent_id: this.sheng });
      this.list_shi = res_shi.data || [];
      let obj_shi = this.list_shi.find((v) => v.title == city_name) || {};
      this.shi = obj_shi.id;

      //区
      let res_qu = await this.$api("users_getAreaList", { parent_id: this.shi });
      this.list_qu = res_qu.data || [];
      let obj_qu = this.list_qu.find((v) => v.title == area_name) || {};
      this.qu = obj_qu.id;

      console.log(" *********** 数据回显 ***********", this.obj_sheng);
      console.log(" *********** 数据回显 ***********", this.sheng);
      console.log(" *********** 数据回显 ***********", this.shi);
      console.log(" *********** 数据回显 ***********", this.qu);

      // console.log("查询城市数据 res_shi", res_shi);
      // console.log("查询区县数据 res_qu", res_qu);
    },

    //查询城市
    change_sheng(id) {
      //省份被修改了
      if (this.sheng_prev && id != this.sheng_prev) {
        this.shi = "";
        this.qu = "";
      }
      this.sheng_prev = id;

      this.address_getAreaList({
        params: { parent_id: id },
        success: (data) => {
          this.list_shi = data;
        },
      });
    },

    //查询区县
    change_shi(id) {
      //城市被修改了
      if (this.shi_prev && id != this.shi_prev) {
        this.qu = "";
      }
      this.shi_prev = id;

      this.address_getAreaList({
        params: { parent_id: id },
        success: (data) => {
          this.list_qu = data;
        },
      });
    },

    change_qu(id) {},

    address_getAreaList({ params, success } = opt) {
      this.$api("users_getAreaList", params).then((res) => {
        let { code, data } = res;
        // debugger
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
/deep/ .el-input {
  .el-input__inner {
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
