"use client";

import React, { use, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { set, z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon } from "lucide-react";

type Props = {};

const formSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

const LoginForm = (props: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          form.setError("root", {
            message: error.error.message,
          });
          setIsLoading(false);
        },
      }
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Form {...form}>
        <form
          className="max-w-sm w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Card>
            <CardHeader>
              <Image src="/zeus.png" alt="Zeus Logo" width={100} height={100} />
              <CardTitle>Login to Zeus</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-center items-center">
                          <FormLabel>Password </FormLabel>
                          <Dialog>
                            <DialogTrigger asChild>
                              <p className="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:cursor-pointer">
                                Forgot your password?
                              </p>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Forgot your password?</DialogTitle>
                                <DialogDescription>
                                  If there's something wrong with your account,
                                  who you gonna call? Louis. What a surprise 🤷‍♂️
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormRootError />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <LoaderCircleIcon className="animate-spin" />}
                Login
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
