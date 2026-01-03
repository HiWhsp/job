<template>
    <div class="modal-container">
        <el-dialog class="modal-address" title="修改地址" width="1000px" :visible.sync="show_modal"
            :before-close="onbeforeclose" :close-on-press-escape="false" :close-on-click-modal="false"
            custom-class="modal-custom" @closed="onclosed">
            <div class="modal-inner">
                <!-- <div class="section">
                    <div class="section-title">当期订单地址</div>
                    <div class="section-ctx">
                        <div class="address-list">
                            <div class="address-item" v-for="(item, index) in list_address_current" :key="index">
                                <div class="address-top">{{ item.name_phone }}</div>
                                <div class="address-bottom">
                                    {{ item.full_addr }}
                                </div>
                                <img src="@/assets/img/check1.png" alt="" class="marker" />
                            </div>
                        </div>
                    </div>
                </div> -->

                <div class="section">
                    <!-- <div class="section-title">选择地址</div> -->
                    <div class="section-ctx">
                        <div class="address-list">
                            <div class="address-item" v-for="(item, index) in list_address_other" :key="index"
                                :class="{ active: item.id == address_selected.id }" @click="do_toggle_address(item)">
                                <div class="address-top">{{ item.name_phone }}</div>
                                <div class="address-bottom">
                                    {{ item.full_addr }}
                                </div>
                                <img src="@/assets/img/check1.png" alt="" class="marker" />
                            </div>
                        </div>
                        <div class="btn-box">
                            <button class="btn-ripple" @click="open_addr_add()">使用新地址</button>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <button class="btn-ripple fit-text btn-1" @click="do_submit()">保 存</button>
                <button class="btn-ripple fit-text btn-2" @click="show_modal = false">取 消</button>
            </span>
        </el-dialog>


        <address_modal ref="address_modal" @confirm="confirm_add_address" />
    </div>
</template>

<script>
import address_modal from "@/components/address/address_modal.vue"; //新增地址

import {
    mapState
} from "vuex";
export default {
    name: "address-add",
    components: {
        address_modal
    },
    props: [],
    data() {
        return {
            show_modal: false,

            address_selected: {},
            address: "", //选择的地址
            list_address: [], //地址列表

            pagination_address: {
                page: 1,
                pagenum: 20
            },

            info: {},
            list_address_current: [],
            list_address_other: [],

            select_address_id: '',
        };
    },
    computed: {
        ...mapState([""]),
    },
    watch: {

    },
    created() {
        this.setView()
    },
    methods: {
        init(info) {
            if (info) {
                this.info = info;
                if (this.info.shouhuoInfo && this.info.shouhuoInfo.id) {
                    this.select_address_id = this.info.shouhuoInfo.id;
                }
                this.list_address_current = this.list_address.filter(v => v.id == this.select_address_id) || [];
                this.list_address_other = this.list_address.filter(v => v.id != this.select_address_id) || [];
                this.show_modal = true;
            }
        },

        setView() {
            this.query_address()
        },
        query_address() {
            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'userAddress_lists',
                    ...this.pagination_address,
                },
            }).then(res => {
                if (res.code == 200) {
                    let data = res.data

                    data.forEach((v) => {
                        v.full_addr = [v.country, v.province, v.city, v.area, v.address].filter(v => !!v).join(',');
                        v.name_phone = `${v.name} (${v.phone})`
                    });
                    this.list_address = data;

                    // let obj = data.find((v) => v.if_default) || {};
                    // this.address_selected = obj || {};



                    // this.list_address_current = this.list_address.filter(v => v.id == info.shouhuoInfo.id) || [];
                    if (this.select_address_id) {

                        this.list_address_other = this.list_address.filter(v => v.id != this.select_address_id) || [];
                    }

                }
            })
        },

        //选择收货地址
        do_toggle_address(item) {
            this.address_selected = item;
        },
        //新增地址
        open_addr_add() {
            this.$refs.address_modal.init();
        },
        confirm_add_address() {
            this.query_address()
        },
        do_submit() {
            if (!this.address_selected.id) {
                return alertErr('请选择其它地址')
            }

            // this.$api({
            //     url: '/service.php',
            //     method: 'get',
            //     data: {
            //         action: 'orders_changeAddress',
            //         id: this.info.id,
            //         addressId: this.address_selected.id
            //     },
            // }).then(res => {
            //     alert(res)
            //     if (res.code == 200) {
                
            //     }
            // })


            this.$emit('confirm', this.address_selected)
            this.show_modal = false;

        },
        onclosed() {
            this.show_modal = false;
        },
        onbeforeclose() {
            this.show_modal = false;
        }
    },
};
</script>

<style scoped lang="less">
/deep/ .modal-custom {
    min-width: 40vw;
    margin-top: 5vh !important;

    .modal-inner {
        padding: 0;

        .send {
            margin-top: 30px;
        }
    }
}

/deep/ .el-dialog__header {
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
    // padding: 36px 60px 36px 0;
}


/deep/ .el-textarea {
    .el-textarea__inner {
        // background-color: #f5f5f5;
    }
}

/deep/ .el-input {
    .el-input__inner {

        // background: #f9f9f9;
        &:disabled {
            // background-color: #eee;
            color: #666;
        }
    }
}

/deep/ .el-dialog__footer {
    text-align: center;
    padding-bottom: 50px;

    button {
        margin: 0 12px;
    }

    .btn-1 {
        min-width: 120px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 50px 50px 50px 50px;
        border: 1px solid #FFAA06;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #FFAA06;
    }

    .btn-2 {
        min-width: 120px;
        height: 32px;
        background: #FFAA06;
        border-radius: 50px 50px 50px 50px;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #FFFFFF;
    }
}






.section {
    padding-bottom: 55px;
    padding-bottom: 25px;
    text-align: left;

    .section-title {
        padding-bottom: 16px;
        border-bottom: 1px solid #d5d8de;
        font-family: Poppins, Poppins;
        // font-weight: bold;
        font-size: 16px;
        color: #333333;
    }

    .section-ctx {
        // padding-top: 45px;

        .address-list {
            display: flex;
            flex-wrap: wrap;

            .address-item {
                position: relative;
                margin-top: 20px;
                margin-right: 10px;
                margin-bottom: 10px;
                width: 440px;
                width: 470px;
                min-height: 130px;
                padding: 15px 20px;
                background: #ffffff;
                border-radius: 4px 4px 4px 4px;
                border: 2px solid #d5d8de;
                overflow: hidden;
                cursor: pointer;


                &:nth-child(2n) {
                    margin-right: 0;
                }

                &:nth-child(-n + 3) {
                    // margin-top: 0;
                }

                &.active {
                    border: 2px solid #FFAA06;

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
                    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
                    font-weight: 400;
                    color: #000000;
                }

                .address-bottom {
                    padding-top: 15px;
                    font-size: 14px;
                    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
                    font-weight: 400;
                    color: #505050;
                }
            }
        }

        .btn-box {
            margin-top: 32px;

            button {
                min-width: 124px;
                min-height: 32px;
                background: #ffffff;
                border-radius: 2px 2px 2px 2px;
                border: 1px solid #b9b9b9;
                font-size: 14px;
                font-family: SourceHanSansCN-Regular-, SourceHanSansCN-Regular;
                font-weight: normal;
                color: #1F1F1F;
            }
        }
    }
}
</style>