import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loginHandler(e: any) {
    e.preventDefault();
    try {
      const data = await axios.post(
        `/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      router.push("/dashboard");
    } catch (err: any) {
      setStatus(err.response.data.status);
      setErrorMessage(err.response.data.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex w-screen h-[80vh]">
        <div className="md:w-1/4 w-11/12 mx-auto mt-[20vh]">
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
              <form onSubmit={loginHandler}>
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
                  className="mb-6 dark:border-white/20"
                />
                <Button type="submit" className="w-full">
                  Masuk
                </Button>
              </form>
            </CardContent>
          </Card>
          <Separator className="my-4" />
          <Card className="dark:bg-[#191919]">
            <CardContent className="py-6">
              <p className="text-sm text-center">
                Belum memiliki akun?{" "}
                <Link href="/register" className="text-yellow-400">
                  Ayo Daftar
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
