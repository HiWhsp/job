<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>会员中心</span>
        <span style="margin: 0 10px">></span>
        <span>我的首页</span>
      </div>
    </div>

    <div class="page-ctx">
      <div class="page-ctx-title">
        <span>主页信息维护</span>
      </div>
      <el-form
        :model="my_info"
        label-width="100px"
        class="user-form"
        label-position="right"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="logo">
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
            <el-form-item label="公司名称">
              <el-input v-model="my_info.companyName" clearable placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="form-item-title">我属于的类型：</div>
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
            <el-form-item label="选择地址">
              <area_select ref="area_select" @change="changeSelectAddress" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="公司图片上传">
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
            <el-form-item label="企业介绍">
              <el-input
                v-model="my_info.introduce"
                clearable
                type="textarea"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="page-ctx">
      <div class="page-ctx-title">
        <span>产品介绍</span>
        <div class="add-category-section">
          <el-button type="primary" @click="addCategory">+新增分类</el-button>
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
              <span>产品分类{{ categoryIndex + 1 }}</span>
              <el-input
                v-model="category.title"
                placeholder="请输入分类名称"
                class="category-name-input"
              />
            </div>
            <div class="category-actions">
              <el-button type="primary" size="small" @click="addProduct(categoryIndex)">
                +添加产品
              </el-button>
              <el-button
                v-if="categoryIndex > 0"
                type="danger"
                size="small"
                @click="deleteCategory(categoryIndex)"
              >
                删除分类
              </el-button>
            </div>
          </div>

          <div
            v-for="(product, productIndex) in category.list"
            :key="productIndex"
            class="product-item"
          >
            <div class="product-title">产品{{ productIndex + 1 }}</div>
            <el-form :model="product" label-width="80px" class="product-form">
              <el-form-item label="产品名称">
                <el-input v-model="product.name" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="产品型号">
                <el-input v-model="product.xinghao" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="产品图片">
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
                  删除
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <div class="page-ctx">
      <div class="page-ctx-title">
        <span>联系方式</span>
      </div>
      <el-form
        :model="my_info"
        label-width="70px"
        class="user-form"
        label-position="right"
      >
        <el-form-item label="地址">
          <el-input v-model="my_info.address" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="my_info.contact" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="my_info.email" clearable placeholder="请输入" />
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
              >提交</el-button
            >
            <el-button @click="preview">预览</el-button>
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
        this.$message.error("请输入公司名称");
        return;
      }
      if (!data.address) {
        this.$message.error("请输入地址");
        return;
      }
      if (!data.contact) {
        this.$message.error("请输入电话");
        return;
      }
      if (!data.email) {
        this.$message.error("请输入邮箱");
        return;
      }
      if (!data.workType || data.workType.length == 0) {
        this.$message.error("请选择类型");
        return;
      }
      if (!data.logo) {
        this.$message.error("请上传logo");
        return;
      }
      if (!data.backImage) {
        this.$message.error("请上传公司图片");
        return;
      }
      if (!data.introduce) {
        this.$message.error("请输入企业介绍");
        return;
      }
      if (!data.productList || data.productList.length == 0) {
        this.$message.error("请添加产品");
        return;
      }
      for (let i = 0; i < data.productList.length; i++) {
        let product = data.productList[i];
        if (!product.title) {
          this.$message.error("请输入产品分类名称");
          return;
        }
        for (let j = 0; j < product.list.length; j++) {
          let item = product.list[j];
          if (!item.name) {
            this.$message.error("请输入产品名称");
            return;
          }
          if (!item.xinghao) {
            this.$message.error("请输入产品型号");
            return;
          }
          if (!item.image) {
            this.$message.error("请上传产品图片");
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
            this.$message.success("保存成功");
            this.setView();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("保存失败");
        });
    },
    upload_on_success(res, file) {
      let { code, data, msg } = res;
      if (code == 200) {
        this.my_info.logo = res.data.full_url;
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
        this.my_info.backImage = res.data.full_url;
        this.$forceUpdate();
      }
    },
    // 新增分类
    addCategory() {
      this.productCategories.push({
        id: 0,
        title: `产品分类${this.productCategories.length + 1}`,
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
        this.$confirm("确定要删除此分类吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.productCategories.splice(categoryIndex, 1);
            this.$message.success("分类删除成功");
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
        this.$confirm("确定要删除此产品吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            category.list.splice(productIndex, 1);
            this.$message.success("产品删除成功");
          })
          .catch(() => {
            // 取消删除
          });
      } else {
        this.$message.warning("每个分类至少需要保留一个产品");
      }
    },
    // 产品图片上传成功
    uploadProductImage(res, categoryIndex, productIndex) {
      if (res.code === 200) {
        this.productCategories[categoryIndex].list[productIndex].image =
          res.data.full_url;
        this.$message.success("图片上传成功");
      } else {
        this.$message.error("图片上传失败");
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
