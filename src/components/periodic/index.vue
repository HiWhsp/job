<template>
  <div class="body">
    <!--    区分-->
    <div class="filter">
      <div class="yes">可以选择</div>
      <div class="no">不可选择</div>
    </div>
    <!-- 上面按列来布局 -->
    <div class="element-top">
      <div v-for="column in topColumn" :key="column.name" class="column">
        <!--        <div class="column-title">{{ column.name }}</div>-->
        <div
            v-for="element in column.elementArr"
            :key="element.seq"
            class="base-element column-element color-bottom"
            :class="{ 'isSelect': element.isSelect, 'isActive': element.isActive }"
            @click="handleClickElement(element)"
        >
          <p class="text">
            <span>{{ element['mc'] }}</span>
          </p>
          <span class="name">{{ element['name'] }}</span>
          <span class="electron">{{ element['electron'] }}</span>
          <div class="seq">{{ element.seq }}</div>
        </div>
      </div>
    </div>
    <!-- 下面的盒子 -->
    <div class="element-bottom">
      <div class="line">
        <div
            v-for="element in LaColumn"
            :key="element.seq"
            class="base-element line-element color-bottom"
            :class="{ 'isSelect': element.isSelect, 'isActive': element.isActive }"
            @click="handleClickElement(element)"
        >
          <p class="text">
            <span>{{ element['mc'] }}</span>
          </p>
          <span class="name">{{ element['name'] }}</span>
          <span class="electron">{{ element['electron'] }}</span>
          <div class="seq">{{ element.seq }}</div>
        </div>
      </div>

      <div class="line">
        <div
            v-for="element in AcColumn"
            :key="element.seq"
            class="base-element line-element color-bottom"
            :class="{ 'isSelect': element.isSelect, 'isActive': element.isActive }"
            @click="handleClickElement(element)"
        >
          <p class="text">
            <span>{{ element['mc'] }}</span>
          </p>
          <span class="name">{{ element['name'] }}</span>
          <span class="electron">{{ element['electron'] }}</span>
          <div class="seq">{{ element.seq }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "periodic",
  props: {
    elementList: {
      type: Array,
      default: () => []
    },
    selectElementList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      topColumn: [
        {
          name: 'ⅠA',
          elementArr: [
            {"name": "H", "mc": "氢", "seq": 1, "electron": "1s¹", "color": 7},
            {"name": "Li", "mc": "锂", "seq": 3, "electron": "2s¹", "color": 1},
            {"name": "Na", "mc": "钠", "seq": 11, "electron": "3s¹", "color": 1},
            {"name": "K", "mc": "钾", "seq": 19, "electron": "4s¹", "color": 1},
            {"name": "Rb", "mc": "铷", "seq": 37, "electron": "5s¹", "color": 1},
            {"name": "CS", "mc": "铯", "seq": 55, "electron": "6s¹", "color": 1},
            {"name": "Fr", "mc": "钫", "seq": 87, "electron": "7s¹", "color": 1}
          ],
        },
        {
          name: 'ⅡA',
          elementArr: [
            {"name": "Be", "mc": "铍", "seq": 4, "electron": "2s²", "color": 2},
            {"name": "Mg", "mc": "镁", "seq": 12, "electron": "3s²", "color": 2},
            {"name": "Ca", "mc": "钙", "seq": 20, "electron": "4s²", "color": 2},
            {"name": "Sr", "mc": "锶", "seq": 38, "electron": "5s²", "color": 2},
            {"name": "Ba", "mc": "钡", "seq": 56, "electron": "6s²", "color": 2},
            {"name": "Ra", "mc": "镭", "seq": 88, "electron": "7s²", "color": 2}
          ],
        },
        {
          name: 'ⅢB',
          elementArr: [
            {name: 'Sc', mc: '钪', seq: 21, "electron": "3d¹4s²", color: 3},
            {name: 'Y', mc: '钇', seq: 39, "electron": "4d¹5s²", color: 3},
            {name: '', mc: '镧系', seq: '57-71', "electron": "", color: 'bottom'},
            {name: '', mc: '锕系', seq: '89-103', "electron": "", color: 'bottom'},
          ],
        },
        {
          name: 'ⅣB',
          elementArr: [
            {"name": "Ti", "mc": "钛", "seq": 22, "electron": "3d²4s²", "color": 3},
            {"name": "Zr", "mc": "锆", "seq": 40, "electron": "4d²5s²", "color": 3},
            {"name": "Hf", "mc": "铪", "seq": 72, "electron": "5d²6s²", "color": 3},
            {"name": "Rf", "mc": "鑪", "seq": 104, "electron": "6d²7s²", "color": 3}
          ],
        },
        {
          name: 'ⅤB',
          elementArr: [
            {"name": "V", "mc": "钒", "seq": 23, "electron": "3d³4s²", "color": 3},
            {"name": "Nb", "mc": "铌", "seq": 41, "electron": "4d⁴5s¹", "color": 3},
            {"name": "Ta", "mc": "钽", "seq": 73, "electron": "5d³6s²", "color": 3},
            {"name": "Db", "mc": "𨧀", "seq": 105, "electron": "6d²7s²", "color": 3}
          ],
        },
        {
          name: 'ⅥB',
          elementArr: [
            {"name": "Cr", "mc": "铬", "seq": 24, "electron": "3d⁵4s¹", "color": 3},
            {"name": "Mo", "mc": "钼", "seq": 42, "electron": "4d⁵5s¹", "color": 3},
            {"name": "W", "mc": "钨", "seq": 74, "electron": "5d⁴6s²", "color": 3},
            {"name": "Sg", "mc": "𨭎", "seq": 106, "electron": "6d²7s²", "color": 3}
          ],
        },
        {
          name: 'ⅦB',
          elementArr: [
            {"name": "Mn", "mc": "锰", "seq": 25, "electron": "3d⁵4s²", "color": 3},
            {"name": "Tc", "mc": "锝", "seq": 43, "electron": "4d⁵5s²", "color": 3},
            {"name": "Re", "mc": "铼", "seq": 75, "electron": "5d⁵6s²", "color": 3},
            {"name": "Bh", "mc": "𨨏", "seq": 107, "electron": "6d²7s²", "color": 3}
          ],
        },
        {
          name: 'f',
          elementArr: [
            {"name": "Fe", "mc": "铁", "seq": 26, "electron": "3d⁶4s²", "color": 3},
            {"name": "Ru", "mc": "钌", "seq": 44, "electron": "4d⁷5s¹", "color": 3},
            {"name": "Os", "mc": "锇", "seq": 76, "electron": "5d⁶6s²", "color": 3},
            {"name": "Hs", "mc": "𨭆", "seq": 108, "electron": "6d²7s²", "color": 3}
          ],
        },
        {
          name: 'c',
          elementArr: [
            {"name": "Co", "mc": "钴", "seq": 27, "electron": "3d⁷4s²", "color": 3},
            {"name": "Rh", "mc": "铑", "seq": 45, "electron": "4d⁸5s¹", "color": 3},
            {"name": "Ir", "mc": "铱", "seq": 77, "electron": "5d⁷6s²", "color": 3},
            {"name": "Mt", "mc": "䥑", "seq": 109, "electron": "6d²7s²", "color": 3}
          ],
        },
        {
          name: 'n',
          elementArr: [
            {"name": "Ni", "mc": "镍", "seq": 28, "electron": "3d⁸4s²", "color": 3},
            {"name": "Pd", "mc": "钯", "seq": 46, "electron": "4d¹⁰", "color": 3},
            {"name": "Pt", "mc": "铂", "seq": 78, "electron": "5d⁹6s¹", "color": 3},
            {"name": "Ds", "mc": "鐽", "seq": 110, "electron": "6d²7s²", "color": 3}
          ],
        },
        {
          name: 'ⅠB',
          elementArr: [
            {"name": "Cu", "mc": "铜", "seq": 29, "electron": "3d¹⁰4s¹", "color": 3},
            {"name": "Ag", "mc": "银", "seq": 47, "electron": "4d¹⁰5s¹", "color": 3},
            {"name": "Au", "mc": "金", "seq": 79, "electron": "5d¹⁰6s¹", "color": 3},
            {"name": "Rg", "mc": "鈩", "seq": 111, "electron": "6d²7s²", "color": 3}
          ],
        },
        {
          name: 'ⅡB',
          elementArr: [
            {"name": "Zn", "mc": "锌", "seq": 30, "electron": "3d¹⁰4s²", "color": 3},
            {"name": "Cd", "mc": "镉", "seq": 48, "electron": "4d¹⁰5s²", "color": 3},
            {"name": "Hg", "mc": "汞", "seq": 80, "electron": "5d¹⁰6s²", "color": 3},
            {"name": "鿔", "mc": "Cn", "seq": 112, "electron": "", "color": 3},
          ],
        },
        {
          name: 'ⅢA',
          elementArr: [
            {"name": "B", "mc": "硼", "seq": 5, "electron": "2s²2p¹", "color": 4},
            {"name": "Al", "mc": "铝", "seq": 13, "electron": "3s²3p¹", "color": 4},
            {"name": "Ga", "mc": "镓", "seq": 31, "electron": "4s²4p¹", "color": 4},
            {"name": "In", "mc": "铟", "seq": 49, "electron": "5s²5p¹", "color": 4},
            {"name": "Tl", "mc": "铊", "seq": 81, "electron": "6s²6p¹", "color": 4},
            {"name": "鿭", "mc": "Nh", "seq": 113, "electron": "", "color": 4},
          ],
        },
        {
          name: 'ⅣA',
          elementArr: [
            {"name": "C", "mc": "碳", "seq": 6, "electron": "2s²2p²", "color": 7},
            {"name": "Si", "mc": "硅", "seq": 14, "electron": "3s²3p²", "color": 4},
            {"name": "Ge", "mc": "锗", "seq": 32, "electron": "4s²4p²", "color": 4},
            {"name": "Sn", "mc": "锡", "seq": 50, "electron": "5s²5p²", "color": 3},
            {"name": "Pb", "mc": "铅", "seq": 82, "electron": "6s²6p²", "color": 3},
            {"name": "𫓧", "mc": "Fl", "seq": 114, "electron": "", "color": 5}
          ],
        },
        {
          name: 'ⅤA',
          elementArr: [
            {"name": "N", "mc": "氮", "seq": 7, "electron": "2s²2p³", "color": 7},
            {"name": "P", "mc": "磷", "seq": 15, "electron": "3s²3p³", "color": 7},
            {"name": "As", "mc": "砷", "seq": 33, "electron": "4s²4p³", "color": 4},
            {"name": "Sb", "mc": "锑", "seq": 51, "electron": "5s²5p³", "color": 4},
            {"name": "Bi", "mc": "铋", "seq": 83, "electron": "6s²6p³", "color": 3},
            {"name": "镆", "mc": "Mc", "seq": 115, "electron": "", "color": 5}
          ],
        },
        {
          name: 'ⅥA',
          elementArr: [
            {"name": "O", "mc": "氧", "seq": 8, "electron": "2s²2p⁴", "color": 7},
            {"name": "S", "mc": "硫", "seq": 16, "electron": "3s²3p⁴", "color": 7},
            {"name": "Se", "mc": "硒", "seq": 34, "electron": "4s²4p⁴", "color": 7},
            {"name": "Te", "mc": "碲", "seq": 52, "electron": "5s²5p⁴", "color": 4},
            {"name": "Po", "mc": "钋", "seq": 84, "electron": "6s²6p⁴", "color": 4},
            {"name": "鿬", "mc": "Lv", "seq": 116, "electron": "", "color": 5},
          ],
        },
        {
          name: 'ⅦA',
          elementArr: [
            {"name": "F", "mc": "氟", "seq": 9, "electron": "2s²2p⁵", "color": 6},
            {"name": "Cl", "mc": "氯", "seq": 17, "electron": "3s²3p⁵", "color": 6},
            {"name": "Br", "mc": "溴", "seq": 35, "electron": "4s²4p⁵", "color": 6},
            {"name": "I", "mc": "碘", "seq": 53, "electron": "5s²5p⁵", "color": 6},
            {"name": "At", "mc": "砹", "seq": 85, "electron": "6s²6p⁵", "color": 6},
            {"name": "", "mc": "Ts", "seq": 117, "electron": "", "color": 5}
          ],
        },
        {
          name: '',
          elementArr: [
            {"name": "He", "mc": "氦", "seq": 2, "electron": "1s²", "color": 0},
            {"name": "Ne", "mc": "氖", "seq": 10, "electron": "2s²2p⁶", "color": 0},
            {"name": "Ar", "mc": "氩", "seq": 18, "electron": "3s²3p⁶", "color": 0},
            {"name": "Kr", "mc": "氪", "seq": 36, "electron": "4s²4p⁶", "color": 0},
            {"name": "Xe", "mc": "氙", "seq": 54, "electron": "5s²5p⁶", "color": 0},
            {"name": "Rn", "mc": "氡", "seq": 86, "electron": "6s²6p⁶", "color": 0},
            {"name": "", "mc": "Og", "seq": 118, "electron": "", "color": 5}
          ],
        },
      ],
      LaColumn: [
        {"name": "La", "mc": "镧", "seq": 57, "electron": "5d¹6s²", "color": 4},
        {"name": "Ce", "mc": "铈", "seq": 58, "electron": "4f¹5d¹6s²", "color": 2},
        {"name": "Pr", "mc": "镨", "seq": 59, "electron": "4f³6s²", "color": 2},
        {"name": "Nd", "mc": "钕", "seq": 60, "electron": "4f⁴6s²", "color": 2},
        {"name": "Pm", "mc": "钷", "seq": 61, "electron": "4f⁵6s²", "color": 2},
        {"name": "Sm", "mc": "钐", "seq": 62, "electron": "4f⁶6s²", "color": 2},
        {"name": "Eu", "mc": "铕", "seq": 63, "electron": "4f⁷6s²", "color": 2},
        {"name": "Gd", "mc": "钆", "seq": 64, "electron": "4f⁸6s²", "color": 2},
        {"name": "Tb", "mc": "铽", "seq": 65, "electron": "4f⁹6s²", "color": 2},
        {"name": "Dy", "mc": "镝", "seq": 66, "electron": "4f¹⁰6s²", "color": 2},
        {"name": "Ho", "mc": "钬", "seq": 67, "electron": "4f¹¹6s²", "color": 2},
        {"name": "Er", "mc": "铒", "seq": 68, "electron": "4f¹²6s²", "color": 2},
        {"name": "Tm", "mc": "铥", "seq": 69, "electron": "4f¹³6s²", "color": 2},
        {"name": "Yb", "mc": "镱", "seq": 70, "electron": "4f¹⁴6s²", "color": 2},
        {"name": "Lu", "mc": "镥", "seq": 71, "electron": "4f¹⁴5d¹6s²", "color": 2}
      ],
      AcColumn: [
        {"name": "Ac", "mc": "锕", "seq": 89, "electron": "6d¹7s²", "color": 4},
        {"name": "Th", "mc": "钍", "seq": 90, "electron": "6d²7s²", "color": 2},
        {"name": "Pa", "mc": "镤", "seq": 91, "electron": "5f²6d¹7s²", "color": 2},
        {"name": "U", "mc": "铀", "seq": 92, "electron": "5f³6d¹7s²", "color": 2},
        {"name": "Np", "mc": "镎", "seq": 93, "electron": "5f⁴6d¹7s²", "color": 2},
        {"name": "Pu", "mc": "钚", "seq": 94, "electron": "5f⁶6d¹7s²", "color": 2},
        {"name": "Am", "mc": "镅", "seq": 95, "electron": "5f⁷6d¹7s²", "color": 2},
        {"name": "Cm", "mc": "锔", "seq": 96, "electron": "5f⁷6d²7s²", "color": 2},
        {"name": "Bk", "mc": "锫", "seq": 97, "electron": "5f⁸6d¹7s²", "color": 2},
        {"name": "Cf", "mc": "锎", "seq": 98, "electron": "5f⁹7s²", "color": 2},
        {"name": "Es", "mc": "锿", "seq": 99, "electron": "5f¹⁰7s²", "color": 2},
        {"name": "Fm", "mc": "镄", "seq": 100, "electron": "5f¹¹7s²", "color": 2},
        {"name": "Md", "mc": "钔", "seq": 101, "electron": "5f¹²7s²", "color": 2},
        {"name": "No", "mc": "锘", "seq": 102, "electron": "5f¹³7s²", "color": 2},
        {"name": "Lr", "mc": "铹", "seq": 103, "electron": "5f¹⁴7s²7p¹", "color": 2}
      ]
    }
  },
  watch: {
    elementList(old, nList) {
      this.$nextTick(() => {
        if (this.elementList.length) {
          this.init()
        }
      })
    },
    selectElementList(old, nList) {
      this.$nextTick(() => {
        this.selectElement()
      })
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      // 设置可选元素
      this.topColumn.forEach((item, i) => {
        item.elementArr.forEach((element, j) => {
          if (this.elementList.find(it => it.mc === element.mc)) {
            this.$set(this.topColumn[i].elementArr[j], 'isSelect', true)
          }
        })
      })
      this.LaColumn.forEach((item, i) => {
        if (this.elementList.find(it => item.mc === it.mc)) {
          this.$set(this.LaColumn[i], 'isSelect', true)
        }
      })
      this.AcColumn.forEach((item, i) => {
        if (this.elementList.find(it => item.mc === it.mc)) {
          this.$set(this.AcColumn[i], 'isSelect', true)
        }
      })
    },
    selectElement() {
      // 设置选择元素
      this.topColumn.forEach((item, i) => {
        item.elementArr.forEach((element, j) => {
          if (this.selectElementList.length && this.selectElementList.find(it => it.mc === element.mc)) {
            this.$set(this.topColumn[i].elementArr[j], 'isActive', true)
          } else {
            this.$set(this.topColumn[i].elementArr[j], 'isActive', false)
          }
        })
      })
      this.LaColumn.forEach((item, i) => {
        if (this.selectElementList.length && this.selectElementList.find(it => item.mc === it.mc)) {
          this.$set(this.LaColumn[i], 'isActive', true)
        } else {
          this.$set(this.LaColumn[i], 'isActive', false)
        }
      })
      this.AcColumn.forEach((item, i) => {
        if (this.selectElementList.length && this.selectElementList.find(it => item.mc === it.mc)) {
          this.$set(this.AcColumn[i], 'isActive', true)
        } else {
          this.$set(this.AcColumn[i], 'isActive', false)
        }
      })
    },
    handleClickElement(element) {
      this.elementList.forEach((item) => {
        if (item.mc === element.mc) {
          this.$emit('handleClickElement', element)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.body {
  background-color: white;
}

.title {
  position: absolute;
  left: 28vw;
  top: 5vh;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: black;
}

.column-title {
  text-align: center;
}

.element-top {
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.column {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin: 0rem 0.2rem;
}

.element-bottom {
  margin-top: 0.4rem;
}

.line {
  width: 100%;
  margin: 0rem auto;
  display: flex;
}

.base-element {
  cursor: not-allowed;
  width: 68px;
  height: 68px;
  font-size: 18px;
  font-weight: bolder;
  text-align: center;
  display: flex;
  position: relative;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border-radius: 2px;
  background-color: #e5e5e5;

  .text {
    display: flex;
    flex-direction: column;

    span {
      font-size: 16px;
      font-weight: bold;
    }
  }
}

.isSelect {
  background-color: #fff;
  cursor: pointer;
}

.seq {
  font-size: 12px;
  font-weight: normal;
  position: absolute;
  top: 1px;
  left: 5px;
  color: #FF0000;
}

.name {
  font-size: 12px;
  font-weight: normal;
  position: absolute;
  top: 1px;
  right: 5px;
  color: @theme;
}

.electron {
  font-size: 12px;
  font-weight: normal;
  position: absolute;
  bottom: 1px;
  left: 5px;
  color: @theme;
}

.column-element {
  margin-top: 0.2rem;
}

.line-element {
  margin: 0.2rem;
}

.base-element.isSelect:hover {
  background-color: @theme;
  color: #fff;
  transition: 0.2s;
  font-weight: bolder;

  .seq, .name, .electron {
    color: #fff;
  }
}

.color-bottom.isSelect {
  //background-color: #d9e98e;
  border: 1px solid @theme;
  color: @theme;
}

.color-bottom.isActive {
  background-color: @theme;
  color: #fff;

  .seq, .name, .electron {
    color: #fff;
  }
}

.filter {
  position: absolute;
  top: 100px;
  left: 40%;
  display: flex;
  cursor: pointer;

  .no, .yes {
    width: 100px;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .yes {
    border: 1px solid @theme;
  }

  .no {
    background-color: #e5e5e5;
  }
}
</style>
