'use client';

import { useState, useEffect } from 'react';
import { type AiTourRecommendationsOutput } from '@/ai/flows/ai-tour-recommendations';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Check, Wifi, Wind, Tv, Utensils, ParkingCircle, ChevronLeft, Users, Minus, Plus, Clock, Info, CheckCircle, XCircle, Search } from 'lucide-react';
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
import { ImageLightbox } from '../image-lightbox';

type TourRecommendation = AiTourRecommendationsOutput[0] & { slug: string };

function BookingWidget({ tour }: { tour: TourRecommendation }) {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [date, setDate] = useState<Date | undefined>();

    return (
        <Card className="sticky top-24 shadow-xl">
            <CardHeader>
                <div>
                    <span className="text-muted-foreground text-sm">От </span>
                    <span className="font-bold text-3xl">{tour.priceRange}</span>
                    <span className="text-muted-foreground text-sm"> / чел.</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="font-semibold">Дата</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start font-normal mt-2">
                               {date ? date.toLocaleDateString('ru-RU') : "Выберите дату"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <Separator />
                <div>
                    <Label className="font-semibold mb-2 block">Участники</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start font-normal">
                                {adults} взрослый, {children} ребенок
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className='font-medium'>Взрослые</p>
                                        <p className='text-sm text-muted-foreground'>От 13 лет</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setAdults(v => Math.max(1, v - 1))}><Minus className="h-4 w-4" /></Button>
                                        <span className="font-bold w-4 text-center">{adults}</span>
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setAdults(v => v + 1)}><Plus className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className='font-medium'>Дети</p>
                                        <p className='text-sm text-muted-foreground'>До 12 лет</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setChildren(v => Math.max(0, v - 1))}><Minus className="h-4 w-4" /></Button>
                                        <span className="font-bold w-4 text-center">{children}</span>
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setChildren(v => v + 1)}><Plus className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2">
                <Button size="lg" className="w-full">Запросить бронирование</Button>
                <p className="text-xs text-muted-foreground text-center">С вас пока не будет взиматься плата</p>
            </CardFooter>
        </Card>
    );
}

function PageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[60vh] max-h-[550px] mb-8">
                 <Skeleton className="h-full w-full rounded-lg" />
                 <div className="hidden md:grid grid-cols-1 gap-2">
                    <Skeleton className="h-full w-full rounded-lg" />
                    <Skeleton className="h-full w-full rounded-lg" />
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-96 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function TourDetailsPageContent({ slug }: { slug: string }) {
    const [tour, setTour] = useState<TourRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

    useEffect(() => {
        const storedToursRaw = sessionStorage.getItem('tourRecommendations');
        if (storedToursRaw) {
            try {
                const storedTours: TourRecommendation[] = JSON.parse(storedToursRaw);
                const foundTour = storedTours.find(rec => rec.slug === slug);
                if (foundTour) {
                    setTour(foundTour);
                }
            } catch (e) {
                console.error("Failed to parse tour recommendations from sessionStorage", e);
            }
        }
        setIsLoading(false);
    }, [slug]);

    if (isLoading) {
        return <PageSkeleton />;
    }

    if (!tour) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold">Тур не найден</h1>
                <p className="text-muted-foreground mt-2">Не удалось найти информацию по данному предложению.</p>
                <Button asChild className="mt-4">
                    <Link href="/tours">Вернуться к поиску</Link>
                </Button>
            </div>
        );
    }
    
    const mainImage = tour.galleryImageUrls?.[0] || `https://picsum.photos/seed/${slug}/1200/800`;
    const galleryImages = tour.galleryImageUrls?.slice(1) || [
        `https://picsum.photos/seed/${slug}-1/800/600`,
        `https://picsum.photos/seed/${slug}-2/800/600`,
    ];
    const allImages = tour.galleryImageUrls && tour.galleryImageUrls.length > 0 ? tour.galleryImageUrls : [mainImage, ...galleryImages];
    const rating = (tour.relevanceScore / 20);

    const openLightbox = (index: number) => {
        setLightboxStartIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/tours">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Назад к поиску
                    </Link>
                </Button>
                
                <header className="mb-8">
                    <CardDescription className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">{tour.type}</CardDescription>
                    <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-4">{tour.name}</h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                        <div className="flex items-center gap-1 font-bold">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                            <span>{rating.toFixed(1)}</span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{tour.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>{tour.groupSize}</span>
                        </div>
                    </div>
                </header>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[60vh] max-h-[550px] mb-8">
                    <button onClick={() => openLightbox(0)} className="relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <Image src={mainImage} alt={tour.name} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint="tour landscape" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Search className="w-12 h-12 text-white" />
                        </div>
                    </button>
                    <div className="hidden md:grid grid-cols-1 gap-2">
                        {galleryImages.slice(0, 2).map((img, i) => (
                            <button onClick={() => openLightbox(i + 1)} key={i} className="relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                <Image src={img} alt={`${tour.name} - фото ${i + 2}`} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint="tour activity" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Search className="w-8 h-8 text-white" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">Основное</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-stone dark:prose-invert max-w-none">
                                <p>{tour.description}</p>
                                
                                <h3 className="font-semibold mt-6 mb-2">Ключевые моменты</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {tour.highlights.map((highlight, i) => <li key={i}>{highlight}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                        <Tabs defaultValue="included" className="w-full mt-8">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="included">Что включено</TabsTrigger>
                                <TabsTrigger value="excluded">Что не включено</TabsTrigger>
                            </TabsList>
                            <TabsContent value="included">
                                <Card>
                                    <CardContent className="pt-6">
                                        <ul className="space-y-3">
                                            {tour.included.map((item, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="excluded">
                                <Card>
                                    <CardContent className="pt-6">
                                        <ul className="space-y-3">
                                            {tour.excluded.map((item, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <XCircle className="w-5 h-5 text-destructive" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="row-start-1 lg:row-auto">
                        <BookingWidget tour={tour} />
                    </div>
                </div>
            </div>
             <ImageLightbox
                images={allImages}
                isOpen={lightboxOpen}
                onOpenChange={setLightboxOpen}
                startIndex={lightboxStartIndex}
            />
        </>
    );
}
