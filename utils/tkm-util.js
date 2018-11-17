function ft(t) {
    return 1e4 <= t && t < 1e5 ? Math.round(t / 1e4 * 10) / 10 + "万" : 1e5 <= t ? Math.round(t / 1e4) + "万" : t;
}

function form_time(t) {
    var e = new Date(1e3 * parseInt(t));
    return e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate() + " " + (e.getHours() < 10 ? "0" : "") + e.getHours() + ":" + (e.getMinutes() < 10 ? "0" : "") + e.getMinutes();
}

function formatTime(t) {
    t.getFullYear();
    var e = t.getMonth() + 1, r = t.getDate(), n = t.getHours();
    t.getMinutes(), t.getSeconds();
    return e + "月" + r + "日" + n + "点";
}

function formatNumber(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}

function throttle(e, r) {
    null != r && null != r || (r = 1500);
    var n = null;
    return function() {
        var t = +new Date();
        (r < t - n || !n) && (e.apply(this, arguments), n = t);
    };
}

module.exports = {
    throttle: throttle,
    formatTime: formatTime,
    ft: ft
};