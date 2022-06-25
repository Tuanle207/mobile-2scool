import moment from 'moment';

function toLocalISOString(date: Date) {
  const timezoneOffset = date.getTimezoneOffset();

  return new Date(date.getTime() - timezoneOffset * 60000).toISOString();
}

const formatDate = (date: string, format?: string) => {
  if (!format) {
    return moment.utc(date).local().format('DD/MM/YYYY');
  }
  return moment.utc(date).local().format(format);
};

const formatTime = (date: string, format?: string) => {
  if (!format) {
    return moment.utc(date).local().format('DD/MM/YYYY - HH:mm');
  }
  return moment.utc(date).local().format(format);
};

const formatOnlyTime = (date: string, format?: string) => {
  if (!format) {
    return moment.utc(date).local().format('HH:mm');
  }
  return moment.utc(date).local().format(format);
};

const getDayOfWeek = (date: string) => {
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek === 0 ? 'CN' : `T${dayOfWeek + 1}`;
};

const formatFullDateTime = (date: string) => {
  return `${getDayOfWeek(date)} ${formatDate(date, 'HH:mm, DD/MM/YYYY')}`;
};

const formatFullDateTimeWithoutTime = (date: string) => {
  return `${getDayOfWeek(date)}, ${formatDate(date)}`;
};

/**
 * 
 * @param duration length of duration in minutes
 * @returns a string contains formated duration in days, hours and minutes
 */
const formatDuration = (duration: number): string => {
  const dayLocal = 'ngày';
  const hourLocal = 'giờ';
  const minuteLocal = 'phút';

  duration = Math.floor(duration);
  let days = 0;
  let hours = 0;
  let minutes = duration;
  let result = '';
  if (Math.floor(duration / (1 * 24 * 60)) >= 1) {
    days = Math.floor(duration / (1 * 24 * 60));
    duration = duration -  days * 24 * 60;
    if (days > 0)
      result += `${days} ${dayLocal}`;
  }
  if (Math.floor(duration / 1 * 60) >= 1) {
    days = Math.floor(duration / (1 * 60));
    duration = duration - days * 60;
    minutes = duration;
    if (days > 0 || (days === 0 && hours > 0))
      result += ` ${hours} ${hourLocal}`;
  }
  return result.length > 0 ? `${result} ${minutes} ${minuteLocal}` : `${minutes} ${minuteLocal}`;
};

const addDays = (date: Date, dayToAdd: number = 1) => {
  const temp = new Date(date);
  const currentDay = temp.getDate();
  return new Date(temp.setDate(currentDay + dayToAdd));
};

const getPreviousMonday = (input: Date) => {
    var date = new Date(input);
    var day = date.getDay();
    var prevMonday = new Date(input);
    if(date.getDay() === 0) {
        prevMonday.setDate(date.getDate() - 6);
    }
    else{
        prevMonday.setDate(date.getDate() - (day-1));
    }

    return prevMonday;
};

const getLatestMonday = () => {
  return moment().startOf('isoWeek').toDate();
};

const getNextMonday = (index: number = 1) => {
  return moment().startOf('isoWeek').add(7 * index, 'days').toDate();
};

export {
  formatDate, 
  formatTime, 
  formatOnlyTime, 
  formatDuration, 
  toLocalISOString,
  getDayOfWeek,
  addDays,
  getPreviousMonday,
  formatFullDateTime,
  formatFullDateTimeWithoutTime,
  getLatestMonday,
  getNextMonday,
};
