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
                    src={`https://api.dicebear.com/7.x/lorelei/jpg?seed=${auth.firstName}${auth.lastName}`}
                    alt={`${auth.firstName}${auth.lastName}`}
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
          <div className="flex ml-auto gap-4">
            <p>Select</p>
            <Button className="font-bold">Pilih</Button>
          </div>
        </div>

        <div className="flex w-full mt-8">
          <div className="w-1/4">
            <Card className="mx-2 dark:bg-[#121212]">
              <CardContent className="py-6">
                <div className="flex items-center mb-2 text-sm font-bold">
                  <p className="text-yellow-400">Saldo koperasi</p>
                  <LightningBoltIcon className="ml-auto" />
                </div>
                <p className="text-3xl font-bold">Rp12.343.000</p>
                <p className="text-xs opacity-80">+20.4% dari bulan lalu</p>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/4">
            <Card className="mx-2 dark:bg-[#121212]">
              <CardContent className="py-6">
                <div className="flex items-center mb-2 text-sm font-bold">
                  <p className="text-yellow-400">Total pinjaman</p>
                  <FileTextIcon className="ml-auto" />
                </div>
                <p className="text-3xl font-bold">Rp4.623.000</p>
                <p className="text-xs opacity-80">+11.9% dari bulan lalu</p>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/4">
            <Card className="mx-2 dark:bg-[#121212]">
              <CardContent className="py-6">
                <div className="flex items-center mb-2 text-sm font-bold">
                  <p className="text-yellow-400">Total transaksi</p>
                  <LayersIcon className="ml-auto" />
                </div>
                <p className="text-3xl font-bold">+245</p>
                <p className="text-xs opacity-80">+4.8% dari bulan lalu</p>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/4">
            <Card className="mx-2 dark:bg-[#121212]">
              <CardContent className="py-6">
                <div className="flex items-center mb-2 text-sm font-bold">
                  <p className="text-yellow-400">Total penjualan</p>
                  <CubeIcon className="ml-auto" />
                </div>
                <p className="text-3xl font-bold">+5.435</p>
                <p className="text-xs opacity-80">+1.2% dari bulan lalu</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex w-full mt-8">
          <div className="w-3/5">
            <Card className="mx-2 dark:bg-[#121212]">
              <CardContent></CardContent>
            </Card>
          </div>
          <div className="w-2/5">
            <Card className="mx-2 dark:bg-[#121212]">
              <CardContent className="flex flex-col py-6">
                <div className="mb-3">
                  <p className="font-bold text-yellow-400">
                    Transaksi terakhir
                  </p>
                  <p className="opacity-80 text-sm">
                    Anda melakukan 245 transaksi bulan ini
                  </p>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex items-center w-full my-3">
                    <div>
                      <Avatar>
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/lorelei/jpg?seed=dodi"
                          alt="Buena"
                        />
                      </Avatar>
                    </div>
                    <div className="text-sm ml-4">
                      <p className="font-bold">Dodi Cahyadi</p>
                      <p>dodicahyadi@gmail.com</p>
                    </div>
                    <div className="ml-auto">
                      <p className="text-lg font-bold">Rp450.000</p>
                    </div>
                  </div>
                  <div className="flex items-center w-full my-3">
                    <div>
                      <Avatar>
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/lorelei/jpg?seed=irma"
                          alt="Buena"
                        />
                      </Avatar>
                    </div>
                    <div className="text-sm ml-4">
                      <p className="font-bold">Irma Rosi</p>
                      <p>irmarosi@gmail.com</p>
                    </div>
                    <div className="ml-auto">
                      <p className="text-lg font-bold">Rp78.000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
