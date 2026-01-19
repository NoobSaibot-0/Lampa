(function () {
    'use strict';

    function startLord() {
        // Выведем сообщение, чтобы точно знать, что функция запустилась
        Lampa.Noty.show('Lordfilm: Активация...');

        // Слушаем событие открытия карточки
        Lampa.Listener.follow('full', function (e) {
            // Пробуем поймать оба варианта написания события
            if (e.type == 'complite' || e.type == 'complete') {
                
                // Создаем кнопку
                var button = $(`<div class="full-start__button selector lordfilm-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 16.5L16 12L10 7.5V16.5ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="white"/>
                    </svg>
                    <span>Lordfilm</span>
                </div>`);

                // Обработка нажатия
                button.on('hover:enter', function () {
                    var title = e.data.movie.title || e.data.movie.name;
                    Lampa.Noty.show('Поиск на Lordfilm: ' + title);
                    
                    // Запрос к вашему Termux
                    Lampa.HTTP.get('http://localhost:3000/search?q=' + encodeURIComponent(title), function(json) {
                        if (json && json.length) {
                            Lampa.Select.show({
                                title: 'Результаты Lordfilm',
                                items: json.map(function(i) { i.name = i.title; return i; }),
                                onSelect: function(item) {
                                    Lampa.Noty.show('Открываем: ' + item.title);
                                },
                                onBack: function() { Lampa.Controller.toggle('full_start'); }
                            });
                        } else {
                            Lampa.Noty.show('Ничего не найдено');
                        }
                    }, function() {
                        Lampa.Noty.show('Ошибка: Проверьте Termux (порт 3000)');
                    });
                });

                // Пытаемся найти место для вставки (пробуем 3 разных селектора)
                var places = [
                    e.object.container.find('.full-start__buttons'),
                    e.object.container.find('.full-start__controls'),
                    $('.full-start__buttons') // Глобальный поиск на всякий случай
                ];

                var added = false;
                places.forEach(function(place) {
                    if (place.length > 0 && !added) {
                        place.append(button);
                        added = true;
                    }
                });

                if (added) {
                    // Если кнопка добавилась, заставляем Lampa перерисовать фокус, 
                    // чтобы кнопку можно было выбрать пультом
                    Lampa.Controller.enable('full_start');
                } else {
                    Lampa.Noty.show('Ошибка: Не нашел куда вставить кнопку');
                }
            }
        });
    }

    if (window.app_ready) startLord();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startLord();
        });
    }
})();
