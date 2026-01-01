# Rave-RegFlow

## Инструкция по установке
Для начала нужно установить Tor Browser с официального бота в телеге: https://t.me/gettor_bot
После установки, вам нужно будет настроить Tor Control для управления прокси изнутри бота, сделать это нужно сгенерировав хэш-пароль, и добавив его в конфигурацию Tor Browser вместе с портом.

### Настройка Tor Control
Если вы не меняли путь установки, то Tor находится по пути C:\Tor Browser\Browser\TorBrowser\, перейдите в него из консоли и выполните следующие команды:
```bash
cd Tor
tor --hash-password пароль
```
После этого в консоли выведется ваш хэш-пароль, который выглядит как *16:ЕВГОМ5ЕВГОМ5....* Затем добавьте хэш-пароль и порт в конфигурацию Tor Browser в файле *torrc*, который находится по пути C:\Tor Browser\Browser\TorBrowser\Data\Tor:
```
ControlPort 9251
HashedControlPassword хэш-пароль
```
Остальные параметры конфига трогать не нужно, вписать параметр можно в любое место

### Tor-мосты
Для работы прокси нужно указать мосты, которые находятся в общем доступе по ссылке *https://torscan-ru.ntc.party*
Их нужно скопировать, зайти в Tor, нажать на "Настройка подключения...", будет видна вкладка *Мосты*, и нажать на три точки, справа от *Добавлено вами*, и нажать на *Редактировать мосты*. Далее нажмите *Ctrl+A*, и вставьте новые скопированные мосты. Обновлять свои тор мосты нужно хотя бы раз в день.

### Добавление прокси в конфиг
Чтобы все прокси для авторега работали конкретно, скопируйте строчки ниже, чтобы добавить 140 рабочих прокси в конфигурацию Tor Browser в файле *torrc*. Если до этого в конфиге уже есть параметр *SocksPort*, то замените его на скопированный контент

```
SocksPort 9000
SocksPort 9001
SocksPort 9002
SocksPort 9003
SocksPort 9004
SocksPort 9005
SocksPort 9006
SocksPort 9007
SocksPort 9008
SocksPort 9009
SocksPort 9010
SocksPort 9011
SocksPort 9012
SocksPort 9013
SocksPort 9014
SocksPort 9015
SocksPort 9016
SocksPort 9017
SocksPort 9018
SocksPort 9019
SocksPort 9020
SocksPort 9021
SocksPort 9022
SocksPort 9023
SocksPort 9024
SocksPort 9025
SocksPort 9026
SocksPort 9027
SocksPort 9028
SocksPort 9029
SocksPort 9030
SocksPort 9031
SocksPort 9032
SocksPort 9033
SocksPort 9034
SocksPort 9035
SocksPort 9036
SocksPort 9037
SocksPort 9038
SocksPort 9039
SocksPort 9040
SocksPort 9041
SocksPort 9042
SocksPort 9043
SocksPort 9044
SocksPort 9045
SocksPort 9046
SocksPort 9047
SocksPort 9048
SocksPort 9049
SocksPort 9050
SocksPort 9051
SocksPort 9052
SocksPort 9053
SocksPort 9054
SocksPort 9055
SocksPort 9056
SocksPort 9057
SocksPort 9058
SocksPort 9059
SocksPort 9060
SocksPort 9061
SocksPort 9062
SocksPort 9063
SocksPort 9064
SocksPort 9065
SocksPort 9066
SocksPort 9067
SocksPort 9068
SocksPort 9069
SocksPort 9070
SocksPort 9071
SocksPort 9072
SocksPort 9073
SocksPort 9074
SocksPort 9075
SocksPort 9076
SocksPort 9077
SocksPort 9078
SocksPort 9079
SocksPort 9080
SocksPort 9081
SocksPort 9082
SocksPort 9083
SocksPort 9084
SocksPort 9085
SocksPort 9086
SocksPort 9087
SocksPort 9088
SocksPort 9089
SocksPort 9090
SocksPort 9091
SocksPort 9092
SocksPort 9093
SocksPort 9094
SocksPort 9095
SocksPort 9096
SocksPort 9097
SocksPort 9098
SocksPort 9099
SocksPort 9100
SocksPort 9101
SocksPort 9102
SocksPort 9103
SocksPort 9104
SocksPort 9105
SocksPort 9106
SocksPort 9107
SocksPort 9108
SocksPort 9109
SocksPort 9110
SocksPort 9111
SocksPort 9112
SocksPort 9113
SocksPort 9114
SocksPort 9115
SocksPort 9116
SocksPort 9117
SocksPort 9118
SocksPort 9119
SocksPort 9120
SocksPort 9121
SocksPort 9122
SocksPort 9123
SocksPort 9124
SocksPort 9125
SocksPort 9126
SocksPort 9127
SocksPort 9128
SocksPort 9129
SocksPort 9130
SocksPort 9131
SocksPort 9132
SocksPort 9133
SocksPort 9134
SocksPort 9135
SocksPort 9136
SocksPort 9137
SocksPort 9138
SocksPort 9139
SocksPort 9140
```

### Установка зависимостей
Для установки зависимостей нужно установить NodeJS, а также пакет *npm*
После установки NodeJS и *npm*, выполните следующие команды в терминале, находясь в папке проекта:
```bash
npm i -g typescript
npm i
```

### Запуск авторега
Запуск авторега происходит по команде
```bash
npm run start
```

### Использование
Авторег имеет в себе определённые настройки, например настройку Tor Control, куда вам нужно указать свой порт, который вы указали в конфиг, а также пароль (не хэш-пароль), который вы вводили во время команды
*Авторег в долгой работе примерно за полтора часа производит больше 100 аккаунтов*
