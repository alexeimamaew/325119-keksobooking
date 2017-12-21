'use strict';

window.backend = (function () {

  var SERVER_URL = 'https://js.dump.academy/keksobooking';
  var cache = [];

  function save(data, onLoad, onError) {
    // создание нового запроса к серверу
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000; // 10s

    // указываем метод и адрес, отправляем запрос с данными
    xhr.open('POST', SERVER_URL);
    xhr.send(data);
  }

  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', SERVER_URL + '/data');
    if (cache.length !== 0) {
      onLoad(cache);
    } else {
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          cache = xhr.response;
          onLoad(xhr.response);
        } else {
          onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });
      xhr.timeout = 10000; // 10s
      xhr.send();
    }
  }

  return {
    save: save,
    load: load,
  };
})();
