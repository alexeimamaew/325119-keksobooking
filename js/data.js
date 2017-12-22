'use strict';

window.data = (function () {

  // функция возвращает случайное число в заданном диапазоне
  function getRandomFromRange(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
  }

  // функция возвращает случайный элемент из массива
  function getRandomFrom(possibleValues) {
    var randomIndex = Math.floor(Math.random() * possibleValues.length);
    return possibleValues[randomIndex];
  }

getRandomFrom();



})();
