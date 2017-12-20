'use strict';

window.card = (function () {
  var ENTER_KEYCODE = 13;
  var offerDialog = document.querySelector('.popup');
  var closeDialogBtn = offerDialog.querySelector('.popup__close');
  var dialogTemplateCopy = document.querySelector('template').content;
  var TYPE_DESCS = ['Квартира', 'Бунгало', 'Дом'];

  // функция переводит типы жилья в русскоязычный формат
  function getRusType(type) {
    switch (type) {
      case 'flat':
        var humanType = TYPE_DESCS[0];
        break;
      case 'bungalo':
        humanType = TYPE_DESCS[1];
        break;
      case 'house':
        humanType = TYPE_DESCS[2];
        break;
    }
    return humanType;
  }

  function hideCard() {
    offerDialog.classList.add('hidden');
  }

  // закрытие popup кликом мыши
  closeDialogBtn.addEventListener('click', hideCard);

  // закрытие при нажатии enter, когда крестик в фокусе
  closeDialogBtn.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      hideCard();
    }
  });

  function renderOffer(generatedOffer) {
    var dialogDesc = document.querySelector('.map__card');
    var dialogTemplate = dialogTemplateCopy.cloneNode(true);
    offerDialog.replaceChild(dialogTemplate, dialogDesc);
    offerDialog.querySelector('h3').textContent = generatedOffer.offer.title;
    offerDialog.querySelector('small').textContent = generatedOffer.offer.address;
    offerDialog.querySelector('.popup__price').textContent = generatedOffer.offer.price + '&#x20bd;/ночь';
    offerDialog.querySelector('h4').textContent = getRusType(generatedOffer.offer.type);
    offerDialog.querySelector('h4+p').textContent = 'Для ' + generatedOffer.offer.guests + ' гостей в ' + generatedOffer.offer.rooms + ' комнатах';
    offerDialog.querySelector('h4+p+p').textContent = 'Заезд после ' + generatedOffer.offer.checkin + ', выезд до ' + generatedOffer.offer.checkout;
    generatedOffer.offer.features.forEach(function (renderElem) {
      offerDialog.querySelector('.popup__features').insertAdjacentHTML('afterbegin', '<li class="feature feature--' + renderElem + '">');
    });
    offerDialog.querySelector('ul+p').textContent = generatedOffer.offer.description;
    offerDialog.querySelector('.popup__avatar').querySelector('img').src = generatedOffer.author.avatar;
  }

  return {

    show: function showCard(data) {
      offerDialog.classList.remove('hidden');
      renderOffer(data);
    },

    hide: hideCard

  };
})();
