import ThemeDropdown from "@/components/theme-dropdown";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Spin as Hamburger } from "hamburger-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReasonCard } from "@/view/reason-card";

export default function Home() {
  const [isOpen, setOpen] = useState(false);
  const [sheet, setSheet] = useState("translate-x-[75vw]");

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
          <div className="lg:w-1/2 w-full flex flex-col justify-center">
            <p className="text-5xl font-semibold leading-[1.15] lg:text-left text-center">
              Kelola Dana Koperasi Anda Degan Mudah hanya di Dana
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
          <div className="lg:w-1/2 w-full flex justify-end lg:pr-16 pr-0 lg:m-0 mt-16">
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger>
                  <Image
                    src="/main-image.png"
                    alt="main-image"
                    width={400}
                    height={400}
                    className="object-contain"
                    priority
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
            <div className="flex flex-col mb-8">
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
            <div className="flex flex-col mb-8">
              <p className="text-3xl font-semibold text-center mb-2">
                Fitur Unggulan Kami
              </p>
              <p className="text-center opacity-80">
                Akses semua fitur unggulan kami dengan mudah dan cepat.
              </p>
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
            <div>
              <ThemeDropdown />
            </div>
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
