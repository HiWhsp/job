<template>
  <div class="company-clients">
    <div class="content">
      <h2>公司客户</h2>

      <img
        class="company-clients-img"
        src="@/assets/img/ellsenn/companyClients.png"
        alt="公司客户"
      />
      <div class="clients-list">
        <div
          class="client-item"
          v-for="(item, index) in clientList"
          :key="index"
          @click="handleClick(item)"
        >
          <img :src="item.thumb" :alt="item.title" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyClients",
  data() {
    return {
      clientList: [],
    };
  },
  mounted() {
    this.getClientList();
  },
  methods: {
    getClientList() {
      this.$api({
        url: "friendLink",
        method: "get",
      }).then((res) => {
        this.clientList = res.data;
      });
    },
    handleClick(item) {
      window.open(item.url, "_blank");
    },
  },
};
</script>

<style scoped lang="less" src="./CompanyClients.less"></style>
