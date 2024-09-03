<template>
    <div class="page">
        <div class="nav-bar">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="condition-filter">
            <p class="title">条件筛选</p>
            <div class="filter flex">
                <p class="name">种类</p>
                <div class="item-wrap flex">
                    <div class="item pointer" :class="{ 'active': index + 1 === item.id }" v-for="(item, index) in filterItem" :key="index"
                         @click="itemNav(item)">
                        {{ item.title }}
                    </div>
                </div>
            </div>
        </div>
        <div></div>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            index: '',
            // 筛选分类
            filterItem: [
                {
                    title: '全封闭同步带模组',
                    id: 1
                }, {
                    title: '全封闭同步带模组',
                    id: 2
                }, {
                    title: '全封闭同步带模组',
                    id: 3
                }, {
                    title: '全封闭同步带模组',
                    id: 4
                }, {
                    title: '全封闭同步带模组',
                    id: 5
                }, {
                    title: '全封闭同步带模组',
                    id: 6
                }, {
                    title: '全封闭同步带模组',
                    id: 7
                }, {
                    title: '全封闭同步带模组',
                    id: 8
                }, {
                    title: '全封闭同步带模组',
                    id: 9
                }, {
                    title: '全封闭同步带模组',
                    id: 10
                }
            ]
        }
    },
    methods: {
        itemNav(item) {
            this.index = item.id
        }
    }

}
</script>

<style lang="less" scoped>
.condition-filter {
  margin-top: 21px;
  height: 152px;
  background: #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  padding: 15px 18px;

  .title {
    font-family: Roboto, Roboto;
    font-weight: bold;
    font-size: 16px;
    color: #000000;
    font-style: normal;
    text-transform: none;
  }

  .filter {
    margin-top: 28px;
    align-items: start;

    .name {
      width: 100px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      font-style: normal;
      text-transform: none;
    }

    .item-wrap {
      flex-wrap: wrap;
      flex: 1;

      .item {
        width: 123px;
        height: 29px;
        line-height: 29px;
        border-radius: 2px 2px 2px 2px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 14px;
        color: #333;
        font-style: normal;
        text-transform: none;
        margin: 0 60px 20px 0;
      }

      item.active {
        border: 1px solid #A66600;
      }
    }
  }
}
</style>
