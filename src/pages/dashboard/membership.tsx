/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { AuthContext, MembershipContext } from "@/services/storage";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembershipPage } from "@/view/membership-page";

export default function Dashboard() {
  const axiosToken = axios.create();
  const router = useRouter();
  const auth = useContext(AuthContext);
  const member = useContext(MembershipContext);
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
      auth.setUuid(decoded.uuid);
      auth.setFirstName(decoded.firstName);
      auth.setLastName(decoded.lastName);
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
        auth.setUuid(decoded.uuid);
        auth.setFirstName(decoded.firstName);
        auth.setLastName(decoded.lastName);
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

  // useEffect

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
        <title>Keanggotaan</title>
        <link rel="icon" href="/danaku.png" />
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
            <div className="md:flex gap-6 my-auto text-sm hidden">
              <Link
                href="/dashboard"
                className="opacity-80 hover:opacity-100 duration-75 ease-out">
                Dashboard
              </Link>
              <Link href="/dashboard/membership" className="">
                Keanggotaan
              </Link>
              <Link
                href="/dashboard/news"
                className="opacity-80 hover:opacity-100 duration-75 ease-out">
                Berita
              </Link>
            </div>
          </div>
          <div className="flex ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/lorelei/jpg?seed=${auth.firstName} ${auth.lastName}`}
                    alt={`${auth.firstName} ${auth.lastName}`}
                  />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <p className="font-bold">
                    {`${auth.firstName} ${auth.lastName}`}
                  </p>
                  <p className="text-xs font-normal">{auth.email}</p>
                </DropdownMenuLabel>
                <div className="block md:hidden">
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link
                        href="/dashboard"
                        className="block w-full opacity-80 hover:opacity-100 duration-75 ease-out">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link
                        href="/dashboard/membership"
                        className="block w-full">
                        Keanggotaan
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link
                        href="/dashboard/news"
                        className="block w-full opacity-80 hover:opacity-100 duration-75 ease-out">
                        Berita
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link href="/profile" className="block w-full">
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="block w-full">
                      Pengaturan
                    </Link>
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

      <main className="container flex flex-col my-8">
        <Tabs defaultValue="anggota">
          <div className="flex w-full flex-wrap">
            <div className="w-full md:w-[230px]">
              <p className="text-4xl font-bold">Keanggotaan</p>
            </div>
            <div className="flex ml-auto gap-4 md:w-[400px] w-full mt-4 md:my-auto">
              <TabsList className="grid w-full grid-cols-4 dark:bg-[#191919]">
                <TabsTrigger
                  value="anggota"
                  className="dark:data-[state=active]:bg-[#0f0f0f]">
                  Anggota
                </TabsTrigger>
                <TabsTrigger
                  value="transaksi"
                  className="dark:data-[state=active]:bg-[#0f0f0f]">
                  Transaksi
                </TabsTrigger>
                <TabsTrigger
                  value="pinjaman"
                  className="dark:data-[state=active]:bg-[#0f0f0f]">
                  Pinjaman
                </TabsTrigger>
                <TabsTrigger
                  value="tabungan"
                  className="dark:data-[state=active]:bg-[#0f0f0f]">
                  Tabungan
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="flex flex-col mt-8">
            <TabsContent value="anggota">
              <MembershipPage.Member />
            </TabsContent>

            <TabsContent value="transaksi">
              <MembershipPage.Transactions />
            </TabsContent>

            <TabsContent value="pinjaman">
              <MembershipPage.Loans />
            </TabsContent>
            <TabsContent value="tabungan">
              <MembershipPage.Savings />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
