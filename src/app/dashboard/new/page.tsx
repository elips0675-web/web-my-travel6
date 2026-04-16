'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const businessFormSchema = z.object({
  name: z.string().min(3, { message: "Название должно быть не менее 3 символов." }),
  description: z.string().min(10, { message: "Описание должно быть не менее 10 символов." }),
  category: z.enum(["tours", "housing", "restaurants", "activities", "rental-car"]),
  location: z.string().min(3, { message: "Укажите местоположение." }),
  imageUrl: z.string().url({ message: "Пожалуйста, введите действительный URL изображения." }),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

const categoryLabels = {
    tours: 'Туры',
    housing: 'Жилье',
    restaurants: 'Кафе и рестораны',
    activities: 'Развлечения',
    'rental-car': 'Транспорт'
};

export default function NewBusinessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      imageUrl: "",
    },
  });

  async function onSubmit(data: BusinessFormValues) {
    toast({
        title: "Функция в разработке",
        description: "Эта форма пока не работает.",
    });
  }

  return (
    <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Добавить новый бизнес</CardTitle>
                <CardDescription>Заполните информацию о вашем предложении.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Название</FormLabel>
                                <FormControl>
                                    <Input placeholder="Название вашего тура, отеля, ресторана..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Категория</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите категорию" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.entries(categoryLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Описание</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Расскажите подробнее о вашем предложении..."
                                        rows={5}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Местоположение</FormLabel>
                                <FormControl>
                                    <Input placeholder="Город, адрес" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL изображения</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/image.png" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Добавьте ссылку на главное изображение.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Добавить бизнес
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
