<template>
  <div id="map"></div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  data() {
    return {};
  },
  computed: {
    // ...mapState(["webInfo"]),

    webInfo() {
      let obj = {
        longitude: this.webConfig.jdu || 119.178887,
        latitude: this.webConfig.wdu || 36.932801,
      };

      return obj;
    },
  },
  watch: {},
  mounted() {
    // 百度地图API功能
    this.initMap();
  },

  methods: {
    async initMap() {
      // await this.$('api')

      //console.log("网站信息webInfo", this.webInfo);

      var map = new window.BMap.Map("map"); // 创建Map实例
      this.map = map;

      var clientWidth = document.documentElement.clientWidth;
      let zoom = 18;
      if (clientWidth < 768) {
        zoom = 6;
      }

      let centerPoint = [this.webInfo.longitude, this.webInfo.latitude];
      setTimeout(() => {
        map.centerAndZoom(new window.BMap.Point(...centerPoint), zoom); // 初始化地图,设置中心点坐标和地图级别
      }, 1000);

      // map.centerAndZoom(new BMap.Point(116, 40), zoom); // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      map.addControl(
        new window.BMap.MapTypeControl({
          mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_HYBRID_MAP],
        })
      );

      // map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的

      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

      this.addOverlays(centerPoint);
    },

    //添加标注
    addOverlays(point) {
      //console.log("添加标注", point);
      // point = [116.415, 39.931]
      let map = this.map;

      let marker = new window.BMap.Marker(new window.BMap.Point(...point));
      map.addOverlay(marker);
    },
  },
};
</script>

<style scoped lang="less">
#map {
  width: 100%;
  height: 100%;
  background-color: #eee;
}
</style>
