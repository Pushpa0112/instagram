"use client";

import { useState, useRef } from "react";
import { useUIStore } from "@/store/useUIStore";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "./hooks";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Crop } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  caption: z.string().max(2200, "Caption is too long").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePostModal() {
  const { isCreatePostOpen, toggleCreatePost } = useUIStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"square" | "original">("square");
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: createPost, isPending } = useCreatePost();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { caption: "" },
  });

  const handleClose = () => {
    if (isPending) return;
    toggleCreatePost();
    setTimeout(() => {
      setStep(1);
      setSelectedFile(null);
      setPreviewUrl(null);
      setAspectRatio("square");
      setProgress(0);
      reset();
    }, 300);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep(2);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please drop an image file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep(2);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
          setStep(2);
          break;
        }
      }
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    if (values.caption) {
      formData.append("caption", values.caption);
    }

    try {
      await createPost({
        formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        },
      });
      toast.success("Post created successfully");
      handleClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create post");
      setProgress(0);
    }
  };

  return (
    <Dialog open={isCreatePostOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl p-0 gap-0 overflow-hidden border-0" aria-describedby="create-post-description">
        <DialogHeader className="p-3 border-b dark:border-zinc-800 flex flex-row items-center justify-between space-y-0">
          {step === 2 && !isPending ? (
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => { setStep(1); setSelectedFile(null); setPreviewUrl(null); }}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
             <div className="w-8" />
          )}
          <DialogTitle className="font-semibold text-center flex-1 text-base">
            {step === 1 ? "Create new post" : isPending ? "Sharing..." : "Crop & Caption"}
          </DialogTitle>
          <DialogDescription id="create-post-description" className="hidden">
            Create a new post by uploading an image and adding a caption.
          </DialogDescription>
          {step === 2 && !isPending ? (
            <Button variant="ghost" className="text-blue-500 font-semibold hover:text-blue-600 hover:bg-transparent" onClick={handleSubmit(onSubmit)}>
              Share
            </Button>
          ) : (
            <div className="w-8" />
          )}
        </DialogHeader>

        <div className="flex flex-col min-h-[400px]">
          {step === 1 && (
            <div 
              className="flex-1 flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 focus:outline-none"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onPaste={handlePaste}
              tabIndex={0}
            >
              <ImagePlus className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4 stroke-1" />
              <p className="text-xl font-light mb-6">Drag photos and videos here</p>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="bg-[#0095F6] hover:bg-[#1877F2] text-white"
              >
                Select from computer
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileSelect} 
              />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-[60%] flex items-center justify-center bg-black aspect-square md:aspect-auto relative group">
                {previewUrl && (
                  <>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className={`w-full h-full transition-all duration-300 ${aspectRatio === "square" ? "object-cover aspect-square" : "object-contain"}`} 
                    />
                    {!isPending && (
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="rounded-full bg-black/60 hover:bg-black/80 text-white border-0"
                          onClick={() => setAspectRatio(prev => prev === "square" ? "original" : "square")}
                          title="Toggle Aspect Ratio"
                        >
                          <Crop className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="w-full md:w-[40%] flex flex-col border-l dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <form id="create-post-form" className="flex-1 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-4 flex-1">
                    <Textarea
                      placeholder="Write a caption..."
                      className="w-full border-0 focus-visible:ring-0 resize-none p-0 bg-transparent text-base"
                      rows={6}
                      disabled={isPending}
                      {...register("caption")}
                    />
                    {errors.caption && (
                      <p className="text-red-500 text-sm mt-2">{errors.caption.message}</p>
                    )}
                  </div>
                </form>
                {isPending && (
                  <div className="p-4 border-t dark:border-zinc-800 space-y-2">
                    <p className="text-xs text-center text-gray-500">Uploading {progress}%</p>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
