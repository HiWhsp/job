<template>
  <div>
    <div class="one-wrap">
      <div class="title">用激光工具改变生活</div>
      <div class="content">
        武汉华日精密激光股份有限公司成立于2003年，总部位于中国武汉，公司秉承“用激光工具改变生活”的愿景，致力于为全球用户提供稳定可靠的高端激光器产品和激光应用解决方案，服务高端制造业和生命科学，实现企业的全面可持续发展。
        <br/><br/>华日激光构建了全产业链的股东结构，涵盖激光器原材料，核心器件、控制系统、整机装备及应用示范单位，坚持全产业链协同创新发展。公司产品已成功出口到世界各地，并通过国际顶级客户的批量验证，直接参与到全球高端产业链中。覆盖全球的销售及服务渠道，为全球用户提供快速需求响应和贴身服务。
        <br/><br/>华日激光坚持以市场需求引领新产品的研发，具备多种脉冲宽度，多种波长的激光器核心技术和持续研发能力，在激光种子源、脉冲电子控制、运动控制、应用工艺等领域拥有多项核心技术，通过与全球高端激光设备制造商在电子电路、硬脆材料、半导体、新能源、生命科学等领域开展紧密合作，为用户提供全面的激光技术解决方案。
        <br/><br/>华日激光始终坚持高品质发展之路。研发阶段严苛的导入验证，确保导入器件的稳定可靠；生产制造环节，标准规范的冲击震动测试、高低温循环测试，以及严格的生产筛选检测，确保每一台激光器都具有极高的可靠性；先进的洁净室及检测设施，保障出厂的每一台激光器的高品质。
        <br/><br/>未来，华日激光将持续聚焦客户关注的挑战和压力，提供有竞争力的激光技术解决方案和服务，持续为客户创造最大价值，全力以赴推动客户成功。　在先进激光技术领域，代表国家竞争力，具备国际竞争力。
      </div>
      <div class="number-wrap">
        <div class="number-item">
          <div class="number-top"><span class="number">2003</span>年</div>
          <div class="number-bottom">2003年成立</div>
        </div>
        <div class="number-item">
          <div class="number-top"><span class="number">868</span>M²</div>
          <div class="number-bottom">研发生产基地面积</div>
        </div>
        <div class="number-item">
          <div class="number-top"><span class="number">66</span>人</div>
          <div class="number-bottom">员工团队</div>
        </div>
        <div class="number-item">
          <div class="number-top"><span class="number">15</span>%</div>
          <div class="number-bottom">科研人员占比</div>
        </div>
        <div class="number-item">
          <div class="number-top"><span class="number">12+</span></div>
          <div class="number-bottom">业务覆盖地区</div>
        </div>
      </div>
    </div>
    <div class="two-wrap">
      <div class="wrap">
        <div class="title">企业文化</div>
        <div class="content">
          开放，以开放的心态谋求合作共赢；<br/>
          专业，以专业的能力实现创新进取；<br/>
          高效，以高效的执行响应客户需求。
        </div>
      </div>
    </div>
    <div class="three-wrap">
      <div class="list">
        <div class="item-1">
          <div class="title">公司愿景：</div>
          <div class="content">用激光工具改变生活</div>
          <div class="number">01</div>
        </div>
        <div class="item-1 item">
          <div class="title">企业目标：</div>
          <div class="content">
            在先进激光技术领域，代表国家竞争力，具备国际竞争力。
          </div>
          <div class="number">02</div>
        </div>
        <div class="item-1 item">
          <div class="title">企业使命：</div>
          <div class="content">
            聚焦客户关注的挑战和压力，提供有竞争力的激光技术解决方案和服务，持续为客户创造最大价值，全力以赴推动客户成功。
          </div>
          <div class="number">03</div>
        </div>
      </div>
    </div>
    <div class="four-wrap">
      <div class="wrap">
        <div class="content">
          <div class="left">
            <div class="title">发展历程</div>
            <div class="sub-title">用激光工具改变生活</div>
            <div class="year"><span class="number">{{ processDetail.description }}</span>年</div>
            <div class="list" v-html="processDetail.content">
              <!--              <div class="list-item">-->
              <!--                2021.03华日激光参展上海慕尼黑光博会，华日激光“长效紫外倍频晶体自动移点技术”荣获金耀奖新技术奖。-->
              <!--              </div>-->
              <!--              <div class="list-item">-->
              <!--                2021.2021.07华日激光牵头湖北省重点研发计划《百瓦毫焦级飞秒激光器》。-->
              <!--              </div>-->
              <!--              <div class="list-item">-->
              <!--                2021.2021.11牵头和参与的十三五科技部重点研发计划《工业皮秒飞秒激光器关键技术研究与产业化》《纤维增强材料激光并行制造工艺及装备》《制造用紫外激光器》项目验收全部顺利通过。-->
              <!--              </div>-->
            </div>
          </div>
          <div class="right">
            <div class="img-wrap">
              <img :src="processDetail.thumb" alt=""/>
            </div>
          </div>
        </div>
        <div class="step-wrap">
          <div class="step-item-0" @click="goNext('prev')">
            <div class="img-wrap">
              <i class="el-icon-arrow-left"></i>
            </div>
            <div class="line"></div>
          </div>
          <div :class="{'step-item-active': index == activeIndex, 'step-item': index != activeIndex}"
               v-for="(item, index) in processList" :key="index">
            <div class="top">{{ item.description }}</div>
            <div class="bottom">
              <div class="circle"></div>
              <div class="line"></div>
            </div>
          </div>
          <div class="step-item-0" @click="goNext('next')">
            <div class="img-wrap">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="five-wrap">
      <div class="wrap">
        <div class="title">资质证书</div>
        <div class="sub-title">用激光工具改变生活</div>
        <div class="list-wrap">
          <div class="list-item" v-for="(item, index) in list[pagination.page - 1]" :key="index">
            <div class="img-wrap">
              <el-image
                  ref="preview"
                  style="width: 100%; height: 100%"
                  :src="item.image"
                  :preview-src-list="[item.image]">
              </el-image>
            </div>
            <div class="content-wrap">
              <div class="desc">{{ item.title }}</div>
              <div class="icon-wrap pointer" @click="lock(item)">
                <img src="@/assets/img/chat-us/icon1.png" alt=""/>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-if="!count" description="没有查询到信息..."></el-empty>
        <!--分页器-->
        <div class="pagination-box" v-if="count">
          <el-pagination background layout="total, prev, pager, next, jumper" :total="count"
                         :current-page="pagination.page"
                         :page-size="pagination.pageNum" @current-change="changePage"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activeIndex: 0,
      list: [],
      processDetail: [],
      processList: [],
      count: 0,
      pagination: {
        page: 1,
        pageNum: 6,
      },
    };
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "banner_index",
          position: 0,
        },
      }).then(res => {
        if (res.data) {
          if (res.data[5]) {
            // 将数组按照六个为一组
            let list = res.data[5].images;
            let result = [];
            for (let i = 0; i < list.length; i += 6) {
              this.list.push(list.slice(i, i + 6));
            }
            this.count = res.data[5].images.length;
          }
        }
      })

      // 发展历程
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          channelId: 21,
        },
      }).then(res => {
        if (res.data) {
          this.processList = res.data.list;
          this.processDetail = res.data.list[0];
        }
      })
    },
    changePage(val) {
      this.pagination.page = val;
    },
    lock(item) {
      this.$refs.preview[0].showViewer = true
    },

    goNext(type) {
      // 上一篇 下一篇
      if (type == "prev") {
        if (this.activeIndex == 0) {
          this.activeIndex == 0;
        } else {
          this.activeIndex--;
        }
      } else if (type == "next") {
        if (this.activeIndex == this.processList.length - 1) {
          this.activeIndex == this.processList.length - 1;
        } else {
          this.activeIndex++;
        }
      }
      this.processDetail = this.processList[this.activeIndex];
    }
  },
};
</script>

