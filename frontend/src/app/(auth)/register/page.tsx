"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { registerSchema, RegisterFormData } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/hooks";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const { mutate: registerMutation, isPending } = useRegister();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black py-10">
      <div className="w-full max-w-[350px] flex flex-col gap-3">
        <div className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 p-8 flex flex-col items-center">
          <h1 className="font-serif text-4xl mb-4 mt-4 italic font-semibold tracking-tighter">Instagram</h1>
          <p className="text-center font-semibold text-gray-500 dark:text-gray-400 mb-6 text-base leading-5">
            Sign up to see photos and videos from your friends.
          </p>

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
                placeholder="Username" 
                {...register("username")} 
                className="bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 focus-visible:ring-gray-400 h-10 text-xs rounded-sm"
              />
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
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
            
            <div>
              <Input 
                type="password"
                placeholder="Confirm Password" 
                {...register("confirmPassword")} 
                className="bg-gray-50 dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 focus-visible:ring-gray-400 h-10 text-xs rounded-sm"
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="text-xs text-center text-gray-500 dark:text-gray-400 my-4 px-2">
              People who use our service may have uploaded your contact information to Instagram.
            </div>

            <Button 
              type="submit" 
              className="w-full font-semibold bg-[#0095F6] hover:bg-[#1877F2] text-white rounded-lg h-8"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
            </Button>
          </form>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 p-5 text-center">
          <p className="text-sm">
            Have an account?{" "}
            <Link href="/login" className="font-semibold text-[#0095F6] hover:text-[#1877F2]">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
