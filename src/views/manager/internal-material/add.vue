<template>
  <div class="view-wrap product-add-page">
    <div class="form-card">
      <div class="page-title">{{ editId ? '编辑原料' : '新增原料' }}</div>
      <el-form ref="formRef" :model="form" label-width="140px" class="product-form">
        <el-form-item label="原料名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
          <el-cascader
            v-model="form.categoryIds"
            :options="internalMaterialCateCascaderOptions"
            :props="{
              value: 'value',
              label: 'label',
              children: 'children',
              checkStrictly: true
            }"
            placeholder="请选择原料分类"
            clearable
            style="width: 322px"
            show-all-levels
          />
        </el-form-item>
        <el-form-item label="用于产品大类" prop="productCategoryIds">
          <el-cascader
            v-model="form.productCategoryIds"
            :options="productCategoryCascaderOptions"
            :props="{
              value: 'value',
              label: 'label',
              children: 'children',
              checkStrictly: true
            }"
            placeholder="请选择产品大类"
            clearable
            style="width: 322px"
            show-all-levels
          />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="储存条件" prop="expiry">
          <el-input v-model="form.expiry" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="产品详情" prop="detail">
          <quill-editor
            v-model="form.content"
            class="quill-editor-wrap"
            :options="quillOptions"
          />
        </el-form-item>

        <!-- 产品规格 -->
        <div class="spec-section">
          <div class="spec-section-title">产品规格</div>

          <div class="spec-setting">
            <div class="spec-setting-title">规格设置</div>

            <!-- 表头 -->
            <div class="spec-setting-table">
              <div class="spec-setting-header">
                <div class="spec-col spec-col-name">规格名称</div>
                <div class="spec-col spec-col-values">规格值</div>
              </div>

              <!-- 已有规格组：一行一个规格名称，对应自己的一组规格值 -->
              <div
                v-for="(group, gIndex) in specGroups"
                :key="'spec-row-' + gIndex"
                class="spec-setting-row"
              >
                <div class="spec-col spec-col-name">
                  <div class="spec-tags-wrap">
                    <el-tag
                      closable
                      type="primary"
                      size="small"
                      class="spec-tag"
                      @close.stop="handleRemoveSpecGroup(gIndex)"
                    >{{ group.name }}</el-tag>
                  </div>
                </div>
                <div class="spec-col spec-col-values">
                  <div class="spec-tags-wrap">
                    <el-tag
                      v-for="(v, vIndex) in group.values"
                      :key="'g-' + gIndex + '-v-' + vIndex"
                      closable
                      type="primary"
                      size="small"
                      class="spec-tag"
                      @close="removeGroupValue(gIndex, vIndex)"
                    >{{ v }}</el-tag>
                    <el-input
                      v-model="group.valueInput"
                      placeholder="回车添加"
                      size="small"
                      class="spec-input-inline"
                      maxlength="30"
                      @keyup.enter.native="addValueForGroup(gIndex)"
                    />
                    <!-- <el-button
                      type="primary"
                      size="small"
                      class="btn-add-spec"
                      @click="addValueForGroup(gIndex)"
                    >+新增</el-button>-->
                  </div>
                </div>
              </div>

              <!-- 新增规格行 -->
              <div class="spec-setting-row spec-setting-row-new">
                <div class="spec-col spec-col-name">
                  <el-input
                    v-model="currentSpecName"
                    placeholder="规格名称"
                    size="small"
                    class="spec-input-inline"
                    maxlength="20"
                  />
                </div>
                <div class="spec-col spec-col-values">
                  <div class="spec-tags-wrap">
                    <el-tag
                      v-for="(v, idx) in currentSpecValues"
                      :key="'new-val-' + idx"
                      closable
                      type="primary"
                      size="small"
                      class="spec-tag"
                      @close="removeCurrentValue(idx)"
                    >{{ v }}</el-tag>
                    <el-input
                      v-model="currentSpecValueInput"
                      placeholder="回车添加"
                      size="small"
                      class="spec-input-inline"
                      maxlength="30"
                      @keyup.enter.native="addSpecValue"
                    />
                  </div>
                </div>
              </div>
            </div>
            <el-button type="primary" size="small" class="btn-add-spec" @click="confirmAddSpec">+新增</el-button>
          </div>

          <div class="spec-list-block">
            <div class="spec-setting-title">规格列表</div>
            <el-table :data="specList" border class="spec-table">
              <el-table-column label="规格值" min-width="200">
                <template slot-scope="{ row }">
                  <el-input v-model="row.specValue" readonly size="small" />
                </template>
              </el-table-column>
              <el-table-column label="编码" min-width="180">
                <template slot-scope="{ row }">
                  <el-input v-model="row.code" placeholder="请输入编码" size="small" clearable />
                </template>
              </el-table-column>
              <el-table-column label="库存" min-width="160">
                <template slot-scope="{ row }">
                  <el-input v-model="row.stock" placeholder="库存" size="small" clearable />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "InternalMaterialAdd",

  computed: {
    ...mapState(["vuex_internal_material_cate_list", "vuex_product_cate_list"]),
    /** 将 Vuex 原料分类树转为 Cascader 所需格式 { value, label, children } */
    internalMaterialCateCascaderOptions() {
      const list = this.vuex_internal_material_cate_list || [];
      const mapTree = nodes => {
        if (!Array.isArray(nodes)) return [];
        return nodes.map(node => {
          const item = {
            value: node.id,
            label: node.title || ""
          };
          const children = node.child;
          if (Array.isArray(children) && children.length) {
            item.children = mapTree(children);
          }
          return item;
        });
      };
      return mapTree(list);
    },
    /** 产品大类级联选项（复用产品新增页的数据结构） */
    productCategoryCascaderOptions() {
      const list = this.vuex_product_cate_list || [];
      const mapTree = nodes => {
        if (!Array.isArray(nodes)) return [];
        return nodes.map(node => {
          const item = { value: node.id, label: node.title || "" };
          const children = node.child;
          if (Array.isArray(children) && children.length) {
            item.children = mapTree(children);
          }
          return item;
        });
      };
      return mapTree(list);
    }
  },

  data() {
    return {
      editId: "",
      /** 原料 id：编辑时为 editId，新增时首次添加规格后由 setMaterialKey 返回 */
      materialId: "",
      /** 规格树（来自 getMaterialInfo / setMaterialKey），用于接口增删规格 */
      skus: [],
      form: {
        name: "",
        code: "",
        categoryId: "",
        categoryIds: [],
        productCategoryIds: [],
        registerCode: "",
        registerCertList: [],
        licenseList: [],
        expiry: "",
        unit: "",
        detail: "",
        materialType: "1" // 1 原料，2 外购包装
      },
      quillOptions: {
        theme: 'snow',
        placeholder: '请输入产品详情...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            [{ color: [] }, { background: [] }],
            ['link', 'image'],
            ['clean']
          ]
        }
      },
      // 产品规格：已确认的规格组 [{ id?, name, values, valueIds?, valueInput }]
      specGroups: [],
      // 新增规格名称 / 规格值（底部“新增”行）
      currentSpecName: "",
      currentSpecValueInput: "",
      currentSpecValues: [],
      // 规格列表（笛卡尔积生成），每项 { specValue, code, stock, id?, keyIds? }
      specList: []
    };
  },

  mounted() {
    const id = this.$route.query.id;
    if (id) {
      this.editId = String(id);
      this.loadDetail();
    }
  },

  methods: {
    withFullLoading(text, fn) {
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: text || "处理中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.35)"
      });
      const close = () => {
        try {
          if (loading && loading.close) loading.close();
        } catch (e) {}
      };
      return Promise.resolve()
        .then(fn)
        .finally(close);
    },
    /** 在树中查找节点 id 的路径（用于级联回显） */
    findPathInTree(nodes, targetId, path = []) {
      if (!Array.isArray(nodes)) return [];
      for (const node of nodes) {
        const p = [...path, node.id];
        if (node.id == targetId) return p;
        const childs = node.child || node.childs;
        if (Array.isArray(childs)) {
          const found = this.findPathInTree(childs, targetId, p);
          if (found.length) return found;
        }
      }
      return [];
    },
    loadDetail() {
      if (!this.editId) return;
      this.$api({
        url: "/getMaterialInfo",
        method: "post",
        data: { id: this.editId }
      })
        .then(res => {
          if (res && res.data) this.fillFormFromDetail(res.data);
        })
        .catch(() => {
          this.$message.error("获取原料详情失败");
        });
    },
    /** 将详情接口返回的数据回填到表单和规格 */
    fillFormFromDetail(data) {
      this.materialId = data.id != null ? String(data.id) : "";
      this.skus = data.skus || [];
      const catePath = this.findPathInTree(this.vuex_internal_material_cate_list || [], data.cateId);
      const productCatePath = this.findPathInTree(
        this.vuex_product_cate_list || [],
        data.productCateId === "0" || data.productCateId === 0 ? null : data.productCateId
      );
      this.form = {
        name: data.title ?? "",
        code: data.materialNo ?? "",
        categoryIds: catePath.length ? catePath : [data.cateId],
        productCategoryIds: productCatePath.length ? productCatePath : (data.productCateId && data.productCateId !== "0" ? [data.productCateId] : []),
        registerCode: this.form.registerCode || "",
        registerCertList: this.form.registerCertList || [],
        licenseList: this.form.licenseList || [],
        expiry: data.storageConditions ?? "",
        unit: data.unit ?? "",
        detail: data.content ?? "",
        content: data.content ?? "",
        materialType: this.form.materialType || "1"
      };
      this.syncSpecGroupsFromSkus();
      const inventorys = data.inventorys || [];
      this.specList = inventorys.map(inv => ({
        specValue: inv.keyVals ?? "",
        code: inv.sn ?? "",
        stock: inv.kucun ?? inv.num ?? "",
        id: inv.id,
        keyIds: inv.keyIds ?? "",
        batchNo: inv.batchNo ?? ""
      }));
    },
    /** 根据 skus 同步 specGroups（含 id、valueIds） */
    syncSpecGroupsFromSkus() {
      const skus = this.skus || [];
      this.specGroups = skus.map(s => {
        const childs = s.childs || s.child || [];
        return {
          id: s.id,
          name: s.title || "",
          values: childs.map(c => c.title || ""),
          valueIds: childs.map(c => c.id),
          valueInput: ""
        };
      });
    },
    addSpecValue() {
      const val = (this.currentSpecValueInput || "").trim();
      if (!val) return;
      if (this.currentSpecValues.indexOf(val) === -1) {
        this.currentSpecValues.push(val);
      }
      this.currentSpecValueInput = "";
    },
    // 为已有规格组添加规格值（有 materialId 且 group.id 时调 setMaterialKey）
    addValueForGroup(gIndex) {
      const group = this.specGroups[gIndex];
      if (!group) return;
      const val = (group.valueInput || "").trim();
      if (!val) return;
      group.valueInput = "";
      const mid = this.materialId || this.editId || "0";
      if (group.id && mid && mid !== "0") {
        this.withFullLoading("正在添加规格值...", () =>
          this.$api({
            url: "/setMaterialKey",
            method: "post",
            data: { materialId: mid, parentId: String(group.id), title: val }
          })
            .then(res => {
              if (res && res.data && res.data.skus) {
                this.skus = res.data.skus;
                this.syncSpecGroupsFromSkus();
                this.buildSpecList();
              } else {
                if (!group.values) group.values = [];
                if (group.values.indexOf(val) === -1) group.values.push(val);
                this.$set(this.specGroups, gIndex, { ...group });
                this.buildSpecList();
              }
            })
            .catch(() => {
              this.$message.error("添加规格值失败");
            })
        );
      } else {
        if (!group.values) group.values = [];
        if (group.values.indexOf(val) === -1) group.values.push(val);
        this.$set(this.specGroups, gIndex, { ...group });
        this.buildSpecList();
      }
    },
    // 删除前弹确认
    handleRemoveSpecGroup(idx) {
      this.$confirm("确认删除该规格，该操作将会重新生成规格数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removeSpecGroup(idx);
        })
        .catch(() => {});
    },
    removeSpecGroup(idx) {
      const group = this.specGroups[idx];
      if (!group) return;
      if (group.id && (this.materialId || this.editId)) {
        this.withFullLoading("正在删除规格...", () =>
          this.$api({ url: "/delMaterialKey", method: "post", data: { id: String(group.id) } }).then(() =>
            this.refreshSpecFromDetail()
          )
        ).catch(() => this.$message.error("删除规格失败"));
      } else {
        this.specGroups.splice(idx, 1);
        this.buildSpecList();
      }
    },
    refreshSpecFromDetail() {
      const mid = this.materialId || this.editId;
      if (!mid) return Promise.resolve();
      return this.$api({ url: "/getMaterialInfo", method: "post", data: { id: mid } })
        .then(res => {
          if (res && res.data) {
            this.skus = res.data.skus || [];
            this.syncSpecGroupsFromSkus();
            const list = res.data.inventorys || [];
            this.specList = list.map(inv => ({
              specValue: inv.keyVals ?? "",
              code: inv.sn ?? "",
              stock: inv.kucun ?? inv.num ?? "",
              id: inv.id,
              keyIds: inv.keyIds ?? "",
              batchNo: inv.batchNo ?? ""
            }));
          }
        })
        .catch(() => {});
    },
    removeCurrentValue(idx) {
      this.currentSpecValues.splice(idx, 1);
    },
    /** 删除规格组内一个规格值：有 valueIds 时调 delMaterialKey 并刷新 */
    removeGroupValue(gIndex, vIndex) {
      const group = this.specGroups[gIndex];
      if (!group) return;
      const valueIds = group.valueIds || [];
      const id = valueIds[vIndex];
      if (id != null && (this.materialId || this.editId)) {
        this.withFullLoading("正在删除规格值...", () =>
          this.$api({
            url: "/delMaterialKey",
            method: "post",
            data: { id: String(id) }
          }).then(() => this.refreshSpecFromDetail())
        ).catch(() => this.$message.error("删除规格值失败"));
      } else {
        group.values.splice(vIndex, 1);
        if (valueIds.length) valueIds.splice(vIndex, 1);
        this.$set(this.specGroups, gIndex, { ...group });
        this.buildSpecList();
      }
    },
    confirmAddSpec() {
      const name = (this.currentSpecName || "").trim();
      if (!name) {
        this.$message.warning("请输入规格名称");
        return;
      }
      if (!this.currentSpecValues.length) {
        this.$message.warning("请至少添加一个规格值");
        return;
      }
      const values = [...this.currentSpecValues];
      const existIndex = this.specGroups.findIndex(g => g.name === name);
      if (existIndex > -1) {
        this.$message.warning("已存在同名规格，请更换规格名称");
        return;
      }
      const mid = this.materialId || this.editId || "0";
      this.withFullLoading("正在添加规格...", () =>
        this.$api({
          url: "/setMaterialKey",
          method: "post",
          data: { materialId: mid, parentId: "0", title: name }
        }).then(res => {
          if (!res || !res.data) {
            this.specGroups.push({ name, values, valueInput: "" });
            this.currentSpecName = "";
            this.currentSpecValues = [];
            this.currentSpecValueInput = "";
            this.buildSpecList();
            return;
          }
          if (res.data.materialId) this.materialId = String(res.data.materialId);
          const skus = res.data.skus || [];
          const parent = skus.find(s => (s.title || "") === name && (s.parentId === 0 || !s.parentId));
          const parentId = parent ? String(parent.id) : "";
          if (!parentId) {
            this.skus = skus;
            this.syncSpecGroupsFromSkus();
            this.currentSpecName = "";
            this.currentSpecValues = [];
            this.currentSpecValueInput = "";
            this.buildSpecList();
            return;
          }
          let lastSkus = skus;
          return new Promise((resolve, reject) => {
            const addNext = (i) => {
              if (i >= values.length) {
                this.skus = lastSkus;
                this.syncSpecGroupsFromSkus();
                this.currentSpecName = "";
                this.currentSpecValues = [];
                this.currentSpecValueInput = "";
                this.buildSpecList();
                resolve();
                return;
              }
              this.$api({
                url: "/setMaterialKey",
                method: "post",
                data: { materialId: this.materialId || this.editId, parentId, title: values[i] }
              })
                .then(r => {
                  if (r && r.data && r.data.skus) lastSkus = r.data.skus;
                  addNext(i + 1);
                })
                .catch(() => {
                  this.$message.error("添加规格值失败");
                  this.skus = lastSkus;
                  this.syncSpecGroupsFromSkus();
                  this.currentSpecName = "";
                  this.currentSpecValues = [];
                  this.currentSpecValueInput = "";
                  this.buildSpecList();
                  reject();
                });
            };
            addNext(0);
          });
        })
      ).catch(() => {
        this.specGroups.push({ name, values, valueInput: "" });
        this.currentSpecName = "";
        this.currentSpecValues = [];
        this.currentSpecValueInput = "";
        this.buildSpecList();
      });
    },
    // 根据 specGroups 笛卡尔积生成规格列表；有 valueIds 时计算 keyIds，并尽量保留原有编码/库存
    buildSpecList() {
      if (!this.specGroups.length) {
        this.specList = [];
        return;
      }
      const combos = this.cartesian(
        this.specGroups.map(g =>
          (g.values || []).map((v, i) => ({
            name: g.name,
            value: v,
            valueId: (g.valueIds && g.valueIds[i]) || null
          }))
        )
      );
      // 按 keyIds / specValue 建立索引，尽量复用已有行的数据
      const existingByKeyIds = {};
      const existingBySpec = {};
      (this.specList || []).forEach(r => {
        const kid = r.keyIds != null && r.keyIds !== "" ? String(r.keyIds) : "";
        const sv = r.specValue != null ? String(r.specValue) : "";
        if (kid) existingByKeyIds[kid] = r;
        if (sv) existingBySpec[sv] = r;
      });

      const newList = combos.map(combo => {
        const defaultSpecValue = combo.map(c => c.value).join(",");
        const keyIds = combo
          .map(c => c.valueId)
          .filter(id => id != null && id !== "")
          .join("-");
        const existing =
          (keyIds && existingByKeyIds[keyIds]) ||
          existingBySpec[defaultSpecValue] ||
          null;
        const specValue = existing && existing.specValue != null
          ? String(existing.specValue)
          : defaultSpecValue;
        return {
          specValue,
          code: existing && existing.code != null ? existing.code : "",
          stock: existing && existing.stock != null ? existing.stock : "",
          id: existing && existing.id != null ? existing.id : undefined,
          keyIds: keyIds || (existing && existing.keyIds != null ? String(existing.keyIds) : "")
        };
      });
      this.specList = newList;
    },
    cartesian(arrays) {
      if (arrays.length === 0) return [[]];
      const [first, ...rest] = arrays;
      const restCart = this.cartesian(rest);
      const result = [];
      first.forEach(item => {
        restCart.forEach(r => {
          result.push([item, ...r]);
        });
      });
      return result;
    },
    handleUploadChange(field, fileList) {
      this.form[field] = fileList;
    },
    handleUploadRemove(field) {
      this.form[field] = [];
    },
    /** 构建原料规格 inventorys，结构参考产品新增；编辑时保留 keyIds */
    buildInventorys() {
      return (this.specList || []).map(row => ({
        id: row.id != null && row.id !== "" ? String(row.id) : "",
        sn: String(row.code ?? ""),
        keyIds: row.keyIds != null ? String(row.keyIds) : "",
        keyVals: String(row.specValue ?? ""),
        num: String(row.stock ?? "")
      }));
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        // 所属分类使用级联最后一级 id 作为 categoryId
        const ids = this.form.categoryIds || [];
        const categoryId = ids.length ? String(ids[ids.length - 1]) : this.form.categoryId;
        // 用于产品大类使用级联最后一级 id 作为 productCateId
        const pIds = this.form.productCategoryIds || [];
        const productCateId = pIds.length ? String(pIds[pIds.length - 1]) : "0";
        const params = {
          id: this.editId || this.materialId || "",
          title: this.form.name,
          cateId: categoryId,
          productCateId,
          storageConditions: this.form.expiry || "",
          unit: this.form.unit || "",
          content: this.form.content || "",
          inventorys: JSON.stringify(this.buildInventorys()),
          materialNo: this.form.code || "",
          materialType: this.form.materialType || "1"
        };
        this.$api({
          url: "/addMaterial",
          method: "post",
          data: params
        })
          .then(() => {
            this.$message.success("提交成功");
            this.$router.push("/manager/internal-material/list");
          })
          .catch(err => {
            this.$message.error((err && err.msg) ? err.msg : "提交失败");
          });
      });
    },
    handleCancel() {
      this.$router.push("/manager/internal-material/list");
    }
  }
};
</script>

