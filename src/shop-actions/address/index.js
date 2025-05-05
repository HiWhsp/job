import ajax from "@/plugin/request.js";//导入 axios 配置
const api = ajax.api;//请求方法



//地址相关
//调用方式
/*
    coupon.action({
        params: {

        },
        success: () => {

        }
    })
 */

let opt = {
  params: {},
  success: function (data) {
    //console.log('默认的回调', data)
  }
}


export default {

  /* 

   //地址列表
  address_getList() {
    address.getList({
      params: {},
      success: (data) => {
        this.list_address = data;
      },
    });
  },

  */
  getList({ params, success } = opt) {
    api("userAddress_lists", params).then((res) => {
      let { code, data } = res;
      // debugger
      if (code == 200) {
        if (success) {
          success(data);
        }
      }
    });
  },



  /* 


 // 新建地址 / 编辑地址
    address_add() {
      let addressData = {
        name: this.form.name,
        phone: this.form.phone,
        area_id: this.form.area_id || 0, //所在区id

        province_name: this.form.province_name,
        city_name: this.form.city_name,
        area_name: this.form.area_name,

        address: this.form.address,
        moren: this.form.isDefault ? 1 : 0,
        id: this.form.id, //0 为新增
      };

      //console.log("要保存的数据 addressData", { ...addressData });

      let checkArr = [
        { col: "name", text: "请输入收货人姓名" },
        {
          col: "phone",
          text: "请输入正确的手机号",
          reg: new RegExp(/^1[3-9]\d{9}$/),
        },
        { col: "province_name", text: "请选择省份" },
        { col: "city_name", text: "请选择市" },
        { col: "area_name", text: "请选择区县" },
        { col: "address", text: "请输入详细地址" },
      ];
      if (!this.checkFormData(addressData, checkArr)) {
        return;
      }

      address.add({
        params: addressData,
        success: () => {
          this.$parent.setView();
          this.showAdd = false;
        },
      });
    },

  */


  add({ params, success } = opt) {
    api("userAddress_add", params)
      .then((res) => {
        let { code, data, msg} = res;
  
        if (code == 200) {
          if (success) {
            success(data);
          }
        }
      });
  },



  /* 

  //地址删除
 address_delete(id) {
   address.delete({
     params: {},
     success: () => {
       let list = this.list;
       let index = list.findIndex((v) => v.id == id);
       list.splice(index, 1);
     },
   });
 },

 */
  delete({ params, success, list } = opt) {
    let id = params.id;

    api("userAddress_delete", params)
      .then((res) => {
        let { code, data, msg} = res;
    
        if (code == 200) {
          if (success) {
            success(data);
          }

          if (list) {
            let index = list.findIndex((v) => v.id == id);
            list.splice(index, 1);
          }
        }
      });
  },

  /**
  
    //获取地址详情
    address_getDetail(id) {
      address.getDetail({
        params: { id },
        success: (data) => {
          //console.log("获取地址信息 data", data);
          this.setFormData(data);
        },
      });
    },
  
   */

  getDetail({ params, success } = opt) {
    api("userAddress_detail", params)
      .then((res) => {
        let { code, data, msg} = res;

        if (code == 200) {
          if (success) {
            success(data);
          }
        }
      });

  },

  /**
  
     //设置默认地址
      address_setDefault(id) {
        address.setDefault({
          params: { id },
          success: () => {},
          list: this.list,
        });
      },
  
   */
  setDefault({ params, success, list } = opt) {
    let id = params.id;

    api("userAddress_setDefault", params)
      .then((res) => {
        let { code, data, msg} = res;
 
        if (code == 200) {
          if (success) {
            success(data);
          }

          if (list) {
            //取消其他默认地址
            let defaultItemIndex = list.findIndex((v) => v.if_default);
            if (defaultItemIndex > -1) {
              let defaultItem = list[defaultItemIndex];
              defaultItem.if_default = 0;
              list.splice(defaultItemIndex, 1, defaultItem);
            }

            //设置当前项目为默认地址
            let index = list.findIndex((v) => v.id == id);
            let item = list[index];
            item.if_default = 1;
            list.splice(index, 1, item);
          }
        }
      });
  },


  //获取省市区三级数据
  /**
   //查询省份
    address.getAreaList({
      params: {},
      success: (data) => {
        this.list_sheng = data;
      },
    });

     address.getAreaList({
        params: { parent_id: id },
        success: (data) => {
          this.list_shi = data;
        },
      });
      
       address.getAreaList({
        params: { parent_id: id },
        success: (data) => {
          this.list_qu = data;
        },
      });
   */
  getAreaList({ params, success } = opt) {
    api("users_getAreaList", params).then((res) => {
      let { code, data } = res;
      // debugger
      if (code == 200) {
        if (success) {
          success(data);
        }
      }
    });
  },

};
