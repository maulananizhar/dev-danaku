/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/services/storage";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const auth = useContext(AuthContext);

  async function refreshToken() {
    try {
      const response = await axios.post(
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
      router.push("/dashboard");
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function registerHandler(e: any) {
    e.preventDefault();
    try {
      const data = await axios.post(
        `/api/auth/register`,
        { firstName, lastName, email, password, confirmPassword },
        { withCredentials: true }
      );
      toast({
        title: "Akun berhasil dibuat!",
        description: "Tekan tombol disamping untuk masuk!",
        className: "dark:bg-[#191919]",
        action: <Button onClick={() => router.push("/login")}>Masuk</Button>,
        duration: 5000,
      });
    } catch (err: any) {
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
    }
  }

  useEffect(() => {
    AOS.init();
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
    <div>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/danaku.png" />
      </Head>
      <div className="flex w-screen h-[95vh] justify-center items-center">
        <div className="sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-1/4 w-11/12">
          <p className="text-center mb-6 text-4xl font-bold" data-aos="fade-up">
            <Link href="/">
              Dana<span className="text-yellow-400">Ku</span>
            </Link>
          </p>
          <Card className="dark:bg-[#191919]" data-aos="zoom-in">
            <CardContent className="py-6">
              <Alert
                variant="destructive"
                className={`justify-center py-2 mb-4 ${
                  status ? "hidden" : "flex"
                }`}>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <form onSubmit={registerHandler}>
                <Label htmlFor="name">Nama</Label>
                <div className="flex w-full">
                  <Input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={e => {
                      setFirstName(e.target.value);
                    }}
                    placeholder="Nama awal"
                    className="mb-3 dark:border-white/20 mr-2"
                  />
                  <Input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={e => {
                      setLastName(e.target.value);
                    }}
                    placeholder="Nama akhir"
                    className="mb-3 dark:border-white/20 ml-2"
                  />
                </div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Masukkan email anda"
                  className="mb-3 dark:border-white/20"
                />
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Masukkan kata sandi"
                  className="mb-3 dark:border-white/20"
                />
                <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                  }}
                  placeholder="Konfirmasi kata sandi"
                  className="mb-6 dark:border-white/20"
                />
                <Button type="submit" className="w-full">
                  Daftar
                </Button>
              </form>
            </CardContent>
          </Card>
          <Separator className="my-4" />
          <Card className="dark:bg-[#191919]" data-aos="zoom-in">
            <CardContent className="py-6">
              <p className="text-sm text-center">
                Sudah memiliki akun?{" "}
                <Link href="/login" className="text-yellow-400">
                  Ayo Masuk
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
