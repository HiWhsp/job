<template>
    <div class="container">
        <div class="box">
            <div id="login-modal" v-if="currentForm === 'login'">
                <div class="title">会员登录</div>

                <!-- 登录 -->
                <form @submit.prevent="handleLogin">
                    <div class="item-box">
                        <label for="phone">手机号</label>
                        <input type="text" id="phone" name="phone" v-model="phone" placeholder="请输入手机号码" />
                    </div>

                    <div class="item-box">
                        <label for="password">设置密码</label>
                        <input type="password" id="password" name="password" v-model="password" placeholder="请输入设置密码" />
                    </div>

                    <div class="check-box">
                        <input type="checkbox" id="remember-me" name="remember-me" v-model="rememberMe" />
                        <label for="remember-me">记住密码</label>
                        <div class="forget" @click="currentForm = 'forgot'">忘记密码</div>
                    </div>

                    <div class="item-box">
                        <button type="submit">登录</button>
                    </div>

                    <div class="toRegister" @click="currentForm = 'register'">
                        没有账号？去注册
                    </div>
                </form>
            </div>

            <div id="register-modal" v-if="currentForm === 'register'">
                <div class="register-title">会员注册</div>

                <!-- 注册 -->
                <form @submit.prevent="handleRegister">
                    <div class="item-box">
                        <label for="register-phone">手机号</label>
                        <input type="text" id="register-phone" v-model="registerPhone" placeholder="请输入手机号码" />
                    </div>

                    <div class="item-box">
                        <label for="register-captcha">验证码</label>
                        <input type="text" id="register-captcha" v-model="registerCaptcha" placeholder="请输入验证码" />
                        <div class="captcha" @click.prevent="sendCaptcha">获取验证码</div>
                    </div>

                    <div class="item-box">
                        <label for="register-company-name">公司名称</label>
                        <input type="text" id="register-company-name" v-model="registerCompanyName"
                            placeholder="请输入公司名称" />
                    </div>

                    <div class="item-box">
                        <label for="register-password">设置密码</label>
                        <input type="password" id="register-password" v-model="registerPassword"
                            placeholder="请输入设置密码" />
                    </div>

                    <div class="item-box">
                        <label for="register-confirm-password">确认密码</label>
                        <input type="password" id="register-confirm-password" v-model="registerConfirmPassword"
                            placeholder="请再次输入密码" />
                    </div>

                    <div class="item-box">
                        <button type="submit">注 &nbsp; 册</button>
                    </div>

                    <div class="back-login" @click="currentForm = 'login'">
                        已有账号，直接登录
                    </div>
                </form>

                <div class="confirm-box">
                    <input type="checkbox" id="register-agree" v-model="registerAgreement" required />
                    <label for="register-agree" style="font-size: 12px; padding-left: 10px; color: #999999">我已认真阅读并同意
                        <span @click="terms_open(31)">《用户协议》</span>
                        和
                        <span @click="terms_open(31)">《隐私政策》</span>
                    </label>
                </div>
            </div>

            <div id="forget-modal" v-if="currentForm === 'forgot'">
                <div class="title">忘记密码</div>

                <!-- 忘记密码 -->
                <form @submit.prevent="handleForgotPassword">
                    <div class="item-box">
                        <label for="forgot-email">手机号</label>
                        <input type="phone" id="forgot-email" v-model="forgotPhone" placeholder="请输入您的手机号" />
                    </div>

                    <div class="item-box">
                        <label for="forgot-captcha">验证码</label>
                        <input type="text" id="forgot-captcha" v-model="forgotCaptcha" placeholder="请输入验证码" />
                        <div class="captcha" @click.prevent="sendCaptcha">获取验证码</div>
                    </div>

                    <div class="item-box">
                        <label for="forgot-password">设置密码</label>
                        <input type="password" id="forgot-password" v-model="forgotPassword" placeholder="请输入新密码" />
                    </div>

                    <div class="item-box">
                        <button type="submit">确&nbsp;认</button>
                    </div>

                    <div class="back-login" @click="currentForm = 'login'">
                        <img src="../../static/login/return_arrow.png" />
                        返回登录
                    </div>
                </form>
            </div>
        </div>

        <modalTerms ref="modalTerms"/>


    </div>
