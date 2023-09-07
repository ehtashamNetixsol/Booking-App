export function formatDateToString(inputDate: Date) {
  const date = new Date(inputDate);
  const options: any = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}

export function formatDateToISO(dateString: string) {
  const parts = dateString.split(" ");
  const monthMap: any = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const day = parts[0];
  const month = monthMap[parts[1]];
  const year = parts[2];

  const isoDateString = `${year}-${month}-${day}`;

  return isoDateString;
}
