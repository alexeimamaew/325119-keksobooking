"use strict";

var OFFER_TITLES = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var OFFER_FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var OFFER_TYPE = ["flat", "house", "bungalo"];
var OFFFER_CHECKIN_CHECKOUT = ["12:00", "13:00", "14:00"];
var translate = {
  flat: "Квартира",
  bungalo: "Бунгало",
  house: "Дом"
}

var template = document.querySelector("template");
var map = document.querySelector(".map");

var apartments = createApartments(8, OFFER_TITLES, OFFER_TYPE, OFFFER_CHECKIN_CHECKOUT, OFFER_FEATURES);

showApartments(apartments[0]);
addPins(apartments);

function getFeatures(listLength) {
  listLength = OFFER_FEATURES.length;
  var featureString = "";
  for (var i = 0; i < listLength; i++) {
    featureString += '<li class="feature feature--' + OFFER_FEATURES[i] + '"></li>';
  }
  return featureString;
}

function getRandomFromRange(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function createApartments(number, titles, type, checkin, features) {
  var result = [],
    obj = {},
    i;

  for (i = 0; i < number; i++) {
    obj.author = {};
    obj.offer = {};
    obj.location = {};
    obj.author.avatar = "img/avatars/user0" + (i + 1) + ".png";
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
    obj.offer.address = obj.location.x + ", " + obj.location.y;

    result.push(obj);
    obj = {};
  }
  return result;
}

function showApartments(obj) {
  var templateArticle = template.content.querySelector(".map__card");
  var article = templateArticle.cloneNode(true);
  var elem = map.querySelector(".map__filters-container");

  article.querySelector("h3").textContent = obj.offer.title;
  article.querySelector("small").textContent = obj.offer.address;
  article.querySelector(".popup__price").innerHTML = obj.offer.price + " &#x20bd;/ночь";
  article.querySelector("h4").textContent = translate[obj.offer.type];
  article.querySelector("h4+p").textContent = obj.offer.rooms + " для " + obj.offer.guests + " гостей";
  article.querySelector("h4+p+p").textContent = "Заезд после " + obj.offer.checkin + " выезд до " + obj.offer.checkout;
  article.querySelector(".popup__features").innerHTML = getFeatures(obj.offer.features);
  article.querySelector("ul+p").textContent = obj.offer.description;
  article.querySelector(".popup__avatar").setAttribute("src", obj.author.avatar);
  map.insertBefore(article, elem);

}

function addPins(array) {
  var templateBtn = template.content.querySelector(".map__pin");
  var places = map.querySelector(".map__pins");
  var btnsFragment = document.createDocumentFragment();
  var button;

  for (var i = 0; i < array.length; i++) {
    button = templateBtn.cloneNode(true);
    button.style.top = (array[i].location.y - 22) + "px";
    button.style.left = (array[i].location.x - 40 / 2) + "px";
    button.querySelector("img").setAttribute("src", array[i].author.avatar);
    btnsFragment.appendChild(button);
    places.appendChild(btnsFragment);
  }
}