</template>

<script>

import modalTerms from "@/components/modals/modalTerms.vue"; //协议弹窗


import { MessageBox } from "element-ui";
import { mapActions } from 'vuex';

export default {
    components: {

        modalTerms,

    },
    data() {
        return {
            currentForm: "", // 初始状态为登录表单
            phone: "",
            password: "",
            rememberMe: false,
            forgotPhone: "",
            registerPhone: "",
            registerCaptcha: "",
            registerCompanyName: "",
            registerPassword: "",
            registerConfirmPassword: "",
            registerAgreement: false,
            forgotCaptcha: "",
            forgotPassword: "",
        };
    },
    created() {
        this.currentForm = this.$route.query.to || "login";
        this.phone = localStorage.getItem("phone");
        this.password = localStorage.getItem("password");
    },
    methods: {
        ...mapActions([
            'setIsLogin' // 映射 setIsLogin action
        ]),

        terms_open(id) {
            console.log('隐私条款')
            this.$refs.modalTerms.init(id);
        },


        async handleLogin() {
            const { phone, password } = this;
            if (phone && password) {
                // 这里可以添加发送数据到服务器的代码
                // 例如使用 axios 发送 POST 请求
                const res = await this.$api({
                    url: "/service.php",
                    method: "get",
                    data: {
                        action: "login_phoneLogin",
                        phone,
                        loginType: 0,
                        password,
                    },
                });
                if (res.code === 200) {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("userId", res.data.userId);
                    this.$router.push("index");
                    this.setIsLogin(true);
                } else {
                    MessageBox.alert(res.msg, "提示", {
                        confirmButtonText: "确定",
                    });
                }
                if (this.rememberMe) {
                    localStorage.setItem("phone", phone);
                    localStorage.setItem("password", password);
                }
            } else {
                MessageBox.alert("请填写手机号和密码", "提示", {
                    confirmButtonText: "确定",
                });
            }
        },
        async handleRegister() {
            const {
                registerPhone,
                registerCaptcha,
                registerCompanyName,
                registerPassword,
                registerConfirmPassword,
                registerAgreement,
            } = this;
            if (!registerAgreement) {
                MessageBox.alert("请勾选并同意《用户协议》和《隐私政策》", "提示", {
                    confirmButtonText: "确定",
                });
                return;
            }

            if (
                registerPhone &&
                registerCaptcha &&
                registerCompanyName &&
                registerPassword &&
                registerConfirmPassword
            ) {
                if (registerPassword !== registerConfirmPassword) {
                    MessageBox.alert("两次输入的密码不一致，请重新输入", "提示", {
                        confirmButtonText: "确定",
                    });
                    return;
                }
                const { code, msg, data } = await this.$api({
                    url: "/service.php",
                    method: "get",
                    data: {
                        action: "login_phoneReg",
                        phone: registerPhone,
                        code: registerCaptcha,
                        pass: registerPassword,
                        company: registerCompanyName,
                    },
                });
                if (code === 200) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userId", data.userId);
                    this.$router.push("index");
                    this.setIsLogin(true);
                } else {
                    MessageBox.alert(msg, "提示", {
                        confirmButtonText: "确定",
                    });
                }
            } else {
                MessageBox.alert("请填写所有必填项", "提示", {
                    confirmButtonText: "确定",
                });
            }
        },
        async handleForgotPassword() {
            const { forgotPhone, forgotCaptcha, forgotPassword } = this;
            if (forgotPhone && forgotCaptcha && forgotPassword) {
                const res = await this.$api({
                    url: "/service.php",
                    method: "get",
                    data: {
                        action: "login_resetPass",
                        phone: forgotPhone,
                        code: forgotCaptcha,
                        pass: forgotPassword,
                    },
                });
                if (res.code === 200) {
                    MessageBox.alert(res.msg, "提示", {
                        confirmButtonText: "确定",
                    });
                    this.currentForm = "login";
                } else {
                    MessageBox.alert(res.msg, "提示", {
                        confirmButtonText: "确定",
                    });
                }
            } else {
                MessageBox.alert("请填写所有表单项", "提示", {
                    confirmButtonText: "确定",
                });
            }
        },
        async sendCaptcha() {
            // 获取验证码逻辑
            if (this.registerPhone || this.forgotPhone) {
                const { code, msg } = await this.$api({
                    url: "/service.php",
                    method: "get",
                    data: {
                        action: "login_phoneYzm",
                        phone: this.registerPhone || this.forgotPhone,
                    },
                });
                if (code === 200) {
                    MessageBox.alert(msg, "提示", {
                        confirmButtonText: "确定",
                    });
                } else {
                    MessageBox.alert(msg, "提示", {
                        confirmButtonText: "确定",
                    });
                }
                console.log("🚀 ~ sendCaptcha ~ res:", msg);
            } else {
                MessageBox.alert("请填手机号", "提示", {
                    confirmButtonText: "确定",
                });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    height: 780px;
    background-image: url("../../static/login/background.png");
    /* 可以选择性地设置其他背景属性 */
    background-repeat: no-repeat;
    /* 默认不重复 */
    background-position: center;
    /* 背景图片居中 */
    background-size: cover;
    /* 背景图片覆盖整个容器 */
    //padding-top: 114px;
}

.box {
    display: flex;
    float: right;
    align-items: center;
    height: 780px;
}

#login-modal {
    background-color: white;
    padding: 40px;
    border-radius: 16px;
    margin-right: 260px;
    width: 480px;
}

#register-modal {
    background-color: white;
    //padding: 40px 40px 0 40px;
    border-radius: 16px;
    margin-right: 260px;
    width: 480px;
}

