<template>
  <div class="view-wrap product-add-page">
    <div class="form-card">
      <div class="page-title">{{ isEdit ? '编辑产品' : '新增产品' }}</div>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="140px" class="product-form">
        <el-form-item label="产品名称" prop="title" required>
          <el-input v-model="form.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="产品编码" prop="productNo" required>
          <el-input v-model="form.productNo" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryIds" required>
          <el-cascader ref="cascaderRef" v-model="form.categoryIds" :options="productCategoryCascaderOptions"
            :props="{ value: 'value', label: 'label', children: 'children', checkStrictly: true }" placeholder="请选择产品分类"
            clearable show-all-levels @visible-change="onCascaderVisibleChange" />
        </el-form-item>
        <el-form-item label="注册证编码" prop="registerNo">
          <el-input v-model="form.registerNo" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="注册证附件" prop="registerImage">
          <el-upload class="upload-image-card" list-type="picture-card" :action="uploadAction" name="file" :limit="1"
            :file-list="form.registerCertList"
            :on-success="(res, file, list) => handleUploadSuccess('registerImage', res, file, list)"
            :on-remove="(file, list) => handleImageRemove('registerImage', file, list)"
            :http-request="(opt) => handleUploadRequest(opt, 'registerImage')">
            <i class="el-icon-plus" />
            <span class="upload-text">添加图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="生产许可证" prop="licenseImage">
          <el-upload class="upload-image-card" list-type="picture-card" :action="uploadAction" name="file" :limit="1"
            :file-list="form.licenseList"
            :on-success="(res, file, list) => handleUploadSuccess('licenseImage', res, file, list)"
            :on-remove="(file, list) => handleImageRemove('licenseImage', file, list)"
            :http-request="(opt) => handleUploadRequest(opt, 'licenseImage')">
            <i class="el-icon-plus" />
            <span class="upload-text">添加图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="产品效期" prop="validity">
          <el-input v-model="form.validity" placeholder="如：12个月" clearable />
        </el-form-item>
        <el-form-item label="单位" prop="unit" required>
          <el-input v-model="form.unit" placeholder="如：个、盒" clearable />
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
              <div v-for="(group, gIndex) in specGroups" :key="'spec-row-' + gIndex" class="spec-setting-row">
                <div class="spec-col spec-col-name">
                  <div class="spec-tags-wrap">
                    <el-tag closable type="primary" size="small" class="spec-tag"
                      @close.stop="handleRemoveSpecGroup(gIndex)">{{ group.name }}</el-tag>
                  </div>
                </div>
                <div class="spec-col spec-col-values">
                  <div class="spec-tags-wrap">
                    <el-tag v-for="(v, vIndex) in group.values" :key="'g-' + gIndex + '-v-' + vIndex" closable
                      type="primary" size="small" class="spec-tag" @close="removeGroupValue(gIndex, vIndex)">{{ v
                      }}</el-tag>
                    <el-input v-model="group.valueInput" placeholder="回车添加" size="small" class="spec-input-inline"
                      maxlength="30" @keyup.enter.native="addValueForGroup(gIndex)" />
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
                  <el-input v-model="currentSpecName" placeholder="规格名称" size="small" class="spec-input-inline"
                    maxlength="20" />
                </div>
                <div class="spec-col spec-col-values">
                  <div class="spec-tags-wrap">
                    <el-tag v-for="(v, idx) in currentSpecValues" :key="'new-val-' + idx" closable type="primary"
                      size="small" class="spec-tag" @close="removeCurrentValue(idx)">{{ v }}</el-tag>
                    <el-input v-model="currentSpecValueInput" placeholder="回车添加" size="small" class="spec-input-inline"
                      maxlength="30" @keyup.enter.native="addSpecValue" />
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
                  <el-input v-model="row.sn" placeholder="请输入编码" size="small" clearable />
                </template>
              </el-table-column>
              <el-table-column label="库存" min-width="160">
                <template slot-scope="{ row }">
                  <el-input v-model="row.num" placeholder="库存" size="small" clearable />
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
import { mapState } from 'vuex';
import axios from 'axios';
import { UPLOAD_ROOT } from '@/config/env.js';

