"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, LoginFormData } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <div className="w-full max-w-[350px] space-y-4">
        {/* Main Card */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 p-8 flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-8 font-serif italic tracking-tighter">
            Instagram
          </h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="sr-only">Email or username</Label>
              <Input 
                id="email" 
                placeholder="Phone number, username, or email" 
                className="bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 text-xs py-5"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="sr-only">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Password" 
                className="bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 text-xs py-5"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-5 rounded-lg"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Log in"}
            </Button>
          </form>
          
          <div className="flex w-full items-center my-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-zinc-800"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400 font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-zinc-800"></div>
          </div>
          
          <div className="text-center w-full">
            <Link href="#" className="text-blue-900 dark:text-blue-400 text-sm font-semibold flex justify-center items-center gap-2">
              Log in with Facebook
            </Link>
          </div>
          <div className="text-center w-full mt-4">
            <Link href="#" className="text-xs text-blue-900 dark:text-gray-400">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Signup Card */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 p-6 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
