<template>
  <div>
    <div
        v-if="fontShow"
        class="font"
      >
        <div class="header">
          Font
        </div>
        <div class="contendSelect">
          <el-tooltip
            class="item"
            effect="dark"
            content="Font"
            placement="bottom"
          >
            <el-select
              v-model="fontfamily"
              style="width:140px"
              placeholder="Font"
              popper-class="popperSelect"
              @change="(item)=>{ this.doActions('fontfamily', item) }"
            >
              <el-option
                v-for="item in fontOpitons"
                :key="item.id"
                :label="item.className"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="Font Size"
            placement="bottom-start"
          >
            <el-select
              style="width:80px"
              v-model="fontSize"
              popper-class="popperSelect"
              @change="(item)=>{ this.doActions('fontSize', item) }"
            >
              <el-option
                v-for="item in fontSizeOpitons"
                :key="item.id + 'fontSize'"
                :label="item.className"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-tooltip>

        </div>
        <div class="iconButton">
          <div class="topButton">
            <el-tooltip
              class="item"
              effect="dark"
              :content=" isWindow ? `Bold(Ctrl + B)`: `Bold(command + B)`"
              placement="bottom"
            >
              <div
                class="iconFont tbBlod"
                :class="{blodActive:boldStatus}"
                @click="doActions('bold')"
              >
              </div>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content=" isWindow ? `Italic(Ctrl + I)`: `Italic(command + I)`"
              placement="bottom"
            >
              <div
                class="iconFont tbItalic"
                :class="{italicActive:italicStatus}"
                @click="doActions('italic')"
              >
              </div>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="Underline"
              placement="bottom"
            >
              <div
                class="iconFont tbTextDecoration"
                :class="{textDecorationActive:textDecorationStatus==='underline'}"
                @click="doActions('textDecoration','underline','text-decoration')"
              >
              </div>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="Strikethrough"
              placement="bottom"
            >
              <div
                class="iconFont tbLineTextDecoration"
                :class="{tbLineDecorationActive:textDecorationStatus==='line-through'}"
                @click="doActions('textDecoration','line-through','text-decoration')"
              >
              </div>
            </el-tooltip>
          </div>
          <div class="bottomButton">
            <el-tooltip
              class="item"
              effect="dark"
              content="Font Color"
              placement="bottom"
            >
              <div
                class="color"
                @click="openColor"
              >
                <div class="left">
                  <img
                    src="../mainImgs/Frame 133.png"
                    alt=""
                  >
                  <div
                    class="selectBar"
                    ref="showColor"
                  >
                    <colorPicker
                      ref="colorPicker"
                      v-model="fontColor"
                      defaultColor="#ccc"
                      @change="(item)=>{this.doActions('ForeColor', item)}"
                    ></colorPicker>
                  </div>
                </div>
                <img
                  style="marginLeft:-10px"
                  src="../mainImgs/xiala.png"
                  alt=""
                >
              </div>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="Align Left"
              placement="bottom"
            >
              <div
                class="iconFont tbTextAlign"
                :class="{TextAlignActive:TextAlignStatus==='0'}"
                @click="doActions('textAlign','0','textAlign','left')"
              >
              </div>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="Align Center"
              placement="bottom"
            >
              <div
                class="iconFont tbText1Align"
                :class="{TextAlign1Active:TextAlignStatus==='1'}"
                @click="doActions('textAlign','1', 'textAlign','center')"
              >
              </div>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="Align Right"
              placement="bottom"
            >
              <div
                class="iconFont tbText2Align"
                :class="{TextAlign2Active:TextAlignStatus==='2'}"
                @click="doActions('textAlign','2', 'textAlign','right')"
              >
              </div>
            </el-tooltip>

          </div>
        </div>
      </div>
    <div
        v-if="strokeShow"
        class="frame"
      >
        <div class="header">
          Border
        </div>
        <div class="contendSelect">
          <el-tooltip
            class="item"
            effect="dark"
            content="Border Color"
            placement="bottom"
          >
            <ColorPick
              @command="(key, value)=>{this.connectSelect(key, value, 'rotate2')}"
              @open="connectOpenSelectOpen('rotate2')"
              @hide="connectOpenSelectClose('rotate2')"
              :defaultColor="stroke"
              params="stroke"
            >
              <template v-slot:inset="{row}">
                <div class="selectColor">
                  <div
                    class="box"
                    :style="{backgroundColor:row}"
                  ></div>
                  <div
                    class="el-icon-arrow-up change"
                    @mouseenter="changeStyle($event, true)"
                    @mouseleave="changeStyle($event, false)"
                    ref="rotate2"
                  ></div>
                </div>
              </template>
            </ColorPick>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="Border Weight"
            placement="bottom"
          >
            <el-select
              style="width:80px"
              v-model="strokeWidth"
              popper-class="popperSelect"
              @change="(item)=>{ this.doActions('strokeWidth', item) }"
            >
              <el-option
                v-for="item in strokeWidthOpitons"
                :key="item.id + 'strokeWidth'"
                :label="item.className"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="Border Style"
            placement="bottom"
          >
            <el-dropdown
              trigger="click"
              style="width:80px"
              @visible-change="changeRotate"
              @command="borderStyle"
            >
              <div class="selectColor">
                <div class="borderStyleBox ">
                  <svg
                    width="40"
                    height="1"
                    class="svg-path-type"
                  >
                    <path
                      d="M1,0h98"
                      stroke-width="222"
                      stroke="#DC143C"
                      :stroke-dasharray="strokeDasharray"
                    ></path>
                  </svg>
                </div>
                <div
                  class="el-icon-arrow-up change"
                  ref="rotate"
                  @mouseenter="changeStyle($event, true)"
                  @mouseleave="changeStyle($event, false)"
                ></div>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="item.id"
                  v-for="(item, index) in strokeDasharrayOpitons"
                  :key="index + 'strokeDasharray'"
                >
                  <div>
                    <svg
                      width="98"
                      height="1"
                      class="svg-path-type"
                      v-html="item.className"
                    >
                      {{item.className}}
                    </svg>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
        </div>
      </div>
    <div class="connectingLine">
      <div class="header">
        Line
      </div>
      <div class="connectingLineSelect">
        <el-tooltip
          class="item"
          effect="dark"
          content="Node Line Fill Color"
          placement="bottom"
        >
          <ColorPick
            @command="(key, value)=>{this.connectSelect(key, value, 'rotate1')}"
            @open="connectOpenSelectOpen('rotate1')"
            @hide="connectOpenSelectClose('rotate1')"
            params="ConnectColor"
            :defaultColor="connectColor"
          >
            <template v-slot:inset="{row}">
              <div class="selectColor">
                <div
                  class="box"
                  :style="{backgroundColor:row}"
                ></div>
                <div
                  class="el-icon-arrow-up change"
                  ref="rotate1"
                  @mouseenter="changeStyle($event, true)"
                  @mouseleave="changeStyle($event, false)"
                ></div>
              </div>
            </template>
          </ColorPick>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Node Line Weight"
          placement="bottom"
        >
          <el-select
            style="width:80px; marginLeft:20px"
            v-model="ConnectWidth"
            popper-class="popperSelect"
            @change="(item)=>{ this.doActions('ConnectWidth', item) }"
          >
            <el-option
              v-for="item in ConnectWidthOptions"
              :key="item.id + 'ConnectWidth' "
              :label="item.className"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-tooltip>

      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ColorPick from "../../colorPick/index.vue"
