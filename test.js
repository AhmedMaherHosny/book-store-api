const moment = require("moment");

//const timestamp = '2023-03-19T13:05:16.702Z';
//const date = moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');
//console.log(date);

const timestamp = "2023-03-19T13:05:16.702Z";
const dateObj = moment(timestamp);
const year = dateObj.year();
const month = dateObj.month();
const day = dateObj.date();
const hours = dateObj.hour();
const minutes = dateObj.minute();
const seconds = dateObj.second();
//const formattedTime = dateObj.format('h:mm:ss a');
console.log(year, month + 1, day, hours, minutes, seconds);
