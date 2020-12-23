const MONTHS = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
];

const WEEK_DAYS = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
];

export function dialogDateFormatter(dateTime: number): string {
    const currentDate = new Date();
    const date = new Date(dateTime);

    if (
        currentDate.getMonth() == date.getMonth()
        && currentDate.getDay() == date.getDay()
        && currentDate.getFullYear() == date.getFullYear()
    ) {
        return 'Сегодня';
    } else if (
        currentDate.getMonth() == date.getMonth()
        && currentDate.getDay() - date.getDay() === 1
        && currentDate.getFullYear() == date.getFullYear()
    ) {
        return 'Вчера';
    } else {
        return `${
            WEEK_DAYS[date.getDay()]
        }, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
    }
}
