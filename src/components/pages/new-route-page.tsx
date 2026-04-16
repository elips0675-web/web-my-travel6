'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, GripVertical, Loader2, Plus, Trash2, Wand2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Название должно содержать не менее 2 символов." }),
  destination: z.string().min(2, { message: "Пункт назначения должен содержать не менее 2 символов." }),
  city: z.string({ required_error: "Пожалуйста, выберите город." }),
  dates: z.object({
    from: z.date({ required_error: "Необходима дата начала." }),
    to: z.date({ required_error: "Необходима дата окончания." }),
  }),
  notes: z.string().optional(),
});

const categoryLabels: { [key: string]: string } = {
    'tours': 'Туры',
    'housing': 'Жилье',
    'restaurants': 'Кафе и рестораны',
    'activities': 'Развлечения',
    'rental-car': 'Авто'
};

// Mock data for saved items
const savedItemsData = [
    { id: 'item-1', category: 'tours', name: 'Обзорная экскурсия по Минску', content: 'Познакомьтесь с главным городом Беларуси.' },
    { id: 'item-2', category: 'housing', name: 'Отель "Минск"', content: 'Комфортабельный отель в центре города.' },
    { id: 'item-3', category: 'restaurants', name: 'Ресторан "Васильки"', content: 'Традиционная белорусская кухня.' },
    { id: 'item-4', category: 'activities', name: 'Посещение Национальной библиотеки', content: 'Смотровая площадка с панорамным видом на город.' },
];

const cityList = ["Минск", "Брест", "Гомель", "Гродно", "Могилев", "Витебск", "Бобруйск", "Париж"];

