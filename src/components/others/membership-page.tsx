/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AuthContext, MembershipContext } from "@/services/storage";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

function Member() {
  const router = useRouter();
  const member = useContext(MembershipContext);
  const auth = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [length, setLength] = useState(0);
  const [page, setPage] = useState(1);
  const [max, setMax] = useState(1);

  function memberIdMaker(id: number) {
    if (id < 10) {
      return `A000` + id;
    } else if (id < 100) {
      return `A00` + id;
    } else if (id < 1000) {
      return `A0` + id;
    } else {
      return `A` + id;
    }
  }

  function dateFormater(date: any): any {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month: any = new Intl.DateTimeFormat("id-ID", {
      month: "long",
    }).format(newDate);
    const year = newDate.getFullYear();
    return `${day} ${month} ${year}`;
  }

  async function memberFetcher(
    name: string,
    uuid: string,
    page: number,
    limit: number
  ) {
    try {
      const response = await axios.post("/api/member", {
        name,
        ownerId: uuid,
        page,
        limit,
      });
      setData(response.data.data);
      setLength(response.data.length);
      setMax(Math.ceil(response.data.length / limit));
    } catch (err) {
      console.log(err);

      router.push("/login");
    }
  }

  useEffect(() => {
    if (max == 0) {
      setPage(0);
    } else if (page < 1) {
      setPage(1);
    } else if (page > max) {
      setPage(max);
    }
    memberFetcher(search, auth.uuid, page, 10);
  }, [page]);

  useEffect(() => {
    const delay = setTimeout(() => {
      memberFetcher(search, auth.uuid, page, 10);
      console.log(data);
      console.log(length);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (max == 0) {
      setPage(0);
    } else if (page < 1) {
      setPage(1);
    } else if (page > max) {
      setPage(max);
    }
    member.setMemberData(data);
  }, [data]);

  return (
    <>
      <div className="flex">
        <div className="flex">
          <form>
            <Input
              type="text"
              id="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari anggota..."
              className="mb-3 dark:border-white/20 h-8 m-0"
            />
          </form>
        </div>
        <div></div>
      </div>
      <div className="flex flex-col">
        <Table className="my-1">
          <TableHeader>
            <TableRow>
              <TableHead>ID Anggota</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tabungan</TableHead>
              <TableHead>Pinjaman</TableHead>
              <TableHead>Bergabung Pada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((data: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{memberIdMaker(data.id)}</TableCell>
                <TableCell>{`${data.firstName} ${data.lastName}`}</TableCell>
                <TableCell>{data.email}</TableCell>
                <TableCell>{`Rp${
                  data.moneySavings == null ? `0.00` : `${data.moneySavings}.00`
                }`}</TableCell>
                <TableCell>{`Rp${
                  data.borrowedMoney == null
                    ? `0.00`
                    : `${data.borrowedMoney}.00`
                }`}</TableCell>
                <TableCell>{dateFormater(data.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex ml-auto gap-4">
          <p className="my-auto text-sm">
            {page} dari {max} Halaman
          </p>
          <Button variant="outline" onClick={() => setPage(page - 1)}>
            Sebelumnya
          </Button>
          <Button variant="outline" onClick={() => setPage(page + 1)}>
            Selanjutnya
          </Button>
        </div>
      </div>
    </>
  );
}

function Transactions() {
  return (
    <>
      <div className="flex">
        <div className="flex">
          <form>
            <Input
              type="text"
              id="search"
              placeholder="Cari transaksi..."
              className="mb-3 dark:border-white/20 h-8 m-0"
            />
          </form>
        </div>
        <div></div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Transaksi</TableHead>
              <TableHead>ID Anggota</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nominal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>T000001</TableCell>
              <TableCell>A0001</TableCell>
              <TableCell>Didit Mahesa</TableCell>
              <TableCell>Meminjam untuk keperluan sekolah</TableCell>
              <TableCell>Pinjaman</TableCell>
              <TableCell>31 Agustus 2023</TableCell>
              <TableCell>Rp230.000,00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export const MembershipPage = { Member, Transactions };
