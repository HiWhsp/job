<template>
	<div class="bread-wrap flex">
		<div class="bread-box">
			当前位置：
			<!-- <router-link to="/"> 首页 </router-link>
      <span class="bread-divider">></span> -->
			<template v-if="$route.meta.root">
				<a href="javascript:void(0)">
					{{ $route.meta.root }}
				</a>
				<span class="bread-divider">></span>
			</template>
			<router-link to="">
				{{ $route.meta.title || "" }}
			</router-link>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		name: "bread-wrap",
		components: {},
		data() {
			return {};
		},
		created() {},
		methods: {},
	};
</script>

<style scoped lang="less">
	.bread-wrap {
		text-align: left;
		background: #fff;
		height: 40px;
		border-radius: 6px;
		padding: 0 20px;
		font-size: 14px;
		color: #606266;

		a {
			font-size: 14px;
			color: #606266;
		}
	}

	.bread-divider {
		margin: 0 5px;
	}
</style>