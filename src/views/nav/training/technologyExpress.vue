<script>
export default {
  name: "technologyExpress",
  data() {
    return {
      list: [],
      pagination: {
        page: 1,
        limit: 5,
      },
      count: 0,
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'download_list',
        method: 'post',
        data: {
          column_id: '506',
          ...this.pagination
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data;
          this.count = res.count;
        }
      })
    },
    download(item) {
      if (item.url) {
        window.open(item.url, "_blank")
      } else {
        this.$message({
          message: '文件不存在',
          type: 'warning'
        })
      }
    },
    goUrl(item) {
      this.$router.push(`${item.url}?id=${item.params.id}`)
    }
  }
}
</script>

<template>
  <div class="list-wrap">
    <div class="title">技术快递</div>
    <div class="card" v-for="item in list" :key="item.id">
      <div class="card-left">
        <img :src="item.thumb" alt="Machine Image">
      </div>
      <div class="card-right">
        <div class="date-badge">{{ item.created_at }}</div>
        <div class="card-header">
          <h3>{{ item.title }}</h3>
        </div>
        <p>{{ item.description }}</p>
      </div>
      <div class="download-btn pointer" @click="download(item)">
        <img src="@/assets/img/base/appointment/PDF.png" alt="">下载文件
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.title {
  font-weight: bold;
  font-size: 20px;
  color: #00479D;
  margin-bottom: 30px;
}

.list-wrap {
  .card {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;

    .card-left {
      flex: 1;

      img {
        width: 100%;
        height: 120px;
        border-radius: 5px;
      }
    }

    .card-right {
      flex: 2;
      padding: 0 20px;
      display: flex;
      flex-direction: column;

      .date-badge {
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
        width: 114px;
        height: 30px;
        line-height: 30px;
        background: #707070;
        border-radius: 0px 0px 0px 15px;
        color: #fff;
        font-size: 14px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.5s;

        h3 {
          font-weight: 400;
          font-size: 18px;
          color: #333333;
        }
      }

      p {
        margin-top: 15px;
        font-weight: 400;
        font-size: 14px;
        color: #7E7E7E;
      }
    }

    .download-btn {
      width: 100px;
      height: 35px;
      background: #FFFFFF;
      border-radius: 3px 3px 3px 3px;
      border: 1px solid #999999;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 14px;
        height: 12px;
        margin-right: 5px;
      }
    }

    &:before {
      content: "";
      left: 0;
      height: 3px;
      background: #00479D;
      transition: all 0.5s;
      position: absolute;
      bottom: 0;
      width: 0;
    }

    &:hover {
      .date-badge {
        transition: all 0.5s;
        background-color: #00479D;
      }

      &:before {
        width: 100%;
      }

      h3 {
        color: #00479D !important;
      }
    }
  }
}
</style>
