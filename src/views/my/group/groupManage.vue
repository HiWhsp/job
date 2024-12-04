<script>
export default {
  name: "groupManage",
  data() {
    return {
      group: {},
      members: [],
      list_shopcart: [{}], // 购物车商品列表
      realForm: {},
      realRules: {
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ]
      },
      pagination: {
        page: 1,
        limit: 5,
      },
      count: 0,
      currentTab: "allMembers",
      checked_all: false, // 是否全选
      createVisible: false,
    }
  },
  watch: {
    currentTab() {
      this.getList();
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      // 获取团体信息
      this.$api({
        url: 'my_team',
        method: 'post',
      }).then(res => {
        let {code, data} = res;
        if (code === 200) {
          this.group = res.data
        }
      })
      this.getList();
    },
    getList() {
      this.$api({
        url: 'team_user_list',
        method: 'post',
        data: {
          status: this.currentTab == 'allMembers' ? 0 : 1,
          ...this.pagination
        }
      }).then(res => {
        let {code, data} = res;
        if (code === 200) {
          this.members = res.data;
          this.members.forEach((v) => {
            v.user_id = v.user.id
            v.user_name = v.user.name
            v.user_phone = v.user.phone
            v.unit_name = v.user.unit_name
            v.unit_group = v.user.unit_group
          })
        }
      })
    },
    editMember(index) {
      alert(`编辑成员：${this.members[index].name}`);
    },
    // 删除成员
    deleteMember(row) {
      this.$confirm('确定要删除该成员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api({
          url: 'team_user_audit',
          method: 'post',
          data: {
            id: row.user_id,
            action: 4
          }
        }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
      });
    },
    //商品勾选 单项选择
    on_change_checked_item() {
      // //console.log('监视单项选择', item)
      let checkLength = this.list_shopcart_checked.length;
      if (checkLength == this.list_shopcart.length) {
        this.checked_all = true;
      } else {
        this.checked_all = false;
      }
    },
    //商品勾选 全选与取消
    on_change_checked_all(val) {
      //console.log("更新后的值", val);
      this.list_shopcart.forEach((v) => {
        v.checked = val;
      });
    },
    do_cart_set_row() {
      this.createVisible = true
    }
  },
}
</script>

<template>
  <div class="section-order">
    <div class="section-title">
      <div class="label">团体管理</div>
      <div class="search">
        <el-input placeholder="请输入负责人手机号/邮箱/团号/完整的团体名称">
          <template slot="append">搜索</template>
        </el-input>
      </div>
    </div>

    <!-- 团体信息部分 -->
    <div class="group-info">
      <h3>团体信息</h3>
      <div class="info">
        <p>团体名称：{{ group.title }}</p>
        <p>团体编号：{{ group.sn }}</p>
        <p>所在高校/单位：{{ baseInfo.unit_group }}</p>
        <p>团体负责人：{{ group.leader }}</p>
        <p>负责人电话：{{ group.tel }}</p>
        <p>团体成员数：{{ group.teamer_no }}</p>
      </div>
    </div>

    <!-- 团队管理部分 -->
    <div class="group-management">
      <div class="top-box">
        <h3>团队管理</h3>
        <div class="tabs">
          <div @click="currentTab = 'allMembers'" :class="{ active: currentTab === 'allMembers' }">全部成员</div>
          <div @click="currentTab = 'pending'" :class="{ active: currentTab === 'pending' }">待审批</div>
        </div>
        <div class="btn-wrap">
          <el-button type="primary" v-if="currentTab !== 'allMembers'">添加成员</el-button>
          <el-button type="primary" v-if="currentTab !== 'allMembers'">批量导入</el-button>
        </div>
      </div>

      <el-table :data="members" style="width: 100%" v-if="currentTab === 'allMembers'">
        <el-table-column prop="user_name" label="姓名"></el-table-column>
        <el-table-column prop="unit_group" label="所属高校/单位" width="120"></el-table-column>
        <el-table-column prop="user_phone" label="联系方式"></el-table-column>
        <el-table-column prop="t_role" label="成员身份">
          <template slot-scope="scope">
            <span v-if="scope.row.t_role == 0">成员</span>
            <span v-if="scope.row.t_role == 1">管理员</span>
          </template>
        </el-table-column>
        <el-table-column prop="pay_money" label="预存支付总金额"></el-table-column>
        <el-table-column prop="credit_money" label="信用支付总金额"></el-table-column>
        <el-table-column prop="status_txt" label="审批状态"></el-table-column>
        <el-table-column prop="address" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="do_cart_set_row(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteMember(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="list cart-list" v-else>
        <div class="cart-list-inner">
          <!-- 标题 -->
          <div class="list-title">
            <el-checkbox
                class="title-1"
                v-model="checked_all"
                @change="on_change_checked_all"
            >{{ checked_all ? "反选" : "全选" }}
            </el-checkbox>
            <div class="title-2" style="text-align: left; padding-left: 0px">
              姓名
            </div>
            <div class="title-4">所属高校/单位</div>
            <div class="title-5">联系方式</div>
            <div class="title-6">审批状态</div>
            <div class="title-6">操作</div>
          </div>

          <!-- 商品列表 -->
          <div
              class="item"
              v-for="(item, index) in list_shopcart"
              :key="index"
          >
            <div class="item-detail flex">
              <div class="box-select">
                <el-checkbox
                    v-model="item.checked"
                    @change="on_change_checked_item"
                ></el-checkbox>
              </div>
              <div class="box-image cover">
                1
              </div>
              <div class="box-title">
                1
              </div>
              <div class="box-unit-price">
                1
              </div>
              <div class="box-subtotal">
                1
              </div>
              <div class="box-act">
                <div class="goods-action-box">
                  <span class="goods-action pointer" @click="do_cart_set_row(item.inventoryId)">设置</span>
                </div>
              </div>
            </div>
          </div>

          <el-empty
              v-if="!list_shopcart.length"
              description="暂无数据..."
          ></el-empty>
        </div>
      </div>
    </div>

    <el-dialog title="设置" :visible.sync="createVisible" center width="700px">
      <div class="real-content">
        <el-form :model="realForm" :rules="realRules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
          <el-form-item label="成员身份：" prop="name">
            <el-radio-group v-model="realForm.radio">
              <el-radio :label="3">备选项</el-radio>
              <el-radio :label="6">备选项</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="*是否限制：" prop="name">
            <el-radio-group v-model="realForm.radio">
              <el-radio :label="3">备选项</el-radio>
              <el-radio :label="6">备选项</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="单笔支付限额：" prop="name" v-if="realForm.radio === 3">
            <el-input placeholder="请输入单笔支付限额" v-model="realForm.name"></el-input>
          </el-form-item>
          <el-form-item label="月支付限额：" prop="name" v-if="realForm.radio === 3">
            <el-input placeholder="请输入月支付限额" v-model="realForm.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
         <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="createVisible">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.section-order {
}

