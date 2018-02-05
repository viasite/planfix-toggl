# Planfix-Toggl
Electron приложение, написанное на коленке, отправляет данные из Toggl в Планфикс, сделан для того, чтобы избавить людей, трекающих свою активность в Toggl, от ручного переноса данных в Планфикс.



## Правила
Вы должны указывать записям в Toggl id задач Планфикса в виде тегов, например, 12345.

При запуске скрипт получает последние 50 записей, находит среди них записи с id задач и отправляет на email задачи.

После успешной отправки к записи добавляется тег `sent`, чтобы не отправить повторно.

Записи, сделанные не вами (в командном аккаунте) игнорируются.



## Установка

```
git clone https://github.com/viasite/planfix-toggl.git
cd planfix-toggl
npm install
```

Для сборки приложения под Windows смотри "Сборка" ниже.



## Использование

```
npm start
```

Для облегчения проставления тегов в записи было дописано официальное расширение Toggl Chrome,
скорее всего, pull request никогда не примут, можно поставить его в режиме разработчика отсюда:
https://github.com/popstas/toggl-button



## Настройка

### Клиент
В конфиге `config.default.yml` указаны настройки для viasite, вы можете переопределить их на свои.

У каждого пользователя есть уникальные настройки, заполните их:

- `apiToken` - в настройках profile в Toggl
- `workspaceId` - посмотрите в url вашего workspace в Toggl
- `smtpLogin`, `smtpPassword` - логин и пароль от вашей почты (нвстройки по умолчанию для Яндекс почты)
- `emailFrom` - должен совпадать с email вашего аккаунта в Планфиксе и у smtp должно быть право отправлять письма от этого имени
- `planfixAuthorName` - ваше Имя Фамилия в Планфиксе



### Планфикс
Управление аккаунтом -> Работа с помощью e-mail -> Правила обработки для задач -> Новое правло

#### Параметры отбора:
- Тема письма содержит текст: `@toggl`
- Содержание письма содержит слово: `time:`
#### Операции:
- Добавить аналитику: Выработка
- Вид работы: `Вид работы:` (до конца строки)
- Дата: `Дата:` (до конца строки)
- Кол-во: `time:` (до конца строки)
- Сотрудник: `Автор:` (до конца строки)
#### Также
- Удалить всё, начиная с метки: `Вид работы:` (в содержании письма)



## Сборка

``` bash
# сборка всего нужного для запуска в `bundle.js`
npm run webpack

# сборка всего в одиин файл `planfix-toggl.exe
npm run nexe
```
