const React = require('react');

const defaultState = { image: undefined, status: 'loading', width: 0, height: 0 };

export default function useImage(url, crossOrigin) {
  const res = React.useState(defaultState);
  const image = res[0].image;
  const status = res[0].status;
  const width = res[0].width;
  const height = res[0].height;

  const setState = res[1];

  React.useEffect(
    function () {
      if (!url) return;
      const img = document.createElement('img');

      function onload() {
        setState({ image: img, status: 'loaded' });
      }

      function onerror() {
        setState({ image: undefined, status: 'failed' });
      }

      img.addEventListener('load', onload);
      img.addEventListener('error', onerror);
      crossOrigin && (img.crossOrigin = crossOrigin);
      img.src = url;

      return function cleanup() {
        img.removeEventListener('load', onload);
        img.removeEventListener('error', onerror);
        setState(defaultState);
      };
    },
    [url, crossOrigin]
  );

  // return array because it it better to use in case of several useImage hooks
  // const [background, backgroundStatus] = useImage(url1);
  // const [patter] = useImage(url2);
  return [image, status];
};
