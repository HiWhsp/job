//获取时间 
const getFormatTime = (time) => {
  if (!time) {
    return "";
  }
  let timeStr = new Date(time).getTime();
  let interval = new Date().getTime() - timeStr; //间隔时间
  // //console.log('时间间隔', interval)
  let _1_minute = 1000 * 60;
  let _1_hour = 1000 * 60 * 60;
  let _1_day = 1000 * 60 * 60 * 24;
  let _1_month = 1000 * 60 * 60 * 24 * 30;
  let ret = "";

  if (interval < _1_hour) {
    ret = "刚刚";
  } else {
    if (interval < _1_day) {
      ret = Math.floor(interval / _1_hour) + "小时前";
    } else if (interval < _1_month) {
      ret = Math.floor(interval / _1_day) + "天前";
    } else {
      ret = time.substr(0, 10);
    }
  }

  return ret;
};

//获取注册时间
const getRegisterTime = (time) => {
  if (!time) {
    return "";
  }
  let timeStr = new Date(time).getTime();
  let interval = new Date().getTime() - timeStr; //间隔时间
  // //console.log('时间间隔', interval)
  let _1_minute = 1000 * 60;
  let _1_hour = 1000 * 60 * 60;
  let _1_day = 1000 * 60 * 60 * 24;
  let _1_month = 1000 * 60 * 60 * 24 * 30;
  let _1_year = 1000 * 60 * 60 * 24 * 30 * 12;
  let ret = "";

  if (interval < _1_hour) {
    ret = "1天内";
  } else {
    if (interval < _1_day) {
      ret = Math.floor(interval / _1_hour) + "小时";
      ret = "1天内";
    } else if (interval < _1_month) {
      ret = Math.floor(interval / _1_day) + "天";
    } else if (interval < _1_year) {
      ret = Math.floor(interval / _1_month) + "个月";
    }
  }

  return ret;
};








export { getFormatTime, getRegisterTime };