export default function NewRoutePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedItems, setSavedItems] = useState(savedItemsData);
  const [routeDays, setRouteDays] = useState<{ id: string; title: string; items: typeof savedItemsData }[]>([]);


  const destinationParam = searchParams.get("destination");
  const cityParam = searchParams.get("city");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      destination: destinationParam || "Минск, Беларусь",
      city: cityParam || undefined,
      notes: "Не забыть купить сувениры для друзей и попробовать драники."
    },
  });

   useEffect(() => {
    const fromDate = form.getValues('dates.from');
    const toDate = form.getValues('dates.to');
    if (fromDate && toDate) {
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const newRouteDays = Array.from({ length: diffDays }, (_, i) => {
        const dayDate = new Date(fromDate);
        dayDate.setDate(dayDate.getDate() + i);
        return {
          id: `day-${i + 1}`,
          title: format(dayDate, "d MMMM, EEEE", { locale: ru }),
          items: []
        };
      });
      setRouteDays(newRouteDays);
    } else {
        setRouteDays([]);
    }
  }, [form.watch('dates.from'), form.watch('dates.to')]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, routeDays);
    toast({
      title: "Маршрут сохранен!",
      description: `Ваш маршрут "${values.name}" был успешно сохранен.`,
    });
    // router.push("/routes/some-id"); // Redirect to the new route's page
  }

  const handleAiGenerate = async () => {
      setIsGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const distributedItems = [...savedItems];
      const days = [...routeDays];

      days.forEach(day => day.items = []); // Clear existing items

      let dayIndex = 0;
      while(distributedItems.length > 0) {
          const item = distributedItems.shift();
          if(item) {
              days[dayIndex].items.push(item);
              dayIndex = (dayIndex + 1) % days.length;
          }
      }

      setRouteDays(days);
      setSavedItems([]);
      setIsGenerating(false);
      toast({
          title: "Маршрут сгенерирован!",
          description: "AI-помощник распределил ваши закладки по дням. Вы можете вносить изменения."
      })
  }
  
    const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Reorder within the same list
      if (source.droppableId === 'saved-items') {
        const newItems = Array.from(savedItems);
        const [reorderedItem] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, reorderedItem);
        setSavedItems(newItems);
      } else {
        const dayId = source.droppableId;
        const newDays = [...routeDays];
        const dayIndex = newDays.findIndex(d => d.id === dayId);
        const day = newDays[dayIndex];
        const newItems = Array.from(day.items);
        const [reorderedItem] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, reorderedItem);
        day.items = newItems;
        setRouteDays(newDays);
      }
    } else {
      // Move between lists
      let sourceList;
      let destinationList;
      
      if (source.droppableId === 'saved-items') {
        sourceList = Array.from(savedItems);
      } else {
        const dayIndex = routeDays.findIndex(d => d.id === source.droppableId);
        sourceList = Array.from(routeDays[dayIndex].items);
      }

      const [movedItem] = sourceList.splice(source.index, 1);

      if (destination.droppableId === 'saved-items') {
        destinationList = Array.from(savedItems);
        destinationList.splice(destination.index, 0, movedItem);
        setSavedItems(destinationList);
      } else {
        const dayIndex = routeDays.findIndex(d => d.id === destination.droppableId);
        destinationList = Array.from(routeDays[dayIndex].items);
        destinationList.splice(destination.index, 0, movedItem);
        const newDays = [...routeDays];
        newDays[dayIndex].items = destinationList;
        setRouteDays(newDays);
      }
      
      // Update source list state
      if (source.droppableId === 'saved-items') {
        setSavedItems(sourceList);
      } else {
         const dayIndex = routeDays.findIndex(d => d.id === source.droppableId);
         const newDays = [...routeDays];
         newDays[dayIndex].items = sourceList;
         setRouteDays(newDays);
      }
    }
  };


  return (
    <div className="container mx-auto py-10">
    <DragDropContext onDragEnd={onDragEnd}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                  <h1 className="font-headline text-4xl tracking-tight">Создать новый маршрут</h1>
                  <p className="text-muted-foreground mt-2">Спланируйте свое следующее незабываемое путешествие.</p>
              </div>
              <Button size="lg" type="submit">Сохранить маршрут</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Основная информация</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Название поездки</FormLabel>
                                <FormControl>
                                    <Input placeholder="Например, Весенняя Беларусь" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Город</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Выберите город" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {cityList.map(city => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                            control={form.control}
                            name="dates"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Даты поездки</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal h-10",
                                            !field.value?.from && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value?.from ? (
                                            field.value.to ? (
                                            <>
                                                {format(field.value.from, "d LLL", { locale: ru })} -{" "}
                                                {format(field.value.to, "d LLL, y", { locale: ru })}
                                            </>
                                            ) : (
                                            format(field.value.from, "d LLL, y", { locale: ru })
                                            )
                                        ) : (
                                            <span>Выберите даты</span>
                                        )}
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={field.value?.from}
                                        selected={{ from: field.value?.from, to: field.value?.to }}
                                        onSelect={(range) => field.onChange(range)}
                                        numberOfMonths={2}
                                        locale={ru}
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            </div>
                             <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Заметки к поездке</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Любые заметки, которые вы хотите добавить к своей поездке..." className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </CardContent>
                    </Card>

                    {routeDays.length > 0 && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>План маршрута</CardTitle>
                                    <CardDescription>Распределите сохраненные места по дням.</CardDescription>
                                </div>
                                <Button variant="outline" onClick={handleAiGenerate} disabled={isGenerating || savedItems.length === 0}>
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                    Сгенерировать с AI
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-2">
                               {routeDays.map((day) => (
                                   <Droppable droppableId={day.id} key={day.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={cn("p-4 rounded-lg border-2 border-dashed transition-colors", snapshot.isDraggingOver ? 'border-primary bg-primary/5' : 'border-border')}
                                            >
                                                <h3 className="font-semibold mb-3 text-lg">{day.title}</h3>
                                                {day.items.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {day.items.map((item, index) => (
                                                            <Draggable draggableId={item.id} index={index} key={item.id}>
                                                                {(provided) => (
                                                                     <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-3 bg-background rounded-md border shadow-sm flex items-center">
                                                                        <GripVertical className="h-5 w-5 text-muted-foreground mr-3"/>
                                                                        <div className="flex-grow">
                                                                            <p className="font-medium">{item.name}</p>
                                                                            <p className="text-sm text-muted-foreground">{item.content}</p>
                                                                        </div>
                                                                        <Badge variant="outline" className="ml-4">{categoryLabels[item.category] || item.category}</Badge>
                                                                     </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6">
                                                        <p className="text-muted-foreground">Перетащите сюда элементы из ваших закладок</p>
                                                    </div>
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                   </Droppable>
                               ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit space-y-6">
                    <Card>
                         <CardHeader>
                            <CardTitle>Закладки</CardTitle>
                            <CardDescription>Сохраненные вами места и развлечения.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Droppable droppableId="saved-items">
                                {(provided, snapshot) => (
                                    <div 
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={cn("p-4 rounded-lg border-2 border-dashed min-h-[200px] space-y-2 transition-colors", snapshot.isDraggingOver ? 'border-primary bg-primary/5' : 'border-border')}
                                    >
                                    {savedItems.map((item, index) => (
                                        <Draggable draggableId={item.id} index={index} key={item.id}>
                                            {(provided) => (
                                                 <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-3 bg-background rounded-md border shadow-sm flex items-center">
                                                    <GripVertical className="h-5 w-5 text-muted-foreground mr-3"/>
                                                    <div className="flex-grow">
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-muted-foreground">{item.content}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="ml-4">{categoryLabels[item.category] || item.category}</Badge>
                                                 </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {savedItems.length === 0 && (
                                        <div className="text-center py-10">
                                            <p className="text-muted-foreground">Здесь появятся ваши закладки.</p>
                                        </div>
                                    )}
                                    </div>
                                )}
                            </Droppable>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </form>
      </Form>
    </DragDropContext>
    </div>
  );
}
