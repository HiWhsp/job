<template>
	<view class="container" :style="{width: viewWidth + 'px', margin: '0 auto'}">
		<view class="headerImg">
			<img :src="detail.tcImgUrl" alt="" />
		</view>
		<!-- 内容区 -->
		<view class="content">
			<view class="wrap">
				<view class="top-img">
					<img src="../../static/info.png" alt="">
				</view>
				<view class="tit">
					<p>根据国家实名制要求, 请准确填写信息, 我们会进行加密处理.</p>
					<p class="help">*未满18岁/联系电话/收货地址错误无法发货</p>
				</view>
				<view class="form">
					<view class="form-item">
						<view class="label">套餐选择</view>
						<!-- <input type="text" placeholder="请选套餐" v-model="form.name" disabled @click="bindPickerChange"> -->
						<view class="input">
							<picker @change="bindPickerChange" :value="comboIndex" range-key="name" :range="combo">
								<view class="uni-input">{{combo[comboIndex].name}}</view>
							</picker>
						</view>
						<view class="down"></view>
					</view>
					<view class="form-item">
						<view class="label">客户姓名</view>
						<input type="text" placeholder="请输入开卡人姓名" v-model="form.certName">
					</view>
					<view class="form-item">
						<view class="label">身份证号</view>
						<input type="text" placeholder="请输入开卡人身份证号(保密)" v-model="form.certNo">
					</view>
					<view class="form-item">
						<view class="label">选号</view>
						<view class="input" @click="toggle('bottom')">{{ selectPhone }}</view>
						<view class="down"></view>
					</view>
					<view class="form-item">
						<view class="label">联系电话</view>
						<input type="text" placeholder="请输入开卡人电话" v-model="form.contactPhone">
					</view>
					<view class="form-item">
						<view class="label">所在地区</view>
						<view class="input" @click="visible = true">{{ addressName }}</view>
						<view class="down"></view>
					</view>
					<view class="form-item">
						<view class="label">详细地址</view>
						<input type="text" placeholder="请输入详细地址至门牌号(保密)" v-model="postForm.postAddr">
					</view>
					<view class="submit" @click="submit"></view>
				</view>
			</view>
		</view>
		<view class="centerImg">
			<img :src="detail.wtImgUrl" alt="" />
		</view>

		<view class="float">
			<view class="float-it" @click="goUrl('https://kefu1.huasutongxin.com/chat.html', 1)">
				<img src="../../static/icon1.png" alt="">
				<text>在线客服</text>
			</view>
			<view class="float-it" @click="goUrl('https://wmxm.com.cn/yd/trackQuery.html', 2)">
				<img src="../../static/icon2.png" alt="">
				<text>查询订单</text>
			</view>
			<!-- 			<view class="float-it" @click="dialogVisble = true">
				<img src="../../static/icon3.png" alt="">
				<text>限时福利</text>
			</view> -->
		</view>
		<view class="float float2">
			<view class="float-it" @click="goUrl2('https://wmxm.com.cn/yd/M.html')">
				<text>
					一
					证
					通
					查
					询
				</text>
			</view>
		</view>
		<!-- 地区选择 -->
		<cityPicker ref="cityPicker" :column="3" :mask-close-able="maskCloseAble" @confirm="confirm" @cancel="cancel"
			:info="goodsInfo" :visible="visible" />

		<uni-popup ref="popup" background-color="#fff">
			<view class="popup-content">
				<view class="title">请选择喜欢的手机号码</view>
				<view class="list">
					<view class="item" :class="{'active': item == selectPhone}" v-for="item in phoneList" :key="item"
						@click="selectPhone = item">
						{{ item }}
					</view>
				</view>
				<view class="next" @click="nextClick">换一批</view>
			</view>
		</uni-popup>

		<view class="submit-info" ref="submitInfo">
			<view class="info-it">
				<p><text class="label">美团认证: </text><text
						:class="{'success': auditStatus != 2, 'error': auditStatus == 2}">{{ auditStatus != 2 ? '通过' : '风险骑手'}}</text>
				</p>
				<p><text class="label">选择套餐: </text><text>{{ combo[comboIndex].name }}</text></p>
				<p><text class="label">客户姓名: </text><text>{{ form.certName }}</text></p>
				<p><text class="label">身份证号: </text><text>{{ form.certNo }}</text></p>
				<p><text class="label">选择的号码: </text><text>{{ selectPhone }}</text></p>
				<p><text class="label">联系电话: </text><text>{{ form.contactPhone }}</text></p>
				<p><text class="label">所在地区: </text><text>{{ addressName }}</text></p>
				<p><text class="label">详细地址: </text><text>{{ postForm.postAddr }}</text></p>
				<p><text class="label">提交状态: </text><text class="success">已提交</text></p>
			</view>
		</view>

		<view class="popup-mack" v-if="dialogVisble">
			<icon type="clear" color="#fff" size="26" class="clear-mack" @click="close" />
		</view>
		<view class="mack" v-if="dialogVisble"></view>

	</view>
