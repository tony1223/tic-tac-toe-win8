(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    ui.Pages.define("/pages/game/game.html", {
        // 每當使用者巡覽至此頁面時，就會呼叫這個函式。它
        // 會將應用程式的資料填入頁面項目。
        ready: function (element, options) {
            var GameHandler = {
                _jqTable: $(".tic-table"),
                _table: [-1, -1, -1, -1, -1, -1, -1, -1, -1], //-1 for unused
                _currentMove: 0,//0 for circle , 1 for cross
                init: function () {
                    this._jqTable.on("click", ".cell-unused", function () {
                        GameHandler.nextMove($(this).data("index"));
                    });
                },
                nextMove: function (index) {
                    var cell = this._jqTable.find(".cell").eq(index);
                    cell.removeClass("cell-unused");
                    cell.addClass("cell-actived cell-" + (this._currentMove == 0 ? "circle" : "cross"));
                    this._table[index] = this._currentMove;

                    var linked = this.checkLine(this._currentMove); //ru03t86g4z.3

                    if (linked != null) {
                        this.showResult(linked);
                        return true;
                    }
                    if (!this.checkAvailable()) {
                        this.save(-1);
                        this.gameEnd("No winers");
                        return true;
                    }

                    this._currentMove = (this._currentMove + 1) % 2;
                },
                checkAvailable: function () {
                    for (var i = 0; i < this._table.length; ++i) {
                        if (this._table[i] == -1) {
                            return true;
                        }
                    }
                    return false;
                },
                checkLine: function (checkedType) {
                    var lines = [
				        [0, 1, 2],
				        [3, 4, 5],
				        [6, 7, 8],
				        [0, 3, 6],
				        [1, 4, 7],
				        [2, 5, 8],
				        [0, 4, 8],
				        [2, 4, 6]
                    ];
                    var lined = null, linked_line = null;
                    for (var i = 0; i < lines.length; ++i) {
                        lined = true;
                        for (var j = 0 ; j < lines[i].length; ++j) {
                            if (this._table[lines[i][j]] != checkedType) {
                                lined = false;
                            }
                        }
                        if (lined) {
                            return lines[i];
                        }
                    }

                    return null;
                },
                showResult: function (line) {
                    var parentoffset = this._jqTable.offset();
                    var cells = this._jqTable.find(".cell");

                    for (var i = 0 ; i < line.length ; ++i) {
                        cells.eq(line[i]).addClass("cell-lined");
                    }

                    this.save(this._currentMove);
                    this.gameEnd(this._currentMove == 0 ? "Circle win!" : "Cross win!")
                },
                gameEnd: function (text) {
                    this._jqTable.off("click");
                    this._jqTable.find(".status").text(text);
                    this._jqTable.find(".controll").addClass("controll-active");
                },
                save: function (winer) {
                    var records = [];
                    if (localStorage.records != null && localStorage.records != "") {
                        records = JSON.parse(localStorage.records);
                        if (!records.push) records = [];
                    }
                    records.push({ table: this._table, winer: winer, time: new Date() });
                    if (records.length > 5) {
                        records.shift();//throw first item out
                    }

                    localStorage.records = JSON.stringify(records);
                }
            }

            GameHandler.init();
        }
    });
})();