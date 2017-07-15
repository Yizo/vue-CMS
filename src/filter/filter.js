/*
 * 过滤器
 * */
export function zero(value) {
  if (value) {
    return value
  } else {
    return 0
  }
}

export function format_number(n) {
  var b = parseInt(n).toString();
  var len = b.length;
  if (len <= 3) {
    return b;
  }
  var r = len % 3;
  return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
}

export function Timestamp(row) {
  const now = new Date(row);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();

  if (month < 9) {
    month = '0' + month
  }
  if (date < 9) {
    date = '0' + date
  }

  return year + "-" + month + "-" + date + " ";
}

export function TimeHour(data) {
  const now = new Date(data * 1000);

  if (!data) {
    return ''
  }

  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();

  if (month <= 9) {
    month = '0' + month
  }
  if (date <= 9) {
    date = '0' + date
  }
  if (hour <= 9) {
    hour = '0' + hour
  }
  if (minute <= 9) {
    minute = '0' + minute
  }
  if (second <= 9) {
    second = '0' + second
  }

  return hour + ":" + minute;
}

export function Time(data) {
  const now = new Date(data * 1000);

  if (!data) {
    return ''
  }

  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();

  if (month <= 9) {
    month = '0' + month
  }
  if (date <= 9) {
    date = '0' + date
  }
  if (hour <= 9) {
    hour = '0' + hour
  }
  if (minute <= 9) {
    minute = '0' + minute
  }
  if (second <= 9) {
    second = '0' + second
  }

  return year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
}

export function transfer(value) {
  let num = value / (1024 * 1024 * 1024)
  return Math.round(num * 100) / 100
}

//计算流量
export function getFlow(flowVlueBytes) {
  var flow = "";
  //如果赠送流量小于1MB.则显示为KB
  if (flowVlueBytes / 1024 < 1024) {
    flow = (Math.round(flowVlueBytes / 1024) > 0 ? Math.round(flowVlueBytes / 1024) : 0) + 'KB';
  } else if (flowVlueBytes / 1024 >= 1024 && flowVlueBytes / 1024 / 1024 < 1024) {
    //如果赠送流量大于1MB且小于1    GB的则显示为MB
    flow = (Math.round(flowVlueBytes / 1024 / 1024) > 0 ? Math.round(flowVlueBytes / 1024 / 1024) : 0) + 'MB';
  } else if (flowVlueBytes / 1024 / 1024 >= 1024) {
    //如果流量大于1Gb
    var gb_Flow = flowVlueBytes / 1024 / 1024 / 1024;
    //toFixed(1);四舍五入保留一位小数
    flow = gb_Flow.toFixed(1) + 'GB';
  } else {
    flow = "0KB";
  }
  return flow;
}