<style lang="less" scoped>
.one-wrap {
  width: 1400px;
  margin: 0 auto;
  padding: 57px 0 74px;
  background: #f4f4f6;

  .title {
    font-weight: bold;
    font-size: 36px;
    color: #333333;
    text-align: center;
  }

  .content {
    margin-top: 47px;
    height: 393px;
    font-size: 16px;
    color: #333333;
    line-height: 28px;
  }

  .number-wrap {
    margin: 74px 0 0 0;
    display: flex;
    justify-content: space-between;

    .number-item {
      display: flex;
      gap: 13px;
      flex-direction: column;
      font-size: 16px;
      color: #333333;

      .number-top {
        display: flex;
        align-items: center;
        gap: 11px;

        .number {
          font-size: 46px;
          font-weight: bold;
          color: #27417c;
        }
      }

      .number-bottom {
        color: #52565a;
      }
    }
  }
}

.two-wrap {
  width: 100%;
  height: 576px;
  padding-top: 164px;
  background: url("../../assets/img/chat-us/profile.png") no-repeat center center;

  .title {
    font-size: 36px;
    color: #27417c;
    line-height: 37px;
  }

  .content {
    margin-top: 58px;
    font-size: 20px;
    color: #333333;
    line-height: 46px;
  }
}

.three-wrap {
  width: 1400px;
  margin: 0 auto;
  padding: 57px 0 100px;
  background: #f4f4f6;

  .list {
    display: flex;
    flex-direction: column;
    gap: 29px;

    .item-1 {
      position: relative;
      height: 208px;
      padding: 37px 0 0 33px;
      background: #ffffff;

      .title {
        font-size: 28px;
        color: #27417c;
        line-height: 84px;
      }

      .content {
        font-size: 20px;
        color: #6a6a6a;
        line-height: 28px;
      }

      .number {
        position: absolute;
        right: 27px;
        bottom: -30px;
        font-size: 126px;
        color: #f1f1f1;
      }

      // 鼠标移上去缓慢渐变
      &:hover {
        background: linear-gradient(to right,
        rgba(255, 255, 255, 1),
        rgba(255, 255, 255, 1) 40%,
        rgba(0, 0, 0, 0) 80%),
        url("../../assets/img/chat-us/list1.png");
      }
    }

    .active {
      background: #ffffff;
    }
  }
}

