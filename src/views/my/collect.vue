<template>
  <div class="my-favorites">
    <ContractCard
      v-for="contract in currentContracts"
      :key="contract.id"
      :contract="contract"
    />
    <el-empty v-if="currentContracts.length === 0" style="width: 100%" description="暂无内容" />
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
      currentContracts: [
        // { id: 1, title: "生产经营合同", viewCount: 123, collectCount: 123 },
        // { id: 2, title: "生产经营合同", viewCount: 123, collectCount: 123 },
        // { id: 3, title: "生产经营合同", viewCount: 123, collectCount: 123 },
        // { id: 4, title: "生产经营合同", viewCount: 123, collectCount: 123 },
        // { id: 5, title: "生产经营合同", viewCount: 123, collectCount: 123 },
      ],
    };
  },
  methods: {},
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
