<template>
    <div class="modal-container">
        <el-dialog title="会员注册" width="596px" custom-class="modal-custom" :close-on-click-modal="false"
            :visible.sync="show" :before-close="onModalClose">

            <div class="modal-inner">
                <div class="modal-ctx">
                    <div class="type-list flex">
                        <div class="type-item column-flex-center">
                            <div class="icon-box">
                                <img src="@img/register/reg-company.png" alt="">
                            </div>
                            <div class="title">
                                我是企业
                            </div>
                        </div>
                        <div class="type-item column-flex-center">
                            <div class="icon-box">
                                <img src="@img/register/reg-geren.png" alt="">
                            </div>
                            <div class="title">
                                我是个人
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
                <button class="btn-ripple fit-text" @click="show = false">取消</button>
                <button class="btn-ripple fit-text btn-bg" @click="form_submit()">修改</button>
            </span> -->
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "reg-type-modal",
    components: {

    },
    // props: [""],
    data() {
        return {
            show: true,
        };
    },
    computed: {},
    watch: {

    },
    methods: {


        init(text) {
            this.show = true;
        },
        onModalClose() {
            this.show = false;
        },

        onConfirm() {
            this.show = false;
            this.$router.back();
        },

        form_submit() {
            let reg_phone = /^1[3-9]\d{9}$/;
            let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
            let is_true_phone = reg_phone.test(this.phone);

            // if (!is_true_phone) {
            //   alertErr("请输入正确的手机号码");
            //   return;
            // }
            if (!this.code) {
                alertErr("请输入验证码");
                return;
            }

            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'users_checkOld',
                    editType: '1',//类型：1-手机号 2-邮箱
                    code: this.code,
                },
            }).then((res) => {
                //console.log("修改密码", res);
                alert(res)
                let { code, data } = res;
                if (code == 200) {
                    this.$emit('confirm')
                    this.show = false;
                }
            });
        },
    },
};
</script>

<style scoped lang="less">
/deep/ .modal-custom {
    .modal-inner {
        padding: 0;
    }



    .modal-ctx {

        .type-list {
            .type-item {
                cursor: pointer;
                width: 331px;
                height: 231px;
                background: #F5F5F5;
                border-radius: 10px 10px 10px 10px;

                &+.type-item {
                    margin-left: 60px;
                }

                .icon-box {
                    img {
                        width: 70px;
                    }
                }

                .title {
                    margin-top: 20px;
                    font-family: Microsoft YaHei, Microsoft YaHei;
                    font-weight: 400;
                    font-size: 24px;
                    color: #7853B2;
                }
            }
        }
    }

}




/deep/ .el-dialog__header {
    text-align: center;
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    background: #F7F7F7;

    font-family: Poppins, Poppins;
    font-weight: 600;
    font-size: 18px;
    color: #333333;

    .el-dialog__close {
        font-size: 20px;
    }
}

/deep/ .el-dialog__body {
    padding: 70px 60px;
}

/deep/ .el-dialog__footer {
    text-align: center;
    padding-bottom: 50px;

    button {
        min-width: 120px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 50px 50px 50px 50px;
        border: 1px solid #7853B2;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #7853B2;

        &+button {
            margin-left: 20px;
        }
    }

    .btn-bg {
        background: #7853B2;
        color: #FFFFFF;
    }
}


.btn-send {
    // position: absolute;
    // right: -50px;
    // top: 10px;
    min-width: 90px;
    padding: 0 10px;
    height: 40px;
    background: #fff;
    color: #7853B2;
    font-size: 14px;
    margin-left: 15px;
    border-radius: 5px;

    &:disabled {
        background: #eee;
        color: #999;
        cursor: not-allowed;
    }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/phone_bind_modal.less"></style>