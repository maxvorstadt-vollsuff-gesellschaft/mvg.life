"use client";

import { FormEvent } from "react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { navigate } from "../utils";

export default function LoginPage() {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");

    const router = useRouter();

    // @ts-ignore
    axios
      .postForm("https://api.mvg.life/token", {
        username: username,
        password: password,
        grant_type: "",
        scope: "",
        client_id: "",
        client_secret: "",
      })
      .then((response) => {
        localStorage.setItem("token", response.data.access_token);
        router.push("/events");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-24 py-12 bg-amber-100">
      <Card>
        <CardHeader>
          <CardTitle>MVG Login</CardTitle>
          <CardDescription>Login with your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="block">
            <Input
              type="text"
              className="block mb-4"
              name="username"
              placeholder="Username"
              required
            />
            <Input
              type="password"
              className="block mb-4"
              name="password"
              placeholder="Password"
              required
            />
            <Button variant="outline">Login</Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link className="font-mono text-amber-800" href="/">
            [go Home]
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
