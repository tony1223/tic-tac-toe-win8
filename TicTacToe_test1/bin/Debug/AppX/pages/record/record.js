(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    ui.Pages.define("/pages/record/record.html", {
        // 每當使用者巡覽至此頁面時，就會呼叫這個函式。它
        // 會將應用程式的資料填入頁面項目。
        ready: function (element, options) {
            var records = [];
            if (localStorage.records != null && localStorage.records != "") {
                records = JSON.parse(localStorage.records);
            }
            //			records.push({table:this._table,winer:winer,time: new Date()});

            if (records.length == 0) {
                $("#record").append("<tr><td colspan='3' style='text-align:center;'>No records.</td></tr>");
                return true;
            }

            var out = [];
            for (var i = records.length - 1, index = 1 ; i >= 0 ; --i, ++index) {
                if (records[i]) {
                    out.push("<tr><td>" + (index) + "</td><td>");
                    switch (records[i].winer) {
                        case -1: out.push("no winner"); break;
                        case 0: out.push("Circle"); break;
                        case 1: out.push("Cross"); break;
                    }
                    out.push("</td><td>" + new Date(records[i].time) + "</td></tr>");
                }
            }
            $("#record").append(out.join(""));
        }
    });
})();
