export default {
    //检测当前用户的浏览器类型
    CheckBrowser() {
        const explorer = navigator.userAgent;
		var Browser = null;
		if (!!window.ActiveXObject || "ActiveXObject" in window) {
		  Browser = 'ie';
		}
		if (window.document.documentMode) {
		  Browser = 'ie';
		}
		else if (explorer.indexOf("Firefox") >= 0) {
		  Browser = 'Firefox';
		}
		else if (explorer.indexOf("Chrome") >= 0) {
		  Browser = 'Chrome';
		}
		else if (explorer.indexOf("Opera") >= 0) {
		  Browser = 'Opera';
		}
		else if (explorer.indexOf("Safari") >= 0) {
		  Browser = 'Safari';
		}
		else if (explorer.indexOf("Netscape") >= 0) {
		  Browser = 'Netscape';
		}
        return Browser;
    }

}