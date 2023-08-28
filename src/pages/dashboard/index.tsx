/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { AuthContext } from "@/services/storage";

export default function Dashboard() {
  const axiosToken = axios.create();
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshToken() {
    try {
      const response = await axiosToken.post(
        `/api/auth/token`,
        {},
        { withCredentials: true }
      );
      auth.setToken(response.data.accessToken);
      const decoded: any = jwt.decode(response.data.accessToken);
      auth.setName(decoded.name);
      auth.setEmail(decoded.email);
      auth.setExpire(decoded.exp);
      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      router.push("/login");
    }
  }

  axiosToken.interceptors.request.use(
    async config => {
      const currentDate = new Date();
      if (auth.expire * 1000 < currentDate.getTime()) {
        const response = await axios.post(
          `/api/auth/token`,
          {},
          { withCredentials: true }
        );
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        auth.setToken(response.data.accessToken);
        const decoded: any = jwt.decode(response.data.accessToken);
        auth.setName(decoded.name);
        auth.setEmail(decoded.email);
        auth.setExpire(decoded.exp);
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  async function logoutHandler() {
    try {
      const data = await axios.delete(`/api/auth/logout`);
      router.push("/login");
    } catch (error) {
      router.push("/login");
      // console.log(error);
    }
  }

  useEffect(() => {
    refreshToken();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#121212]">
        <Head>Authentication</Head>
        <div className="w-screeen h-screen flex justify-center items-center"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#121212]">
      <Head>
        <title>Dashboard</title>
      </Head>
      <nav className="border-b border-opacity-10 shadow-sm sticky top-0 z-40 bg-white dark:bg-[#121212]">
        <div className="container flex py-4 justify-between">
          <div className="flex gap-6">
            <div className="my-auto">
              <Link
                href="/"
                className="text-lg font-bold px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-md">
                Dana<span className="text-yellow-400">Ku</span>
              </Link>
            </div>
            <div className="flex gap-6 my-auto text-sm">
              <Link
                href="/dashboard"
                className="hover:opacity-80 duration-75 ease-out">
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="opacity-80 hover:opacity-100 duration-75 ease-out">
                Keuangan
              </Link>
              <Link
                href="/dashboard"
                className="opacity-80 hover:opacity-100 duration-75 ease-out">
                Produk
              </Link>
              <Link
                href="/dashboard"
                className="opacity-80 hover:opacity-100 duration-75 ease-out">
                Pengaturan
              </Link>
            </div>
          </div>
          <div className="flex ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Buena"
                  />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <p className="font-bold">{auth.name}</p>
                  <p className="text-xs font-normal">{auth.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Pengaturan
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={logoutHandler}>
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </div>
  );
}
