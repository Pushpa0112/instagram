"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { loginSchema, LoginFormData } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      {/* Desktop Side Branding Placeholder */}
      <div className="hidden lg:flex flex-col justify-center items-center mr-8">
        <div className="relative w-[380px] h-[581px] bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-[2.5rem] border-8 border-gray-900 shadow-2xl flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-50 mix-blend-overlay"></div>
           <div className="z-10 text-white font-serif italic text-3xl opacity-80 mix-blend-overlay font-bold">Insta Clone</div>
        </div>
      </div>

      <div className="w-full max-w-[350px] flex flex-col gap-3">
        <div className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 p-8 flex flex-col items-center">
          <h1 className="font-serif text-4xl mb-8 mt-4 italic font-semibold tracking-tighter">Instagram</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div>
              <Input 
                placeholder="Email" 
                {...register("email")} 
                className="bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 focus-visible:ring-gray-400 h-10 text-xs rounded-sm"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <Input 
                type="password"
                placeholder="Password" 
                {...register("password")} 
                className="bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 focus-visible:ring-gray-400 h-10 text-xs rounded-sm"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full font-semibold bg-[#0095F6] hover:bg-[#1877F2] text-white rounded-lg h-8 mt-2"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
            </Button>
          </form>

          <div className="flex items-center w-full my-4">
            <div className="flex-1 h-px bg-gray-300 dark:bg-zinc-800"></div>
            <span className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">OR</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-zinc-800"></div>
          </div>
          
          <Link href="#" className="text-sm font-semibold text-blue-900 dark:text-blue-400 mt-2">
            Forgot password?
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 p-5 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-[#0095F6] hover:text-[#1877F2]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
