'use strict';

window.data = (function () {
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];


  // функция возвращает случайное число в заданном диапазоне
  function getRandomFromRange(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
  }

  // функция возвращает случайный элемент из массива
  function getRandomFrom(possibleValues) {
    var randomIndex = Math.floor(Math.random() * possibleValues.length);
    return possibleValues[randomIndex];
  }

  // функция создает уникальный адрес аватарки точки на карте
  function generateUniqueURL(minAvatarID, maxAvatarID, generatedOffer) {
    var isAvatarUnique = false;
    while (!isAvatarUnique) {
      var randomURL = 'img/avatars/user0' + getRandomFromRange(minAvatarID, maxAvatarID) + '.png';
      isAvatarUnique = true;
      generatedOffer.forEach(function (elem) {
        if (elem.author.avatar === randomURL) {
          isAvatarUnique = false;
        }
      });
    }
    return randomURL;
  }

  // функция возвращает массив, содержащий случайное количество элементов
  function getRandomFeatures(options) {
    var result = [];
    var dirtyFeatures = options.FEATURES.slice();
    var randomLength = Math.floor(Math.random() * options.FEATURES.length);
    for (var i = 0; i < randomLength; i++) {
      var randomIdx = Math.floor(Math.random() * dirtyFeatures.length);
      result.push(dirtyFeatures[randomIdx]);
      dirtyFeatures.splice(randomIdx, 1);
    }
    return result;
  }
})();
