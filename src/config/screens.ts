/**
 * Реальные скриншоты веб-приложения AquaCore (сняты с работающей системы на
 * демо-данных). Файлы лежат в public/screens. Используются в галерее на сайте.
 */
export type Shot = {
  file: string;
  title: string;
  caption: string;
  role: "Управляющий" | "Администратор" | "Мойщик" | "Клиент";
  device: "desktop" | "mobile";
};

export const shots: Shot[] = [
  {
    file: "manager-dashboard.jpg",
    title: "Дашборд управляющего",
    caption: "Выручка, ФОТ, маржа, средний чек, график по дням, топ услуг и клиентов — за любой период.",
    role: "Управляющий",
    device: "desktop",
  },
  {
    file: "admin-board.jpg",
    title: "Доска в реальном времени",
    caption: "Все машины на постах: статусы, исполнители, услуги и цены. Обновляется на ходу.",
    role: "Администратор",
    device: "desktop",
  },
  {
    file: "manager-price-list.jpg",
    title: "Прайс-лист по классам авто",
    caption: "Свои классы автомобилей, цена под каждый, массовая правка цен и чек-листы качества.",
    role: "Управляющий",
    device: "desktop",
  },
  {
    file: "manager-vehicle-classes.jpg",
    title: "Классы авто настраиваете сами",
    caption: "Добавляйте, переименовывайте и сортируйте классы под свой прайс — без жёстких рамок.",
    role: "Управляющий",
    device: "desktop",
  },
  {
    file: "manager-loyalty.jpg",
    title: "Программа лояльности",
    caption: "Кешбэк, многоуровневые скидки и гибкие акции. Включается одним рубильником.",
    role: "Управляющий",
    device: "desktop",
  },
  {
    file: "manager-report-visits.jpg",
    title: "Отчёт по визитам смены",
    caption: "Фото машины, госномер, услуги, оплата, скидка, бонусы и исполнитель по каждому визиту.",
    role: "Управляющий",
    device: "desktop",
  },
  {
    file: "manager-reports.jpg",
    title: "Отчёты и Z-отчёты",
    caption: "Итоги смен по способам оплаты и зарплате, выгрузка визитов в Excel за любой период.",
    role: "Управляющий",
    device: "desktop",
  },
  {
    file: "manager-clients.jpg",
    title: "Клиенты и автомобили",
    caption: "Поиск по имени, телефону и госномеру. История визитов, бонусы, VIP и заметки.",
    role: "Управляющий",
    device: "desktop",
  },
  {
    file: "manager-staff.jpg",
    title: "Персонал и зарплата",
    caption: "Сотрудники, PIN-входы и гибкие правила ЗП: процент с выручки, фикс за смену, надбавки.",
    role: "Управляющий",
    device: "desktop",
  },
  {
    file: "manager-audit.jpg",
    title: "Журнал изменений и аудит",
    caption: "Неизменяемая история всех действий и фильтр подозрительных операций.",
    role: "Управляющий",
    device: "desktop",
  },
  {
    file: "admin-shift.jpg",
    title: "Касса и сверка смены",
    caption: "Открытие смены, контроль наличных и сверка при закрытии с фиксацией расхождений.",
    role: "Администратор",
    device: "desktop",
  },
  {
    file: "washer-queue.jpg",
    title: "Кабинет мойщика (PWA)",
    caption: "Очередь задач с таймером, чек-листом и заработком в реальном времени.",
    role: "Мойщик",
    device: "mobile",
  },
  {
    file: "client-visits.jpg",
    title: "Клиентский кабинет",
    caption: "История визитов с фото и статусами, баланс бонусов и онлайн-запись.",
    role: "Клиент",
    device: "mobile",
  },
  {
    file: "client-bonuses.jpg",
    title: "Бонусы клиента",
    caption: "Баланс, срок сгорания, уровень лояльности и накопленный оборот.",
    role: "Клиент",
    device: "mobile",
  },
  {
    file: "client-booking.jpg",
    title: "Онлайн-запись",
    caption: "Клиент выбирает услугу, авто и время — администратор сразу видит его в очереди.",
    role: "Клиент",
    device: "mobile",
  },
];
