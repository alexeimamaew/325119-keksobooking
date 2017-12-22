'use strict';

window.map = (function (pin, backend, msg, card, util) {
  var nearbyAdsList = document.querySelector('.map__pins');
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var START_AMOUNT_OF_ELEMENTS = 5;
  var renderableOffers;
  var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFER_TYPE = ['flat', 'house', 'bungalo'];
  var OFFFER_CHECKIN_CHECKOUT = ['12:00', '13:00', '14:00'];
  var translate = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом'
  };

  var template = document.querySelector('template');
  var map = document.querySelector('.map');
  var popupCloseOpen = false;
  var prefClickAtButton = null;
  var popup = null;

  // функция диактивирует точки на карте
  function deactivateLastPin() {
    var pins = nearbyAdsList.querySelectorAll('.map__pin');
    util.forEach(pins, function (elem) {
      if (elem.classList.contains('map__pin--active')) {
        elem.classList.remove('map__pin--active');
      }
    });
  }

  //  Функция получает удобства в объявлениях
  function getFeatures(features) {
    var listLength = features.length;
    var featureString = '';
    for (var i = 0; i < listLength; i++) {
      featureString += '<li class="feature feature--' + OFFER_FEATURES[i] + '"></li>';
    }
    return featureString;
  }

  // функция получает рондомное значение в диапозоне min/max
  function getRandomFromRange(min, max) {
    return Math.round(min + Math.random() * (max - min));
  }

  // функция перетасовки значений в массиве
  function shuffle(array) {
    array.sort(function () {
      return Math.random() - 0.5;
    });
    return array;
  }

  // создание массива чисел величиной  number  и его перетасовка
  function createArr(number) {
    var arr = [];
    for (var i = 0; i < number; i++) {
      arr[i] = i;
    }
    return shuffle(arr);
  }

  // случайные удобства помещений
  function setFeatureRange() {
    var optionLength = OFFER_FEATURES.length;
    var featureAmount = getRandomFromRange(1, optionLength);
    var featureArray = createArr(optionLength);
    featureArray.length = featureAmount;
    for (var i = 0; i < featureAmount; i++) {
      featureArray[i] = OFFER_FEATURES[featureArray[i]];
    }
    return featureArray;
  }

  // функция создания карточек объявлений
  function createApartments(number, titles, type, checkin) {
    var result = [];
    var obj = {};
    var i;

    for (i = 0; i < number; i++) {
      obj.author = {};
      obj.offer = {};
      obj.location = {};
      obj.author.avatar = 'img/avatars/user0' + (i + 1) + '.png';
      obj.offer.title = titles[getRandomFromRange(0, titles.length - 1)];
      obj.offer.price = getRandomFromRange(1000, 1000000);
      obj.offer.type = type[getRandomFromRange(0, type.length - 1)];
      obj.offer.rooms = getRandomFromRange(1, 5);
      obj.offer.guests = getRandomFromRange(1, 5);
      obj.offer.checkin = checkin[getRandomFromRange(0, checkin.length - 1)];
      obj.offer.checkout = checkin[getRandomFromRange(0, checkin.length - 1)];
      obj.offer.features = setFeatureRange();
      obj.offer.description = '';
      obj.offer.photos = [];
      obj.location.x = getRandomFromRange(300, 900);
      obj.location.y = getRandomFromRange(100, 500);
      obj.offer.address = obj.location.x + ', ' + obj.location.y;

      result.push(obj);
      obj = {};
    }
    return result;
  }

  // функция закрытия popup
  function closeDialog() {
    popup = document.querySelector('.popup');
    popup.classList.add('hidden');
    prefClickAtButton.classList.remove('map__pin--active');
  }

  // функция закрытия popup по кнопке ESC
  function onPopupEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeDialog();
    }
  }

  // функция закрытия popup по кнопке Enter
  function onPopupEnterPress(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closeDialog();
    }
  }

  // функция добавления слушателя в popup
  function addPopupListener() {
    var popupClose = map.querySelector('.popup__close');
    popupClose.addEventListener('click', closeDialog);
    map.addEventListener('keydown', onPopupEscPress);
    popupClose.addEventListener('keydown', onPopupEnterPress);
  }

  // При нажатии на любой из элементов .map__pin ему добавляется класс .map__pin--active и должен показываться элемент .popup
  function onButtonsClick() {
    popup = document.querySelector('.popup');
    var srcImg = '';
    var target = event.target;
    pin = target.closest('.map__pin');
    if (!map.contains(pin) || pin.classList.contains('map__pin--main') || !pin) {
      return;
    }
    if (prefClickAtButton) {
      prefClickAtButton.classList.remove('map__pin--active'); // при нажатии на элемент скрытие класса .map__pin--active у др. элементов
      prefClickAtButton = pin;
    } else {
      prefClickAtButton = pin;
    }
    popup.classList.remove('hidden');
    srcImg = pin.querySelector('img').getAttribute('src');
    shomAppartmentPopup(srcImg);
    pin.classList.add('map__pin--active');
  }

  // функция показывает карточки объявлений с заполненными данными
  function renderApartmentContent(obj) {
    var templateArticle = template.content.querySelector('.map__card');
    var article = null;
    var mapFilters = map.querySelector('.map__filters-container');

    if (popupCloseOpen === true) {
      article = document.querySelector('.popup');
    } else {
      article = popup;
      article = templateArticle.cloneNode(true);
    }
    article.querySelector('h3').textContent = obj.offer.title;
    article.querySelector('small').textContent = obj.offer.address;
    article.querySelector('.popup__price').innerHTML = obj.offer.price + ' &#x20bd;/ночь';
    article.querySelector('h4').textContent = translate[obj.offer.type];
    article.querySelector('h4+p').textContent = obj.offer.rooms + ' для ' + obj.offer.guests + ' гостей';
    article.querySelector('h4+p+p').textContent = 'Заезд после ' + obj.offer.checkin + ' выезд до ' + obj.offer.checkout;
    article.querySelector('.popup__features').innerHTML = getFeatures(obj.offer.features);
    article.querySelector('ul+p').textContent = obj.offer.description;
    article.querySelector('.popup__avatar').setAttribute('src', obj.author.avatar);
    map.insertBefore(article, mapFilters); // вставляет элемент article перед mapFilters

    addPopupListener(); // добавление слушателя в popup
    popupCloseOpen = true;
  }
  var apartments = createApartments(8, OFFER_TITLES, OFFER_TYPE, OFFFER_CHECKIN_CHECKOUT, OFFER_FEATURES);
  renderApartmentContent(apartments[0]);


  function shomAppartmentPopup(string) {

    for (var i = 0; i < apartments.length; i++) {
      if (apartments[i].author.avatar === string) {
        renderApartmentContent(apartments[i]);

      }
    }
  }

  // функция открытия popup по кнопке Enter
  function onPinEnterPress(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      onButtonsClick();
    }
  }

  // функция отрисовывания пинов. Для какого массива мы отрисовываем пины, для этого же массива мы и рисуем диалоги
  function render(data) {
    renderableOffers = data;
    var fragment = document.createDocumentFragment();
    data.forEach(function (elem, idx) {
      fragment.appendChild(pin.renderPin(elem, idx));
    });
    nearbyAdsList.appendChild(fragment);
    var pins = nearbyAdsList.querySelectorAll('.map__pin');
    util.forEach(pins, function (elem) {
      if (!elem.classList.contains('map__pin--main')) {
        elem.addEventListener('click', onButtonsClick);
        elem.addEventListener('keydown', onPinEnterPress);
      }
    });
  }

  var successHandler = function (data) {
    var randomElements = util.getRandomFromArr(data, START_AMOUNT_OF_ELEMENTS);
    render(randomElements);
  };

  backend.load(successHandler, msg.show);

  var USER_ICON_OFFSETS = {
    left: 37,
    top: 94
  };

  var MIN_COORDS = {
    x: 0,
    y: 100
  };

  var MAX_COORDS = {
    x: 1150,
    y: 570
  };

  var pinMain = document.querySelector('.map__pin--main');
  var addressField = document.querySelector('#address');

  // кнопку мыши нажали
  pinMain.addEventListener('mousedown', function (evt) {

    // координаты во время клика
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    // функция передвижения мыши
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: (startCoords.x - moveEvt.clientX),
        y: (startCoords.y - moveEvt.clientY)
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
      pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';

      if (pinMain.offsetLeft >= MAX_COORDS.x && shift.x < 0) {
        pinMain.style.left = MAX_COORDS.x + 'px';
      } else if (pinMain.offsetTop >= MAX_COORDS.y && shift.y < 0) {
        pinMain.style.top = MAX_COORDS.y + 'px';
      } else if (pinMain.offsetLeft <= MIN_COORDS.x && shift.x > 0) {
        pinMain.style.left = MIN_COORDS.x + 'px';
      } else if (pinMain.offsetTop <= MIN_COORDS.y && shift.y > 0) {
        pinMain.style.top = MIN_COORDS.y + 'px';
      } else {
        addressField.classList.remove('invalid');
      }
    };

    // кнопку мыши отпустили
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      addressField.value = 'x:' + (pinMain.offsetLeft + USER_ICON_OFFSETS.left) + ', y:' + (pinMain.offsetTop + USER_ICON_OFFSETS.top);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  return {
    render: render,
    deactivateLastPin: deactivateLastPin
  };

})(window.pin, window.backend, window.msg, window.card, window.util);
