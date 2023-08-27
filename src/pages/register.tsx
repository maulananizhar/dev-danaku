import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";
import Link from "next/link";

export default function Register() {
  return (
    <div>
      <Head>
        <title>Register</title>
      </Head>
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-1/4 w-11/12">
          <Link href="/" className="block text-center mb-6 text-4xl font-bold">
            Dana<span className="text-yellow-400">Ku</span>
          </Link>
          <Card className="dark:bg-[#191919]">
            <CardContent className="py-6">
              <form>
                <Label htmlFor="name">Nama Koperasi</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Masukkan nama koperasi"
                  className="mb-4 dark:border-white/20"
                />
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
                  className="mb-4 dark:border-white/20"
                />
                <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                <Input
                  type="password"
                  id="confirmPassword"
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
    </div>
  );
}
