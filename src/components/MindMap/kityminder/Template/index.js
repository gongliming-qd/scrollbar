function newRight() {
    window.kityminder.Template.register("newRight", {
        getLayout: function (node) {
            return node.getData("layout") || "right";
        },
        getConnect: function () {
            return 'bezier';
        },
    });
}
function newLeft() {
    window.kityminder.Template.register("newLeft", {
        getLayout: function (node) {
            return node.getData("layout") || "left";
        },
        getConnect: function () {
            return 'bezier';
        },
    });
}
export {
    newRight,newLeft
}