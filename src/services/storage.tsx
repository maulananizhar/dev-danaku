import { createContext } from "react";

export const AuthContext = createContext({
  uuid: "",
  firstName: "",
  lastName: "",
  email: "",
  balance: 0,
  bio: "",
  address: {
    villageName: "",
    subdistrict: "",
    district: "",
  },
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
  setBalance(balance: number) {
    this.balance = balance;
  },
  setBio(bio: string) {
    this.bio = bio;
  },
  setAddress(address: any) {
    this.address = address;
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
  borrowedData: [],
  search: "",
  length: 0,
  page: 1,
  max: 1,

  setMemberData(data: any) {
    this.memberData = data;
  },
  setBorrowedData(data: any) {
    this.borrowedData = data;
  },
  setSearch(search: any) {
    this.search = search;
  },
  setLength(length: any) {
    this.length = length;
  },
  setPage(page: any) {
    this.page = page;
  },
  setMax(max: any) {
    this.max = max;
  },
});
