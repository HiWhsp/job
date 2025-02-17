<script>
export default {
  name: "createGroup",
  data() {
    return {
      createVisible: false,
      realForm: {},
      realRules: {
        sn: [
          {required: true, message: '请输入团体编号', trigger: 'blur'},
        ],
        title: [
          {required: true, message: '请输入团体名称', trigger: 'blur'},
        ],
        unit_name: [
          {required: true, message: '请输入所在高校/单位', trigger: 'blur'},
        ],
        leader: [
          {required: true, message: '请输入团体负责人', trigger: 'blur'},
        ],
        tel: [
          {required: true, message: '请输入负责人电话', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api({
            url: 'create_team',
            method: 'post',
            data: this.realForm
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '创建成功',
              })
              this.createVisible = false
            }
          })
        }
      })
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="section-title">
      <div class="label">我的团体</div>
    </div>
    <div class="content">
      <p class="title">团体权益</p>
      <div class="list">
        <div class="item" v-for="item in 10" :key="item">
          <img :src="require(`@/assets/img/my/group/${item}.png`)" alt="">
          <span class="text">免费试样-临时</span>
          <span class="desc">这里是二级文案</span>
        </div>
      </div>
    </div>
    <div class="btn" @click="createVisible = true">新建团体</div>

    <!--    实名认证-->
    <el-dialog title="新建团体" :visible.sync="createVisible" center width="950px">
      <div class="real-content">
        <el-form :model="realForm" :rules="realRules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
          <el-form-item label="团体编号：" prop="sn">
            <el-input v-model="realForm.sn" placeholder="请输入团体编号"></el-input>
          </el-form-item>
          <el-form-item label="*团体名称：" prop="title">
            <el-input v-model="realForm.title" placeholder="请输入团体名称"></el-input>
          </el-form-item>
          <el-form-item label="所在高校/单位：" prop="unit_name">
            <el-input placeholder="请输入所在高校/单位" v-model="realForm.unit_name"></el-input>
          </el-form-item>
          <el-form-item label="团体负责人：" prop="leader">
            <el-input placeholder="请输入团体负责人" v-model="realForm.leader"></el-input>
          </el-form-item>
          <el-form-item label="负责人电话：" prop="tel">
            <el-input placeholder="请输入负责人电话" v-model="realForm.tel"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
         <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.container {
  background-color: #fff;
  padding: 0 0 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.section-title {
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

.content {
  margin-top: 50px;

  .title {
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    color: #282828;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 50px;

    .item {
      width: 120px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 80px;
      margin-bottom: 50px;

      img {
        width: 100px;
        height: 100px;
      }

      .text {
        font-weight: bold;
        font-size: 18px;
        color: #333333;
      }

      .desc {
        margin-top: 15px;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }
    }
  }
}

.btn {
  width: 133px;
  height: 40px;
  line-height: 40px;
  background: #00479D;
  border-radius: 3px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}
</style>
