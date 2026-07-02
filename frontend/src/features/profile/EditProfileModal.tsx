"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEditProfile } from "./hooks";
import { User } from "@/types/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

const formSchema = z.object({
  bio: z.string().max(150, "Bio must be less than 150 characters").optional(),
  gender: z.enum(["male", "female", ""]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProfileModal({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.profilePicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: editProfile, isPending } = useEditProfile();
  const setAuthUser = useAuthStore((state) => state.setUser);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: user.bio || "",
      gender: user.gender || "",
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    if (values.bio) formData.append("bio", values.bio);
    if (values.gender) formData.append("gender", values.gender);
    if (selectedFile) formData.append("profilePhoto", selectedFile);

    try {
      const data = await editProfile(formData);
      setAuthUser(data.user);
      setOpen(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="secondary" className="font-semibold h-8" />}>
        Edit Profile
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-xl">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={previewUrl || ""} />
              <AvatarFallback className="text-2xl uppercase">{user.username[0]}</AvatarFallback>
            </Avatar>
            <Button 
              type="button" 
              variant="link" 
              className="text-[#0095F6] font-semibold h-auto p-0"
              onClick={() => fileInputRef.current?.click()}
            >
              Change profile photo
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileSelect} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Bio</label>
            <Textarea 
              {...register("bio")} 
              placeholder="Bio" 
              className="resize-none"
              rows={3}
              disabled={isPending}
            />
            {errors.bio && <p className="text-red-500 text-xs">{errors.bio.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Gender</label>
            <select 
              {...register("gender")} 
              className="w-full h-10 px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none"
              disabled={isPending}
            >
              <option value="" disabled className="dark:bg-zinc-900">Prefer not to say</option>
              <option value="male" className="dark:bg-zinc-900">Male</option>
              <option value="female" className="dark:bg-zinc-900">Female</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-[#0095F6] hover:bg-[#1877F2] text-white" disabled={isPending}>
            {isPending ? "Saving..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
