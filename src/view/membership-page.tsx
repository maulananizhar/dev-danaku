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
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { PopoverForm } from "@/view/popover-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-[250px] mb-4 sm:my-auto">
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
        <div className="flex justify-evenly sm:ml-auto sm:gap-2">
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
                  data.moneySavings == null
                    ? `0.00`
                    : `${data.moneySavings.toLocaleString("id-ID")}.00`
                }`}</TableCell>
                <TableCell>{`Rp${
                  data.moneyLoan == null
                    ? `0.00`
                    : `${data.moneyLoan.toLocaleString("id-ID")}.00`
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
                        src={`https://api.dicebear.com/7.x/lorelei/jpg?seed=${data.firstName} ${data.lastName}`}
                        alt={`${data.firstName} ${data.lastName}`}
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
                            : `${data.moneySavings.toLocaleString("id-ID")}.00`
                        }`}
                      </p>
                      <p className="truncate">
                        :{" "}
                        {`Rp${
                          data.moneyLoan == null
                            ? `0.00`
                            : `${data.moneyLoan.toLocaleString("id-ID")}.00`
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
        <div className="flex md:ml-auto md:mr-0 mx-auto gap-4">
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
  const router = useRouter();
  const member = useContext(MembershipContext);
  const auth = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [length, setLength] = useState(0);
  const [page, setPage] = useState(1);
  const [max, setMax] = useState(1);
  const [transactionForm, setTransactionForm] = useState({
    memberId: 0,
    memberName: "",
    formId: "",
    desc: "",
    nominal: "",
  });
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [sort, setSort] = useState("dateDesc");
  const [filter, setFilter] = useState("semua");

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

  function transactionsIdMaker(id: number, type: string) {
    if (type == "Pinjaman" || type == "Pelunasan") {
      if (id < 10) {
        return `P000` + id;
      } else if (id < 100) {
        return `P00` + id;
      } else if (id < 1000) {
        return `P0` + id;
      } else {
        return `P` + id;
      }
    } else if (type == "Tabungan" || type == "Penarikan") {
      if (id < 10) {
        return `T000` + id;
      } else if (id < 100) {
        return `T00` + id;
      } else if (id < 1000) {
        return `T0` + id;
      } else {
        return `T` + id;
      }
    } else {
      if (id < 10) {
        return `L000` + id;
      } else if (id < 100) {
        return `L00` + id;
      } else if (id < 1000) {
        return `L0` + id;
      } else {
        return `L` + id;
      }
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

  async function savingFetcher(
    name: string,
    uuid: string,
    page: number,
    limit: number
  ) {
    try {
      const response = await axios.post("/api/transactions/", {
        name,
        ownerId: uuid,
        page,
        limit,
        sort,
        filt: filter,
      });
      setData(response.data.data);
      setLength(response.data.length);
      setMax(Math.ceil(response.data.length / limit));
    } catch (err) {
      router.push("/login");
    }
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
      savingFetcher(search, auth.uuid, page, 10);
      setIsTransactionOpen(false);
      setTransactionForm({
        memberId: 0,
        memberName: "",
        formId: "",
        desc: "",
        nominal: "",
      });
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
    if (max == 0) {
      setPage(0);
    } else if (page < 1) {
      setPage(1);
    } else if (page > max) {
      setPage(max);
    }
    savingFetcher(search, auth.uuid, page, 10);
  }, [page, sort, filter]);

  useEffect(() => {
    const delay = setTimeout(() => {
      savingFetcher(search, auth.uuid, page, 10);
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
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-[300px] mb-4 sm:my-auto flex items-center">
          <form className="w-full">
            <Input
              type="text"
              id="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari anggota..."
              className="mb-3 dark:border-white/20 h-8 m-0"
            />
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-2">
              <Button
                size="icon"
                variant="outline"
                className="dark:border-white/20 h-8 w-8">
                <MixerHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Sortir</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                <DropdownMenuRadioItem value="semua">
                  Semua
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pinjaman">
                  Pinjaman dan Pelunasan
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="tabungan">
                  Tabungan dan Penarikan
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="lainnya">
                  Lainnya
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="idAsc">
                  ID terkecil
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="idDesc">
                  ID terbesar
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dateDesc">
                  Terbaru
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dateAsc">
                  Terlama
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="nominalAsc">
                  Transaksi terkecil
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="nominalDesc">
                  Transaksi terbesar
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-evenly sm:ml-auto sm:gap-2">
          <Popover
            open={isTransactionOpen}
            onOpenChange={() => setIsTransactionOpen(!isTransactionOpen)}>
            <PopoverTrigger>
              <Button size="sm" className="font-bold">
                Tambah transaksi
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="dark:bg-[#121212] sm:w-[400px] w-full">
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
                <div className="flex gap-3">
                  <Label htmlFor="firstName" className="w-1/5 my-auto truncate">
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
                    type="button"
                    size="sm"
                    className="w-1/5 font-bold"
                    onClick={memberTransactionSearch}>
                    Cari
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="lastName" className="w-1/5 my-auto">
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
                  <Label htmlFor="email" className="w-1/5 my-auto">
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
                    placeholder="Menabung uang"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-4/5"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="w-full font-bold">
                    Tambah transaksi
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
              <TableHead>ID Transaksi</TableHead>
              <TableHead>ID Anggota</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((data: any, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  {transactionsIdMaker(data.childId, data.type)}
                </TableCell>
                <TableCell>{memberIdMaker(data.memberId)}</TableCell>
                <TableCell>{data.memberName}</TableCell>
                <TableCell>{data.desc}</TableCell>
                <TableCell>{data.type}</TableCell>
                <TableCell>{`Rp${
                  data.nominal == null
                    ? `0.00`
                    : `${data.nominal.toLocaleString("id-ID")}.00`
                }`}</TableCell>
                <TableCell>{dateFormater(data.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="md:hidden flex flex-wrap my-4">
          {data.map((data: any, index: number) => (
            <div className="sm:w-1/2 w-full" key={index}>
              <Card className="mx-2 my-2 dark:bg-[#191919]">
                <CardContent className="pt-4 pb-6">
                  <div className="flex items-center">
                    <p className="ml-3 mr-1 opacity-80">
                      {`${transactionsIdMaker(data.id, data.type)}`}
                    </p>
                    <p>-</p>
                    <p className="ml-1 opacity-80">
                      {`${memberIdMaker(data.memberId)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/lorelei/jpg?seed=${data.memberName}`}
                        alt={`${data.memberName}`}
                      />
                    </Avatar>
                    <p className="text-xl font-bold">{`${data.memberName}`}</p>
                  </div>
                  <div className="flex flex-row mt-2">
                    <div className="flex flex-col text-sm sm:w-1/2 w-1/3 opacity-80">
                      <p className="truncate">Deskripsi</p>
                      <p className="truncate">Jenis</p>
                      <p className="truncate">Nominal</p>
                      <p className="truncate">Tanggal</p>
                    </div>
                    <div className="flex flex-col text-sm sm:w-1/2 w-2/3 truncate">
                      <p className="truncate">: {data.desc}</p>
                      <p className="truncate">: {data.type}</p>
                      <p className="truncate">
                        :{" "}
                        {`Rp${
                          data.nominal == null
                            ? `0.00`
                            : `${data.nominal.toLocaleString("id-ID")}.00`
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
        <div className="flex md:ml-auto md:mr-0 mx-auto gap-4">
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

function Loans() {
  const router = useRouter();
  const member = useContext(MembershipContext);
  const auth = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [length, setLength] = useState(0);
  const [page, setPage] = useState(1);
  const [max, setMax] = useState(1);
  const [loanForm, setLoanForm] = useState({
    memberId: 0,
    memberName: "",
    formId: "",
    desc: "",
    nominal: "",
  });
  const [rePaymentForm, setRePaymentForm] = useState({
    memberId: 0,
    memberName: "",
    formId: "",
    desc: "",
    nominal: "",
  });
  const [isLoanOpen, setIsLoanOpen] = useState(false);
  const [isRePaymentOpen, setIsRePaymentOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [sort, setSort] = useState("dateDesc");
  const [filter, setFilter] = useState("");

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

  function transactionsIdMaker(id: number) {
    if (id < 10) {
      return `P000` + id;
    } else if (id < 100) {
      return `P00` + id;
    } else if (id < 1000) {
      return `P0` + id;
    } else {
      return `P` + id;
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

  async function loanFetcher(
    name: string,
    uuid: string,
    page: number,
    limit: number
  ) {
    try {
      const response = await axios.post("/api/transactions/loan", {
        name,
        ownerId: uuid,
        page,
        limit,
        sort,
        filter,
      });
      setData(response.data.data);
      setLength(response.data.length);
      setMax(Math.ceil(response.data.length / limit));
    } catch (err) {
      router.push("/login");
    }
  }

  async function addLoan(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/transactions/loan/add", {
        userId: auth.uuid,
        memberId: loanForm.memberId,
        desc: loanForm.desc,
        nominal: loanForm.nominal,
      });
      loanFetcher(search, auth.uuid, page, 10);
      setIsLoanOpen(false);
      setLoanForm({
        memberId: 0,
        memberName: "",
        formId: "",
        desc: "",
        nominal: "",
      });
    } catch (err: any) {
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
    }
  }

  async function addRePayment(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/transactions/repayment/add", {
        userId: auth.uuid,
        memberId: rePaymentForm.memberId,
        desc: rePaymentForm.desc,
        nominal: rePaymentForm.nominal,
      });
      loanFetcher(search, auth.uuid, page, 10);
      setIsRePaymentOpen(false);
      setRePaymentForm({
        memberId: 0,
        memberName: "",
        formId: "",
        desc: "",
        nominal: "",
      });
    } catch (err: any) {
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
    }
  }

  async function memberLoanSearch(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/member/get", {
        ownerId: auth.uuid,
        memberId: loanForm.formId,
      });
      setLoanForm(prev => ({ ...prev, memberId: response.data.data.id }));
      setLoanForm(prev => ({
        ...prev,
        memberName: `${response.data.data.firstName} ${response.data.data.lastName}`,
      }));
      setStatus(true);
      setErrorMessage("");
    } catch (err: any) {
      setLoanForm(prev => ({ ...prev, memberId: 0 }));
      setLoanForm(prev => ({ ...prev, memberName: "" }));
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
    }
  }

  async function memberRePaymentSearch(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/member/get", {
        ownerId: auth.uuid,
        memberId: rePaymentForm.formId,
      });
      setRePaymentForm(prev => ({ ...prev, memberId: response.data.data.id }));
      setRePaymentForm(prev => ({
        ...prev,
        memberName: `${response.data.data.firstName} ${response.data.data.lastName}`,
      }));
      setStatus(true);
      setErrorMessage("");
    } catch (err: any) {
      setRePaymentForm(prev => ({ ...prev, memberId: 0 }));
      setRePaymentForm(prev => ({ ...prev, memberName: "" }));
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
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
    loanFetcher(search, auth.uuid, page, 10);
  }, [page, sort, filter]);

  useEffect(() => {
    const delay = setTimeout(() => {
      loanFetcher(search, auth.uuid, page, 10);
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
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-[300px] mb-4 sm:my-auto flex items-center">
          <form className="w-full">
            <Input
              type="text"
              id="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari anggota..."
              className="mb-3 dark:border-white/20 h-8 m-0"
            />
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-2">
              <Button
                size="icon"
                variant="outline"
                className="dark:border-white/20 h-8 w-8">
                <MixerHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Sortir</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                <DropdownMenuRadioItem value="">Semua</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Pinjaman">
                  Pinjaman
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Pelunasan">
                  Pelunasan
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="idAsc">
                  ID terkecil
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="idDesc">
                  ID terbesar
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dateDesc">
                  Terbaru
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dateAsc">
                  Terlama
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="nominalAsc">
                  Transaksi terkecil
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="nominalDesc">
                  Transaksi terbesar
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-evenly sm:ml-auto sm:gap-2">
          <Popover
            open={isLoanOpen}
            onOpenChange={() => setIsLoanOpen(!isLoanOpen)}>
            <PopoverTrigger>
              <Button size="sm" className="font-bold">
                Tambah pinjaman
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="dark:bg-[#121212] sm:w-[400px] w-full">
              <form className="flex flex-col gap-3" onSubmit={addLoan}>
                <Alert
                  variant="destructive"
                  className={`justify-center py-2 mb-4 ${
                    status ? "hidden" : "flex"
                  }`}>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                <p className="font-bold">
                  {loanForm.memberName == ""
                    ? "Nama anggota"
                    : loanForm.memberName}
                </p>
                <div className="flex gap-3">
                  <Label htmlFor="firstName" className="w-1/5 my-auto truncate">
                    ID Anggota
                  </Label>
                  <Input
                    type="number"
                    id="memberId"
                    value={loanForm.formId}
                    onChange={e =>
                      setLoanForm(prev => ({ ...prev, formId: e.target.value }))
                    }
                    placeholder="69"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-3/5"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="w-1/5 font-bold"
                    onClick={memberLoanSearch}>
                    Cari
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="lastName" className="w-1/5 my-auto">
                    Nominal
                  </Label>
                  <Input
                    type="number"
                    id="nominal"
                    value={loanForm.nominal}
                    onChange={e =>
                      setLoanForm(prev => ({
                        ...prev,
                        nominal: e.target.value,
                      }))
                    }
                    placeholder="200000"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-4/5"
                  />
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="email" className="w-1/5 my-auto">
                    Deskripsi
                  </Label>
                  <Input
                    type="text"
                    id="desc"
                    value={loanForm.desc}
                    onChange={e =>
                      setLoanForm(prev => ({ ...prev, desc: e.target.value }))
                    }
                    placeholder="Meminjam uang"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-4/5"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="w-full font-bold">
                    Tambah pinjaman
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>

          <Popover
            open={isRePaymentOpen}
            onOpenChange={() => setIsRePaymentOpen(!isRePaymentOpen)}>
            <PopoverTrigger>
              <Button size="sm" className="font-bold">
                Tambah pelunasan
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="dark:bg-[#121212] sm:w-[400px] w-full">
              <form className="flex flex-col gap-3" onSubmit={addRePayment}>
                <Alert
                  variant="destructive"
                  className={`justify-center py-2 mb-4 ${
                    status ? "hidden" : "flex"
                  }`}>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                <p className="font-bold">
                  {rePaymentForm.memberName == ""
                    ? "Nama anggota"
                    : rePaymentForm.memberName}
                </p>
                <div className="flex gap-3">
                  <Label htmlFor="firstName" className="w-1/5 my-auto truncate">
                    ID Anggota
                  </Label>
                  <Input
                    type="number"
                    id="memberId"
                    value={rePaymentForm.formId}
                    onChange={e =>
                      setRePaymentForm(prev => ({
                        ...prev,
                        formId: e.target.value,
                      }))
                    }
                    placeholder="69"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-3/5"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="w-1/5 font-bold"
                    onClick={memberRePaymentSearch}>
                    Cari
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="lastName" className="w-1/5 my-auto">
                    Nominal
                  </Label>
                  <Input
                    type="number"
                    id="nominal"
                    value={rePaymentForm.nominal}
                    onChange={e =>
                      setRePaymentForm(prev => ({
                        ...prev,
                        nominal: e.target.value,
                      }))
                    }
                    placeholder="200000"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-4/5"
                  />
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="email" className="w-1/5 my-auto">
                    Deskripsi
                  </Label>
                  <Input
                    type="text"
                    id="desc"
                    value={rePaymentForm.desc}
                    onChange={e =>
                      setRePaymentForm(prev => ({
                        ...prev,
                        desc: e.target.value,
                      }))
                    }
                    placeholder="Membayar pinjaman"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-4/5"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="w-full font-bold">
                    Tambah pelunasan
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
              <TableHead>ID Transaksi</TableHead>
              <TableHead>ID Anggota</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((data: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{transactionsIdMaker(data.id)}</TableCell>
                <TableCell>{memberIdMaker(data.memberId)}</TableCell>
                <TableCell>{data.memberName}</TableCell>
                <TableCell>{data.desc}</TableCell>
                <TableCell>{data.type}</TableCell>
                <TableCell>{`Rp${
                  data.nominal == null
                    ? `0.00`
                    : `${data.nominal.toLocaleString("id-ID")}.00`
                }`}</TableCell>
                <TableCell>{dateFormater(data.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="md:hidden flex flex-wrap my-4">
          {data.map((data: any, index: number) => (
            <div className="sm:w-1/2 w-full" key={index}>
              <Card className="mx-2 my-2 dark:bg-[#191919]">
                <CardContent className="pt-4 pb-6">
                  <div className="flex items-center">
                    <p className="ml-3 mr-1 opacity-80">
                      {`${transactionsIdMaker(data.id)}`}
                    </p>
                    <p>-</p>
                    <p className="ml-1 opacity-80">
                      {`${memberIdMaker(data.memberId)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/lorelei/jpg?seed=${data.memberName}`}
                        alt={`${data.memberName}`}
                      />
                    </Avatar>
                    <p className="text-xl font-bold">{`${data.memberName}`}</p>
                  </div>
                  <div className="flex flex-row mt-2">
                    <div className="flex flex-col text-sm sm:w-1/2 w-1/3 opacity-80">
                      <p className="truncate">Deskripsi</p>
                      <p className="truncate">Jenis</p>
                      <p className="truncate">Nominal</p>
                      <p className="truncate">Tanggal</p>
                    </div>
                    <div className="flex flex-col text-sm sm:w-1/2 w-2/3 truncate">
                      <p className="truncate">: {data.desc}</p>
                      <p className="truncate">: {data.type}</p>
                      <p className="truncate">
                        :{" "}
                        {`Rp${
                          data.nominal == null
                            ? `0.00`
                            : `${data.nominal.toLocaleString("id-ID")}.00`
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
        <div className="flex md:ml-auto md:mr-0 mx-auto gap-4">
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

function Savings() {
  const router = useRouter();
  const member = useContext(MembershipContext);
  const auth = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [length, setLength] = useState(0);
  const [page, setPage] = useState(1);
  const [max, setMax] = useState(1);
  const [savingForm, setSavingForm] = useState({
    memberId: 0,
    memberName: "",
    formId: "",
    desc: "",
    nominal: "",
  });
  const [withdrawForm, setWithdrawForm] = useState({
    memberId: 0,
    memberName: "",
    formId: "",
    desc: "",
    nominal: "",
  });
  const [isSavingOpen, setIsSavingOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState(true);
  const [sort, setSort] = useState("dateDesc");
  const [filter, setFilter] = useState("");

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

  function transactionsIdMaker(id: number) {
    if (id < 10) {
      return `T000` + id;
    } else if (id < 100) {
      return `T00` + id;
    } else if (id < 1000) {
      return `T0` + id;
    } else {
      return `T` + id;
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

  async function savingFetcher(
    name: string,
    uuid: string,
    page: number,
    limit: number
  ) {
    try {
      const response = await axios.post("/api/transactions/saving", {
        name,
        ownerId: uuid,
        page,
        limit,
        sort,
        filter,
      });
      setData(response.data.data);
      setLength(response.data.length);
      setMax(Math.ceil(response.data.length / limit));
    } catch (err) {
      router.push("/login");
    }
  }

  async function addSaving(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/transactions/saving/add", {
        userId: auth.uuid,
        memberId: savingForm.memberId,
        desc: savingForm.desc,
        nominal: savingForm.nominal,
      });
      savingFetcher(search, auth.uuid, page, 10);
      setIsSavingOpen(false);
      setSavingForm({
        memberId: 0,
        memberName: "",
        formId: "",
        desc: "",
        nominal: "",
      });
    } catch (err: any) {
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
    }
  }

  async function addWithdraw(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/transactions/withdraw/add", {
        userId: auth.uuid,
        memberId: withdrawForm.memberId,
        desc: withdrawForm.desc,
        nominal: withdrawForm.nominal,
      });
      savingFetcher(search, auth.uuid, page, 10);
      setIsWithdrawOpen(false);
      setWithdrawForm({
        memberId: 0,
        memberName: "",
        formId: "",
        desc: "",
        nominal: "",
      });
    } catch (err: any) {
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
    }
  }

  async function memberSavingSearch(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/member/get", {
        ownerId: auth.uuid,
        memberId: savingForm.formId,
      });
      setSavingForm(prev => ({ ...prev, memberId: response.data.data.id }));
      setSavingForm(prev => ({
        ...prev,
        memberName: `${response.data.data.firstName} ${response.data.data.lastName}`,
      }));
      setStatus(true);
      setErrorMessage("");
    } catch (err: any) {
      setSavingForm(prev => ({ ...prev, memberId: 0 }));
      setSavingForm(prev => ({ ...prev, memberName: "" }));
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
    }
  }

  async function memberWithdrawSearch(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/member/get", {
        ownerId: auth.uuid,
        memberId: withdrawForm.formId,
      });
      setWithdrawForm(prev => ({ ...prev, memberId: response.data.data.id }));
      setWithdrawForm(prev => ({
        ...prev,
        memberName: `${response.data.data.firstName} ${response.data.data.lastName}`,
      }));
      setStatus(true);
      setErrorMessage("");
    } catch (err: any) {
      setWithdrawForm(prev => ({ ...prev, memberId: 0 }));
      setWithdrawForm(prev => ({ ...prev, memberName: "" }));
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
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
    savingFetcher(search, auth.uuid, page, 10);
  }, [page, sort, filter]);

  useEffect(() => {
    const delay = setTimeout(() => {
      savingFetcher(search, auth.uuid, page, 10);
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
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-[300px] mb-4 sm:my-auto flex items-center">
          <form className="w-full">
            <Input
              type="text"
              id="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari anggota..."
              className="mb-3 dark:border-white/20 h-8 m-0"
            />
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-2">
              <Button
                size="icon"
                variant="outline"
                className="dark:border-white/20 h-8 w-8">
                <MixerHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Sortir</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                <DropdownMenuRadioItem value="">Semua</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Tabungan">
                  Tabungan
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Penarikan">
                  Penarikan
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="idAsc">
                  ID terkecil
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="idDesc">
                  ID terbesar
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dateDesc">
                  Terbaru
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dateAsc">
                  Terlama
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="nominalAsc">
                  Transaksi terkecil
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="nominalDesc">
                  Transaksi terbesar
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-evenly sm:ml-auto sm:gap-2">
          <Popover
            open={isSavingOpen}
            onOpenChange={() => setIsSavingOpen(!isSavingOpen)}>
            <PopoverTrigger>
              <Button size="sm" className="font-bold">
                Tambah tabungan
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="dark:bg-[#121212] sm:w-[400px] w-full">
              <form className="flex flex-col gap-3" onSubmit={addSaving}>
                <Alert
                  variant="destructive"
                  className={`justify-center py-2 mb-4 ${
                    status ? "hidden" : "flex"
                  }`}>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                <p className="font-bold">
                  {savingForm.memberName == ""
                    ? "Nama anggota"
                    : savingForm.memberName}
                </p>
                <div className="flex gap-3">
                  <Label htmlFor="firstName" className="w-1/5 my-auto truncate">
                    ID Anggota
                  </Label>
                  <Input
                    type="number"
                    id="memberId"
                    value={savingForm.formId}
                    onChange={e =>
                      setSavingForm(prev => ({
                        ...prev,
                        formId: e.target.value,
                      }))
                    }
                    placeholder="69"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-3/5"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="w-1/5 font-bold"
                    onClick={memberSavingSearch}>
                    Cari
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="lastName" className="w-1/5 my-auto">
                    Nominal
                  </Label>
                  <Input
                    type="number"
                    id="nominal"
                    value={savingForm.nominal}
                    onChange={e =>
                      setSavingForm(prev => ({
                        ...prev,
                        nominal: e.target.value,
                      }))
                    }
                    placeholder="200000"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-4/5"
                  />
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="email" className="w-1/5 my-auto">
                    Deskripsi
                  </Label>
                  <Input
                    type="text"
                    id="desc"
                    value={savingForm.desc}
                    onChange={e =>
                      setSavingForm(prev => ({ ...prev, desc: e.target.value }))
                    }
                    placeholder="Menabung uang"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-4/5"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="w-full font-bold">
                    Tambah tabungan
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>

          <Popover
            open={isWithdrawOpen}
            onOpenChange={() => setIsWithdrawOpen(!isWithdrawOpen)}>
            <PopoverTrigger>
              <Button size="sm" className="font-bold">
                Tambah penarikan
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="dark:bg-[#121212] sm:w-[400px] w-full">
              <form className="flex flex-col gap-3" onSubmit={addWithdraw}>
                <Alert
                  variant="destructive"
                  className={`justify-center py-2 mb-4 ${
                    status ? "hidden" : "flex"
                  }`}>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                <p className="font-bold">
                  {withdrawForm.memberName == ""
                    ? "Nama anggota"
                    : withdrawForm.memberName}
                </p>
                <div className="flex gap-3">
                  <Label htmlFor="firstName" className="w-1/5 my-auto truncate">
                    ID Anggota
                  </Label>
                  <Input
                    type="number"
                    id="memberId"
                    value={withdrawForm.formId}
                    onChange={e =>
                      setWithdrawForm(prev => ({
                        ...prev,
                        formId: e.target.value,
                      }))
                    }
                    placeholder="69"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-3/5"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="w-1/5 font-bold"
                    onClick={memberWithdrawSearch}>
                    Cari
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="lastName" className="w-1/5 my-auto">
                    Nominal
                  </Label>
                  <Input
                    type="number"
                    id="nominal"
                    value={withdrawForm.nominal}
                    onChange={e =>
                      setWithdrawForm(prev => ({
                        ...prev,
                        nominal: e.target.value,
                      }))
                    }
                    placeholder="200000"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-4/5"
                  />
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="email" className="w-1/5 my-auto">
                    Deskripsi
                  </Label>
                  <Input
                    type="text"
                    id="desc"
                    value={withdrawForm.desc}
                    onChange={e =>
                      setWithdrawForm(prev => ({
                        ...prev,
                        desc: e.target.value,
                      }))
                    }
                    placeholder="Penarikan tabungan"
                    className="mb-3 dark:border-white/20 h-8 m-0 w-4/5"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="w-full font-bold">
                    Tambah penarikan
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
              <TableHead>ID Transaksi</TableHead>
              <TableHead>ID Anggota</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((data: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{transactionsIdMaker(data.id)}</TableCell>
                <TableCell>{memberIdMaker(data.memberId)}</TableCell>
                <TableCell>{data.memberName}</TableCell>
                <TableCell>{data.desc}</TableCell>
                <TableCell>{data.type}</TableCell>
                <TableCell>{`Rp${
                  data.nominal == null
                    ? `0.00`
                    : `${data.nominal.toLocaleString("id-ID")}.00`
                }`}</TableCell>
                <TableCell>{dateFormater(data.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="md:hidden flex flex-wrap my-4">
          {data.map((data: any, index: number) => (
            <div className="sm:w-1/2 w-full" key={index}>
              <Card className="mx-2 my-2 dark:bg-[#191919]">
                <CardContent className="pt-4 pb-6">
                  <div className="flex items-center">
                    <p className="ml-3 mr-1 opacity-80">
                      {`${transactionsIdMaker(data.id)}`}
                    </p>
                    <p>-</p>
                    <p className="ml-1 opacity-80">
                      {`${memberIdMaker(data.memberId)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/lorelei/jpg?seed=${data.memberName}`}
                        alt={`${data.memberName}`}
                      />
                    </Avatar>
                    <p className="text-xl font-bold">{`${data.memberName}`}</p>
                  </div>
                  <div className="flex flex-row mt-2">
                    <div className="flex flex-col text-sm sm:w-1/2 w-1/3 opacity-80">
                      <p className="truncate">Deskripsi</p>
                      <p className="truncate">Jenis</p>
                      <p className="truncate">Nominal</p>
                      <p className="truncate">Tanggal</p>
                    </div>
                    <div className="flex flex-col text-sm sm:w-1/2 w-2/3 truncate">
                      <p className="truncate">: {data.desc}</p>
                      <p className="truncate">: {data.type}</p>
                      <p className="truncate">
                        :{" "}
                        {`Rp${
                          data.nominal == null
                            ? `0.00`
                            : `${data.nominal.toLocaleString("id-ID")}.00`
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
        <div className="flex md:ml-auto md:mr-0 mx-auto gap-4">
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

export const MembershipPage = { Member, Transactions, Loans, Savings };
