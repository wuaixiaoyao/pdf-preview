function serilizeURL(url) {
    var rs = "";
    try {
        rs = url.split("?")[1];
    } catch (err) {

    }
    var arr = [];
    try {
        arr = rs.split("&")
    } catch (err) {

    }
    var param = {};
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].indexOf("=") != -1) {
            param[arr[i].split("=")[0]] = arr[i].split("=")[1];
        } else {
            param[arr[i]] = "undefined";
        }
    }
    return param
}
var vConsole = new VConsole();
var params = serilizeURL(location.search)
var url = params.pdfUrl;
console.log("url  :" + url)
PDFJS.cMapUrl = 'https://unpkg.com/pdfjs-dist@1.9.426/cmaps/';
PDFJS.cMapPacked = true;
var u = navigator.userAgent;
var isChromeWithRangeBug = /Chrome\/(39|40)\./.test(navigator.userAgent);
var isIPhone = /iPhone/.test(navigator.userAgent);
var isIPad = /iPad/.test(navigator.userAgent);
var isSafari = u.indexOf('Safari') > -1;
if (isSafari || isChromeWithRangeBug) {
    if (isSafari || isChromeWithRangeBug || isIPhone || isIPad) {
        PDFJS.disableRange = true;
        PDFJS.disableStream = true;
    }
}
var pdfDoc = null;
var loadPageNum = 0; //已经加载页码
function createPage(num) {
    var div = document.createElement("div");
    var canvas = document.createElement("canvas");
    var pageView = document.createElement("div");
    pageView.innerHTML = `第${num}页`;
    pageView.classList.add("num-view")
    div.appendChild(canvas)
    div.appendChild(pageView)
    document.body.appendChild(div);
    return canvas;
}

function renderPage(num) {
    pdfDoc.getPage(num).then(function (page) {
        var viewport = page.getViewport(2.0);
        var canvas = createPage(num);
        var ctx = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({
            canvasContext: ctx,
            viewport: viewport
        }).promise.then(function () {
            loadPageNum++;
            if (pdfDoc.numPages === loadPageNum) console.log("加载完成")
            console.log(loadPageNum)

        });
    });
}
try {
    PDFJS.getDocument({
        url: url,
        rangeChunkSize: 65536 * 2
    }).then(function (pdf) {
        pdfDoc = pdf;
        console.log(pdfDoc)
        document.getElementById("notice").innerText = url + "共" + pdfDoc.numPages + "页";
        for (var i = 1; i <= pdfDoc.numPages; i++) {
            renderPage(i)
        }
    });
} catch (err) {
    console.log(url + "解析失败" + err)

}