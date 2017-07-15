/**
 * Created by admin on 2017/4/17.
 */
import * as API from "../../api/api";
import axios from "axios";

/*非空检查*/
export function checkEmpty(data) {
  let is = true
  for (var key in data) {
    if (data[key] == '') {
      is = false
    }
  }
  return is;
}

/*数字检查*/
export function isDigit(value) {
  var patrn = /^[0-9]*$/;
  if (patrn.exec(value) == null || value == "") {
    return false
  } else {
    return true
  }
}

/*请求前参数配置*/
export function paramsConfig(options) {
  for (var i in options) {
    if (options[i] === undefined || options[i] === '' || options[i] === null || options[i] === '全部版本' || options[i] === '全部渠道') {
      delete options[i]
    }
  }
  return options
}

export function year(row) {
  const now = new Date(row);
  var year = now.getFullYear();
  return year;
}

export function month(row) {
  const now = new Date(row);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();

  if (month <= 9) {
    month = '0' + month
  }

  return year + "-" + month;
}

export function Timestamp(row) {
  const now = new Date(row);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();

  if (month <= 9) {
    month = '0' + month
  }
  if (date <= 9) {
    date = '0' + date
  }
  return year + "-" + month + "-" + date;
}

export function Times(data) {
  const now = new Date(data * 1000);
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

  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

export function monthTime() {
  let now = new Date()
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();

  if (month <= 9) {
    month = '0' + month
  }
  if (date <= 9) {
    date = '0' + date
  }
  return {start: year + "-" + month + "-" + '01', end: year + "-" + month + "-" + date}
}

/*金额逗号间隔*/
export function format_number(n) {
  var b = parseInt(n).toString();
  var len = b.length;
  if (len <= 3) {
    return b;
  }
  var r = len % 3;
  return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
}

/*获取服务器类型*/
export function getNodeType(parm) {
  return new Promise((resolve, reject) => {
    const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
    axios({
      method: 'GET',
      url: API.server_node_types,
      headers: {'Authorization': token},
      params: parm,
    }).then(function (res) {

      if (res.status == 200) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  })
}

/*获取地域信息*/
export function getArea(parm) {
  return new Promise((resolve, reject) => {
    const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
    this.$http({
      method: 'GET',
      url: API.area_node_regions,
      headers: {'Authorization': token},
      params: parm,
    }).then(function (res) {

      if (res.status == 200) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  })
}

/*获取渠道和版本*/
export function getChannelVerion(parm) {
  return new Promise((resolve, reject) => {
    const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
    axios({
      method: 'GET',
      url: API.group_index,
      headers: {'Authorization': token}
    }).then(function (res) {
      if (res.status == 200) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  })
}
