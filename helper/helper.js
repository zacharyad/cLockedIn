module.exports = {
  nextTime: 2,
  getTime: function() {
    let now = new Date();
    let Months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Nov',
      'Dec',
    ];

    let date = {
      time: `${now.getHours()}:${now.getMinutes()}`,
      day: `${now.getDay()}`,
      month: `${Months[now.getMonth()]}`,
      year: `${now.getFullYear()}`,
    };

    let formatedDate = `${date.month} ${date.day}, ${date.year} ${date.time}`;

    return formatedDate;
  },
  msToTime: function msToTime(s) {
    let pad = (n, z = 2) => ('00' + n).slice(-z);
    return pad((s / 3.6e6) | 0) + ':' + pad(((s % 3.6e6) / 6e4) | 0);
  },
};
