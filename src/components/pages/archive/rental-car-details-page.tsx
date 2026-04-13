
'use client';

import { useState, useEffect } from 'react';
import { type AiRentalCarRecommendationsOutput } from '@/ai/flows/ai-rental-car-recommendations';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, ChevronLeft, Users, Minus, Plus, CalendarIcon, Search, Briefcase, Cog, DoorClosed, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ImageLightbox } from '../image-lightbox';

type CarRecommendation = AiRentalCarRecommendationsOutput['recommendations'][0] & { slug: string };

function BookingWidget({ car }: { car: CarRecommendation }) {
    const [date, setDate] = useState<DateRange | undefined>();

    return (
        <Card className="sticky top-24 shadow-xl">
            <CardHeader>
                <div>
                    <span className="font-bold text-3xl">{car.price}</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="font-semibold">Даты аренды</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal mt-2",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                    <>
                                        {format(date.from, "d LLL", { locale: ru })} -{" "}
                                        {format(date.to, "d LLL, y", { locale: ru })}
                                    </>
                                    ) : (
                                    format(date.from, "d LLL, y", { locale: ru })
                                    )
                                ) : (
                                    <span>Выберите даты</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                                locale={ru}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2">
                <Button size="lg" className="w-full">Забронировать</Button>
                <p className="text-xs text-muted-foreground text-center">С вас пока не будет взиматься плата</p>
            </CardFooter>
        </Card>
    );
}

function PageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="aspect-[4/3] rounded-lg hidden md:block" />
                <Skeleton className="aspect-[4/3] rounded-lg hidden md:block" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-96 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function RentalCarDetailsPageContent({ slug }: { slug: string }) {
    const [car, setCar] = useState<CarRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

    useEffect(() => {
        const storedRecsRaw = sessionStorage.getItem('rentalCarRecommendations');
        if (storedRecsRaw) {
            try {
                const storedRecs: CarRecommendation[] = JSON.parse(storedRecsRaw);
                const foundRec = storedRecs.find(rec => rec.slug === slug);
                if (foundRec) {
                    setCar(foundRec);
                }
            } catch (e) {
                console.error("Failed to parse car recommendations from sessionStorage", e);
            }
        }
        setIsLoading(false);
    }, [slug]);

    if (isLoading) {
        return <PageSkeleton />;
    }

    if (!car) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold">Транспорт не найден</h1>
                <p className="text-muted-foreground mt-2">Не удалось найти информацию по данному предложению.</p>
                <Button asChild className="mt-4">
                    <Link href="/rental-car">Вернуться к поиску</Link>
                </Button>
            </div>
        );
    }
    
    const galleryImages = [
        car.imageUrl,
        `https://picsum.photos/seed/${slug}-1/1200/800`,
        `https://picsum.photos/seed/${slug}-2/1200/800`,
        `https://picsum.photos/seed/${slug}-3/1200/800`,
    ];

    const openLightbox = (index: number) => {
        setLightboxStartIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/rental-car">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Назад к поиску
                    </Link>
                </Button>
                
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-2">{car.name}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                       <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{car.supplier}</span>
                        </div>
                        {car.rating && (
                            <>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-1 font-bold">
                                    <Star className="w-4 h-4 text-primary fill-primary" />
                                    <span>{car.rating.toFixed(1)}</span>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 h-[50vh] max-h-[500px] mb-8">
                    <button onClick={() => openLightbox(0)} className="col-span-2 row-span-2 relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <Image src={galleryImages[0]} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={`${car.type} transport exterior`} />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Search className="w-12 h-12 text-white" />
                        </div>
                    </button>
                    {galleryImages.slice(1, 3).map((img, i) => (
                        <button onClick={() => openLightbox(i + 1)} key={i} className="relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <Image src={img} alt={`${car.name} - фото ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={`${car.type} transport interior`} />
                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">Характеристики</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                                    {car.features.passengers && <div className="flex flex-col items-center gap-2">
                                        <Users className="w-8 h-8 text-primary" />
                                        <p className="font-semibold">{car.features.passengers} Пассажиров</p>
                                    </div>}
                                     {car.features.luggage && <div className="flex flex-col items-center gap-2">
                                        <Briefcase className="w-8 h-8 text-primary" />
                                        <p className="font-semibold">{car.features.luggage} Багаж</p>
                                    </div>}
                                    {car.features.transmission && <div className="flex flex-col items-center gap-2">
                                        <Cog className="w-8 h-8 text-primary" />
                                        <p className="font-semibold">{car.features.transmission}</p>
                                    </div>}
                                    {car.features.doors && <div className="flex flex-col items-center gap-2">
                                        <DoorClosed className="w-8 h-8 text-primary" />
                                        <p className="font-semibold">{car.features.doors} Двери</p>
                                    </div>}
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="reviews" className="w-full">
                            <TabsList className="grid w-full grid-cols-1 md:w-auto md:inline-flex">
                                <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                            </TabsList>
                            <TabsContent value="reviews" className="pt-6">
                                <h3 className="font-headline font-bold text-2xl mb-4">Отзывы</h3>
                                <p className="text-muted-foreground">Здесь скоро появятся отзывы.</p>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="row-start-1 lg:row-auto">
                        <BookingWidget car={car} />
                    </div>
                </div>
            </div>
            <ImageLightbox
                images={galleryImages}
                isOpen={lightboxOpen}
                onOpenChange={setLightboxOpen}
                startIndex={lightboxStartIndex}
            />
        </>
    );
}
