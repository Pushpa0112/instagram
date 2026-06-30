"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, RegisterFormData } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const { mutate: registerUser, isPending } = useRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <div className="w-full max-w-[350px] space-y-4">
        {/* Main Card */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 p-8 flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4 font-serif italic tracking-tighter">
            Instagram
          </h1>
          <p className="text-gray-500 font-semibold text-center mb-6 text-[15px]">
            Sign up to see photos and videos from your friends.
          </p>
          
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-5 rounded-lg mb-4 flex gap-2 items-center justify-center"
          >
            Log in with Facebook
          </Button>
          
          <div className="flex w-full items-center mb-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-zinc-800"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400 font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-zinc-800"></div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email" className="sr-only">Email address</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="Email address" 
                className="bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 text-xs py-5"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="username" className="sr-only">Username</Label>
              <Input 
                id="username" 
                placeholder="Username" 
                className="bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 text-xs py-5"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username.message}</p>
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
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-1 pb-2">
              <Label htmlFor="confirmPassword" className="sr-only">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirm Password" 
                className="bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 text-xs py-5"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <p className="text-xs text-gray-500 text-center mb-4 leading-relaxed">
              People who use our service may have uploaded your contact information to Instagram. <Link href="#" className="text-blue-900 dark:text-blue-400">Learn More</Link>
              <br/><br/>
              By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
            </p>

            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-5 rounded-lg"
              disabled={isPending}
            >
              {isPending ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 p-6 text-center">
          <p className="text-sm">
            Have an account?{" "}
            <Link href="/login" className="text-blue-500 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
