<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>Member Center</span>
        <span style="margin: 0 10px">></span>
        <span>My Homepage</span>
      </div>
    </div>

    <div class="page-ctx">
      <div class="page-ctx-title">
        <span>Homepage Information Maintenance</span>
      </div>
      <el-form
        :model="my_info"
        label-width="100px"
        class="user-form"
        label-position="right"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="Logo">
              <el-upload
                class="certificate-uploader"
                accept="image/*"
                :show-file-list="false"
                :data="mix_upload_data"
                :name="mix_upload_name"
                :action="mix_upload_action"
                :on-success="upload_on_success"
                :before-upload="upload_before_upload"
              >
                <img v-if="my_info.logo" :src="my_info.logo" class="certificate-image" />
                <i v-else class="el-icon-plus certificate-upload-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Company Name">
              <el-input v-model="my_info.companyName" clearable placeholder="Please enter" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="form-item-title">My Category:</div>
            <div class="form-item-content">
              <el-tree
                ref="workTypeTree"
                :data="finish_select.typeListTree || {}"
                :props="treeProps"
                node-key="id"
                show-checkbox
                check-strictly
                :default-checked-keys="my_info.workType"
                @check="handleWorkTypeCheck"
                class="work-type-tree"
              >
              </el-tree>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Select Address">
              <area_select ref="area_select" @change="changeSelectAddress" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Company Image Upload">
              <el-upload
                class="certificate-uploader"
                accept="image/*"
                :show-file-list="false"
                :data="mix_upload_data"
                :name="mix_upload_name"
                :action="mix_upload_action"
                :on-success="upload_certificate_success"
                :before-upload="upload_before_upload"
              >
                <img
                  v-if="my_info.backImage"
                  :src="my_info.backImage"
                  class="certificate-image"
                />
                <i v-else class="el-icon-plus certificate-upload-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Company Introduction">
              <el-input
                v-model="my_info.introduce"
                clearable
                type="textarea"
                placeholder="Please enter"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="page-ctx">
      <div class="page-ctx-title">
        <span>Product Introduction</span>
        <div class="add-category-section">
          <el-button type="primary" @click="addCategory">+Add Category</el-button>
        </div>
      </div>
      <!-- 产品列表 -->
      <div class="product-list">
        <div
          v-for="(category, categoryIndex) in productCategories"
          :key="categoryIndex"
          class="product-category"
        >
          <div class="category-header">
            <div class="category-title">
              <span>Product Category {{ categoryIndex + 1 }}</span>
              <el-input
                v-model="category.title"
                placeholder="Please enter category name"
                class="category-name-input"
              />
            </div>
            <div class="category-actions">
              <el-button type="primary" size="small" @click="addProduct(categoryIndex)">
                +Add Product
              </el-button>
              <el-button
                v-if="categoryIndex > 0"
                type="danger"
                size="small"
                @click="deleteCategory(categoryIndex)"
              >
                Delete Category
              </el-button>
            </div>
          </div>

          <div
            v-for="(product, productIndex) in category.list"
            :key="productIndex"
            class="product-item"
          >
            <div class="product-title">Product {{ productIndex + 1 }}</div>
            <el-form :model="product" label-width="80px" class="product-form">
              <el-form-item label="Product Name">
                <el-input v-model="product.name" placeholder="Please enter" />
              </el-form-item>
              <el-form-item label="Product Model">
                <el-input v-model="product.xinghao" placeholder="Please enter" />
              </el-form-item>
              <el-form-item label="Product Image">
                <el-upload
                  class="product-image-uploader"
                  :action="mix_upload_action"
                  :data="mix_upload_data"
                  :name="mix_upload_name"
                  accept="image/*"
                  :show-file-list="false"
                  :on-success="
                    (res) => uploadProductImage(res, categoryIndex, productIndex)
                  "
                  :before-upload="upload_before_upload"
                >
                  <img v-if="product.image" :src="product.image" class="product-image" />
                  <i v-else class="el-icon-plus product-upload-icon"></i>
                </el-upload>
                <el-button
                  v-if="productIndex > 0 || category.list.length > 1"
                  type="text"
                  size="small"
                  class="delete-product-btn"
                  @click="deleteProduct(categoryIndex, productIndex)"
                >
                  Delete
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <div class="page-ctx">
      <div class="page-ctx-title">
        <span>Contact Information</span>
      </div>
      <el-form
        :model="my_info"
        label-width="70px"
        class="user-form"
        label-position="right"
      >
        <el-form-item label="Address">
          <el-input v-model="my_info.address" clearable placeholder="Please enter" />
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="my_info.contact" clearable placeholder="Please enter" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="my_info.email" clearable placeholder="Please enter" />
        </el-form-item>
      </el-form>
    </div>

    <div class="page-ctx">
      <el-row>
        <el-col :span="24" style="margin-top: 30px">
          <div class="edit-actions">
            <el-button
              type="primary"
              class="btn-save"
              :loading="loading"
              @click="throttle_do_submit()"
              >Submit</el-button
            >
            <el-button @click="preview">Preview</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import area_select from "@/components/address/area_select.vue";

