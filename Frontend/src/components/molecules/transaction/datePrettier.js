export const datePrettier = (date) => {
  const datetime = new Date(date);

  const formattedDate = datetime.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = datetime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { formattedDate, formattedTime };
};
