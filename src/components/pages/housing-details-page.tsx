'use client';

import { useState, useEffect } from 'react';
import { type AiHousingRecommendationsOutput } from '@/ai/flows/ai-housing-recommendations-flow';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Check, Wifi, Wind, Tv, Utensils, ParkingCircle, ChevronLeft, Users, Minus, Plus, CalendarIcon, Search } from 'lucide-react';
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

type HousingRecommendation = AiHousingRecommendationsOutput['recommendations'][0] & { slug: string };

const amenitiesMap = [
    { name: "Free WiFi", icon: Wifi, keyword: 'wifi' },
    { name: "Air Conditioning", icon: Wind, keyword: 'conditioning' },
    { name: "TV", icon: Tv, keyword: 'tv' },
    { name: "Kitchen", icon: Utensils, keyword: 'kitchen' },
    { name: "Free Parking", icon: ParkingCircle, keyword: 'parking' },
];

function BookingWidget({ recommendation }: { recommendation: HousingRecommendation }) {
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [date, setDate] = useState<DateRange | undefined>();

    return (
        <Card className="sticky top-24 shadow-xl">
            <CardHeader>
                <div>
                    <span className="text-muted-foreground text-sm">От </span>
                    <span className="font-bold text-3xl">{recommendation.priceEstimate}</span>
                    <span className="text-muted-foreground text-sm"> / ночь</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="font-semibold">Даты</Label>
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
                <Separator />
                <div>
                    <Label className="font-semibold mb-2 block">Гости</Label>
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
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function HousingDetailsPageContent({ slug }: { slug: string }) {
    const [recommendation, setRecommendation] = useState<HousingRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

    useEffect(() => {
        const storedRecsRaw = sessionStorage.getItem('housingRecommendations');
        if (storedRecsRaw) {
            try {
                const storedRecs: HousingRecommendation[] = JSON.parse(storedRecsRaw);
                const foundRec = storedRecs.find(rec => rec.slug === slug);
                if (foundRec) {
                    setRecommendation(foundRec);
                }
            } catch (e) {
                console.error("Failed to parse housing recommendations from sessionStorage", e);
            }
        }
        setIsLoading(false);
    }, [slug]);

    if (isLoading) {
        return <PageSkeleton />;
    }

    if (!recommendation) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold">Жилье не найдено</h1>
                <p className="text-muted-foreground mt-2">Не удалось найти информацию по данному предложению.</p>
                <Button asChild className="mt-4">
                    <Link href="/housing">Вернуться к поиску</Link>
                </Button>
            </div>
        );
    }

    const mainImage = recommendation.imageUrl || `https://picsum.photos/seed/${slug}/1200/800`;
    const galleryImages = [
        `https://picsum.photos/seed/${slug}-1/600/400`,
        `https://picsum.photos/seed/${slug}-2/600/400`,
        `https://picsum.photos/seed/${slug}-3/600/400`,
        `https://picsum.photos/seed/${slug}-4/600/400`,
    ];
    const allImages = [mainImage, ...galleryImages];

    const openLightbox = (index: number) => {
        setLightboxStartIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/housing">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Назад к поиску
                    </Link>
                </Button>
                
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-2">{recommendation.name}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                        {recommendation.rating && (
                            <div className="flex items-center gap-1 font-bold">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                                <span>{recommendation.rating.toFixed(1)}</span>
                            </div>
                        )}
                        {recommendation.rating && <Separator orientation="vertical" className="h-4" />}
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{recommendation.location}</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 h-[50vh] max-h-[500px] mb-8">
                    <button onClick={() => openLightbox(0)} className="col-span-2 row-span-2 relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <Image src={mainImage} alt={recommendation.name} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={`${recommendation.type} exterior`} />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Search className="w-12 h-12 text-white" />
                        </div>
                    </button>
                    {galleryImages.slice(0, 2).map((img, i) => (
                        <button onClick={() => openLightbox(i + 1)} key={i} className="relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <Image src={img} alt={`${recommendation.name} - фото ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={`${recommendation.type} interior`} />
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
                                <CardTitle className="font-headline text-2xl">О {recommendation.type.toLowerCase()}</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-stone dark:prose-invert max-w-none">
                                <p>{recommendation.description}</p>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="amenities" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
                                <TabsTrigger value="amenities">Удобства</TabsTrigger>
                                <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                            </TabsList>
                            <TabsContent value="amenities" className="pt-6">
                                <h3 className="font-headline font-bold text-2xl mb-4">Что предлагает это место</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {amenitiesMap.map((amenity) => {
                                        const isAvailable = recommendation.pros.some(pro => pro.toLowerCase().includes(amenity.keyword)) || recommendation.description.toLowerCase().includes(amenity.keyword);
                                        return (
                                            <div key={amenity.name} className={cn("flex items-center gap-2", !isAvailable && "text-muted-foreground line-through")}>
                                                <amenity.icon className="w-5 h-5" />
                                                <span>{amenity.name}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </TabsContent>
                            <TabsContent value="reviews" className="pt-6">
                                <h3 className="font-headline font-bold text-2xl mb-4">Отзывы гостей</h3>
                                <p className="text-muted-foreground">Здесь скоро появятся отзывы.</p>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="row-start-1 lg:row-auto">
                        <BookingWidget recommendation={recommendation} />
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