.four-wrap {
  padding: 82px 0 86px;
  background-image: url("~@/assets/img/chat-us/form.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .content {
    display: flex;

    .left {
      width: 690px;

      .title {
        font-weight: bold;
        font-size: 36px;
        color: #333333;
      }

      .sub-title {
        margin-top: 14px;
        font-size: 16px;
        color: #52565a;
      }

      .year {
        margin-top: 84px;
        font-size: 20px;
        color: #333333;

        .number {
          font-family: Impact, Impact;
          font-size: 56px;
          color: #333333;
        }
      }

      .list {
        margin-top: 38px;
        display: flex;
        flex-direction: column;
        gap: 29px;
        font-size: 16px;
        color: #757575;

        .list-item {
          width: 630px;
          font-size: 16px;
          color: #757575;

          &::before {
            content: "";
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 2px solid #27417c;
            background: transparent;
          }
        }
      }
    }

    .right {
      align-self: flex-end;

      .img-wrap {
        width: 700px;
        height: 406px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .step-wrap {
    margin-top: 110px;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .line {
      border-top: 1px dashed #000;
      background: none;
      display: inline-block;
      vertical-align: middle;
      min-width: 60px;
      height: 1px;
    }

    .step-item-0 {
      display: flex;
      align-items: center;

      .img-wrap {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 4px solid #C5C5C5;
        background-color: #fff;
        .flex();
        justify-content: center;
        cursor: pointer;

        i {
          font-size: 24px;
          font-weight: bold;
          color: #C5C5C5;
        }

        &:hover {
          border: 4px solid #27417c;

          i {
            color: #27417c;
          }
        }
      }

    }

    .step-item-active {
      display: flex;
      flex-direction: column;

      .top {
        width: 69px;
        font-size: 36px;
        color: #27417c;
        font-weight: bold;
        transform: translateX(-20%);
      }

      .bottom {
        display: flex;
        align-items: center;

        .circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 9px solid #bbd0ff;
          background: #27417c;
        }
      }
    }

    .step-item {
      display: flex;
      flex-direction: column;

      .top {
        max-width: 56px;
        font-size: 24px;
        color: #757575;
        transform: translateX(-20%);
      }

      .bottom {
        margin-top: 20px;
        display: flex;
        align-items: center;
        padding-bottom: 10px;

        .circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 4px solid #c5c5c5;
          background: #fff;
        }
      }
    }
  }
}

.five-wrap {
  padding: 84px 0 69px;

  .title {
    font-weight: bold;
    font-size: 36px;
    color: #333333;
    text-align: center;
  }

  .sub-title {
    margin-top: 14px;
    font-size: 16px;
    color: #52565a;
    text-align: center;
  }

  .list-wrap {
    margin-top: 57px;
    display: flex;
    flex-wrap: wrap;
    row-gap: 29px;
    column-gap: 37px;

    .list-item {
      width: 436px;
      height: 378px;
      background: #ffffff;
      padding: 25px 23px 38px 24px;

      .img-wrap {
        width: 389px;
        height: 261px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .content-wrap {
        margin-top: 25px;
        display: flex;
        justify-content: space-between;

        .desc {
          font-family: Source Han Sans CN, Source Han Sans CN;
          font-size: 20px;
          color: #383635;
        }

        .icon-wrap {
          width: 25px;
          height: 25px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .step-wrap {
    margin-top: 46px;
    height: 47px;
    display: flex;
    justify-content: center;
    align-items: center;

    .step {
      width: 47px;
      height: 47px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .prev {
      margin-right: 15px;
    }

    .circle {
      width: 12px;
      height: 12px;
      margin-right: 13px;
      border-radius: 50%;
      background: #7B7B7B;

      &.active {
        width: 18px;
        height: 18px;
        border: 4px solid #cbd0dd;
        background: #27417c;
      }
    }
  }
}

.wrap {
  width: 1400px;
  margin: 0 auto;
}
</style>
