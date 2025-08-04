<template>
  <div class="refund-sku-choose">
    <div class="guige-info">
      <div class="sec-guige">
        <div v-if="sku_mode == '无规格'" class="sec-guige-dan" data-type="无规格">
          <div class="main-title">
            规格
          </div>
          <div class="guige-list flex">
            <div class="guige-item fit-text" v-for="(item, index) in guige_list" :key="index"
              @click="do_toggle_wuguige(item)" :class="{
                'selected': guige_select.inventoryId == item.inventoryId,
                'nokucun': !item.kucun
              }">
              {{ item.keyVals || '默认' }}
            </div>
          </div>
        </div>

        <div v-else class="sku-wrap" data-type="多规格">
          <div class="sku-group" v-for="(sku_group, group_index) in sku_sections" :key="group_index">
            <div class="main-title">
              {{ sku_group.key }}
            </div>
            <div class="sku-list flex">
              <div class="sku-item fit-text" v-for="(sku_item, item_index) in sku_group.child" :key="item_index"
                @click="do_toggle_sku(sku_item, item_index, sku_group, group_index)" :class="{
                  'selected': sku_item.is_selected,
                  'nokucun': !sku_item.is_allow_select
                }">
                {{ sku_item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "refund-sku-choose",
  components: {},
  // props: [""],
  data() {
    return {
      sku_mode: '', //无规格 单规格 多规格
      guige_list: [], //所有规格
      guige_select: {}, //已选规格
      sku_sections: [], //sku分组 多规格
      sku_flat_list: [], //规格sku列表
      // inventorys: [],
      //
      show_pop: false,
      is_miaosha: false, //是否秒杀商品
      info: {
        banners: []
      },
      //
      //
      //
      //


      banners: [],
      guigeList: [],
      buyNumber: 1,
      guigeSelect: {},
      allowRequestApi: true, //是否允许请求接口  针对上报 提交 保存类限制次数

      //多规格数据 多规格数据
      all_guige: [],

      user_select_attrs: [],
      select_specifications: {},
      list_specifications: [],

    };
  },
  computed: {
    // ...mapState([""]),
  },
  watch: {},
  mounted() {

  },
  methods: {
    init(info) {
      this.$log('选择规格 init info', info)
      this.buyNumber = 1;
      this.info = info;
      this.is_miaosha = info.is_miaosha
      this.sku_format(info); //处理商品规格信息
      this.show_pop = true;
    },

    //处理商品规格信息
    sku_format(data) {
      /**
       * 规格处理逻辑
       * 无规格 1 
       * 
       * 有规格
       *   单一规格 1 
       *   多组规格
       */

      // inventorys = [{
      // 	image: "",
      // 	inventoryId: 24,
      // 	isSelected: 0,
      // 	keyVals: "黑,大",
      // 	kucun: 1000,
      // 	priceMarket: "200.00",
      // 	priceSale: "100.00",
      // 	priceTuan: "150.00",
      // 	sn: "编码",
      // }]



      let inventorys = data.inventorys || []
      let skuLists = data.skuLists || []

      //
      let sku_mode = '';
      let guige_list = [];
      let sku_sections = []
      let sku_flat_list = []

      //
      if (!skuLists.length) {
        sku_mode = '无规格';
      } else if (skuLists.length == 1) {
        sku_mode = '单规格';
      } else if (inventorys.length) {
        sku_mode = '多规格';
      }

      if (sku_mode == '无规格') {
        if (!inventorys.length) {
          inventorys = [{
            image: data.thumb,
            inventoryId: data.inventoryId,
            isSelected: 1,
            keyIds: data.inventoryId + '',
            keyVals: data.keyVals,
            kucun: data.kucun,
            priceMarket: data.priceMarket,
            priceSale: data.priceSale,
            priceTuan: data.priceTuan,
            sn: data.sn,
          }]
        }

        guige_list = inventorys;
        if (guige_list[0].kucun > 0) {
          this.guige_select = guige_list[0]
        }
      } else if (sku_mode == '单规格' || sku_mode == '多规格') {
        guige_list = inventorys;
        sku_sections = skuLists;
        sku_sections.forEach(v1 => {
          v1.child.forEach(v2 => {
            v2.is_selected = false;
            v2.is_allow_select = true;
            sku_flat_list.push(v2)
          })
        })
      }


      guige_list.forEach(v => {
        let {
          keyIds,
          keyVals
        } = v;
        let sku_map = {};
        let id_arr = keyIds.split('-').map(v => parseInt(v));
        let sku_id_arr = id_arr.sort((a, b) => (a) - (b))
        v.cus_sku_ids = sku_id_arr.join('-'); //当前规格的sku组合	 


        let sku_id_list = keyIds.split('-').map(v => parseInt(v));
        let sku_value_list = keyVals.split(',');


        sku_id_list.forEach((id, index) => {
          sku_map[id] = sku_value_list[index]
        })
        v.sku_map = sku_map;
        v.sku_id_list = sku_id_list;
        v.sku_value_list = sku_value_list;
      })


      this.sku_mode = sku_mode;
      this.guige_list = guige_list;
      this.sku_sections = sku_sections;
      this.sku_flat_list = sku_flat_list;
      // this.inventorys = inventorys;

      this.$log('所有规格 guige_list', guige_list)
    },

    do_toggle_wuguige(item) {
      this.$log('规格选择', item)
      this.guige_select = item;
      this.$emit('confirm', this.guige_select)
    },

    //商品sku 属性选择
    do_toggle_sku(sku_item, item_index, sku_group, group_index) {
      this.$log("切换sku", sku_item);


      if (!sku_item.is_allow_select) { //无库存
        return
      }

      if (sku_item.is_selected) { //已选- 取消勾选
        return
        // sku_item.is_selected = false;
        // sku_group.is_selected = false
      } else { //未选-
        let is_allow_select_this = true; //是否允许勾选当前sku 库存不允许勾选
        if (is_allow_select_this) {
          let other_select_sku_item = sku_group.child.find(v => v.is_selected); //其他已选规格
          if (other_select_sku_item) {
            other_select_sku_item.is_selected = false;
          }
          sku_item.is_selected = true
        }
      }

      if (sku_item.is_selected) {
        sku_group.is_selected = true
      }

      this.update_sku_allow_select_status();
      this.set_guige_select_by_select_sku()
    },


    //更新 sku 是否允许勾选状态
    update_sku_allow_select_status() {
      this.sku_flat_list.forEach(v => {
        v.is_allow_select = true;
      })
      //已选sku
      //已选sku对应的规格数据
      //
      let sku_select_items = this.sku_flat_list.filter(v => v.is_selected);
      let sku_select_map = {}
      sku_select_items.forEach(v => {
        sku_select_map[v.id] = v.title
      })
      let has_kucun_guige_list = this.guige_list.filter(v => v.kucun > 0)


      //sku是否可选设置

      this.sku_flat_list.forEach(sku => {
        let need_manzu_sku_items = sku_select_items.filter(v => v.parentId != sku.parentId)
        let need_manzu_sku_value = {
          [sku.id]: sku.title
        };
        need_manzu_sku_items.forEach(v => {
          need_manzu_sku_value[v.id] = v.title
        })
        //当前sku 是否可选 需要判断  当前sku与所有已选sku的组合在规格列表中是否有库存

        let this_sku_has_kucun = has_kucun_guige_list.some(function (guige) {
          let has_every_sku = true; //检测规格是否包含所有sku组合
          let sku_map = guige.sku_map

          for (var sku_id in need_manzu_sku_value) {
            if (need_manzu_sku_value[sku_id] != sku_map[sku_id]) {
              has_every_sku = false;
            }
          }
          return has_every_sku
        })

        if (this_sku_has_kucun) {
          sku.is_allow_select = true;
        } else {
          sku.is_allow_select = false;
        }
      })

      this.$log('有库存的产品规格 has_kucun_guige_list', has_kucun_guige_list);
      this.$log('所有sku更新状态  sku_flat_list', this.sku_flat_list);
    },


    //通过已勾选的sku 确认规格项目
    set_guige_select_by_select_sku() {
      let guige_select = {};

      let sku_select_items = this.sku_flat_list.filter(v => v.is_selected)
      if (sku_select_items.length != this.sku_sections.length) {
        guige_select = {}
      } else {
        let sku_id_arr = sku_select_items.map(v => v.id).sort((a, b) => parseInt(a) - parseInt(b))
        let cus_sku_ids = sku_id_arr.join('-'); //当前规格的sku组合

        guige_select = this.guige_list.find(v => v.cus_sku_ids == cus_sku_ids) || {}
      }

      this.guige_select = guige_select;

      this.$log('已选规格', this.guige_select)

      // if (this.guige_type == '单规格') {
      // 	this.$emit('confirm', {
      // 		type: '单规格',
      // 		guige: this.guigeSelect,
      // 		buyNumber: this.buyNumber
      // 	})
      // } else if (this.guige_type == '多规格') {
      // 	this.$emit('confirm', {
      // 		type: '多规格',
      // 		guige: this.select_specifications,
      // 		buyNumber: this.buyNumber
      // 	})
      // }
    },

  },
};
</script>


<style scoped lang="less">
.refund-sku-choose {
  margin-top: 20px;
}

.sec-guige-dan {
  display: flex;
  align-items: flex-start;

  .main-title {
    min-width: 60px;
  }
}

.guige-list {
  margin-bottom: 27px;
  flex-wrap: wrap;

  .guige-item {
    cursor: pointer;
    background: #F9F9F9;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 0 10px;
    min-width: 111px;
    height: 37px;
    background: #F9F9F9;
    border-radius: 0px 0px 0px 0px;
    border: 1px solid #CCCCCC;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #333333;


    &.selected {
      // background: #CB0011;
      border: 1px solid #3b64fc;
      // color: #FFFFFF;
    }

    &.nokucun {
      background: #eeeeee;
      border: 1px solid transparent;
      color: #AAAAAA;
    }
  }
}


.sku-list {
  margin-bottom: 27px;
  flex-wrap: wrap;

  .sku-item {
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 0 30px;
    min-width: 150px;
    height: 60px;
    background: #F6FAFD;
    border-radius: 30px 30px 30px 30px;
    border: 1px solid #F6FAFD;

    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 28px;
    color: #000000;

    &.selected {
      // background: #CB0011;
      border: 1px solid #3b64fc;
      // color: #FFFFFF;
    }

    &.nokucun {
      background: #eee;
      border: 1px solid transparent;
      color: #AAAAAA;
    }
  }
}
</style>
