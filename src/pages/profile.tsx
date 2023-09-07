/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { AuthContext, MembershipContext } from "@/services/storage";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { decode } from "punycode";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const axiosToken = axios.create();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useContext(AuthContext);
  const member = useContext(MembershipContext);
  const [isLoading, setIsLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });
  const [addressForm, setAddressForm] = useState({
    villageName: "",
    subdistrict: "",
    district: "",
  });
  const [authForm, setAuthForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileStatus, setProfileStatus] = useState(true);
  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [addressStatus, setAddressStatus] = useState(true);
  const [addressErrorMessage, setAddressErrorMessage] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

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
      const data = await axios.delete(`/api/auth/logout`);
      router.push("/login");
    } catch (error) {
      router.push("/login");
    }
  }

  async function formValueHandler() {
    setProfileForm({
      firstName: auth.firstName,
      lastName: auth.lastName,
      email: auth.email,
      bio: auth.bio,
    });
    setAddressForm({
      villageName: auth.address.villageName ?? "",
      subdistrict: auth.address.subdistrict ?? "",
      district: auth.address.district ?? "",
    });
  }

  async function profileFormHandler(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/profile/profileUpdate", {
        uuid: auth.uuid,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        bio: profileForm.bio,
      });
      setProfileStatus(true);
      setProfileErrorMessage("");
      refreshToken();
      toast({
        title: "Profil berhasil diubah!",
        description: "Tekan tombol disamping untuk kembali!",
        className: "dark:bg-[#191919]",
        action: (
          <Button onClick={() => router.push("/dashboard")}>Kembali</Button>
        ),
        duration: 5000,
      });
    } catch (err: any) {
      setProfileStatus(err.response.data.status);
      setProfileErrorMessage(err.response.data.message);
    }
  }

  async function addressFormHandler(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/profile/addressUpdate", {
        uuid: auth.uuid,
        villageName: addressForm.villageName,
        subdistrict: addressForm.subdistrict,
        district: addressForm.district,
      });
      setAddressStatus(true);
      setAddressErrorMessage("");
      refreshToken();
      toast({
        title: "Alamat berhasil diubah!",
        description: "Tekan tombol disamping untuk kembali!",
        className: "dark:bg-[#191919]",
        action: (
          <Button onClick={() => router.push("/dashboard")}>Kembali</Button>
        ),
        duration: 5000,
      });
    } catch (err: any) {
      setAddressStatus(err.response.data.status);
      setAddressErrorMessage(err.response.data.message);
    }
  }

  async function passwordFormHandler(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/profile/passwordUpdate", {
        uuid: auth.uuid,
        oldPassword: authForm.oldPassword,
        newPassword: authForm.newPassword,
        confirmPassword: authForm.confirmPassword,
      });
      setPasswordStatus(true);
      setPasswordErrorMessage("");
      refreshToken();
      toast({
        title: "Kata sandi berhasil diubah!",
        description: "Tekan tombol disamping untuk kembali!",
        className: "dark:bg-[#191919]",
        action: (
          <Button onClick={() => router.push("/dashboard")}>Kembali</Button>
        ),
        duration: 5000,
      });
    } catch (err: any) {
      setPasswordStatus(err.response.data.status);
      setPasswordErrorMessage(err.response.data.message);
    }
  }

  // useEffect

  useEffect(() => {
    refreshToken();
    formValueHandler();
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
        <title>Keanggotaan</title>
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
              <Link
                href="/dashboard"
                className="opacity-80 hover:opacity-100 duration-75 ease-out">
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
                    <DropdownMenuItem className="cursor-pointer">
                      <Link
                        href="/dashboard"
                        className="block w-full opacity-80 hover:opacity-100 duration-75 ease-out">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link
                        href="/dashboard/membership"
                        className="block w-full opacity-80 hover:opacity-100 duration-75 ease-out">
                        Keanggotaan
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
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
                  <DropdownMenuItem>
                    <Link href="/settings" className="block w-full">
                      Pengaturan
                    </Link>
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
        <div className="w-full md:w-[230px]">
          <p className="text-4xl font-bold">Profil</p>
          <p className="opacity-80">Kelola pengaturan profil anda</p>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col w-full sm:w-2/5 mx-auto mt-2">
          <form onSubmit={profileFormHandler}>
            <div className="flex flex-col">
              <p className="text-xl font-bold">Profil</p>
              <p className="opacity-80">Data diri anda</p>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col mb-4">
              <Label htmlFor="firstName">Nama awal</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Gustavo"
                className="my-2"
                value={profileForm.firstName}
                onChange={e =>
                  setProfileForm(prev => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col mb-4">
              <Label htmlFor="lastName">Nama akhir</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Fring"
                className="my-2"
                value={profileForm.lastName}
                onChange={e =>
                  setProfileForm(prev => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="fring@gmail.com"
                className="my-2"
                value={profileForm.email}
                onChange={e =>
                  setProfileForm(prev => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col mb-4">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Saya adalah pengusaha ayam goreng"
                className="my-2"
                value={profileForm.bio}
                onChange={e =>
                  setProfileForm(prev => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
              />
            </div>
            <Alert
              variant="destructive"
              className={`justify-center py-2 mb-4 ${
                profileStatus ? "hidden" : "flex"
              }`}>
              <AlertDescription>{profileErrorMessage}</AlertDescription>
            </Alert>
            <Button type="submit" className="w-full mb-6">
              Ubah profil
            </Button>
          </form>
          <form onSubmit={addressFormHandler}>
            <div className="flex flex-col">
              <p className="text-xl font-bold">Alamat</p>
              <p className="opacity-80">Data alamat koperasi</p>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col mb-4">
              <Label htmlFor="villageName">Nama daerah</Label>
              <Input
                id="villageName"
                type="text"
                placeholder="Ozymandias"
                className="my-2"
                value={addressForm.villageName}
                onChange={e =>
                  setAddressForm(prev => ({
                    ...prev,
                    villageName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col mb-4">
              <Label htmlFor="subdistrict">Kecamatan</Label>
              <Input
                id="subdistrict"
                type="text"
                placeholder="Albuquerque"
                className="my-2"
                value={addressForm.subdistrict}
                onChange={e =>
                  setAddressForm(prev => ({
                    ...prev,
                    subdistrict: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col mb-4">
              <Label htmlFor="district">Kabupaten/Kota</Label>
              <Input
                id="district"
                type="text"
                placeholder="Albuquerque"
                className="my-2"
                value={addressForm.district}
                onChange={e =>
                  setAddressForm(prev => ({
                    ...prev,
                    district: e.target.value,
                  }))
                }
              />
            </div>
            <Alert
              variant="destructive"
              className={`justify-center py-2 mb-4 ${
                addressStatus ? "hidden" : "flex"
              }`}>
              <AlertDescription>{addressErrorMessage}</AlertDescription>
            </Alert>
            <Button type="submit" className="w-full mb-6">
              Ubah alamat
            </Button>
          </form>
          <form onSubmit={passwordFormHandler}>
            <div className="flex flex-col">
              <p className="text-xl font-bold">Autentikasi</p>
              <p className="opacity-80">Kelola kata sandi anda</p>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col mb-4">
              <Label htmlFor="oldPassword">Kata sandi lama</Label>
              <Input
                id="oldPassword"
                type="password"
                placeholder="Masukkan kata sandi lama"
                className="my-2"
                value={authForm.oldPassword}
                onChange={e =>
                  setAuthForm(prev => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col mb-4">
              <Label htmlFor="newPassword">Kata sandi baru</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Masukkan kata sandi baru"
                className="my-2"
                value={authForm.newPassword}
                onChange={e =>
                  setAuthForm(prev => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col mb-4">
              <Label htmlFor="confirmPassword">Konfirmasi kata sandi</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Konfirmasi kata sandi baru"
                className="my-2"
                value={authForm.confirmPassword}
                onChange={e =>
                  setAuthForm(prev => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
            </div>
            <Alert
              variant="destructive"
              className={`justify-center py-2 mb-4 ${
                passwordStatus ? "hidden" : "flex"
              }`}>
              <AlertDescription>{passwordErrorMessage}</AlertDescription>
            </Alert>
            <Button type="submit" className="w-full mb-6">
              Ubah kata sandi
            </Button>
          </form>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
