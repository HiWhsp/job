<template>
  <div id="app">
    <pageHeader />
    <router-view></router-view>
    <pageFooter />
  </div>
</template>

<script>
import { mapActions } from "vuex";
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
    let userId = localStorage.getItem("user_id");
    let user_is_login = token && userId;
    this.setIsLogin(user_is_login);
  },
};
</script>
