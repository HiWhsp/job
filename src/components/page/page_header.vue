<template>
	<div class="header-wrap">
		<div class="header-inner">
			<div class="brand-box">
				<!-- <div class="logo-box">
					<img src="@/assets/logo.png" />
				</div> -->
				<div class="title">
					药简单管理系统
				</div>
			</div>
			<div class="top-right">
				<!-- <div class="notice-box">
					<img src="@/assets/imgs/bell.png" alt="" />
				</div> -->
				<div class="user-info flex" @click="do_user()">
					<div class="avatar-box">
						<img src="@/assets/avatar.png" alt="" />
					</div>
					<div class="user-name">{{vuex_user.userName}}</div>
					<div class="user-role"></div>
					<div class="user-job"></div>
					<div class="user-bumen"></div>
				</div>

				<div class="logout" @click="do_logout()">
					<!-- <button>退出登录</button> -->
					<el-button type="primary">退出登录</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		name: "page-header",
		components: {
			//
		},
		data() {
			return {

			};
		},
		computed: {
			...mapState([]),
		},
		created() {},

		methods: {
			do_user() {
				this.$log('vuex_user', this.vuex_user)
			},
			do_logout() {
				this.$store.commit("clearAdminInfo");
				this.$router.push("/login");
			},
		},
	};
</script>

<style scoped lang="less">
	@keyframes ani_rotate {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.header-wrap {
		box-shadow: 0 2px 10px rgba(7, 0, 72, 0.1);

		.header-inner {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			height: 70px;
			background: #313133;
			color: #fff;

			.brand-box {
				width: 150px;
				width: fit-content;
				height: 70px;
				display: flex;
				align-items: center;
				justify-content: center;

				.logo-box {
					background: #fff;
					padding: 3px;

					img {
						background: #fff;
						width: 120px;
						width: 80px;
						// width: 40px;
						cursor: pointer;
					}
				}

				.title {
					padding-left: 30px;
					font-size: 16px;
					font-weight: bold;
					color: #fff
				}
			}

			.top-right {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				padding-right: 20px;



				.user-info {
					.avatar-box {
						width: 32px;
						height: 32px;
						border-radius: 50%;
						overflow: hidden;

						img {
							width: 100%;
							height: 100%;
							object-fit: cover;
						}
					}

					.user-name {
						margin: 0 10px;
					}

					.user-role {}

					.user-job {}

					.user-bumen {}
				}

				.logout {
					cursor: pointer;
					font-size: 14px;
					font-weight: bold;

					// animation: ani_rotate 3s linear infinite;

					// button {
					//   display: flex;

					align-items: center;

					justify-content: center;
					//   width: 100%;
					//   width: 80px;
					//   height: 32px;
					//   line-height: 32px;
					//   background: #d9bf9d;
					//   opacity: 1;
					//   border-radius: 4px;
					//   font-size: 14px;
					//   color: #ffffff;
					// }
				}
			}
		}
	}
</style>