import { useContext } from 'react';
import { UserContext } from './user-context';

export const useAuthToken = () => {
  const { accessToken } = useContext(UserContext);
  return accessToken;
};
