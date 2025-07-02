<template>
  <div class="page">
    <div class="main-title">
      <span>填报需求</span>
    </div>
    <div class="page-ctx">
      <el-form
        :model="form"
        label-width="105px"
        label-position="right"
        ref="formRef"
        :rules="rules"
      >
        <h3>选择填报类型</h3>
        <el-form-item label="类型" prop="workOrderType">
          <el-select v-model="form.workOrderType" placeholder="请选择填报类型">
            <el-option label="售后运维需求表" value="1"></el-option>
            <el-option label="项目产品需求表" value="2"></el-option>
            <el-option label="项目融资表" value="3"></el-option>
            <el-option label="项目转让表" value="4"></el-option>
            <el-option label="产品回收利用表" value="5"></el-option>
          </el-select>
        </el-form-item>

        <h3>完善需求信息</h3>

        <el-form-item label="企业名称" prop="companyName">
          <el-input
            v-model="form.companyName"
            placeholder="请输入企业名称"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" clearable></el-input>
        </el-form-item>

        <el-form-item label="联系人" prop="contactPerson">
          <el-input
            v-model="form.contactPerson"
            placeholder="请输入联系人"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="contact">
          <el-input
            v-model="form.contact"
            placeholder="请输入联系电话"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱地址"
            clearable
          ></el-input>
        </el-form-item>

        <!-- 售后运维需求表 -->
        <template v-if="form.workOrderType === '1'">
          <el-form-item label="设备类型" prop="deviceType">
            <el-radio-group v-model="form.deviceType">
              <el-radio label="1">光伏</el-radio>
              <el-radio label="2">组件</el-radio>
              <el-radio label="3">逆变</el-radio>
              <el-radio label="4">其他</el-radio>
            </el-radio-group>
            <el-input
              v-if="form.deviceType == '4'"
              v-model="form.otherDevice"
              placeholder="请输入其他设备类型"
              style="width: 190px; margin-left: 20px"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备规格" prop="deviceGuige">
            <el-input
              v-model="form.deviceGuige"
              placeholder="请输入设备规格"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="设备位置" prop="deviceAddress">
            <el-input
              v-model="form.deviceAddress"
              placeholder="请输入设备位置"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="故障现象" prop="faultDescription">
            <el-input
              v-model="form.faultDescription"
              placeholder="请输入故障现象"
              clearable
            ></el-input>
          </el-form-item>
        </template>

        <!-- 项目产品需求表 -->
        <template v-if="form.workOrderType === '2'">
          <h3>录入产品信息</h3>
          <div class="product-table">
            <table class="product-info-table">
              <thead>
                <tr>
                  <th width="60">序号</th>
                  <th width="150">名称</th>
                  <th width="180">规格</th>
                  <th width="125">数量</th>
                  <th width="300">具体描述</th>
                  <th width="60">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.productList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <el-input
                      v-model="item.name"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      v-model="item.guige"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      v-model="item.num"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      v-model="item.description"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-button
                      type="text"
                      size="small"
                      @click="deleteProductRow(index)"
                      class="delete-btn"
                    >
                      删除
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="add-row">
              <el-button type="text" @click="addProductRow" class="add-btn">
                + 增加一行
              </el-button>
            </div>
          </div>
        </template>

        <!-- 项目融资表 -->
        <template v-if="form.workOrderType === '3'">
          <h3>项目基本信息</h3>

          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="form.projectName"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="项目地点" prop="projectAddress">
            <el-input
              v-model="form.projectAddress"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="项目规模" prop="projectScale">
            <el-input
              v-model="form.projectScale"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="项目类型" prop="projectTypeStr">
            <el-input
              v-model="form.projectTypeStr"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="项目进度" prop="projectProgress">
            <el-input
              v-model="form.projectProgress"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </template>

        <!-- 项目转让表 -->
        <template v-if="form.workOrderType === '4'">
          <h3>项目基本信息</h3>

          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="form.projectName"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="项目地点" prop="projectAddress">
            <el-input
              v-model="form.projectAddress"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="项目规模" prop="projectScale">
            <el-input
              v-model="form.projectScale"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="项目类型" prop="projectTypeStr">
            <el-input
              v-model="form.projectTypeStr"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </template>

        <!-- 产品回收利用表 -->
        <template v-if="form.workOrderType === '5'">
          <h3>录入回收产品信息</h3>
          <div class="product-table">
            <table class="product-info-table">
              <thead>
                <tr>
                  <th width="60">序号</th>
                  <th width="150">回收类型</th>
                  <th width="180">图片</th>
                  <th width="120">品牌</th>
                  <th width="100">数量</th>
                  <th width="190">规格</th>
                  <th width="60">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.recycleList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <el-input
                      v-model="item.type"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <div class="image-upload-cell">
                      <template v-if="item.image">
                        <span class="image-name">{{ item.imageName }}</span>
                        <el-button
                          type="text"
                          size="mini"
                          @click="previewImage(item.image)"
                          class="preview-btn"
                        >
                          预览
                        </el-button>
                      </template>
                      <template v-else>
                        <el-upload
                          :action="uploadAction"
                          :show-file-list="false"
                          :on-success="
                            (response, file) =>
                              handleRecycleImageSuccess(response, file, index)
                          "
                          :before-upload="beforeImageUpload"
                          accept="image/*"
                        >
                          <el-button type="text" size="small" class="upload-btn"
                            >上传</el-button
                          >
                        </el-upload>
                      </template>
                    </div>
                  </td>
                  <td>
                    <el-input
                      v-model="item.brand"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      v-model="item.quantity"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      v-model="item.spec"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-button
                      type="text"
                      size="small"
                      @click="deleteRecycleRow(index)"
                      class="delete-btn"
                    >
                      删除
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="add-row">
              <el-button type="text" @click="addRecycleRow" class="add-btn">
                + 增加一行
              </el-button>
            </div>
          </div>
        </template>

        <el-form-item label="上传图片" prop="images">
          <el-upload
            class="upload-demo"
            accept="image/*"
            :file-list="form.images"
            :data="mix_upload_data"
            :name="mix_upload_name"
            :action="mix_upload_action"
            list-type="picture-card"
            :on-change="handleImageChange"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="补充说明" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="详细描述您的问题"
            :rows="4"
            maxlength="500"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "demand-form",
  data() {
    return {
      form: {
        workOrderType: "1",
        companyName: "",
        address: "",
        contactPerson: "",
        contact: "",
        email: "",
        deviceType: "",
        otherDevice: "",
        deviceGuige: "",
        deviceAddress: "",
        faultDescription: "",
        images: [],
        remark: "",
        productList: [],
        // 项目融资表字段
        projectName: "",
        projectLocation: "",
        projectScale: "",
        projectType: "",
        projectProgress: "",
        // 产品回收利用表数据
        recycleList: [],
      },
      uploadAction: "#", // 上传接口地址，根据实际情况修改
      rules: {
        workOrderType: [{ required: true, message: "请选择填报类型", trigger: "change" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        companyName: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        contactPerson: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contact: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
        ],
        deviceType: [
          { required: true, message: "请选择设备类型", trigger: "change" },
          { validator: this.validateEquipmentType, trigger: "change" },
        ],
      },
    };
  },
  mounted() {},
  watch: {
    "form.deviceType"(newVal) {
      // 当设备类型改变时，清空其他设备类型的输入
      if (newVal !== "4") {
        this.form.otherDevice = "";
      }
    },
  },
  methods: {
    validateEquipmentType(rule, value, callback) {
      if (value == "4" && !this.form.otherDevice) {
        callback(new Error("请输入具体的设备类型"));
      } else {
        callback();
      }
    },
    handleImageChange(file, fileList) {
      this.form.images = fileList;
    },
    submitForm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.form.images.length > 0) {
            this.form.images.forEach((item) => {
              this.form.photos
                ? this.form.photos.push(item.response.data.save_url)
                : (this.form.photos = [item.response.data.save_url]);
              this.form.photosJson
                ? this.form.photosJson.push({
                    name: item.name,
                    url: item.response.data.save_url,
                  })
                : (this.form.photosJson = [
                    {
                      name: item.name,
                      url: item.response.data.save_url,
                    },
                  ]);
            });
          }
          if (this.form.workOrderType == "2") {
            this.form.productJson = JSON.stringify(this.form.productList);
          } else if (this.form.workOrderType == "5") {
            // this.form.recycleJson = JSON.stringify(this.form.recycleList);
          }
          this.$api({
            url: "createWorkorder",
            method: "post",
            data: {
              ...this.form,
              photos: JSON.stringify(this.form.photos),
              photosJson: JSON.stringify(this.form.photosJson),
            },
          }).then((res) => {
            let { code, msg, data } = res;
            if (code == 200) {
              this.$message.success("提交成功");
              this.$router.push("demand-list");
            } else {
              this.$message.error(msg);
            }
          });
        } else {
          console.log("表单验证失败");
          this.$message.error("请完善必填信息");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.formRef.resetFields();
      this.form.images = [];
    },
    // 添加产品行
    addProductRow() {
      this.form.productList.push({
        name: "",
        guige: "",
        num: "",
        description: "",
      });
    },
    // 删除产品行
    deleteProductRow(index) {
      if (this.form.productList.length > 1) {
        this.form.productList.splice(index, 1);
      } else {
        this.$message.warning("至少保留一行数据");
      }
    },
    // 添加回收产品行
    addRecycleRow() {
      this.form.recycleList.push({
        type: "",
        image: "",
        imageName: "",
        brand: "",
        quantity: "",
        spec: "",
      });
    },
    // 删除回收产品行
    deleteRecycleRow(index) {
      if (this.form.recycleList.length > 1) {
        this.form.recycleList.splice(index, 1);
      } else {
        this.$message.warning("至少保留一行数据");
      }
    },
    // 图片上传前校验
    beforeImageUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 回收产品图片上传成功
    handleRecycleImageSuccess(response, file, index) {
      // 这里根据实际接口返回处理
      this.form.recycleList[index].image = URL.createObjectURL(file.raw);
      this.form.recycleList[index].imageName = file.name;
      this.$message.success("图片上传成功");
    },
    // 预览图片
    previewImage(imageUrl) {
      // 可以使用Element UI的图片预览组件或自定义预览方法
      window.open(imageUrl, "_blank");
    },
  },
};
</script>

<style scoped lang="less" src="./demand-form.less"></style>