export default {
  name: "servicePage",
  components: {
    area_select,
  },
  data() {
    return {
      my_info: {}, // 主页信息
      finish_select: [],
      // 树形结构的配置
      treeProps: {
        label: "name_zh",
        children: "children",
      },
      // 产品分类数据
      productCategories: [
        // {
        //   id: "", //必传, 0代表新增 1代表编辑
        //   title: "产品分类1",
        //   list: [
        //     {
        //       id: "", //必传, 0代表新增 1代表编辑
        //       name: "",
        //       xinghao: "",
        //       image: "",
        //     },
        //   ],
        // },
      ],
      loading: false,
    };
  },
  mounted() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.setView();
  },
  methods: {
    //更新当前父组件数据
    changeSelectAddress(data) {
      this.$log("更新省市区数据", data);
      // debugger
      this.my_info.provinceName = data.sheng.name;
      this.my_info.cityName = data.shi.name;
      this.my_info.areaName = data.qu.name;
      this.my_info.provinceId = data.sheng.id;
      this.my_info.cityId = data.shi.id;
      this.my_info.areaId = data.qu.id;
    },
    throttle_do_submit() {},

    setView() {
      this.query_user();
    },
    query_user() {
      this.$api({
        url: "myCompanyInfo",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.my_info = data || {};
          this.my_info.workType = this.my_info.workType.split(",") || [];
          this.productCategories =
            data.productList.map((item) => {
              return {
                ...item,
                list: item.productList,
              };
            }) || [];
          this.$nextTick(() => {
            this.$refs.area_select.init({
              provinceName: this.my_info.provinceName,
              cityName: this.my_info.cityName,
              areaName: this.my_info.areaName,
              provinceId: this.my_info.provinceId,
              cityId: this.my_info.cityId,
              areaId: this.my_info.areaId,
            });
          });
        }
      });
      this.$api({
        url: "getFinishSelect",
        method: "get",
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.finish_select = data;
        }
      });
    },
    do_submit() {
      let data = {
        ...this.my_info,
        workType: this.my_info.workType.join(","),
        productList: this.productCategories,
      };
      // 校验数据
      if (!data.companyName) {
        this.$message.error("Please enter company name");
        return;
      }
      if (!data.address) {
        this.$message.error("Please enter address");
        return;
      }
      if (!data.contact) {
        this.$message.error("Please enter phone number");
        return;
      }
      if (!data.email) {
        this.$message.error("Please enter email");
        return;
      }
      if (!data.workType || data.workType.length == 0) {
        this.$message.error("Please select category");
        return;
      }
      if (!data.logo) {
        this.$message.error("Please upload logo");
        return;
      }
      if (!data.backImage) {
        this.$message.error("Please upload company image");
        return;
      }
      if (!data.introduce) {
        this.$message.error("Please enter company introduction");
        return;
      }
      if (!data.productList || data.productList.length == 0) {
        this.$message.error("Please add products");
        return;
      }
      for (let i = 0; i < data.productList.length; i++) {
        let product = data.productList[i];
        if (!product.title) {
          this.$message.error("Please enter product category name");
          return;
        }
        for (let j = 0; j < product.list.length; j++) {
          let item = product.list[j];
          if (!item.name) {
            this.$message.error("Please enter product name");
            return;
          }
          if (!item.xinghao) {
            this.$message.error("Please enter product model");
            return;
          }
          if (!item.image) {
            this.$message.error("Please upload product image");
            return;
          }
        }
      }

      // 将productList转换为键值对形式
      const flattenedData = {
        ...data,
        ...this.flattenProductList(data.productList),
      };
      // 移除原来的productList数组
      delete flattenedData.productList;

      this.loading = true;
      this.$api({
        url: "submitMyCompanyInfo",
        method: "post",
        data: flattenedData,
      })
        .then((res) => {
          let { code, msg, data } = res;
          this.loading = false;
          if (code == 200) {
            this.loading = false;
            this.$message.success("Saved successfully");
            this.setView();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("Save failed");
        });
    },
    upload_on_success(res, file) {
      let { code, data, msg } = res;
      if (code == 200) {
        this.my_info.logo = res.data.save_url;
        this.$forceUpdate();
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      return isLt2M;
    },
    upload_certificate_success(res, file) {
      // 证书上传成功逻辑
      let { code, data, msg } = res;
      if (code == 200) {
        this.my_info.backImage = res.data.save_url;
        this.$forceUpdate();
      }
    },
    // 新增分类
    addCategory() {
      this.productCategories.push({
        id: 0,
        title: `Product Category ${this.productCategories.length + 1}`,
        list: [
          {
            id: 0,
            name: "",
            xinghao: "",
            image: "",
          },
        ],
      });
    },
    // 删除分类（不能删除第一个分类）
    deleteCategory(categoryIndex) {
      if (categoryIndex > 0) {
        this.$confirm("Are you sure you want to delete this category?", "Confirm", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        })
          .then(() => {
            this.productCategories.splice(categoryIndex, 1);
            this.$message.success("Category deleted successfully");
          })
          .catch(() => {
            // 取消删除
          });
      }
    },
    // 添加产品
    addProduct(categoryIndex) {
      this.productCategories[categoryIndex].list.push({
        id: 0,
        name: "",
        xinghao: "",
        image: "",
      });
    },
    // 删除产品
    deleteProduct(categoryIndex, productIndex) {
      const category = this.productCategories[categoryIndex];
      // 确保每个分类至少保留一个产品
      if (category.list.length > 1) {
        this.$confirm("Are you sure you want to delete this product?", "Confirm", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        })
          .then(() => {
            category.list.splice(productIndex, 1);
            this.$message.success("Product deleted successfully");
          })
          .catch(() => {
            // 取消删除
          });
      } else {
        this.$message.warning("Each category must have at least one product");
      }
    },
    // 产品图片上传成功
    uploadProductImage(res, categoryIndex, productIndex) {
      if (res.code === 200) {
        this.productCategories[categoryIndex].list[productIndex].image =
          res.data.save_url;
        this.$message.success("Image uploaded successfully");
      } else {
        this.$message.error("Image upload failed");
      }
    },

    // 处理工作类型树形选择变化
    handleWorkTypeCheck(data, checked) {
      // 获取当前所有选中的节点ID
      const checkedKeys = this.$refs.workTypeTree.getCheckedKeys();
      this.my_info.workType = checkedKeys;
    },
    preview() {
      this.$router.push({
        path: "manufacturer-detail?id=" + this.my_info.id,
      });
    },

    flattenObjectArray(array, prefix = "items") {
      const result = {};
      array.forEach((obj, index) => {
        Object.keys(obj).forEach((key) => {
          const newKey = `${prefix}[${index}][${key}]`;
          result[newKey] = obj[key];
        });
      });
      return result;
    },

    // 扁平化产品列表数组为键值对
    flattenProductList(productList) {
      const result = {};

      productList.forEach((category, categoryIndex) => {
        // 处理分类基本信息
        result[`productList[${categoryIndex}][id]`] = category.id;
        result[`productList[${categoryIndex}][title]`] = category.title;

        // 处理分类下的产品列表
        if (category.list && category.list.length > 0) {
          category.list.forEach((product, productIndex) => {
            result[`productList[${categoryIndex}][list][${productIndex}][id]`] =
              product.id;
            result[`productList[${categoryIndex}][list][${productIndex}][name]`] =
              product.name;
            result[`productList[${categoryIndex}][list][${productIndex}][xinghao]`] =
              product.xinghao;
            result[`productList[${categoryIndex}][list][${productIndex}][image]`] =
              product.image;
          });
        }
      });

      return result;
    },
  },
};
</script>

<style scoped lang="less" src="./service_company_info.less"></style>
