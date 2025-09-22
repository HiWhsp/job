<template>
  <div class="my-favorites">
    <ContractCard
      v-for="contract in currentContracts"
      :key="contract.id"
      :contract="contract"
    />
    <el-empty v-if="currentContracts.length === 0" style="width: 100%" description="暂无收藏数据" />
  </div>
</template>

<script>
import ContractCard from "@/components/ContractCard.vue";
export default {
  name: "collect",
  components: {
    ContractCard,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalContracts: 0,
      currentContracts: [
        // { id: 1, title: "生产经营合同", viewCount: 123, collectCount: 123 },
        // { id: 2, title: "生产经营合同", viewCount: 123, collectCount: 123 },
        // { id: 3, title: "生产经营合同", viewCount: 123, collectCount: 123 },
        // { id: 4, title: "生产经营合同", viewCount: 123, collectCount: 123 },
        // { id: 5, title: "生产经营合同", viewCount: 123, collectCount: 123 },
      ],
    };
  },
  methods: {
    loadData() {
      this.$api({
        url: "getMyCollect",
        method: "get",
        data: {
          page: this.currentPage,
          pageSize: this.pageSize,
        },
      }).then((res) => {
        this.currentContracts = res.data.list.map(item => {
          return {
            ...item,
            is_collect: true,
          };
        });
        this.totalContracts = res.data.count;
      });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.my-favorites {
  margin-left: 45px;
  display: flex;
  flex-wrap: wrap;
  gap: 60px;
}
</style>
