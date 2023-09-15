/* eslint-disable @next/next/no-img-element */
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [transactionForm, setTransactionForm] = useState({
    memberId: 0,
    memberName: "",
    formId: "",
    desc: "",
    nominal: "",
  });
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [news, setNews] = useState({
    title: "China Luncurkan Platform AI Baru, Saingan ChatGPT dan Google Bard?",
    link: "https://www.cnnindonesia.com/teknologi/20230904193933-185-994683/china-luncurkan-platform-ai-baru-saingan-chatgpt-dan-google-bard",
    contentSnippet:
      "China meluncurkan platform kecerdasan buatan (AI) bernama ERNIE Bot yang bakal menjadi pesaing ChatGPT dan Google Bard. Simak keunggulannya.",
    isoDate: "2023-09-04T13:26:44.000Z",
    image: {
      small:
        "https://akcdn.detik.net.id/visual/2023/06/07/ilustrasi-artificial-intelligence-ilustrasi-ai-ilustrasi-kecerdasan-buatan_169.jpeg?w=360&q=90",
      large:
        "https://akcdn.detik.net.id/visual/2023/06/07/ilustrasi-artificial-intelligence-ilustrasi-ai-ilustrasi-kecerdasan-buatan_169.jpeg?w=360&q=100",
    },
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
      auth.setBalance(decoded.balance);
      auth.setBio(decoded.bio);
      auth.setAddress(decoded.address);
      auth.setExpire(decoded.exp);
      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      router.push("/login");
    }
  }

  async function newsFetcher() {
    try {
      const response = await axios.get(
        "https://berita-indo-api.vercel.app/v1/cnn-news/"
      );
      await setNews(response.data.data[0]);
    } catch (err) {
      console.error(err);
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
        auth.setBalance(decoded.balance);
        auth.setBio(decoded.bio);
        auth.setAddress(decoded.address);
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

  async function addTransaction(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/transactions/add", {
        userId: auth.uuid,
        memberId: transactionForm.memberId,
        desc: transactionForm.desc,
        nominal: transactionForm.nominal,
      });
      setIsTransactionOpen(false);
      setTransactionForm({
        memberId: 0,
        memberName: "",
        formId: "",
        desc: "",
        nominal: "",
      });
      dashboardFetcher();
    } catch (err: any) {
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
    }
  }

  async function memberTransactionSearch(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/member/get", {
        ownerId: auth.uuid,
        memberId: transactionForm.formId,
      });
      setTransactionForm(prev => ({
        ...prev,
        memberId: response.data.data.id,
      }));
      setTransactionForm(prev => ({
        ...prev,
        memberName: `${response.data.data.firstName} ${response.data.data.lastName}`,
      }));
      setStatus(true);
      setErrorMessage("");
    } catch (err: any) {
      setTransactionForm(prev => ({ ...prev, memberId: 0 }));
      setTransactionForm(prev => ({ ...prev, memberName: "" }));
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
    }
  }

  useEffect(() => {
    async function fetcher() {
      await refreshToken();
      await dashboardFetcher();
    }
    newsFetcher();
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
              <Link href="/dashboard" className="">
                Dashboard
              </Link>
              <Link
                href="/dashboard/membership"
                className="opacity-80 hover:opacity-100 duration-75 ease-out">
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
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="block w-full">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="/dashboard/membership"
                        className="block w-full opacity-80 hover:opacity-100 duration-75 ease-out">
                        Keanggotaan
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
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
                  {/* <DropdownMenuItem>
                    <Link href="/settings" className="block w-full">
                      Pengaturan
                    </Link>
                  </DropdownMenuItem> */}
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
          <div className="xl:w-1/4 md:w-1/2 w-full xl:my-0 my-2">
            <Card className="mx-2 dark:bg-[#191919]">
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
          <div className="xl:w-1/4 md:w-1/2 w-full xl:my-0 my-2">
            <Card className="mx-2 dark:bg-[#191919]">
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
          <div className="xl:w-1/4 md:w-1/2 w-full xl:my-0 my-2">
            <Card className="mx-2 dark:bg-[#191919]">
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
          <div className="xl:w-1/4 md:w-1/2 w-full xl:my-0 my-2">
            <Card className="mx-2 dark:bg-[#191919]">
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

        <div className="flex flex-wrap w-full md:mt-8 mt-0">
          <div className="lg:w-3/5 w-full md:mt-0 mt-6">
            <Card className="mx-2 dark:bg-[#191919]">
              <CardContent className="flex flex-col py-6">
                <div className="mb-3">
                  <p className="font-bold text-yellow-400">Pintasan</p>
                  <p className="opacity-80 text-sm">
                    Lakukan transaksi dengan cepat disini
                  </p>
                </div>
                <form className="flex flex-col gap-3" onSubmit={addTransaction}>
                  <Alert
                    variant="destructive"
                    className={`justify-center py-2 mb-4 ${
                      status ? "hidden" : "flex"
                    }`}>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                  <p className="font-bold">
                    {transactionForm.memberName == ""
                      ? "Nama anggota"
                      : transactionForm.memberName}
                  </p>
                  <form
                    className="flex gap-3"
                    onSubmit={memberTransactionSearch}>
                    <Label
                      htmlFor="memberId"
                      className="w-1/5 my-auto truncate">
                      ID Anggota
                    </Label>
                    <Input
                      type="number"
                      id="memberId"
                      value={transactionForm.formId}
                      onChange={e =>
                        setTransactionForm(prev => ({
                          ...prev,
                          formId: e.target.value,
                        }))
                      }
                      placeholder="69"
                      className="mb-3 dark:border-white/20 h-8 m-0 w-3/5"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="w-1/5 font-bold"
                      onClick={memberTransactionSearch}>
                      Cari
                    </Button>
                  </form>
                  <div className="flex gap-2">
                    <Label htmlFor="nominal" className="w-1/5 my-auto">
                      Nominal
                    </Label>
                    <Input
                      type="number"
                      id="nominal"
                      value={transactionForm.nominal}
                      onChange={e =>
                        setTransactionForm(prev => ({
                          ...prev,
                          nominal: e.target.value,
                        }))
                      }
                      placeholder="200000"
                      className="mb-3 dark:border-white/20 h-8 m-0 w-4/5"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Label htmlFor="desc" className="w-1/5 my-auto">
                      Deskripsi
                    </Label>
                    <Input
                      type="text"
                      id="desc"
                      value={transactionForm.desc}
                      onChange={e =>
                        setTransactionForm(prev => ({
                          ...prev,
                          desc: e.target.value,
                        }))
                      }
                      placeholder="Menanam modal awal"
                      className="mb-3 dark:border-white/20 h-8 m-0 w-4/5"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      className="w-full font-bold">
                      Tambah transaksi
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card className="mx-2 mt-4 mb-4 lg:mb-0 dark:bg-[#191919] dark:hover:bg-[#151515] duration-200">
              <Link
                className="flex py-2 px-2 group"
                href={news.link}
                target="_blank">
                <img
                  src={news.image.large}
                  alt="news"
                  height={100}
                  width={150}
                  className="rounded-md group-hover:brightness-75 duration-200"
                />
                <div className="flex flex-col py-2 px-4">
                  <p className="font-bold leading-5 line-clamp-1">
                    {news.title}
                  </p>
                  <p className="opacity-80 text-sm mt-2 line-clamp-2">
                    {news.contentSnippet}
                  </p>
                </div>
              </Link>
            </Card>
          </div>
          <div className="lg:w-2/5 w-full md:mt-0 mt-4">
            <Card className="mx-2 dark:bg-[#191919]">
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
