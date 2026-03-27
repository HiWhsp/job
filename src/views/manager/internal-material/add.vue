<template>
  <div class="view-wrap product-add-page">
    <div class="form-card">
      <div class="page-title">{{ editId ? '编辑原料' : '新增原料' }}</div>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="140px" class="product-form">
        <el-form-item label="原料编码" prop="materialNo">
          <el-input v-model="form.materialNo" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="原料名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryIds">
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
        <el-form-item label="原料类型" prop="materialType">
          <el-select v-model="form.materialType" placeholder="请选择原料类型">
            <el-option label="原料" value="1" />
            <el-option label="外购包装" value="2" />
          </el-select>
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
        <el-form-item label="产品详情" prop="content">
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

              <!-- 未提交规格草稿：名称回车确认本行（不强制先有规格值）；+新增规格行 仅追加空行 -->
              <div
                v-for="(draft, dIndex) in specDraftRows"
                :key="'spec-draft-' + dIndex"
                class="spec-setting-row spec-setting-row-new"
              >
                <div class="spec-col spec-col-name">
                  <el-input
                    v-model="draft.name"
                    placeholder="回车添加"
                    size="small"
                    class="spec-input-inline"
                    maxlength="20"
                    @keyup.enter.native="confirmAddSpecRow(dIndex)"
                  />
                </div>
                <div class="spec-col spec-col-values">
                  <div class="spec-tags-wrap">
                    <el-tag
                      v-for="(v, idx) in draft.values"
                      :key="'draft-' + dIndex + '-val-' + idx"
                      closable
                      type="primary"
                      size="small"
                      class="spec-tag"
                      @close="removeDraftSpecValue(dIndex, idx)"
                    >{{ v }}</el-tag>
                    <el-input
                      v-model="draft.valueInput"
                      placeholder="回车添加"
                      size="small"
                      class="spec-input-inline"
                      maxlength="30"
                      @keyup.enter.native="addDraftSpecValue(dIndex)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <el-button type="primary" size="small" class="btn-add-spec" @click="addSpecDraftRow">+新增</el-button>
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
              <el-table-column label="批次" min-width="180">
                <template slot-scope="{ row }">
                  <el-input v-model="row.batchNo" placeholder="请输入批次" size="small" clearable />
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

