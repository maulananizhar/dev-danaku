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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CubeIcon,
  FileTextIcon,
  LayersIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";

export default function Dashboard() {
  const axiosToken = axios.create();
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    userBalance: 0,
    loanTotal: 0,
    transaction: 0,
    member: 0,
    lastTransactions: [],
  });

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
      const response = await axios.delete(`/api/auth/logout`);
      router.push("/login");
    } catch (error) {
      router.push("/login");
    }
  }

  async function dashboardFetcher() {
    try {
      const response = await axios.post("/api/other/dashboard", {
        userId: auth.uuid,
      });
      setDashboardData(response.data.data);
    } catch (err) {}
  }

  useEffect(() => {
    async function fetcher() {
      await refreshToken();
      await dashboardFetcher();
    }
    fetcher();
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
            <div className="md:flex gap-6 my-auto text-sm hidden">
              <Link href="/dashboard" className="">
                Dashboard
              </Link>
              <Link
                href="/dashboard/membership"
                className="opacity-80 hover:opacity-100 duration-75 ease-out">
                Keanggotaan
              </Link>
              <Link
                href="/dashboard/product"
                className="opacity-80 hover:opacity-100 duration-75 ease-out">
                Produk
              </Link>
              <Link
                href="/dashboard/settings"
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
                      <Link href="/dashboard" className="">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link
                        href="/dashboard/membership"
                        className="opacity-80 hover:opacity-100 duration-75 ease-out">
                        Keanggotaan
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link
                        href="/dashboard/product"
                        className="opacity-80 hover:opacity-100 duration-75 ease-out">
                        Produk
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
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

      <main className="container flex flex-col my-8">
        <div className="flex w-full">
          <div>
            <p className="text-4xl font-bold">Dashboard</p>
          </div>
        </div>

        <div className="flex flex-wrap w-full mt-8">
          <div className="lg:w-1/4 md:w-1/2 w-full lg:my-0 my-2">
            <Card className="mx-2 dark:bg-[#121212]">
              <CardContent className="py-6">
                <div className="flex items-center mb-2 text-sm font-bold">
                  <p className="text-yellow-400">Saldo koperasi</p>
                  <LightningBoltIcon className="ml-auto" />
                </div>
                <p className="text-3xl font-bold">
                  Rp
                  {`${
                    dashboardData.userBalance == null
                      ? `0.00`
                      : `${dashboardData.userBalance.toLocaleString(
                          "id-ID"
                        )}.00`
                  }`}
                </p>
                <p className="text-xs opacity-80">
                  Jumlah saldo kotor koperasi
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full lg:my-0 my-2">
            <Card className="mx-2 dark:bg-[#121212]">
              <CardContent className="py-6">
                <div className="flex items-center mb-2 text-sm font-bold">
                  <p className="text-yellow-400">Total pinjaman</p>
                  <FileTextIcon className="ml-auto" />
                </div>
                <p className="text-3xl font-bold">
                  Rp
                  {`${
                    dashboardData.loanTotal == null
                      ? `0.00`
                      : `${dashboardData.loanTotal.toLocaleString("id-ID")}.00`
                  }`}
                </p>
                <p className="text-xs opacity-80">
                  Jumlah pinjaman belum lunas
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full lg:my-0 my-2">
            <Card className="mx-2 dark:bg-[#121212]">
              <CardContent className="py-6">
                <div className="flex items-center mb-2 text-sm font-bold">
                  <p className="text-yellow-400">Total transaksi</p>
                  <LayersIcon className="ml-auto" />
                </div>
                <p className="text-3xl font-bold">
                  {dashboardData.transaction}
                </p>
                <p className="text-xs opacity-80">Jumlah transaksi berhasil</p>
              </CardContent>
            </Card>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full lg:my-0 my-2">
            <Card className="mx-2 dark:bg-[#121212]">
              <CardContent className="py-6">
                <div className="flex items-center mb-2 text-sm font-bold">
                  <p className="text-yellow-400">Total anggota</p>
                  <CubeIcon className="ml-auto" />
                </div>
                <p className="text-3xl font-bold">{dashboardData.member}</p>
                <p className="text-xs opacity-80">Jumlah anggota koperasi</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-wrap w-full mt-8">
          <div className="lg:w-3/5 w-full">
            <Card className="mx-2 dark:bg-[#121212] min-h-[423px] h-[423px] max-h-[423px]">
              <CardContent className="flex flex-col py-6">
                <div className="mb-3">
                  <p className="font-bold text-yellow-400">Pintasan</p>
                  <p className="opacity-80 text-sm">
                    Lakukan transaksi dengan cepat disini
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:w-2/5 w-full">
            <Card className="mx-2 dark:bg-[#121212]">
              <CardContent className="flex flex-col py-6">
                <div className="mb-3">
                  <p className="font-bold text-yellow-400">
                    Transaksi terakhir
                  </p>
                  <p className="opacity-80 text-sm">
                    Anda melakukan total {dashboardData.transaction} transaksi
                  </p>
                </div>
                <div className="flex flex-col w-full">
                  {dashboardData.lastTransactions.map((data: any, index) => (
                    <div className="flex items-center w-full my-3" key={index}>
                      <div>
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/lorelei/jpg?seed=${data.memberName}`}
                            alt={data.memberName}
                          />
                        </Avatar>
                      </div>
                      <div className="text-sm ml-4 mr-4 truncate">
                        <p className="font-bold truncate">{data.memberName}</p>
                        <p className="truncate">{data.desc}</p>
                      </div>
                      <div className="ml-auto">
                        <p className="text-lg font-bold">
                          Rp
                          {`${
                            data == null
                              ? `0.00`
                              : `${data.nominal.toLocaleString("id-ID")}.00`
                          }`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
