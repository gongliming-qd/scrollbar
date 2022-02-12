<template>
  <div class="MindMapMain">
    <div class="handle">
      <el-tooltip
        :content="isWindow?` Back 　Ctrl+Z`:`Back 　command+Z`"
        placement="right"
      >
        <img
          :class="hasUndo ? 'undo' : ''"
          :src="require(hasUndo ? './imgs/undo.svg' : './imgs/unundo.svg')"
          alt
          @click="undo"
        />
      </el-tooltip>
      <el-tooltip
        :content="isWindow?` Next 　Ctrl+Y`:`Back 　command+Y`"
        placement="right"
      >
        <img
          :class="hasRedo ? 'redo' : 'unredo'"
          :src="require(hasRedo ? './imgs/redo.svg' : './imgs/unredo.svg')"
          alt
          @click="redo"
        />
      </el-tooltip>

      <el-tooltip
        content="Add sibling node　　Enter"
        placement="right"
      >
        <img
          @click="addEqualityNode"
          :src="
            require(selectedNode ? './imgs/tongji.svg' : './imgs/unTongji.png')
          "
          alt
        />
      </el-tooltip>
      <el-tooltip
        content="Add child node 　Tab"
        placement="right"
      >
        <img
          @click="addChildNode"
          :src="
            require(selectedNode ? './imgs/xiaji.svg' : './imgs/unXiaji.png')
          "
          alt
        />
      </el-tooltip>

      <el-tooltip
        content="Insert relationship"
        placement="right"
      >
        <img
          @click="addRelineShipe"
          :src="
            require(aboutLine ? './imgs/left_line.png' : './imgs/left_line_undo.png')
          "
          alt
        />
      </el-tooltip>
       <el-tooltip
        content="Insert summary"
        placement="right"
      >
        <img
          @click="addGeneralize"
          :src="
            require( summary ? './imgs/left_about.png' : './imgs/left_about_undo.png')
          "
          alt
        />
      </el-tooltip>
    </div>
    <div class="handRight">
      <el-popover
        placement="right"
        width="310"
        :open-delay="200"
        popper-class="popoverStyle"
        :close-delay="200"
        v-model="handRightStatus"
        :ref="'popover'"
        trigger="manual"
      >
        <div v-show="rightNowStrp === 'tree'">
          <div class="handRightBox">
            <div class="handClose">
              <span class="title"> Layout </span>
              <img
                class="cursor"
                @click="itemStatusClose()"
                src="./mainImgs/close.svg"
                alt=""
              >
            </div>
            <div
              class="treeContend"
              style="marginTop:10px"
            >
              <div
                class="treeSingle"
                :class="{active:ele.status}"
                v-for="ele in treeOptions"
                :key="ele.id"
                @click="handTreeClick(ele.id, treeOptions)"
              >
                
                <img :src="ele.defaultURL" width="56px" >
                <div class="singleIntro">{{ele.intro}}</div>
              </div>
            </div>
          </div>

        </div>
        <div v-show="rightNowStrp === 'pen'">
          <div class="handRightBox">
            <div class="handClose">
              <span class="title"> Style </span>
              <img
                class="cursor"
                @click="itemStatusClose()"
                src="./mainImgs/close.svg"
                alt=""
              >
            </div>
            <Style></Style>
          </div>
        </div>
        <div v-show="rightNowStrp === 'function'">
          <div class="handRightBox">
            <div class="handClose">
              <span class="title"> Theme </span>
              <img
                class="cursor"
                @click="itemStatusClose()"
                src="./mainImgs/close.svg"
                alt=""
              >
            </div>
            <div
              class="functionContend"
              style="marginTop:10px"
            >
              <div
                class="functionSingle"
                :class="{active:ele.status}"
                v-for="ele in functionOptions"
                :key="ele.id"
                @click="handRightItemClick(ele.id, functionOptions)"
              >
                <img :src="ele.defaultURL">
              </div>
            </div>
          </div>
        </div>
        <div slot="reference">
          <div>
            <div
              v-for="(item, index) in handRightOptions"
              :key="item.id"
              :class="'rightIIconSetting'+index"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.content"
                :disabled="handRightStatus"
                placement="left-start"
              >
                <img
                  :src="item.status? item.clickURL:item.defaultURL"
                  @click="handRightItemClickCopy(item.id, handRightOptions)"
                />
              </el-tooltip>

            </div>
          </div>
        </div>

      </el-popover>

    </div>
    <div id="minder-container"></div>
    <Thumbnail></Thumbnail>
  </div>
