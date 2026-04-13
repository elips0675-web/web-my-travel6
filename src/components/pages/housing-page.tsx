'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import Image from 'next/image';

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
import { CalendarIcon, Loader2, Search, Star, MapPin, Award, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import { aiHousingRecommendations, type AiHousingRecommendationsOutput } from '@/ai/flows/ai-housing-recommendations-flow';
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  destination: z.string().min(2, { message: "Пункт назначения должен содержать не менее 2 символов." }),
  dates: z.object({
    from: z.date({ required_error: "Необходима дата начала." }),
    to: z.date({ required_error: "Необходима дата окончания." }),
  }),
  preferences: z.string().min(3, { message: "Опишите ваши предпочтения."}),
});

function HousingCard({ recommendation, index }: { recommendation: AiHousingRecommendationsOutput['recommendations'][0], index: number }) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-xl md:flex">
      <div className="md:w-2/5 relative">
        <Image
          src={recommendation.imageUrl || `https://picsum.photos/seed/housing${index}/800/600`}
          alt={recommendation.name}
          width={800}
          height={600}
          className="object-cover h-full w-full aspect-video md:aspect-auto group-hover:scale-105 transition-transform duration-300"
          data-ai-hint="apartment interior"
        />
        {recommendation.rating && recommendation.rating >= 4.5 && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-sm font-bold text-white bg-primary px-2 py-1 rounded">
                <Award className="w-4 h-4" />
                <span>Лучший выбор</span>
            </div>
        )}
      </div>
      <div className="md:w-3/5 flex flex-col">
        <CardHeader className="flex flex-row justify-between items-start">
            <div>
                <CardDescription>{recommendation.type}</CardDescription>
                <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">{recommendation.name}</CardTitle>
            </div>
            {recommendation.rating && (
                <div className="flex flex-col items-end shrink-0 pl-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{recommendation.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">рейтинг</p>
                </div>
            )}
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1.5" />
              {recommendation.location}
          </div>
          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
          {recommendation.pros && recommendation.pros.length > 0 && (
            <div>
                <h4 className="font-semibold text-sm mb-2">Преимущества:</h4>
                <div className="flex flex-wrap gap-2">
                    {recommendation.pros.map((pro, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs bg-secondary py-1 px-2 rounded">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                            <span>{pro}</span>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="mt-auto flex items-center justify-between p-4 bg-secondary/30">
            <div>
                <span className="text-muted-foreground text-sm">От </span>
                <span className="font-bold text-xl">{recommendation.priceEstimate}</span>
                <span className="text-muted-foreground text-sm"> / ночь</span>
            </div>
            <Button>Посмотреть</Button>
        </CardFooter>
      </div>
    </Card>
  )
}

export default function HousingPageContent() {
  const [recommendations, setRecommendations] = useState<AiHousingRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      preferences: "уютно, недорого, с хорошим видом из окна, рядом с центром",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await aiHousingRecommendations({
        destination: values.destination,
        startDate: values.dates.from.toISOString().split('T')[0],
        endDate: values.dates.to.toISOString().split('T')[0],
        preferences: values.preferences,
      });
      setRecommendations(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить рекомендации по жилью. Попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Подбор жилья</CardTitle>
          <CardDescription>Найдите идеальное место для проживания с помощью AI.</CardDescription>
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
                        <Input placeholder="Например, Париж, Франция" {...field} />
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
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваши предпочтения</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Опишите, какое жилье вы ищете..." {...field} />
                    </FormControl>
                    <FormDescription>Например: отель 4*, с бассейном, тихое место, для семьи с детьми.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Найти жилье
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Подбираем лучшие варианты для вас...</p>
        </div>
      )}

      {recommendations && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-headline font-bold mb-6 text-center">Рекомендации по жилью</h2>
          <div className="space-y-6">
            {recommendations.recommendations.map((rec, index) => (
              <HousingCard key={index} recommendation={rec} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
