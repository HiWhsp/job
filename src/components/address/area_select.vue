<template>
  <div class="sanji-wrap">
    <div class="sanji-box">
      <el-select v-model="provId" placeholder="Please select a country" @change="changeProv">
        <el-option
          v-for="item in provData"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select v-model="cityId" placeholder="Please select a state" @change="changeCity">
        <el-option
          v-for="item in cityData"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select v-model="areaId" placeholder="Please select a county" @change="changeArea">
        <el-option
          v-for="item in areaData"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        ></el-option>
      </el-select>
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
      provId: "",
      cityId: "",
      areaId: "",

      //列表
      provData: [],
      cityData: [],
      areaData: [],
    };
  },
  created() {
    this.queryData();
  },
  methods: {
    queryData() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_getAreaList",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.provData = res.data;
        }
      });
    },
    changeProv(id) {
      console.log("id", id);
      this.cityId = "";
      this.areaId = "";
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_getAreaList",
          parent_id: id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.cityData = res.data;
        }
      });

      this.updateConfig();
    },
    //查询区县
    changeCity(id) {
      console.log("id", id);
      this.areaId = "";
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_getAreaList",
          parent_id: id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.areaData = res.data;
        }
      });

      this.updateConfig();
    },

    changeArea() {
      this.updateConfig();
    },

    //更新父组件省市区
    updateConfig() {
      let provInfo = {};
      let cityInfo = {};
      let areaInfo = {};
      if (this.provId) {
        provInfo = this.provData.find((v) => v.id == this.provId);
      }
      if (this.cityId) {
        cityInfo = this.cityData.find((v) => v.id == this.cityId);
      }
      if (this.areaId) {
        areaInfo = this.areaData.find((v) => v.id == this.areaId);
      }
      let obj = {
        sheng: provInfo,
        shi: cityInfo,
        qu: areaInfo,
      };
      this.$emit("change", obj);
    },

    clear() {
      this.provId = "";
      this.cityId = "";
      this.areaId = "";
      // this.provData = []
      this.cityData = [];
      this.areaData = [];
    },
    //父组件设置当前组件省市区数据
    async init(data) {
      console.log("省市区回显", data);
      this.$log("初始化", data);
      //console.log("父组件设置当前组件省市区数据", data);
      let provName = data.province;
      let cityName = data.city;
      let areaName = data.area;
      let provId = data.provinceCode;
      let cityId = data.cityCode;
      let areaId = data.areaCode;

      //解决初始回显慢的问题
      this.provData = [{ id: provId, title: provName }];
      this.cityData = [{ id: cityId, title: cityName }];
      this.areaData = [{ id: areaId, title: areaName }];
      this.provId = provId || "";
      this.cityId = cityId || "";
      this.areaId = areaId || "";
      //市
      let [resProv, resCity, resArea] = await Promise.all([
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "users_getAreaList",
          },
        }),
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "users_getAreaList",
            parent_id: this.provId,
          },
        }),
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "users_getAreaList",
            parent_id: this.cityId,
          },
        }),
      ]);
      this.provData = resProv.data || [];
      this.cityData = resCity.data || [];
      this.areaData = resArea.data || [];
    },
  },
};
</script>


<style scoped lang="less">
::v-deep .el-switch.is-checked .el-switch__core {
  background-color: #1d88fb !important;
  border-color: #1d88fb !important;
}

::v-deep .el-input {
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
<!-- <style scoped lang="less" src="./style/h5-area_select.less"></style> -->