</template>

<script>
import "hotbox-ui";
import "hotbox-ui/hotbox.css";
// import "kity";
import "./kityminder/kity.js";
import "./kityminder/kityminder.editor.css";
// import "./kityminder/dist/kityminder.core";
import "./kityminder/kityminder.core";
// import "kityminder-core";
import "./kityminder/kityminder.core.css";
import "./kityminder/kityminder.editor.js";
import { mapMutations, mapGetters } from "vuex";
import Thumbnail from "./Thumbnail.vue";
import moment from "moment";
import tool from "../../utils/tools";

let newDefault = require("./kityminder/Theme/newDefault.json");
import { newRight, newLeft } from "./kityminder/Template/index";
import Style from "./mainChildren/style.vue"
export default {
  name: "MindMapMain",
  components: {
    Thumbnail, Style
  },
  computed: {
    ...mapGetters({
      minder: "getMinder",
      editor: "getEditor",
      selectedNode: "getSelectedNode",
      hasRedo: "getHasRedo",
      hasUndo: "getHasUndo",
    }),
    isWindow(){
       return  /windows|win32/i.test(window.navigator.userAgent)
    }
    
  },
  props: {
    json: {
      type: JSON,
      default: {
        root: {
          data: {
            id: "1",
            text: "Central Topic",
          },
          children: [
            {
              data: {
                text: "Branch Topic",
                id: "2",
              },
              children: [],
            },
            {
              data: {
                text: "Branch Topic",
                id: "3",
              },
              children: [],
            },
            {
              data: {
                text: "Branch Topic",
                id: "4",
              },
              children: [],
            },
          ],
          template: "right",
          version: "1.5.0"
        },
      },
    },
    tempJson: {
      type: JSON,
      default: {
      }
    },
  },
  watch: {
    tempJson: function (val) {
      this.minder.setOption("AutoAlignment", false)
      this.minder.importJson(JSON.parse(this.tempJson));
      console.log("JSON.parse(this.tempJson)",JSON.parse(this.tempJson).template);
      console.log("JSON.parse(this.tempJson)",JSON.parse(this.tempJson).template);
      this._initRightIntro(JSON.parse(this.tempJson))
      this.minder.setOption("AutoAlignment", true)
      this.pdd = this.minder.getTheme()
    },
    minderLength: function (params) {
      this.minderLength =  this.minder.getSelectedNodes().length
    },
    'minder._selectedNodes'(){
       if(this.minder.getSelectedNode()){
      this.summary = (this.minder.getSelectedNode().getLevel() !== 0 && this.selectedNode && !this.minder.getSelectedGeneralize())
      this.aboutLine = ( this.selectedNode && !this.minder.getSelectedRelLine())
      }else{
        this.summary = false
        this.aboutLine = false
      }
    },
    selectedNode(){
     
    }
  },
  data () {
    return {
      minder: null,
      previewer: null,
      paper: null,
      nodeThumb: null,
      connectionThumb: null,
      visibleRect: null,
      contentView: null,
      visibleView: null,
      pathHandler: null,
      lastAddNode: '',
      handRightStatus: false,
      rightNowStrp: 'pen',
      summary:false,
      aboutLine:false,


      handRightOptions: [
        { id: "tree", defaultURL: require("./mainImgs/tree.svg"), clickURL: require("./mainImgs/treeClick.svg"), status: false, content:'Layout' },
        { id: "pen", defaultURL: require("./mainImgs/pen.svg"), clickURL: require("./mainImgs/penClick.svg"), status: false, content:'Style' },
        { id: "function", defaultURL: require("./mainImgs/function.svg"), clickURL: require("./mainImgs/functionClick.svg"), status: false, content:'Theme' },
      ],

      treeOptions: [
        { id: "right", defaultURL: require("./mainImgs/tree2_1.png"), status: true, intro: "Logic Chart-Right" },
        { id: "left", defaultURL: require("./mainImgs/tree2_2.png"), status: false, intro: "Logic Chart-Left" },
        { id: "mind-right", defaultURL: require("./mainImgs/tree2_3.png"), status: false, intro: "Left and Right" },
        { id: "top", defaultURL: require("./mainImgs/tree2_4.png"), status: false, intro: "Org Chart" },
        { id: "filetree-right-bottom", defaultURL: require("./mainImgs/tree2_5.png"), status: false, intro: "Tree Chart" },
        { id: "fish-bone-right", defaultURL: require("./mainImgs/tree2_6.png"), status: false, intro: "Fishbone Chart" },
        { id: "line-right", defaultURL: require("./mainImgs/tree2_7.png"), status: false, intro: "Timeline Chart" },
      ],

      functionOptions: [
        { id: 'default', defaultURL: require("./mainImgs/theme1.png"), status: true },
        { id: 'verdant', defaultURL: require("./mainImgs/theme2.png"), status: false },
        { id: 'jianyue1', defaultURL: require("./mainImgs/theme3.png"), status: false },
        { id: 'shangwu1', defaultURL: require("./mainImgs/theme4.png"), status: false },
        { id: 'shengse3', defaultURL: require("./mainImgs/theme5.png"), status: false },
        { id: 'shengse4', defaultURL: require("./mainImgs/theme6.png"), status: false },
      ]

    };
  },
  created () {
    // this.minder.setOption("AutoAlignment", true)
  },
  beforeMount () {
    window.parentMounted = this._isMounted;
  },
  mounted () {
    this.register();
    this.init();
    // this.minder.setOption("AutoAlignment", true)
  },
  methods: {
    ...mapMutations([
      "setMinder",
      "setEditor",
      "setHasRedo",
      "setHasUndo",
      "setSelectedNode",
    ]),
    
    _initRightIntro(data){
      console.log(data);
     if( data.template === 'default' || data.template === 'right-tapared') data.template =  'right'  
      this.treeOptions.forEach(item=>{
        if(item.id === data.template){
          item.status = true
        }else{
          item.status = false
        }
      })
      this.functionOptions.forEach(item=>{
        if(item.id === data.theme){
          item.status = true
        }else{
          item.status = false
        }
      })
      
    },
    init () {
      var editor = (window.editor = new window.kityminder.Editor(
        document.querySelector("#minder-container")
      ));
      window.minder = window.km = editor.minder;
      this.setEditor(editor);
      this.setMinder(editor.minder);
      this.minder = editor.minder;

      this.minder.execCommand("Template", "right")
      this.addClickTips("right")
      window.editor.history.reset();
      this.minder.on("contentchange", this.contentchange);
      this.minder.on("selectionchange", this.selectionchange);
      window.parentMounted = this._isMounted;

    },
    register () {
      // window.kityminder.Theme.register("newDefault", newDefault);
      // window.kityminder.Theme.register("right");
      // newRight();
      // newLeft();
    },
    async contentchange () {
      this.minder.getRoot().renderTree();
      this.minder.layout(300)
      let json = JSON.parse(window.localStorage.getItem(this.$parent.UUID));
      if (!json) {
        this.$parent.$refs.header.saveColor = "red";
        return;
      }
      json.updateTime = moment().format("YYYY/MM/DD HH:mm:ss");
      json.json = await this.minder.exportData("json");
      this.minder.useTemplate("right")
      if (json.isFirstChangeRootText) {
        if (this.minder.getRoot().data.text != "Central Topic") {
          json.name = this.minder.getRoot().data.text;
          if (json.name.length >= 50) {
            json.name = json.name.substring(0, 49);
          }
          if (json.name == "") {
            json.name = "Unnamed";
          }
          json.name = json.name.replace(/[\\:*?"<>/|]/g, "_");
          this.$parent.$refs.header.projectName = json.name;
          json.isFirstChangeRootText = false;
        }
      }
      this.setHasRedo(window.editor.history.hasRedo());
      this.setHasUndo(window.editor.history.hasUndo());

      clearInterval(this.timer);
      this.timer = null;
      this.timer = setTimeout(() => {
        this.$parent.$refs.header.saveColor = "";
      }, 3000);
      if (tool.getLocalStorageAllSize() >= 2) {
        this.$parent.$refs.header.saveColor = "red";
        return;
      } else {
        this.$parent.$refs.header.saveColor = "green";
      }
      window.localStorage.setItem(this.$parent.UUID, JSON.stringify(json));
    },
    selectionchange () {
      if (this.minder.getSelectedNode()) {
        this.setSelectedNode(true);
      } else {
        this.setSelectedNode(false);
      }
    },
    async addEqualityNode () {
      if ((Date.now() - this.lastAddNode) < 300) {
        return;
      }
      this.lastAddNode = Date.now();
      var i =  (this.minder.getSelectedNode().getLevel() == 1 || this.minder.getSelectedNode().getLevel() == 0 ) ? "Branch Topic" : "Sub Topic"
      this.minder.execCommand("AppendSiblingNode", i);
    },
    async addChildNode () {
      if ((Date.now() - this.lastAddNode) < 300) {
        return;
      }
      this.lastAddNode = Date.now();
      var i =  this.minder.getSelectedNode().getLevel() == 0 ? "Branch Topic" : "Sub Topic"
      this.minder.execCommand("AppendChildNode", i);
    },
    async addRelineShipe() {
      this.minder.execCommand("appendrelline")
    },
    async addGeneralize() {
      this.minder.execCommand("addGeneralize");
    },
    undo () {
      this.editor.history.undo();
      this.setHasRedo(window.editor.history.hasRedo());
    },
    redo () {
      this.editor.history.redo();
    },
    addClickTips (name) {
      this.minder._currentTemplate = name
    },

    handTreeClick (id, treeOptions) {
      treeOptions.forEach(item => {
        if (item.id === id) {
          item.status = true
        } else {
          item.status = false
        }
      })
      this.minder.execCommand("template", id)
      this.addClickTips(id)
    },
    // 打开弹窗
    handRightItemClick (id, options) {
      options.forEach(item => {
        if (item.id === id) {
          item.status = !item.status
        } else {
          item.status = false
        }
      })
      this.minder.execCommand("connectWidth", 2)
      this.minder.execCommand("theme", id)
      "shengse3" == id && this.toSetTemplate_tapared(),
        "shengse3" !== id && this.toSetTemplate(),
        this.isUseTheme()
    },

    isUseTheme () {
      this.minder.setOption("setConnetRadius", "no")
    },
    toSetTemplate () {
      var e = this.minder.getTemplate() || "right";
      e && -1 != e.indexOf("tapared") && this.minder.execCommand("template", this.minder._currentTemplate || "right")
    },
    toSetTemplate_tapared () {
      var e = this.minder._currentTemplate || "right";
      "right" == e || "left" == e || "top" == e || "bottom" == e ? this.minder.execCommand("template", e + "-tapared") : "mind-right" == e || "mind-left" == e ? "mind-right" == e ? this.minder.execCommand("template", "mind-tapared-right") : this.minder.execCommand("template", "mind-tapared-left") : "mind-top" == e ? this.minder.execCommand("template", "mind-tapared-top") : this.minder.execCommand("template", "mind-tapared-bottom")
    },

    handRightItemClickCopy (id, treeOptions) {
      this.rightNowStrp = id
      this.handRightStatus = true
      treeOptions.forEach(ele => {
        if (ele.id === id) {
          ele.status = true
        } else {
          ele.status = false

        }
      })
    },
    // 关闭弹窗
    itemStatusClose () {
      this.handRightStatus = false
      this.handRightOptions.forEach(ele => {
        ele.status = false
      })
    },
  },
};
</script>
<style lang="less">
.el-popover.popoverStyle {
  box-shadow: 0px 4px 15px rgba(174, 194, 255, 0.2);
  padding: 0px;
  border-radius: 16px;
  .el-input__inner:focus {
    border-color: #5452f6;
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-color: #dcdfe6;
  }
  .el-select .el-input__inner:focus {
    border-color: #dcdfe6;
  }
  .popper__arrow {
    right: 0;
  }
}
</style>
<style scoped lang="less">
.MindMapMain {
  width: 100%;
  height: 100%;
  position: relative;
}
#minder-container {
  height: 100%;
  width: 100%;
}
.handle {
  position: absolute;
  width: 60px;
  height: 368px;
  left: 24px;
   top: 70%;
  transform: translateY(-100%);
  background: #ffffff;
  box-shadow: 0px 4px 15px rgba(174, 194, 255, 0.2);
  border-radius: 40px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 22px 0;
}
.handle img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
}
.handle img:hover {
  background: #f0f0f0;
}

