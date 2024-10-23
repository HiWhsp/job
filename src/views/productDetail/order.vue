z`
<template>
    <div class="main">
        <div class="inner">
            <div class="section">
                <div class="section-title">选择收货人地址</div>
                <div class="section-ctx">
                    <div class="address-list p-l-30">
                        <div class="address-item" v-for="(item, index) in list_address" :key="index"
                             :class="{ active: item.id == address_selected.id }" @click="do_toggle_address(item)">
                            <div class="address-top">{{ item.name_phone }}</div>
                            <div class="address-bottom">
                                {{ item.full_addr }}
                            </div>
                            <img src="@/assets/img/productDetail/address-select.png" alt="" class="marker"/>
                        </div>
                        <div v-if="list_address.length == 0" class="empty-dev">还没有收件地址</div>
                    </div>
                    <div class="btn-box p-l-30">
                        <button class="btn-ripple" @click="open_addr_add()">+ 新增地址</button>
                    </div>
                </div>
            </div>

            <div class="section section-pay">
                <div class="section-title">支付方式</div>
                <div class="section-ctx section-ctx-type p-l-30">
                    <div class="pay-group">
                        <div class="title">支付方式 ：</div>
                        <div class="pay-items">
                            <div class="item" v-for="(item, index) in payTypeOption" @click="do_toggle_paytype(item)"
                                 :class="{ checked: pay_type_value == item.value }">
                                <img class="img-check check-0 check-img check-img-0" src="@/static/common/check0.png"
                                     alt=""/>
                                <img class="img-check check-1 check-img check-img-1" src="@/static/common/check1.png"
                                     alt=""/>
                                <img class="marker-img" :src="item.icon" alt=""/>
                                <span>{{ item.title }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 线下转款信息 -->
                    <div class="xianxia-info" v-if="payType == '对公转账'">
                        <div class="info-item">
                            <div class="info-label">收款人信息：</div>
                            <div class="info-val">{{ bankList[0].bankUser }}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">户名：</div>
                            <div class="info-val">{{ bankList[0].company }}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">开户行：</div>
                            <div class="info-val">{{ bankList[0].bankName }}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">账号：</div>
                            <div class="info-val">{{ bankList[0].bankAccount }}</div>
                        </div>
                    </div>
                    <div v-if="payType == '对公转账'" class="pay-img scroll-target-pingzheng">
                        <el-upload
                                multiple
                                name="img"
                                action="https://wuhanjingmi.new.zhishangez.com//service.php?action=index_ossUpload"
                                list-type="picture-card"
                                :on-success="handleSuccessImg"
                        >
                            <div slot="default" class="flex upload__text">
                                <p><i class="el-icon-plus"></i></p>
                                <span>上传支付凭证</span>
                            </div>
                        </el-upload>
                    </div>
                </div>
            </div>

            <!--      发票-->
            <div class="section section-pay">
                <div class="section-title">发票信息</div>
                <div class="section-ctx section-ctx-type">
                    <div class="pay-group">
                        <div class="title">是否开票 ：</div>
                        <div class="pay-items">
                            <div class="item" v-for="(item, index) in invoiceTypeOption"
                                 @click="do_toggle_invoice(item)"
                                 :class="{ checked: invoice_info.invoiceType == item.value }">
                                <div class="invoice">{{ item.title }}</div>
                            </div>
                        </div>
                    </div>
                    <!--  -->
                    <div class="invoice-info" v-if="invoice_info.invoiceType === '1'">
                        <div class="info-item">
                            <div class="info-label">发票抬头类型</div>
                            <div class="info-val">
                                <el-radio-group v-model="invoice_info.titleType" fill="#A66600">
                                    <el-radio label="1">个人</el-radio>
                                    <el-radio label="2">企业</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><span>*</span> 发票抬头</div>
                            <div class="info-val">
                                <el-input v-model="invoice_info.title"
                                          placeholder="请填写准确的抬头名称 必填"></el-input>
                            </div>
                        </div>
                        <div class="info-item" v-if="invoice_info.titleType === '2'">
                            <div class="info-label"><span>*</span> 纳税人识别号</div>
                            <div class="info-val">
                                <el-input v-model="invoice_info.shibiema"
                                          placeholder="请填写准确的纳税人识别号 必填"></el-input>
                            </div>
                        </div>
                    </div>

                    <div class="invoice-info" v-if="invoice_info.invoiceType === '2'">
                        <div class="info-item">
                            <div class="info-label"><span>*</span> 发票抬头</div>
                            <div class="info-val">
                                <el-input v-model="invoice_info.title"
                                          placeholder="请填写准确的抬头名称 必填"></el-input>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><span>*</span> 纳税人识别号</div>
                            <div class="info-val">
                                <el-input v-model="invoice_info.shibiema"
                                          placeholder="请填写准确的纳税人识别号 必填"></el-input>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><span>*</span> 注册地址</div>
                            <div class="info-val">
                                <el-input v-model="invoice_info.companyAddress"
                                          placeholder="输入单位注册地址 必填"></el-input>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><span>*</span> 注册电话</div>
                            <div class="info-val">
                                <el-input v-model="invoice_info.companyPhone"
                                          placeholder="输入单位注册电话 必填"></el-input>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><span>*</span> 开户银行</div>
                            <div class="info-val">
                                <el-input v-model="invoice_info.bankName" placeholder="输入开户银行 必填"></el-input>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><span>*</span> 账户银行</div>
                            <div class="info-val">
                                <el-input v-model="invoice_info.bankNo" placeholder="输入银行账户 必填"></el-input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 商品列表 -->
            <div class="section section-product">
                <div class="section-title">订单商品</div>
                <div class="section-ctx">
                    <div class="goods-list ">
                        <!-- <div class="title">订单商品</div> -->
                        <div class="list">
                            <div class="goods-list-inner">
                                <!-- 标题 -->
                                <div class="list-title flex p-l-30">
                                    <div class="box-title">
                                        <div class="title-text">商品</div>
                                    </div>
                                    <div class="box-unit">单价</div>
                                    <div class="box-num">数量</div>
                                    <div class="box-subtitle">金额</div>
                                </div>
                                <!-- 商品列表 -->
                                <div class="item p-l-30" v-for="(item, index) in payment_products" :key="index">
                                    <div class="item-detail flex">
                                        <div class="box-title flex">
                                            <div class="poster-box">
                                                <el-image :src="item.image">
                                                    <div slot="error" class="image-slot">
                                                        <img :src="item.image"/>
                                                    </div>
                                                </el-image>
                                            </div>
                                            <div class="title-box">
                                                {{ item.title }}
                                                <div class="box-sku">
                                                    {{ item.keyVals }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="box-unit">{{ vuex_huobi }} {{ item.priceSale }}</div>
                                        <div class="box-num">{{ item.num }}</div>
                                        <div class="box-subtitle">
                                            {{ vuex_huobi }} {{ (item.priceSale * item.num).toFixed(2) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--            优惠券-->
            <div class="order-action" v-if="list_coupon.length">
                <div class="order-action-inner">
                    <div class="section-item">
                        <div class="sub-title flex" @click="showCoupon = !showCoupon"
                             :class="{ 'expand-0': !showCoupon }">
                            <div class="text">使用优惠</div>
                            <img src="@/static/common/pay-arrow-top.png" alt=""/>
                        </div>

                        <div class="yhq-list" v-if="showCoupon">
                            <div class="yhq-item" v-for="(item, index) in list_coupon" :key="index"
                                 :class="{ active: coupon_select_id == item.id }"
                                 @click="handleCouponSelect(item)">
                                <img src="@/assets/img/productDetail/gou.png" alt="" class="marker"/>
                                <div class="yhq-top">
                                    <div class="yhq-1">
                                        <div class="text-1">{{ vuex_huobi }}{{ +item.jian }}</div>
                                        <div class="text-2">满{{ +item.man }}可用</div>
                                    </div>
                                    <div class="yhq-bottom">
                                        <div class="yhq-3">{{ item.title }}</div>
                                    </div>
                                    <div class="yhq-2"> 2020.12.21 - 2020.12.28
                                        <!--                    {{ item.endTime && item.endTime.substr(0, 10) }}-->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!--   组合商品-->
            <div class="section section-product" :style="{ paddingBottom: '37px' }">
                <div class="section-title">组合折扣</div>
            </div>

            <div class="combination-list">
                <div
                        class="combination-item-wrap"
                        v-for="(item, index) in 5"
                        :key="index"
                >
                    <div class="combination-img-wrap">
                        <img src="@/assets/img/productDetail/combination.png" alt=""/>
                    </div>
                    <div class="combination-title">激光平面窗口片</div>
                    <div class="combination-price">￥5.25</div>
                </div>
            </div>

            <!-- 电子合同 -->
            <div class="section section-product" :style="{ paddingBottom: '29px' }">
                <div class="section-title">电子合同</div>
            </div>
            <div class="contract-wrap">是否签约电子合同</div>
            <div class="radio-wrap">
                <el-radio-group v-model="radio" fill="#234498">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="2">否</el-radio>
                </el-radio-group>
            </div>
            <div class="download-wrap">
                <div class="download-btn">
                    <div class="download-img-wrap">
                        <img src="@/assets/img/productDetail/download1.png" alt=""/>
                    </div>
                    <div class="download-text">下载电子合同</div>
                </div>
            </div>

            <!--      汇总信息-->
            <div class="huizong">
                <div class="item">
                    <!-- <span class="text">共：</span> -->
                    <b class="val">共 {{ total_product_number || 0 }} 件</b>
                </div>

                <div class="item">
                    <span class="text">商品总价：</span>
                    <b class="val">{{ vuex_huobi }} {{ pay_info.goodsPrice || 0 }}</b>
                </div>

                <div class="item">
                    <span class="text">优惠券：</span>
                    <b class="val">-{{ vuex_huobi }} {{ money_yhq || 0 }}</b>
                </div>

                <!-- <div class="item">
                  <span class="text">积分抵现：</span>
                  <b>-{{ vuex_huobi }} {{ money_jifen_dixian || 0 }}</b>
                </div> -->

                <!-- <div class="item">
                  <span class="text">佣金：</span>
                  <b>-{{ vuex_huobi }} {{ money_yongjin_dixian || 0 }}</b>
                </div> -->

                <div class="item">
                    <span class="text">运费：</span>
                    <b>{{ vuex_huobi }} {{ pay_info.foreignYunfei || 0 }}</b>
                </div>
                <div class="item">
                    <span class="text">满减：</span>
                    <b>- {{ vuex_huobi }} {{ pay_info.foreignManjian || 0 }}</b>
                </div>
                <div class="item total">
                    <span class="text">总计：</span>
                    <b>{{ vuex_huobi }} {{ pay_info.orderPrice }}</b>
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="bottom-btns">
                <button class="btn-ripple fit-text btn-1" @click="$router.push('/cart')">
                    返回购物车
                </button>
                <button class="btn-ripple fit-text btn-2" @click="do_submit()">提交订单</button>
            </div>
        </div>


        <!-- 新增收货地址弹窗 -->
        <address_modal ref="address_modal" @confirm="confirm_add_address"/>
        <foreign_address_modal ref="foreign_address_modal" @confirm="confirm_add_address"/>

        <!-- 余额支付弹窗 -->
        <balance_password_set_modal ref="balance_password_set_modal"/>
        <!-- 余额支付弹窗 -->
        <balance_pay_modal ref="balance_pay_modal"/>
        <!-- 余额支付失败弹窗 -->
        <balance_pay_disable_modal ref="balance_pay_disable_modal"/>
        <!-- 微信支付弹窗 -->
        <orderPayWxCode ref="orderPayWxCode" :payment_money="real_payment_money"/>
        <!-- 支付等待弹窗 -->
        <orderPayWaiting ref="orderPayWaiting"/>

        <!-- 图片预览 -->
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt=""/>
        </el-dialog>

        <!-- 订单支付提示 -->
        <el-dialog class="modal-pay-tip" title="订单提醒" :visible.sync="order_confirm_tip" width="30%"
                   :before-close="handleClose" :close-on-click-modal="false" :append-to-body="true">
            <span>确认支付当前订单？</span>
            <span slot="footer" class="dialog-footer">
        <button class="btn-ripple btn-cancel" @click="order_confirm_tip = false">
          取 消
        </button>
        <button class="btn-ripple btn-confirm" @click="do_confirm_submit()">
          确认支付
        </button>
      </span>
        </el-dialog>

    </div>
</template>

<script>
import {SHOP_TYPE} from '@/config/env.js'
import address_modal from "@/components/address/address_modal.vue"; //新增地址
import foreign_address_modal from "@/components/address/foreign_address_modal.vue"; //新增地址
import balance_password_set_modal from "@/components/payment/balance_password_set_modal.vue";
import balance_pay_modal from "@/components/payment/balance_pay_modal.vue";
import balance_pay_disable_modal from "@/components/payment/balance_pay_disable_modal.vue";
import orderPayWxCode from "@/components/order/orderPayWxCode.vue";
import orderPayWaiting from "@/components/order/orderPayWaiting.vue";
import {mapState} from "vuex";

import pay1 from "@/assets/img/productDetail/pay1.png";
import pay2 from "@/assets/img/productDetail/pay2.png";
import pay3 from "@/assets/img/productDetail/pay3.png";
import pay4 from "@/assets/img/productDetail/pay4.png";

export default {
    name: "order-submit",
    components: {
        address_modal,
        foreign_address_modal,
        balance_password_set_modal,
        balance_pay_modal,
        balance_pay_disable_modal,
        orderPayWxCode,
        orderPayWaiting,
    },
    data() {
        return {
            is_order_test: false, //订单测试
            from: '', //product-detail  ||  cart
            address_selected: {}, //地址
            pagination_address: {
                page: 1,
                pagenum: 20
            },
            coupon_selected: {}, //优惠券
            coupons_for_allow_use: [],
            remark: '',
            //
            total_product_number: 0,
            total_product_price: 0, //商品总金额
            total_order_price: 0, //订单总金额
            order_zhekou_bili: 10, //折扣比例 10折 默认不打折
            order_zhekou_price: 0, //折扣金额
            order_yunfei: 0, //运费金额
            order_points_dixian_price: 0, //积分抵现金额
            order_points_dixian_number: 0, //使用积分数量


            pay_info: {}, //预下单信息
            jifen_pay: {
                // if_open: 1,//是否开启积分抵现
                // jifen: "17",//可用积分
                // money: "1.70",//可抵扣金额
                // rule: 10//抵扣比例 rule 积分抵扣 1元
            }, //积分抵现信息
            //

            my_info: {}, //我的信息 包含 余额 佣金数值
            total_balance: 0,
            // 发票信息
            invoice_info: {
                invoiceStatus: 0, //是否开票 0-不需要 1-需要发票
                invoiceType: '', //发票类型：1-普通发票 2-专用发票
                titleType: '1', //抬头：1-个人 2-单位
                title: '', // 公司名称
                shibiema: '', // 识别码
                companyAddress: '', // 注册地址
                companyPhone: '', // 注册电话
                bankName: '', // 开户银行
                bankNo: '', // 银行账号
                email: '', // 电子邮箱
                orderId: '', // 关联订单
            },
            // 支付方式
            payTypeValue: 2,
            pay_type_value: 'weixin',
            Invoice_type_value: '0', // 开票类型
            payTypeOption: [
                {value: 'weixin', title: '微信支付', icon: pay1},
                {value: 'zhifubao', title: '支付宝支付', icon: pay2},
                {value: 'paypal', title: '对公转账', icon: pay3},
                {value: 'yuejie', title: '月结支付', icon: pay4},
            ],
            // 发票类型
            invoiceTypeOption: [
                {value: '', title: '不开票', icon: ''},
                {value: '1', title: '普通发票', icon: ''},
                {value: '2', title: '专用发票', icon: ''},
            ],

            orderId: "", //是否已经创建过订单
            showCoupon: true, //

            if_use_jifen: true, //是否使用积分抵扣
            if_use_yongjin: true, //是否使用佣金扣减
            currency: "￥", //货币

            money_yunfei: 0,
            order_price: 0, //总 订单金额

            yh_code: "",
            yh_code_info: {},

            peisong_type: "快递配送",
            address: "", //选择的地址
            list_address: [], //地址列表
            payment_products: [], //要支付的商品信息
            list_coupon: [], //优惠券
            coupon_select_id: "", //选择的优惠券 id
            bankList: [], // 线下卡列表

            form: {
                real_name: "",
                phone: "",
                address: "",
                company: "",
                u_group: "",
                worker: "",
            },

            is_pay_pass: 0, //是否设置余额支付密码
            payType: "", // 支付类型
            invoiceType: "", // 发票类型
            upload_limit_number: 6,
            dialogVisible: false,
            dialogImageUrl: "", //转账图片查看
            order_confirm_tip: false, //确认支付信息提示
            xianxia_file_list: [],

            // 电子合同
            radio: "2",
        };
    },
    computed: {
        ...mapState(["if_calc_yunfei"]),

        real_payment_money() {
            let money = parseFloat((this.total_order_price - this.order_points_dixian_price).toFixed(2))
            return money
        },
        //

        coupon_select() {
            return this.list_coupon.find((v) => v.id == this.coupon_select_id) || {};
        },

        opts_peisong() {
            let arr = ["快递配送", "上门自提"];
            return arr;
        },

        //使用积分支付要抵扣的积分
        use_jifen_num() {
            if (!this.if_use_jifen) {
                return 0;
            }

            // debugger

            //需要优先考虑选择优惠券后的积分数值变动
            let jifen = 0;
            let total_dixian_jifen = this.jifen_pay.jifen || 0; //最大可抵扣积分数值
            if (this.money_yhq) {
                if (this.jifen_pay.money && this.order_price) {
                    //最大可抵扣金额 = （剩余待支付金额 = 订单金额 - 优惠金额） 与  可使用积分的最大抵扣金额

                    let last_dixian_jifen =
                        (this.order_price - this.money_yhq) * this.jifen_pay.rule;
                    if (last_dixian_jifen < 0) {
                        total_dixian_jifen = 0;
                    } else {
                        total_dixian_jifen =
                            last_dixian_jifen < total_dixian_jifen
                                ? last_dixian_jifen
                                : total_dixian_jifen;
                    }
                }
            }
            if (this.baseInfo.jifen && total_dixian_jifen) {
                if (this.baseInfo.jifen < total_dixian_jifen) {
                    jifen = this.baseInfo.jifen;
                } else {
                    jifen = total_dixian_jifen;
                }
            }

            return parseInt(jifen);
        },

        //优惠金额
        money_yhq() {
            let money_yhq = 0;
            if (this.coupon_select_id) {
                let yhq = this.list_coupon.find((v) => v.id == this.coupon_select_id) || {};
                money_yhq = yhq.jian || 0;
            }
            return money_yhq;
        },

        //积分抵现金额
        money_jifen_dixian() {
            let money = 0;
            if (this.use_jifen_num && this.jifen_pay.rule) {
                money = this.use_jifen_num / this.jifen_pay.rule;
            }
            return +money;
        },

        //佣金抵现金额
        money_yongjin_dixian() {
            if (!this.if_use_yongjin) {
                return 0;
            }
            if (!this.baseInfo.yongjin) {
                return 0;
            }
            // debugger
            let money_yongjin = 0;
            let money_last = 0; //剩余待支付金额
            if (this.order_price) {
                money_last = this.order_price - this.money_yhq - this.money_jifen_dixian;

                if (money_last > this.baseInfo.yongjin) {
                    money_yongjin = this.baseInfo.yongjin;
                } else {
                    money_yongjin = money_last;
                }
            }

            return money_yongjin.toFixed(2);
        },

    },
    watch: {},
    created() {
        this.from = this.$route.query.from || '';
        this.getCacheProduct();

        // 获取用户
        this.query_user();
        // 获取地址列表
        this.query_address();
        //获取线下卡列
        this.getBankList();
        // 获取优惠券列表
        this.query_coupon();

        this.query_pay_info();


    },
    methods: {
        //下单成功后 移除商品信息
        clearCacheProduct() {
            if (this.from == 'cart') {
                //移除购物车中商品
                let guige_ids = this.payment_products.map(v => v.inventoryId).join(',')
                this.$api({
                    url: '/service.php',
                    method: 'get',
                    data: {
                        action: 'gouwuche_del',
                        inventoryId: guige_ids, //产品规格id(多个用,分开)
                    },
                }).then(res => {
                    if (res.code == 200) {
                        this.$store.commit('set_vuex_cart_number', res.count)
                    }
                })
            }
            sessionStorage.removeItem('cache_payment_products')
        },

        //获取缓存的产品信息
        getCacheProduct() {
            //本地产品数据
            let cache_payment_products = sessionStorage.getItem('cache_payment_products');
            if (cache_payment_products) {
                this.payment_products = JSON.parse(cache_payment_products)

                let total_product_number = 0;
                let total_product_price = 0;
                this.payment_products.forEach(v => {
                    total_product_number += parseInt(v.num)
                    total_product_price += v.price_sale * parseInt(v.num)
                })
                this.total_product_number = total_product_number;
                this.total_product_price = total_product_price;
                console.log(total_product_price, 's数量11')
                this.$log('缓存 待下单产品', this.payment_products)
            } else {

            }
        },

        //获取缓存的地址信息
        query_user() {
            // this.$store.dispatch("query_user");
            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'users_userInfo',
                },
            }).then(res => {
                if (res.code == 200) {
                    this.my_info = res.data;
                    this.total_balance = parseFloat(this.my_info.money) || 0;
                }
            })
        },

        //获取地址列表
        query_address() {
            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'userAddress_lists',
                    ...this.pagination_address,
                    // shop_id: this.id,
                },
            }).then(res => {
                if (res.code == 200) {
                    let data = res.data

                    data.forEach((v) => {
                        if (SHOP_TYPE == 'foreign') {//海外商城
                            v.full_addr = [v.country, v.province, v.city, v.area, v.address].filter(v => !!v).join(',');
                            v.name_phone = `${v.firstName} ${v.lastName} (${v.phone})`
                        } else {
                            v.full_addr = [v.country, v.province, v.city, v.area, v.address].filter(v => !!v).join(',');
                            v.name_phone = `${v.name} (${v.phone})`
                        }
                    });
                    this.list_address = data;

                    let obj = data.find((v) => v.moren) || {};
                    this.address_selected = obj || {};
                }
            })
        },

        get_pay_info_params() {
            let product_items = this.payment_products.map(v => ({
                "inventoryId": v.inventoryId,
                "productId": v.productId,
                "num": v.num
            }))
            let productInfo = JSON.stringify(product_items)

            let params = {
                productInfo: productInfo,
                addressId: this.address_selected.id || '',
                yhqId: this.coupon_select_id,//优惠券记录ID
            }
            return params
        },


        get_pay_params() {
            let product_items = this.payment_products.map(v => ({
                "inventoryId": v.inventoryId,
                "productId": v.productId,
                "num": v.num
            }))
            let productInfo = JSON.stringify(product_items)

            let params = {
                invoiceStatus: this.invoice_info.invoiceStatus,//是否开票 0-不需要 1-需要发票
                productInfo: productInfo,
                addressId: this.address_selected.id || '',
                peisongType: 1,//配送类型：1-快递物流 2-上门自提
                peisongTime: '',//配送时间
                yhqId: this.coupon_select_id,//优惠券记录ID
                remark: '',//备注
                cash_on_delivery: this.pay_type_value == 'paypal' ? 1 : 0,//是否货到付款 0-否 1-是
            }
            return params
        },


        //根据下单商品获取确认订单信息
        query_pay_info() {
            let params = this.get_pay_info_params();

            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'orders_getPayInfo',
                    ...params
                },
            }).then((res) => {
                let {code, data, msg} = res;
                if (code == 200) {
                    this.pay_info = data;
                    this.jifen_pay = data.jifenPay || {}; //积分信息

                    //
                    this.total_order_price = data.orderPrice || 0
                    //this.total_product_price = data.goods_price || 0;
                    this.order_zhekou_bili = parseFloat(data.zhekou) || 10
                    this.order_zhekou_price = parseFloat(data.zhekouPrice) || 0
                    this.order_yunfei = data.yunfei || 0;

                    if (this.coupon_selected.id) {
                        this.total_order_price = (this.total_order_price - this.coupon_selected.jian).toFixed(2)
                    }

                    this.order_price = data.orderPrice;
                    this.money_yunfei = +data.yunfei || 0;
                    this.jifen_pay = data.jifenPay;
                }
            });
        },


        do_toggle_paytype(item) {
            this.pay_type_value = item.value
            this.payType = item.title
            let value = item.title
            if (value == "余额支付") {
                if (this.baseInfo.is_pay_pass == 0) {
                    //未设置支付密码
                    this.$refs.balance_password_set_modal.init(this.baseInfo);
                } else if (this.total_balance < this.real_payment_money) {
                    //余额不足提示
                    this.$refs.balance_pay_disable_modal.init({
                        money: this.real_payment_money,
                    });
                }
            }
        },

        // 发票信息选择
        do_toggle_invoice(item) {
            if (item.value != 0) {
                this.invoice_info.invoiceStatus = 1;
            } else {
                this.invoice_info.invoiceStatus = 0
            }
            this.invoice_info.invoiceType = item.value;
        },
        yuePayPassSetCallback() {
            this.is_pay_pass = 1;
        },


        parentHandleModalAction(option = {}) {
            let type = option.type || "";
            if (type == "修改绑定") {
                this.$store.dispatch("query_user");
            }
        },


        //提交订单
        do_submit() {
            let params_info = {
                ...this.form,
            };
            delete params_info.phone;

            if (!this.address_selected.id) {
                alertErr("请选择收货地址");
                return;
            }

            if (!this.pay_type_value) {
                alertErr("请选择支付方式");
                return;
            }

            if (this.pay_type_value == "xianxia") {
                console.log(this.xianxia_file_list)
                if (!this.xianxia_file_list.length) {
                    alertErr("请上传转款凭证信息");
                    this.scrollToTarget(".scroll-target-pingzheng");
                    return;
                }
            }

            if (this.pay_type_value == "balance") {
                if (this.total_balance < +this.real_payment_money) {
                    alertErr("您的余额不足，请选择其他支付方式");
                    return;
                }
                // if (!this.is_pay_pass) {
                //   alertErr("请先设置余额支付密码");
                //   this.$refs.balance_password_set_modal.init(this.baseInfo);
                //   return;
                // }
            }

            this.order_confirm_tip = true;
        },

        //滚动到指定位置 元素类名
        scrollToTarget(clsName) {
            // var element = document.querySelector(".wenxian-box");
            var element = document.querySelector(clsName);
            element.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        },

        handleClose(done) {
        },

        //订单提交-支付
        do_confirm_submit() {
            this.order_confirm_tip = false;
            let params = this.get_pay_params();

            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'orders_create',
                    ...params,
                },
            }).then((res) => {
                if (res.code == 200) {
                    let {id, orderNo} = res.data;
                    this.orderId = id;
                    this.invoice_info.orderId = id;
                    this.invoice_pay(orderNo); // 发票支付
                    this.do_order_pay();
                }
            });
        },

        //支付方式调取
        do_order_pay() {
            if (this.is_order_test) {
                this.pay_use_yue()
            } else {
                if (this.pay_type_value == "weixin") {
                    this.order_payment_wx_pc();
                } else if (this.pay_type_value == "zhifubao") {
                    this.order_payment_zfb();
                } else if (this.pay_type_value == "yue") {
                    this.pay_use_yue()
                } else if (this.pay_type_value == "xianxia") {
                    this.order_payment_xianxia();
                } else if (this.pay_type_value == "paypal") {
                    // this.pay_use_paypal();
                    this.toPaySuccess();
                }
            }
        },

        invoice_pay(orderNo) {
            if (this.invoice_info.invoiceType == 0) {
                return;
            }

            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'invoices_add',
                    id: 0,
                    ...this.invoice_info
                },
            })
        },

        pay_use_yue() {
            // this.$refs.balance_pay_modal.init({
            //   orderId: this.orderId,
            //   money: this.real_payment_money,
            // });

            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'pay_balance',
                    orderType: 1,
                    orderId: this.orderId,
                },
            }).then((res) => {
                alert(res)
                let {code, message} = res;
                if (code == 200) {
                    this.toPaySuccess();
                } else {
                }
            });
        },

        pay_use_paypal() {
            // this.toPaySuccess();

            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'pay_balance',
                    orderType: 1,
                    orderId: this.orderId,
                },
            }).then((res) => {
                alert(res)
                let {code, message} = res;
                if (code == 200) {
                    this.toPaySuccess();
                } else {
                }
            });
        },


        //微信支付 pc
        order_payment_wx_pc() {
            this.$api("pay_weixin", {
                orderId: this.orderId,
                orderType: 1
            }).then((res) => {
                //console.log("pc 微信扫码", res);
                // alert(res);
                let {code, data} = res;
                if (res.code == 200) {
                    let info = {
                        // ...res,
                        qrcode: data.qrcode,
                        orderId: this.orderId,
                    };
                    this.$refs.orderPayWxCode.init(info);
                    // this.$refs.orderPayWxCode.qrcode = data.qrcode;
                    // this.$refs.orderPayWxCode.showModal = true;
                    // this.showWaiting();
                } else {
                    alert(res.msg);
                }
            });
        },

        //pc 支付宝支付
        order_payment_zfb() {
            // alertErr('尚未开通支付宝支付');

            this.showWaiting();

            this.$api("orders_aliScanCodePay", {
                orderId: this.orderId,
            }).then((res) => {
                //console.log("支付宝支付", res);
                let {code, msg, data} = res;
                if (code == 200) {
                    const {href} = this.$router.resolve({
                        path: "/zfbPay",
                        query: {
                            htmlData: data,
                        },
                    });
                    window.open(href, "_blank");

                    // this.$router.push({
                    //   path: "/zfbPay",
                    //   query: {
                    //     htmlData: data,
                    //   },
                    // });
                }
            });
        },

        //余额支付
        order_payment_yue() {
            if (+this.baseInfo.money < +this.real_payment_money) {
                alertErr("您的余额不足，请选择其他支付方式");
                return;
            }

            this.$api("orders_yuePay", {orderId: this.orderId}).then((res) => {
                //console.log("余额支付", res);
                let {code, message} = res;

                if (code == 200) {
                    this.toPaySuccess();
                } else {
                }
            });
        },

        //线下转款
        order_payment_xianxia() {
            this.$api("pay_offline", {
                orderType: 1,
                orderId: this.orderId,
                bankId: this.bankList[0].id,
                images: this.xianxia_file_list.join(','),
            }).then((res) => {
                let {code, message} = res;

                if (code == 200) {
                    this.toPaySuccess();
                } else {
                    // this.toFail();
                }
            });
        },

        toFail() {
            this.$router.push(`/payFail?orderId=${this.orderId}`);
        },

        //订单微信jsapi支付
        orderPayWxJsapi() {
            let that = this;
            order.orders_wxPay({
                params: {
                    orderId: this.orderId,
                },
                success: (data) => {
                    //console.log("订单微信jsapi支付", data);
                    let {timeStamp, nonceStr, signType, paySign} = data;

                    wx.chooseWXPay({
                        timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr, // 支付签名随机串，不长于 32 位
                        package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                        signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign, // 支付签名
                        success: function (res) {
                            that.toPaySuccess();
                        },
                        fail(err) {
                            //console.log("支付失败了");
                        },
                    });
                },
                fail: (err) => {
                    //console.log("支付失败", err);
                },
            });
        },

        showWaiting() {
            this.clearTimer();
            let that = this;

            this.$refs.orderPayWaiting.show = true;

            this.timer = setInterval(() => {
                this.$api("orders_detail", {
                    id: this.orderId,
                }).then((res) => {
                    let {code, data, msg} = res;
                    if (data.status == 2 || data.status == 3) {
                        that.toPaySuccess();
                    }
                });
            }, 2000);
        },

        clearTimer() {
            clearInterval(this.timer);
            this.timer = null;
        },

        //支付成功操作
        toPaySuccess() {
            if (this.mode == "yue") {
                this.$router.push(`/yue`);
            } else {
                this.$router.push(`/orderCompleted?id=${this.orderId}`);
            }
        },

        //购物车 删除支付的商品
        shopcart_delete_payment() {
            let ids = this.payment_products.map((v) => v.inventoryId);
            let id = ids.join();

            this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "gouwuche_del",
                    inventoryId: inventoryId,
                }
            }).then(res => {
                if (res.code == 200) {
                    let list = this.list_shopcart;
                    let ids = (inventoryId + "").split(",");
                    //可能删除多项商品
                    ids.forEach((inventoryId) => {
                        let index = list.findIndex((v) => v.inventoryId == inventoryId);
                        list.splice(index, 1);
                    });

                    this.do_update_vuex_cart_number()
                }
            })
        },

        //选择收货地址
        do_toggle_address(item) {
            this.address_selected = item;
            this.query_pay_info()
        },

        //新增地址
        open_addr_add() {
            if (SHOP_TYPE == 'foreign') {
                this.$refs.foreign_address_modal.init();
            } else {
                this.$refs.address_modal.init();
            }
        },

        confirm_add_address() {
            this.query_address()
        },

        // 订单积分抵现
        order_jifen_dixian() {
            this.$api("orders_jifenPay", {
                orderId: this.orderId,
                jifen: this.use_jifen_num,
            }).then((res) => {
                //console.log("积分抵现", res);
                let {code, is_over, message} = res;
                if (code == 200) {
                    if (this.if_use_yongjin && this.money_yongjin_dixian) {
                        this.order_yongjin_pay();
                    } else {
                        alert(res);
                        if (is_over == 1) {
                            //支付完成
                            this.$router.push("/order-list");
                        } else {
                            this.to_pay_methods();
                        }
                    }
                }
            });
        },

        //订单佣金抵现
        order_yongjin_pay() {
            this.$api("orders_yuePay", {
                orderId: this.orderId,
            }).then((res) => {
                //console.log("余额抵扣", res);
                let {code, is_over} = res;
                if (code == 200) {
                    alert(res);
                    if (is_over == 1) {
                        //支付完成
                        this.$router.push("/order-list");
                    } else {
                        this.to_pay_methods();
                    }
                }
            });
        },

        //订单创建成功
        to_pay_methods() {
            if (this.$route.query.from == "cart") {
                this.shopcart_delete_payment();
            }

            this.$router.push({
                path: "/orderSubmit",
                query: {
                    orderId: this.orderId,
                    from: "order-submit",
                },
            });
        },

        beforeUpload_pingjia(file) {
            const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
            return isLt2M;
        },

        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.response.data;
            this.dialogVisible = true;
        },

        //优惠券选择
        handleCouponSelect(item) {
            if (this.coupon_select_id === item.id) {
                this.coupon_select_id = '';
            } else {
                this.coupon_select_id = item.id;
            }
            this.query_pay_info();
        },

        // 获取线下卡列
        getBankList() {
            this.$api('pay_getOfflineBanks').then(res => {
                if (res.code == 200) {
                    this.bankList = res.data
                }
            })
        },

        // 查询优惠券
        query_coupon() {
            this.$api("yhq_myList", {
                scene: 1,
                page: 1,
                pageSize: 1000,
            }).then((res) => {
                let {code, data} = res;
                if (code == 200) {
                    this.list_coupon = data.list;
                }
            });
        },

        // 上传凭证
        handleSuccessImg(response, file, fileList) {
            this.xianxia_file_list = fileList.map(item => item.response.data);
        }
    },
};
</script>

<style scoped lang="less">
.upload-box {
  padding: 20px 20px;
  text-align: left;
}

.btn-cancel {
  min-width: 100px;
  height: 40px;
  border: 1px solid @theme;
  color: @theme;
  font-size: 14px;
}

.btn-confirm {
  margin-left: 20px;
  min-width: 100px;
  height: 40px;
  background: @theme;
  color: #fff;
  font-size: 14px;
}

.img-check {
  cursor: pointer;

  &.check-0 {
    display: block;
  }

  &.check-1 {
    display: none;
  }
}

.checked {
  cursor: pointer;

  .check-0 {
    display: none !important;
  }

  .check-1 {
    display: block !important;
  }
}

.main {
  width: 100%;
  text-align: center;
  font-size: 14px;
  padding: 33px 0 50px 0;

  .inner {
    background: #FFFFFF;
    width: 1400px;
    margin: 0 auto;
    padding: 22px 30px 50px;
  }

  .goods-list {
    // border: 1px solid #cccccc;
    // margin-bottom: 40px;
    text-align: left;

    .title {
      padding-left: 20px;
      height: 48px;
      line-height: 48px;
      background: #F5F5F5;
      border-bottom: 1px solid #cccccc;
      font-size: 14px;
      font-weight: bold;
      color: #333333;
    }

    .list {
      .list-title {
        height: 50px;
        background: #FAFBFC;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        line-height: 50px;
        font-style: normal;
        text-transform: none;

        .box-title {
          flex: 1;
          text-align: left;

          .title-text {
            //margin-left: 70px;
          }
        }

        .box-sku {
          width: 240px;
        }

        .box-unit {
          width: 240px;
        }

        .box-num {
          width: 240px;
        }

        .box-subtitle {
          width: 240px;
        }
      }

      .item {
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .item-detail {
          padding: 15px 0;
          //text-align: center;
          font-family: OPPOSans, OPPOSans;
          // font-weight: bold;
          font-size: 14px;
          color: #666666;


          .box-title {
            flex: 1;

            .poster-box {
              //margin-left: 70px;
              margin-right: 16px;
            }

            img {
              width: 70px;
              height: 70px;
            }

            .el-image {
              width: 70px;
              height: 70px;
            }
          }

          .box-sku {
            margin-top: 5px;
            width: 240px;
            font-size: 12px;
            font-family: Roboto, Roboto;;
            font-weight: 400;
            color: #999999;
          }

          .box-unit {
            width: 240px;
            color: #FF0000;
          }

          .box-num {
            width: 240px;
          }

          .box-subtitle {
            width: 240px;
            color: #FF0000;
          }
        }
      }
    }

  }

  .bottom-btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;

    button {
      & + button {
        margin-left: 16px;
      }

      &.btn-1 {
        min-width: 200px;
        height: 45px;
        background: #FFFFFF;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid @theme;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: @theme;
      }

      &.btn-2 {

        width: 200px;
        height: 45px;
        background: @theme;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: #FFFFFF;
      }

      &:hover {
        opacity: 0.8;
      }

    }
  }

  .huizong {
    padding: 24px 45px;
    background: #f9f9f9;

    .item {
      margin-bottom: 16px;
      text-align: right;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 14px;
      color: #666666;

      &:last-child {
        margin-bottom: 0;
      }

      b {
        display: inline-block;
        min-width: 185px;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
      }
    }

    .total {
      text-align: right;

      b {
        font-family: Arial, Arial;
        font-weight: bold;
        font-size: 20px;
        color: #FF0000;
      }
    }
  }

}

.ziti-wrap {
  margin-bottom: 40px;
  text-align: left;
  min-height: 127px;
  background: #ffffff;
  border: 1px solid #cccccc;

  .ziti-title {
    .flex-between();
    padding-left: 20px;
    padding-right: 20px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    border-bottom: 1px solid #cccccc;
    border-top: none;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
  }

  .ziti-ctx {
    padding: 30px 20px;

    .ziti-info {
      margin-bottom: 15px;
      .flex();

      span {
        display: inline-block;
        min-width: 100px;
      }

      .el-input {
        width: auto;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// 支付配送方式选择

.type-select {
  margin-bottom: 40px;
  text-align: left;
  min-height: 127px;
  background: #ffffff;
  border: 1px solid #cccccc;

  .type-title {
    padding-left: 20px;
    padding-right: 20px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    border-bottom: 1px solid #cccccc;
    border-top: none;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
  }

  .type-inner {
    padding: 30px 20px;

    .select-1 {
      .flex();

      & + .select-1 {
        margin-top: 30px;
      }

      .title {
        font-size: 14px;
        font-weight: bold;
        color: #333333;
      }

      .list {
        padding-left: 20px;

        button {
          margin-right: 20px;
          min-width: 96px;
          height: 30px;
          line-height: 30px;
          background: #ffffff;
          border: 1px solid #cccccc;

          &.active {
            border: 1px solid @theme;
          }
        }
      }
    }

    .ziti-box {
      padding-top: 10px;

      .title {
        font-weight: bold;
      }

      .ziti-info {
        margin-top: 10px;
      }
    }
  }
}

// 订单优惠等
.order-action {
  //background: #FAFBFC;

  .order-action-inner {
    padding-bottom: 10px;
  }

  .section-item {
    margin-bottom: 20px;

    .sub-title {
      height: 50px;
      background: #FAFBFC;
      padding-left: 30px;

      .text {
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: bold;
        color: #333333;
      }

      img {
        width: 16px;
        margin-left: 10px;
      }
    }

    .yhq-list {
      display: flex;
      flex-wrap: wrap;
      padding: 15px;

      .yhq-item {
        width: 211px;
        height: auto;
        border-radius: 4px;
        position: relative;
        margin-right: 24px;
        cursor: pointer;
        background-image: url("~@/assets/img/productDetail/discounts.png");

        &.active {

          .marker {
            width: 40px;
            height: 40px;
            display: block;
          }
        }

        .marker {
          position: absolute;
          right: 0;
          bottom: 0;
          display: none;
        }

        .yhq-top {
          height: auto;
          padding: 10px 15px;

          .yhq-1 {
            .flex();
            align-items: flex-end;

            .text-1 {
              font-size: 28px;
              font-family: Roboto, Roboto;;
              font-weight: bold;
              color: #fff;
            }

            .text-2 {
              margin-left: 5px;
              font-size: 14px;
              font-family: Roboto, Roboto;;
              font-weight: 400;
              color: #fff;
              line-height: 25px;
            }
          }

          .yhq-2 {
            font-size: 14px;
            font-family: Roboto, Roboto;
            padding: 0 5px;
            font-weight: 400;
            color: #fff;
            text-align: left;
          }
        }

        .yhq-bottom {
          height: 32px;
          line-height: 32px;
          padding: 0 5px;
          font-size: 14px;
          font-family: Roboto, Roboto;;
          font-weight: 400;
          color: #fff;
          text-align: left;
        }
      }
    }
  }

}

// 新增
.section {
  padding-bottom: 40px;
  text-align: left;

  .section-title {
    padding-bottom: 16px;
    border-bottom: 1px solid #d5d8de;
    font-size: 24px;
    color: #333333;
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-style: normal;
    text-transform: none;
  }

  .section-ctx {
    margin-top: 24px;

    .address-list {
      display: flex;
      flex-wrap: wrap;
      overflow-y: auto;
      width: 100%;
      height: 130px;

      .address-item {
        position: relative;
        width: 350px;
        height: 130px;
        background: #FFFFFF;
        border: 2px solid @theme;
        margin-top: 20px;
        margin-right: 45px;
        min-height: 130px;
        padding: 15px 20px;
        border-radius: 4px 4px 4px 4px;
        overflow: hidden;
        cursor: pointer;


        &:nth-child(3n) {
          margin-right: 0;
        }

        &:nth-child(-n + 3) {
          margin-top: 0;
        }

        &.active {
          border: 2px solid @theme;

          .marker {
            display: block;
          }
        }

        .marker {
          position: absolute;
          right: -1px;
          bottom: -1px;
          display: none;
        }

        .address-top {
          padding-bottom: 15px;
          border-bottom: 1px solid #d5d8de;
          font-size: 14px;
          font-family: Roboto, Roboto;;
          font-weight: 400;
          color: #000000;
        }

        .address-bottom {
          padding-top: 15px;
          font-size: 14px;
          font-family: Roboto, Roboto;;
          font-weight: 400;
          color: #999999;
        }
      }

      .empty-dev {
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        font-style: normal;
        text-transform: none;
      }
    }

    .btn-box {
      margin-top: 25px;

      button {
        width: 124px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 2px 2px 2px 2px;
        border: 1px solid @theme;
        font-size: 14px;
        font-weight: normal;
        color: @theme;
      }
    }

    .invoice-info {
      padding-left: 120px;
      margin-top: 31px;

      .info-item {
        .flex();
        margin-top: 26px;

        .info-label {
          width: 100px;
          text-align: right;
          margin-right: 18px;
          color: #666;

          span {
            color: #FF5F00;
          }
        }
      }
    }
  }
}

.section-info {
  .input-list {
    display: flex;
    flex-wrap: wrap;

    .input-item {
      width: 440px;
      margin-top: 34px;
      margin-right: 40px;

      &:nth-child(3n) {
        margin-right: 0;
      }

      &:nth-child(-n + 3) {
        margin-top: 0;
      }

      .label {
        margin-bottom: 16px;
        font-size: 14px;
        font-weight: normal;
        color: #666666;

        span {
          color: @theme;
        }
      }

      .val {
        .img-address-edit {
          margin-left: 15px;
          width: 16px;
          cursor: pointer;
        }
      }
    }
  }
}

// 支付配送
.section-pay {
  .pay-group {
    .flex();

    .title {
      min-width: 120px;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #666666;
    }

    .pay-items {
      flex: 1;
      .flex();

      .item {
        .flex();
        margin-right: 60px;
        cursor: pointer;

        .check-img {
          width: 21px;
        }

        .check-img-1 {
          display: none;
        }

        .marker-img {
          width: 39px;
          height: 39px;
          margin: 0 10px;
        }

        span {
          font-size: 16px;
          font-family: Roboto, Roboto;
          font-weight: 400;
          color: #000000;
        }

        .invoice {
          width: 105px;
          height: 33px;
          line-height: 33px;
          background: #FFFFFF;
          border-radius: 2px 2px 2px 2px;
          border: 1px solid #D6D6D6;
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 16px;
          text-align: center;
          color: #333333;
          font-style: normal;
          text-transform: none;
        }
      }

      .checked {
        .invoice {
          border: 1px solid @theme;
          color: @theme;
        }
      }
    }

    .peisong-items {
      .item {
        text-align: center;
        width: 144px;
        height: 40px;
        line-height: 40px;
        background: #ffffff;
        border-radius: 3px 3px 3px 3px;
        border: 1px solid @theme;
        font-size: 14px;
        font-family: Roboto, Roboto;;
        font-weight: bold;
        color: @theme;
      }
    }
  }
}

.section-product {
  .sub-title {
    padding-left: 30px;
    height: 50px;
    background: #fafbfc;
    cursor: pointer;

    &.expand-0 {
      margin-bottom: 15px;
    }

    .text {
      font-size: 14px;
      font-family: Roboto, Roboto;;
      font-weight: bold;
      color: #333333;
    }

    img {
      width: 16px;
      margin-left: 15px;
    }
  }

  .yhq-select-info {
    height: 50px;
    line-height: 50px;
    background: #fafbfc;
    padding: 0 30px;

    .number {
      color: @theme;
      margin: 0 10px;
    }
  }

  .remark-box {
    .input-box {
      padding: 15px;
    }
  }
}

.section-ctx-type {
  padding-left: 32px;
  padding-left: 0;
}

// 余额信息
.yue-info {
  margin-top: 32px;
  padding: 24px 120px;
  padding: 24px 32px;
  // padding-bottom: 0;
  border: 1px dashed #ccc;

  .info-item {
    .flex();
    align-items: flex-start;
    margin-bottom: 10px;

    .info-label {
      line-height: 32px;
      padding-right: 10px;
      font-size: 14px;
      font-family: Roboto, Roboto;;
      font-weight: 400;
      color: #666666;
    }

    .info-val {
      line-height: 32px;
      font-size: 14px;
      font-family: Roboto, Roboto;;
      font-weight: 400;
      color: #666666;
    }

    .yue-warn-tip {
      color: @theme;
      font-size: 14px;
    }
  }
}

// 线下转款信息
.xianxia-info {
  margin-top: 32px;
  margin-left: 120px;
  padding: 12px 24px;
  width: 995px;
  background: #FEF8EE;
  border: 1px solid #F1E2CA;

  .info-item {
    .flex();
    align-items: flex-start;
    margin-bottom: 10px;

    .info-label {
      line-height: 32px;
      padding-right: 10px;
      font-size: 14px;
      font-family: Roboto, Roboto;;
      font-weight: 400;
      color: #333;
    }

    .info-val {
      line-height: 32px;
      font-size: 14px;
      font-family: Roboto, Roboto;;
      font-weight: 400;
      color: @theme;
    }
  }
}

.pay-img {
  margin-top: 32px;
  margin-left: 120px;
}

.p-l-30 {
  padding-left: 30px;
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/order-submit.less"></style>

<style lang="less">
@media screen and (max-width: 1199px) {
  .modal-pay-tip {
    .el-dialog {
      width: 80% !important;

      .el-dialog__header {
        height: 40px;
        line-height: 40px;
        padding-left: 15px;
      }

      .el-dialog__title {
        font-size: 16px;
      }

      .el-dialog__headerbtn {
        top: 10px;
        right: 10px;
      }

      .el-dialog__headerbtn .el-dialog__close {
        font-size: 24px;
      }

      .el-dialog__body {
        padding: 30px 20px;
        font-size: 14px;
      }

      .el-dialog__footer {
        padding-bottom: 25px;
        display: flex;
        justify-content: center;
      }

      .btn-cancel {
        height: 32px;
      }

      .btn-confirm {
        height: 32px;
      }
    }
  }
}

.upload__text {
  flex-direction: column;
  justify-content: center;
  height: 148px;

  span, p {
    line-height: 30px;
  }
}

.combination-list {
  display: flex;
  gap: 20px;
  text-align: left;
  margin-bottom: 41px;

  .combination-item-wrap {
    width: 250px;
    height: 345px;
    background: #ffffff;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #dfdfdf;

    .combination-img-wrap {
      width: 248px;
      height: 248px;
      border-radius: 8px;
      border: 1px solid #dfdfdf;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .combination-title {
      padding: 11px 15px 0 19px;
      font-size: 16px;
      color: #333333;
    }

    .combination-price {
      padding: 0 0 0 19px;
      font-weight: bold;
      font-size: 16px;
      color: #ed2920;
      line-height: 26px;
    }
  }
}

.contract-wrap {
  font-size: 16px;
  color: #333333;
  line-height: 24px;
  text-align: left;
}

.radio-wrap {
  padding: 25px 0 0 21px;
  text-align: left;
}

.download-wrap {
  padding: 25px 0 0 23px;
  margin-bottom: 43px;

  .download-btn {
    width: 129px;
    height: 32px;
    display: flex;
    align-items: center;
    padding-left: 7px;
    background: #27417c;
    border-radius: 2px 2px 2px 2px;
    opacity: 0.7;
    cursor: pointer;

    .download-img-wrap {
      width: 15px;
      height: 15px;
      margin-right: 8px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .download-text {
      font-size: 14px;
      color: #ffffff;
      line-height: 20px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>
