// utils.js

module.exports.formatDatetimeString = function(dateStr) {
  var date = new Date(dateStr);
  var now = new Date();
  if (
    now.getYear() === date.getYear() &&
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
    return `${date.getYear()}-${date.getMonth()}-${date.getDate()}`;
  }
};
