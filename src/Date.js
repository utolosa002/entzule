import { DateTime, Duration } from "luxon";
    import { songs } from "./songs.js";
    let today = DateTime.local({ zone: "Europe/Paris" });
    
    export function getTodaysIndex(date) {
        const firstDay = DateTime.fromISO("2022-10-29T00:00", {
            zone: "Europe/Paris",
        });
        let today = date || DateTime.local();

        const diff = today.diff(firstDay, ["days"]);
        return parseInt(diff.days) % songs.length;
    }

    export function getTodaysSong(date) {
    const index = getTodaysIndex(date);
    return songs[index];
    }
    export function getYesterdaysSong(date) {
    const index = getTodaysIndex(date);
    return songs[index-1];
    }
    export function getEndTimeForDate(date) {
        // Returns the end of the time for the given date
      
        let endTime = date.plus(Duration.fromObject({ day: 1 }));
        endTime = DateTime.fromObject(
          {
            year: endTime.year,
            month: endTime.month,
            day: endTime.day,
          },
          { zone: "Europe/Paris" }
        );
      
        return endTime;
      }