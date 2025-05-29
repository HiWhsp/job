<template>
  <div class='layout'>
    <div class="top-swiper">
      <div class="left">
        <div class="left-list">
          <div v-for="(item, index) in dataList" :key="index" class="list-item">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-info">
              <span class="item-time">{{ item.time }}</span>
              <span class="item-status">{{ statusEnum[item.status] }}</span>
            </div>
          </div>
        </div>
        <el-button class="btn" type="primary">
          查看更多<i class="el-icon-arrow-right"></i
        ></el-button>
      </div>
      <div class="right">
        <el-carousel
          class="right-carousel"
          trigger="click"
          :autoplay="true"
          arrow="always"
        >
          <el-carousel-item
            class="right-img"
            v-for="(item, index) in vuex_index_banners"
            :key="index"
            @click.native="do_banner_click(item)"
          >
            <img class="right-img" :src="item.image" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  components: {},
  props: {},
  name: 'top-swiper',
  data() {
    return {
      statusEnum: { 0: '原创', 1: '网络', 2: '新闻' },
      dataList: [],
      imgList: [{ url: '' }],
    };
  },
  computed: {
    ...mapState([
      //
      'vuex_index_banners',
    ]),
  },
  created() {
    this.fetchData();
  },
  mounted() {},

  methods: {
    fetchData() {
      try {
        // 模拟接口请求
        // const response = await axios.get(
        //   'https://jsonplaceholder.typicode.com/users'
        // );
        // this.dataList = response.data;
        this.dataList = [
          {
            title:
              'AI智能眼镜拆解及BOM成本报告：Ray-Ban Stories与Ray-Ban Meta对比拆解',
            time: '2024-08-19',
            status: 0,
          },
          {
            title:
              'AI智能眼镜拆解及BOM成本报告：Ray-Ban Stories与Ray-Ban Meta对比拆解',
            time: '2024-08-19',
            status: 1,
          },
          {
            title:
              'AI智能眼镜拆解及BOM成本报告：Ray-Ban Stories与Ray-Ban Meta对比拆解',
            time: '2024-08-19',
            status: 2,
          },
          {
            title:
              'AI智能眼镜拆解及BOM成本报告：Ray-Ban Stories与Ray-Ban Meta对比拆解',
            time: '2024-08-19',
            status: 0,
          },
        ];
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    do_banner_click(item) {
      //console.log({ ...item });
      if (item.url) {
        window.open(item.url, '_blank');
      } else if (item.inventoryId) {
        this.$router.push(
          '/product-detail/' + (item.skuId || item.inventoryId)
        );
      }
    },
  },
};
</script>

<style scoped lang="less" src="./topSwiper.less"></style>
