<template>
  <div class="wrap">
    <div class="inner">
      <customCkeditor />
			
			<!-- <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor> -->
    </div>
  </div>
</template>

<script>
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import customCkeditor from "@/components/richEditor/customCkeditor.vue";

import { mapState } from "vuex";
export default {
  name: "test-ckeditor",
  components: {
    customCkeditor,
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less"></style>