<style lang="less" scoped>
.product-add-page {
  background: #f8f8f8;
  min-height: 100%;
}

.form-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px 32px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  color: #333;
  margin-bottom: 24px;
  padding-bottom: 12px;
}

.product-form {
  .el-form-item {
    margin-bottom: 20px;
  }

  .el-form-item__label {
    color: #606266;
  }

  .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label::before {
    color: #f56c6c;
  }
  :deep(.el-input),
  :deep(.el-input__inner),
  :deep(.el-select .el-input__inner) {
    width: 322px;
  }

  :deep(.el-form-item__content) {
    text-align: left;
  }
}

.quill-editor-wrap {
  width: 100%;
  max-width: 860px;
}

/* Quill 编辑区高度 */
:deep(.quill-editor-wrap .ql-container) {
  min-height: 320px;
}

.upload-image-card {
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 120px;
    background-color: #f5f5f5;
    border: 1px solid #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .el-icon-plus {
      font-size: 28px;
      color: #909399;
      margin-bottom: 4px;
    }
  }

  ::v-deep .el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 120px;
    border-radius: 4px;
  }
}

.upload-text {
  font-size: 14px;
  color: #878787;
  line-height: 20px;
}

/* 产品规格 */
.spec-section {
  margin-top: 32px;
  margin-bottom: 24px;
  padding-top: 24px;
  border-top: 1px solid #f1f1f1;
}

