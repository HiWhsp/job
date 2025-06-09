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
    ...mapState(["vuex_config"]),
    webInfo() {
      let obj = {
        longitude: this.vuex_config.lon || "",
        latitude: this.vuex_config.lat || "",
        name: this.vuex_config.site_name || "",
        address: this.vuex_config.address || "",
        phone: this.vuex_config.mobile || "",
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
      var map = new window.BMapGL.Map("map"); // 创建Map实例
      this.map = map;

      var clientWidth = document.documentElement.clientWidth;
      let zoom = 18;
      if (clientWidth < 768) {
        zoom = 15;
      }

      let centerPoint = [this.webInfo.longitude, this.webInfo.latitude];
      setTimeout(() => {
        map.centerAndZoom(new window.BMapGL.Point(...centerPoint), zoom); // 初始化地图,设置中心点坐标和地图级别
      }, 1000);

      // map.centerAndZoom(new BMap.Point(116, 40), zoom); // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      map.addControl(
        new window.BMapGL.MapTypeControl({
          mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_HYBRID_MAP],
        })
      );

      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

      this.addOverlays(centerPoint);
    },

    //添加标注
    addOverlays(point) {
      let map = this.map;

      // 创建标注点
      let marker = new window.BMapGL.Marker(new window.BMapGL.Point(...point));
      map.addOverlay(marker);

      // 创建信息窗口内容
      const infoWindowContent = this.createInfoWindowContent();

      // 创建信息窗口
      let infoWindow = new window.BMapGL.InfoWindow(infoWindowContent, {
        width: 433,
        height: 100,
      });

      // 点击标注时打开信息窗口
      marker.addEventListener("click", () => {
        map.openInfoWindow(infoWindow, new window.BMapGL.Point(...point));
      });

      // 默认打开信息窗口
      setTimeout(() => {
        map.openInfoWindow(infoWindow, new window.BMapGL.Point(...point));
      }, 1500);
    },

    // 创建信息窗口内容
    createInfoWindowContent() {
      return `
        <div style="padding: 0 20px; font-family: Arial, sans-serif;">
          <div style="margin-bottom: 8px;">
            <strong style="color: #333; font-size: 16px;">${this.webInfo.name}</strong>
          </div>
          <div style="margin-bottom: 6px; color: #666; font-size: 14px;display: flex;align-items: center;">
            <img style="width: 16px; height: 16px;margin-right: 6px;" src="https://www.wellsenn.com/template/default/image/icon-ads.png" alt="地址" class="icon" /> ${this.webInfo.address}
          </div>
          <div style="color: #666; font-size: 14px;display: flex;align-items: center;">
            <img style="width: 16px; height: 16px;margin-right: 6px;" src="https://www.wellsenn.com/template/default/image/link-phone.png" alt="电话" class="icon" /> ${this.webInfo.phone}
          </div>
        </div>
      `;
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

// 自定义信息窗口样式
:deep(.BMap_pop) {
  .BMap_top {
    background: #4a90e2 !important;
  }

  .BMap_center {
    background: #fff !important;
  }

  .BMap_bottom {
    background: #fff !important;
  }
}
</style>
