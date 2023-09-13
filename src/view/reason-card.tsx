import {
  RocketIcon,
  ChevronRightIcon,
  MixIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";

const KemudahanAkses = () => {
  const [clamp, setClamp] = useState(true);

  return (
    <div className="md:w-1/3 w-full md:my-0 mb-8">
      <Card className="mx-4 dark:bg-[#191919]" data-aos="flip-left">
        <CardHeader>
          <RocketIcon className="bg-red-500 w-10 h-10 py-2 rounded-md" />
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-lg font-bold mb-2 truncate">Kemudahan Akses</p>
          <p className={clamp ? "line-clamp-3" : ""}>
            Akses koperasi tidak pernah semudah ini. Dengan Dana
            <span className="text-yellow-400">Ku</span>, Anda dapat melakukan
            transaksi, mengakses informasi, dan berinteraksi kapan saja dan di
            mana saja.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button
              variant="link"
              className="flex p-0 h-min decoration-red-500"
              onClick={e => {
                e.preventDefault();
                setClamp(!clamp);
              }}>
              <p className="my-auto text-red-500">
                {clamp ? "Lainnya" : "Tutup"}
              </p>
              <ChevronRightIcon className="my-auto stroke-red-500" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

const BerkembangBersama = () => {
  const [clamp, setClamp] = useState(true);

  return (
    <div className="md:w-1/3 w-full md:my-0 mb-8">
      <Card className="mx-4 dark:bg-[#191919]" data-aos="flip-up">
        <CardHeader>
          <MixIcon className="bg-blue-500 w-10 h-10 py-2 rounded-md" />
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-lg font-bold mb-2 truncate">Berkembang Bersama</p>
          <p className={clamp ? "line-clamp-3" : ""}>
            Dana<span className="text-yellow-400">Ku</span> adalah wadah bagi
            gagasan dan aspirasi Anda. Anda dapat berpartisipasi dalam forum
            diskusi, memberikan masukan, dan bahkan mengajukan inisiatif untuk
            pertumbuhan bersama.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button
              variant="link"
              className="flex p-0 h-min decoration-blue-500"
              onClick={e => {
                e.preventDefault();
                setClamp(!clamp);
              }}>
              <p className="my-auto text-blue-500">
                {clamp ? "Lainnya" : "Tutup"}
              </p>
              <ChevronRightIcon className="my-auto stroke-blue-500" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

const PeminjamanInvestasi = () => {
  const [clamp, setClamp] = useState(true);

  return (
    <div className="md:w-1/3 w-full md:my-0 mb-8">
      <Card className="mx-4 dark:bg-[#191919]" data-aos="flip-right">
        <CardHeader>
          <FileTextIcon className="bg-yellow-400 w-10 h-10 py-2 rounded-md" />
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-lg font-bold mb-2 truncate">
            Peminjaman dan Investasi
          </p>
          <p className={clamp ? "line-clamp-3" : ""}>
            Dengan Dana<span className="text-yellow-400">Ku</span>, Anda dapat
            menjelajahi peluang peminjaman yang menguntungkan dan opsi investasi
            yang berpotensi. Semua informasi yang Anda butuhkan ada di ujung
            jari Anda.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button
              variant="link"
              className="flex p-0 h-min decoration-yellow-400"
              onClick={e => {
                e.preventDefault();
                setClamp(!clamp);
              }}>
              <p className="my-auto text-yellow-400">
                {clamp ? "Lainnya" : "Tutup"}
              </p>
              <ChevronRightIcon className="my-auto stroke-yellow-400" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export const ReasonCard = {
  KemudahanAkses,
  BerkembangBersama,
  PeminjamanInvestasi,
};
