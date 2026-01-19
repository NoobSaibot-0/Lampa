(function () {
    'use strict';

    function LordPlugin() {
        var network = new Lampa.Reguest();
        var api_url = 'http://localhost:3000/'; // Ваш Termux

        this.start = function () {
            // Подписываемся на событие открытия карточки
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite' || e.type == 'complete') {
                    // Проверяем, не добавлена ли уже кнопка
                    if (e.object.container.find('.lordfilm-button').length > 0) return;

                    // Создаем кнопку в стиле Lampa
                    var btn = $(`<div class="full-start__button selector lordfilm-button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 16.5L16 12L10 7.5V16.5ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="white"/>
                        </svg>
                        <span>Lordfilm</span>
                    </div>`);

                    btn.on('hover:enter', function () {
                        var movie = e.data.movie;
                        var title = movie.title || movie.name;
                        
                        Lampa.Noty.show('Поиск на Lordfilm...');

                        // Используем метод silent как в вашем примере
                        network.silent(api_url + 'search?q=' + encodeURIComponent(title), function (json) {
                            if (json && json.length) {
                                Lampa.Select.show({
                                    title: 'Результаты: ' + title,
                                    items: json.map(function(i) {
                                        i.name = i.title; // Обязательно для отображения
                                        return i;
                                    }),
                                    onSelect: function (item) {
                                        Lampa.Noty.show('Выбрано: ' + item.title);
                                        // Здесь можно добавить вызов плеера
                                    },
                                    onBack: function () {
                                        Lampa.Controller.toggle('full_start');
                                    }
                                });
                            } else {
                                Lampa.Noty.show('Ничего не найдено');
                            }
                        }, function () {
                            Lampa.Noty.show('Ошибка: Проверьте Termux на порту 3000');
                        });
                    });

                    // Вставляем кнопку в блок кнопок карточки
                    var container = e.object.container.find('.full-start__buttons');
                    if (container.length) {
                        container.append(btn);
                        // Обновляем контроллер, чтобы кнопка стала кликабельной
                        Lampa.Controller.add('full_start', {
                            toggle: function () {},
                            up: function () {},
                            down: function () {},
                            right: function () {},
                            left: function () {},
                            gone: function () {}
                        });
                    }
                }
            });
        };
    }

    // Инициализация как в Lampac
    if (window.app_ready) {
        new LordPlugin().start();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new LordPlugin().start();
        });
    }
})();
