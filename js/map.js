var apartments = [];
apartments[0] = {
  "author": {
    "avatar": "img/avatars/user{{01}}.png",
  },

  "offer": {
    "title": "Большая уютная квартира",
    "address": "{{location.x}}, {{location.y}}",
    "price": 4999,
    "type": "flat",
    "rooms": 2,
    "guests": 5,
    "checkin": "14:00",
    "checkout": "13:00",
    "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"],
    "description": "",
    "photos": []
  },

  "location": {
    "x": 500,
    "y": 410,
  },
};
apartments[1] = {
  "author": {
    "avatar": "img/avatars/user{{02}}.png",
  },

  "offer": {
    "title": "Огромный прекрасный дворец",
    "address": "{{location.x}}, {{location.y}}",
    "price": 999999,
    "type": "house",
    "rooms": 2,
    "guests": 4,
    "checkin": "12:00",
    "checkout": "12:00",
    "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"],
    "description": "",
    "photos": []
  },

  "location": {
    "x": 101,
    "y": 287
  },
};
apartments[2] = {
  "author": {
    "avatar": "img/avatars/user{{03}}.png",
  },

  "offer": {
    "title": "Маленькая неуютная квартира",
    "address": "{{location.x}}, {{location.y}}",
    "price": 1100,
    "type": "flat",
    "rooms": 1,
    "guests": 3,
    "checkin": "13:00",
    "checkout": "14:00",
    "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"],
    "description": "",
    "photos": []
  },

  "location": {
    "x": 711,
    "y": 210
  },
};
apartments[3] = {
  "author": {
    "avatar": "img/avatars/user{{04}}.png",
  },

  "offer": {
    "title": "Маленький ужасный дворец",
    "address": "{{location.x}}, {{location.y}}",
    "price": 500000,
    "type": "house",
    "rooms": 2,
    "guests": 6,
    "checkin": "13:00",
    "checkout": "14:00",
    "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"],
    "description": "",
    "photos": []
  },

  "location": {
    "x": 450,
    "y": 407
  },
};
apartments[4] = {
  "author": {
    "avatar": "img/avatars/user{{05}}.png",
  },

  "offer": {
    "title": "Красивый гостевой домик",
    "address": "{{location.x}}, {{location.y}}",
    "price": 850000,
    "type": "house",
    "rooms": 5,
    "guests": 15,
    "checkin": "14:00",
    "checkout": "14:00",
    "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"],
    "description": "",
    "photos": []
  },

  "location": {
    "x": 518,
    "y": 559
  }
};
apartments[5] = {
  "author": {
    "avatar": "img/avatars/user{{06}}.png",
  },

  "offer": {
    "title": "Некрасивый негостеприимный домик",
    "address": "{{location.x}}, {{location.y}}",
    "price": 710000,
    "type": "house",
    "rooms": 7,
    "guests": 14,
    "checkin": "12:00",
    "checkout": "14:00",
    "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"],
    "description": "",
    "photos": []
  },

  "location": {
    "x": 601,
    "y": 190
  }
};
apartments[6] = {
  "author": {
    "avatar": "img/avatars/user{{07}}.png",
  },

  "offer": {
    "title": "Уютное бунгало далеко от моря",
    "address": "{{location.x}}, {{location.y}}",
    "price": 950000,
    "type": "bungalo",
    "rooms": 3,
    "guests": 9,
    "checkin": "12:00",
    "checkout": "12:00",
    "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"],
    "description": "",
    "photos": []
  },

  "location": {
    "x": 115,
    "y": 499
  }
};
apartments[7] = {
  "author": {
    "avatar": "img/avatars/user{{08}}.png",
  },

  "offer": {
    "title": "Неуютное бунгало по колено в воде",
    "address": "{{location.x}}, {{location.y}}",
    "price": 603500,
    "type": "bungalo",
    "rooms": 4,
    "guests": 12,
    "checkin": "13:00",
    "checkout": "14:00",
    "features": ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"],
    "description": "",
    "photos": []
  },

  "location": {
    "x": 215,
    "y": 300
  }
};

var places = document.querySelector('.map__pins');
var maps = document.querySelector('.map');


var template = document.querySelector('template');
var templateBtn = template.content.querySelector('.map__pin');
var templateArticle = template.content.querySelector('.map__card');

var btnsFragment = document.createDocumentFragment();
var articlesFragment = document.createDocumentFragment();

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

  function getFeatures(features) {
    var listLength = features.length;
    var featureString = '';
    for (var i = 0; i < listLength; i++) {
      featureString += '<li class="feature feature--' + features[i] + '"></li>';
    }
    return featureString;
  }

for (var i = 0; i < apartments.length; i++) {
  var apartment = apartments[i];

  var article = templateArticle.cloneNode(true);

  article.querySelector('h3').textContent = apartment.offer.title;
  article.querySelector('small').textContent = apartment.offer.address;
  article.querySelector('.popup__price').innerHTML = apartment.offer.price + ' &#x20bd;/ночь';
  article.querySelector('h4').textContent = getType(apartment.offer.type);
  article.querySelector('.placing').textContent = apartment.offer.rooms + ' для ' + apartment.offer.guests + ' гостей';
  article.querySelector('.times').textContent = 'Заезд после ' + apartment.offer.checkin + ' выезд до ' + apartment.offer.checkout;
  article.querySelector('.popup__features').innerHTML = getFeatures(apartment.offer.features);
  article.querySelector('.property__description').textContent = apartment.offer.description;
  article.querySelector('.popup__avatar').src = apartment.author.avatar;

  articlesFragment.appendChild(article);

  var button = templateBtn.cloneNode(true);
  button.style.top = (apartment.location.y - 22) + 'px';
  button.style.left = (apartment.location.x - 40 / 2) + 'px';

  btnsFragment.appendChild(button);

}
places.appendChild(btnsFragment);
maps.appendChild(articlesFragment);