/** 富文本是否视为空（去标签与空白后无有效字符） */
function isQuillEmpty(html) {
  if (!html || typeof html !== "string") return true;
  const text = html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, "")
    .trim();
  return !text;
}

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
        materialNo: "",
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
        content: "",
        materialType: "1" // 1 原料，2 外购包装
      },
      formRules: {
        materialNo: [{ required: true, message: "请输入原料编码", trigger: "blur" }],
        name: [{ required: true, message: "请输入原料名称", trigger: "blur" }],
        categoryIds: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value || !Array.isArray(value) || value.length === 0) {
                callback(new Error("请选择所属分类"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        productCategoryIds: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value || !Array.isArray(value) || value.length === 0) {
                callback(new Error("请选择用于产品大类"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        materialType: [{ required: true, message: "请选择原料类型", trigger: "blur" }],
        unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
        expiry: [{ required: true, message: "请输入储存条件", trigger: "blur" }],
        content: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (isQuillEmpty(value)) {
                callback(new Error("请填写产品详情"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
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
      /** 未提交规格草稿，每项 { name, values, valueInput } */
      specDraftRows: [{ name: '', values: [], valueInput: '' }],
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
        materialType: String(data.materialType ?? "1")
      };
      this.syncSpecGroupsFromSkus();
      const inventorys = data.inventorys || [];
      this.specList = inventorys.map((inv, index) => ({
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
    addSpecDraftRow() {
      this.specDraftRows.push({ name: '', values: [], valueInput: '' });
    },
    addDraftSpecValue(dIndex) {
      const draft = this.specDraftRows[dIndex];
      if (!draft) return;
      const val = (draft.valueInput || '').trim();
      if (!val) return;
      if (!draft.values) this.$set(draft, 'values', []);
      if (draft.values.indexOf(val) === -1) {
        draft.values.push(val);
      }
      draft.valueInput = '';
    },
    removeDraftSpecValue(dIndex, idx) {
      const draft = this.specDraftRows[dIndex];
      if (!draft || !draft.values) return;
      draft.values.splice(idx, 1);
    },
    /** 规格名称提交成功后移除对应草稿行，并保证至少保留一行空草稿 */
    finishDraftRow(dIndex) {
      if (dIndex == null || dIndex < 0) return;
      if (this.specDraftRows[dIndex]) {
        this.specDraftRows.splice(dIndex, 1);
      }
      if (!this.specDraftRows.length) {
        this.specDraftRows.push({ name: '', values: [], valueInput: '' });
      }
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
            this.specList = list.map((inv, index) => ({
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
    confirmAddSpecRow(dIndex) {
      const draft = this.specDraftRows[dIndex];
      if (!draft) return;
      const name = (draft.name || '').trim();
      if (!name) {
        this.$message.warning('请输入规格名称');
        return;
      }
      const values = [...(draft.values || [])];
      const existIndex = this.specGroups.findIndex(g => g.name === name);
      if (existIndex > -1) {
        this.$message.warning('已存在同名规格，请更换规格名称');
        return;
      }
      const mid = this.materialId || this.editId || '0';
      this.withFullLoading('正在添加规格...', () =>
        this.$api({
          url: '/setMaterialKey',
          method: 'post',
          data: { materialId: mid, parentId: '0', title: name }
        }).then(res => {
          if (!res || !res.data) {
            this.specGroups.push({
              name,
              values,
              valueInput: '',
              valueIds: []
            });
            this.finishDraftRow(dIndex);
            this.buildSpecList();
            return;
          }
          if (res.data.materialId) this.materialId = String(res.data.materialId);
          const skus = res.data.skus || [];
          const parent = skus.find(s => (s.title || '') === name && (s.parentId === 0 || !s.parentId));
          const parentId = parent ? String(parent.id) : '';
          if (!parentId) {
            this.skus = skus;
            this.syncSpecGroupsFromSkus();
            this.finishDraftRow(dIndex);
            this.buildSpecList();
            return;
          }
          let lastSkus = skus;
          return new Promise((resolve, reject) => {
            const addNext = i => {
              if (i >= values.length) {
                this.skus = lastSkus;
                this.syncSpecGroupsFromSkus();
                this.finishDraftRow(dIndex);
                this.buildSpecList();
                resolve();
                return;
              }
              this.$api({
                url: '/setMaterialKey',
                method: 'post',
                data: { materialId: this.materialId || this.editId, parentId, title: values[i] }
              })
                .then(r => {
                  if (r && r.data && r.data.skus) lastSkus = r.data.skus;
                  addNext(i + 1);
                })
                .catch(() => {
                  this.$message.error('添加规格值失败');
                  this.skus = lastSkus;
                  this.syncSpecGroupsFromSkus();
                  this.finishDraftRow(dIndex);
                  this.buildSpecList();
                  reject();
                });
            };
            addNext(0);
          });
        })
      ).catch(() => {
        this.specGroups.push({
          name,
          values,
          valueInput: '',
          valueIds: []
        });
        this.finishDraftRow(dIndex);
        this.buildSpecList();
      });
    },
    // 根据 specGroups 笛卡尔积生成规格列表；尚无规格值的组不参与，避免 1×0=0 整表清空
    buildSpecList() {
      if (!this.specGroups.length) {
        this.specList = [];
        return;
      }
      const activeGroups = this.specGroups.filter(
        g => Array.isArray(g.values) && g.values.length > 0
      );
      if (!activeGroups.length) {
        this.specList = [];
        return;
      }
      const combos = this.cartesian(
        activeGroups.map(g =>
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
          keyIds: keyIds || (existing && existing.keyIds != null ? String(existing.keyIds) : ""),
          batchNo: existing && existing.batchNo != null ? existing.batchNo : ""
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
        num: String(row.stock ?? ""),
        batchNo: String(row.batchNo ?? "")
      }));
    },
    /** 已填库存不能为数值 0 */
    validateSpecListStockNotZero() {
      const list = this.specList || [];
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        const s = row.stock != null ? String(row.stock).trim() : '';
        if (s === '') continue;
        const n = Number(s);
        if (Number.isFinite(n) && n === 0) {
          this.$message.warning(
            `规格列表第 ${i + 1} 行（规格值：${row.specValue || '—'}）库存不能为 0`
          );
          return false;
        }
      }
      return true;
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        // 提交前根据规格组刷新规格列表，并校验规格与每行编码、库存
        this.buildSpecList();
        const list = this.specList || [];
        if (!list.length) {
          this.$message.warning("请配置产品规格并生成至少一条规格列表");
          return;
        }
        if (!this.validateSpecListStockNotZero()) return;
        for (let i = 0; i < list.length; i++) {
          const row = list[i];
          const code = row.code != null ? String(row.code).trim() : "";
          const stock = row.stock;
          if (!code) {
            this.$message.warning(`规格列表第 ${i + 1} 行请填写编码`);
            return;
          }
          if (stock === "" || stock === null || stock === undefined) {
            this.$message.warning(`规格列表第 ${i + 1} 行请填写库存`);
            return;
          }
        }
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
          materialNo: this.form.materialNo || "",
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
