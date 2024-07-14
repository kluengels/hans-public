// helper function to display timestamp "YY:MM:DD at HH:MM"

function getTime(timestamp: string) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month =
    (date.getMonth() + 1).toString().length === 2
      ? date.getMonth() + 1
      : 0 + (date.getMonth() + 1).toString();
  const day =
    date.getDate().toString().length === 2
      ? date.getDate()
      : 0 + date.getDate().toString();
  const hour =
    date.getHours().toString().length === 2
      ? date.getHours()
      : 0 + date.getHours().toString();

  const minutes =
    date.getMinutes().toString().length === 2
      ? date.getMinutes()
      : 0 + date.getMinutes().toString();

  const time = `${year}-${month}-${day} at ${hour}:${minutes}`;
  return time;
}

export default getTime;
