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

exports.todaysDate = (split = '/') => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();

  return `${dd}${split}${mm}${split}${yyyy}`;
};
