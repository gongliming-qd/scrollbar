<template>
  <div class="MindMapThumbnail">
    <div class="nav-previewer"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import "kity";
export default {
  name: "MindMapThumbnail",
  computed: {
    ...mapGetters({
      minder: "getMinder",
      editor: "getEditor",
    }),
  },
  data() {
    return {};
  },
  mounted() {
    let pMountedTimer = window.setInterval(() => {
      if (window.parentMounted) {
        window.clearInterval(pMountedTimer);
        this.init();
      }
    }, 500);
  },
  methods: {
    init() {
      this.editor.minder.on("layout layoutallfinish", this.updateContentView);
      this.editor.minder.on("viewchange", this.updateVisibleView);
      this.previewer = document.getElementsByClassName("nav-previewer");
      this.paper = new kity.Paper(this.previewer[0]);
      this.nodeThumb = this.paper.put(new kity.Path());
      this.connectionThumb = this.paper.put(new kity.Path());
      this.visibleRect = this.paper.put(
        new kity.Rect(100, 100).stroke("red", "1%")
      );
      this.contentView = new kity.Box();
      this.visibleView = new kity.Box();
      this.pathHandler = this.getPathHandler(this.editor.minder.getTheme());
      this.editor.minder.on(
        "themechange",
        function (e) {
          this.pathHandler = this.getPathHandler(e.theme);
        }.bind(this)
      );
      this.updateContentView();
      this.navigate();
    },
    getPathHandler(theme) {
      switch (theme) {
        case "tianpan":
        case "tianpan-compact":
          return function (nodePathData, x, y, width, height) {
            var r = width >> 1;
            nodePathData.push("M", x, y + r, "a", r, r, 0, 1, 1, 0, 0.01, "z");
          };
        default: {
          return function (nodePathData, x, y, width, height) {
            nodePathData.push(
              "M",
              x,
              y,
              "h",
              width,
              "v",
              height,
              "h",
              -width,
              "z"
            );
          };
        }
      }
    },
    moveView(center, duration) {
      var box = this.visibleView;
      center.x = -center.x;
      center.y = -center.y;
      var viewMatrix = this.editor.minder.getPaper().getViewPortMatrix();
      box = viewMatrix.transformBox(box);
      var targetPosition = center.offset(box.width / 2, box.height / 2);
      this.editor.minder.getViewDragger().moveTo(targetPosition, duration);
    },
    navigate() {
      var dragging = false;
      this.paper.on(
        "mousedown",
        function (e) {
          dragging = true;
          this.moveView(e.getPosition("top"), 200);
        }.bind(this)
      );
      this.paper.on(
        "mousemove",
        function (e) {
          if (dragging) {
            this.moveView(e.getPosition("top"));
          }
        }.bind(this)
      );
      this.paper.on(
        "mouseup",
        function () {
          dragging = false;
        }.bind(this)
      );
    },
    updateContentView() {
      var view = this.minder.getRenderContainer().getBoundaryBox();
      this.contentView = view;
      var padding = 30;
      this.paper.setViewBox(
        view.x - padding - 0.5,
        view.y - padding - 0.5,
        view.width + padding * 2 + 1,
        view.height + padding * 2 + 1
      );
      var nodePathData = [];
      var connectionThumbData = [];
      this.minder.getRoot().traverse(
        function (node) {
          var box = node.getLayoutBox();
          this.pathHandler(nodePathData, box.x, box.y, box.width, box.height);
          if (node.getConnection() && node.parent && node.parent.isExpanded()) {
            connectionThumbData.push(node.getConnection().getPathData());
          }
        }.bind(this)
      );
      this.paper.setStyle("background", this.minder.getStyle("background"));
      if (nodePathData.length) {
        this.nodeThumb
          .fill(this.minder.getStyle("root-background"))
          .setPathData(nodePathData);
      } else {
        this.nodeThumb.setPathData(null);
      }
      if (connectionThumbData.length) {
        this.connectionThumb
          .stroke(this.minder.getStyle("connect-color"), "0.5%")
          .setPathData(connectionThumbData);
      } else {
        this.connectionThumb.setPathData(null);
      }
      this.updateVisibleView();
    },
    updateVisibleView() {
      this.visibleView = this.minder.getViewDragger().getView();
      this.visibleRect.setBox(this.visibleView.intersect(this.contentView));
    },
  },
};
</script>

<style scoped>
</style>
