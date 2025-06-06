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
        <div class="client-item" v-for="(item, index) in 9" :key="index">
          <img src="#" alt="客户1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyClients",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="less" src="./CompanyClients.less"></style>
