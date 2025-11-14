<template>
	<div class="tinymce-editor">
		<!-- 同一页面使用多个编辑器时必须传入id参数，否则只有第一个编辑器会生效-->
		<editor :id="editorId" v-model="editorValue" :disabled="disabledIn" :init="editorInit" />
	</div>
</template>

<script>
	import {
		SITE_ROOT
	} from '@/config/env.js'

	import request from "@/plugins/request.js"; //  axios 配置
	let apiUploadImage = request.apiUploadImage;
	let apiUploadVideo = request.apiUploadVideo;

	/*
	使用public本地库
	*/
	// 引入tinymce主件
	import tinymce from "../../../public/tinymce/tinymce";
	// 引入tinymce-vue组件
	import Editor from "@tinymce/tinymce-vue";
	import "tinymce/icons/default/icons";
	// 必须引入主体才能汉化和显示
	import "../../../public/tinymce/themes/silver";
	import "@/lang/tinymce/zh_CN";
	// import '../../../../public/tinymce/icons/default/icons'
	// 引入富文本编辑器主题的js和css
	import "../../../public/tinymce/themes/silver/theme.min";
	import "../../../public/tinymce/skins/ui/oxide/skin.min.css";
	// 扩展插件
	import "../../../public/tinymce/plugins/image";
	import "../../../public/tinymce/plugins/link";
	import "../../../public/tinymce/plugins/code";
	import "../../../public/tinymce/plugins/table";
	import "../../../public/tinymce/plugins/lists";
	import "../../../public/tinymce/plugins/wordcount"; // 字数统计插件
	import "../../../public/tinymce/plugins/media"; // 插入视频插件
	import "../../../public/tinymce/plugins/template"; // 模板插件
	import "../../../public/tinymce/plugins/fullscreen";
	import "../../../public/tinymce/plugins/paste";
	import "../../../public/tinymce/plugins/preview";
	import "../../../public/tinymce/plugins/contextmenu";
	import "../../../public/tinymce/plugins/textcolor";
	import "../../../public/tinymce/plugins/indent2em"; // 首行缩进
	// 首行缩进插件需单独下载后将下载文件放在plugins下
	export default {
		name: "Tinymce",
		components: {
			Editor,
		},
		props: {
			type: {
				type: Number,
				default: 0,
			},
			height: {
				type: Number,
				default: 600,
			},
			id: {
				type: String,
				default: "tinymceEditor",
			},
			value: {
				type: String,
				default: "",
			},
			disabledIn: {
				type: Boolean,
				default: false,
			},
			plugins: {
				type: [String, Array],
				default: "link lists image code table wordcount media fullscreen preview paste indent2em lineHeight",
			},
			toolbar: {
				type: [String, Array],
				default: "fontselect | bold italic underline strikethrough indent2em lineHeight | link unlink image media | undo redo | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | indent2em outdent indent blockquote | code | removeformat",
			},
		},
		data() {
			return {
				editorInit: {
					language_url: "@/lang/tinymce/zh_CN.js",
					language: "zh_CN",
					// skin_url: "/public/tinymce/skins/ui/oxide/",
					skin_url: SITE_ROOT + "/dist_pc/tinymce/skins/ui/oxide/",
					// content_css: "/public/tinymce/skins/content/default/content.css",
					content_css: SITE_ROOT + "/dist_pc/tinymce/skins/content/default/content.css",
					height: this.height,
					content_style: `
          * { padding:0; margin:0; } 
          body {padding: 12px;}
          img {max-width:100% !important; display: block; } 
          video { max-width:100% !important; display: block; }
        `,
					plugin_preview_width: 375, // 预览宽度
					plugin_preview_height: 668,
					font_formats: "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
					lineheight_formats: "1 1.1 1.2 1.3 1.35 1.4 1.5 1.55 1.6 1.75 1.8 1.9 1.95 2 2.1 2.2 2.3 2.4 2.5 2.6 2.7 2.8 3 3.1 3.2 3.3 3.4 4 5",
					fontsize_formats: "8px 10px 11px 12px 13px 14px 15px 16px 17px 18px 24px 36px",

					plugins: this.plugins,
					indent2em_val: "2em", // 首行缩进
					powerpaste_word_import: "merge",
					toolbar: this.toolbar,
					paste_data_images: true,
					statusbar: true, // 底部的状态栏
					menubar: true, // 最上方的菜单
					branding: false, // 水印“Powered by TinyMCE”
					convert_urls: false, // 去除URL转换
					// 图片自定义上传
					images_upload_handler: (blobInfo, success, failure) => {
						console.log('1 images_upload_handler')
						const formData = new FormData();
						let file = blobInfo.blob();
						// formData.append("file", file);

						apiUploadImage({
							file: file
						}).then((res) => {
							let {
								code,
								data,
								message
							} = res
							if (code == 200) {
								let name = data.name;
								let size = data.size;
								let url = data.url;
								success(url);
							} else {
								failure(message);
							}
						});
					},
					file_picker_callback: (callback, value, meta) => {
						console.warn("文件选择 tiny-rich-editor");
						console.warn("文件选择 callback", callback);
						console.warn("文件选择 value", value);
						console.warn("文件选择 meta", meta);

						const _that = this;
						var filetype =
							".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4";
						var materialType = "";
						switch (meta.filetype) {
							case "image":
								filetype = ".jpg, .jpeg, .png, .gif";
								materialType = "1";
								break;
							case "media":
								filetype = ".mp3, .mp4";
								break;
							case "file":
							default:
						}
						var input = document.createElement("input");
						input.setAttribute("type", "file");
						input.setAttribute("accept", filetype);
						input.click();
						input.onchange = function() {
							var file = this.files[0];
							if (file.type == "video/mp4" || file.type.indexOf("video") != -1) {
								materialType = "3";
							} else if (
								file.type == "audio/mpeg" ||
								file.type == "audio/mp3" ||
								file.type.indexOf("audio") != -1
							) {
								materialType = "2";
							}

							console.warn("文件选择 onchange materialType = ", materialType);

							if (materialType == "1") {
								//图片上传
								apiUploadImage({
									file: file
								}).then((res) => {
									if (res.code == 200) {
										let name = res.data.name;
										let url = res.url;
										callback(url, {
											title: file.name
										});
									} else {}
								});
							} else {
								// 音频、视频上传
								apiUploadVideo({
									file: file
								}).then((res) => {
									if (res.code == 200) {
										let name = res.data.name;
										let url = res.url;
										console.log('视频资源 url', url)
										callback(url, {
											// title: file.name
										});
									} else {}
								});
							}
						};
					},
				},
				editorId: this.id,
				newValue: "",
			};
		},
		computed: {
			editorValue: {
				get() {
					return this.value;
				},
				set(val) {
					this.newValue = val;
				},
			},
		},
		watch: {
			newValue(newValue) {
				this.$emit("input", newValue);
			},
		},
		mounted() {},
		beforeDestroy() {
			this.clear();
		},
		methods: {
			clear() {
				this.editorValue = "";
			},
		},
	};
</script>
<style lang="less" scoped>
	.mce-offscreen-selection video {
		display: none;
	}
</style>

<style lang="less">

</style>