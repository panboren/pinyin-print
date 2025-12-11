export function toFixed(num, to = 1, dep = '-') {
  if (num === null || num === undefined || num === '--' || num === '-') return dep
  num = parseFloat(num)
  const n = 10 ** to
  if (isNaN(num)) {
    return dep
  }
  return Math.floor(num * n) / n
}

/*
import dayjs from 'dayjs';

/!*
 *  echarts 响应式
 * param
 * *!/
export const toSize = (size) => {
  if (size) {
    const viewportSize = document.body.clientWidth || window.innerWidth;
    let num = (viewportSize / 375) * size;
    num = num.toFixed(6);
    return num;
  }
  return size;
};

export function toFixed(num, to = 1, dep = '-') {
  if (num === null || num === undefined || num === '--' || num === '-') return dep;
  num = parseFloat(num);
  const n = 10 ** to;
  if (isNaN(num)) {
    return dep;
  }
  return Math.floor(num * n) / n;
}

/!*
 *  获取数组总数
 *
 * *!/
export function getTotal(ary = [], key) {
  if (!key || ary.length <= 0) {
    return 0;
  }
  return ary.reduce((pre, next) => {
    let num = next[key] || 0;
    num = parseFloat(num);
    if (isNaN(num)) {
      num = 0;
    }
    return pre + num;
  }, 0);
}

export function debounce(fn, wait) {
  let timer = null;
  // eslint-disable-next-line func-names
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // eslint-disable-next-line prefer-rest-params
      fn.apply(this, arguments);
    }, wait);
  };
}

export function setTime(timeList) {
  timeList.map((item) => {
    item = `${String(item).substr(0, 4)}-${String(item).substr(4, 5)}`;
    return item;
  });
}

/!*
 *  格式化时间  '202303'  => '2023-02'
 *  param time 时间   format 格式
 * *!/

export function initTime(time, format = 'YYYY-MM') {
  if (time) {
    return dayjs(time).format(format);
  }
  return time;
}

// 判断旋转echart label
export function setEchartRotate(optionRef = {}, len = 5) {
  const data = optionRef.value || optionRef || {};
  if (data?.xAxis[0]?.axisLabel?.rotate) {
    data.xAxis[0].axisLabel.rotate = data.series[0]?.data?.length >= len ? 25 : 0;
  }
}

/!*
 *
 * 行内样式 可以用
 * 转换 vw postcss-px-to-viewport 算法
 *  value 值  viewportSize 视口宽   viewportUnit 单位  unitPrecision 精确值
 *
 * *!/
export const PxToVw = (value, viewportSize = 375, viewportUnit = 'vw', unitPrecision = 6) => {
  const pixels = parseFloat(value);
  if (isNaN(pixels)) {
    return value;
  }
  const parsedVal = toFixed((pixels / viewportSize) * 100, unitPrecision);
  return parsedVal === 0 ? '0' : parsedVal + viewportUnit;
  function toFixed(number, precision) {
    const multiplier = 10 ** (precision + 1);
    const wholeNumber = Math.floor(number * multiplier);
    return (Math.round(wholeNumber / 10) * 10) / multiplier;
  }
};
*/