.handRight {
  position: absolute;
  width: 60px;
  height: 180px;
  right: 24px;
  top: 60%;
  transform: translateY(-100%);
  background: #ffffff;
  box-shadow: 0px 4px 15px rgba(174, 194, 255, 0.2);
  border-radius: 40px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 22px 0px;
}
.handRight img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
}
.handRight img:hover {
  background: #f0f0f0;
}
.handRightBox {
  width: 310px;
  min-height: 459px;
  box-sizing: border-box;
  padding: 16px 16px 24px;
  .handClose {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      color: #1d1d1f;
      font-size: 16px;
      font-weight: bold;
      font-family: Inter;
    }
    .cursor {
      cursor: pointer;
    }
  }
  .treeContend {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .treeSingle {
      width: 134px;
      height: 90px;
      background-color: #f2f4f8;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 5px;
      box-sizing: border-box;
      cursor: pointer;
      box-shadow: 4px 4px 5px #fff;
      > img {
        margin-bottom: 10px;
      }
      .singleIntro {
        font-size: 12px;
        font-family: Inter;
        color: #1d1d1f;
      }
    }
  }
  .treeSingle.active {
    box-shadow: #5452f6 0px 0px 0px 3px;
  }

  .functionContend {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .functionSingle {
      width: 134px;
      height: 90px;
      margin-top: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      box-sizing: border-box;
      box-shadow: 4px 4px 5px #fff;
      cursor: pointer;
      > img {
        // margin-bottom: 10px;
      }
      &:nth-child(1) {
        background-color: #f2f4f8;
      }
      &:nth-child(2) {
        background-color: #ffffff;
        border: 1px solid #e8e8e8;
      }
      &:nth-child(3) {
        background-color: #f2f4f8;
      }
      &:nth-child(4) {
        background-color: #f5f3ef;
      }
      &:nth-child(5) {
        background-color: #08073d;
      }
      &:nth-child(6) {
        background-color: #3f4c6b;
      }
    }
    .functionSingle.active {
      box-shadow: #5452f6 0px 0px 0px 3px;
    }
  }
}

.undo {
  cursor: pointer;
}
.redo {
  cursor: pointer;
}

.rightIIconSetting1 {
  margin-top: 18px;
}
.rightIIconSetting2 {
  margin-top: 18px;
}
</style>