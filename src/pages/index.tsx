/* eslint-disable @next/next/no-img-element */
// import ThemeDropdown from "@/components/theme-dropdown";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Spin as Hamburger } from "hamburger-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReasonCard } from "@/view/reason-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  const [isOpen, setOpen] = useState(false);
  const [isDialog, setDialog] = useState(false);
  const [sheet, setSheet] = useState("translate-x-[75vw]");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);

  async function messageHandler(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/message/add", { name, message });
      messageFetcher();
      setDialog(!isDialog);
      setName("");
      setMessage("");
    } catch (err) {
      // console.error(err);
    }
  }

  async function messageFetcher() {
    try {
      const response = await axios.post("/api/message");
      setData(response.data.data);
    } catch (err) {
      // console.error(err);
    }
  }

  useEffect(() => {
    AOS.init();
    messageFetcher();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSheet("translate-x-0");
    } else {
      setSheet("translate-x-[75vw]");
    }
  }, [isOpen]);

  return (
    <div className="bg-white dark:bg-[#121212]">
      <Head>
        <title>Danaku</title>
        <link rel="icon" href="/danaku.png" />
      </Head>
      <nav className="border-b border-opacity-10 shadow-sm sticky top-0 z-40 bg-white dark:bg-[#121212]">
        <div className="container flex py-4 justify-between">
          <div className="w-1/3 flex justify-start items-center">
            <Link
              href="/"
              className="text-lg font-bold px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-md">
              Dana<span className="text-yellow-400 font-black">Ku</span>
            </Link>
          </div>
          <div className="w-1/3 md:flex hidden justify-center items-center">
            <Link href="#beranda" className="mx-2">
              <Button variant="link">Beranda</Button>
            </Link>
            <Link href="#produk" className="mx-2">
              <Button variant="link">Produk</Button>
            </Link>
            <Link href="#tentang" className="mx-2">
              <Button variant="link">Tentang</Button>
            </Link>
          </div>
          <div className="w-1/3 md:flex hidden justify-end items-center">
            <Link href="/login" className="mr-2">
              <Button variant="ghost" className="font-bold">
                Masuk
              </Button>
            </Link>
            <Link href="/register" className="ml-2">
              <Button className="font-bold">Daftar</Button>
            </Link>
          </div>
          <div className="w-1/3 md:hidden flex justify-end">
            <Hamburger
              toggled={isOpen}
              toggle={setOpen}
              direction="right"
              size={28}
            />
          </div>
        </div>
      </nav>

      <main className="container">
        <section
          id="beranda"
          className="flex flex-wrap md:my-28 my-16 scroll-my-48">
          <div
            className="lg:w-1/2 w-full flex flex-col justify-center"
            data-aos="zoom-in">
            <p className="text-5xl font-semibold leading-[1.15] lg:text-left text-center">
              Kelola Dana Koperasi Anda Dengan Mudah hanya di Dana
              <span className="text-yellow-400">Ku</span>
            </p>
            <p className="my-2 lg:text-left text-center opacity-80">
              Selamat datang di Dana<span className="text-yellow-400">Ku</span>!
              Kami adalah solusi modern yang dirancang khusus untuk memperkuat
              koneksi dan pelayanan antara koperasi dan anggota.
            </p>
            <div className="flex lg:flex-row flex-col">
              <Link href="/dashboard" className="lg:mr-2 mx-auto lg:m-0 mt-4">
                <Button className="font-bold">Ayo Mulai</Button>
              </Link>
              <Link href="#produk" className="lg:ml-2 mx-auto lg:m-0 mt-3">
                <Button variant="ghost" className="font-bold">
                  Bagaimana ini bekerja?
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-end lg:pr-16 pr-0 lg:m-0 mt-16">
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger>
                  <img
                    src="/main-image.png"
                    alt="main-image"
                    width={400}
                    height={400}
                    className="object-contain"
                    data-aos="zoom-in"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Image by{" "}
                    <Link
                      href="https://storyset.com"
                      target="_blank"
                      className="hover:underline underline-offset-4">
                      StorySet
                    </Link>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        <section
          id="produk"
          className="flex flex-col md:my-28 my-16 scroll-my-40">
          <div className="flex flex-col mb-16">
            <div className="flex flex-col mb-8" data-aos="zoom-in-up">
              <p className="text-3xl font-semibold text-center mb-2">
                Mengapa Harus Memilih Kami?
              </p>
              <p className="text-center opacity-80">
                Kami bertujuan untuk membawa kemudahan dan keterjangkauan kepada
                Anda.
              </p>
            </div>
            <div className="flex flex-wrap">
              <ReasonCard.KemudahanAkses />
              <ReasonCard.BerkembangBersama />
              <ReasonCard.PeminjamanInvestasi />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col mb-8" data-aos="zoom-in-up">
              <p className="text-3xl font-semibold text-center mb-2">
                Fitur Unggulan Kami
              </p>
              <p className="text-center opacity-80">
                Akses semua fitur unggulan kami dengan mudah dan cepat.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:mx-36 overflow-x-hidden">
            <div className="flex flex-wrap md:my-4 my-8">
              <div
                className="lg:w-1/2 w-full flex flex-col justify-center"
                data-aos="fade-right">
                <p className="text-2xl font-semibold leading-[1.15] lg:text-left text-center">
                  Dashboard modern
                </p>
                <p className="my-2 lg:text-left text-center opacity-80">
                  Dengan dashboard, Anda akan diberikan kemudahan untuk
                  mengelola anggota serta transaksi Anda. Anda dapat dengan
                  cepat mengakses informasi penting dan melacak aktivitas dengan
                  lebih efisien.
                </p>
              </div>
              <div className="lg:w-1/2 w-full flex justify-center lg:justify-end pr-0 lg:m-0 mt-6">
                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger>
                      <img
                        src="/images/dashboard.png"
                        alt="dashboard"
                        width={300}
                        height={300}
                        className="object-contain"
                        data-aos="zoom-in"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Image by{" "}
                        <Link
                          href="https://storyset.com"
                          target="_blank"
                          className="hover:underline underline-offset-4">
                          StorySet
                        </Link>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex flex-wrap-reverse md:my-4 my-8">
              <div className="lg:w-1/2 w-full flex justify-center lg:justify-start pl-0 lg:m-0 mt-6">
                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger>
                      <img
                        src="/images/fast.png"
                        alt="fast"
                        width={300}
                        height={300}
                        className="object-contain"
                        data-aos="zoom-in"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Image by{" "}
                        <Link
                          href="https://storyset.com"
                          target="_blank"
                          className="hover:underline underline-offset-4">
                          StorySet
                        </Link>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div
                className="lg:w-1/2 w-full flex flex-col justify-center"
                data-aos="fade-left">
                <p className="text-2xl font-semibold leading-[1.15] lg:text-left text-center">
                  Akses cepat
                </p>
                <p className="my-2 lg:text-left text-center opacity-80">
                  Anda dapat mengakses Dana
                  <span className="text-yellow-400">Ku</span> dengan mudah dan
                  cepat melalui perangkat ponsel Anda. Ini memungkinkan Anda
                  untuk melakukan berbagai transaksi dengan kenyamanan dan
                  efisiensi yang tinggi.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap md:my-4 my-8">
              <div
                className="lg:w-1/2 w-full flex flex-col justify-center"
                data-aos="fade-right">
                <p className="text-2xl font-semibold leading-[1.15] lg:text-left text-center">
                  Sinkronisasi cloud
                </p>
                <p className="my-2 lg:text-left text-center opacity-80">
                  Dengan Dana<span className="text-yellow-400">Ku</span>, Anda
                  tidak perlu khawatir kehilangan data Anda. Kami menggunakan
                  database yang selalu online untuk memastikan keamanan data
                  Anda dan mencegah kehilangan.
                </p>
              </div>
              <div className="lg:w-1/2 w-full flex justify-center lg:justify-end pr-0 lg:m-0 mt-6">
                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger>
                      <img
                        src="/images/cloud.png"
                        alt="cloud"
                        width={300}
                        height={300}
                        className="object-contain"
                        data-aos="zoom-in"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Image by{" "}
                        <Link
                          href="https://storyset.com"
                          target="_blank"
                          className="hover:underline underline-offset-4">
                          StorySet
                        </Link>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex flex-wrap-reverse md:my-4 my-8">
              <div className="lg:w-1/2 w-full flex justify-center lg:justify-start pl-0 lg:m-0 mt-6">
                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger>
                      <img
                        src="/images/encrypt.png"
                        alt="encrypt"
                        width={300}
                        height={300}
                        className="object-contain"
                        data-aos="zoom-in"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Image by{" "}
                        <Link
                          href="https://storyset.com"
                          target="_blank"
                          className="hover:underline underline-offset-4">
                          StorySet
                        </Link>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div
                className="lg:w-1/2 w-full flex flex-col justify-center"
                data-aos="fade-left">
                <p className="text-2xl font-semibold leading-[1.15] lg:text-left text-center">
                  Terenkripsi
                </p>
                <p className="my-2 lg:text-left text-center opacity-80">
                  Dana<span className="text-yellow-400">Ku</span> sangat
                  memprioritaskan keamanan data Anda, oleh karena itu kami
                  menerapkan teknologi enkripsi yang kuat untuk memastikan bahwa
                  informasi yang Anda simpan dalam aplikasi kami tetap aman dan
                  tidak dapat bocor.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="tentang"
          className="flex flex-wrap md:my-28 my-16 justify-center scroll-my-32">
          <div className="flex flex-col mb-16">
            <div className="flex flex-col mb-8" data-aos="zoom-in-up">
              <p className="text-3xl font-semibold text-center mb-2">
                Tentang kami
              </p>
              <p className="text-center opacity-80">
                Kemudahan yang anda dapatkan adalah sebuah tanda keberhasilan
                kami.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="lg:w-1/3 md:w-3/4 w-full my-auto">
                <Card
                  className="dark:bg-[#191919] min-h-[272px] flex items-center"
                  data-aos="fade-right">
                  <CardContent className="py-6">
                    <img
                      src="/images/about.png"
                      alt="about"
                      width={1366}
                      height={768}
                      className="object-contain rounded"
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="lg:w-1/3 md:w-3/4 w-full overflow-x-hidden">
                <Card
                  className="dark:bg-[#191919] min-h-[272px] flex items-center"
                  data-aos="fade-left">
                  <CardContent className="py-6 h-full w-full">
                    <p className="text-2xl font-bold">
                      Dana<span className="text-yellow-400">Ku</span>
                    </p>
                    <div className="flex flex-col mt-4">
                      <p>
                        Jl. Raya 19 Jagaraksa, Rawakayu, Jakarta Selatan, DKI
                        Jakarta 12640
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Link
                          href="https://instagram.com"
                          target="_blank"
                          className="hover:text-yellow-400 border-r pr-4">
                          <InstagramLogoIcon className="leading-none duration-150 w-6 h-6" />
                        </Link>
                        <Link
                          href="https://x.com"
                          target="_blank"
                          className="hover:text-yellow-400 pl-2 border-r pr-4">
                          <TwitterLogoIcon className="leading-none duration-150 w-6 h-6" />
                        </Link>
                        <Link
                          href="mailto:"
                          target="_blank"
                          className="hover:text-yellow-400 pl-2 border-r pr-4">
                          <EnvelopeClosedIcon className="leading-none duration-150 w-6 h-6" />
                        </Link>
                        <Link
                          href="https://github.com"
                          target="_blank"
                          className="hover:text-yellow-400 pl-2">
                          <GitHubLogoIcon className="leading-none duration-150 w-6 h-6" />
                        </Link>
                      </div>
                      <div className="mt-6 flex flex-wrap">
                        <Dialog
                          open={isDialog}
                          onOpenChange={() => setDialog(!isDialog)}>
                          <DialogTrigger asChild>
                            <Button>Kirim pesan dan pesan</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <div>
                              <p className="text-xl font-bold">
                                Kesan dan pesan
                              </p>
                              <p className="opacity-80">
                                Kirim kesan, pesan, kritik, masukan, atau saran
                                anda untuk kami
                              </p>
                              <form
                                onSubmit={messageHandler}
                                className="flex flex-col mt-4">
                                <div className="flex">
                                  <Label
                                    htmlFor="name"
                                    className="w-1/5 my-auto text-right pr-4">
                                    Nama
                                  </Label>
                                  <Input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-4/5 dark:border-white/20 h-8"
                                    required
                                  />
                                </div>
                                <div className="flex mt-2">
                                  <Label
                                    htmlFor="message"
                                    className="w-1/5 my-auto text-right pr-4">
                                    Pesan
                                  </Label>
                                  <Input
                                    type="text"
                                    id="message"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="w-4/5 dark:border-white/20 h-8"
                                    required
                                  />
                                </div>
                                <Button
                                  className="ml-auto mt-4"
                                  size="sm"
                                  type="submit">
                                  Kirim pesan dan kesan
                                </Button>
                              </form>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <div className="flex flex-col mb-16">
            <div className="flex flex-col mb-8" data-aos="zoom-in-up">
              <p className="text-3xl font-semibold text-center mb-2">
                Kata mereka untuk kami
              </p>
              <p className="text-center opacity-80">
                Beberapa pesan dan kesan pengguna selama menggunakan Dana
                <span className="text-yellow-400">Ku</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 mx-auto justify-center w-4/5">
              {data.map((data: any, index) => (
                <Card
                  className="dark:bg-[#121212]"
                  key={index}
                  data-aos="zoom-in">
                  <CardContent className="px-6 py-4">
                    <p className="font-bold text-center">{data.message}</p>
                    <p className="opacity-80 text-center">{data.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-opacity-10">
        <div className="container flex flex-col">
          <div className="flex justify-between items-center my-4">
            <div className="flex flex-col text-sm">
              <div className="flex items-center">
                <p>
                  © 2023 {` `}
                  <Link
                    href="https://github.com/lanakuge"
                    target="_blank"
                    className="hover:underline underline-offset-4">
                    Nizhar Maulana
                  </Link>
                </p>
              </div>
              <div>
                <p>All Rights Reserved</p>
              </div>
            </div>
            <div>{/* <ThemeDropdown /> */}</div>
          </div>
        </div>
      </footer>

      <div
        className={`fixed top-[77px] bg-white dark:bg-[#121212] right-0 z-30 overflow-hidden h-screen border-l border-opacity-10 w-[75vw] ${sheet} duration-200`}>
        <div className="flex flex-col my-4 font-bold">
          <Link href="#beranda" className="mx-2 my-2">
            <Button variant="link" onClick={() => setOpen(false)}>
              Beranda
            </Button>
          </Link>
          <Link href="#produk" className="mx-2 my-2">
            <Button variant="link" onClick={() => setOpen(false)}>
              Produk
            </Button>
          </Link>
          <Link href="#tentang" className="mx-2 my-2">
            <Button variant="link" onClick={() => setOpen(false)}>
              Tentang
            </Button>
          </Link>
          <Link href="/login" className="mx-2 my-2">
            <Button
              variant="link"
              className="text-yellow-400 dark:text-yellow-400">
              Masuk
            </Button>
          </Link>
          <Link href="/register" className="mx-2 my-2">
            <Button
              variant="link"
              className="text-yellow-400 dark:text-yellow-400">
              Daftar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
