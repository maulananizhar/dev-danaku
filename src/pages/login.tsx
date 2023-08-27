import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";
import Link from "next/link";

export default function Login() {
  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex w-screen h-screen">
        <div className="md:w-1/4 w-11/12 mx-auto mt-[20vh]">
          <Link href="/" className="block text-center mb-6 text-4xl font-bold">
            Dana<span className="text-yellow-400">Ku</span>
          </Link>
          <Card className="dark:bg-[#191919]">
            <CardContent className="py-6">
              <form>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Masukkan email anda"
                  className="mb-4 dark:border-white/20"
                />
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  type="password"
                  id="password"
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
