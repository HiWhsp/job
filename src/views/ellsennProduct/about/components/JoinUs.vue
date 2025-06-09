<template>
  <div class="join-us">
    <div class="content">
      <div class="join-us-content">
        <div class="join-us-content-top">
          <div class="left">
            <img src="@/assets/img/about/join-2.png" alt="join-us-left" />
          </div>
          <div class="right">
            <img src="@/assets/img/about/join-1.png" alt="join-us-right" />
            <div class="right-content">
              <h2>人才理念</h2>
              <div class="desc">Talent concept</div>
              <div class="info">
                <p>唯才是用，唯德重用;</p>
                <p>有德有才，破格重用;</p>
                <p>有德无才，培训任用;</p>
                <p>有才无德，限制录用;</p>
                <p>无德无才，坚决不用。</p>
              </div>
              <div class="btn">让优秀的人才在企业建设发展中施展才华</div>
            </div>
          </div>
        </div>
        <div class="join-us-content-bottom">
          <div class="tab">
            <div
              class="tab-item"
              :class="{ active: activeNames === '1' }"
              @click="handleTab('1')"
            >
              <div class="tab-item-title">社会招聘</div>
            </div>
            <div
              class="tab-item"
              :class="{ active: activeNames === '2' }"
              @click="handleTab('2')"
            >
              <div class="tab-item-title">校园招聘</div>
            </div>
          </div>
          <div class="content">
            <el-collapse accordion>
              <el-collapse-item v-for="item in jobList" :key="item.id" :name="item.id">
                <template slot="title">
                  <div class="collapse-title">
                    <div class="job-info">
                      <div class="job-details">
                        <span class="detail-item">
                          <span class="label tit">{{ item.title }}</span>
                        </span>
                        <span class="detail-item">
                          <span class="label">招聘人数</span>
                          <span class="value">{{ item.number }}</span>
                        </span>
                        <span class="detail-item">
                          <span class="label">工作地点</span>
                          <span class="value">{{ item.location }}</span>
                        </span>
                        <span class="detail-item">
                          <span class="label">招聘部门</span>
                          <span class="value">{{ item.recruitment_department }}</span>
                        </span>
                      </div>
                    </div>
                    <div class="view-btn">立即申请</div>
                  </div>
                </template>
                <div class="job-content">
                  <div class="section" v-html="item.info"></div>
                  <div class="section" v-html="item.require"></div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-pagination
            style="text-align: center"
            v-if="total > 0"
            class="pagination"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
          ></el-pagination>
          <el-empty v-else description="暂无数据" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JoinUs",
  data() {
    return {
      activeNames: "1",
      total: 0,
      currentPage: 1,
      jobList: [],
    };
  },
  mounted() {
    this.getJobList();
  },
  methods: {
    handleTab(tab) {
      this.activeNames = tab;
      this.currentPage = 1;
      this.getJobList();
    },
    getJobList() {
      this.$api({
        url: "jobList",
        method: "get",
        data: {
          page: this.currentPage,
          limit: 10,
          type: this.activeNames,
        },
      }).then((res) => {
        this.jobList = res.data.list;
        this.total = res.data.count;
      });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getJobList();
    },
  },
};
</script>

<style scoped lang="less" src="./JoinUs.less"></style>
