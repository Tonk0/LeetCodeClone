import { verifyAuth } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "@tanstack/react-router";
import { createContext, FC, useEffect, useState } from "react";

interface AuthContext {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
}

export const AuthContext = createContext<AuthContext>({isAuth: false, setIsAuth: () => {}});

const AuthProvider:FC<{children: ReactNode}> = ({children}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const {isSuccess} = useQuery({queryKey: ['auth'], queryFn: verifyAuth, retry: false})
  useEffect(() => {
    if (isSuccess) {
      setIsAuth(true);
    }
  }, [isSuccess])
  return (
    <AuthContext.Provider value={{isAuth, setIsAuth}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;