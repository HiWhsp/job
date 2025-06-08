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
            <div class="tab-item active">
              <div class="tab-item-title">社会招聘</div>
            </div>
            <div class="tab-item">
              <div class="tab-item-title">校园招聘</div>
            </div>
          </div>
          <div class="content">
            <el-collapse v-model="activeNames" accordion>
              <el-collapse-item name="1">
                <template slot="title">
                  <div class="collapse-title">
                    <div class="job-info">
                      <div class="job-details">
                        <span class="detail-item">
                          <span class="label tit">高级会计师</span>
                        </span>
                        <span class="detail-item">
                          <span class="label">招聘人数</span>
                          <span class="value">1</span>
                        </span>
                        <span class="detail-item">
                          <span class="label">工作地点</span>
                          <span class="value">北京</span>
                        </span>
                        <span class="detail-item">
                          <span class="label">招聘部门</span>
                          <span class="value">北京市场部</span>
                        </span>
                      </div>
                    </div>
                    <div class="view-btn" @click.stop="toggleCollapse('1')">
                      查看详情
                    </div>
                  </div>
                </template>
                <div class="job-content">
                  <div class="section">
                    <h4>职责描述</h4>
                    <p>
                      1.负责股权信息披露工作（人工智能、大数据、云计算、物联网、智能制造等方向）对口业务的相关事宜；
                    </p>
                    <p>
                      2.负责制定公司内部各类事务规章制度组织调研和发布相关政策规定及文件；
                    </p>
                    <p>
                      3.负责对公司相关规章制度、主要业务数据、经营状况等定期检查、应急监控、反馈数据；
                    </p>
                    <p>
                      4.根据政府出台的相关政策性文件定期信息的采集发布和解读工作；
                    </p>
                    <p>
                      5.科研项目数据的审核工作，提供一些法律法规上的专业分析和解读；
                    </p>
                    <p>6.收集及分析相关工作。</p>
                  </div>
                  <div class="section">
                    <h4>任职要求</h4>
                    <p>
                      1.本科及以上学历，经济类、金融类、法律类专业毕业优先；
                    </p>
                    <p>2.具有5年及以上相关工作经验，具有证券分析师资格证书；</p>
                    <p>
                      3.具备优秀的分析能力，市场敏锐度强，对经济形势和金融市场走势有一定的研判能力；
                    </p>
                    <p>
                      4.具有较强的语言表达能力，能够熟练进行文档出具的山西岗位职责；
                    </p>
                    <p>
                      5.具备较强的沟通能力，效率高，具有良好的团队合作精神和责任心；
                    </p>
                    <p>
                      6.熟悉证券投资的规律性，具备敏锐的洞察力、敏感度、商业头脑、前瞻性；
                    </p>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template slot="title">
                  <div class="collapse-title">
                    <div class="job-info">
                      <div class="job-details">
                        <span class="detail-item">
                          <span class="label tit">高级会计师</span>
                        </span>
                        <span class="detail-item">
                          <span class="label">招聘人数</span>
                          <span class="value">1</span>
                        </span>
                        <span class="detail-item">
                          <span class="label">工作地点</span>
                          <span class="value">北京</span>
                        </span>
                        <span class="detail-item">
                          <span class="label">招聘部门</span>
                          <span class="value">北京市场部</span>
                        </span>
                      </div>
                    </div>
                    <div class="view-btn" @click.stop="toggleCollapse('1')">
                      查看详情
                    </div>
                  </div>
                </template>
                <div class="job-content">
                  <div class="section">
                    <h4>职责描述</h4>
                    <p>
                      1.负责股权信息披露工作（人工智能、大数据、云计算、物联网、智能制造等方向）对口业务的相关事宜；
                    </p>
                    <p>
                      2.负责制定公司内部各类事务规章制度组织调研和发布相关政策规定及文件；
                    </p>
                    <p>
                      3.负责对公司相关规章制度、主要业务数据、经营状况等定期检查、应急监控、反馈数据；
                    </p>
                    <p>
                      4.根据政府出台的相关政策性文件定期信息的采集发布和解读工作；
                    </p>
                    <p>
                      5.科研项目数据的审核工作，提供一些法律法规上的专业分析和解读；
                    </p>
                    <p>6.收集及分析相关工作。</p>
                  </div>
                  <div class="section">
                    <h4>任职要求</h4>
                    <p>
                      1.本科及以上学历，经济类、金融类、法律类专业毕业优先；
                    </p>
                    <p>2.具有5年及以上相关工作经验，具有证券分析师资格证书；</p>
                    <p>
                      3.具备优秀的分析能力，市场敏锐度强，对经济形势和金融市场走势有一定的研判能力；
                    </p>
                    <p>
                      4.具有较强的语言表达能力，能够熟练进行文档出具的山西岗位职责；
                    </p>
                    <p>
                      5.具备较强的沟通能力，效率高，具有良好的团队合作精神和责任心；
                    </p>
                    <p>
                      6.熟悉证券投资的规律性，具备敏锐的洞察力、敏感度、商业头脑、前瞻性；
                    </p>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
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
      activeNames: "",
    };
  },
  methods: {
    toggleCollapse(name) {
      // 如果当前项已经展开，则收起；否则展开当前项
      if (this.activeNames === name) {
        this.activeNames = "";
      } else {
        this.activeNames = name;
      }
    },
  },
};
</script>

<style scoped lang="less" src="./JoinUs.less"></style>
