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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { PopoverForm } from "@/components/others/popover-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";

function Member() {
  const router = useRouter();
  const member = useContext(MembershipContext);
  const auth = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [length, setLength] = useState(0);
  const [page, setPage] = useState(1);
  const [max, setMax] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState(true);

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
      router.push("/login");
    }
  }

  async function addMember(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/member/add", {
        ownerId: auth.uuid,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      });
      memberFetcher(search, auth.uuid, page, 10);
      setIsOpen(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
      });
    } catch (err: any) {
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
      // console.log(err);
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

  useEffect(() => {
    member.setSearch(search);
    member.setLength(length);
    member.setPage(page);
    member.setMax(max);
  }, [search, length, page, max]);

  return (
    <>
      <div className="flex">
        <div className="xs:flex hidden">
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
        <div className="ml-auto">
          <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <PopoverTrigger>
              <Button size="sm" className="font-bold">
                Tambah anggota
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="dark:bg-[#121212] w-[350px]">
              <form className="flex flex-col gap-3" onSubmit={addMember}>
                <Alert
                  variant="destructive"
                  className={`justify-center py-2 mb-4 ${
                    status ? "hidden" : "flex"
                  }`}>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Label htmlFor="firstName" className="w-1/4 my-auto">
                    Nama awal
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={form.firstName}
                    onChange={e =>
                      setForm(prev => ({ ...prev, firstName: e.target.value }))
                    }
                    placeholder="Saul"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-3/4"
                  />
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="lastName" className="w-1/4 my-auto">
                    Nama akhir
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    value={form.lastName}
                    onChange={e =>
                      setForm(prev => ({ ...prev, lastName: e.target.value }))
                    }
                    placeholder="Goodman"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-3/4"
                  />
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="email" className="w-1/4 my-auto">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={e =>
                      setForm(prev => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="goodman@gmail.com"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-3/4"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="w-full font-bold">
                    Tambah anggota
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-col">
        <Table className="my-1 md:table hidden">
          <TableHeader>
            <TableRow>
              <TableHead>ID Anggota</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tabungan</TableHead>
              <TableHead>Pinjaman</TableHead>
              <TableHead>Bergabung Pada</TableHead>
              <TableHead></TableHead>
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
                <TableCell>
                  <PopoverForm.Member
                    uuid={data.uuid}
                    firstName={data.firstName}
                    lastName={data.lastName}
                    email={data.email}
                    setData={setData}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="md:hidden flex flex-wrap my-4">
          {data.map((data: any, index: number) => (
            <div className="sm:w-1/2 w-full" key={index}>
              <Card className="mx-2 my-2 dark:bg-[#191919]">
                <CardContent className="pt-4 pb-6">
                  <div className="flex justify-between items-center">
                    <p className="ml-3 opacity-80">{memberIdMaker(data.id)}</p>
                    <PopoverForm.Member
                      uuid={data.uuid}
                      firstName={data.firstName}
                      lastName={data.lastName}
                      email={data.email}
                      setData={setData}
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/lorelei/jpg?seed=${data.firstName}${data.lastName}`}
                        alt={`${data.firstName}${data.lastName}`}
                      />
                    </Avatar>
                    <p className="text-xl font-bold">
                      {`${data.firstName} ${data.lastName}`}
                    </p>
                  </div>
                  <div className="flex flex-row mt-2">
                    <div className="flex flex-col text-sm sm:w-1/2 w-1/3 opacity-80">
                      <p className="truncate">Email</p>
                      <p className="truncate">Tabungan</p>
                      <p className="truncate">Pinjaman</p>
                      <p className="truncate">Bergabung pada</p>
                    </div>
                    <div className="flex flex-col text-sm sm:w-1/2 w-2/3 truncate">
                      <p className="truncate">: {data.email}</p>
                      <p className="truncate">
                        :{" "}
                        {`Rp${
                          data.moneySavings == null
                            ? `0.00`
                            : `${data.moneySavings}.00`
                        }`}
                      </p>
                      <p className="truncate">
                        :{" "}
                        {`Rp${
                          data.borrowedMoney == null
                            ? `0.00`
                            : `${data.borrowedMoney}.00`
                        }`}
                      </p>
                      <p className="truncate">
                        : {dateFormater(data.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className="flex md:ml-auto mx-auto gap-4">
          <p className="my-auto text-sm md:block hidden">
            {page} dari {max} Halaman
          </p>
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)}>
            Sebelumnya
          </Button>
          <p className="my-auto text-sm md:hidden block">
            {page} dari {max}
          </p>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
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
