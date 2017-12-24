'use strict';

window.search = (function (map, backend, util, msg) {

  var nearbyAdsList = document.querySelector('.map__pins');
  var filtersForm = document.querySelector('.map__filters');
  var housingType = filtersForm.querySelector('#housing-type');
  var housingRooms = filtersForm.querySelector('#housing-rooms');
  var housingGuests = filtersForm.querySelector('#housing-guests');
  var housingPrice = filtersForm.querySelector('#housing-price');
  var housingFeatures = filtersForm.querySelectorAll('.feature input');
  var offers = [];
  var filteringFucntions = [filterOffersByType, filterOffersByRoomsCount, filterOffersByPrice, filterOffersByGuestsCount, filterOffersByFeatures];
  var filters = document.querySelectorAll('.map__filter');

  // функция, для удаления всех пинов с карты (кроме одного)
  function removePins() {
    var pins = nearbyAdsList.querySelectorAll('.map__pin');
    util.forEach(pins, function (elem) {
      if (!elem.classList.contains('map__pin--main')) {
        elem.remove();
      }
    });
  }

  // фильтр по типу жилья
  function filterOffersByType(elem) {
    if (housingType.value === 'any') {
      return offers;
    } else {
      return elem.offer.type === housingType.value;
    }
  }

  // фильтр по количеству комнат
  function filterOffersByRoomsCount(elem) {
    if (housingRooms.value === 'any') {
      return offers;
    } else {
      return elem.offer.rooms === Number(housingRooms.value);
    }
  }

  // фильтр по цене
  function filterOffersByPrice(elem) {
    switch (housingPrice.value) {
      case 'any':
        return offers;
      case 'middle':
        return elem.offer.price >= 10000 && elem.offer.price <= 50000;
      case 'low':
        return elem.offer.price < 10000;
      case 'high':
        return elem.offer.price > 50000;
      default:
        return false;
    }
  }

  // фильтр по количеству гостей
  function filterOffersByGuestsCount(elem) {
    if (housingGuests.value === 'any') {
      return offers;
    } else {
      return elem.offer.guests === Number(housingGuests.value);
    }
  }

  function filterOffersByFeatures(elem) { // фильтр по features
    var featureCheckedCheckboxes = filtersForm.querySelectorAll('.feature input[type="checkbox"]:checked');
    var checkedFeatures = Array.prototype.map.call(featureCheckedCheckboxes, function (checkbox) {
      return checkbox.value;
    });
    return checkedFeatures.every(function (feature) {
      return elem.offer.features.indexOf(feature) > -1;
    });
  }

  // функция фильтрует объявления и отправляет на отрисовку
  function updatePins() {
    removePins();
    var filteredData = filteringFucntions.reduce(function (initial, elem) {
      return initial.filter(elem);
    }, offers);
    map.render(filteredData);
  }

  util.forEach(filters, function (elem) {
    elem.addEventListener('change', util.debounce(updatePins));
  });

  util.forEach(housingFeatures, function (elem) {
    elem.addEventListener('change', util.debounce(updatePins));
  });

  function successHandler(data) {
    offers = data;
  }

  backend.load(successHandler, msg.show);

})(window.map, window.backend, window.util, window.msg);
