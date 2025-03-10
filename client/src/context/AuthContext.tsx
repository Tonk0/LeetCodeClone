import { useQuery } from '@tanstack/react-query';
import { ReactNode } from '@tanstack/react-router';
import {
  createContext, FC, useEffect, useMemo, useState,
} from 'react';
import { verifyAuth } from '@/helpers/api';

interface IAuthContext {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
}

export const AuthContext = createContext<IAuthContext>({ isAuth: false, setIsAuth: () => {} });

// eslint-disable-next-line react/function-component-definition
const AuthProvider:FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { isSuccess } = useQuery({ queryKey: ['auth'], queryFn: verifyAuth, retry: false });
  useEffect(() => {
    if (isSuccess) {
      setIsAuth(true);
    }
  }, [isSuccess]);
  const contextObj = useMemo(() => ({ isAuth, setIsAuth }), [isAuth]);
  return (
    <AuthContext.Provider value={contextObj}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