.spec-section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
  text-align: left;
  background: #eeeeee;
}

.spec-setting-title {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  text-align: left;
  height: 40px;
  line-height: 40px;
  background: #eeeeee;
  padding-left: 20px;
  margin-bottom: 26px;
}

.spec-setting {
  margin: 0 20px 20px;
  text-align: left;
}

.spec-setting-table {
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  background: #fff;
}

.spec-setting-header {
  display: flex;
  border-bottom: 1px solid #f9f9f9;
  background-color: #fff;
  height: 40px;
  align-items: center;
}

.spec-setting-row {
  display: flex;
  min-height: 60px;
  border-top: 1px solid #f9f9f9;
  align-items: flex-start;
}

.spec-setting-row:first-of-type {
  border-top: none;
}

.spec-setting-row-new {
  background: #fff;
}

.spec-col {
  padding: 10px 16px;
  display: flex;
  align-items: center;
}

.spec-col-name {
  width: 160px;
  border-right: 1px solid #ebeef5;
}

.spec-col-values {
  flex: 1;
}

.spec-tags-wrap {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  vertical-align: top;

  :deep(.el-tag) {
    padding: 0 16px;
    height: 39px;
    line-height: 39px;
    font-size: 14px;
    color: #2373c8;
    background: #d6eaff;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #badbff;
  }
}

.spec-tag {
  margin-right: 0;
}

.spec-input-inline {
  width: 220px;

  :deep(.el-input__inner) {
    width: 101px;
    height: 39px;
    background: #ffffff;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #badbff;
  }
}

.btn-add-spec {
  width: 78px;
  height: 41px;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #e8e8e8;
  background: #fff !important;
  font-size: 14px;
  color: #4a4a4a;
  margin-top: 12px;
  margin-left: 18px;
}

.spec-list-block {
  .spec-setting-title {
    margin-bottom: 12px;
  }
}

.spec-table {
  :deep(.el-input__inner) {
    border-radius: 4px;
  }
  :deep(.el-table__header-wrapper) {
    .el-table__header tr .el-table__cell {
      background: #fff !important;
    }
  }

  :deep(.el-input__inner) {
    width: 322px;
    height: 40px;
    background: #ffffff;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #d4d4d4;
  }
}

.form-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f1f1;

  .el-button {
    width: 180px;
    height: 45px;
    padding: 10px 24px;
  }

  .el-button--primary {
    background: #2373C8!important;
    border: none;
  }
}
</style>
