(function () {
    'use strict';

    function startLord() {
        // Проверка в консоли (если есть возможность посмотреть)
        console.log('Lordfilm: Plugin started');
        
        // Слушаем событие открытия карточки фильма
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                console.log('Lordfilm: Full card opened', e.data);

                // Создаем кнопку. Используем классы Lampa для совместимости
                var button = $(`<div class="full-start__button selector">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 16.5L16 12L10 7.5V16.5ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="white"/>
                    </svg>
                    <span>Lordfilm</span>
                </div>`);

                // Обработчик нажатия
                button.on('hover:enter', function () {
                    var title = e.data.movie.title || e.data.movie.name;
                    Lampa.Noty.show('Ищу на Lordfilm: ' + title);
                    
                    // Проверка связи с Termux
                    $.ajax({
                        url: 'http://localhost:3000/search?q=' + encodeURIComponent(title),
                        method: 'GET',
                        success: function(data) {
                            Lampa.Noty.show('Сервер ответил! Найдено: ' + data.length);
                        },
                        error: function() {
                            Lampa.Noty.show('Ошибка: Проверьте Termux!');
                        }
                    });
                });

                // Добавляем кнопку в контейнер. 
                // Попробуем несколько вариантов селекторов на случай разных версий Lampa
                var container = e.object.container.find('.full-start__buttons');
                if (container.length) {
                    container.append(button);
                } else {
                    // Запасной вариант добавления
                    e.object.container.find('.full-start__controls').append(button);
                }
            }
        });
    }

    // Ожидание готовности приложения
    if (window.app_ready) startLord();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startLord();
        });
    }
})();
