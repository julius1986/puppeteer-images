const delay = (msec = 300) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, msec);
  });

module.exports = delay;
