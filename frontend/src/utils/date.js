export default function date(date_time) {
  const dateUTC = new Date(date_time);
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  };
  let dateOnly = "";
  dateOnly = dateUTC?.toLocaleString("en-US", options);
  const timeString = dateUTC?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const timeConvert = timeString?.replace("GMT+0530", "");

  return {
    date: dateOnly,
    time: timeConvert,
  };
}
