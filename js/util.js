'use strict';

window.util = (function () {
  var DEBOUNCE_INTERVAL = 500;
  var debounce = function (fun) {
    var lastTimeout = null;
    return function () {
      if (lastTimeout !== null) {
        clearTimeout(lastTimeout);
      }
      lastTimeout = setTimeout(fun, DEBOUNCE_INTERVAL);
    };
  };

  function getRandomElementsFromArr(data, count) {
    var result = [];
    var copy = data.slice();

    for (var i = 0; i < count; i++) {
      var randomIdx = Math.floor(Math.random() * copy.length);
      result.push(copy[randomIdx]);
      copy.splice(randomIdx, 1);
    }
    return result;
  }

  function forEach(arr, func) {
    Array.prototype.forEach.call(arr, func);
  }

  return {
    debounce: debounce,
    getRandomFromArr: getRandomElementsFromArr,
    forEach: forEach
  };
})();
