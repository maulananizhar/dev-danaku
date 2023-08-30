import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useContext, useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { AuthContext, MembershipContext } from "@/services/storage";
import { useRouter } from "next/router";
import { Alert, AlertDescription } from "@/components/ui/alert";

function Member({ uuid, firstName, lastName, email, setData }: any) {
  const auth = useContext(AuthContext);
  const member = useContext(MembershipContext);
  const router = useRouter();
  const [form, setForm] = useState({
    firstName,
    lastName,
    email,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState(true);

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
    } catch (err) {
      router.push("/login");
    }
  }

  async function updateMember(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/member/update", {
        ownerId: auth.uuid,
        memberId: uuid,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      });
      memberFetcher(member.search, auth.uuid, member.page, 10);
      setIsOpen(false);
      setStatus(true);
    } catch (err: any) {
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
      console.log(err);
    }
  }

  async function deleteMember() {
    try {
      setIsOpen(false);
      const response = await axios.post("/api/member/delete", {
        memberId: uuid,
      });
      memberFetcher(member.search, auth.uuid, member.page, 10);
      setStatus(true);
    } catch (err) {
      setStatus(true);
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <PopoverTrigger>
        <Button
          size="icon"
          variant="ghost"
          className="font-bold dark:text-white"
          onClick={() => setForm({ firstName, lastName, email })}>
          <DotsVerticalIcon className="" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="dark:bg-[#121212] w-[350px]">
        <form className="flex flex-col gap-3" onSubmit={updateMember}>
          <Alert
            variant="destructive"
            className={`justify-center py-2 mb-4 ${
              status ? "hidden" : "flex"
            }`}>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/lorelei/jpg?seed=${firstName}${lastName}`}
                alt={`${firstName}${lastName}`}
              />
            </Avatar>
            <p className="my-auto font-bold text-lg">{`${firstName} ${lastName}`}</p>
          </div>
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
            <Button type="submit" size="sm" className="w-1/2 font-bold">
              Ubah data
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="w-1/2 font-bold"
              onClick={deleteMember}>
              Hapus anggota
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export const PopoverForm = { Member };
