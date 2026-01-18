(function () {
    'use strict';

    // Адрес вашего сервера в Termux
    const API_URL = 'http://localhost:3000';

    function LordPlugin() {
        this.start = function () {
            Lampa.Listener.follow('full', (e) => {
                if (e.type == 'complite') {
                    this.addButton(e);
                }
            });
        };

        this.addButton = function (e) {
            let btn = $(`<div class="full-start__button selector">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 16.5L16 12L10 7.5V16.5ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="white"/></svg>
                <span>Lordfilm</span>
            </div>`);

            btn.on('hover:enter', () => {
                this.search(e.data.movie);
            });

            e.object.container.find('.full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            Lampa.Noty.show('Поиск на Lordfilm...');
            
            let title = movie.title || movie.name;
            let url = API_URL + '/search?q=' + encodeURIComponent(title);

            Lampa.HTTP.get(url, (results) => {
                if (!results.length) return Lampa.Noty.show('Ничего не найдено');

                Lampa.Select.show({
                    title: 'Результаты поиска',
                    items: results,
                    onSelect: (item) => {
                        this.extract(item.link);
                    },
                    onBack: () => {
                        Lampa.Controller.toggle('full_start');
                    }
                });
            }, () => {
                Lampa.Noty.show('Сервер в Termux не отвечает!');
            });
        };

        this.extract = function (link) {
            Lampa.Noty.show('Загрузка плеера...');
            
            Lampa.HTTP.get(API_URL + '/extract?url=' + encodeURIComponent(link), (res) => {
                if (res.url) {
                    Lampa.Player.play({
                        url: res.url,
                        title: 'Lordfilm'
                    });
                    Lampa.Player.playlist([{
                        title: 'Lordfilm',
                        url: res.url
                    }]);
                } else {
                    Lampa.Noty.show('Не удалось найти ссылку на видео');
                }
            });
        };
    }

    if (window.app_ready) new LordPlugin().start();
    else Lampa.Listener.follow('app', (e) => { if (e.type == 'ready') new LordPlugin().start(); });
})();
