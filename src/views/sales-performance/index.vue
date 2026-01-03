<template>
  <div class="page">
    <div class="main-title flex">
      <img src="@img/my/nav-7.png" alt="" />
      <span>销售业绩</span>
    </div>

    <div class="page_box">
     <div class="page_btns">
      <div class="btns" @click="handle_sqtx">
        <img src="../../assets/img/sales/sq.png" alt="">
        申请提现
      </div>
     </div>
     <div class="page_top">
      <div class="lefts">
        <div class="left_box">
          <div class="left_text">
            <img src="../../assets/img/sales/yj.png" alt="">
            <div>
              销售总业绩
            </div>
          </div>
          <div class="left_num">
            {{ price_z }}
          </div>
        </div>
        <div class="left_bor"></div>
         <div class="left_box">
          <div class="left_text">
            <img src="../../assets/img/sales/tc.png" alt="">
            提成总额
          </div>
          <div class="left_num">
            {{ price_tc }}
          </div>
        </div>
        <div class="left_bor"></div>
         <div class="left_box">
          <div class="left_text">
            <img src="../../assets/img/sales/dd.png" alt="">
            订单总数
          </div>
          <div class="left_num">
            {{ order_num }}
          </div>
        </div>
      </div>
      <div class="rights">
        <div class="right_text" @click="handle_yjxy">
          《佣金提成规则及操作指令》
        </div>
      </div>
     </div>
     <div class="page_bom">
      <div class="list_title">
        <div class="tab1">客户名称</div>
        <div class="tab2">成单时间</div>
        <div class="tab3">成单金额</div>
        <div class="tab4">提成金额</div>
      </div>
      <div class="list_item">
        <div class="item" v-for="(item,index) in lists" :key="index">
          <div class="tab1">{{ item.nickname }}</div>
          <div class="tab2">{{ item.orderTime }}</div>
          <div class="tab3">{{ item.orderPrice }}</div>
          <div class="tab4">{{ item.commissionPrice }}</div>
        </div>
      </div>
     </div>
     <div class="page_pages">
       <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="pages.page" :page-size="pages.pageNum" layout="total, prev, pager, next" :total="total">
      </el-pagination>
     </div>
    </div>



     <el-dialog title="提现申请" :visible.sync="sqtx_show" width="780px" :before-close="handleClose">
       <div class="dia_box">
        <div class="form_flex">
          <div class="title">提现金额</div>
          <div class="inputs">
            <input type="number" class="input_input" v-model.number="tx_price" placeholder="不超过提成总额" @blur="handle_blur">
            <!-- <div class="input_text">可提现金额15000</div> -->
          </div>
          <div class="texts">手续费约￥{{ sxf }}</div>
        </div>
        <div class="form_flex">
          <div class="title"></div>
          <div class="inputs">
            <div class="input_text">可提现金额{{ commission }}</div>
          </div>
          <div class="texts"></div>
        </div>
        <div class="form_flex">
          <div class="title">姓名</div>
          <div class="inputs">
            <input type="text" class="input_input" v-model="realName">
          </div>
          <div class="texts"></div>
        </div>
        <div class="form_flex">
          <div class="title">身份证号</div>
          <div class="inputs">
            <input type="text" class="input_input" v-model="identityId">
          </div>
          <div class="texts"></div>
        </div>
        <div class="flex_btn">
          <div class="btns" @click="handle_tx_end">提交</div>
        </div>
        <div class="btn_text">
          提现审核通过后，我们将为您线下打款，付款后余额会自动更新，请及时核对！
        </div>
       </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "sales-performance",
  data() {
    return {
        price_z:0,
        price_tc:0,
        order_num:0,
        lists:[],
        total:0,
        pages:{
          page:1,
          pageNum:10,
        },
        sqtx_show:false,
        commission:0,
        tixianBili:0,
        tx_price:0,
        realName:'',
        identityId:'',
       
    };
  },
  computed:{
    sxf(){
      let price=0
      if(this.tx_price&&this.tixianBili){
        price=(Number(this.tx_price)*Number(this.tixianBili)).toFixed(2)
      }
      
      return price
    },
  },
  created() {
    this.get_lists();
    this.get_user()
    this.get_setting()
  },
  methods: {
    handle_yjxy(){
      this.$router.push({
        path:'/terms',
        query:{
          id:'144',
        }
      })
    },
    handle_blur(){
      if(this.tx_price>this.commission){
        this.tx_price=this.commission
      }else if(this.tx_price<0){
        this.tx_price=0
      }
    },
    handle_tx_end(){
      if(this.tx_price==0){
        this.$message.error('提现金额不能为0');
        return
      }
      if(!this.realName){
        this.$message.error('请输入姓名');
        return
      }
      if(!this.identityId){
        this.$message.error('请输入身份证号');
        return
      }

       this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "commission_tixian",
          money:this.tx_price,
          realName:this.realName,
          identityId:this.identityId,
          type:'0',
        },
      }).then((res) => {
        if (res.code == 200) {
           this.$message({
              message: '申请成功',
              type: 'success'
            });
            this.sqtx_show=false
            this.tx_price=0
            this.realName=''
            this.identityId=''
          this.get_user()
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    handleSizeChange(e){

    },
    handleCurrentChange(e){
      this.pages.page=e
      this.get_lists()
    },
    get_lists() {
      // 这里应该调用API获取销售数据
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userPerformance",
          ...this.pages,
        },
      }).then((res) => {
        if (res.code == 200) {
          console.log('列表',res)
          this.price_tc=res.data.totalCommissionPrice
          this.price_z=res.data.totalOrderPrice
          this.order_num=res.data.totalCount
          this.lists=res.data.list
          this.total=res.data.count
        }
      });
    },
    handle_sqtx(){
      this.sqtx_show=true
    },
    handleClose(){
      this.sqtx_show=false
    },
    get_user(){
      // 
       this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo",
        },
      }).then((res) => {
        if (res.code == 200) {
          console.log('用户',res)
          this.commission=res.data.commission
        }
      });

    },
    get_setting(){
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "index_config",
        },
      }).then((res) => {
        if (res.code == 200) {
          console.log('用户',res)
          this.tixianBili=res.data.tixianBili
        }
      });
    },
  }
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px; 

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    img {
      width: 22px;
      margin-right: 10px;
    }
  }
  .page_box{
    width: 100%;
    height: 826px;
    background: #FFFFFF;
    border-radius: 0px 0px 0px 0px;
    margin-top: 12px;   
    padding: 21px 76px 83px 77px;
    .page_btns{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .btns{
        width: 147px;
        height: 40px;
        border: 1px solid #7853B2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 31px 0px 17px;
        font-weight: 400;
        font-size: 16px;
        color: #7853B2;
        cursor: pointer;
        border-radius: 5px;
        img{
          width: 16px;
        }
        &:hover{
          background-color: #7853B2;
          color: #ffffff;
        }
      }
    }
    .page_top{
      width: 100%;
      height: 115px;
      background: url('../../assets/img/sales/sales_bg.png');
      background-size: 100%;
      margin-top:21px;
      padding: 24px 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .lefts{
        display: flex;
        align-items: center;
        width: 50%;
        height: 100%;
        justify-content: space-between;
        .left_box{
          .left_text{
            display: flex;
            align-items: center;
            font-weight: 400;
            font-size: 16px;
            color: #FFFFFF;
            img{
              width: 13px;
              margin-right:5px;
              margin-top: 4px;
            }
          }
          .left_num{
            font-weight: bold;
            font-size: 22px;
            color: #FFFFFF;
          }
        }
        .left_bor{
          width: 0px;
          height: 47px;
          border: 1px solid #FFFFFF;
        }
      }
      .rights{
        display: flex;
        align-items: flex-end;
        height: 100%;

        .right_text{
          font-weight: 400;
          font-size: 18px;
          color: #FFFFFF;
          cursor: pointer;
        }
      }
    }

    .page_bom{
      margin-top: 28px;
      .tab1{
        padding-left: 77px;
        width: 355px;
      }
      .tab2{
        width: 236px;

      }
      .tab3{
        width: 280px;
      }
      .tab4{
        width: 280px;
      }
      .list_title{
        width: 1154px;
        height: 48px;
        background: #F9F9F9;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid #CCCCCC;
        display: flex;
        align-items: center;
        .tab1{
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
        .tab2{
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
        .tab3{
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
        .tab4{
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
      }
      .list_item{
        border-left: 1px solid #CCCCCC;
        border-right: 1px solid #CCCCCC;
        // border-bottom: 1px solid #CCCCCC;
        .item{
          display: flex;
          align-items: center;
          height: 96px;
          border-bottom: 1px solid #CCCCCC;
          .tab1{
            font-weight: 400;
            font-size: 14px;
            color: #333333;

          }
          .tab2{
            font-weight: 400;
            font-size: 14px;
            color: #333333;
          }
          .tab3{
            font-weight: 400;
            font-size: 14px;
            color: #333333;
          }
          .tab4{
            font-weight: 400;
            font-size: 14px;
            color: #333333;
          }

        }
      }
  
  
    }
    .page_pages{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-top: 20px;
    }


  }
  .dia_box{
    .form_flex{
      display: flex;
      align-items: center;
      // justify-content: space-between;
      .title{
        font-weight: 400;
        font-size: 16px;
        color: #1F1F1F;
        width: 140px;
        text-align: right;
      }
      .inputs{
        padding-left: 16px;
        margin-bottom: 9px;
        .input_input{
          width: 400px;
          height: 48px;
          background: #FFFFFF;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #D4D4D4;
          padding: 0 15px;
        }
        .input_text{
          width: 400px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #7853B2;
          text-align: right;
          margin-bottom: 9px;
        }
      }
      .texts{
        font-weight: 400;
        font-size: 16px;
        color: #505050;
        padding-left: 18px;
      }
    }
    .flex_btn{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 50px;
      .btns{
        cursor: pointer;
        width: 191px;
        height: 46px;
        background: #7853B2;
        border-radius: 4px 4px 4px 4px;
        font-weight: 400;
        font-size: 18px;
        color: #FFFFFF;
        text-align: center;
        line-height: 46px;
      }
    }
    .btn_text{
      text-align: center;
      font-weight: 400;
      font-size: 14px;
      color: #1F1F1F;
      margin-top: 32px;
    }
  }
}
</style>