</template>

<script>
	import html2canvas from 'html2canvas';
	import address from '../../static/address.js';
	import cityPicker from '@/uni_modules/piaoyi-cityPicker/components/piaoyi-cityPicker/piaoyi-cityPicker';
	import uniPopup from '@/uni_modules/uni-popup/components/uni-popup/uni-popup';
	export default {
		components: {
			cityPicker,
			uniPopup
		},
		data() {
			return {
				popupType: '1',
				dialogVisble: false,
				viewWidth: '',
				combo: [{
					name: '流量王骑手卡套餐39元优化版',
					value: '77'
				}, {
					name: '流量王骑手卡套餐59元优化版',
					value: '78'
				}],
				comboIndex: 0, // 套餐下标
				goodsId: 77, // 产品id
				userId: 323, // 用户id
				detail: {}, // 商品详情
				form: {
					certName: '', //入网人姓名
					certNo: '', //入网人身份证
					contactPhone: '', //联系方式
					province: '', //省编码
					city: '', //市编码
					chooseNum: '', // 选择的手机号
					url1: '',
					url2: ""
				},
				postForm: {
					"postAddr": '', // 详细地址
					"provinceName": '', //省名称
					"cityName": '', //市名称
					"areaName": '', // 区/县名称
					"provinceCode": '', //省编码
					"postCityCode": '', //市编码
					"areaCode": '', // 区/县编码
				}, // 物流信息
				populate: [], // 选择的地区
				phoneList: [], // 选号数据
				goodsInfo: {},
				visible: false, // 地区弹框显示
				maskCloseAble: true,
				addressName: '请选择地区',
				selectPhone: '请选号', // 选择的号码
				currentPage: 1, // 选号分页
				mtUrl: '',
				auditStatus: '',
				imageFileType: "",
				settingObj: {}
			}
		},
		onLoad() {
			this.getSetting();
			this.setView();
			uni.getSystemInfo({
				success: (info) => {
					if (info.windowWidth >= 750) {
						this.viewWidth = 375
					} else {
						this.viewWidth = info.windowWidth
					}
				}
			});
			uni.onWindowResize(() => {
				uni.getSystemInfo({
					success: (info) => {
						if (info.windowWidth >= 750) {
							this.viewWidth = 375
						} else {
							this.viewWidth = info.windowWidth
						}
					}
				});
			})
		},
		watch: {
			goodsId() {
				this.setView();
			}
		},
		methods: {
			getSetting() {
				// 获取返利信息
				uni.request({
					url: `
							https://wmxm.com.cn/prod-api/system/commission/user/product/limit/findList?userId=${this.userId}&commodityId=${this.goodsId}&pageNum=1&pageSize=20`,
					method: "GET",
					success: (res) => {
						// console.log(res.data.rows[0]);
						this.settingObj = res.data.rows[0];
						console.log(this.settingObj.commissionMoney, this.settingObj.settlementRule);
					}
				})
			},
			setView() {
				uni.request({
					url: 'https://wmxm.com.cn/prod-api/system/uv/add2',
					method: 'post',
					data: {
						goodsId: 77,
						userId: this.userId,
						userName: '13888886666'
					},
					success: (res) => {
						// uni.showToast({
						// 	title: `${res.data.msg}-${this.goodsId}`
						// })
					}
				})
				// 获取产品信息
				uni.request({
					url: 'https://wmxm.com.cn/prod-api/system/commodity/getById?id=' + this.goodsId,
					method: 'GET',
					success: (res) => {
						this.detail = res.data.data;
						this.getPhoneList();

						this.goodsInfo = {
							type: "LT",
							goodsId: this.goodsId,
							logisticsLevel: this.detail.logisticsLevel,
							postProvinceName: this.detail.postProvinceName,
							postCityName: this.detail.postCityName
						}

						// 0 全国 1省内
						// if (this.detail.productLogistics == 1) {
						// 	for (let index = 0; index < this.populate.length; index++) {
						// 		if (this.populate[index].name == '北京') {
						// 			this.populate = [this.populate[index]];
						// 		}
						// 	}
						// 	this.$refs.cityPicker.init('北京')
						// }
					}
				})
			},
			// 提交
			submit() {
				// 第一步 信息校验
				if (!/^(?=(.*[\u4e00-\u9fa5].*){2})/g.test(this.form.certName)) {
					uni.showToast({
						title: '姓名必须为汉字且至少包含2个汉字',
						icon: 'none'
					});
					return false;
				}
				if (!/^[1-9]\d{5}(18|19|2([0-9]))\d{2}(0[0-9]|10|11|12)([0-2][1-9]|[1-2][0-9]|30|31)\d{3}[0-9Xx]$/.test(this.form
						.certNo)) {
					uni.showToast({
						title: '请输入正确的身份证号',
						icon: 'none'
					});
					return false;
				} else {
					let age = this.analyzeIDCard(this.form.certNo);
					if (age < 18 || age > 60) {
						uni.showToast({
							title: '您的年龄不符合要求',
							icon: 'none'
						});
						return false;
					}
				}
				if (this.selectPhone == '请选号') {
					uni.showToast({
						title: '请选择号码',
						icon: 'none'
					});
					return false;
				}
				if (!/^1[3-9]\d{9}$/.test(this.form.contactPhone)) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					});
					return false;
				}
				if (this.addressName == '请选择地区') {
					uni.showToast({
						title: '请选择所在城市',
						icon: 'none'
					});
					return false;
				}
				if (!this.postForm.postAddr) {
					uni.showToast({
						title: '请填写详细地址',
						icon: 'none'
					});
					return false;
				}
				this.checkOrderMsg()
				return;
				// 骑手校验
				uni.request({
					url: 'https://wmxm.com.cn/prod-api/system/orderLt/mtAudit',
					method: 'POST',
					data: {
						certName: this.form.certName, //入网人姓名
						certNo: this.form.certNo, //入网人身份证
						province: this.detail.provinceCode, //省编码
						city: this.detail.cityCode, //市编码
						goodsId: this.goodsId,
						userId: this.userId,
					},
					success: (res) => {
						if (res.data.code != 200) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							return;
						} else if (res.data.data.riskRider == "true" || res.data.data.activeRider == "false") {
							this.auditStatus = 2;
						}
						if (this.auditStatus == 2) {
							uni.showToast({
								title: '当前状态无法申请该骑手卡',
								icon: 'none'
							})
						} else {
							this.checkOrderMsg()
						}
					}
				})
			},
			checkOrderMsg() {
				uni.showLoading({
					title: '提交审核中',
					mask: true,
				})
				uni.request({
					url: 'https://wmxm.com.cn/prod-api/system/orderLt/checkOrderMsg',
					method: 'POST',
					data: {
						certName: this.form.certName, //入网人姓名
						certNo: this.form.certNo, //入网人身份证
						province: this.detail.provinceCode, //省编码
						city: this.detail.cityCode, //市编码
						goodsId: this.goodsId,
						userId: this.userId,
					},
					success: (res) => {
						if (res.data.code != 200) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							uni.hideLoading()
						} else {
							// 第三步 下单
							let yxdtb = {
								"certName": this.form.certName, //入网人姓名
								"postName": this.form.certName, //收件人姓名
								"certNo": this.form.certNo, //入网人身份证
								"contactNum": this.form.contactPhone, //联系方式
								"productCode": this.detail.productCode, //产品code
								"goodsCode": this.detail.goodsCode, //商品code
								"address": this.postForm.postAddr, //详细地址
								"postProvinceName": this.postForm.provinceName, //省名称
								"postCityName": this.postForm.cityName, //市名称
								"postCountyName": this.postForm.areaName, // 区/县名称
								"postProvinceCode": this.postForm.provinceCode, //省编码
								"postCityCode": this.postForm.cityCode, //市编码
								"postCountyCode": this.postForm.areaCode, // 区/县编码
								"goodsId": this.goodsId,
								"provinceCode": this.detail.provinceCode,
								"provinceName": this.detail.provinceName,
								"cityCode": this.detail.cityCode,
								"cityName": this.detail.cityName,
								phoneNum: this.selectPhone,
								// mtUrl: this.mtUrl,
								userId: this.userId,
								commodityAmount: this.settingObj.commissionMoney,
								settlementRule: this.settingObj.settlementRule
							}
							html2canvas(this.$refs.submitInfo.$el).then(async (canvas) => {
								const imgUrl = canvas.toDataURL('image/png');
								const res = await this.openQrCode(imgUrl)
								if (res) {
									yxdtb.mtUrl = this.mtUrl;
									this.tempAdd(yxdtb);
								} else {
									uni.showToast({
										title: '下单失败',
										icon: 'none'
									})
								}
							});
						}
					}
				})
			},
			// 测试提交接口
			tempAdd(data) {
				uni.request({
					url: 'https://wmxm.com.cn/prod-api/system/orderLt/mlAddOrder',
					method: 'POST',
					data: {
						...data
					},
				}).then(res => {
					if (res.data.code === 200) {
						uni.showToast({
							title: '订单已成功提交',
							icon: 'success'
						})
						this.comboIndex = 0
						this.clear();
					} else {
						uni.showToast({
							title: res.data.msg,
						})
						uni.hideLoading()
					}
				})
			},
			// 清空数据
			clear() {
				this.comboIndex = 0; // 套餐下标
				this.goodsId = this.goodsId; // 产品id
				this.form = {
					certName: '', //入网人姓名
					certNo: '', //入网人身份证
					contactPhone: '', //联系方式
					province: '', //省编码
					city: '', //市编码
					chooseNum: '', // 选择的手机号
					url1: ""
				};
				this.postForm = {
					"postAddr": '', // 详细地址
					"provinceName": '', //省名称
					"cityName": '', //市名称
					"areaName": '', // 区/县名称
					"provinceCode": '', //省编码
					"postCityCode": '', //市编码
					"areaCode": '', // 区/县编码
				} // 物流信息
				this.visible = false; // 地区弹框显示
				this.maskCloseAble = true;
				this.addressName = '请选择地区';
				this.selectPhone = '请选号'; // 选择的号码
				this.currentPage = 1; // 选号分页
				this.getPhoneList();
			},
			// 获取选号
			getPhoneList() {
				let paramStr = {
					"goodsId": this.goodsId,
					"goodsCode": this.detail.goodsCode,
					"productCode": this.detail.productCode,
					"provinceCode": this.detail.provinceCode,
					"provinceName": this.detail.provinceName,
					"cityCode": this.detail.cityCode,
					"cityName": this.detail.cityName,
				}
				uni.request({
					url: 'https://wmxm.com.cn/prod-api/system/orderLt/mlGetPhoneList',
					method: 'POST',
					data: paramStr,
					success: (res) => {
						this.phoneList = res.data.data
					}
				})
			},
			// 套餐选择
			bindPickerChange(e) {
				console.log(e);
				this.comboIndex = e.detail.value;
				this.goodsId = this.combo[this.comboIndex].value;
				this.getSetting();
			},

			toggle(type) {
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			},
			// 选号换一批
			nextClick() {
				this.currentPage++;
				this.getPhoneList();
			},
			// 地区选择确定
			confirm(val) {
				this.addressName = val.name;
				this.postForm = val;
				this.visible = false
			},
			cancel() {
				this.visible = false
			},
			//年龄判断
			analyzeIDCard(IDCard) {
				var age = 0,
					yearBirth, monthBirth, dayBirth;
				if (IDCard.length == 15) {
					var org_birthday = IDCard.substring(6, 12);
					//获取出生年月日
					yearBirth = "19" + org_birthday.substring(0, 2);
					monthBirth = org_birthday.substring(2, 4);
					dayBirth = org_birthday.substring(4, 6);
				} else if (IDCard.length == 18) {
					//获取出生年月日
					yearBirth = IDCard.substring(6, 10);
					monthBirth = IDCard.substring(10, 12);
					dayBirth = IDCard.substring(12, 14);
				}
				//获取当前年月日并计算年龄
				var myDate = new Date();
				var monthNow = myDate.getMonth() + 1;
				var dayNow = myDate.getDate();
				var age = myDate.getFullYear() - yearBirth;

				if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
					age--;
				}
				//返回年龄
				return age;
			},
			goUrl2(url) {
				window.open(url, '_self');
			},
			goUrl(url, type) {
				if (type == 1) {
					uni.navigateTo({
						url: "/pages/webView/webView?url=" + url
					})
				} else {
					uni.navigateTo({
						url: '/pages/trackQuery/trackQuery'
					})
				}
			},
			openQrCode(baseDate) {
				// 将base64字符串转换为二进制对象
				let base64Blob = base64ToBlob(baseDate);

				// 创建一个FormData对象
				const fileUrl = URL.createObjectURL(base64Blob);
				console.log(fileUrl);
				// 上传文件
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: 'https://wmxm.com.cn/prod-api/file/uploadOss', //仅为示例，非真实的接口地址
						filePath: fileUrl,
						name: 'file',
						success: (uploadFileRes) => {
							this.mtUrl = JSON.parse(uploadFileRes.data).data.url;
							resolve(this.mtUrl);
						},
						fail: (err) => {
							console.log(err);
							reject(err)
						}
					});
				})
				// 辅助函数：将base64字符串转换为二进制对象
				function base64ToBlob(base64Data) {
					let arr = base64Data.split(',');
					let mime = arr[0].match(/:(.*?);/)[1];
					let bstr = atob(arr[1]);
					let n = bstr.length;
					let u8arr = new Uint8Array(n);

					while (n--) {
						u8arr[n] = bstr.charCodeAt(n);
					}

					return new Blob([u8arr], {
						type: mime
					});
				}
			},
			lockImg(type) {
				this.popupType = type
				this.$refs.popup.open()
			},
			// 选择图片并上传
			uploadImage(type) {
				this.popupType = type
				uni.chooseImage({
					count: 1, // 默认最多选择9张，这里限制为1张
					sizeType: ['original'], // 可以选择原图或压缩图
					sourceType: ['album', 'camera'], // 从相册或相机选择
					success: (res) => {
						const tempFilePaths = res.tempFilePaths; // 选择的图片临时路径数组
						this.uploadToServer(tempFilePaths[0]); // 上传第一张图片
					},
					fail: (err) => {
						console.log('选择图片失败', err);
					}
				});
			},

			// 上传图片到服务器
			uploadToServer(filePath) {
				uni.uploadFile({
					url: 'https://wmxm.com.cn/prod-api/file/uploadOss', // 替换为你的服务器上传接口地址
					filePath: filePath, // 要上传的图片路径
					name: 'file', // 后端接收文件的字段名
					success: (res) => {
						const data = JSON.parse(res.data)
						// res.data 是服务器返回的数据，通常是 JSON 格式
						if (this.popupType == 2) {
							this.form.url1 = data.data.url;
						} else {
							this.form.url2 = data.data.url;
						}
					},
					fail: (err) => {
						console.log('上传失败', err);
					}
				});
			},
			close() {
				this.dialogVisble = false;
			}
		}
	}
