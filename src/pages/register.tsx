import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function registerHandler(e: any) {
    e.preventDefault();
    try {
      const data = await axios.post(
        `/api/auth/register`,
        { name, email, password, confirmPassword },
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

  return (
    <div>
      <Head>
        <title>Register</title>
      </Head>
      <div className="flex w-screen h-[95vh] justify-center items-center">
        <div className="sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-1/4 w-11/12">
          <p className="text-center mb-6 text-4xl font-bold">
            <Link href="/">
              Dana<span className="text-yellow-400">Ku</span>
            </Link>
          </p>
          <Card className="dark:bg-[#191919]">
            <CardContent className="py-6">
              <Alert
                variant="destructive"
                className={`justify-center py-2 mb-4 ${
                  status ? "hidden" : "flex"
                }`}>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <form onSubmit={registerHandler}>
                <Label htmlFor="name">Nama Koperasi</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                  }}
                  placeholder="Masukkan nama koperasi"
                  className="mb-3 dark:border-white/20"
                />
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
          <Card className="dark:bg-[#191919]">
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
