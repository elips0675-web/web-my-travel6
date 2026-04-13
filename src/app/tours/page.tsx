'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Loader2, Search, Star } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import { aiTourRecommendations, type AiTourRecommendationsOutput } from '@/ai/flows/ai-tour-recommendations';
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const formSchema = z.object({
  destination: z.string().min(2, { message: "Пункт назначения должен содержать не менее 2 символов." }),
  dates: z.object({
    from: z.date({ required_error: "Необходима дата начала." }),
    to: z.date({ required_error: "Необходима дата окончания." }),
  }),
  interests: z.string().min(3, { message: "Опишите ваши интересы."}),
});

function TourCard({ tour }: { tour: AiTourRecommendationsOutput[0] }) {
  return (
    <Card className="flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-start gap-4">
                <CardTitle className="font-headline">{tour.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{ (tour.relevanceScore / 20).toFixed(1) }</span>
                </div>
            </div>
            <CardDescription>{tour.type}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">{tour.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
            <span className="font-bold text-lg">{tour.priceRange}</span>
            <Button asChild>
                <Link href={tour.bookingLink} target="_blank">Забронировать</Link>
            </Button>
        </CardFooter>
    </Card>
  )
}

export default function ToursPage() {
  const [recommendations, setRecommendations] = useState<AiTourRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      interests: "история, еда, архитектура",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await aiTourRecommendations({
        destination: values.destination,
        travelDates: {
          start: values.dates.from.toISOString(),
          end: values.dates.to.toISOString(),
        },
        interests: values.interests.split(',').map(i => i.trim()),
      });
      setRecommendations(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить рекомендации. Попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Поиск туров и экскурсий</CardTitle>
          <CardDescription>Найдите идеальные развлечения для вашего путешествия с помощью AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Куда вы едете?</FormLabel>
                      <FormControl>
                        <Input placeholder="Например, Рим, Италия" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Когда?</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full justify-start text-left font-normal", !field.value?.from && "text-muted-foreground")}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value?.from ? (field.value.to ? (<>{format(field.value.from, "d LLL", { locale: ru })} - {format(field.value.to, "d LLL, y", { locale: ru })}</>) : (format(field.value.from, "d LLL, y", { locale: ru }))) : (<span>Выберите даты</span>)}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar initialFocus mode="range" defaultMonth={field.value?.from} selected={{ from: field.value?.from, to: field.value?.to }} onSelect={(range) => field.onChange(range)} numberOfMonths={2} locale={ru} />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваши интересы</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Опишите через запятую, что вам интересно..." {...field} />
                    </FormControl>
                     <FormDescription>Например: история, еда, природа, шоппинг, искусство.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Найти туры
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Подбираем лучшие туры для вас...</p>
        </div>
      )}

      {recommendations && (
        <div>
          <h2 className="text-2xl font-headline font-bold mb-6 text-center">Рекомендованные туры и экскурсии</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((tour, index) => (
              <TourCard key={index} tour={tour} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
