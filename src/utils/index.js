/**
 * 数组去重
 */
const uniq = (elements) => {
  if (!Array.isArray(elements)) {
    return [];
  }

  return elements.filter(
    (element, index) => index === elements.indexOf(element)
  );
};

/**
 * 清除数组里面的非法值
 */
const clean = (elements) => {
  if (!Array.isArray(elements)) {
    return [];
  }

  return elements.filter((element) => !!element);
};


module.exports = {
  uniq,
  clean
}