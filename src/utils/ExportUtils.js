import JsPDF from 'jspdf'
export default {
    ExportPDF(res, fileName) {
        if (!fileName) {
            fileName = "Unnamed"
        }
        let newImage = new Image();
        newImage.src = res;
        newImage.onload = () => {
            console.log(newImage.width, newImage.height);
            var doc;
            if (newImage.width > newImage.height) {
                doc = new JsPDF("l", "pt", [newImage.width, newImage.height]);
            } else {
                doc = new JsPDF("p", "pt", [newImage.width, newImage.height]);
            }
            doc.addImage(res, "png", 0, 0, newImage.width, newImage.height);
            doc.save(fileName + ".pdf");
        };
    },
    ExportImg(base64, fileType, fileName) {
        if (!fileName) {
            fileName = "Unnamed"
        }
        let blob = this.base64ToBlob(base64, fileType);
        this.downloadExportFile(blob, fileName, fileType);
    },
    base64ToBlob(urlData, type) {
        let arr = urlData.split(",");
        let array = arr[0].match(/:(.*?);/);
        let mime = (array && array.length > 1 ? array[1] : type) || type;
        let bytes = window.atob(arr[1]);
        let ab = new ArrayBuffer(bytes.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], {
            type: mime,
        });
    },
    downloadExportFile(blob, fileName, fileType) {
        let downloadElement = document.createElement("a");
        let href = blob;
        if (typeof blob == "string") {
            downloadElement.target = "_blank";
        } else {
            href = window.URL.createObjectURL(blob);
        }
        downloadElement.href = href;
        downloadElement.download = fileName + "." + fileType;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        if (typeof blob != "string") {
            window.URL.revokeObjectURL(href);
        }
    },
    async ExportPDmind(res, fileName) {
        // var zip = new JSZip();
        // zip.file( fileName+".PDmind", res);
        // zip.generateAsync({
        //     type: "blob"
        // }).then(function (content) {
        //     saveAs(content,"a.zip");
        // });
        if (!fileName) {
            fileName = "Unnamed"
        }
        var export_blob = new Blob([res]);
        var save_link = document.createElement("a");
        save_link.href = window.URL.createObjectURL(export_blob);
        save_link.download = fileName + ".PDmind";
        this.fakeClick(save_link);
    },
    fakeClick(obj) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent(
            "click",
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
        );
        obj.dispatchEvent(ev);
    },
}