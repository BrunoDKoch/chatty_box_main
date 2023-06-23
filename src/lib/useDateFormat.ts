const format = Intl.DateTimeFormat('pt-br', {
  dateStyle: 'long',
  timeStyle: 'short',
  hour12: false,
});

export default function (date: Date) {
  return format.format(date);
}

export function useShortFormat(date: Date) {
  const format = Intl.DateTimeFormat('pt-br', {
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: false,
  });
  return format.format(date);
}
