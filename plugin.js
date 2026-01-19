(function () {
    'use strict';

    function LordPlugin() {
        // Ссылка на ваш сервер в Termux
        var network = new Lampa.Reguest();
        var api_url = 'http://localhost:3000/';

        this.start = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var btn = $(`<div class="full-start__button selector">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 16.5L16 12L10 7.5V16.5ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="white"/></svg>
                        <span>Lordfilm</span>
                    </div>`);

                    btn.on('hover:enter', function () {
                        var title = e.data.movie.title || e.data.movie.name;
                        Lampa.Noty.show('Поиск: ' + title);
                        
                        network.silent(api_url + 'search?q=' + encodeURIComponent(title), function (json) {
                            if (json && json.length) {
                                Lampa.Select.show({
                                    title: 'Результаты Lordfilm',
                                    items: json.map(function(i){ 
                                        i.name = i.title; // Lampa требует поле name для списка
                                        return i; 
                                    }),
                                    onSelect: function (item) {
                                        Lampa.Noty.show('Выбрано: ' + item.title);
                                        // Здесь будет логика запуска видео
                                    },
                                    onBack: function () {
                                        Lampa.Controller.toggle('full_start');
                                    }
                                });
                            } else {
                                Lampa.Noty.show('Ничего не найдено');
                            }
                        }, function () {
                            Lampa.Noty.show('Ошибка: Проверьте Termux (localhost:3000)');
                        });
                    });

                    e.object.container.find('.full-start__buttons').append(btn);
                }
            });
        };
    }

    // Безопасный запуск
    if (window.app_ready) {
        new LordPlugin().start();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new LordPlugin().start();
        });
    }
})();
