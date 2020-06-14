//

export const parseQuery = (string) => {
  // key=value&key2=value2 => [key=value, key2=value2]
  const pairs = string.split('&');

  // {key: value, ...}
  const result = {};
  pairs.forEach(pair => {
    const [key, value] = pair.split('=').map(decodeURIComponent);
    result[key] = value;
  });
  return result;
};

const joinEntry = ([key, value]) => (
  [key, value].map(encodeURIComponent).join('=')
);

export const buildQuery = (obj) => {
  return Object.entries(obj).map(joinEntry).join('&')
};

export const parseHash = () => {
  const hash = location.hash;
  const result = hash ? parseQuery(hash.slice('#'.length)) : {};
  return result;
};

export const setHash = (string) => {
  if (!string.startsWith('#')) {
    string = '#'.concat(string);
  }

  location.hash = string;
};

export const throttle = (fn, timeout = 500) => {
  let timer = null;
  let call;

  return (...args) => {
    call = () => {
      fn(...args);
      timer = null;
    };

    if (timer === null) {
      timer = setTimeout(() => call(), timeout);
    }
  };
};
