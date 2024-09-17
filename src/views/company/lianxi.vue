<script>
export default {
    name: "lianxi",
    data() {
        return {
            list: [{
                title: '0536-8383589   0536-8372589',
                desc: '如有意见建议请在工作日9:00- 18:00致电我们',
                imgUrl: require('@/static/about/phone.png')
            }, {
                title: 'lizhiqiang@fumotor.com',
                desc: '如有意见建议请发送邮件至我们的邮箱',
                imgUrl: require('@/static/about/emil.png')
            }, {
                title: '山东省潍坊市奎文区宝通街与文化路之间潍鹰工业园',
                desc: '如有业务合作欢迎到公司洽谈合作',
                imgUrl: require('@/static/about/map.png')
            }],

            listOne: [{
                title: '0512-87888990   0512-87888991',
                desc: '如有意见建议请在工作日9:00- 18:00致电我们',
                imgUrl: require('@/static/about/phone.png')
            }, {
                title: 'lizhiqiang@fumotor.com',
                desc: '如有意见建议请发送邮件至我们的邮箱',
                imgUrl: require('@/static/about/emil.png')
            }, {
                title: '昆山市玉杨路1111号联东U谷高新区国际科创园14幢一、二层',
                desc: '如有业务合作欢迎到公司洽谈合作',
                imgUrl: require('@/static/about/map.png')
            }]
        }
    },
    methods: {}
}
</script>

<template>
    <div class="content flex">
        <div class="item-wrap">
            <div class="title">山东富俊机械科技有限公司</div>
            <div class="flex flex-between">
                <div class="item" v-for="(item, index) in list" :key="index">
                    <img :src="item.imgUrl" alt="">
                    <p class="tit">{{ item.title }}</p>
                    <p class="desc">{{ item.desc }}</p>
                </div>
            </div>
        </div>
        <div class="col"></div>
        <div class="item-wrap">
            <div class="title">富俊机械科技(昆山)有限公司</div>
            <div class="flex flex-between">
                <div class="item" v-for="(item, index) in listOne" :key="index">
                    <img :src="item.imgUrl" alt="">
                    <p class="tit">{{ item.title }}</p>
                    <p class="desc">{{ item.desc }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.content {
  padding: 77px 0 56px;
  flex-direction: column;
  justify-content: center;

  .col {
    margin: 82px 0 57px 0;
    width: 1200px;
    border: 1px solid #707070;
  }

  .item-wrap {
    width: 1082px;

    .title {
      font-family: Roboto, Roboto;
      font-weight: bold;
      font-size: 36px;
      color: #383635;
        text-align: center;
    }

    .item {
      img {
        width: 240px;
        height: 140px;
      }

      .tit {
        width: 288px;
        font-family: Roboto, Roboto;
        font-weight: bold;
        font-size: 18px;
        color: #333333;
        margin-top: 31px;
      }

      .desc {
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 14px;
        color: #8D8D8D;
        margin-top: 45px;
      }
    }
  }
}
</style>
