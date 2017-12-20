'use strict';

window.map = (function (pin, backend, msg, card, util) {

  var nearbyAdsList = document.querySelector('.map__pins');
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var START_AMOUNT_OF_ELEMENTS = 3;
  var renderableOffers = [];

  // функция диактивирует точки на карте
  function deactivateLastPin() {
    var pins = nearbyAdsList.querySelectorAll('.map__pin');
    util.forEach(pins, function (elem) {
      if (elem.classList.contains('map__pin--active')) {
        elem.classList.remove('map__pin--active');
      }
    });
  }

  // закрытие нажатием ESC
  function onDialogEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      deactivateLastPin();
      card.hide();
      document.removeEventListener('keydown', onDialogEscPress);
    }
  }
  // функция делает точку активной при клике на пин и добавляет слушатель на событие keydown
  function onPinClick(evt) {
    card.show(renderableOffers[evt.currentTarget.dataset.index]);
    deactivateLastPin();
    evt.currentTarget.classList.add('map__pin--active');
    document.addEventListener('keydown', onDialogEscPress);
  }

  // функция деляает пин активным при нажатии клавиши ENTER
  function onPinEnterPress(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      card.show(renderableOffers[evt.currentTarget.dataset.index]);
      deactivateLastPin();
      evt.currentTarget.classList.add('map__pin--active');
      document.addEventListener('keydown', onDialogEscPress);
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
        elem.addEventListener('click', onPinClick);
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
