module.exports.ISOformat = (time) => {
  if (!time) return null;
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const [day, month, year] = new Date(time)
    .toISOString()
    .split('T')[0]
    .split('-')
    .reverse()
    .map((d) => parseInt(d));
  return `${monthNames[month - 1]} ${day}, ${year}`;
};
