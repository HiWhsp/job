<template>
	<div class="custom-ckeditor">
		<ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @ready="onReady"></ckeditor>
	</div>
</template>

<script>
	// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";//经典编辑器
	import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document"; //文档编辑器
	import zh_cn from "@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn.js"; //文档编辑器

	import {
		mapState
	} from "vuex";
	export default {
		name: "index",
		components: {},
		data() {
			return {
				// editor: ClassicEditor,
				editor: DecoupledEditor,
				editorData: `
        <h1>文档编辑器 ckeditor</h1>
        <div id="toolbar-container"></div>
        <div id="editor">
          <p>This is the initial editor content.</p>
        </div>
      `,
				editorConfig: {
					// The configuration of the editor.
					language: "zh-cn",
					// translations: [coreTranslations, premiumFeaturesTranslations]
					// toolbar: {
					//   items: [
					//     "exportPDF",
					//     "exportWord",
					//     "|",
					//     "findAndReplace",
					//     "selectAll",
					//     "|",
					//     "heading",
					//     "|",
					//     "bold",
					//     "italic",
					//     "strikethrough",
					//     "underline",
					//     "code",
					//     "subscript",
					//     "superscript",
					//     "removeFormat",
					//     "|",
					//     "bulletedList",
					//     "numberedList",
					//     "todoList",
					//     "|",
					//     "outdent",
					//     "indent",
					//     "|",
					//     "undo",
					//     "redo",
					//     "-",
					//     "fontSize",
					//     "fontFamily",
					//     "fontColor",
					//     "fontBackgroundColor",
					//     "highlight",
					//     "|",
					//     "alignment",
					//     "|",
					//     "link",
					//     "insertImage",
					//     "blockQuote",
					//     "insertTable",
					//     "mediaEmbed",
					//     "codeBlock",
					//     "htmlEmbed",
					//     "|",
					//     "specialCharacters",
					//     "horizontalLine",
					//     "pageBreak",
					//     "|",
					//     "textPartLanguage",
					//     "|",
					//     "sourceEditing",
					//   ],
					//   shouldNotGroupWhenFull: true,
					// },

					list: {
						properties: {
							styles: true,
							startIndex: true,
							reversed: true,
						},
					},

					heading: {
						options: [{
								model: "paragraph",
								title: "Paragraph",
								class: "ck-heading_paragraph"
							},
							{
								model: "heading1",
								view: "h1",
								title: "Heading 1",
								class: "ck-heading_heading1",
							},
							{
								model: "heading2",
								view: "h2",
								title: "Heading 2",
								class: "ck-heading_heading2",
							},
							{
								model: "heading3",
								view: "h3",
								title: "Heading 3",
								class: "ck-heading_heading3",
							},
							{
								model: "heading4",
								view: "h4",
								title: "Heading 4",
								class: "ck-heading_heading4",
							},
							{
								model: "heading5",
								view: "h5",
								title: "Heading 5",
								class: "ck-heading_heading5",
							},
							{
								model: "heading6",
								view: "h6",
								title: "Heading 6",
								class: "ck-heading_heading6",
							},
						],
					},

					placeholder: "Welcome to CKEditor&nbsp;5!",

					fontFamily: {
						options: [
							"default",
							"Arial, Helvetica, sans-serif",
							"Courier New, Courier, monospace",
							"Georgia, serif",
							"Lucida Sans Unicode, Lucida Grande, sans-serif",
							"Tahoma, Geneva, sans-serif",
							"Times New Roman, Times, serif",
							"Trebuchet MS, Helvetica, sans-serif",
							"Verdana, Geneva, sans-serif",
						],
						supportAllValues: true,
					},

					fontSize: {
						options: [10, 12, 14, "default", 18, 20, 22],
						supportAllValues: true,
					},

					htmlSupport: {
						allow: [{
							name: /.*/,
							attributes: true,
							classes: true,
							styles: true,
						}, ],
					},

					htmlEmbed: {
						showPreviews: true,
					},

					// link: {
					//   decorators: {
					//     addTargetToExternalLinks: true,
					//     defaultProtocol: "https://",
					//     toggleDownloadable: {
					//       mode: "manual",
					//       label: "Downloadable",
					//       attributes: {
					//         download: "file",
					//       },
					//     },
					//   },
					// },

					mention: {
						feeds: [{
							marker: "@",
							feed: [
								"@apple",
								"@bears",
								"@brownie",
								"@cake",
								"@cake",
								"@candy",
								"@canes",
								"@chocolate",
								"@cookie",
								"@cotton",
								"@cream",
								"@cupcake",
								"@danish",
								"@donut",
								"@dragée",
								"@fruitcake",
								"@gingerbread",
								"@gummi",
								"@ice",
								"@jelly-o",
								"@liquorice",
								"@macaroon",
								"@marzipan",
								"@oat",
								"@pie",
								"@plum",
								"@pudding",
								"@sesame",
								"@snaps",
								"@soufflé",
								"@sugar",
								"@sweet",
								"@topping",
								"@wafer",
							],
							minimumCharacters: 1,
						}, ],
					},

					removePlugins: [
						// These two are commercial, but you can try them out without registering to a trial.
						// 'ExportPdf',
						// 'ExportWord',
						"AIAssistant",
						"CKBox",
						"CKFinder",
						"EasyImage",
						// This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
						// https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
						// Storing images as Base64 is usually a very bad idea.
						// Replace it on production website with other solutions:
						// https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
						// 'Base64UploadAdapter',
						"RealTimeCollaborativeComments",
						"RealTimeCollaborativeTrackChanges",
						"RealTimeCollaborativeRevisionHistory",
						"PresenceList",
						"Comments",
						"TrackChanges",
						"TrackChangesData",
						"RevisionHistory",
						"Pagination",
						"WProofreader",
						// Careful, with the Mathtype plugin CKEditor will not load when loading this sample
						// from a local file system (file://) - load this site via HTTP server if you enable MathType.
						"MathType",
						// The following features are part of the Productivity Pack and require additional license.
						"SlashCommand",
						"Template",
						"DocumentOutline",
						"FormatPainter",
						"TableOfContents",
						"PasteFromOfficeEnhanced",
					],

					// 配置结束
					simpleUpload: {
						uploadUrl: 'http://example.com',
						headers: {
							// ...
						}
					}
				},
			};
		},
		computed: {},
		created() {},
		mounted() {
			// this.initCkeditorByDom();
			this.initCkeditor();
		},
		methods: {
			initCkeditorByDom() {
				// DecoupledEditor.create(document.querySelector("#editor"))
				//   .then((editor) => {
				//     const toolbarContainer = document.querySelector("#toolbar-container");
				//     toolbarContainer.appendChild(editor.ui.view.toolbar.element);
				//   })
				//   .catch((error) => {
				//     console.error(error);
				//   });
			},
			initCkeditor() {
				console.warn("DecoupledEditor");
				console.warn(DecoupledEditor);
			},
			onReady(editor) {
				// Insert the toolbar before the editable area.
				editor.ui
					.getEditableElement()
					.parentElement.insertBefore(
						editor.ui.view.toolbar.element,
						editor.ui.getEditableElement()
					);
			},
		},
	};
</script>

<style scoped lang="less"></style>