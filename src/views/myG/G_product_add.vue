<script>
export default {
  name: "G_product_add",
  data() {
    return {
      form: {
        material_type_id: '',
        is_shangjia: '',
        guige: '',
        kucun: '',
        includeTaxPrice: '',
        noTaxPrice: '',
        daohuo_time: '',
        jiance_files_url: []
      },
      rules: {
        material_type_id: [
          {required: true, message: '请选择类目', trigger: 'change'}
        ],
        is_shangjia: [
          {required: true, message: '请选择上下架状态', trigger: 'change'}
        ],
        guige: [
          {required: true, message: '请输入规格', trigger: 'blur'}
        ],
        kucun: [
          {required: true, message: '请输入库存', trigger: 'blur'}
        ],
        includeTaxPrice: [
          {required: true, message: '请输入含税价', trigger: 'blur'}
        ],
        noTaxPrice: [
          {required: true, message: '请输入不含税价', trigger: 'blur'}
        ],
        daohuo_time: [
          {required: true, message: '请输入到货时间', trigger: 'blur'}
        ],
        jiance_files_url: [
          {required: true, message: '请上传检测报告', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    clear() {
      this.$refs.form.resetFields(); // 清空form
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api({
            url: 'addMaterial',
            method: 'post',
            data: this.form
          }).then(res => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: 'success',
              })
              this.$router.push("/G_product_list")
              this.form = {
                material_type_id: '',
                is_shangjia: '',
                guige: '',
                kucun: '',
                includeTaxPrice: '',
                noTaxPrice: '',
                daohuo_time: '',
                jiance_files_url: []
              }
            }
          })
        } else {
          return false;
        }
      });
    },
    handleSuccess(response, file, fileList) {
      fileList.forEach(item => {
        this.form.jiance_files_url.push({
          name: item.response.data.origin_name,
          url: item.response.data.visit_url
        })
      })
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="main-title">
      <span>新增产品</span>
    </div>
    <div class="page-ctx">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="类目：" prop="material_type_id">
          <el-select v-model="form.material_type_id" placeholder="请选择商品分类">
            <el-option v-for="item in vuexFlatCates" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上下架状态：" prop="is_shangjia">
          <el-radio-group v-model="form.is_shangjia">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="规格：" prop="guige">
              <el-input v-model="form.guige" placeholder="请输入规格"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存：" prop="kucun">
              <el-input v-model="form.kucun" placeholder="请输入库存">
                <template slot="prepend">>=</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="含税价：" prop="includeTaxPrice">
              <el-input v-model="form.includeTaxPrice" placeholder="请输入含税价">
                <template slot="prepend">¥</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不含税价：" prop="noTaxPrice">
              <el-input v-model="form.noTaxPrice" placeholder="请输入不含税价">
                <template slot="prepend">¥</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="到货时间：" prop="daohuo_time">
          <el-input v-model="form.daohuo_time" placeholder="请输入到货时间"></el-input>
        </el-form-item>
        <el-form-item label="检测报告：">
          <el-upload
              :on-success="handleSuccess"
              action="https://shalunxiehui.dx.hdapp.com.cn/api/uploadFile"
              class="upload-demo"
              drag
              multiple
              name="file"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">可添加JPG、PNG、PDF文件，大小限制2M以内</div>
          </el-upload>
        </el-form-item>
        <div class="btn-wrap">
          <el-button @click="clear">取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page {
  padding: 0;

  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Roboto, Roboto-Bold, Roboto, Roboto;
    font-weight: bold;
    color: #333333;
  }
}

.page-ctx {
  margin-top: 10px;
  padding: 43px 70px;
  background: #fff;

  .btn-wrap {
    .el-button--default {
      padding: 0;
      width: 133px;
      height: 40px;
      line-height: 40px;
      background: #F5F5F5;
      border: 1px solid #D7D7D7;
    }

    .el-button--primary {
      padding: 0;
      width: 133px;
      height: 40px;
      line-height: 40px;
      background: #044FA0;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid rgba(0, 0, 0, 0);
    }
  }
}
</style>
