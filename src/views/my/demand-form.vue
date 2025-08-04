<template>
  <div class="page">
    <div class="main-title">
      <span>Submit Demand</span>
    </div>
    <div class="page-ctx">
      <el-form
        :model="form"
        label-width="105px"
        label-position="right"
        ref="formRef"
        :rules="rules"
      >
        <h3>Select Form Type</h3>
        <el-form-item label="Type" prop="workOrderType">
          <el-select v-model="form.workOrderType" placeholder="Please select form type">
            <el-option label="After-sales Maintenance Demand Form" value="1"></el-option>
            <el-option label="Project Product Demand Form" value="2"></el-option>
            <el-option label="Project Financing Form" value="3"></el-option>
            <el-option label="Project Transfer Form" value="4"></el-option>
            <el-option label="Product Recycling Form" value="5"></el-option>
          </el-select>
        </el-form-item>

        <h3>Complete Demand Information</h3>

        <el-form-item label="Company" prop="companyName">
          <el-input
            v-model="form.companyName"
            placeholder="Please enter company name"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="Region">
          <area_select ref="area_select" @change="changeSelectAddress" />
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input
            v-model="form.address"
            placeholder="Please enter address"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="contacts" prop="contactPerson">
          <el-input
            v-model="form.contactPerson"
            placeholder="Please enter contact person"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="Phone">
          <el-input
            v-model="form.contact"
            placeholder="Please enter contact phone"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input
            v-model="form.email"
            placeholder="Please enter email address"
            clearable
          ></el-input>
        </el-form-item>

        <!-- 售后运维需求表 -->
        <template v-if="form.workOrderType === '1'">
          <el-form-item label="Type" prop="deviceType">
            <el-radio-group v-model="form.deviceType">
              <el-radio label="1">PV</el-radio>
              <el-radio label="2">Storage</el-radio>
              <el-radio label="3">Charging Pile</el-radio>
              <el-radio label="4">Chai Fa</el-radio>
              <el-radio label="5">Other</el-radio>
            </el-radio-group>
            <el-input
              v-if="form.deviceType == '5'"
              v-model="form.otherDevice"
              placeholder="Please enter other device type"
              style="width: 190px; margin-left: 20px"
            ></el-input>
          </el-form-item>
          <el-form-item label="Specification" prop="deviceGuige">
            <el-input
              v-model="form.deviceGuige"
              placeholder="Please enter device specification"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="Location" prop="deviceAddress">
            <el-input
              v-model="form.deviceAddress"
              placeholder="Please enter device location"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="Description" prop="faultDescription">
            <el-input
              v-model="form.faultDescription"
              placeholder="Please enter fault description"
              clearable
            ></el-input>
          </el-form-item>
        </template>

        <!-- 项目产品需求表 -->
        <template v-if="form.workOrderType === '2'">
          <h3>Enter Product Information</h3>
          <div class="product-table">
            <table class="product-info-table">
              <thead>
                <tr>
                  <th width="60">No.</th>
                  <th width="150">Name</th>
                  <th width="180">Specification</th>
                  <th width="125">Quantity</th>
                  <th width="300">Description</th>
                  <th width="60">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.productList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <el-input
                      v-model="item.name"
                      placeholder="Please enter"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      v-model="item.guige"
                      placeholder="Please enter"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      v-model="item.num"
                      placeholder="Please enter"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      v-model="item.description"
                      placeholder="Please enter"
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
                      Delete
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="add-row">
              <el-button type="text" @click="addProductRow" class="add-btn">
                + Add Row
              </el-button>
            </div>
          </div>
        </template>

        <!-- 项目融资表 -->
        <template v-if="form.workOrderType === '3'">
          <h3>Basic Project Information</h3>

          <el-form-item label="Name" prop="projectName">
            <el-input
              v-model="form.projectName"
              placeholder="Please enter"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="Location" prop="projectAddress">
            <el-input
              v-model="form.projectAddress"
              placeholder="Please enter"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="Scale" prop="projectScale">
            <el-input
              v-model="form.projectScale"
              placeholder="Please enter"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="Type" prop="projectTypeStr">
            <el-input
              v-model="form.projectTypeStr"
              placeholder="Please enter"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="Progress" prop="projectProgress">
            <el-input
              v-model="form.projectProgress"
              placeholder="Please enter"
              clearable
            ></el-input>
          </el-form-item>
        </template>

        <!-- 项目转让表 -->
        <template v-if="form.workOrderType === '4'">
          <h3>Basic Project Information</h3>

          <el-form-item label="Name" prop="projectName">
            <el-input
              v-model="form.projectName"
              placeholder="Please enter"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="Location" prop="projectAddress">
            <el-input
              v-model="form.projectAddress"
              placeholder="Please enter"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="Scale" prop="projectScale">
            <el-input
              v-model="form.projectScale"
              placeholder="Please enter"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="Type" prop="projectTypeStr">
            <el-input
              v-model="form.projectTypeStr"
              placeholder="Please enter"
              clearable
            ></el-input>
          </el-form-item>
        </template>

        <!-- 产品回收利用表 -->
        <template v-if="form.workOrderType === '5'">
          <h3>Enter Recycling Product Information</h3>
          <div class="product-table">
            <table class="product-info-table">
              <thead>
                <tr>
                  <th width="60">No.</th>
                  <th width="150">Recycling Type</th>
                  <th width="180">Image</th>
                  <th width="120">Brand</th>
                  <th width="100">Quantity</th>
                  <th width="190">Specification</th>
                  <th width="60">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.recycleList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <el-input
                      v-model="item.type"
                      placeholder="Please enter"
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
                          Preview
                        </el-button>
                      </template>
                      <template v-else>
                        <el-upload
                          :data="mix_upload_data"
                          :name="mix_upload_name"
                          :action="mix_upload_action"
                          :show-file-list="false"
                          :on-success="
                            (response, file) =>
                              handleRecycleImageSuccess(response, file, index)
                          "
                          :before-upload="beforeImageUpload"
                          accept="image/*"
                        >
                          <el-button type="text" size="small" class="upload-btn"
                            >Upload</el-button
                          >
                        </el-upload>
                      </template>
                    </div>
                  </td>
                  <td>
                    <el-input
                      v-model="item.name"
                      placeholder="Please enter"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      v-model="item.num"
                      placeholder="Please enter"
                      size="small"
                    ></el-input>
                  </td>
                  <td>
                    <el-input
                      v-model="item.description"
                      placeholder="Please enter"
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
                      Delete
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="add-row">
              <el-button type="text" @click="addRecycleRow" class="add-btn">
                + Add Row
              </el-button>
            </div>
          </div>
        </template>

        <el-form-item label="Images" prop="images" v-if="form.workOrderType == 1">
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
        <el-form-item label="Attachments" prop="images" v-if="form.workOrderType != 1">
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

        <el-form-item label="Notes" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="Please describe your issue in detail"
            :rows="4"
            maxlength="500"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">Submit</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import area_select from "@/components/address/area_select.vue";

