import {useCallback, useState} from 'preact/hooks';

export const useUpdate = () => {
  const [, setState] = useState({});

  return useCallback(() => setState({}), []);
};