#forget-modal {
    background-color: white;
    padding: 40px;
    border-radius: 16px;
    margin-right: 260px;
    width: 480px;
}

#register-modal form {
    width: 480px;
    padding: 14px 40px 0 40px;
}

.title {
    width: 400px;
    display: block;
    text-align: center;
    font-size: 24px;
    //margin-bottom: 14px;
}

.register-title {
    display: block;
    text-align: center;
    font-size: 24px;
    margin-top: 40px;
}

.item-box {
    width: 400px;
    height: 44px;
    border: 1px solid #eeeeee;
    display: flex;
    margin-top: 20px;
    align-items: center;
    //justify-content: center;
}

.check-box {
    width: 400px;
    height: 44px;
    //border: 1px solid #EEEEEE;
    display: flex;
    margin-top: 20px;
    align-items: center;
}

.confirm-box {
    height: 44px;
    border: 1px solid #eeeeee;
    display: flex;
    align-items: center;
    background-color: #f5f6f8;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    padding-left: 40px;
    margin-top: 14px;
}

.item-box label {
    font-size: 14px;
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7d7d7d;
    border-right: 1px solid #eeeeee;
}

.item-box input {
    font-size: 14px;
    width: 55%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d7d7d7;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-style: normal;
    text-transform: none;
    padding-left: 20px;
}

.item-box button {
    background-color: #27417c;
    width: 400px;
    height: 44px;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 18px;
}

#login-modal .checkbox {
    margin-top: 10px;
}

#login-modal .toRegister {
    color: #27417c;
    font-size: 14px;
    margin-top: 14px;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

#login-modal .checkbox label {
    display: inline-block;
    cursor: pointer;
    position: relative;
    padding-left: 25px;
}

.check-box input {
    display: flex;
    float: left;
}

.check-box label {
    display: flex;
    float: left;
    font-size: 14px;
    padding-left: 10px;
    color: #999999;
}

.check-box .forget {
    font-size: 14px;
    color: #1d2088;
    padding-left: 260px;
    cursor: pointer;
}

.back-login {
    color: #27417c;
    font-size: 14px;
    margin-top: 14px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    align-items: center;
}

.back-login img {
    width: 17.54px;
    height: 12px;
    margin-right: 3px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
}

.captcha {
    color: #ea3200;
    width: 25%;
    font-size: 14px;
    cursor: pointer;
    padding-right: 15px;
    float: right;
    text-align: right;
}

.item-box {
    input {
        color: #000;
    }
}
</style>