export default {
  data () {
    return {
      // 字体部分
      fontfamily: 'FangSong',
      fontOpitons: [
        { id: "FangSong", className: "FangSong" },
        { id: "YouYuan", className: "YouYuan" },
        { id: "宋体, SimSun", className: "SimSun" },
        { id: "楷体, 楷体_GB2312, SimKai", className: "SimKai" },
        { id: "黑体, SimHei", className: "SimHei" },
        { id: '隶书, SimLi', className: "SimLi" },
        { id: 'times new roman, SimLi', className: "times new roman" },
      ],
      fontSize: '16',
      fontShow:false,
      fontSizeOpitons: [
        { id: '10', className: "10" },
        { id: '11', className: "11" },
        { id: '12', className: "12" },
        { id: '13', className: "13" },
        { id: '14', className: "14" },
        { id: '16', className: "16" },
        { id: '18', className: "18" },
        { id: '20', className: "20" },
        { id: '22', className: "22" },
        { id: '24', className: "24" },
        { id: '26', className: "26" },
        { id: '32', className: "32" },
        { id: '36', className: "36" },
      ],
      fontColor: "blue",
      boldStatus: '',
      italicStatus: false,
      textDecorationStatus: '',
      TextAlignStatus: '-1',
      // 边框部分
      strokeShow: false,
      stroke: "#7993ae",
      strokeWidth: '2',
      strokeWidthOpitons: [
        { id: '0', className: "0px" },
        { id: '1', className: "1px" },
        { id: '2', className: "2px" },
        { id: '3', className: "3px" },
        { id: '4', className: "4px" },
        { id: '5', className: "5px" },
        { id: '6', className: "6px" },
        { id: '7', className: "7px" },
        { id: '8', className: "8px" },
      ],
      strokeDasharray: '0',
      strokeDasharrayOpitons: [
        { id: '0', className: ` <path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="0">`, },
        { id: '8,2', className: `<path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="8,2"></path>` },
        { id: '6,3', className: `<path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="6,3"></path>` },
        { id: '4,4', className: `<path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="4,4"></path>` },
        { id: '2,4', className: `<path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="2,4"></path>` },
        { id: '1', className: `<path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="1"></path>` },
        { id: '8,4,2,4', className: `<path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="8,4,2,4"></path>` },
        { id: '8,4,2,4,2,4', className: `<path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="8,4,2,4,2,4"></path>` },
        { id: '8,4,8,4,2,4', className: `<path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="8,4,8,4,2,4"></path>` },
        { id: '8,4,2,4,2,4', className: `<path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="8,4,2,4,2,4"></path>` },
        { id: '10,4,2,4,2,4', className: `<path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="10,4,2,4,2,4"></path>` },
        { id: '20,4,2,4', className: `<path d="M1,0h98" stroke-width="222" stroke="#DC143C" stroke-dasharray="20,4,2,4"></path>` },
      ],
      // 连接线部分
      connectShow: false,
      connectColor: "#6e7d9c",
      ConnectWidth: "1px",
      ConnectWidthOptions: [
        { id: '1', className: "1px" },
        { id: '2', className: "2px" },
        { id: '3', className: "3px" },
        { id: '4', className: "4px" },
        { id: '5', className: "5px" },
        { id: '6', className: "6px" },
        { id: '7', className: "7px" },
        { id: '8', className: "8px" },
      ]
    }
  },
  computed: {
    ...mapGetters({
      minder: "getMinder",
      selectedNode: "getSelectedNode",
    }),
    isWindow(){
       return  /windows|win32/i.test(window.navigator.userAgent)
    }
  },
  watch: {
    // 1. 节点发生改变
    'minder._selectedNodes': 'changeNode',
    // 2. 字体颜色发生变化
    fontColor: 'fontColorChange',
  },
  methods: {
    // 1. 点击节点初始化默认数据
    initData () {

      // 字体
      this.fontfamily = ''
      // 字体大小
      this.fontSize = 16
      // 字体粗细
      this.boldStatus = false
      // 字体是否斜体
      this.italicStatus = false
      // 字体的线
      this.textDecorationStatus = ''
      // 字体颜色
      this.fontColor = '#4e4e4e'
      // 字体方向
      this.TextAlignStatus = ''
      // 边框颜色
      this.stroke = '#7993ae'
      // 边框大小
      this.strokeWidth = '2'
      // 边框类型
      this.strokeDasharray = '0'
      //  连接线颜色
      this.connectColor = '#6e7d9c'
      // 连接线大小
      this.ConnectWidth = '2'


      // 判断当前是哪个节点
      let nowNodes = this.minder.getSelectedNode().getLevel()
      let allInitThemeData = this.minder.getSystemStyle()
      if (nowNodes === 0) {
        // 中心节点
        // 
        this.fontSize = allInitThemeData['root-font-size'] + ''
        this.boldStatus = true
        this.fontColor = allInitThemeData['root-color'] + ''
        this.fontSize = allInitThemeData['root-font-size'] + ''

      } else if (nowNodes === 1) {
        // 二级节点
        this.fontColor = allInitThemeData['main-color'] + ''
        this.ConnectWidth = allInitThemeData['main-connect-width'] + ''
        this.fontSize = allInitThemeData['main-font-size'] + ''
        this.stroke = allInitThemeData['main-stroke'] + ''
        this.strokeWidth = allInitThemeData['main-stroke-width'] + ''
        this.connectColor = allInitThemeData['connect-color'] + ''
        this.ConnectWidth = allInitThemeData['connect-width'] + ''


      } else {
        // 三级节点往后
        this.fontColor = allInitThemeData['sub-color'] + ''
        this.connectColor = allInitThemeData['connect-color'] + ''
        this.ConnectWidth = allInitThemeData['connect-width'] + ''
        this.stroke = allInitThemeData['sub-background'] + ''
        this.strokeWidth = '0'
      }


    },
    // 2. 改变节点获取默认值
    changeNode () {
      this.changeShowHide()
      if (!this.selectedNode) return
      // 1. 初始化默认值
      this.initData()
      // 2. 设置已有的属性
      let formData = this.minder._selectedNodes[0].data
      for (let i in formData) {
        if (i === 'font-family') {
          if (formData[i]) {
            this.fontfamily = formData[i]
          } else {
            this.fontfamily = this.fontOpitons[0].id
          }
        }
        if (i === 'font-size') {
          if (formData[i]) {
            this.fontSize = formData[i]
          } else {
            this.fontSize = 16
          }
        }
        if (i === 'font-weight') {
          if (formData[i] === 'bold') {
            this.boldStatus = true
          } else {
            this.boldStatus = false
          }
        }
        if (i === 'font-style') {
          if (formData[i] === 'italic') {
            this.italicStatus = true
          } else {
            this.italicStatus = false
          }
        }
        if (i === 'text-decoration') {
          if (formData[i] === 'underline') {
            this.textDecorationStatus = 'underline'
          }
          else if (formData[i] === 'line-through') {
            this.textDecorationStatus = 'line-through'
          } else {
            this.textDecorationStatus = ''
          }
        }
        if (i === 'color') {
          if (formData[i]) {
            this.fontColor = formData[i]
          } else {
            this.fontColor = '#4e4e4e'
          }
        }
        if (i === 'textAlign') {
          if (formData[i] === 'left') {
            this.TextAlignStatus = '0'
          }
          else if (formData[i] === 'center') {
            this.TextAlignStatus = '1'
          }
          else if (formData[i] === 'right') {
            this.TextAlignStatus = '2'
          } else {
            this.TextAlignStatus = ''
          }
        }
        if (i === 'stroke') {
          if (formData[i]) {
            this.stroke = formData[i]
          } else {
            this.stroke = '#7993ae'
          }
        }
        if (i === 'stroke-width') {
          if (formData[i]) {
            this.strokeWidth = formData[i]
          } else {
            this.strokeWidth = '2'
          }
        }
        if (i === 'stroke-dasharray') {
          if (formData[i]) {
            this.strokeDasharray = formData[i]
          } else {
            this.strokeDasharray = '0'
          }
        }
        if (i === 'connect-color') {
          if (formData[i]) {
            this.connectColor = formData[i]
          } else {
            this.connectColor = '#6e7d9c'
          }
        }
        if (i === 'connect-width') {
          if (formData[i]) {
            this.ConnectWidth = formData[i]
          } else {
            this.ConnectWidth = '2'
          }
        }
      }
    },
    // 3. watch监听字体颜色变化修改dom
    fontColorChange () {
      if(!this.$refs.showColor) return
      this.$refs.showColor.style.backgroundColor = this.fontColor
    },
    // 4. 边框类型值切换
    borderStyle (item) {
      this.strokeDasharray = item
      this.doActions('strokeDasharray', item)
    },
    // 5. 边框类型切换改变样式
    changeRotate (row) {
      if (row) {
        this.$refs.rotate.className = "el-icon-arrow-up change rotate"
      } else {
        this.$refs.rotate.className = "el-icon-arrow-up change"
      }
    },
    // 6. 字体颜色打开modal
    openColor () {
      this.$refs.colorPicker.openPanel()
    },
    // 边框和连接线的颜色选择切换
    connectSelect (key, value, where) {
      if(value === 'stroke')  this.stroke = value
      if(value === 'ConnectColor')  this.ConnectColor = value
      this.doActions(key, value)
      this.connectOpenSelectClose(where)
    },
    // 边框和连接线的颜色选择样式切换
    connectOpenSelectOpen (where) {
      this.$refs[where].className = "el-icon-arrow-up change rotate"
    },
    // 边框和连接线的颜色选择样式切换
    connectOpenSelectClose (where) {
      this.$refs[where].className = "el-icon-arrow-up change"
    },
    // 操作思维导图
    doActions (key, value, styleKey, TextAlign) {
      if (key === "fontfamily") {
        this.minder.execCommand(key, value)
        return
      }
      if (key === "fontSize") {
        this.minder.execCommand(key, value)
        return
      }
      if (key === "textAlign") {
        console.log(this.selectedNode);
        let step = value
        // 处理当前页面数据
        if (this.nowHasStyle(styleKey, TextAlign)) {
          this.TextAlignStatus = 'auto'
          step = value
        } else {
          this.TextAlignStatus = value
        }

        // 默认操作
        let e = step
        var t = this.minder,
          n = t.getSelectedNodes(),
          i = t.getAllNode();
        0 == e ? (this.alignLeft = !this.alignLeft,
          this.alignCenter = false,
          this.alignRight = false,
          this.alignLeft && n ? (n.forEach((function (e) {
            e.setData("textAlign", "left"),
              e.render()
          })),
            i.forEach((function (e) {
              e.render()
            }))) : (n.forEach((function (e) {
              e.setData("textAlign", "auto"),
                e.render()
            })),
              i.forEach((function (e) {
                e.render()
              })))) : 1 == e ? (this.alignLeft = false,
                this.alignCenter = !this.alignCenter,
                this.alignRight = false,
                this.alignCenter && n ? (n.forEach((function (e) {
                  e.setData("textAlign", "center"),
                    e.render()
                })),
                  i.forEach((function (e) {
                    e.render()
                  }))) : (n.forEach((function (e) {
                    e.setData("textAlign", "auto"),
                      e.render()
                  })),
                    i.forEach((function (e) {
                      e.render()
                    })))) : 2 == e && n && (this.alignLeft = false,
                      this.alignCenter = false,
                      this.alignRight = !this.alignRight,
                      this.alignRight ? (n.forEach((function (e) {
                        e.setData("textAlign", "right"),
                          e.render()
                      })),
                        i.forEach((function (e) {
                          e.render()
                        }))) : (n.forEach((function (e) {
                          e.setData("textAlign", "auto"),
                            e.render()
                        })),
                          i.forEach((function (e) {
                            e.render()
                          }))))
        return
      }
      if (key === "textDecoration") {
        if (this.nowHasStyle(styleKey, value)) {
          this.minder.execCommand(key, 'none')
          this.textDecorationStatus = ''
        } else {
          this.minder.execCommand(key, value)
          this.textDecorationStatus = value
        }
        return
      }
      if (key === "italic") {
        this.italicStatus = !this.italicStatus
        this.minder.execCommand(key)
        return
      }
      if (key === "bold") {
        this.boldStatus = !this.boldStatus
        this.minder.execCommand(key)
        return
      }
      if (key === "ForeColor") {
        this.minder.execCommand(key, value)
        return
      }
      if (key === "strokeDasharray") {
        this.minder.execCommand(key, value)
        return
      }
      if (key === "strokeWidth") {
        this.minder.execCommand(key, value)
        return
      }
      if (key === "ConnectWidth") {
        this.minder.execCommand(key, value)
        return
      }
      if (key === "stroke") {
        this.minder.execCommand(key, value)
        return
      }
      if (key === "ConnectColor") {
        this.minder.execCommand(key, value)
        return
      }
    },
    // 控制当前节点操作功能显示隐藏
    changeShowHide () {
      if (this.minder._selectedNodes.length > 0) {
        this.strokeShow = true
          this.fontShow = true
      } else {
        this.fontShow = false
         this.strokeShow = false
      }
    },
    // 检测当前节点是否存在当前属性
    nowHasStyle (key, value) {
      let results = false
      this.minder.getSelectedNodes().forEach(ele => {
        for (let i in ele.data) {
          if (key === i && ele.data[i] === value) {
            results = true
          }
        }
      })
      return results
    },

    changeStyle (e, isShow) {
      if (isShow) {
        e.target.parentNode.style.border = '1px solid #c0c4cc'

      } else {
        e.target.parentNode.style.border = '1px solid #dfe5f0'

      }
    }

  },
  components: {
    ColorPick
  }
}
</script>

