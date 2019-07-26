const ipcRenderer = require('electron').ipcRenderer
const tmp = require('tmp')
const fs = require('fs')
const { exec, spawn } = require('child_process');
const moment = require('moment');
const secondsToTime = (s) => {
    let momentTime = moment.duration(s, 'seconds');
    let sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds();
    let min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes();

    return `${min}:${sec}`;
};
var openvpn;

webpackJsonp([1], {
    "2RBW": function(t, e) {},
    "7MxI": function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACO0lEQVR4Xu2a4U3EMAxG7QmADWATRjg2OCaDDWAERoEJOCYwitRKVblrnPizk6PhDxK9GL9X+9pEZtr5D++cn4aAUQE7NzBaYOcFML4Esy0gIo9E9DZVyjMzv/dcNSJyIKKXKccnZv7Yylcj4JuIbhdBkoTXHiWIyHEBn1I8MfOdVcCJiG5WQbqTcAY+pfzDzMub98eFpgJSSc0tsAzQjYQL8CnX1AKbLZsVkKJs/IPmEqy5qQT0KsEKn7jUAnqTgIAvFtCLBBR8lYDWEpDw1QJaSUDDmwRES/CANwuIkuAFDxHgLcETHibAS4I3PFQAWkIEPFwASkIUvIsAq4RIeDcBtRKi4V0FlEpoAe8uQCuhFXyIgJyEdH11jDX9iULOGoq2w3NmNb837vK5cCHwYRUwEyolhMGHC8i0Q7ocCj8ElB6J1fT+cs2uW0AJH/oECGuBref8v38Mal5yNJ+xtt+l9a7vASVgJZ9FynATUANUs8Yqw0WABcSytkYGXAACABFDKwMqAJk4MtaWDJgAj4Q9Yq5lQAR4JuoZG/Ii5J1g7jzBOq5jqoAIeMVW2rSDrBYQCe8poUpAC3gvCcUCWsJ7SCgS0AM8WoJaQE/wSAkqAT3CoyRkBUyzt/sdlBSR9axwk9Pb3ObmQpV+MvODaS8gIutZYdOLRw7Ecv2MhC9mvrcKSOPy87ztMTd7awFArJ1adp5mP5jH5RFJ9Rwj+yXYc/KI3IYAhMVrjjEq4JrvHiL3UQEIi9cc4xcb87pQO34T0wAAAABJRU5ErkJggg=="
    },
    "7Ogj": function(t, e, n) {
        t.exports = "assets/icons/logo_cloud.png"
    },
    "8Hz4": function(t, e) {},
    "8f4G": function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABAElEQVRoQ+3Y0Q6DIAyF4fLk0ydn0UQzJyJwToEm9XKJ7v9avNiCGL+C8X5xwOgN+gZ8A+AE/AiBA4Rv9w3AIwQfYH8DMcZFRD7gIEbdvu4bMIpYQwjLeYSMIfb4bfiXd8AI4oy/AQwcp0t8EjAx4hb/CJgQkYzPAiZCPMa/AiZAZOOLAAMRr/HFgAGIovgqQEdEcXw1oAOiKr4JoIiojm8GKCCa4iEAEdEcDwMICCieAgAQcDwN0ICgxFMBFQhaPB1QgKDGqwAyCHq8GiCBUIlXBfwg5PgBvn3Gvuz/scWeSO/n+QZ6T/z/+3wDvgFwAn6EwAHCt/sG4BGCDzC/gS9IvXau0p3/jAAAAABJRU5ErkJggg=="
    },
    "9vrJ": function(t, e) {},
    EGi2: function(t, e) {},
    F2YU: function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAYAAADHl1ErAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAEuUlEQVR42u2cz2scZRjHP+9mg6VJUxBp0VREop4T6qFQPNibCAa9lFDBc7BQbwX/CGnU9NqL0grFWkrtrRcRKfgLRWitrQeVaEGjTdeQxu7Xw7yb7r77ZneenZlNNe8H9pB5532+z3wn8/5i3nGUgKRRYA54AXgW2OuLbgFfAZ8A55xzP5WhF9F/HHgZeA6YAfb4ot+Az4FLwGnn3HoV+tZkD0u6rv40JJ2U9GSJ2lM+ZiOH/nVJh7farLdzJBqyKul4CdrHJa0NoH9iq8xa6JHUbf/rxQVJuwbQ3S3pYp/Y/fQXhm3W7GZ3T9IhSbv876CkNyVd3eT8m5KeMug+LenHTWJd9VoH2/QP+ZxizA7LrBFJS4H4sqQDferN+/NCfpU0lUN3yp+riPZ8n7oHItpLkkaGYdhrkaSnc9adlHQ5Uv93Sft61Nvnzwm5LGkyp/Z0pP6rwzDso0B0cYAYpyLJX5NUj5w76stCTg2guxjEOFe1WU7SjUB0/4Cx3o2YcCFy3seR8wZqtCXtD+LclOSqNGxC2bCgxaqk8QLxPoiYMd9WPh8pP1NAbzyS/0SVhu1QZ+NZyDAf85uIKXX/KIZ8WVArNGxZ0o7KDPOiYXsy0CPZFu8xdQ9A35P0fnBsTdLeglrhI3mtUrO86NlA1NzoR2LOqT9zJeiEjf7ZYRh2JHIx0yXE/ayHWZ+WED82rDhSuWFe/LtAeFl9Bq45Yj4haT1yUevqMUbLGTs2cP12kFjOB3RA3sZ7DXgFOB0pWwDOky3p3DPmcge4SLZE1M4l4EVDfi1GyJZ6ZoFjkfI54EPgoVxGObcC4CS9BJwAHjEk8xfQ6643gKbxAptkJj8cHP/DX3zNGK8GjPUo/xnYbYh3C3jdSWoAO43JbFf+dJL+IbuDif4068DfQGtdSmSPkyoSdGSPSWs6YtUrWr9ovo1wstsAniFrgKtgHPie+w24Va9o/aL5EhrWdM4tVSQOsCKpvTOw6hWtXzTfrp7HaYBl47z42O2rAya9ovVLyNfcVW97kmFGkmFGQsPUmgJUgY9d5hBg6PmGvWRN0qNU202X+V899HxDw8bIxh1VDwTLYuj51umcR1pWLR4Ehp3vWI1suSaRj9t1snWht8heEap6rhbGL0rV+bXHz5Z3NpSzUW04d7pDuXO1MP4KMJm3p/M5/sL9xYKq89uI38pxo9H3B6qeq3XNzQpSdX5d8Tu6zKrnarG5WUGqzq8rfhrpG0mGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGUmGGalF/m7f7NAk27G7XQg399cJPAoNW6Xzvf2dQGnfpons3THtFSpaPwcTdG70WPOebNCxdcY5d1fSD2SfFgUYBc5IeoPsPfWihHt3rHuFitbvxR5g0V9zixvOubsdHoW1JB0F3okELONOPsib5GNvYx91znV8WyhmWA34ApguIYn/Ml8752bCg129pHOuCTwPXNnqjLeQK96DLnpuMpB0jOzbNTP8/z8Gco/sm0HnnXObfjLwX8YAfWxlVocKAAAAAElFTkSuQmCC"
    },
    FnU6: function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB6ElEQVRoQ+1ZPUrGQBScUe/hPRRF1FoQ7ezsLERtBG8gWPhhYaWNNoroPQS1sbHwAIIgCFqPBjawLGsg2Z9k8UsZwjIzbya77y1R+MPC8WNMILSCknYBTJPc67JWrxWQtAXg1AAfdSHRGwFJ2wBOHNX3SR61qUQvBBzla7xvAOZIvg6aQEzwFdGsFZC0CeDcUbiT8vUa2QgY8GeOaO8AZtraxhYgC4EG8PMkX9p43v02OYGU4JNnQNIGgEuPbYKVT54BA/4CwIRV9g8As6G2SZ6BBvALJJ9DPJ88AznBR8+ApHUA1x7bRFc+egYM+CsAk1aZP83xIKptomegAfwiyaeYno+egT7BB2dA0gqAO49tkisfnAFJqwBuHPDfAKrAPqS0TXAGjPK3AKasxb4ALJO8zwW+k4WGBP5/EqhYD6kKnY/TktbMrutuXEskH3PloDMBqxJl/kZrhYveyIZAIshCts+LPsw5lSjzOG2RqPpgXyuZpCeIZiHHTtlIJCFgfrG+iUQZTb1lp2qU6JvGDX+skotEMgs5mUhWiSwETCZ8k+kyhruWnewrpfp1GeP1VCSyWcjJRLRK9ELAZGIHwMjpGw5IHrbpJXojYEhUd8THBnBZ16xWJsq96G5jlb++7dVCYwK/CvwAcxr0MZqfXeoAAAAASUVORK5CYII="
    },
    GBVO: function(t, e) {
        t.exports = "data:image/png;base64,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"
    },
    GdEX: function(t, e) {},
    HNOJ: function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEV0lEQVR4Xu2a8VUUQQzGkwq0A6UCoQKxAqUCtQKhAqECsQKlAqEC7UCoQOgAKojvdy+rs3u77Oxk7g6OzXv3x76bm518k3z5JnMqT9z0ifsvMwBzBDxxBOYUeOIBMJPg2lLAzJ6LyCsR2ReRXRHhGeM5tV/+cCsilyLC85Wq8lzdVgqAmb0Ukbci8sGdjjgAGN9F5EJVryMTpb9dCQBm9l5EDis4PeQnYJyq6lkUiGoAeIh/8t1m59dhRMJxBIgqAJjZOxH5luT1OpxP3wEQR6p6PvXFIQA8x3G8S2RT11FrPAB8nEKYxQCYGcT2ZYO7PgQa1QIQsqKhCAAzw3FI7iEb3HAytsBJADjR/agQ8lciwg5R429VFVYXM2v0ASkFr6AbIjaaEtkAuPM/g6WNssXOZNVx55hT1xKlQADumyFeyAKggvM3lEdVbVTeJGfMjIhABL2Y9MP/gwdBGAWggvOE+/4UZu5z0tcBgKVp0QtCDgC/A2GPhievl8zVYnMuaMawSD7nqnox8Du+LwWBeQ/See8FwMyo8ZS7EiPsd7s776KJKjKmFnvFjUcCIJSmw1dV/VfBBgHwOg8ApQbxtHK+sHyi+Y/SRTgnQMilhk6AU/r7Ac6+f0pnF5EzVW1FjpnB5pwVSqy1a0xgZpQ4Tpolhljaoxr1RoCZgW5E3u6kpc7DHv0QsYNU3dXapCUAKky8RHxmRjSN5fwYONequtNJhQghMtVOHwDHIvJ5bDX3fH+iqsyxsApckr6qGwXRtR71AQBxvQ4A0CI/M4NsaJDUsBa3VCDDiz4ALLhSyGWh7T0CIjqiu5RLVd1L5kY/MH+pXVYHQFVbc5pZFNCWc7XnnwHoxk6FHeumQJSp0yW2KowfnyMpcDWTYE8ExEuLKqrv0ZZBBEtEBreY2isBB5vSw0uD5Y2qtsSUmUUrzLIQ8gVHtcDjlcIOQDQK1nEY4mxB37DE7pDmHNXXfRwuORH2nQQ5qK3uOJwQWETGkveUxNatrp8MAWKME2ioHHb7+94QIfdLD1ets0pOSyxSx5cIMQGX8OWDnG1aXPQPm5ZY78VGkPi4WW6lTQ4A3ONXb0ZOTdxVNWdHAXBSjIJAOtCGirTFac+Vhv1gZzoLgEogMA1hzS3ulIsRGqilbM87723LZwOQgIATkX4BUy3y3FPrrnM19szbcQ0/TM2WdDytdS5kBv9eMwmAhMBKylnEkZLftth+aIIiADwa6PoCBDv2kAyRw66v7no8iQRICa0QTYlaAI6GfPdFxRGQTuTiBiA2FQ3Fl69VAEgIkrTg2mlM5dXacRznun1xy1Ni1QDoREQDROkl5pgvlDauzIodb16wEgA6HEE5A5AoGDiNw9zwZumIMRT5fqUAdKICNYnu7/5VNiVQGLxpqePk4rq8VEE+KAByFrOJMWuLgE04l/POGYAclLZ5zBwB27y7Ob7NEZCD0jaPmSNgm3c3x7c5AnJQ2uYxfwHVjPZPc+QplAAAAABJRU5ErkJggg=="
    },
    "IfK+": function(t, e) {},
    K8NV: function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAqCAYAAAAu9HJYAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAlElEQVRYw+3RsQ2DMBBG4WfkkpI9GCUNXUZxYblgDlYgC2SGzMAGKaidDUwkijtL/2vvTvqkCxiXavkAc2tnsEb+k5BCektIIb3VBTLeOU61jMBysXasIb/NkMAEbBc7L+AWsot3Cymkt4QU0ltdIGOqZW/MzzXkpzkSeDTmX2sgdPJuIYX0lpBCektIIb0lpJDe+gEyVBC4JtjkcwAAAABJRU5ErkJggg=="
    },
    KLXt: function(t, e) {
        !function(t, e) {
            function n() {
                var e = a.getBoundingClientRect().width;
                e / c > 540 && (e = 540 * c);
                var n = e / 10;
                a.style.fontSize = n + "px",
                A.rem = t.rem = n
            }
            var s, i = t.document, a = i.documentElement, o = i.querySelector('meta[name="viewport"]'), r = i.querySelector('meta[name="flexible"]'), c = 0, u = 0, A = e.flexible || (e.flexible = {});
            if (o) {
                console.warn("灏嗘牴鎹凡鏈夌殑meta鏍囩鏉ヨ缃缉鏀炬瘮渚�");
                var l = o.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
                l && (u = parseFloat(l[1]),
                c = parseInt(1 / u))
            } else if (r) {
                var d = r.getAttribute("content");
                if (d) {
                    var p = d.match(/initial\-dpr=([\d\.]+)/)
                      , m = d.match(/maximum\-dpr=([\d\.]+)/);
                    p && (c = parseFloat(p[1]),
                    u = parseFloat((1 / c).toFixed(2))),
                    m && (c = parseFloat(m[1]),
                    u = parseFloat((1 / c).toFixed(2)))
                }
            }
            if (!c && !u) {
                var g = (t.navigator.appVersion.match(/android/gi),
                t.navigator.appVersion.match(/iphone/gi))
                  , f = t.devicePixelRatio;
                u = 1 / (c = g ? f >= 3 && (!c || c >= 3) ? 3 : f >= 2 && (!c || c >= 2) ? 2 : 1 : 1)
            }
            if (a.setAttribute("data-dpr", c),
            !o)
                if ((o = i.createElement("meta")).setAttribute("name", "viewport"),
                o.setAttribute("content", "initial-scale=" + u + ", maximum-scale=" + u + ", minimum-scale=" + u + ", user-scalable=no"),
                a.firstElementChild)
                    a.firstElementChild.appendChild(o);
                else {
                    var h = i.createElement("div");
                    h.appendChild(o),
                    i.write(h.innerHTML)
                }
            t.addEventListener("resize", function() {
                clearTimeout(s),
                s = setTimeout(n, 300)
            }, !1),
            t.addEventListener("pageshow", function(t) {
                t.persisted && (clearTimeout(s),
                s = setTimeout(n, 300))
            }, !1),
            "complete" === i.readyState ? i.body.style.fontSize = 12 * c + "px" : i.addEventListener("DOMContentLoaded", function() {
                i.body.style.fontSize = 12 * c + "px"
            }, !1),
            n(),
            A.dpr = t.dpr = c,
            A.refreshRem = n,
            A.rem2px = function(t) {
                var e = parseFloat(t) * this.rem;
                return "string" == typeof t && t.match(/rem$/) && (e += "px"),
                e
            }
            ,
            A.px2rem = function(t) {
                var e = parseFloat(t) / this.rem;
                return "string" == typeof t && t.match(/px$/) && (e += "rem"),
                e
            }
        }(window, window.lib || (window.lib = {}))
    },
    NFDQ: function(t, e) {},
    NHnr: function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = n("7+uW")
          , i = n("Dd8w")
          , a = n.n(i)
          , o = n("NYxO")
          , r = n("Zrlr")
          , c = n.n(r)
          , u = function t() {
            c()(this, t)
        };
        u.vpnShareTitle = "极云加速器",
        u.vpnShareContent = "快来加入我们吧",
        u.aliPayKey = "alipay_cn",
        u.unionPayKey = "unionpay_cn",
        u.e_res_title = "提示",
        u.e_res_content = "网络异常, 请尝试重新登录后再试",
        u.e_res_btn_text = "确定";
        var A = u
          , l = {
            data: function() {
                return {
                    country: "",
                    isIos: !1,
                    msgIns: {
                        title: "邀请有礼",
                        btnText: "立即邀请",
                        callBack: function() {
                            this.nativeShare()
                        }
                        .bind(this)
                    }
                }
            },
            computed: a()({}, Object(o.c)({
                headerType: "headerType",
                userInfo: "userInfo"
            })),
            mounted: function() {
                this.inviteCode = this.auth.getUserInfo().code || "0000",
                this.isIos = this.isIosWb,
                this.inviteCode
            },
            watch: {
                country: function() {
                    this.setInputCountry(this.country)
                }
            },
            methods: a()({}, Object(o.d)(["setHeadType", "setInputCountry"]), {
                fetchUserInfo: function() {
                    var t = this;
                    return this.axios.get("user-info").then(function(e) {
                        var n = e.data;
                        200 === n.status && (t.inviteCode = n.data.code)
                    })
                },
                toMenu: function() {
                    this.$router.push({
                        path: "/menu"
                    })
                },
                toLang: function() {
                    this.$router.push({
                        path: "/lang"
                    })
                },
                shareTo: function() {
                    this.$refs.shareModal.show()
                },
                back: function() {
                    history.go(-1)
                }
            }),
            components: {}
        }
          , d = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , s = t._self._c || e;
                return s("div", {
                    staticClass: "header-wrap",
                    class: t.isIos ? "compatibleStatusBar" : ""
                }, [0 !== t.headerType ? s("div", [s("msg-modal", {
                    ref: "shareModal",
                    attrs: {
                        msgIns: t.msgIns
                    }
                }, [s("div", {
                    staticClass: "invite-content"
                }, [s("p", [t._v("邀请您的好友使用 极云加速器，好友注册成功，您将免费获得3天的免费时长奖励，好友充值成功，您将获得相应的免费时长奖励。")]), t._v(" "), s("p", [t._v("好友越多送的越多!")]), t._v(" "), s("p", {
                    staticClass: "invite-info"
                }, [t._v("您的邀请码:")]), t._v(" "), s("p", {
                    staticClass: "invite-code"
                }, [t._v(t._s(this.userInfo.code))])])]), t._v(" "), s("nav", [1 === t.headerType ? s("div", [s("figure", {
                    staticClass: "left",
                    on: {
                        click: t.toMenu
                    }
                }, [s("img", {
                    attrs: {
                        src: n("zu1Y")
                    }
                })]), t._v(" "), s("figure", {
                    staticClass: "right",
                    on: {
                        click: t.shareTo
                    }
                }, [s("img", {
                    attrs: {
                        src: n("F2YU")
                    }
                })]), t._v(" "), s("figure", {
                    staticClass: "right_1",
                    on: {
                        click: t.toLang
                    }
                }, [s("img", {
                    attrs: {
                        src: "assets/icons/globe.png"
                    }
                })])]) : t._e(), t._v(" "), 2 === t.headerType ? s("div", [s("figure", {
                    staticClass: "left",
                    on: {
                        click: t.back
                    }
                }, [s("img", {
                    attrs: {
                        src: n("FnU6")
                    }
                })])]) : t._e(), t._v(" "), 3 === t.headerType ? s("div", [s("figure", {
                    staticClass: "left",
                    on: {
                        click: t.back
                    }
                }, [s("img", {
                    attrs: {
                        src: n("FnU6")
                    }
                })]), t._v(" "), s("div", {
                    staticClass: "searchInput"
                }, [s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.country,
                        expression: "country"
                    }],
                    attrs: {
                        type: "text",
                        placeholder: "输入国家名称快速检索"
                    },
                    domProps: {
                        value: t.country
                    },
                    on: {
                        input: function(e) {
                            e.target.composing || (t.country = e.target.value)
                        }
                    }
                })]), t._v(" "), t._m(0)]) : t._e()])], 1) :

				// t._e()
