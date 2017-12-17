'use strict';

(function () {

  var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFER_TYPE = ['flat', 'house', 'bungalo'];
  var OFFFER_CHECKIN_CHECKOUT = ['12:00', '13:00', '14:00'];
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

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
  var apartments = null;

  // функция получает удобства в объявлениях
  function getFeatures(features) {
    var listLength = features.length;
    var featureString = '';
    for (var i = 0; i < listLength; i++) {
      featureString += "<li class=\"feature feature--" + OFFER_FEATURES[i] + "\" ></li>";
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

  // функция показывает карточки объявлений с заполненными данными
  function renderApartmentContent(obj) {
    var templateArticle = template.content.querySelector('.map__card');
    var article = null;
    var mapFilters = map.querySelector('.map__filters-container');

    if (popupCloseOpen === true) {
      article = map.querySelector('.popup');
      popup = article;
    } else {
      article = templateArticle.cloneNode(true);
      popup = map.querySelector('.popup');
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

  function shomAppartmentPopup(string) {
    for (var i = 0; i < apartments.length; i++) {
      if (apartments[i].author.avatar === string) {
        renderApartmentContent(apartments[i]);
        popup = map.querySelector('.popup');
      }
    }
  }

  // при нажатии на любой из элементов .map__pin ему добавляется класс .map__pin--active и должен показываться popup
  function onButtonsClick() {
    var srcImg = '';
    var target = event.target;
    var pin = target.closest('.map__pin');
    if (!map.contains(pin) || pin.classList.contains('map__pin--main') || !pin) {
      return;
    }
    if (prefClickAtButton) {
      prefClickAtButton.classList.remove('map__pin--active'); // при нажатии на элемент скрытие класса .map__pin--active у др. элементов
      prefClickAtButton = pin;
    } else {
      prefClickAtButton = pin;
    }
    srcImg = pin.querySelector('img').getAttribute('src');
    shomAppartmentPopup(srcImg);
    popup.classList.remove('hidden');
    pin.classList.add('map__pin--active');
  }

  // функция расставляет pins на карте
  function addPins(array) {
    var templateBtn = template.content.querySelector('.map__pin');
    var places = map.querySelector('.map__pins');
    var btnsFragment = document.createDocumentFragment();
    var button;

    for (var i = 0; i < array.length; i++) {
      button = templateBtn.cloneNode(true);
      button.style.top = (array[i].location.y - 22) + 'px';
      button.style.left = (array[i].location.x - 40 / 2) + 'px';
      button.querySelector('img').setAttribute('src', array[i].author.avatar);
      btnsFragment.appendChild(button);
      places.appendChild(btnsFragment);
    }
  }

  // функция открытия popup по кнопке Enter
  function onPinEnterPress(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      onButtonsClick();
    }
  }

  // функция добвляет слушателей на pin
  function addPinAction() {
    map.addEventListener('click', onButtonsClick);
    map.addEventListener('keydown', onPinEnterPress);
  }

  // активация карты / формы. Событие mouseup на блоке map__pin--main убирает класс map--faded у карты и класс notice__form--disabled у формы
  function cardActivation() {
    var mapPinMain = map.querySelector('.map__pin--main');
    var noticeForm = document.querySelector('.notice__form');
    mapPinMain.addEventListener('mouseup', function () {
      map.classList.remove('map--faded');
      noticeForm.classList.remove('notice__form--disabled');
      addPinAction();
    });
  }

  cardActivation(); // раздизабливание карты
  apartments = createApartments(8, OFFER_TITLES, OFFER_TYPE, OFFFER_CHECKIN_CHECKOUT, OFFER_FEATURES); // создание карточек объявлений
  addPins(apartments); // расстановка pins на карте.
}());