</script>

<style lang="less">
	@thumb: #FFCCCB; // 全局颜色

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.content {
			width: 100%;
			background: linear-gradient(180deg, #F36E6E, #F99797);
			padding: 80rpx 0;

			.wrap {
				position: relative;
				margin: 0 40rpx;
				background-color: #fff;
				border-radius: 40rpx;

				.top-img {
					position: absolute;
					width: 300rpx;
					height: 80rpx;
					top: -40rpx;
					left: 50%;
					margin-left: -150rpx;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.tit {
					padding: 40rpx 40rpx 0;
					font-size: 28rpx;
					line-height: 48rpx;

					.help {
						color: #f00;
					}
				}

				.form {
					padding: 40rpx;

					.form-item {
						border-radius: 10rpx;
						overflow: hidden;
						display: flex;
						align-items: center;
						border: 2rpx solid @thumb;
						margin-bottom: 10rpx;

						.label {
							width: 150rpx;
							padding: 0 20rpx;
							box-sizing: border-box;
							height: 60rpx;
							line-height: 60rpx;
							text-align: justify;
							color: #fff;
							font-size: 26rpx;
							background-color: @thumb;

							&:after {
								content: '';
								display: inline-block;
								width: 100%;
							}
						}

						.input {
							width: 350rpx;
							height: 60rpx;
							padding-left: 20rpx;
							font-size: 28rpx;
							line-height: 60rpx;
							color: #4c4c4c;

							.uni-input {
								height: 60rpx;
								line-height: 60rpx;
							}
						}

						input {
							width: 350rpx;
							height: 60rpx;
							padding-left: 20rpx;
							font-size: 28rpx;
						}

						.down {
							margin-left: 10rpx;
							width: 0;
							height: 0;
							border-left: 20rpx solid transparent;
							border-right: 20rpx solid transparent;
							border-top: 20rpx solid @thumb;
						}
					}

					.img_url {
						width: 100%;

						.label {
							width: 100%;
							text-align: left;
						}
					}

					.wrap-img {
						display: flex;

						img {
							width: 300rpx;
							height: 400rpx;
						}

						.shili {
							position: relative;
							display: flex;
							align-items: center;
							justify-content: center;

							p {
								background-color: #c4c4c4;
								border-radius: 40rpx;
								padding: 20rpx 40rpx;
								position: absolute;
								color: #fff;
							}
						}

						.img-over {
							// border: 1px solid #c4c4c4;
							width: 300rpx;
							display: flex;
							justify-content: center;
							align-items: center;

							p {
								background-color: #c4c4c4;
								border-radius: 40rpx;
								padding: 20rpx 40rpx;
								position: absolute;
								color: #fff;
							}
						}
					}

					.submit {
						margin-top: 40rpx;
						width: 100%;
						height: 80rpx;
						background-image: url(../../static/submit.png);
						background-repeat: no-repeat;
						background-size: 100% 100%;
					}
				}
			}
		}

		.tip {
			position: relative;
			padding: 40rpx;
			box-sizing: border-box;
			width: 100%;
			background-color: #FFCCCB;

			.idea {
				margin-top: -60rpx;
				background-color: #fff;
				border-radius: 40rpx;
				padding: 80rpx 20rpx 40rpx;
				font-size: 24rpx;
				line-height: 42rpx;

				.help {
					color: #f00;
				}

				.tit {
					position: relative;
					display: inline-block;
					z-index: 2;
					font-weight: bold;
					color: #000;
				}
			}

			img {
				height: 60rpx;
				padding: 0 200rpx;
				box-sizing: border-box;
			}
		}

		img {
			width: 100%;
			display: block;
		}
	}

	.popup-content {
		padding: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.title {
			text-align: center;
			font-size: 32rpx;
			margin-bottom: 20rpx;
		}

		.list {
			height: 300rpx;
			overflow: auto;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.item {
				width: 320rpx;
				height: 60rpx;
				text-align: center;
				line-height: 60rpx;
				border: 2rpx solid #e5e5e5;
				border-radius: 10rpx;
				margin-bottom: 10rpx;
			}

			.active {
				border-color: @thumb;
			}
		}

		.next {
			margin-top: 20rpx;
			width: 150rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 10rpx;
			background-color: #e5e5e5;
			text-align: center;
		}
	}

	.popup {
		img {
			width: 80vw;
			height: 70vh;
		}
	}

	.float {
		position: fixed;
		top: 25%;
		right: 0;
		background-color: #fff;
		padding: 40rpx 20rpx;
		border-radius: 80rpx;
		z-index: 22;

		img {
			width: 60rpx;
			height: 60rpx;
		}

		.float-it {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 24rpx;
			margin-top: 30rpx;
		}

		.float-it:nth-child(1) {
			margin-top: 0rpx;
		}
	}

	.float2 {
		top: 55%;
		background-color: #E5F3FF;
		opacity: 0.9;

		.float-it {
			font-size: 40rpx;
			color: #0772FC;
		}
	}

	.submit-info {
		width: 100%;
		background-color: @thumb;
		position: fixed;
		z-index: -22;

		.info-it {
			padding: 40rpx;
			color: #fff;

			p {
				line-height: 60rpx;

				.label {
					display: inline-block;
					width: 200rpx;
				}

				.success {
					color: #0f0;
				}

				.error {
					color: #f00;
				}
			}
		}
	}


	.popup-mack {
		position: fixed;
		z-index: 99;
		top: 20%;
		width: 100%;
		height: 1000rpx;
		background-image: url("https://hzkj-bucket-pro.oss-cn-beijing.aliyuncs.com/image/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20251103093909.png?Expires=2708214021&OSSAccessKeyId=LTAI5tC9MeBESx8K6iKJDK65&Signature=BsXo4iawmCfb6j9qigZT4lXwBPc%3D");
		background-size: 90% 90%;
		background-repeat: no-repeat;

		.clear-mack {
			position: absolute;
			right: 50rpx;
		}
	}

	.mack {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		background-color: #000;
		z-index: 25;
		opacity: 0.3;
	}
</style>