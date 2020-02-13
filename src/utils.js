// utils.js

const hexCodes = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F"
];
let userMapping = {};
let userIndex = 0;

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateIndex() {
  userIndex++;
  return userIndex;
}

function generateRandomColorHex() {
  var hexCode = "";
  var length = hexCodes.length;
  for (var i = 0; i < 6; i++) {
    var idx = generateRandomNumber(0, length);
    hexCode = hexCode + hexCodes[idx];
  }
  return hexCode;
}

module.exports.formatDatetimeString = function(dateStr) {
  var date = new Date(dateStr);
  var now = new Date();
  if (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  ) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes}${ampm}`;
  } else {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
};

module.exports.generateImageUrl = function(username) {
  var obj = {};
  if (username in userMapping) {
    obj = userMapping[username];
  } else {
    obj.colorHex = generateRandomColorHex();
    obj.idx = generateIndex();
    userMapping[username] = obj;
  }

  return `https://placehold.it/50/${obj.colorHex}/fff&text=U${obj.idx}`;
};
