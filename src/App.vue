<template>
    <div id="app">
        <pageHeader/>
        <div class="layout-box">
            <router-view></router-view>
        </div>
        <pageFooter/>
    </div>
</template>

<script>
import {mapActions} from "vuex";
import pageHeader from "@/components/page/page-header.vue";
import pageFooter from "@/components/page/page-footer.vue";

export default {
    components: {
        pageHeader,
        pageFooter,
    },
    methods: {
        ...mapActions(["setIsLogin"]),
    },
    created() {
        let token = localStorage.getItem("token");
        let userId = localStorage.getItem("userId");
        let user_is_login = token && userId;
        this.setIsLogin(user_is_login);
    },
};
</script>

<style lang="less">
.main {
  width: 1400px;
  margin: 0 auto;
}

.layout-box {
  background-color: #F4F4F6;
}

.pagination-box {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: #fff !important;
  min-width: 30px !important;
  height: 30px;
  line-height: 30px;
}

.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: @theme !important;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: @theme !important;
  color: #fff !important;
}
</style>