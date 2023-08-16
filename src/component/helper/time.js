export const calcDiff = (time1, time2) => {
  var diff = new Date(time2).getTime() - new Date(time1).getTime(); // this is a time in milliseconds
  var diff_as_date = new Date(diff);
  return diff_as_date.getHours() + ':' + diff_as_date.getMinutes();
};
