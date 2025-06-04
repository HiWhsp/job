<template>
  <div class="activity-guests">
    <div class="guests-grid">
      <div class="guest-card" v-for="(guest, index) in guestList" :key="index">
        <div class="guest-avatar">
          <img :src="guest.avatar" :alt="guest.name" />
        </div>
        <div class="guest-info">
          <div class="guest-name">{{ guest.name }}</div>
          <div class="guest-position">{{ guest.position }}</div>
          <div class="guest-company">{{ guest.company }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActivityGuests",
  props: {
    guests: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    guestList() {
      return this.guests.length > 0 ? this.guests : this.defaultGuests;
    },
  },
  data() {
    return {
      defaultGuests: [
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "张薇",
          position: "AI技术专家",
          company: "科技创新有限公司",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "李明",
          position: "智能制造总监",
          company: "智能科技集团",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "王强",
          position: "AR产品负责人",
          company: "未来科技有限公司",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "刘敏",
          position: "智能眼镜研发总监",
          company: "创新科技股份",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "陈博",
          position: "人工智能架构师",
          company: "智慧制造集团",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "赵雪",
          position: "产品策略总监",
          company: "前沿科技有限公司",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "孙杰",
          position: "技术创新负责人",
          company: "智能设备科技",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "周华",
          position: "AI算法专家",
          company: "算法科技有限公司",
        },
      ],
    };
  },
};
</script>

<style scoped lang="less">
.activity-guests {
  margin-bottom: 40px;

  .section-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      bottom: -8px;
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #0066cc, #004499);
    }
  }

  .guests-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .guest-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      overflow: hidden;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .guest-avatar {
        width: 100%;
        height: 200px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .guest-info {
        padding: 20px;
        text-align: center;
        background: linear-gradient(135deg, #0066cc, #004499);
        color: white;

        .guest-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .guest-position {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 4px;
        }

        .guest-company {
          font-size: 12px;
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