.section-title {
  background: #fff;

  border-bottom: 1px solid #dedede;
  .flex-between();
  height: 56px;
  padding: 0 32px;

  .label {
    font-size: 18px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    color: #333333;
  }

  .search {
    width: 400px;

    .el-input {
      border: 1px solid #00479D;
    }

    /deep/ .el-input__inner {
      border-radius: 0;
      border: none;
    }

    /deep/ .el-input-group__append {
      cursor: pointer;
      background: #00479D;
      color: #fff;
      border-radius: 0;
      border: none;
    }
  }
}

.group-info,
.group-management {
  border-radius: 4px;
  padding: 25px 50px;
  background-color: #fff;
  margin-top: 10px;

  h3 {
    width: 98px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: rgba(51, 153, 255, 0.15);
    font-weight: 400;
    font-size: 16px;
    color: #000000;
    margin-bottom: 40px;
  }

  .info {
    display: grid;
    grid-template-columns: repeat(3, 1fr); // Two columns
    gap: 12px;

    p {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }
  }
}

.group-management {
  .top-box {
    display: flex;
    justify-content: space-between;

    .btn-wrap {
      display: flex;
      width: 250px;

      .el-button {
        margin-left: 10px;
        width: 115px;
        height: 29px;
        padding: 0;
        line-height: 29px;
        background: #00479D;
        border-radius: 4px 4px 4px 4px;
        border: none;
      }
    }
  }

  .tabs {
    display: flex;
    font-weight: 400;
    font-size: 16px;
    color: #333333;
    cursor: pointer;

    .active {
      color: #00479D;

      &:after {
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background: #00479D;
        margin-top: 10px;
      }
    }

    div {
      margin-right: 50px;
    }
  }

  .list {
    border-bottom: 1px solid #e6e4e1;

    .list-title {
      //text-align: center;
      color: #333;
      background: #f5f5f5;
      padding: 11px 0;
      font-size: 14px;

      .flex();
      border-radius: 4px;

      .title-1 {
        width: 115px;
        text-align: center;
      }

      .title-2 {
        // width: 150px;
        flex: 2;
      }

      .title-3 {
        width: 200px;
      }

      .title-4 {
        width: 200px;
      }

      .title-5 {
        width: 200px;
      }

      .title-6 {
        width: 200px;
      }

      .title-7 {
        width: 200px;
      }
    }

    .item {
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      .item-title {
        .flex();
        text-align: left;
        padding: 12px 40px;
        border-bottom: 1px solid #eee;

        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
      }

      .item-detail {
        padding: 15px 0;
        font-size: 14px;
        color: #666666;

        .box-select {
          width: 115px;
          padding-left: 30px;
        }

        .box-image {
          flex: 2;
        }

        .box-title {
          width: 200px;
        }

        .box-sku {
          width: 200px;
        }

        .box-unit-price {
          width: 200px;
          color: #ff0000;
        }

        .box-number {
          width: 200px;
        }

        .box-subtotal {
          width: 200px;
          color: #fc0d1b;
        }

        .box-act {
          width: 200px;
          font-size: 16px;
        }
      }
    }
  }

  /deep/ .el-table th.el-table__cell {
    background-color: #D9D9D9;
    color: #333333;
  }
}
</style>
