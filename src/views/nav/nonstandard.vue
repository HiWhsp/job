<script>
import {after} from "lodash/function";

export default {
    name: "nonstandard",
    data() {
        return {
            formLabelAlign: {},
            rules: {
                type1: [{required: true, message: '请选择定制类型', trigger: 'blur'}],
                type2: [{required: true, message: '请选择分类', trigger: 'blur'}],
                type3: [{required: true, message: '请输入型号', trigger: 'blur'}],
                type4: [{required: true, message: '请输入品牌', trigger: 'blur'}],
                type5: [{required: true, message: '请输入定制数量', trigger: 'blur'}],
                type6: [{required: true, message: '请输入尺寸或封装', trigger: 'blur'}],
                type7: [{required: true, message: '请选择交付日期', trigger: 'blur'}],
            }
        }
    },
    methods: {
        // 提交
        submit() {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    alertSucc('提交成功')
                    this.$refs['ruleForm'].resetFields();
                }
            })
        }
    }

}
</script>

<template>
    <div class="page">
        <div class="nav-bar">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>非标定制</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content-wrap">
            <div class="title flex flex-center">
                <img src="../../static/home/19655.png" alt="">
                <p>DIY定制组件</p>
                <img src="../../static/home/19656.png" alt="">
            </div>
            <div class="form-content">
                <el-form ref="ruleForm" :label-position="'top'" label-width="100px" :model="formLabelAlign"
                         :rules="rules">
                    <div class="item flex flex-between">
                        <el-form-item label="定制类型" prop="type1" class="type">
                            <el-select v-model="formLabelAlign.type1">
                                <el-option value="1">类型1</el-option>
                                <el-option value="2">类型2</el-option>
                                <el-option value="3">类型3</el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分类" prop="type2" class="type">
                            <el-select v-model="formLabelAlign.type2">
                                <el-option value="1">分类1</el-option>
                                <el-option value="2">分类2</el-option>
                                <el-option value="3">分类3</el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="型号" prop="type3" class="type">
                            <el-input v-model="formLabelAlign.type3"></el-input>
                        </el-form-item>
                    </div>
                    <div class="item flex flex-between">
                        <el-form-item label="品牌" prop="type4" class="type">
                            <el-input v-model="formLabelAlign.type4"></el-input>
                        </el-form-item>
                        <el-form-item label="定制数量" prop="type5" class="type">
                            <el-input v-model="formLabelAlign.type5"></el-input>
                        </el-form-item>
                        <el-form-item label="尺寸或封装" prop="type6" class="type">
                            <el-input v-model="formLabelAlign.type6"></el-input>
                        </el-form-item>
                    </div>
                    <div class="item flex flex-between">
                        <el-form-item label="交付时间" prop="type7" class="type">
                            <el-date-picker v-model="formLabelAlign.type7" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="期望单价">
                            <el-input v-model="formLabelAlign.type8"></el-input>
                        </el-form-item>
                        <el-form-item label="应用场景">
                            <el-input v-model="formLabelAlign.type9"></el-input>
                        </el-form-item>
                    </div>
                    <div class="item flex flex-between">
                        <el-form-item label="单季用量">
                            <el-input v-model="formLabelAlign.type0"></el-input>
                        </el-form-item>
                        <el-form-item label="年度用量">
                            <el-input v-model="formLabelAlign.type11"></el-input>
                        </el-form-item>
                        <div style="width: 324px; opacity: 0;"></div>
                    </div>
                    <div class="item">
                        <el-form-item label="备注" class="textarea">
                            <el-input type="textarea" :rows="5" placeholder="请输入内容"
                                      v-model="formLabelAlign.type12">
                            </el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div class="btn" @click="submit">
                提交定制
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.content-wrap {
  width: 1200px;
  min-height: 764px;
  background: #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  padding: 24px 60px 54px;
  margin-top: 20px;

  .title {
    height: 37px;

    img {
      width: 31px;
      height: 22px;
    }

    p {
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 36px;
      color: #333333;
      font-style: normal;
      text-transform: none;
      margin: 0 25px;
    }
  }

  .form-content {
    margin-top: 55px;

    .item {
        margin-bottom: 10px;
      .el-form-item {
        margin-bottom: 0;
      }

      /deep/ .el-form-item__label {
        padding: 0;
      }

      /deep/ .el-form-item__content {
        width: 324px;
      }

      /deep/ .el-input__inner {
        width: 324px;
      }

      .type {
        /deep/ .el-form-item__label:before {
          content: '';
        }

        /deep/ .el-form-item__label:after {
          content: '*';
          color: #F56C6C;
          margin-left: 0.4rem;
        }
      }

      .textarea {
            /deep/ .el-form-item__content {
                width: 1080px;
                height: 114px;
            }
      }
    }
  }

  .btn {
    margin-top: 35px;
    width: 191px;
    height: 46px;
    background: @theme;
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 46px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    border-radius: 4px 4px 4px 4px;
  }
}
</style>
