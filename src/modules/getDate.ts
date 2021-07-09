let date = new Date();

const getNowDate = function(){
  let year = date.getFullYear();
  let month = ("0" + (1 + date.getMonth())).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hour = date.getHours();
  let minute = date.getMinutes();
  return year + month + day + hour + minute;
};

const getNowYear = function(){
  let year = date.getFullYear();
  return year;
};

const getNowMonth = function(){
  let month = ("0" + (1 + date.getMonth())).slice(-2);
  return month;
};

const getNowDay = function(){
  let day = ("0" + date.getDate()).slice(-2);
  return day;
};

const getNowHour = function(){
  let hour = date.getHours();
  return hour; 
};

const getNowMinute = function(){
  let minute = date.getMinutes();
  return minute; 
};

let nowDateFull = getNowDate();
let nowDateYear = getNowYear();
let nowDateMonth = getNowMonth();
let nowDateDay = getNowDay();
let nowDateHour = getNowHour();
let nowDateMinute = getNowMinute();

module.exports = { 
  nowDateFull,
  nowDateYear,
  nowDateMonth,
  nowDateDay
};