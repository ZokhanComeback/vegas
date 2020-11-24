# Vegas [Demo](https://zokhancomeback.github.io/vegas/)

Welcome! И добро пожаловать в readme :) Здесь я расскажу больше о приложении, его архитектуре, цикле и недостатках. А так же, постараюсь ответить на вероятные вопросы

В первую очередь хотел бы рассказать, почему я решил немножко выйти за пределы т/з:

Что-ж, я всегда любил игры. В детстве и подростковом возрасте активно занимался созданием модов для S.T.A.L.K.E.R. и Star Wars jedi knight 3: jedi academy. Сейчас же моё увлечение переходит в оплачиваемую работу, чем я не могу не быть довольным.

Это мой первый проект на pixi в жанре "slots". В первую очередь, хотел сам разобраться в принципах разработки подобных игр, на практике. Попробовать различные варианты и сделать свои выводы о хороших, и не очень решениях.
Кроме того, конечно же, хотелось бы показать большую часть своих навыков в пределах этого небольшого проекта :)

## Игровые механики и цикл:

- Первое, что происходит при загрузке страницы приложения - её предзагрузка. Мы загружаем фоновую картинку и шрифты. Не знаю, насколько это удачное решение, учитывая, что проект автономный. Однако, если бы игра открывалась на другой странице, или в pop-up - это был бы отличный вариант :)

- Затем мы обращаемся к базе данных (firebase, в данном случае). Проверяем local-strorage на наличие токена, и если он отсутствует - регистрируем пользователя. Чтоб избежать излишних действий - всё упрощено и происходит автоматически. Зашли в игру?) Теперь Вы - Jhon Doe, у вас в кармане $400 и 5 бесплатных прокруток слот-машины. Звучит как ~~тост~~ начало фильма :)

- Следующий шаг - формирование графики и UI. Мы формируем стартовый экран (со случайным расположением символов, без выигрышных позиций). Так же, формируем скролл-экран, который мы будем "пробегать" во время вращения. Скролл-список формируется один раз, после чего используется вплоть до следующей перезагрузки страницы. После этого loader исчезает и игра переходит в стадию: "initiated".

- При нажатии на кнопку, мы обращаемся к модели за предварительными результатами игры, и формируем "экран результата", на котором остановится анимация.  Параллельно, модель обращается к базе данных, и "списывает" бесплатную попытку (если есть), или 50 центов :) Запрос возвращает текущие данные, на основе которых обновляется UI и запускается вращение.

- По окончанию вращения, мы проигрываем победную анимацию (если выиграли), или сразу переходим в стадию "завершение игры".

- Если выиграли, обращаемся к базе данных через модель, для обновления балансов. После этого обновляем UI и запускаем механизм, который делает текущий экран - стартовым, а старый экран результата - удаляется. Мы снова можем крутить слот-машину :)

## Архитектура проекта

- На самом деле, я не очень люблю MVC на front-end части. Скорее, на данный момент я просто не нашёл альтернативы. Всю логику из модели - можно перенести на back-end, при желании (на самом деле, нет. Логика, которая там есть - убьёт сервер).

 Всё достаточно просто: у нас есть модель, представление и контроллер. По одному экземпляру на всё приложение. Отдельно находятся различные конфиги и управление состоянием. Это не чистое MVC, я просто взял из разных подходов то, с чем мне будет удобно работать.

- Расширение проекта возможно. Добавление новых классов, действий и их последовательность - достаточно очевидны. Большинство логики переиспользуется.

- UI для взаимодействия выполнен на HTML + css. Я считаю это хорошей практикой, когда подобное возможно выполнить без побочных эффектов. В случае текущего приложения это превратило добавление партиклов в головную боль :) Стоило продумать изначально: PIXI-приложение должно быть полноэкранным.

С другой же стороны, при динамических размерах холста - адаптивный UI на PIXI достаточно труднореализуем.

## Возможные недостатки, и их решение

- Я не добавил в приложение логику на случай resize браузера. Конечно, не каждый пользователь будет двигать его с помощью devtools, однако поворот устройства - следует учитывать.

- Возможны проблемы с производительностью: хоть счётчик FPS показывает стабильно высокие значения, игра всё равно не проходит без подтормаживаний. Самый очевидный путь к оптимизации заключаеся в том, чтоб сделать статический "скролл-список" одной картинкой. Сейчас он не слишком объёмный, и переиспользуется. Однако, он активно участвует в операциях с двумерным массивом символов. По правде говоря, я бы так и сделал, если бы символы были ассетами :) Сформировал canvas и использовал его как спрайт. Думаю, с текстом подобное тоже возможно, однако не стал сильно заморачиваться. Это могло бы ускорить логические операции в несколько раз.
Наконец, у PIXI-элементов есть объектные модели. А для статической графики она не нужна.

- Сообщение о возможной утечке памяти в связи с большим кол-вом наблюдателей: можно игнорировать. Я создаю обработчики событий на элементы, и после их использования - удаляю.

- Разные приложения для партиклов и слотов. Нехорошо. Это костыль. Повторять такое я точно не стану. Может ударить по производительности.

## Чит-коды

"Чит-коды" можно вводить в консоль браузера) После успешного выполнения, вы должны увидеть сообщение с текстом: "done!". 
Используя чит-коды, Вы сможете лучше осмотреть приложение (разные анимации выигрыша и т.д.).

- hesoyam() - получить денег и бесплатных попыток.
- wipe() - обнулить регистрационные данные.
- jackpot() - гарантированный джек-пот (match слова "Joker").
- winJ(), winO(), winK(), winE(), winR() - гарантированная победа с матчем указанного символа (разные анимации победы).
- truthGame() - возврат к режиму игры со стандартными механики (общеая вероятность какого-либо выигрыша 30%, jack-pot - 1%).
