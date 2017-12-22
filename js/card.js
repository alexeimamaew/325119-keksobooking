'use strict';

window.card = (function () {
  var ENTER_KEYCODE = 13;
  var offerDialog = document.querySelector('.popup');
  var closeDialogBtn = document.querySelector('.popup__close');
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
})();
