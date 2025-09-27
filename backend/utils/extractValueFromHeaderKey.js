const getCookieValue = function(field, key) {
  const value = ('; ' + field).split(`; ${key}=`).pop().split(';')[0];
  return value;
}

export default getCookieValue