<template>
  <div class="external-committee">
    <div class="content">
      <h2>公司团队</h2>
      <div class="activity-guests">
        <div class="guests-grid">
          <div class="guest-card" v-for="(guest, index) in guestList" :key="index">
            <div class="guest-avatar">
              <img :src="guest.thumb" :alt="guest.name" />
            </div>
            <div class="guest-info">
              <div class="guest-name">{{ guest.name }}</div>
              <div class="guest-company">{{ guest.info }}</div>
              <div class="guest-position ellipsis-1">{{ guest.info }}</div>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        style="text-align: center; margin-top: 36px"
        v-if="total > 0"
        class="pagination"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="25"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExternalCommittee",
  data() {
    return {
      guestList: [],
      currentPage: 1,
      total: 0,
    };
  },
  mounted() {
    this.getCompanyTeam();
  },
  methods: {
    getCompanyTeam() {
      this.$api({
        url: "getCompanyMemberList",
        method: "get",
        data: {
          page: this.currentPage,
          limit: 25,
          type: 2,
        },
      }).then((res) => {
        this.guestList = res.data.list;
        this.total = res.data.count;
      });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getCompanyTeam();
    },
  },
};
</script>

<style scoped lang="less" src="./CompanyTeam.less"></style>
