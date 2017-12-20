'use strict';

(function () {

   var ESC_KEYCODE = 27;
   var ENTER_KEYCODE = 13;
   var popup = null;
   var translate = {
     flat: 'Квартира',
     bungalo: 'Бунгало',
     house: 'Дом'
   };
  var popupCloseOpen = false;


   // функция получает удобства в объявлениях
  function getFeatures(features) {
    var listLength = features.length;
    var featureString = '';
    for (var i = 0; i < listLength; i++) {
      featureString += '<li class="feature feature--' + OFFER_FEATURES[i] + '" ></li>';
    }
    return featureString;
  }

  // функция добавления слушателя в popup
  function addPopupListener() {
    var popupClose = map.querySelector('.popup__close');
    popupClose.addEventListener('click', closeDialog);
    map.addEventListener('keydown', onPopupEscPress);
    popupClose.addEventListener('keydown', onPopupEnterPress);
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

  window.card = {
  // функция показывает карточки объявлений с заполненными данными
  renderApartmentContent: function (obj) {
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
  }

  function shomAppartmentPopup(string) {
    for (var i = 0; i < apartments.length; i++) {
      if (apartments[i].author.avatar === string) {
        renderApartmentContent(apartments[i]);
        popup = map.querySelector('.popup');
      }
    }
  }

}());
