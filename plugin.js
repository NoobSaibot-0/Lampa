(function () {
    'use strict';
    Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {
            Lampa.Noty.show('Плагин загружен успешно!');
        }
    });
})();
