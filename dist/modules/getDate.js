"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getNowDate = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return year + month + day;
};
var nowDate = getNowDate();
module.exports = { nowDate };
//# sourceMappingURL=getDate.js.map