import pako from 'pako'

export default {
    //生成唯一uuid
    makeUUID() {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    //根据key值获取对应的本地缓存数据大小
    getLocalStorageSize(key) {
        const item = localStorage.getItem(key);
        let size = JSON.stringify(item).length * 2;
        const arr = ['bytes', 'KB', 'MB', 'GB', 'TB'];
        let sizeUnit = 0;
        while (size > 1024) {
            size /= 1024;
            ++sizeUnit;
        }
        return {
            size: size,
            sizeUnit: arr[sizeUnit]
        }
    },
    //获取当前域名下本地缓存总大小
    getLocalStorageAllSize() {
        var storage = window.localStorage;
        var size = 0;
        for (var i = 0; i < storage.length; i++) {
            var key = storage.key(i);
            if (storage.getItem(key).indexOf("name")) {
                var item = localStorage.getItem(key);
                size += JSON.stringify(item).length * 2;
            }
        }
        return (size / 1024 / 1024).toFixed(2)
    },
    //获取文件大小 返回MB保留两位小数
    getFileSize(e) {
        var size = JSON.stringify(e).length * 2;
        return (size / 1024 / 1024).toFixed(2)
    },
    //url图片转base64
    getBase64Image(imageUrl) {
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.crossOrigin = '';
            image.src = imageUrl;
            image.onload = function () {
                var base64 = this.imageToBase64(image);
                resolve(base64)
            }.bind(this)
        })
    },
    imageToBase64(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
    },
    unzip(b64Data) {
        var strData = atob(b64Data);
        var charData = strData.split('').map(function (x) {
            return x.charCodeAt(0);
        });
        var binData = new Uint8Array(charData);
        var data = pako.inflate(binData);
        strData = String.fromCharCode.apply(null, new Uint16Array(data));
        return decodeURIComponent(strData);
    },
    zip(str) {
        var binaryString = pako.gzip(encodeURIComponent(str), {
            to: 'string'
        })
        return btoa(binaryString);
    },
    Uint8ArrayToString(array) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    out += String.fromCharCode(c);
                    break;
                case 12:
                case 13:
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    },
    LTrim(str) {
        var i;
        for (i = 0; i < str.length; i++) {
            if (str.charAt(i) != " ")
                break;
        }
        str = str.substring(i, str.length);
        return str;
    },
    RTrim(str) {
        var i;
        for (i = str.length - 1; i >= 0; i--) {
            if (str.charAt(i) != " ")
                break;
        }
        str = str.substring(0, i + 1);
        return str;
    }

}