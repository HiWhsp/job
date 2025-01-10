<template>
  <div class="body">
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
            <span>{{ element['name'] }}</span>
            <span>{{ element['mc'] }}</span>
          </p>
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
            <span>{{ element['name'] }}</span>
            <span>{{ element['mc'] }}</span>
          </p>
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
            <span>{{ element['name'] }}</span>
            <span>{{ element['mc'] }}</span>
          </p>
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
            {name: 'H', mc: '氢', seq: 1, color: 7},
            {name: 'Li', mc: '锂', seq: 3, color: 1},
            {name: 'Na', mc: '钠', seq: 11, color: 1},
            {name: 'K', mc: '钾', seq: 19, color: 1},
            {name: 'Rb', mc: '铷', seq: 37, color: 1},
            {name: 'CS', mc: '铯', seq: 55, color: 1},
            {name: 'Fr', mc: '钫', seq: 87, color: 1},
          ],
        },
        {
          name: 'ⅡA',
          elementArr: [
            {name: 'Be', mc: '铍', seq: 4, color: 2},
            {name: 'Mg', mc: '镁', seq: 12, color: 2},
            {name: 'Ca', mc: '钙', seq: 20, color: 2},
            {name: 'Sr', mc: '锶', seq: 38, color: 2},
            {name: 'Ba', mc: '钡', seq: 56, color: 2},
            {name: 'Ra', mc: '镭', seq: 88, color: 2},
          ],
        },
        {
          name: 'ⅢB',
          elementArr: [
            {name: 'Sc', mc: '钪', seq: 21, color: 3},
            {name: 'Y', mc: '钇', seq: 39, color: 3},
            {name: 'La-Lu', mc: '镧系', seq: '57-71', color: 'bottom'},
            {name: 'Ac-Lr', mc: '锕系', seq: '89-103', color: 'bottom'},
          ],
        },
        {
          name: 'ⅣB',
          elementArr: [
            {name: 'Ti', mc: '钛', seq: 22, color: 3},
            {name: 'Zr', mc: '锆', seq: 40, color: 3},
            {name: 'Hf', mc: '铪', seq: 72, color: 3},
            {name: 'Rf', mc: '鑪', seq: 104, color: 3},
          ],
        },
        {
          name: 'ⅤB',
          elementArr: [
            {name: 'V', mc: '钒', seq: 23, color: 3},
            {name: 'Nb', mc: '铌', seq: 41, color: 3},
            {name: 'Ta', mc: '钽', seq: 73, color: 3},
            {name: 'Db', mc: '𨧀', seq: 105, color: 3},
          ],
        },
        {
          name: 'ⅥB',
          elementArr: [
            {name: 'Cr', mc: '铬', seq: 24, color: 3},
            {name: 'Mo', mc: '钼', seq: 42, color: 3},
            {name: 'W', mc: '钨', seq: 74, color: 3},
            {name: 'Sg', mc: '𨭎', seq: 106, color: 3},
          ],
        },
        {
          name: 'ⅦB',
          elementArr: [
            {name: 'Mn', mc: '锰', seq: 25, color: 3},
            {name: 'Tc', mc: '锝', seq: 43, color: 3},
            {name: 'Re', mc: '铼', seq: 75, color: 3},
            {name: 'Bh', mc: '𨨏', seq: 107, color: 3},
          ],
        },
        {
          name: 'f',
          elementArr: [
            {name: 'Fe', mc: '铁', seq: 26, color: 3},
            {name: 'Ru', mc: '钌', seq: 44, color: 3},
            {name: 'Os', mc: '锇', seq: 76, color: 3},
            {name: 'Hs', mc: '𨭆', seq: 108, color: 3},
          ],
        },
        {
          name: 'c',
          elementArr: [
            {name: 'Co', mc: '钴', seq: 27, color: 3},
            {name: 'Rh', mc: '铑', seq: 45, color: 3},
            {name: 'Ir', mc: '铱', seq: 77, color: 3},
            {name: 'Mt', mc: '䥑', seq: 109, color: 3},
          ],
        },
        {
          name: 'n',
          elementArr: [
            {name: 'Ni', mc: '镍', seq: 28, color: 3},
            {name: 'Pd', mc: '钯', seq: 46, color: 3},
            {name: 'Pt', mc: '铂', seq: 78, color: 3},
            {name: 'Ds', mc: '鐽', seq: 110, color: 3},
          ],
        },
        {
          name: 'ⅠB',
          elementArr: [
            {name: 'Cu', mc: '铜', seq: 29, color: 3},
            {name: 'Ag', mc: '银', seq: 47, color: 3},
            {name: 'Au', mc: '金', seq: 79, color: 3},
            {name: 'Rg', mc: '錀', seq: 111, color: 3},
          ],
        },
        {
          name: 'ⅡB',
          elementArr: [
            {name: 'Zn', mc: '锌', seq: 30, color: 3},
            {name: 'Cd', mc: '镉', seq: 48, color: 3},
            {name: 'Hg', mc: '汞', seq: 80, color: 3},
            {name: 'Cn', mc: 'Uub', seq: 112, color: 3},
          ],
        },
        {
          name: 'ⅢA',
          elementArr: [
            {name: 'B', mc: '硼', seq: 5, color: 4},
            {name: 'Al', mc: '铝', seq: 13, color: 3},
            {name: 'Ga', mc: '镓', seq: 31, color: 3},
            {name: 'In', mc: '铟', seq: 49, color: 3},
            {name: 'Tl', mc: '铊', seq: 81, color: 3},
            {name: 'Uut', mc: 'Uut', seq: 113, color: 5},
          ],
        },
        {
          name: 'ⅣA',
          elementArr: [
            {name: 'C', mc: '碳', seq: 6, color: 7},
            {name: 'Si', mc: '硅', seq: 14, color: 4},
            {name: 'Ge', mc: '锗', seq: 32, color: 4},
            {name: 'Sn', mc: '锡', seq: 50, color: 3},
            {name: 'Pb', mc: '铅', seq: 82, color: 3},
            {name: 'Uuq', mc: 'Uuq', seq: 114, color: 5},
          ],
        },
        {
          name: 'ⅤA',
          elementArr: [
            {name: 'N', mc: '氮', seq: 7, color: 7},
            {name: 'P', mc: '磷', seq: 15, color: 7},
            {name: 'As', mc: '砷', seq: 33, color: 4},
            {name: 'Sb', mc: '锑', seq: 51, color: 4},
            {name: 'Bi', mc: '铋', seq: 83, color: 3},
            {name: 'Uup', mc: 'Uup', seq: 115, color: 5},
          ],
        },
        {
          name: 'ⅥA',
          elementArr: [
            {name: 'O', mc: '氧', seq: 8, color: 7},
            {name: 'S', mc: '硫', seq: 16, color: 7},
            {name: 'Se', mc: '硒', seq: 11, color: 7},
            {name: 'Te', mc: '碲', seq: 19, color: 4},
            {name: 'Po', mc: '钋', seq: 84, color: 4},
            {name: 'Uuh', mc: 'Uuh', seq: 116, color: 5},
          ],
        },
        {
          name: 'ⅦA',
          elementArr: [
            {name: 'F', mc: '氟', seq: 9, color: 6},
            {name: 'Cl', mc: '氯', seq: 17, color: 6},
            {name: 'Br', mc: '溴', seq: 35, color: 6},
            {name: 'I', mc: '碘', seq: 53, color: 6},
            {name: 'At', mc: '砹', seq: 85, color: 6},
            {name: 'Uus', mc: 'Uus', seq: 117, color: 5},
          ],
        },
        {
          name: '',
          elementArr: [
            {name: 'He', mc: '氦', seq: 2, color: 0},
            {name: 'Ne', mc: '氖', seq: 10, color: 0},
            {name: 'Ar', mc: '氩', seq: 18, color: 0},
            {name: 'Kr', mc: '氪', seq: 36, color: 0},
            {name: 'Xe', mc: '氙', seq: 54, color: 0},
            {name: 'Rn', mc: '氡', seq: 86, color: 0},
            {name: 'Uuo', mc: 'Uuo', seq: 118, color: 5},
          ],
        },
      ],
      LaColumn: [
        {name: 'La', mc: '镧', seq: 57, color: 4},
        {name: 'Ce', mc: '铈', seq: 58, color: 2},
        {name: 'Pr', mc: '镨', seq: 59, color: 2},
        {name: 'Nd', mc: '钕', seq: 60, color: 2},
        {name: 'Pm', mc: '钷', seq: 61, color: 2},
        {name: 'Sm', mc: '钐', seq: 62, color: 2},
        {name: 'Eu', mc: '铕', seq: 63, color: 2},
        {name: 'Gd', mc: '钆', seq: 64, color: 2},
        {name: 'Tb', mc: '铽', seq: 65, color: 2},
        {name: 'Dy', mc: '镝', seq: 66, color: 2},
        {name: 'Ho', mc: '钬', seq: 67, color: 2},
        {name: 'Er', mc: '铒', seq: 68, color: 2},
        {name: 'Tm', mc: '铥', seq: 69, color: 2},
        {name: 'Yb', mc: '镱', seq: 70, color: 2},
        {name: 'Lu', mc: '镥', seq: 71, color: 2},
      ],
      AcColumn: [
        {name: 'Ac', mc: '锕', seq: 89, color: 4},
        {name: 'Th', mc: '钍', seq: 90, color: 2},
        {name: 'Pa', mc: '镤', seq: 91, color: 2},
        {name: 'U', mc: '铀', seq: 92, color: 2},
        {name: 'Np', mc: '镎', seq: 93, color: 2},
        {name: 'Pu', mc: '钚', seq: 94, color: 2},
        {name: 'Am', mc: '镅', seq: 95, color: 2},
        {name: 'Cm', mc: '锔', seq: 96, color: 2},
        {name: 'Bk', mc: '锫', seq: 97, color: 2},
        {name: 'Cf', mc: '锎', seq: 98, color: 2},
        {name: 'Es', mc: '锿', seq: 99, color: 2},
        {name: 'Fm', mc: '镄', seq: 100, color: 2},
        {name: 'Md', mc: '钔', seq: 101, color: 2},
        {name: 'No', mc: '锘', seq: 102, color: 2},
        {name: 'Lr', mc: '铹', seq: 103, color: 2},
      ]
    }
  },
  watch: {
    elementList(old, nList) {
      this.$nextTick(() => {
        if(this.elementList.length) {
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
          }else {
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
      this.$emit('handleClickElement', element)
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
  width: 60px;
  height: 60px;
  font-size: 18px;
  font-weight: bolder;
  text-align: center;
  display: flex;
  position: relative;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
  border-radius: 2px;
  background-color: #e5e5e5;

  .text {
    display: flex;
    flex-direction: column;

    span:nth-child(1) {
      font-size: 13px;
      font-weight: normal;
    }

    span:nth-child(2) {
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
  .seq {
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
  .seq {
    color: #fff;
  }
}
</style>
