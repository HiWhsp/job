<template>

  <div  class="page">
    <div class="header">
      <div class="header-title">
        参数检索
      </div>
      <div class="header-tab">
        <div class="tab-item" v-for="(item, index) in list_tab" :key="index" @click="selectTab = item" :class="item.title == selectTab.title ? 'active' : ''">
              {{ item.title }}
          </div>
      </div>

      <div class="header-content">
        <div class="search-params">
          <div class="param-item">
            <div class="param-label">类型</div>
            <el-select v-model="type" multiple placeholder="请选择(多选)">
              <el-option label="固体" value="固体"></el-option>
              <el-option label="光纤" value="光纤"></el-option>
              <el-option label="气体" value="气体"></el-option>
          </el-select>
          </div>
          <div class="param-item">
            <div class="param-label">模式</div>
            <el-select v-model="mode" placeholder="请选择(多选)">
              <el-option label="请选择(多选)" value=""></el-option>
            </el-select>
          </div>
          <div class="param-item">
            <div class="param-label">波长</div>
            <el-select v-model="wavelength" placeholder="请选择(多选)">
              <el-option label="请选择(多选)" value=""></el-option>
            </el-select>
          </div>
          <div class="param-item">
            <div class="param-label">功率</div>
            <el-select v-model="power" placeholder="请选择(多选)">
              <el-option label="请选择(多选)" value=""></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="search-buttons">
          <el-button type="primary" @click="search" class="search-button">确定</el-button>
          <el-button @click="reset" class="reset-button">重置</el-button>
      </div>
    </div>

    <!-- 内容 -->
    <div class="content">
      <div class="search-result">
        <div class="result-title">搜索结果</div>
        <p>为您找到 {{ totalResults }} 条相关结果</p>
        <div class="tip">左右滑动可查看更多</div>

        <div class="table-container">
          <!-- <el-table :data="tableData" style="width: 100%" :cell-style="cellStyle">
              <el-table-column prop="productCode" label="产品型号" width="180" ></el-table-column>
              <el-table-column prop="centralWavelength" label="中心波长" width="180"></el-table-column>
              <el-table-column prop="outputPower" label="输出功率"></el-table-column>
              <el-table-column prop="pulseEnergy" label="脉冲能量"></el-table-column>
              <el-table-column prop="repetitionRate" label="重复频率"></el-table-column>
              <el-table-column prop="pulseWidth" label="脉冲宽度"></el-table-column>
              <el-table-column prop="beamQuality" label="光束质量"></el-table-column>
              <el-table-column prop="divergenceAngle" label="光束发散角"></el-table-column>
              <el-table-column prop="opticalEfficiency" label="光电效率"></el-table-column>
              <el-table-column prop="divergenceAngle" label="光束发散角"></el-table-column>
              <el-table-column prop="opticalEfficiency" label="光电效率"></el-table-column>
              <el-table-column prop="divergenceAngle" label="光束发散角"></el-table-column>
              <el-table-column prop="opticalEfficiency" label="光电效率"></el-table-column>
              <el-table-column prop="divergenceAngle" label="光束发散角"></el-table-column>
              <el-table-column prop="opticalEfficiency" label="光电效率"></el-table-column>
              <el-table-column prop="divergenceAngle" label="光束发散角"></el-table-column>
              <el-table-column prop="opticalEfficiency" label="光电效率"></el-table-column>
          </el-table> -->

          <el-table
              :data="tableData"
              border
              style="width: 100%"
              :row-class-name="tableRowClassName">
              <el-table-column prop="productCode" label="产品型号" width="180" ></el-table-column>
              <el-table-column prop="centralWavelength" label="中心波长" width="180"></el-table-column>
              <el-table-column prop="outputPower" label="输出功率" width="180"></el-table-column>
              <el-table-column prop="pulseEnergy" label="脉冲能量" width="180"></el-table-column>
              <el-table-column prop="repetitionRate" label="重复频率" width="180"></el-table-column>
              <el-table-column prop="pulseWidth" label="脉冲宽度" width="180"></el-table-column>
              <el-table-column prop="beamQuality" label="光束质量" width="180"></el-table-column>
              <el-table-column prop="divergenceAngle" label="光束发散角" width="180"></el-table-column>
              <el-table-column prop="opticalEfficiency" label="光电直径" width="180"></el-table-column>
              <el-table-column prop="pointingStability" label="指向稳定性" width="180"></el-table-column>
              <el-table-column prop="polarizationState" label="偏振态" width="180"></el-table-column>
              <el-table-column prop="polarizationRatio" label="偏振比" width="180"></el-table-column>
              <el-table-column prop="pulseStability" label="脉冲稳定性" width="180"></el-table-column>
              <el-table-column prop="powerStability" label="功率稳定性" width="180"></el-table-column>
              <el-table-column prop="operatingTemperature" label="工作温度" width="180"></el-table-column>
              <el-table-column prop="powerSupply" label="电源" width="180"></el-table-column>
              <el-table-column prop="powerConsumption" label="耗电量" width="180"></el-table-column>
              <el-table-column prop="externalInterface" label="外部接口" width="180"></el-table-column>
              <el-table-column fixed="right" label="下载/购买" width="230">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small" style="color: #27417C !important;">下载手册</el-button>
                  <el-button type="text" size="small"style="color: #FF7B23 !important;">加入购物车</el-button>
                  <el-button type="text" size="small" style="color: #FF7B23 !important;">立即购买</el-button>
                </template>
              </el-table-column>
            </el-table>
        </div>

        <div class="tip">左右滑动可查看更多</div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      selectTab: { title: "光源-LD模组", status: "1" },

      status: 1,

      list_tab: [
        {title: "光源-LD模组", status: 1},
        {title: "LED光源", status: 2},
        {title: "激光器", status: 3},
        {title: "连续光谱", status: 4}
      ],
      type: [],
      mode: [],
      wavelength: [],
      power: [],

      totalResults: 122,

      tableData: Array.from({length: 10}, (_, i) => (  {
          productCode: 'PINE3-1064-30',
          centralWavelength: '1064nm',
          outputPower: '30W',
          pulseEnergy: '600μJ @ 50kHz',
          repetitionRate: '600μJ @ 50kHz',
          pulseWidth: '<10 ps',
          beamQuality: 'M²<1.3',
          divergenceAngle: '<1.5 mrad',
          opticalEfficiency: '≥90%',
          pointingStability: '2.9 +0.3mm, 1/e?',
          polarizationState: '<50 μrad/°C',
          polarizationRatio: 'Vertical',
          pulseStability: '2100:1',
          powerStability: '≤2% rms',
          operatingTemperature: '20 to 30 "C',
          powerSupply: 'AC 220/110 V',
          powerConsumption: '1000W',
          externalInterface: 'RS232, Ethernet',  
        })),
      // tableData: [
      //   {
      //     productCode: 'PINE3-1064-30',
      //     centralWavelength: '1064nm',
      //     outputPower: '30W',
      //     pulseEnergy: '600μJ @ 50kHz',
      //     repetitionRate: '600μJ @ 50kHz',
      //     pulseWidth: '<10 ps',
      //     beamQuality: 'M²<1.3',
      //     divergenceAngle: '<1.5 mrad',
      //     opticalEfficiency: '≥90%'
      //   },
      // ]
    }
  },
  methods: {
    search() {
      // 实现搜索逻辑
    },
    reset() {
      this.type = [];
      this.mode = [];
      this.wavelength = [];
      this.power = [];
    },
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
    }
  }
};

