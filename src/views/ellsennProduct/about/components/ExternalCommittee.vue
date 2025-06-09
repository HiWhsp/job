<template>
  <div class="external-committee">
    <div class="content">
      <h2>外部专业委员</h2>
      <div class="activity-guests">
        <div class="guests-grid">
          <div
            class="guest-card"
            v-for="(guest, index) in guestList"
            :key="index"
            @click="handleClick(guest)"
          >
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
    this.getGuestList();
  },
  methods: {
    handleClick(guest) {
      this.$router.push({
        path: "ExternalCommitteeDetail",
        query: {
          id: guest.id,
        },
      });
    },
    getGuestList() {
      this.$api({
        url: "getCompanyMemberList",
        method: "get",
        params: {
          page: this.currentPage,
          limit: 25,
          type: 1,
        },
      }).then((res) => {
        this.guestList = res.data.list;
        this.total = res.data.count;
      });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getGuestList();
    },
  },
};
</script>

<style scoped lang="less" src="./ExternalCommittee.less"></style>
