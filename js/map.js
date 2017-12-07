"use strict";


var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_TYPE = ['flat', 'house', 'bungalo'];
var OFFFER_CHECKIN_CHECKOUT = ['12:00', '13:00', '14:00'];

function getType(type) {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
  }
  return false;
}

function getFeatures(listLength) {
  listLength = OFFER_FEATURES.length;
  var featureString = '';
  for (var i = 0; i < listLength; i++) {
    featureString += '<li class="feature feature--' + OFFER_FEATURES[i] + '"></li>';
  }
  return featureString;
}

function getRandomFromRange(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function createApartment(number, titles, type, checkin, features) {
  var result = [],
    obj = {},
    i;

  for (i = 1; i < number; i++) {
    obj.author = {};
    obj.offer = {};
    obj.location = {};

    obj.author.avatar = 'img/avatars/user0' + i + '.png';
    obj.offer.title = titles[getRandomFromRange(0, titles.length - 1)];
    obj.offer.price = getRandomFromRange(1000, 1000000);
    obj.offer.type = type[getRandomFromRange(0, type.length - 1)];
    obj.offer.rooms = getRandomFromRange(1, 5);
    obj.offer.guests = getRandomFromRange(1, 100);
    obj.offer.checkin = checkin[getRandomFromRange(0, checkin.length - 1)];
    obj.offer.checkout = checkin[getRandomFromRange(0, checkin.length - 1)];
    obj.offer.features = features[0];
    obj.offer.description = "";
    obj.offer.photos = [];
    obj.location.x = getRandomFromRange(300, 900);
    obj.location.y = getRandomFromRange(100, 500);
    obj.offer.address = obj.location.x + ', ' + obj.location.y;

    result.push(obj);
    obj = {};
  }
  return result;
}
console.log(createApartment(9, OFFER_TITLES, OFFER_TYPE, OFFFER_CHECKIN_CHECKOUT, OFFER_FEATURES));

var apartments = createApartment(9, OFFER_TITLES, OFFER_TYPE, OFFFER_CHECKIN_CHECKOUT, OFFER_FEATURES);

var places = document.querySelector('.map__pins');
var maps = document.querySelector('.map');

var template = document.querySelector('template');
var templateBtn = template.content.querySelector('.map__pin');
var templateArticle = template.content.querySelector('.map__card');

var btnsFragment = document.createDocumentFragment();
var articlesFragment = document.createDocumentFragment();

function createOffer(apartments) {
  for (var i = 0; i < apartments.length; i++) {
    var apartment = apartments[i];

    var article = templateArticle.cloneNode(true);

    article.querySelector('h3').textContent = apartment.offer.title;
    article.querySelector('small').textContent = apartment.offer.address;
    article.querySelector('.popup__price').innerHTML = apartment.offer.price + ' &#x20bd;/ночь';
    article.querySelector('h4').textContent = getType(apartment.offer.type);
    article.querySelector('h4+p').textContent = apartment.offer.rooms + ' для ' + apartment.offer.guests + ' гостей';
    article.querySelector('h4+p+p').textContent = 'Заезд после ' + apartments[i].offer.checkin + ' выезд до ' + apartments[i].offer.checkout;
    article.querySelector('.popup__features').innerHTML = getFeatures(apartment.offer.features);
    article.querySelector('ul+p').textContent = apartment.offer.description;
    article.querySelector('.popup__avatar').setAttribute('src', apartment.author.avatar);
    articlesFragment.appendChild(article);

    var button = templateBtn.cloneNode(true);
    button.style.top = (apartment.location.y - 22) + 'px';
    button.style.left = (apartment.location.x - 40 / 2) + 'px';
    button.querySelector('img').setAttribute('src', apartment.author.avatar);
    btnsFragment.appendChild(button);

    places.appendChild(btnsFragment);
    maps.appendChild(articlesFragment);
  }
}
createOffer(apartments);