export default {
  name: "demand-form",
  components: {
    area_select,
  },
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
        workOrderType: [
          {
            required: true,
            message: "Please select form type",
            trigger: "change",
          },
        ],
        address: [{ required: true, message: "Please enter address", trigger: "blur" }],
        companyName: [
          {
            required: true,
            message: "Please enter company name",
            trigger: "blur",
          },
        ],
        contactPerson: [
          {
            required: true,
            message: "Please enter contact person",
            trigger: "blur",
          },
        ],
        contact: [
          {
            required: true,
            message: "Please enter contact phone",
            trigger: "blur",
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "Please enter correct phone number",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "Please enter email address",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Please enter correct email format",
            trigger: "blur",
          },
        ],
        deviceType: [
          {
            required: true,
            message: "Please select device type",
            trigger: "change",
          },
          { validator: this.validateEquipmentType, trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    if (JSON.parse(localStorage.getItem("baseInfo")).userLevel == 0) {
      this.$message.warning(
        "No permission to submit demand, please upgrade to VIP member"
      );
    }
  },
  watch: {
    "form.deviceType"(newVal) {
      // 当设备类型改变时，清空其他设备类型的输入
      if (newVal !== "5") {
        this.form.otherDevice = "";
      }
    },
  },
  methods: {
    validateEquipmentType(rule, value, callback) {
      if (value == "5" && !this.form.otherDevice) {
        callback(new Error("Please enter specific device type"));
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
              if (this.form.workOrderType == 1) {
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
              } else {
                this.form.attach
                  ? this.form.attach.push(item.response.data.save_url)
                  : (this.form.attach = [item.response.data.save_url]);
                this.form.attachJson
                  ? this.form.attachJson.push({
                      name: item.name,
                      url: item.response.data.save_url,
                    })
                  : (this.form.attachJson = [
                      {
                        name: item.name,
                        url: item.response.data.save_url,
                      },
                    ]);
              }
            });
          } else {
            this.$message.error("Please upload attachment images");
            return false;
          }
          if (this.form.workOrderType == "2") {
            this.form.productJson = this.form.productList;
            this.form.productList = null;
          } else if (this.form.workOrderType == "5") {
            this.form.productJson = this.form.recycleList;
            this.form.recycleList = null;
          }
          this.$api({
            url: "createWorkorder",
            method: "post",
            data: {
              ...this.form,
              photos:
                this.form.workOrderType == 1 ? this.form.photos.join(",") : undefined,
              photosJson: this.form.workOrderType == 1 ? this.form.photosJson : undefined,
              attach:
                this.form.workOrderType != 1 ? this.form.attach.join(",") : undefined,
              attachJson: this.form.workOrderType != 1 ? this.form.attachJson : undefined,
              images: undefined,
            },
          }).then((res) => {
            let { code, msg, data } = res;
            if (code == 200) {
              this.$message.success("Submitted successfully");
              this.$router.push("demand-list");
            } else {
              this.$message.error(msg);
            }
          });
        } else {
          console.log("Form validation failed");
          this.$message.error("Please complete required information");
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
        this.$message.warning("Keep at least one row");
      }
    },
    // 添加回收产品行
    addRecycleRow() {
      this.form.recycleList.push({
        type: "",
        image: "",
        name: "",
        num: "",
        description: "",
      });
    },
    // 删除回收产品行
    deleteRecycleRow(index) {
      if (this.form.recycleList.length > 1) {
        this.form.recycleList.splice(index, 1);
      } else {
        this.$message.warning("Keep at least one row");
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
        this.$message.error("Uploaded images must be JPG/PNG format!");
      }
      if (!isLt2M) {
        this.$message.error("Image size cannot exceed 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 回收产品图片上传成功
    handleRecycleImageSuccess(response, file, index) {
      this.form.recycleList[index].image = response.data.full_url;
      this.form.recycleList[index].imageName = response.data.originName;
      this.$message.success("Image uploaded successfully");
    },
    // 预览图片
    previewImage(imageUrl) {
      // 可以使用Element UI的图片预览组件或自定义预览方法
      window.open(imageUrl, "_blank");
    },
    //更新当前父组件数据
    changeSelectAddress(data) {
      this.$log("更新省市区数据", data);
      // debugger
      this.form.stateName = data.sheng.name;
      this.form.stateId = data.sheng.id;
    },
  },
};
</script>

<style scoped lang="less" src="./demand-form.less"></style>
