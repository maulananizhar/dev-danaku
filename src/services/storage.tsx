import { createContext } from "react";

export const AuthContext = createContext({
  uuid: "",
  firstName: "",
  lastName: "",
  email: "",
  token: "",
  expire: 0,

  setUuid(uuid: string) {
    this.uuid = uuid;
  },
  setFirstName(firstName: string) {
    this.firstName = firstName;
  },
  setLastName(lastName: string) {
    this.lastName = lastName;
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

export const MembershipContext = createContext({
  memberData: [],

  setMemberData(data: any) {
    this.memberData = data;
  },
});
