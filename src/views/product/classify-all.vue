<script>
import {mapState} from "vuex";

export default {
  name: "classify-all",
  data() {
    return {
      keyword: '',
      count: 0,
      activeIndex: 0,
      selectedCategory: {},
      suppliers: []
    }
  },
  watch: {
    '$route'() {
      this.keyword = this.$route.query.keyword;
      this.$api({
        url: 'supplyProductPage',
        method: 'post',
        data: {
          keyword: this.keyword
        }
      }).then(res => {
        if (res.code == 200) {
        }
      })
    },
    filterList() {
      this.selectedCategory = this.filterList[0];
      this.activeIndex = this.selectedCategory.id;
      this.getList();
    }
  },
  computed: {
    ...mapState({
      filterList: state => state.vuexFlatCates,// 商品分类
    }),
  },
  methods: {
    toProduct(item) {
      console.log(item)
      this.$router.push(`/productCategories?ids=${item.user_id}&type_id=${this.activeIndex}`);
    },
    itemNav(item) {
      if (this.activeIndex === item.id) {
        this.activeIndex = 0;
        this.selectedCategory = {};
      } else {
        this.selectedCategory = item;
        this.activeIndex = item.id;
      }
      this.getList();
    },
    getList() {
      this.$api({
        url: 'getSupplyUserByType',
        method: 'post',
        data: {
          material_type_id: this.activeIndex
        }
      }).then(res => {
        if (res.code == 200) {
          this.suppliers = res.data.all_material_type[0].supply_user_list;
        }
      })
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item><img alt="" src="@/static/home/home.png">当前位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>产品展示</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div v-if="keyword" class="search">
      共搜索到“<span>{{ keyword }}</span>”相关的 <span>{{ count }}</span> 个供应商
    </div>
    <!--    条件筛选-->
    <div class="condition-filter">
      <div class="filter flex">
        <p class="name">类目</p>
        <div class="item-wrap flex">
          <div v-for="(item, index) in filterList" :key="index"
               :class="{ 'active': activeIndex === item.id }"
               class="item pointer"
               @click="itemNav(item)">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="column-flex-center wrap">
      <!-- 材料详情 -->
      <div class="material-info">
        <div class="text-section">
          <h3>{{ selectedCategory.name }}</h3>
          <p class="description">{{ selectedCategory.introduce }}</p>
          <p class="features">
            特征：{{ selectedCategory.feature }}
          </p>
        </div>
        <div class="image-section">
          <img :alt="selectedCategory.name" :src="selectedCategory.cover_url" />
        </div>
      </div>

      <!-- 供应商选择 -->
      <div class="suppliers">
        <div class="title-section">
          <div>
            <span class="tit">供应商选择</span>
            <span class="sub">实力厂家 行业优选</span>
          </div>
        </div>
        <div class="supplier-grid">
          <div v-for="(supplier, index) in suppliers" :key="index" class="supplier" @click="toProduct(supplier)">
            <img alt="" src="@/static/home/supplier.png">
            {{ supplier.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.nav-bar {
  img {
    width: 14px;
    margin-right: 10px;
  }
}

.search {
  margin-top: 20px;
  font-size: 20px;

  span {
    color: #EF1F1F;
  }
}

.condition-filter {
  margin-top: 21px;
  min-height: 152px;
  background: #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  padding: 20px;

  .filter {
    align-items: center;

    .name {
      width: 100px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 18px;
      color: #333333;
      font-style: normal;
      text-transform: none;
    }

    .item-wrap {
      flex-wrap: wrap;
      flex: 1;

      .item {
        width: 164px;
        height: 48px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #DBDBDB;
        margin-bottom: 16px;
        margin-right: 10px;

        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        line-height: 48px;
        text-align: center;

        &:nth-child(7n) {
          margin-right: 0;
        }
      }

      .item.active {
        color: #fff;
        background: #044FA0;
      }
    }
  }
}

.wrap {
  margin-top: 20px;
  background: #fff;
  padding: 40px 50px;
  margin-bottom: 20px;
  display: flex;
}

.material-info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .text-section {
    flex: 1;
    padding-right: 20px;

    h3 {
      font-size: 36px;
      margin-bottom: 20px;
    }

    .description {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: #333333;
      margin-bottom: 20px;
    }

    .features {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 18px;
      color: #333333;
    }
  }

  .image-section {
    width: 240px;

    img {
      width: 100%;
    }
  }
}

.suppliers {
  width: 100%;
  margin-top: 30px;

  .title-section {
    display: flex;
    justify-content: space-between;
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 26px;
    margin-bottom: 10px;

    .sub {
      font-size: 16px;
      color: #999;
      margin-left: 10px;
    }

    .more-link {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #044FA0;
    }
  }

  .supplier-grid {
    display: flex;
    flex-wrap: wrap;

    .supplier {
      margin-right: 20px;
      margin-bottom: 16px;
      padding-left: 16px;
      display: flex;
      align-items: center;

      img {
        width: 56px;
        height: 20px;
        margin-right: 10px;
      }

      width: 310px;
      height: 40px;
      color: #333;
      font-size: 16px;
      background: #F9FAFC;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #E4E7ED;

      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
</style>
