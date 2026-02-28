<template>
	<div id="root-wrap">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	components: {

	},
	data() {
		return {

		};
	},
	created() {

	},
	methods: {

	},
};
</script>

<style lang="less">
* {
	box-sizing: border-box;
	list-style: none;
	padding: 0;
	margin: 0;
}

body {
	background-color: #fff;
	font-size: 14px;
	font-size: 12px;
	text-align: left;
	font-family: Arial, sans-serif;
}

textarea {
	font-family: Arial, sans-serif;
}




//按钮 水波涟漪效果
.btn-ripple {
	vertical-align: bottom;
}

.btn-ripple:not(:disabled):hover {
	opacity: 1;
	position: relative;
	overflow: hidden;

	&::before {
		animation: ani_ripple 0.75s;
		z-index: 1;
		content: "";
		position: absolute;
		display: block;
		transition: all 0.6s;
		width: 100%;
		height: 0;
		border-radius: 50%;
		left: 50%;
		top: 50%;
		padding-top: 100%;
		transform: translateX(-50%) translateY(-50%);
	}
}

@keyframes ani_ripple {
	0% {
		background: rgba(0, 0, 0, 0.25);
		transform: translateX(-50%) translateY(-50%) scale(0);
	}

	to {
		background: transparent;
		transform: translateX(-50%) translateY(-50%) scale(1);
	}
}


// 所有页面通用样式
// 所有页面通用样式


.el-upload-list--picture-card .el-upload-list__item-thumbnail {
	object-fit: contain;
}


.el-table th.el-table__cell {
	background: #EAECEE !important;

	font-family: PingFang SC, PingFang SC;
	font-weight: 400;
	font-size: 14px;
	color: #333;
}


.el-radio__input.is-checked .el-radio__inner {
	background: #e4393c !important;
	border-color: #e4393c !important;
}

.el-radio__input.is-checked+.el-radio__label {
	color: #000 !important;
}

.el-checkbox__input.is-focus .el-checkbox__inner {
	border-color: #e4393c !important;
}

.el-checkbox__input.is-checked+.el-checkbox__label {
	color: #e4393c !important;
}

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
	background: #e4393c !important;
	border-color: #e4393c !important;
}

.el-button--primary {
	background: linear-gradient(90deg, #157DE9 0%, #3697FD 100%) !important;
}

.el-button--text {
	color: linear-gradient(90deg, #157DE9 0%, #3697FD 100%) !important;
}

.pagination-box {
	text-align: center;
}

.empty {
	min-height: 10vh;
	line-height: 10vh;
	text-align: center;
}

a {
	text-decoration: none;
}

.router-link-exact-active {
	color: #409eff;
}

// 富文本编辑器
.tox-tinymce-aux {
	z-index: 100001 !important;
}

.tox .tox-dialog-wrap {
	z-index: 110001 !important;
}

.el-table th:last-child {
	text-align: center;
}
</style>