</script>


<style lang="less" scoped>
.page{
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
  background: #F4F4F6;

  ::v-deep .el-table {
    thead {
      tr {
        th {
          background-color: #E3E6E9 !important;
          color: #333333;
        }
      }
    }
  }

  ::v-deep .el-table .even-row {
    background: #FFFFFF !important;
  }
  ::v-deep .el-table .odd-row {
    background: #F4F4F6 !important;
  }


  .header{
    background: linear-gradient( 180deg, #1F2132 0%, rgba(33,36,51,0) 100%);
    height: 600px;
    width: 100%;

    .header-title{
      font-weight: bold;
      font-size: 36px;
      color: #FFFFFF;
      text-align: center;
      margin-top: 67px;
      margin-bottom: 41px;
    }

    .header-tab{
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;

      .tab-item{
          width: 173px;
          height: 56px;
          cursor: pointer;
          font-weight: 400;
          font-size: 18px;
          color: #FFFFFF;
          display: flex;
          justify-content: center;
          align-items: center;


          &.active {
            font-weight: bold;
            font-size: 18px;
            color: #FFFFFF;
            background: #27417C;
          }
      }
    }

    .header-content{
      display: flex;
      justify-content: center;
      align-items: center;

      .search-params {
        width: 1400px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 41px;
        border-top: 2px solid #FFFFFF;

        .param-item {
          display: flex;
          flex-direction: column;
          width: 22%;

          .param-label {
            margin-top: 41px;
            margin-bottom: 10px;
            font-size: 16px;
            color: #FFFFFF;
          }
        }
      }
    }
    .search-buttons {
        display: flex;
        justify-content: center;
        align-items: center;

        .search-button{
          font-weight: 400;
          font-size: 18px;
          color: #FFFFFF;
          line-height: 25px;
          text-align: center;
          width: 187px;
          height: 50px;
          background: #27417C;
          border-radius: 0px 20px 0px 20px;
          margin: 0 22px;
        }

        .reset-button{
          font-weight: 400;
          font-size: 18px;
          color: #808080;
          line-height: 25px;
          text-align: center;
          width: 187px;
          height: 50px;
          background: #FFFFFF;
          border-radius: 0px 20px 0px 20px;
          margin: 0 22px;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  
    margin-top: -100px; // 调整这个值以使内容部分与header重叠

    .search-result {
      width: 1414px;
      background: #FFFFFF;
      box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.08);
      border-radius: 8px 8px 8px 8px;
 
      .result-title {
        font-weight: bold;
        font-size: 36px;
        color: #333333;
        text-align: center;
        margin-top: 40px;
      }

      p {
        font-weight: 400;
        font-size: 16px;
        color: #52565A;
        margin-top: 14px;
        text-align: center;
      }

      .tip{
        font-weight: 400;
        font-size: 16px;
        color: #27417C;
        margin-left: 26px;
        margin-bottom: 21px;
        margin-top: 15px;
      }

      .table-container {
        overflow-x: auto;
        width: 100%;
        padding: 0 25px;


      }

        // ::v-deep .el-table__header-wrapper {
        //   th {
        //     background-color: #f5f7fa;
        //     color: #606266;
        //     font-weight: bold;
        //     text-align: center;
        //     padding: 12px 8px;
        //   }
        // }

        // ::v-deep .el-table__body-wrapper {
        //   td {
        //     padding: 12px 8px;
        //   }
        // }

      
    }
  }

}
</style>