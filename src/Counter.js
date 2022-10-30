
import { DateTime } from "luxon";
import { getEndTimeForDate } from "./Date.js";

export function Counter() {
  const time=DateTime.local({ zone: "Europe/Paris" })

  const now = DateTime.local({ zone: "Europe/Paris" });

  const endDate = getEndTimeForDate(time);
  const diff = endDate.diff(time, ["hours", "minutes", "seconds"]);

  let hours = String(parseInt(diff.hours)).padStart(2, "0");
  let minutes = String(parseInt(diff.minutes)).padStart(2, "0");
  let seconds = String(parseInt(diff.seconds)).padStart(2, "0");

  if (hours == 0 && minutes == 0 && seconds == 0) {
    // Juego nuevo listo
    return "<span>Kantu berria entzungai!</span>";
  }

  return hours+":"+minutes+":"+seconds;
}
export function Minutes() {
  const time= DateTime.local({ zone: "Europe/Paris" })
      const now = DateTime.local({ zone: "Europe/Paris" });

  const endDate = getEndTimeForDate(time);
  const diff = endDate.diff(time, ["hours", "minutes", "seconds"]);

  let hours = String(parseInt(diff.hours)).padStart(2, "0");
  let minutes = String(parseInt(diff.minutes)).padStart(2, "0");
  let seconds = String(parseInt(diff.seconds)).padStart(2, "0");

  if (hours == 0 && minutes == 0 && seconds == 0) {
    // Juego nuevo listo
    return "<span>Kantu berria entzungai!</span>";
  }

  return minutes;
}
export function Seconds() {
  const time=DateTime.local({ zone: "Europe/Paris" })

      const now = DateTime.local({ zone: "Europe/Paris" });


  const endDate = getEndTimeForDate(time);
  const diff = endDate.diff(time, ["hours", "minutes", "seconds"]);

  let hours = String(parseInt(diff.hours)).padStart(2, "0");
  let minutes = String(parseInt(diff.minutes)).padStart(2, "0");
  let seconds = String(parseInt(diff.seconds)).padStart(2, "0");

  if (hours == 0 && minutes == 0 && seconds == 0) {
    // Juego nuevo listo
    return "<span>Kantu berria entzungai!</span>";
  }

  return seconds;
}
