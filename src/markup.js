export const link = (url, title = 'Link') => (
  `<a href="${url}">${title}</a>`
);

const xx = v => v > 9 ? v : '0' + v;

export const formatDate = (datestring) => {
  const date = typeof datestring === 'string' ? new Date(datestring) : datestring;
  return [
    date.getDate(),
    xx(date.getMonth() + 1),
    date.getFullYear()
  ].join('.');
};