export default {
  name: "ProductAdd",

  computed: {
    ...mapState(['vuex_product_cate_list']),
    productCategoryCascaderOptions() {
      const list = this.vuex_product_cate_list || [];
      const mapTree = (nodes) => {
        if (!Array.isArray(nodes)) return [];
        return nodes.map(node => {
          const item = { value: node.id, label: node.title || '' };
          if (Array.isArray(node.child) && node.child.length) {
            item.children = mapTree(node.child);
          }
          return item;
        });
      };
      return mapTree(list);
    }
  },

  data() {
    return {
      uploadAction: UPLOAD_ROOT,
      isEdit: false,
      editId: '',
      form: {
        title: "",
        productNo: "",
        categoryIds: [],
        registerNo: "",
        registerImage: "",
        licenseImage: "",
        registerCertList: [],
        licenseList: [],
        validity: "",
        unit: "",
        content: ""
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
      formRules: {
        title: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        productNo: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        categoryIds: [{ required: true, message: '请选择产品分类', trigger: 'blur' }]
      },
      productId: '', // 新增时由 setProductKey 返回，编辑时为商品 id
      skus: [], // 规格树，来自 setProductKey 或详情接口
      specGroups: [],
      currentSpecName: "",
      currentSpecValueInput: "",
      currentSpecValues: [],
      specList: [] // 每项 { specValue, sn, num, id? }
    };
  },

  mounted() {
    const id = this.$route.query.id;
    if (id) {
      this.isEdit = true;
      this.editId = String(id);
      this.productId = String(id);
      this.loadDetail();
    }
  },

  methods: {
    withFullLoading(text, fn) {
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: text || '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.35)'
      });
      const close = () => {
        try { loading && loading.close && loading.close(); } catch (e) { }
      };
      return Promise.resolve()
        .then(fn)
        .finally(close);
    },
    addSpecValue() {
      const val = (this.currentSpecValueInput || "").trim();
      if (!val) return;
      if (this.currentSpecValues.indexOf(val) === -1) {
        this.currentSpecValues.push(val);
      }
      this.currentSpecValueInput = "";
    },
    async addValueForGroup(gIndex) {
      const group = this.specGroups[gIndex];
      if (!group) return;
      const val = (group.valueInput || "").trim();
      if (!val) return;
      if (!group.values) group.values = [];
      if (group.values.indexOf(val) !== -1) {
        group.valueInput = "";
        return;
      }
      const parent = (this.skus || []).find(s => (s.title || '') === (group.name || ''));
      const groupId = parent ? String(parent.id) : '0';
      const productId = this.productId || '0';
      const ok = await this.withFullLoading('正在添加规格值...', async () => {
        const r = await this.$api({
          url: '/setProductKey',
          method: 'post',
          data: { productId, parentId: groupId, title: val }
        });
        if (r && r.code === 200 && r.data && Array.isArray(r.data.skus)) this.skus = r.data.skus;
      }).then(() => true).catch((e) => {
        this.$message.error(e && e.msg ? e.msg : '添加规格值失败');
        return false;
      });
      if (!ok) return;
      group.values.push(val);
      group.valueInput = "";
      this.$set(this.specGroups, gIndex, { ...group });
      this.buildSpecList();
    },
    // 删除前弹确认
    handleRemoveSpecGroup(idx) {
      this.$confirm("确认删除该规格，该操作将会重新生成规格数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await this.removeSpecGroup(idx);
        })
        .catch(() => { });
    },
    async removeGroupValue(gIndex, vIndex) {
      const group = this.specGroups[gIndex];
      if (!group) return;
      const valTitle = (group.values || [])[vIndex];
      if (!valTitle) return;

      try {
        await this.$confirm(`确认删除规格值“${valTitle}”？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
      } catch (e) {
        return;
      }

      // 通过 skus 树找到该规格值对应的 id
      const parent = (this.skus || []).find(s => (s.title || '') === (group.name || ''));
      const childs = (parent && (parent.childs || parent.child)) || [];
      const node = Array.isArray(childs) ? childs.find(c => (c.title || '') === valTitle) : null;
      const keyId = node && node.id != null ? String(node.id) : '';

      const ok = await this.withFullLoading('正在删除规格值...', async () => {
        if (keyId) {
          await this.$api({
            url: '/delProductKey',
            method: 'post',
            data: { id: keyId }
          });
        }

        // 接口删除成功后再移除前端数据
        group.values.splice(vIndex, 1);
        this.$set(this.specGroups, gIndex, { ...group });

        // 同步移除本地 skus（避免后续 keyIds 计算仍命中旧值）
        if (keyId && parent && Array.isArray(childs)) {
          const newChilds = childs.filter(c => String(c.id) !== keyId);
          const updatedParent = { ...parent, childs: newChilds };
          this.skus = (this.skus || []).map(s => (String(s.id) === String(parent.id) ? updatedParent : s));
        }

        this.buildSpecList();

        if (this.isEdit) {
          await Promise.resolve(this.loadDetail());
        }
      }).then(() => true).catch((e) => {
        this.$message.error(e && e.msg ? e.msg : '删除规格值失败');
        return false;
      });
      if (!ok) return;
    },
    async removeSpecGroup(idx) {
      const group = this.specGroups[idx];
      const groupId = group && group.id != null ? String(group.id) : '';
      const ok = await this.withFullLoading('正在删除规格...', async () => {
        if (groupId) {
          await this.$api({
            url: '/delProductKey',
            method: 'post',
            data: { id: groupId }
          });
        }

        // 接口删除成功后再移除前端数据
        this.specGroups.splice(idx, 1);

        // 同步移除本地 skus（避免后续 keyIds 计算仍命中旧规格）
        if (groupId) {
          this.skus = (this.skus || []).filter(s => String(s.id) !== groupId);
        }

        // 删除规格会导致规格组合变化，重新生成列表
        this.buildSpecList();

        if (this.isEdit) {
          await Promise.resolve(this.loadDetail());
        }
      }).then(() => true).catch((e) => {
        this.$message.error(e && e.msg ? e.msg : '删除规格失败');
        return false;
      });
      if (!ok) return;
    },
    removeCurrentValue(idx) {
      console.log(idx);
      this.currentSpecValues.splice(idx, 1);
    },
    async confirmAddSpec() {
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
      const productId = this.productId || '0';
      const ok = await this.withFullLoading('正在添加规格...', async () => {
        const res1 = await this.$api({
          url: '/setProductKey',
          method: 'post',
          data: { productId, parentId: '0', title: name }
        });
        if (!res1 || res1.code !== 200 || !res1.data) {
          throw res1 || new Error('添加规格失败');
        }
        if (res1.data.productId) this.productId = String(res1.data.productId);
        const skus = res1.data.skus || [];
        const newGroup = skus.find(s => (s.title || '') === name && (s.parentId === 0 || !s.parentId));
        const groupId = newGroup ? String(newGroup.id) : '';
        let lastSkus = skus;
        for (const val of values) {
          const r = await this.$api({
            url: '/setProductKey',
            method: 'post',
            data: { productId: this.productId, parentId: groupId, title: val }
          });
          if (r && r.code === 200 && r.data && Array.isArray(r.data.skus)) lastSkus = r.data.skus;
        }
        this.skus = lastSkus;
      }).then(() => true).catch((e) => {
        this.$message.error((e && e.msg) ? e.msg : '添加规格失败');
        return false;
      });
      if (!ok) return;
      this.specGroups.push({ name, values, valueInput: "" });
      this.currentSpecName = "";
      this.currentSpecValues = [];
      this.currentSpecValueInput = "";
      this.buildSpecList();
    },
    // 根据 specGroups 笛卡尔积生成规格列表
    buildSpecList() {
      if (!this.specGroups.length) {
        this.specList = [];
        return;
      }
      const combos = this.cartesian(
        this.specGroups.map(g =>
          g.values.map(v => ({ name: g.name, value: v }))
        )
      );
      const existingKeys = new Set(this.specList.map(r => r.specValue));
      const newList = combos.map(combo => {
        const specValue = combo.map(c => c.value).join(",");
        const existing = this.specList.find(r => r.specValue === specValue);
        return {
          specValue,
          sn: existing ? existing.sn : "",
          num: existing ? existing.num : "",
          id: existing ? existing.id : ""
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
    loadDetail() {
      if (!this.editId) return;
      this.$api({ url: '/getProductInfo', method: 'post', data: { id: this.editId } })
        .then(res => {
          if (res && res.code === 200 && res.data) this.fillFormFromDetail(res.data);
        })
        .catch(() => this.$message.error('获取产品详情失败'));
    },
    fillFormFromDetail(data) {
      const ids = data.cateId != null ? [data.cateId] : (Array.isArray(data.categoryIds) ? data.categoryIds : []);
      if (data.id != null && data.id !== '') this.productId = String(data.id);
      this.form = {
        title: data.title ?? '',
        productNo: data.productNo ?? '',
        categoryIds: ids,
        registerNo: data.registerNo ?? '',
        registerImage: data.registerImage ?? '',
        licenseImage: data.licenseImage ?? '',
        registerCertList: data.registerImage ? [{ url: data.registerImage }] : [],
        licenseList: data.licenseImage ? [{ url: data.licenseImage }] : [],
        validity: data.validity ?? '',
        unit: data.unit ?? '',
        content: data.content ?? ''
      };
      const skuTree = data.skus || data.skuList || [];
      this.skus = Array.isArray(skuTree) ? skuTree : [];
      this.specGroupsFromSkus(this.skus);
      const list = data.inventorys || data.list || data.inventoryList || [];
      const arr = Array.isArray(list) ? list : (typeof list === 'string' ? (() => { try { return JSON.parse(list); } catch (e) { return []; } })() : []);
      this.specList = arr.map(it => ({
        specValue: it.keyVals ?? '',
        sn: it.sn ?? '',
        num: it.num ?? it.kucun ?? '',
        id: it.id != null ? String(it.id) : ''
      }));
    },
    specGroupsFromSkus(skus) {
      if (!Array.isArray(skus) || !skus.length) {
        this.specGroups = [];
        return;
      }
      this.specGroups = skus.map(node => {
        const childs = node.childs || node.child || [];
        return {
          name: node.title || '',
          values: Array.isArray(childs) ? childs.map(c => c.title || '') : [],
          valueInput: '',
          id: node.id
        };
      });
      this.buildSpecList();
    },
    /** 自定义上传：使用 UPLOAD_ROOT，参数名 file（与 customer/add 一致） */
    handleUploadRequest(option, field) {
      const formData = new FormData();
      formData.append('file', option.file);
      const token = localStorage.getItem('token');
      axios
        .post(UPLOAD_ROOT, formData, {
          headers: { Authorization: 'Bearer ' + token },
          timeout: 60000
        })
        .then(res => {
          const data = res.data || res;
          const payload = data && data.data ? data.data : data;
          const url = (payload && (payload.path || payload.url)) || (data && data.path) || '';
          this.form[field] = url;
          option.onSuccess({ url });
        })
        .catch(err => {
          this.$message.error(
            (err.response && err.response.data && err.response.data.msg) || '上传失败'
          );
          option.onError(err);
        });
    },
    handleUploadSuccess(field, res, file, fileList) {
      const listKey = field === 'registerImage' ? 'registerCertList' : 'licenseList';
      this.form[listKey] = fileList;
      const r = res || (file && file.response);
      const payload = r && r.data ? r.data : r;
      const url = (payload && (payload.path || payload.url)) || (r && r.path) || (file && file.url) || '';
      if (url && file) file.url = url;
    },
    handleImageRemove(field, file, fileList) {
      const listKey = field === 'registerImage' ? 'registerCertList' : 'licenseList';
      this.form[listKey] = fileList || [];
      this.form[field] = '';
    },
    handleUploadChange(field, fileList) {
      this.form[field] = fileList;
    },
    handleUploadRemove(field) {
      this.form[field] = [];
    },
    getKeyIdsFromSpecValue(specValue) {
      const parts = (specValue || '').split(',').map(s => s.trim()).filter(Boolean);
      const ids = [];
      const skus = this.skus || [];
      parts.forEach((valTitle, idx) => {
        const group = this.specGroups[idx];
        if (!group) return;
        const parent = skus.find(s => (s.title || '') === (group.name || ''));
        const childs = (parent && (parent.childs || parent.child)) || [];
        const node = childs.find(c => (c.title || '') === valTitle);
        if (node && node.id != null) ids.push(node.id);
      });
      return ids.join('-');
    },
    buildInventorys() {
      return (this.specList || []).map(row => ({
        id: row.id != null && row.id !== '' ? String(row.id) : '',
        sn: String(row.sn ?? ''),
        keyIds: this.getKeyIdsFromSpecValue(row.specValue) || '',
        keyVals: String(row.specValue ?? ''),
        num: String(row.num ?? '')
      }));
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        if (!this.isEdit && !this.productId) {
          this.$message.warning('请先添加至少一组产品规格后再提交');
          return;
        }
        const ids = this.form.categoryIds || [];
        const cateId = ids.length ? String(ids[ids.length - 1]) : '';
        const params = {
          id: this.isEdit ? String(this.editId) : (this.productId || ''),
          title: this.form.title,
          cateId,
          productNo: this.form.productNo,
          registerNo: this.form.registerNo || '',
          registerImage: this.form.registerImage || '',
          licenseImage: this.form.licenseImage || '',
          validity: this.form.validity || '',
          unit: this.form.unit,
          content: this.form.content || '',
          inventorys: JSON.stringify(this.buildInventorys())
        };
        this.$api({ url: '/addProduct', method: 'post', data: params })
          .then(() => {
            this.$message.success(this.isEdit ? '保存成功' : '新增成功');
            this.$router.push('/manager/product/list');
          })
          .catch(err => this.$message.error((err && err.msg) ? err.msg : '提交失败'));
      });
    },
    handleCancel() {
      this.$router.push("/manager/product/list");
    },
    /** 级联收起时把焦点移出下拉层，避免 aria-hidden 与焦点冲突的控制台警告 */
    onCascaderVisibleChange(visible) {
      if (!visible) {
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            const active = document.activeElement;
            const cascaderEl = this.$refs.cascaderRef?.$el;
            if (cascaderEl && active && cascaderEl.contains(active)) {
              active.blur();
            }
          });
        });
      }
    },
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
    width: 260px;
  }

  :deep(.el-form-item__content) {
    text-align: left;
  }
  ::v-deep .el-upload-list__item-thumbnail {
    object-fit: fill;
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
  display: flex;
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
    background: #2373C8 !important;
    border: none;
  }
}
</style>
