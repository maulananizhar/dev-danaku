import { createContext } from "react";

export const AuthContext = createContext({
  isAuth: false,
  name: "",
  email: "",
  token: "",
  expire: 0,

  setIsAuth(isAuth: boolean) {
    this.isAuth = isAuth;
  },
  setName(name: string) {
    this.name = name;
  },
  setEmail(email: string) {
    this.email = email;
  },
  setToken(token: string) {
    this.token = token;
  },
  setExpire(expire: number) {
    this.expire = expire;
  },
});