<style scoped lang="less">
.header {
  margin: 16px 0px;
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;
  color: #000000;
}
.contendSelect {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.connectingLineSelect {
  display: flex;
  align-items: center;
}
.iconButton {
  width: 100%;
  .topButton {
    padding-top: 18px;
    > img {
      margin-right: 22px;
      cursor: pointer;
    }
  }
  .bottomButton {
    display: flex;
    align-items: center;
    padding-left: 5px;
    padding-top: 10px;
    img {
      margin-right: 22px;
      cursor: pointer;
    }

    .color {
      display: flex;
      .left {
        text-align: center;
        img {
          margin-left: 3px;
        }
        .selectBar {
          width: 20px;
          height: 4px;
          background-color: red;
        }
      }
    }
  }
}

/deep/ .m-colorPicker .colorBtn {
  width: 0;
  height: 0;
}

.frame {
  margin-top: 30px;
}
.font {
  margin-top: 20px;
}
.connectingLine {
  margin-top: 30px;
}
.iconFont {
  width: 24px;
  height: 24px;
  display: inline-block;
  margin-right: 22px;
  cursor: pointer;
}
.tbBlod {
  background: url("../mainImgs/icon.png") no-repeat;
  &:hover {
    background: url("../mainImgs/hoverBold.jpg") no-repeat;
  }
}
.blodActive {
  background: url("../mainImgs/hoverBold.jpg") no-repeat;
}
.tbItalic {
  background: url("../mainImgs/icon (1).png") no-repeat;
  &:hover {
    background: url("../mainImgs//hoverItalic.jpg") no-repeat;
  }
}
.italicActive {
  background: url("../mainImgs/hoverItalic.jpg") no-repeat;
}

.tbTextDecoration {
  background: url("../mainImgs/icon (2).png") no-repeat;
  &:hover {
    background: url("../mainImgs/hoverUnderline.jpg") no-repeat;
  }
}
.textDecorationActive {
  background: url("../mainImgs/hoverUnderline.jpg") no-repeat;
}
.tbLineTextDecoration {
  background: url("../mainImgs/icon (3).png") no-repeat;
  &:hover {
    background: url("../mainImgs/hoverStrikethrough.jpg") no-repeat;
  }
}
.tbLineDecorationActive {
  background: url("../mainImgs/hoverStrikethrough.jpg") no-repeat;
}

.tbTextAlign {
  background: url("../mainImgs/Frame 135.png") no-repeat;
  &:hover {
    background: url("../mainImgs/hoverAlign left.jpg") no-repeat;
  }
}
.TextAlignActive {
  background: url("../mainImgs/hoverAlign left.jpg") no-repeat;
}
.tbText1Align {
  background: url("../mainImgs/Frame 134.png") no-repeat;
  &:hover {
    background: url("../mainImgs/hoverAlign center.jpg") no-repeat;
  }
}
.TextAlign1Active {
  background: url("../mainImgs/hoverAlign center.jpg") no-repeat;
}
.tbText2Align {
  background: url("../mainImgs/Frame 136.png") no-repeat;
  &:hover {
    background: url("../mainImgs/hoverAlign right.jpg") no-repeat;
  }
}
.TextAlign2Active {
  background: url("../mainImgs/hoverAlign right.jpg") no-repeat;
}
/deep/ .el-input__inner {
  // border: 1px solid #fff;
  border-radius: 6px;
  border: 1px solid #dfe5f0;
}
/deep/ .el-input__inner:hover {
  border: 1px solid #dfe5f0 !important;
}
.popperSelect {
  .el-select-dropdown__item.selected {
    color: #5452f6;
  }
}

// /deep/ .el-select .el-input__inner:focus {
//   border-color: #fff;
// }
// /deep/ .el-select .el-input.is-focus .el-input__inner {
//   border-color: #fff;
// }
.selectColor {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  border: 1px solid #dfe5f0;
  box-sizing: border-box;
  border-radius: 6px;
  transition: all 0.5s;
  cursor: pointer;
  .box {
    position: static;
    width: 48px;
    height: 20px;
    left: 8px;
    top: 6px;
    background: #6866ff;
    border-radius: 4px;
    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 0px 4px;
  }
  .borderStyleBox {
    width: 48px;
    height: 20px;
    border-radius: 4px;
    margin: 0px 4px;
    display: flex;
    align-items: center;
  }
  .change {
    transition: all 0.5s;
    transform: rotate(180deg);
    margin-right: 10px !important;
    color: #dccfce;
  }
  .rotate {
    transform: rotate(0deg);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.8s;
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-200px);
}
.fade-enter {
  opacity: 0;
  transform: translateY(-200px);
}
.opa-enter-active,
.opa-leave-active {
  transition: all 0.8s;
}
.opa-leave-to {
  transform: translateX(200px);
}
.opa-enter {
  transform: translateX(200px);
}
</style>