s("nav",[
s("div", [s("figure", {
	staticClass: "right_1",
	on: {
		click: t.toLang
	}
}, [s("img", {
	attrs: {
		src: "assets/icons/globe.png"
	}
})])])
])
				])
            },
            staticRenderFns: [function() {
                var t = this.$createElement
                  , e = this._self._c || t;
                return e("figure", {
                    staticClass: "right search-btn"
                }, [e("img", {
                    attrs: {
                        src: n("i0iQ")
                    }
                })])
            }
            ]
        };
        var p = n("VU/8")(l, d, !1, function(t) {
            n("xF0f")
        }, "data-v-04a04e46", null).exports
          , m = {
            data: function() {
                return {
                    name: "App",
                    msgIns: {
                        title: "提示",
                        content: "",
                        btnText: "确定"
                    }
                }
            },
            created: function() {},
            mounted: function() {
                var t = this;
                this.$refs.loading.show(),
                this.bus.$on("toast", function(e) {
                    return t.toast(e)
                }),
                this.bus.$on("loading", function(e) {
                    return t.$refs.loading[e ? "show" : "hide"]()
                }),
                this.axios.get("http://www.url.vpnjiekou.club/url/list").then(function(e) {
                    var n = e.data.data;
                    console.log(n),
                    t.axios.defaults.baseURL = n.api_url,
                    t.$refs.loading.hide()
                }).catch(function(e) {
                    return t.$refs.loading.hide()
                })
            },
            methods: {
                toast: function(t) {
                    return "string" == typeof t ? this.msgIns.content = t : this.msgIns = t,
                    this.$refs.errorModal.show()
                }
            },
            components: {
                Header: p
            }
        }
          , g = {
            render: function() {
                var t = this.$createElement
                  , e = this._self._c || t;
                return e("div", {
                    attrs: {
                        id: "app"
                    }
                }, [e("Header"), this._v(" "), e("msg-modal", {
                    ref: "errorModal",
                    attrs: {
                        msgIns: this.msgIns
                    }
                }, [e("div", {
                    staticClass: "invite-content"
                })]), this._v(" "), e("loading", {
                    ref: "loading"
                }), this._v(" "), e("transition", {
                    attrs: {
                        name: "slideX",
                        mode: "out-in"
                    }
                }, [e("router-view")], 1)], 1)
            },
            staticRenderFns: []
        };
        var f = n("VU/8")(m, g, !1, function(t) {
            n("NFDQ")
        }, null, null).exports
          , h = n("/ocq")
          , v = {
            data: function() {
                return {
                    countries: [],
                    countryListApi: "https://api.checkmobi.com/v1/countries",
                    defaultCountry: {}
                }
            },
            mounted: function() {
                var t = this;
                this.axios.get("http://api.6if5hq.cn/countries.json").then(function(e) {
                    t.countries = e.data.data.data,
                    t.defaultCountry = e.data.data.data.find(function(t) {
                        return "86" === t.prefix
                    }),
                    t.selectCountry(t.defaultCountry)
                })
            },
            props: {
                selectCountry: Function
            },
            methods: {
                toIndex: function() {
                    this.$router.push({
                        path: "/"
                    })
                },
                initBodyClickHide: function() {
                    var t = this;
                    return document.querySelector("body").addEventListener("click", function() {
                        t.selectCountry(t.defaultCountry)
                    })
                },
                loginOut: function() {
                    this.$router.push({
                        path: "/login"
                    })
                },
                getCountry: function(t) {
                    return this.selectCountry(t)
                }
            },
            destroyed: function() {},
            components: {}
        }
          , C = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , n = t._self._c || e;
                return n("div", {
                    staticClass: "country-wrap"
                }, [n("ul", t._l(t.countries, function(e, s) {
                    return n("li", {
                        key: s,
                        on: {
                            click: function(n) {
                                n.stopPropagation(),
                                t.getCountry(e)
                            }
                        }
                    }, [n("img", {
                        staticClass: "country-img",
                        attrs: {
                            src: e.flag_32
                        }
                    }), t._v(" "), n("span", {
                        staticClass: "country-name"
                    }, [t._v(" " + t._s(e.name.split(" ")[0]) + " ")]), t._v(" "), n("span", {
                        staticClass: "country-code"
                    }, [t._v(" +" + t._s(e.prefix) + " ")])])
                }))])
            },
            staticRenderFns: []
        };
        var w = n("VU/8")(v, C, !1, function(t) {
            n("gnAz")
        }, "data-v-19ea10d9", null).exports
          , y = n("MdTC")
          , I = n.n(y)
          , B = (n("GdEX"),
        {
            name: "MeScrollVue",
            data: function() {
                return {
                    mescroll: null,
                    lastScrollTop: 0,
                    lastBounce: null
                }
            },
            props: {
                up: Object,
                down: Object
            },
            mounted: function() {
                this.mescroll = new I.a(this.$refs.mescroll,{
                    up: this.up,
                    down: this.down
                }),
                this.$emit("init", this.mescroll)
            },
            methods: {
                beforeRouteEnter: function() {
                    var t = this;
                    this.mescroll && (this.lastScrollTop && (this.mescroll.setScrollTop(this.lastScrollTop),
                    setTimeout(function() {
                        t.mescroll.setTopBtnFadeDuration(0)
                    }, 16)),
                    null != this.lastBounce && this.mescroll.setBounce(this.lastBounce))
                },
                beforeRouteLeave: function() {
                    this.mescroll && (this.lastScrollTop = this.mescroll.getScrollTop(),
                    this.mescroll.hideTopBtn(0),
                    this.lastBounce = this.mescroll.optUp.isBounce,
                    this.mescroll.setBounce(!0))
                }
            }
        })
          , k = {
            render: function() {
                var t = this.$createElement
                  , e = this._self._c || t;
                return e("div", {
                    ref: "mescroll",
                    staticClass: "mescroll"
                }, [e("div", [this._t("default")], 2)])
            },
            staticRenderFns: []
        };
        var b = n("VU/8")(B, k, !1, function(t) {
            n("8Hz4")
        }, null, null).exports
          , E = n("wxAW")
          , S = n.n(E)
          , x = new (function() {
            function t() {
                c()(this, t)
            }
            return S()(t, [{
                key: "timeStamp2String",
                value: function(t) {
                    if (!t)
                        throw new Error("the param of time is not defined");
                    var e = new Date(1e3 * t);
                    return {
                        date: e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate(),
                        time: e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds()
                    }
                }
            }, {
                key: "toHHMMSS",
                value: function(t) {
                    var e = parseInt(t, 10)
                      , n = Math.floor(e / 3600)
                      , s = Math.floor((e - 3600 * n) / 60)
                      , i = e - 3600 * n - 60 * s;
                    return n < 10 && (n = "0" + n),
                    s < 10 && (s = "0" + s),
                    i < 10 && (i = "0" + i),
                    n > 0 ? n + ":" + s + ":" + i : s + ":" + i
                }
            }]),
            t
        }())
          , G = {
            data: function() {
                return {
                    msg: "等待连接",
                    connectFailMsg: "连接失败",
                    btnMsgIns: {
                        startConnect: "开始连接",
                        stopConnect: "断开连接"
                    },
                    btnMsg: "开始连接",
                    loadFinish: !0,
                    currentLine: {
                        name: "",
                        area: {}
                    },
                    lineId: 0,
                    defaultLine: 1,
                    width: 22,
                    connecting: !1,
                    connectTime: "00:00",
                    connectSecond: 0,
                    connectTimeInterval: "",
                    key: {
                        ca: "",
                        tls: ""
                    },
                    msgIns: {
                        title: "使用向导",
                        btnText: "去设置",
                        callBack: function() {
                            android.openSetting()
                        }
                    },
                    mescroll: null,
                    mescrollDown: {
                        callback: this.mescrollDownCallBack
                    }
                }
            },
            mounted: function() {
                this.ifShowIosOpe(),
                this.registerAndroidCallEve(),
                this.resetLastLine(),
                this.isAndroid && (this.initBtnStatus(),
                this.checkAppUpdate()),
                this.$route.query.id ? this.lineId = this.$route.query.id : this.lineId = this.getCurrentLineId()
            },
            components: {
                MescrollVue: b
            },
            methods: a()({}, Object(o.b)(["fetchUserInfo", "fetchVpnInfo"]), Object(o.d)(["setToast"]), {
                ifShowIosOpe: function() {
                    this.isIosWb
                },
                mescrollInit: function(t) {
                    this.mescroll = t,
                    this.$setMescroll(t)
                },
                checkAppUpdate: function() {
                    var t = this;
                    return this.axios.get("version").then(function(e) {
                        var n = e.data;
                        if (200 === n.status) {
                            var s = android.getAppVersionCode();
                            if (!s)
                                return;
                            if (s >= n.data.versionCode)
                                return;
                            var i = {
                                title: "升级",
                                content: "是否升级到" + n.data.versionName + "版本",
                                btnText: "确认",
                                callBack: function() {
                                    android.updateApp(n.data.downloadPath)
                                }
                            };
                            t.bus.$emit("toast", i)
                        }
                    })
                },
                resetLastLine: function() {
                    this.lastLineId = this.getCurrentLineId()
                },
                initBtnStatus: function() {
                    var t = android.getVpnLastLog();
                    t.trim() ? t.indexOf("No process") > -1 ? this.stopConnect() : t.indexOf("SUCCESS") > -1 && android.vpnConnected() ? (this.btnMsg = this.btnMsgIns.stopConnect,
                    this.msg = "connected") : (this.btnMsg = this.btnMsgIns.startConnect,
                    this.msg = t) : (this.btnMsg = this.btnMsgIns.startConnect,
                    this.msg = "等待连接")
                },
                registerAndroidCallEve: function() {
                    var t = this;
                    window.setStatus = function(e) {
                        t.msg = e,
                        t.btnMsg = "等待连接" === t.msg ? "开始连接" : t.btnMsgIns.stopConnect,
                        e.indexOf("connected") > -1 ? t.connecting = !1 : t.isIosWb && e.indexOf("等待连接") > -1 && (t.connecting = !1)
                    }
                    ,
                    window.startConectAfterPermission = function() {
                        t.connecting = !0
                    }
                    ,
                    window.updateTimer = function(e) {
                        t.connectTime = x.toHHMMSS(e)
                    }
                },
                initLineChoose: function() {
                    var t = this;
                    if (this.loadFinish = !0,
                    this.lineId) {
                        console.log("linesvuex", this.vpnLines.find(function(e) {
                            return e.id == t.lineId
                        }));
                        var e = this.vpnLines.find(function(e) {
                            return e.id == t.lineId
                        });
                        if (e) {
                            this.currentLine = e;
                            var n = this.getCurrentLineId();
                            return void (this.currentLine.id != n && (this.isAndroid && (android.stopVpn(),
                            this.stopConnect()),
                            this.saveCurrentLineId(this.currentLine.id)))
                        }
                    }
                    this.currentLine = this.vpnLines[0],
                    this.lineId = this.currentLine.id,
                    this.saveCurrentLineId(this.lineId)
                },
                saveCurrentLineId: function(t) {
                    return localStorage.setItem("currentLineId", t)
                },
                getCurrentLineId: function() {
                    return localStorage.getItem("currentLineId")
                },
                toPurchase: function() {
                    this.$router.push({
                        path: "/purchase"
                    })
                },
                toServerList: function() {
                    this.$router.push({
                        path: "/servers",
                        query: {
                            id: this.lineId
                        }
                    })
                },
				countstart : function() {
					this.timer = setInterval(()=>{
						this.connectSecond = 1 + parseInt(this.connectSecond);
						this.connectTime = secondsToTime(this.connectSecond);
					},1000);
				},
                resetConnectTime: function() {
                    this.connectTime = "00:00",
                    this.connectSecond = 0
                },
                if_expire: function() {
                    return console.log(1e3 * this.userInfo.endtime),
                    (new Date).getTime() > 1e3 * this.userInfo.endtime
                },
                connectVpn: function() {
                    if (this.isAndroid) {
                        this.resetConnectTime(),
                        this.lineId = this.lineId || this.defaultLine;
                        var t = this.btnMsg === this.btnMsgIns.startConnect ? "connect" : "disconnect";
                        if ("disconnect" === t)
                            this.btnMsg = this.btnMsgIns.startConnect,
                            this.connecting = !1,
                            this.stopConnect(),
                            this.isAndroid && android.stopVpn();
                        else {
                            if (this.if_expire())
                                return void this.$router.push({
                                    path: "/purchase"
                                });
                            if (this.btnMsg = this.btnMsgIns.stopConnect,
                            this.isAndroid) {
                                if (!this.vpnConfig.ca || !this.currentLine)
                                    return void android.toast("vpn 正在初始化..., 请稍后再连");
                                android.launchVpn(t, this.lineId, this.auth.getNamePassword().name, this.auth.getNamePassword().password, this.vpnConfig.ca, this.vpnConfig.ca_key, this.currentLine.ip, this.currentLine.port)
                            }
                        }
                    } else { //Windows
                        this.resetConnectTime(),
                        this.lineId = this.lineId || this.defaultLine;
                        var t = this.btnMsg === this.btnMsgIns.startConnect ? "connect" : "disconnect";
                        if ("disconnect" === t) {
                            this.btnMsg = this.btnMsgIns.startConnect,
                            this.connecting = !1,
                            this.stopConnect(),
              ipcRenderer.send('rem-pid-msg', openvpn.pid);
							openvpn.kill('SIGINT'),
							clearInterval(this.timer);
						}  else {
                if (this.if_expire())
                    return void this.$router.push({
                        path: "/purchase"
                    });
                if (this.btnMsg = this.btnMsgIns.stopConnect) {
                    if (!this.vpnConfig.ca || !this.currentLine)
                        return void android.toast("vpn 正在初始化..., 请稍后再连");


								var tmpobj = tmp.fileSync();
								var servername = __dirname + "/ovpn/";

								fs.writeFileSync(tmpobj.fd, `${this.auth.getNamePassword().name}\n${this.auth.getNamePassword().password}`)

								console.log('starting openvpn')
								servername += this.currentLine.name;
								servername += ".ovpn";
								this.msg = "正在连接 ...";

								openvpn = spawn(__dirname + "/vpn/openvpn", ["--config", servername, "--auth-user-pass", tmpobj.name])
                ipcRenderer.send('add-pid-msg', openvpn.pid);

								openvpn.stdout.on('data', (data) => {
									console.log(data);

									if (data.indexOf("Completed") > -1)
									{
										this.msg = "连接成功";
										this.countstart();
									}
									else {
										this.msg = "正在连接 ...";
									}
								});

								openvpn.stderr.on('data', (data) => {
									console.log(data);
								});

								openvpn.on('connect', (code) => {
									console.log('连接成功');
								});

								openvpn.on('close', (code) => {
									console.log(`child process exited with code ${code}`);
									hide(disconnectButton)
									show(credentialsForm)
								});

							}
                        }
					}
                },
                ifCanConnect: function() {
                    return "等待连接" === this.msg || "Connected Success" === this.msg
                },
                stopConnect: function() {
                    this.btnMsg = this.btnMsgIns.startConnect,
                    this.msg = "等待连接"
                },
                mescrollDownCallBack: function() {
                    var t = this;
                    this.vpnLines.length > 0 ? (this.fetchUserInfo(),
                    this.initLineChoose(),
                    this.mescrollEnd().success()) : this.fetchUserInfo(function() {
                        t.fetchVpnInfo(t.mescrollEnd())
                    })
                },
                mescrollEnd: function() {
                    var t = this;
                    return {
                        success: function() {
                            setTimeout(function() {
                                t.$nextTick(function() {
                                    t.mescroll.endSuccess()
                                })
                            }, 1e3)
                        },
                        error: function() {
                            t.mescroll.endErr()
                        }
                    }
                }
            }),
            watch: {
                vpnLines: function() {
                    return this.initLineChoose()
                }
            },
            computed: a()({}, Object(o.c)({
                userInfo: "userInfo",
                vpnConfig: "vpnConfig",
                vpnLines: "vpnLines"
            }))
        }
          , T = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , s = t._self._c || e;
                return t.loadFinish ? s("div", [s("mescroll-vue", {
                    ref: "mescroll",
                    attrs: {
                        down: t.mescrollDown
                    },
                    on: {
                        init: t.mescrollInit
                    }
                }, [s("msg-modal", {
                    ref: "opeModal",
                    attrs: {
                        msgIns: t.msgIns
                    }
                }, [s("div", {
                    staticClass: "share-content"
                }, [s("p", [t._v("1 打开设置，下拉到应用程序")]), t._v(" "), s("p", [t._v("2 点击，极云加速器")]), t._v(" "), s("p", [t._v("3 点击vpn, 点击允许")])])]), t._v(" "), s("section", {
                    staticClass: "content"
                }, [s("div", {
                    staticClass: "connect"
                }, [s("div", {
                    staticClass: "loader-wrap"
                }, [s("div", {
                    staticClass: "load-circle"
                })]), t._v(" "), s("img", {
                    staticClass: "out-img",
                    class: t.connecting ? "connecting" : "",
                    attrs: {
                        src: n("WqD0")
                    }
                }), t._v(" "), s("img", {
                    staticClass: "connect-img",
                    attrs: {
                        src: n("GBVO")
                    }
                }), t._v(" "), s("p", {
                    staticClass: "connect-status"
                }, [t._v(t._s(t.msg))])])]), t._v(" "), s("div", {
                    staticClass: "server-btn",
                    on: {
                        click: t.toServerList
                    }
                }, [s("img", {
                    staticClass: "country-img",
                    attrs: {
                        src: t.currentLine.area.img
                    }
                }), t._v(" "), s("span", [t._v(t._s(t.currentLine.name))]), t._v(" "), s("img", {
                    staticClass: "connect-img",
                    attrs: {
                        src: n("OA1H")
                    }
                })]), t._v(" "), s("div", {
                    staticClass: "connect-info"
                }, [s("ul", [s("li", [s("p", [t._v(" 到期时间 ")]), t._v(" "), s("p", [t._v(t._s(this.userInfo.endDate.date))]), t._v(" "), s("p", [t._v(t._s(this.userInfo.endDate.time))])]), t._v(" "), s("li", [s("p", [t._v("本次已连接")]), t._v(" "), s("p", [t._v(t._s(t.connectTime))])])])]), t._v(" "), s("div", {
                    staticClass: "connect-btns"
                }, [s("button", {
                    staticClass: "start-btn",
                    on: {
                        click: t.connectVpn
                    }
                }, [t._v(t._s(t.btnMsg))]), t._v(" "), s("button", {
                    staticClass: "top-btn",
                    on: {
                        click: t.toPurchase
                    }
                }, [t._v("续费充值")])])], 1)], 1) : t._e()
            },
            staticRenderFns: []
        };
        var Q = n("VU/8")(G, T, !1, function(t) {
            n("hwrt")
        }, "data-v-805367ac", null).exports
          , U = {
            data: function() {
                return {
                    activeIndex: 1,
                    defaultSpeed: n("K8NV"),
                    serverList1: [{
                        name: "美国",
                        speed: 1,
                        id: 1,
                        img: n("fBp8")
                    }, {
                        name: "美国",
                        speed: 2,
                        id: 2,
                        img: n("v7oU")
                    }, {
                        name: "美国",
                        speed: 3,
                        id: 3,
                        img: n("K8NV")
                    }]
                }
            },
            mounted: function() {
                var t = this.$route.query.id;
                this.activeIndex = t
            },
            computed: a()({}, Object(o.c)({
                serverList: "vpnLines"
            })),
            methods: {
                selectVpn: function(t) {
                    this.$router.push({
                        path: "/",
                        query: {
                            id: t.id
                        }
                    })
                }
            },
            components: {}
        }
          , L = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , n = t._self._c || e;
                return n("div", {
                    staticClass: "wrap"
                }, [n("h2", [t._v("选择服务器")]), t._v(" "), n("transition-group", {
                    attrs: {
                        name: "list",
                        tag: "ul"
                    }
                }, t._l(t.serverList, function(e, s) {
                    return n("li", {
                        key: s,
                        on: {
                            click: function(n) {
                                t.selectVpn(e)
                            }
                        }
                    }, [n("img", {
                        staticClass: "country-img",
                        attrs: {
                            src: e.area.img
                        }
                    }), t._v(" "), n("span", {
                        staticClass: "server-title"
                    }, [t._v(t._s(e.name))]), t._v(" "), n("img", {
                        staticClass: "speed-img",
                        attrs: {
                            src: e.img || t.defaultSpeed
                        }
                    }), t._v(" "), n("button", {
                        class: e.id == t.activeIndex ? "current" : ""
                    }, [t._v(t._s(e.id == t.activeIndex ? "当前" : "选择"))])])
                }))], 1)
            },
            staticRenderFns: []
        };
        var M = n("VU/8")(U, L, !1, function(t) {
            n("2RBW")
        }, "data-v-8266d222", null).exports
          , O = {
            data: function() {
                return {
                    selected: {
                        packageId: "",
                        payId: "",
                        package: {
                            km_rmb: 0
                        }
                    },
                    selectedPay: 1,
                    packageList: [],
                    payList: [],
                    after_list: !1
                }
            },
            created: function() {},
            components: {},
            mounted: function() {
                this.fetchPackages(),
                this.fetchPays()
            },
            methods: {
                payNow: function() {
                    return this.axios.post("order", {
                        package_id: this.selected.packageId,
                        pay_type: this.selected.payId
                    }).then(function(t) {
                        200 === t.data.status && (window.location.href = t.data.msg)
                    })
                },
                fetchPays: function() {
                    var t = this;
                    return this.axios.get("pays").then(function(e) {
                        e.data.data = e.data.data.filter(function(t) {
                            return 4 != t.id
                        }),
                        t.payList = e.data.data,
                        t.selected.payId = e.data.data[0].id
                    })
                },
                selectPackage: function(t, e) {
                    this.selected.packageId = e.id,
                    this.selected.package = e
                },
                selectPay: function(t, e) {
                    this.selected.payId = e.id
                },
                fetchPackages: function() {
                    var t = this;
                    return this.axios.get("packages").then(function(e) {
                        t.packageList = e.data.data,
                        t.selected.packageId = t.packageList[0].id,
                        t.selected.package = t.packageList[0]
                    })
                },
                afterEnter: function() {
                    this.after_list = !0
                }
            }
        }
          , R = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , n = t._self._c || e;
                return n("div", {
                    staticClass: "wrap"
                }, [n("h2", [t._v("充值续费")]), t._v(" "), n("transition-group", {
                    attrs: {
                        name: "list",
                        tag: "ul"
                    },
                    on: {
                        "after-enter": t.afterEnter
                    }
                }, t._l(t.packageList, function(e, s) {
                    return n("li", {
                        key: s,
                        on: {
                            click: function(n) {
                                t.selectPackage(s, e)
                            }
                        }
                    }, [n("span", {
                        staticClass: "purchase-title"
                    }, [t._v(t._s(e.name))]), t._v(" "), n("span", {
                        staticClass: "server-title"
                    }), t._v(" "), n("span", {
                        staticClass: "purchase-price"
                    }, [t._v(t._s(e.km_rmb) + " CNY")]), t._v(" "), n("button", {
                        class: e.id === t.selected.package.id ? "current" : ""
                    }, [t._v(t._s(e.id === t.selected.package.id ? "当前" : "选择"))])])
                })), t._v(" "), n("transition", {
                    attrs: {
                        name: "slideX",
                        mode: "out-in"
                    }
                }, [t.after_list ? n("main", [n("section", {
                    staticClass: "purchase-des"
                }, [n("p", [t._v("以上套餐均无流量限制，请放心使用")]), t._v(" "), n("p", [t._v("订单金额：" + t._s(t.selected.package.km_rmb) + "CNY")])]), t._v(" "), n("section", {
                    staticClass: "pays"
                }, [n("p", {
                    staticClass: "pay-title"
                }, [t._v("支付方式:")]), t._v(" "), n("div", {
                    staticClass: "btns"
                }, t._l(t.payList, function(e, s) {
                    return n("button", {
                        class: t.selected.payId === e.id ? "active" : "",
                        on: {
                            click: function(n) {
                                t.selectPay(s, e)
                            }
                        }
                    }, [t._v(t._s(e.name))])
                })), t._v(" "), n("button", {
                    staticClass: "pay-now",
                    on: {
                        click: t.payNow
                    }
                }, [t._v("立即支付")])])]) : t._e()])], 1)
            },
            staticRenderFns: []
        };
        var P = n("VU/8")(O, R, !1, function(t) {
            n("TL76")
        }, "data-v-7864f3de", null).exports
          , D = {
            data: function() {
                return {}
            },
            computed: a()({}, Object(o.c)({
                userInfo: "userInfo"
            })),
            methods: {
                toIndex: function() {
                    this.$router.push({
                        path: "/"
                    })
                },
                loginOut: function() {
                    this.auth.loginOut(),
                    this.isAndroid && android.loginOut(),
                    this.$router.push({
                        path: "/login"
                    })
                },
                shareToFriend: function() {
                    this.nativeShare()
                }
            },
            components: {}
        }
          , X = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , s = t._self._c || e;
                return s("div", [s("nav", [s("ul", [s("li", {
                    on: {
                        click: t.toIndex
                    }
                }, [s("img", {
                    attrs: {
                        src: n("7MxI")
                    }
                })]), t._v(" "), s("li", [s("router-link", {
                    attrs: {
                        to: "/forget"
                    }
                }, [t._v("修改密码")])], 1), t._v(" "), s("li", [s("router-link", {
                    attrs: {
                        to: "/purchase"
                    }
                }, [t._v("续费充值")])], 1), t._v(" "), s("li", {
                    on: {
                        click: t.shareToFriend
                    }
                }, [t._v("邀请好友")]), t._v(" "), s("li", {
                    on: {
                        click: t.loginOut
                    }
                }, [t._v("注销登录")])])])])
            },
            staticRenderFns: []
        };
        var J = n("VU/8")(D, X, !1, function(t) {
            n("k+Bt")
        }, "data-v-6f513925", null).exports
          , LD = {
            data: function() {
                return {}
            },
            computed: a()({}, Object(o.c)({
                userInfo: "userInfo"
            })),
            methods: {
                toIndex: function() {
                    this.$router.push({
                        path: "/"
                    })
                },
                loginOut: function() {
                    this.auth.loginOut(),
                    this.isAndroid && android.loginOut(),
                    this.$router.push({
                        path: "/login"
                    })
                },
                shareToFriend: function() {
                    this.nativeShare()
                    this.nativeShare()
                }
            },
            components: {}
        }
          , LX = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , s = t._self._c || e;
                return s("div", [s("nav", [s("ul", [s("li", {
                    on: {
                        click: t.toIndex
                    }
                }, [s("img", {
                    attrs: {
                        src: n("7MxI")
                    }
                })]), t._v(" "), s("li", [s("router-link", {
                    attrs: {
                        to: "/"
                    }
                }, [t._v("English")])], 1), t._v(" "), s("li", [s("router-link", {
                    attrs: {
                        to: "/"
                    }
                }, [t._v("中文")])], 1)])])])
            },
            staticRenderFns: []
        };
        var L = n("VU/8")(LD, LX, !1, function(t) {
            n("k+Bt")
        }, "data-v-6f513925", null).exports
          , F = {
            data: function() {
                return {
                    eyeImg: n("o4Y6"),
                    username: "",
                    password: "",
                    eyeClose: !0,
                    msg: "+86 请输入您的手机号",
                    showCountry: !1,
                    msgIns: {
                        title: "邀请有礼",
                        content: "用户名或密码输入有误",
                        btnText: "确定"
                    }
                }
            },
            computed: a()({}, Object(o.c)({
                allCountries: "allCountries",
                selectedCountry: "selectedCountry"
            })),
            components: {},
            mounted: function() {
                this.msg = "+" + this.selectedCountry.prefix + " 请输入您的手机号"
            },
            methods: {
                togglePass: function() {
                    this.eyeClose ? this.eyeImg = n("HNOJ") : this.eyeImg = n("o4Y6"),
                    this.eyeClose = !this.eyeClose
                },
                login: function() {
                    var t = this;
                    this.$validator.validate().then(function(e) {
                        e && (t.loading(!0),
                        t.axios.post("login", {
                            username: t.username,
                            password: t.password,
                            area: t.selectedCountry.prefix
                        }).then(function(e) {
                            t.loading(!1),
                            200 === e.data.status && (t.auth.initVpnUserForClient(t.username, t.password, t.selectedCountry.prefix, e.data.msg),
                            t.$router.push({
                                path: "/"
                            }))
                        }))
                    })
                },
                getInputType: function() {
                    return this.eyeClose ? "password" : "text"
                },
                toSelectCountry: function() {
                    this.$router.push({
                        path: "countries",
                        query: {
                            from: "login"
                        }
                    })
                }
            }
        }
          , N = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , s = t._self._c || e;
                return s("div", {
                    staticClass: "login-wrap"
                }, [t._m(0), t._v(" "), s("div", {
                    staticClass: "login-form"
                }, [s("h2", [t._v("账户登录")]), t._v(" "), s("div", {
                    staticClass: "form-wrap"
                }, [s("div", {
                    on: {
                        click: function(e) {
                            return e.stopPropagation(),
                            t.toSelectCountry(e)
                        }
                    }
                }, [s("img", {
                    staticClass: "country-tag",
                    attrs: {
                        src: t.selectedCountry.flag_32
                    }
                }), t._v(" "), s("img", {
                    staticClass: "triangle-tag",
                    attrs: {
                        src: n("8f4G")
                    }
                })]), t._v(" "), s("input", {
                    staticStyle: {
                        display: "none"
                    },
                    attrs: {
                        type: "text"
                    }
                }), t._v(" "), s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.username,
                        expression: "username"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required|integer",
                        expression: "'required|integer'"
                    }],
                    staticClass: "name-input",
                    attrs: {
                        type: "number",
                        placeholder: t.msg,
                        autocomplete: "off",
                        name: "name"
                    },
                    domProps: {
                        value: t.username
                    },
                    on: {
                        input: function(e) {
                            e.target.composing || (t.username = e.target.value)
                        }
                    }
                })]), t._v(" "), s("span", {
                    staticClass: "vee-error"
                }, [t._v(t._s(t.errors.first("name")))]), t._v(" "), s("div", {
                    staticClass: "form-wrap"
                }, [s("img", {
                    staticClass: "eye-img",
                    attrs: {
                        src: t.eyeImg
                    },
                    on: {
                        click: t.togglePass
                    }
                }), t._v(" "), "checkbox" === t.getInputType() ? s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.password,
                        expression: "password"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required",
                        expression: "'required'"
                    }],
                    attrs: {
                        placeholder: "请输入您的密码",
                        name: "password",
                        autocomplete: "off",
                        type: "checkbox"
                    },
                    domProps: {
                        checked: Array.isArray(t.password) ? t._i(t.password, null) > -1 : t.password
                    },
                    on: {
                        change: function(e) {
                            var n = t.password
                              , s = e.target
                              , i = !!s.checked;
                            if (Array.isArray(n)) {
                                var a = t._i(n, null);
                                s.checked ? a < 0 && (t.password = n.concat([null])) : a > -1 && (t.password = n.slice(0, a).concat(n.slice(a + 1)))
                            } else
                                t.password = i
                        }
                    }
                }) : "radio" === t.getInputType() ? s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.password,
                        expression: "password"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required",
                        expression: "'required'"
                    }],
                    attrs: {
                        placeholder: "请输入您的密码",
                        name: "password",
                        autocomplete: "off",
                        type: "radio"
                    },
                    domProps: {
                        checked: t._q(t.password, null)
                    },
                    on: {
                        change: function(e) {
                            t.password = null
                        }
                    }
                }) : s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.password,
                        expression: "password"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required",
                        expression: "'required'"
                    }],
                    attrs: {
                        placeholder: "请输入您的密码",
                        name: "password",
                        autocomplete: "off",
                        type: t.getInputType()
                    },
                    domProps: {
                        value: t.password
                    },
                    on: {
                        input: function(e) {
                            e.target.composing || (t.password = e.target.value)
                        }
                    }
                }), t._v(" "), s("span", {
                    staticClass: "vee-error"
                }, [t._v(t._s(t.errors.first("password")))])]), t._v(" "), s("p", {
                    staticClass: "to-register"
                }, [s("router-link", {
                    attrs: {
                        to: {
                            path: "/forget",
                            query: {
                                from: "login"
                            }
                        }
                    }
                }, [t._v("忘记密码")]), t._v(" "), s("span", {
                    staticClass: "split"
                }, [t._v(" | ")]), t._v(" "), s("router-link", {
                    attrs: {
                        to: "/register"
                    }
                }, [t._v("注册账户")])], 1), t._v(" "), s("button", {
                    staticClass: "login-btn",
                    on: {
                        click: t.login
                    }
                }, [t._v("立即登录")])])])
            },
            staticRenderFns: [function() {
                var t = this.$createElement
                  , e = this._self._c || t;
                return e("div", {
                    staticClass: "logo"
                }, [e("img", {
                    attrs: {
                        src: n("7Ogj")
                    }
                })])
            }
            ]
        };
        var z = n("VU/8")(F, N, !1, function(t) {
            n("IfK+")
        }, "data-v-1b3e17b4", null).exports
          , K = {
            data: function() {
                return {
                    eyeImg: n("o4Y6"),
                    eyeClose: !0,
                    msg: "+86 请输入您的手机号",
                    username: "",
                    password: "",
                    inviteCode: "",
                    code: "",
                    showCountry: !1,
                    endTime: 0
                }
            },
            mounted: function() {
                this.msg = "+" + this.selectedCountry.prefix + " 请输入您的手机号"
            },
            computed: a()({}, Object(o.c)({
                allCountries: "allCountries",
                selectedCountry: "selectedCountry"
            })),
            methods: {
                togglePass: function() {
                    this.eyeClose ? this.eyeImg = n("HNOJ") : this.eyeImg = n("o4Y6"),
                    this.eyeClose = !this.eyeClose
                },
                register: function() {
                    var t = this;
                    this.$validator.validate().then(function(e) {
                        return console.log("login validate", e),
                        t.loading(e),
                        !e || t.axios.post("register", {
                            username: t.username,
                            password: t.password,
                            code: t.code,
                            inviteCode: t.inviteCode,
                            area: t.selectedCountry.prefix
                        }).then(function(e) {
                            t.loading(!1),
                            200 === e.data.status && (t.auth.initVpnUserForClient(t.username, t.password, t.selectedCountry.prefix, e.data.msg),
                            t.$router.push({
                                path: "/"
                            }))
                        })
                    })
                },
                toSelectCountry: function() {
                    this.$router.push({
                        path: "countries",
                        query: {
                            from: "register"
                        }
                    })
                },
                getInputType: function() {
                    return this.eyeClose ? "password" : "text"
                },
                getCode: function() {
                    var t = this;
                    this.$validator.validate("name").then(function(e) {
                        if (e) {
                            t.endTime = t.smsEndTime;
                            var n = setInterval(function() {
                                t.endTime--,
                                t.endTime <= 0 && clearInterval(n)
                            }, 1e3);
                            t.axios.post("sms", {
                                username: t.username,
                                area: t.selectedCountry.prefix
                            }).then(function(t) {
                                200 === t.data.status && android.toast("短信发送成功")
                            })
                        }
                    })
                }
            }
        }
          , H = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , s = t._self._c || e;
                return s("div", {
                    staticClass: "login-wrap"
                }, [s("div", {
                    staticClass: "login-form"
                }, [s("h2", [t._v("账户注册")]), t._v(" "), s("div", {
                    staticClass: "form-wrap"
                }, [s("div", {
                    on: {
                        click: t.toSelectCountry
                    }
                }, [s("img", {
                    staticClass: "country-tag",
                    attrs: {
                        src: t.selectedCountry.flag_32
                    }
                }), t._v(" "), s("img", {
                    staticClass: "triangle-tag",
                    attrs: {
                        src: n("8f4G")
                    }
                })]), t._v(" "), s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.username,
                        expression: "username"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required|integer|min:5",
                        expression: "'required|integer|min:5'"
                    }],
                    staticClass: "name-input",
                    attrs: {
                        type: "number",
                        placeholder: t.msg,
                        autocomplete: "off",
                        name: "name"
                    },
                    domProps: {
                        value: t.username
                    },
                    on: {
                        input: function(e) {
                            e.target.composing || (t.username = e.target.value)
                        }
                    }
                })]), t._v(" "), s("span", {
                    staticClass: "vee-error"
                }, [t._v(t._s(t.errors.first("name")))]), t._v(" "), s("div", {
                    staticClass: "form-wrap"
                }, [s("button", {
                    staticClass: "get-code",
                    class: t.endTime > 0 ? "btn-disabled" : "",
                    attrs: {
                        disabled: t.endTime > 0
                    },
                    on: {
                        click: t.getCode
                    }
                }, [t._v("获取验证码 "), t.endTime ? s("span", [t._v("(" + t._s(t.endTime) + ")")]) : t._e()]), t._v(" "), s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.code,
                        expression: "code"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required",
                        expression: "'required'"
                    }],
                    attrs: {
                        type: "text",
                        placeholder: "请输入您的验证码",
                        autocomplete: "off",
                        name: "code"
                    },
                    domProps: {
                        value: t.code
                    },
                    on: {
                        input: function(e) {
                            e.target.composing || (t.code = e.target.value)
                        }
                    }
                })]), t._v(" "), s("span", {
                    staticClass: "vee-error"
                }, [t._v(t._s(t.errors.first("code")))]), t._v(" "), s("div", {
                    staticClass: "form-wrap"
                }, [s("img", {
                    staticClass: "eye-img",
                    attrs: {
                        src: t.eyeImg
                    },
                    on: {
                        click: t.togglePass
                    }
                }), t._v(" "), "checkbox" === t.getInputType() ? s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.password,
                        expression: "password"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required|min:5",
                        expression: "'required|min:5'"
                    }],
                    attrs: {
                        placeholder: "请输入您的密码",
                        name: "password",
                        autocomplete: "off",
                        type: "checkbox"
                    },
                    domProps: {
                        checked: Array.isArray(t.password) ? t._i(t.password, null) > -1 : t.password
                    },
                    on: {
                        change: function(e) {
                            var n = t.password
                              , s = e.target
                              , i = !!s.checked;
                            if (Array.isArray(n)) {
                                var a = t._i(n, null);
                                s.checked ? a < 0 && (t.password = n.concat([null])) : a > -1 && (t.password = n.slice(0, a).concat(n.slice(a + 1)))
                            } else
                                t.password = i
                        }
                    }
                }) : "radio" === t.getInputType() ? s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.password,
                        expression: "password"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required|min:5",
                        expression: "'required|min:5'"
                    }],
                    attrs: {
                        placeholder: "请输入您的密码",
                        name: "password",
                        autocomplete: "off",
                        type: "radio"
                    },
                    domProps: {
                        checked: t._q(t.password, null)
                    },
                    on: {
                        change: function(e) {
                            t.password = null
                        }
                    }
                }) : s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.password,
                        expression: "password"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required|min:5",
                        expression: "'required|min:5'"
                    }],
                    attrs: {
                        placeholder: "请输入您的密码",
                        name: "password",
                        autocomplete: "off",
                        type: t.getInputType()
                    },
                    domProps: {
                        value: t.password
                    },
                    on: {
                        input: function(e) {
                            e.target.composing || (t.password = e.target.value)
                        }
                    }
                }), t._v(" "), s("span", {
                    staticClass: "vee-error"
                }, [t._v(t._s(t.errors.first("password")))])]), t._v(" "), s("div", {
                    staticClass: "form-wrap"
                }, [s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.inviteCode,
                        expression: "inviteCode"
                    }],
                    attrs: {
                        type: "text",
                        placeholder: "邀请码(如有)",
                        autocomplete: "off"
                    },
                    domProps: {
                        value: t.inviteCode
                    },
                    on: {
                        input: function(e) {
                            e.target.composing || (t.inviteCode = e.target.value)
                        }
                    }
                })]), t._v(" "), s("p", {
                    staticClass: "to-login"
                }, [t._v("已有账户？"), s("router-link", {
                    attrs: {
                        to: "/login"
                    }
                }, [t._v("立即登录")])], 1), t._v(" "), s("button", {
                    staticClass: "register-btn",
                    on: {
                        click: t.register
                    }
                }, [t._v("立即注册")])])])
            },
            staticRenderFns: []
        };
        var V = n("VU/8")(K, H, !1, function(t) {
            n("9vrJ")
        }, "data-v-3b59dfdc", null).exports
          , Y = {
            data: function() {
                return {
                    eyeImg: n("o4Y6"),
                    eyeClose: !0,
                    msg: "+86 请输入您的手机号",
                    username: "",
                    password: "",
                    code: "",
                    showCountry: !1,
                    endTime: 0,
                    fromLogin: "login" === this.$route.query.from
                }
            },
            computed: a()({}, Object(o.c)({
                allCountries: "allCountries",
                selectedCountry: "selectedCountry"
            })),
            mounted: function() {
                this.msg = "+" + this.selectedCountry.prefix + " 请输入您的手机号"
            },
            methods: {
                togglePass: function() {
                    this.eyeClose ? this.eyeImg = n("HNOJ") : this.eyeImg = n("o4Y6"),
                    this.eyeClose = !this.eyeClose
                },
                reset: function() {
                    var t = this;
                    this.$validator.validate().then(function(e) {
                        return console.log("login validate", e),
                        t.loading(e),
                        !e || t.axios.post("update-password", {
                            username: t.username,
                            password: t.password,
                            code: t.code,
                            area: t.selectedCountry.prefix
                        }).then(function(e) {
                            t.loading(!1),
                            200 === e.data.status && (t.toast("密码修改成功"),
                            t.auth.login(e.data.msg),
                            t.$router.push({
                                path: "/"
                            }))
                        })
                    })
                },
                getInputType: function() {
                    return this.eyeClose ? "password" : "text"
                },
                getCode: function() {
                    var t = this;
                    this.$validator.validate("name").then(function(e) {
                        if (e) {
                            t.endTime = t.smsEndTime;
                            var n = setInterval(function() {
                                t.endTime--,
                                t.endTime <= 0 && clearInterval(n)
                            }, 1e3);
                            t.axios.post("sms", {
                                username: t.username,
                                area: t.selectedCountry.prefix
                            }).then(function(t) {
                                200 === t.data.status && android.toast("短信发送成功")
                            })
                        }
                    })
                },
                toSelectCountry: function() {
                    this.$router.push({
                        path: "countries",
                        query: {
                            from: "forget"
                        }
                    })
                }
            }
        }
          , q = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , s = t._self._c || e;
                return s("div", {
                    staticClass: "login-wrap"
                }, [s("div", {
                    staticClass: "login-form"
                }, [s("h2", [t._v("修改密码")]), t._v(" "), s("div", {
                    staticClass: "form-wrap"
                }, [s("div", {
                    on: {
                        click: t.toSelectCountry
                    }
                }, [s("img", {
                    staticClass: "country-tag",
                    attrs: {
                        src: t.selectedCountry.flag_32
                    }
                }), t._v(" "), s("img", {
                    staticClass: "triangle-tag",
                    attrs: {
                        src: n("8f4G")
                    }
                })]), t._v(" "), s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.username,
                        expression: "username"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required|integer|min:5",
                        expression: "'required|integer|min:5'"
                    }],
                    staticClass: "name-input",
                    attrs: {
                        type: "number",
                        placeholder: t.msg,
                        autocomplete: "off",
                        name: "name"
                    },
                    domProps: {
                        value: t.username
                    },
                    on: {
                        input: function(e) {
                            e.target.composing || (t.username = e.target.value)
                        }
                    }
                })]), t._v(" "), s("span", {
                    staticClass: "vee-error"
                }, [t._v(t._s(t.errors.first("name")))]), t._v(" "), s("div", {
                    staticClass: "form-wrap"
                }, [s("button", {
                    staticClass: "get-code",
                    class: t.endTime > 0 ? "btn-disabled" : "",
                    attrs: {
                        disabled: t.endTime > 0
                    },
                    on: {
                        click: t.getCode
                    }
                }, [t._v("获取验证码 "), t.endTime ? s("span", [t._v("(" + t._s(t.endTime) + ")")]) : t._e()]), t._v(" "), s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.code,
                        expression: "code"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required",
                        expression: "'required'"
                    }],
                    attrs: {
                        type: "text",
                        placeholder: "请输入您的验证码",
                        autocomplete: "off",
                        name: "code"
                    },
                    domProps: {
                        value: t.code
                    },
                    on: {
                        input: function(e) {
                            e.target.composing || (t.code = e.target.value)
                        }
                    }
                })]), t._v(" "), s("span", {
                    staticClass: "vee-error"
                }, [t._v(t._s(t.errors.first("code")))]), t._v(" "), s("div", {
                    staticClass: "form-wrap"
                }, [s("img", {
                    staticClass: "eye-img",
                    attrs: {
                        src: t.eyeImg
                    },
                    on: {
                        click: t.togglePass
                    }
                }), t._v(" "), "checkbox" === t.getInputType() ? s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.password,
                        expression: "password"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required|min:5",
                        expression: "'required|min:5'"
                    }],
                    attrs: {
                        placeholder: "请输入您的密码",
                        name: "password",
                        autocomplete: "off",
                        type: "checkbox"
                    },
                    domProps: {
                        checked: Array.isArray(t.password) ? t._i(t.password, null) > -1 : t.password
                    },
                    on: {
                        change: function(e) {
                            var n = t.password
                              , s = e.target
                              , i = !!s.checked;
                            if (Array.isArray(n)) {
                                var a = t._i(n, null);
                                s.checked ? a < 0 && (t.password = n.concat([null])) : a > -1 && (t.password = n.slice(0, a).concat(n.slice(a + 1)))
                            } else
                                t.password = i
                        }
                    }
                }) : "radio" === t.getInputType() ? s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.password,
                        expression: "password"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required|min:5",
                        expression: "'required|min:5'"
                    }],
                    attrs: {
                        placeholder: "请输入您的密码",
                        name: "password",
                        autocomplete: "off",
                        type: "radio"
                    },
                    domProps: {
                        checked: t._q(t.password, null)
                    },
                    on: {
                        change: function(e) {
                            t.password = null
                        }
                    }
                }) : s("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.password,
                        expression: "password"
                    }, {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required|min:5",
                        expression: "'required|min:5'"
                    }],
                    attrs: {
                        placeholder: "请输入您的密码",
                        name: "password",
                        autocomplete: "off",
                        type: t.getInputType()
                    },
                    domProps: {
                        value: t.password
                    },
                    on: {
                        input: function(e) {
                            e.target.composing || (t.password = e.target.value)
                        }
                    }
                }), t._v(" "), s("span", {
                    staticClass: "vee-error"
                }, [t._v(t._s(t.errors.first("password")))])]), t._v(" "), s("p", {
                    staticClass: "to-login"
                }, [s("router-link", {
                    attrs: {
                        to: t.fromLogin ? "/login" : "/"
                    }
                }, [t._v("返回" + t._s(t.fromLogin ? "登录" : "首页"))])], 1), t._v(" "), s("button", {
                    staticClass: "register-btn",
                    on: {
                        click: t.reset
                    }
                }, [t._v("立即重置")])])])
            },
            staticRenderFns: []
        };
        var j = n("VU/8")(Y, q, !1, function(t) {
            n("VckG")
        }, "data-v-03c3532e", null).exports
          , W = {
            data: function() {
                return {
                    countryList: [],
                    allCountries: []
                }
            },
            mounted: function() {
                this.fetchCountries()
            },
            computed: a()({}, Object(o.c)({
                inputCountry: "inputCountry",
                selectedCountry: "selectedCountry"
            })),
            watch: {
                inputCountry: function() {
                    this.filterCountry()
                }
            },
            methods: a()({}, Object(o.d)(["setAllCountries", "chooseCountry"]), {
                selectCountry: function(t) {
                    this.chooseCountry(t),
                    this.$router.push({
                        path: this.$route.query.from || "login"
                    })
                },
                filterCountry: function() {
                    var t = this;
                    this.inputCountry || (this.countryList = this.allCountries),
                    this.countryList = this.countryList.filter(function(e) {
                        return e.name.toLowerCase().includes(t.inputCountry.toLowerCase())
                    })
                },
                fetchCountries: function() {
                    var t = this;
                    this.axios.get("countries").then(function(e) {
                        t.setAllCountries(e.data.data.data);
                        var n = [];
                        e.data.data.map(function(t) {
                            return n.push(t)
                        }),
                        t.allCountries = t.countryList = n,
                        t.defaultCountry = n.find(function(t) {
                            return "86" == t.prefix
                        })
                    })
                }
            }),
            components: {}
        }
          , Z = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , n = t._self._c || e;
                return n("div", {
                    staticClass: "wrap"
                }, [n("transition-group", {
                    attrs: {
                        name: "list",
                        tag: "ul"
                    }
                }, t._l(t.countryList, function(e, s) {
                    return n("li", {
                        key: s,
                        on: {
                            click: function(n) {
                                t.selectCountry(e)
                            }
                        }
                    }, [n("img", {
                        staticClass: "country-img",
                        attrs: {
                            src: e.flag_32
                        }
                    }), t._v(" "), n("span", {
                        staticClass: "server-title"
                    }, [t._v(t._s(e.name.split(" ")[0]) + "  (+" + t._s(e.prefix) + ")")]), t._v(" "), n("img", {
                        staticClass: "speed-img",
                        attrs: {
                            src: e.img
                        }
                    }), t._v(" "), n("button", {
                        class: e.prefix == t.selectedCountry.prefix ? "current" : ""
                    }, [t._v(t._s(e.prefix == t.selectedCountry.prefix ? "当前" : "选择"))])])
                }))], 1)
            },
            staticRenderFns: []
        };
        var _ = n("VU/8")(W, Z, !1, function(t) {
            n("RDD/")
        }, "data-v-12881dec", null).exports;
        s.a.use(h.a);
        var $ = new h.a({
            routes: [{
                path: "/",
                name: "index",
                component: Q
            }, {
                path: "/servers",
                name: "servers",
                component: M
            }, {
                path: "/register",
                name: "register",
                component: V
            }, {
                path: "/forget",
                name: "forget",
                component: j
            }, {
                path: "/menu",
                name: "menu",
                component: J
            }, {
                path: "/lang",
                name: "lang",
                component: L
            }, {
                path: "/login",
                name: "login",
                component: z
            }, {
                path: "/purchase",
                name: "purchase",
                component: P
            }, {
                path: "/head",
                name: "head",
                component: p
            }, {
                path: "/country",
                name: "country",
                component: w
            }, {
                path: "/countries",
                name: "countries",
                component: _
            }]
        })
          , tt = n("//Fk")
          , et = n.n(tt)
          , nt = n("mtWM")
          , st = n.n(nt)
          , it = n("Rf8U")
          , at = n.n(it);
        st.a.defaults.baseURL = "http://api.6if5hq.cn/bf/",
        st.a.interceptors.request.use(function(t) {
            return s.a.prototype.auth.getToken() && (t.headers = {
                Authorization: s.a.prototype.auth.getToken()
            }),
            t
        }, function(t) {
            return et.a.reject(t)
        });
        var ot = {
            title: A.e_res_title,
            content: A.e_res_content,
            btnText: A.e_res_btn_text
        };
        st.a.interceptors.response.use(function(t) {
            var e = t.data
              , n = t.status;
            return console.log("==>", e, "status ===>", n),
            200 !== e.status && (ot.content = e.msg,
            s.a.prototype.bus.$emit("toast", ot)),
            t
        }, function(t) {
            return ot.callBack = function() {
                $.push({
                    path: "/login"
                })
            }
            ,
            s.a.prototype.bus.$emit("toast", ot),
            s.a.prototype.mescroll && s.a.prototype.mescroll.endErr(),
            et.a.reject(t)
        }),
        s.a.use(at.a, st.a);
        var rt = n("OvRC")
          , ct = n.n(rt)
          , ut = n("mvHQ")
          , At = n.n(ut)
          , lt = new (function() {
            function t() {
                c()(this, t),
                this.serize = this.getSerize(1),
                this.tokenKey = "token",
                this.userInfoKey = "userInfo",
                this.securityKey = "security",
                this.areaKey = "area"
            }
            return S()(t, [{
                key: "login",
                value: function(t) {
                    return this.serize.setItem(this.tokenKey, t)
                }
            }, {
                key: "initVpnUserForClient",
                value: function(t, e, n, i) {
                    this.login(i),
                    this.recordNamePassword(t, e),
                    this.recordArea(n),
                    s.a.prototype.isAndroid && android.recordLogin()
                }
            }, {
                key: "recordNamePassword",
                value: function(t, e) {
                    return this.serize.setItem(this.securityKey, t + "&" + e)
                }
            }, {
                key: "recordArea",
                value: function(t) {
                    return this.serize.setItem(this.areaKey, t)
                }
            }, {
                key: "getArea",
                value: function() {
                    return this.serize.getItem(this.areaKey)
                }
            }, {
                key: "getNamePassword",
                value: function() {
                    var t = this.serize.getItem(this.securityKey) || "";
                    return t ? {
                        name: t.split("&")[0],
                        password: t.split("&")[1]
                    } : ""
                }
            }, {
                key: "setUserInfo",
                value: function(t) {
                    return t = At()(t),
                    this.serize.setItem(this.userInfoKey, t)
                }
            }, {
                key: "getUserInfo",
                value: function() {
                    return JSON.parse(this.serize.getItem(this.userInfoKey)) || {}
                }
            }, {
                key: "getToken",
                value: function() {
                    return this.serize.getItem(this.tokenKey) || ""
                }
            }, {
                key: "getSerize",
                value: function(t) {
                    return 1 === t ? localStorage : sessionStorage
                }
            }, {
                key: "loginOut",
                value: function() {
                    this.serize.removeItem(this.tokenKey),
                    this.serize.removeItem(this.userInfoKey)
                }
            }]),
            t
        }())
          , dt = ct()({}).install = function(t, e) {
            t.myGlobalMethod = function() {}
            ,
            t.directive("my-directive", {
                bind: function(t, e, n, s) {}
            }),
            t.mixin({
                created: function() {}
            }),
            t.prototype.$myMethod = function(t) {}
            ,
            t.prototype.auth = lt
        }
          , pt = (n("EGi2"),
        {
            state: {
                toast: {}
            },
            getters: {
                toast: function(t) {
                    return t.toast
                }
            },
            actions: {
                gettoastProducts: function(t) {
                    var e = t.commit;
                    shop.getProducts(function(t) {
                        e("setProducts", t)
                    })
                }
            },
            mutations: {
                setToast: function(t, e) {
                    console.log("from vuex " + e),
                    t.toast = e
                },
                updateToast: function(t, e) {
                    t.toast = e
                }
            }
        })
          , mt = {
            state: {
                headerType: 1
            },
            getters: {
                headerType: function(t) {
                    return t.headerType
                }
            },
            actions: {},
            mutations: {
                setHeadType: function(t, e) {
                    console.log("from vuex " + e),
                    t.headerType = e
                }
            }
        }
          , gt = {
            state: {
                inputCountry: "",
                allCountries: "",
                selectedCountry: {
                    flag_32: "assets/icons/CN-32.png",
                    prefix: 86
                }
            },
            getters: {
                inputCountry: function(t) {
                    return t.inputCountry
                },
                allCountries: function(t) {
                    return t.allCountries
                },
                selectedCountry: function(t) {
                    return t.selectedCountry
                }
            },
            actions: {},
            mutations: {
                setInputCountry: function(t, e) {
                    t.inputCountry = e
                },
                setAllCountries: function(t, e) {
                    t.allCountries = e
                },
                chooseCountry: function(t, e) {
                    t.selectedCountry = e
                }
            }
        }
          , ft = {
            state: {
                userInfo: {
                    endDate: {
                        date: "00/00/00",
                        time: "00:00:00"
                    }
                }
            },
            getters: {
                userInfo: function(t) {
                    return t.userInfo
                }
            },
            actions: {
                fetchUserInfo: function(t, e) {
                    var n = t.commit;
                    return s.a.axios.get("user-info").then(function(t) {
                        var i = t.data;
                        200 === i.status && (i.data.endDate = x.timeStamp2String(i.data.endtime),
                        s.a.prototype.auth.setUserInfo(i.data),
                        n("setUserInfo", i.data),
                        e && e())
                    })
                }
            },
            mutations: {
                setUserInfo: function(t, e) {
                    t.userInfo = e
                }
            }
        }
          , ht = {
            state: {
                lines: [],
                config: {}
            },
            getters: {
                vpnLines: function(t) {
                    return t.lines
                },
                vpnConfig: function(t) {
                    return t.config
                }
            },
            actions: {
                fetchVpnInfo: function(t, e) {
                    var n = t.commit;
                    return s.a.axios.all([s.a.axios.get("keys"), s.a.axios.get("lines")]).then(s.a.axios.spread(function(t, s) {
                        console.log("keys res", t.data);
                        var i = t.data;
                        200 === i.status && 200 === s.data.status ? (n("setVpn", {
                            config: i.data,
                            lines: s.data.data.data
                        }),
                        e.success && e.success()) : e.error && e.error()
                    }))
                }
            },
            mutations: {
                setVpn: function(t, e) {
                    t.lines = e.lines,
                    t.config = e.config
                }
            }
        };
        s.a.use(o.a);
        var vt = new o.a.Store({
            modules: {
                toast: pt,
                header: mt,
                country: gt,
                userInfo: ft,
                vpnInfo: ht
            }
        })
          , Ct = {
            data: function() {
                return {
                    msg: "hello vue",
                    open: !1
                }
            },
            props: {
                msgIns: {
                    type: Object,
                    default: function() {
                        return {
                            title: "",
                            content: "",
                            btnText: "确定",
                            callBack: function() {
                                this.open = !1
                            }
                        }
                    }
                },
                width: {
                    type: String,
                    default: ""
                }
            },
            methods: {
                toMenu: function() {
                    this.$router.push({
                        path: "/menu"
                    })
                },
                toLang: function() {
                    this.$router.push({
                        path: "/lang"
                    })
                },
                eventCall: function() {
                    return console.log("get the call back function is", this.msgIns.callBack),
                    this.msgIns.callBack && this.msgIns.callBack() || this.closeModal()
                },
                show: function() {
                    return this.open = !0
                },
                closeModal: function() {
                    this.open = !1
                }
            },
            components: {}
        }
          , wt = {
            render: function() {
                var t = this
                  , e = t.$createElement
                  , s = t._self._c || e;
                return s("div", {
                    staticClass: "modal-wrap"
                }, [t.open ? s("div", {
                    staticClass: "modal"
                }) : t._e(), t._v(" "), s("transition", {
                    attrs: {
                        name: "slide"
                    }
                }, [t.open ? s("div", {
                    staticClass: "modal-container"
                }, [s("div", [s("figure", {
                    staticClass: "close_btn",
                    on: {
                        click: t.closeModal
                    }
                }, [s("img", {
                    attrs: {
                        src: n("rwBc")
                    }
                })]), t._v(" "), s("p", {
                    staticClass: "modal-title"
                }, [t._v(t._s(t.msgIns.title))]), t._v(" "), t.msgIns.content ? s("div", {
                    staticClass: "modal-content"
                }, [s("p", [t._v(t._s(t.msgIns.content))])]) : t._e(), t._v(" "), s("button", {
                    staticClass: "modal-btn",
                    attrs: {
                        type: "button",
                        name: "button"
                    },
                    on: {
                        click: t.eventCall
                    }
                }, [t._v(t._s(t.msgIns.btnText || "确定"))]), t._v(" "), t.msgIns.content ? t._e() : t._t("default")], 2)]) : t._e()])], 1)
            },
            staticRenderFns: []
        };
        var yt = n("VU/8")(Ct, wt, !1, function(t) {
            n("tMLo")
        }, "data-v-1404348e", null).exports
          , It = {
            render: function() {
                var t = this.$createElement
                  , e = this._self._c || t;
                return e("div", {
                    staticClass: "modal-wrap"
                }, [this.open ? e("div", {
                    staticClass: "modal"
                }, [e("transition", {
                    attrs: {
                        name: "slide"
                    }
                }, [e("svg", {
                    staticClass: "spinner",
                    attrs: {
                        width: "1rem",
                        height: "1rem",
                        viewBox: "0 0 66 66",
                        xmlns: "http://www.w3.org/2000/svg"
                    }
                }, [e("circle", {
                    staticClass: "path",
                    staticStyle: {
                        stroke: "#fff"
                    },
                    attrs: {
                        fill: "none",
                        "stroke-width": "6",
                        "stroke-linecap": "round",
                        cx: "33",
                        cy: "33",
                        r: "30"
                    }
                })])])], 1) : this._e()])
            },
            staticRenderFns: []
        };
        var Bt = n("VU/8")({
            data: function() {
                return {
                    msg: "hello vue",
                    open: !1
                }
            },
            props: {},
            methods: {
                toMenu: function() {
                    this.$router.push({
                        path: "/menu"
                    })
                },
                toLang: function() {
                    this.$router.push({
                        path: "/lang"
                    })
                },
                show: function() {
                    return this.open = !0
                },
                hide: function() {
                    this.open = !1
                }
            },
            components: {}
        }, It, !1, function(t) {
            n("eTE7")
        }, "data-v-0dcc2d10", null).exports
          , kt = n("fZjL")
          , bt = n.n(kt)
          , Et = n("lHA8")
          , St = n.n(Et)
          , xt = {
            backTop: {
                type: 2,
                arr: new St.a(["/servers", "/purchase", "/register", "/forget"])
            },
            homeTop: {
                type: 1,
                arr: new St.a(["/"])
            },
            langTop: {
                type: 4,
                arr: new St.a(["/login"])
            },
            noTop: {
                type: 0,
                arr: new St.a(["/lang"])
            },
            searchType: {
                type: 3,
                arr: new St.a(["/countries"])
            }
        };
        $.beforeEach(function(t, e, n) {
            console.log("exec next path " + e.path + " -> " + t.path);
            var s = t.path
              , i = bt()(xt).find(function(t) {
                return xt[t].arr.has(s)
            });
            vt.commit("setHeadType", i ? xt[i].type : xt.noTop.type),
            n()
        });
        var Gt = n("sUu7")
          , Tt = n("+8+3")
          , Qt = n.n(Tt);
        n("X2bD"),
        n("KLXt");
        Gt.a.localize("cn", {
            messages: Qt.a.messages,
            attributes: {
                name: "手机号",
                password: "密码",
                code: "验证码"
            }
        }),
        s.a.config.productionTip = !1,
        s.a.use(Gt.b),
        s.a.use(dt),
        s.a.component("msg-modal", yt),
        s.a.component("loading", Bt),
        s.a.prototype.bus = new s.a,
        s.a.prototype.$setMescroll = function(t) {
            s.a.prototype.mescroll = t
        }
        ;
        var Ut = navigator.userAgent.toLowerCase();
        s.a.prototype.isAndroid = Ut.indexOf("androidvpn") > -1,
        s.a.prototype.isIosWb = Ut.indexOf("iosvpn") > -1,
        s.a.prototype.nativeShare = function() {
            android.openShare("我在使用" + A.vpnShareTitle + "，使用邀请码: " + this.userInfo.code + " 免费试用  http://vpn.rip", A.vpnShareContent)
        }
        ,
        s.a.prototype.toast = function(t) {
            this.bus.$emit("toast", t)
        }
        ,
        s.a.prototype.loading = function(t) {
            this.bus.$emit("loading", t)
        }
        ,
        s.a.prototype.smsEndTime = 60,
        new s.a({
            el: "#app",
            router: $,
            store: vt,
            components: {
                App: f
            },
            template: "<App/>"
        })
    },
    OA1H: function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACRUlEQVRoQ+2ZzatOURTGf48kH6WIlDJkoEwMFJn4KnWj7uwOJEz8BbhkxMC9t/wFkqJkIJKIKCYUQxMxuHdkonwMlCIenVrq7fbuwTlnn/O+O/b4nH2e3157r/OstUXhQ4Xr598CsL0eOC5pblwiVzsCtn8DN4BjkjxqkCYAn4C1wGNgUtL3UUI0AXgHbAnRb4ADkj6OCqIJwAtg14DgDwHxdhQQTQDuAYcXif0GHJL0vG+IJgBXgRNDhP6KDFUd8N5GE4B9wH1gRULlnKQzfRHUBqiE2d4GPAE2JITeAaYk/ewapBFAQGwMiK0Jka+Ag5K+dgnRGCAgVsV22pMQOQ/sl7TQFUQrgIBYAlwDjiZEfolIvO4CojXAX1G2TwGzMNQg/ogzcTc3RDaAiMYEcBtYPkRo5ZumcxvBrAABsT180rrEal+P/0VlCluP7AABsQl4OuCZFgt9BkzkMIKdAATEauABsDuxzFmMYGcAAbE0aoepBERrI9gpwECGOg9cTEC0MoK9AEQ0JoFbwLIhII2NYG8AAbEDeASsSURjRtLZOqlp3ABmJU2PJYDtcreQ7eoQX0jYjPE9xLbLTaO2y/2R2S7XStgu18xFprlZpJ22fRqYKa6gsV1uSWm73KLedrltlcg0D4tsbNneG72glQnTdUnSuTqGrM2ztd2o7eKbu8W3118COwfC3rqu7XsLvQc2x0ezdBb6BvgcJWGxl3xVi/AKcLK4a1bb1YXGEUmX24Q957u102jOj+eY6z9AjlVsM8cf5cr0MfZWDvAAAAAASUVORK5CYII="
    },
    "RDD/": function(t, e) {},
    TL76: function(t, e) {},
    VckG: function(t, e) {},
    WqD0: function(t, e, n) {
        t.exports = "assets/icons/dashboard.png"
    },
    X2bD: function(t, e) {
        !function() {
            var t = "@charset \"utf-8\";html{color:#000;background:#fff;overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}html *{outline:0;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}html,body{font-family:sans-serif}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{margin:0;padding:0}input,select,textarea{font-size:100%}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}abbr,acronym{border:0;font-variant:normal}del{text-decoration:line-through}address,caption,cite,code,dfn,em,th,var{font-style:normal;font-weight:500}ol,ul{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500}q:before,q:after{content:''}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}a:hover{text-decoration:underline}ins,a{text-decoration:none}"
              , e = document.createElement("style");
            if (document.getElementsByTagName("head")[0].appendChild(e),
            e.styleSheet)
                e.styleSheet.disabled || (e.styleSheet.cssText = t);
            else
                try {
                    e.innerHTML = t
                } catch (n) {
                    e.innerText = t
                }
        }()
    },
    eTE7: function(t, e) {},
    fBp8: function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAUCAYAAACwG3xrAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAGklEQVQoz2P8X139nwEPYGIgAEYVjCqgrgIAzDsDHBhdY0UAAAAASUVORK5CYII="
    },
    gnAz: function(t, e) {},
    hwrt: function(t, e) {},
    i0iQ: function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA2CAYAAACFrsqnAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAEMklEQVRo3s2aW4hVVRjH/+uM1YTjOFo9NBlpNGHRTIk0WiQpiUUEYw9FRWFPFhHhWyImXSCMogeDKITIbiQ9RERpkNANKZqCxhiw0ZwuTJZKpZM1jvXrYX8Hl3v2PvucffY+az4Y1oL9XX7/tc6cs9fFqSADLpF0maRuSV2S2iVNShqXdEjSd5KGnXN/F1WzMAOuAjYBn1Of7QNeAFYDZxfJ4nIKuFPSfZKujz0asb+jktoknSVpjqQLJF0c8z0i6Q1Jm51zY6WPekzAamDIG+EJ4BXgDmBBRmyP+W0FfvFyTAKPtEpAF7DdK34YeAiYmzPfDGAA2OXl3ANcW6aIJcBPXsEtwJwC8w8AB7z8D5YhYpVXYBRYWdJgtQOvebU2F5l8hZf4A2BWGSJiNTd4NZ8pImGP/RMCvFO2gFjtdZ6Ydc0mG7VEn7ZShFd/oyfmurxJXrQEB4H2EEKM43Xj+L3hH09gqTcSi0OJMBYHjBnL1kaDRyzwuZAiPJ6V3sBeWm/QgAX8VfR7UJNiPjKut+oN+NoCngwNH+Na5M3KvCznhZ7zOaHhE/h2G9uGLMfHzHFHaOgUvjXGtzfLcdAc14SGTuGb631iFqQ5nes5zQ8NXUNMzcGuSOqz/s/OudHQwDXsE2uvTBPSY/09oUkzbMTanqSHFUkXWv9AaNIM+8Ha+WlCqq/nf4QmzbAqX2eakA7rT79tmtPtuLUzgSmbJhVJE9Y/IzRphp1p7YRzjiQh49YvfQXYpFX5xpMeViT9av3u0KQZVuU7mCZkn/UvD02aYdUNvv1pQoarQoDZoWlr2NXWDqd6eCuxm0LTpvBVgHFjvCbJp2LtLmtvCQ2dYsslzVS0pzxYS/HN1YV+aOIUvm3G91KWYwU4Ys53hQaPsXUQbZYDLKsnYJM5fx8aPsb1aF2LKi9gtre7uDa0AGPq9GbjtkYCH/Z2UjrqDixPyJvG0/gSg1Nb/DsDi7jbW7n25UnQ6yVozUnSVIZ+j2FjM4nWeonub7GIhfbRBni/iIRPe2LWt0jEIuBPq/lNkYm3eGK2AW0lirgHOOnV+xFYUmSBJ7zkw8ANBQs4H3iVdFtRZLHbvSmH6Oyit8mc5xEdtR3zv1w4dT7j2/IixXQTnan7tgO4F7iozhyziN7rXgaOe3mGfFjg7QQxNU+uGr75YFO9XtKq2KOvJH2paOFzSNI/ivYBuhRtOfVLWqzTl9T7JT3rnHs+oc67mvo2vsw591lhs2OFlgJPAd/SmP1mXxy3krAbEqvxXiz2v7SZyXUXJaFgr412n6R5iu6ftEs6IemwpDFJQ5L2Shp0zp1oIPdOSTeWPjOtMODD2Mz8S5nXPUoW83FMzElSlr3T2ohOeXfHxEwC/aHZ8ohpY+olt0ngitBsecV8EROzPTRXXjEzYmKmxYo2r5hO4HHgAUn6H8ftc6s9+5qKAAAAAElFTkSuQmCC"
    },
    "k+Bt": function(t, e) {},
    o4Y6: function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADcElEQVR4Xu1YPXLUMBh93wmAjo7Q0QEnACpKuAHJBYCcgKSjI5yA5AZQUkE6OpKOjuQEBC7wmJeRGa0tybK8y+7a0oxndzySrPe+9/3JMPNhM8ePSkBVwMwZqC4wcwHUIFhdoLrAzBmoLjBzAdQsUF2gusDMGaguEBMAyVcAngP4CODEzK62TSwkXzgMOvuhmV20MQQVQPILgMfe5DMAT7aJBJJHAGTEZoiEh20SOgSQfADge8Da783s9TaogKSMJyO2h5S8678MERBbrHVSwddNJoHkTWfAncA5T83MV3a3EHIb/IqAlA9JRhsbD0h+ALBgZQ/LvpnJNf6NWAw4APAmQsLGxgOSAi4CQuPczOTeCyOaBkkK6P3IZsdmtrdJrtADXkeVcoUpm4BYMGw22BgSMsArBUrVnZEshDI2Xrs7uHplwa9bKIPSb+b0VoKBfNpmUSTsheS1ShdxwVr+rmItNs5Vz6SCdi8B2pnkMQBVValxYGaHqwTd7E1SoAVeKS82fgPY6ctYWQQMIEFpUkScrIIIV+AoOy3k8sC3BF6W7wS97CAYApDhDs2yPwBeAvjUZ4Ecokg+A/AWwL2M+b2y9/fIVoAnv1SuDZ1PzZQeBaNeizi1qYpTCpbU9aSk7n/zVPOHkD6YAHdASVBx4U6GRdpTmlL6m3zUgfvh/de7UBmb+pQkL9dLZYPg+iICHAmyinKr33EV8DF6iay+G2p1c3YuJsCR0Fcs5Zxh7JxOfT9kw7EEqG3u1NdDDrCEuWrM7g7x+1FB0AuGuht4FwHwGcDtRC8xFLd8XDHjaWRhp8/P/UCxAkj+jASrSzO7DmIk9asoLpXoiTVX7fMKsDKGAuaZmSmLaD/9KiWGxq0SFYwhgJGDJC9NXDGjaB0iY18pMxbQHKEi5kbg20WXNWMICLXLKnxStfn1uUnKso9KQJAM3VVklb0hg40hQJIWkMYa2RXYGAIcge3eRM2Y3g0exQS4g6gWUFF0NeSucCwBXgrW9y9KawDtM4qAwXS7BQkCigJZ6TnWSUAohSYvLsaATK1diwICfnzpmpisZmmZZKyNAC+G6NLivwNvSFwrAcu0ZOlelYBS5qayripgKpYsxVEVUMrcVNZVBUzFkqU4qgJKmZvKuqqAqViyFEdVQClzU1lXFTAVS5bimL0C/gJFUSVQgW2mwgAAAABJRU5ErkJggg=="
    },
    rwBc: function(t, e) {
        t.exports = "data:image/png;base64,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"
    },
    tMLo: function(t, e) {},
    v7oU: function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAeCAYAAADZ7LXbAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAUklEQVRIx2NkoBD8f1j9gYGBgR+fGiZKLSEGjFoyasmoJYPEEpb/D6sbCKjpYJRv/UGRJQwMDPUE1ExgYGCgyJLhEyejloxaMmrJqCWjlgx7SwCoaQqhtxbMWAAAAABJRU5ErkJggg=="
    },
    xF0f: function(t, e) {},
    zu1Y: function(t, e) {
        t.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAA3CAYAAABeklfeAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAaUlEQVRo3u3ZsQ2AMAwAQcz+O4cF0Bc0AXTXW7K+tGettQ5unbsXeDNxgjhBnCBOECeIE8QBAAAA+Jb5+99qZubprGNXECeIE8QJ4gRxgjhBHAAAANjF9yE4WQRxgjhBnCBOECeIE8QJF13oDDD6atb5AAAAAElFTkSuQmCC"
    }
}, ["NHnr"]);
//# sourceMappingURL=app.8aace4a44f6cd89cde9a.js.map
