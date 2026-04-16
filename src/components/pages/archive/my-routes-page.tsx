'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { CalendarIcon, Search, MapPin, Star, ShieldCheck, Users, Briefcase, Award, Luggage, Home, Utensils, Gamepad2, Car, Mail, LocateIcon, Loader2 } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { AiTourRecommendationsOutput } from "@/ai/flows/ai-tour-recommendations";
import type { AiHousingRecommendationsOutput } from "@/ai/flows/ai-housing-recommendations-flow";
import type { AiRestaurantRecommendationsOutput } from "@/ai/flows/ai-restaurant-recommendations";
import type { AiActivityRecommendationsOutput } from "@/ai/flows/ai-activity-recommendations";
import type { AiRentalCarRecommendationsOutput } from "@/ai/flows/ai-rental-car-recommendations";

const searchSchema = z.object({
  destination: z.string().min(1, { message: "Обязательное поле" }),
  date: z.date().optional(),
});

function SubscriptionDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg">
                    <Mail className="mr-2 h-5 w-5" />
                    Подписаться на обновления
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Подписка на рассылку</DialogTitle>
                    <DialogDescription>
                        Получайте лучшие предложения и идеи для путешествий прямо на вашу почту.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input id="email" type="email" placeholder="name@example.com" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Подписаться</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function MyRoutesPageContent() {
    const router = useRouter();
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero-banner-kayleen');
    const whyUsImage = PlaceHolderImages.find(img => img.id === 'why-choose-us');
    const [activeTab, setActiveTab] = useState('tours');
    const [selectedCity, setSelectedCity] = useState('Минск');
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');

    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: { destination: "" },
    });

    function onSubmit(values: z.infer<typeof searchSchema>) {
        const params = new URLSearchParams();
        params.append("destination", values.destination);
        if (values.date) params.append("from", values.date.toISOString());
        router.push(`/${activeTab}?${params.toString()}`);
    }
    
    const categories = [
        { key: 'tours', label: 'Туры', icon: Luggage },
        { key: 'housing', label: 'Жилье', icon: Home },
        { key: 'restaurants', label: 'Кафе и рестораны', icon: Utensils },
        { key: 'activities', label: 'Развлечения', icon: Gamepad2 },
        { key: 'rental-car', label: 'Транспорт', icon: Car }
    ];

    const destinations = [
        { name: "Минск", image: { imageUrl: 'https://picsum.photos/seed/minsk/600/800', description: 'Минск', imageHint: 'minsk city'}},
        { name: "Брест", image: { imageUrl: 'https://picsum.photos/seed/brest/600/800', description: 'Брест', imageHint: 'brest fortress'}},
        { name: "Гомель", image: { imageUrl: 'https://picsum.photos/seed/gomel/600/800', description: 'Гомель', imageHint: 'gomel palace'}},
        { name: "Гродно", image: { imageUrl: 'https://picsum.photos/seed/grodno/600/800', description: 'Гродно', imageHint: 'grodno city'}},
        { name: "Могилев", image: { imageUrl: 'https://picsum.photos/seed/mogilev/600/800', description: 'Могилев', imageHint: 'mogilev city'}},
        { name: "Витебск", image: { imageUrl: 'https://picsum.photos/seed/vitebsk/600/800', description: 'Витебск', imageHint: 'vitebsk city'}},
        { name: "Бобруйск", image: { imageUrl: 'https://picsum.photos/seed/bobruisk/600/800', description: 'Бобруйск', imageHint: 'bobruisk city'}},
        { name: "Париж", image: PlaceHolderImages.find(img => img.id === 'destination-paris') },
    ];

    const cityList = ['Все города', ...new Set(destinations.map(d => d.name))];

    const handleDetectCity = () => {
        setIsLocating(true);
        setLocationError('');
        setTimeout(() => { // Имитация геолокации
            if (navigator.geolocation) {
                // В реальном приложении здесь будет вызов API геокодинга
                // Для примера просто выберем случайный город
                const randomCity = cityList[Math.floor(Math.random() * (cityList.length -1)) + 1]; // Исключаем "Все города"
                setSelectedCity(randomCity);
                setIsLocating(false);
            } else {
                setLocationError("Геолокация не поддерживается вашим браузером.");
                setIsLocating(false);
            }
        }, 1500);
    };

    const whyChooseUsItems = [
        { icon: ShieldCheck, title: "Гарантия лучшей цены", description: "Мы предлагаем конкурентные цены на тысячи направлений." },
        { icon: Users, title: "Поддержка клиентов 24/7", description: "Наша команда поддержки всегда готова помочь вам." },
        { icon: Briefcase, title: "Простое бронирование", description: "Интуитивно понятный процесс бронирования за несколько кликов." },
    ];
    
    const generateSlug = (name: string, index: number) => {
        const rusToLat: { [key: string]: string } = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return name.toLowerCase()
            .split('').map(char => rusToLat[char] || char).join('')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-') + `-${index}`;
    };

    const baseMockTourData: (AiTourRecommendationsOutput[0] & { location: string })[] = [
        { name: "Замки Мира и Несвижа", location: "Гродно", description: "Посетите два самых известных замка Беларуси, внесенных в список Всемирного наследия ЮНЕСКО.", type: "культурно-исторический", priceRange: "150 BYN", bookingLink: "#", relevanceScore: 98, duration: "Целый день", groupSize: "до 40 чел.", highlights: ["Мирский замок", "Несвижский дворцово-парковый комплекс", "Фарный костел в Несвиже"], included: ["Транспорт", "Услуги гида"], excluded: ["Входные билеты", "Обед"], galleryImageUrls: [ "https://picsum.photos/seed/mir-castle/800/600" ] },
        { name: "Беловежская пуща и Поместье Деда Мороза", location: "Брест", description: "Откройте для себя древнейший лес Европы, увидьте могучих зубров и загляните в гости к белорусскому Деду Морозу.", type: "природа", priceRange: "180 BYN", bookingLink: "#", relevanceScore: 95, duration: "Целый день", groupSize: "до 45 чел.", highlights: ["Вольеры с дикими животными", "Музей природы", "Поместье Деда Мороза"], included: ["Транспорт", "Услуги гида", "Входные билеты в поместье"], excluded: ["Обед", "Билеты в Музей природы"], galleryImageUrls: [ "https://picsum.photos/seed/belovezha/800/600" ]},
        { name: "Обзорная экскурсия по Минску", location: "Минск", description: "Познакомьтесь с главным городом Беларуси: от старинного Троицкого предместья до современных проспектов.", type: "обзорная", priceRange: "70 BYN", bookingLink: "#", relevanceScore: 93, duration: "4 часа", groupSize: "до 40 чел.", highlights: ["Троицкое предместье", "Остров слёз", "Проспект Независимости"], included: ["Транспорт", "Услуги гида"], excluded: ["Личные расходы"], galleryImageUrls: [ "https://picsum.photos/seed/minsk-cityscape/800/600" ]},
        { name: "Брест и Брестская крепость-герой", location: "Брест", description: "Посетите легендарную Брестскую крепость, символ стойкости и мужества, и познакомьтесь с городом Брестом.", type: "военно-исторический", priceRange: "160 BYN", bookingLink: "#", relevanceScore: 96, duration: "Целый день", groupSize: "до 45 чел.", highlights: ["Мемориальный комплекс «Брестская крепость-герой»", "Музей обороны", "Пешеходная улица Советская"], included: ["Транспорт", "Услуги гида"], excluded: ["Входные билеты в музеи", "Обед"], galleryImageUrls: [ "https://picsum.photos/seed/brest-fortress/800/600" ]}
    ];

    const popularTours = useMemo(() => {
        const toursWithSlugs = baseMockTourData.map((tour, index) => ({ ...tour, slug: generateSlug(tour.name, index) }));
        if (selectedCity === 'Все города') return toursWithSlugs;
        return toursWithSlugs.filter(tour => tour.location && tour.location.includes(selectedCity));
    }, [selectedCity]);

    const baseMockHousingData: AiHousingRecommendationsOutput = { recommendations: [ { name: "Отель 'Минск'", type: "Отель", location: "Минск", description: "Комфортабельный отель в центре города.", priceEstimate: "от 250 BYN", rating: 4.5, pros: ["Центр города", "Хороший сервис"], cons: ["Может быть шумно"], imageUrl: "https://picsum.photos/seed/minsk-hotel/800/600", }, { name: "Апартаменты 'Немига'", type: "Апартаменты", location: "Минск", description: "Стильные апартаменты на главной туристической улице.", priceEstimate: "от 300 BYN", rating: 4.8, pros: ["Отличное расположение", "Современный ремонт"], cons: ["Высокий спрос"], imageUrl: "https://picsum.photos/seed/nemiga-apts/800/600", }, { name: "Гостиница 'Беларусь'", type: "Гостиница", location: "Минск", description: "Один из символов города с панорамным лифтом и видом на реку.", priceEstimate: "от 180 BYN", rating: 4.3, pros: ["Панорамный вид", "Бассейн"], cons: ["Требуется частичная реновация"], imageUrl: "https://picsum.photos/seed/belarus-hotel/800/600", }, { name: "Брестский форт", type: "Отель", location: "Брест", description: "Отель в историческом стиле недалеко от Брестской крепости.", priceEstimate: "от 220 BYN", rating: 4.6, pros: ["Атмосфера", "Близость к крепости"], cons: ["Небольшой номерной фонд"], imageUrl: "https://picsum.photos/seed/brest-fort/800/600", } ], };
    const popularHousing = useMemo(() => {
        const housingWithSlugs = baseMockHousingData.recommendations.map((rec, index) => ({ ...rec, slug: generateSlug(rec.name, index) }));
        if (selectedCity === 'Все города') return housingWithSlugs;
        return housingWithSlugs.filter(h => h.location && h.location.includes(selectedCity));
    }, [selectedCity]);

    const baseMockRestaurantData: AiRestaurantRecommendationsOutput = { recommendations: [ { name: "Ресторан 'Васильки'", cuisine: "Белорусская", location: "Минск", description: "Сеть ресторанов с традиционной белорусской кухней и уютным интерьером.", price: "от 50 BYN", rating: 4.6, specialty: "Драники", imageUrl: "https://picsum.photos/seed/vasilki/800/600" }, { name: "Кафе 'Грюнвальд'", cuisine: "Европейская", location: "Минск", description: "Историческое кафе в центре города с классическим интерьером.", price: "от 70 BYN", rating: 4.5, specialty: "Венский шницель", imageUrl: "https://picsum.photos/seed/grunwald/800/600" }, { name: "'Журавiнка'", cuisine: "Русская, Европейская", location: "Брест", description: "Ресторан с видом на реку и живой музыкой по вечерам.", price: "от 80 BYN", rating: 4.7, specialty: "Блюда из дичи", imageUrl: "https://picsum.photos/seed/zhuravinka/800/600" } ], };
    const popularRestaurants = useMemo(() => {
        const restaurantWithSlugs = baseMockRestaurantData.recommendations.map((rec, index) => ({ ...rec, slug: generateSlug(rec.name, index) }));
        if (selectedCity === 'Все города') return restaurantWithSlugs;
        return restaurantWithSlugs.filter(r => r.location && r.location.includes(selectedCity));
    }, [selectedCity]);

    const baseMockActivityData: AiActivityRecommendationsOutput = { recommendations: [ { name: "Посещение Национальной библиотеки", type: "Достопримечательность", description: "Поднимитесь на смотровую площадку и насладитесь панорамным видом на Минск.", price: "10 BYN", location: "Минск", rating: 4.7, imageUrl: "https://picsum.photos/seed/library-minsk/800/600" }, { name: "Прогулка по Троицкому предместью", type: "Прогулка", description: "Исторический квартал Минска с живописными улочками и кафе.", price: "Бесплатно", location: "Минск", rating: 4.8, imageUrl: "https://picsum.photos/seed/troitskoe/800/600" }, { name: "Музей '5 элемент'", type: "Музей", description: "Интерактивный музей науки для детей и взрослых.", price: "25 BYN", location: "Минск", rating: 4.9, imageUrl: "https://picsum.photos/seed/5element/800/600" }, { name: "Посещение Брестской крепости", type: "Мемориал", description: "Легендарный мемориальный комплекс, символ стойкости и мужества.", price: "Бесплатно (музеи за доп. плату)", location: "Брест", rating: 4.9, imageUrl: "https://picsum.photos/seed/brest-memorial/800/600" } ], };
    const popularActivities = useMemo(() => {
        const activityWithSlugs = baseMockActivityData.recommendations.map((rec, index) => ({ ...rec, slug: generateSlug(rec.name, index) }));
        if (selectedCity === 'Все города') return activityWithSlugs;
        return activityWithSlugs.filter(a => a.location && a.location.includes(selectedCity));
    }, [selectedCity]);
    
    const baseMockCarData: AiRentalCarRecommendationsOutput = { recommendations: [ { name: "Kia Rio", type: "Эконом", supplier: "Local Rent", price: "90 BYN", rating: 4.5, features: { passengers: 5, luggage: 2, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/kiario/800/600" }, { name: "Toyota Camry", type: "Седан", supplier: "Hertz", price: "150 BYN", rating: 4.8, features: { passengers: 5, luggage: 3, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/camry/800/600" }, { name: "Renault Duster", type: "SUV", supplier: "Avis", price: "120 BYN", rating: 4.7, features: { passengers: 5, luggage: 4, transmission: "Механика", doors: 4 }, imageUrl: "https://picsum.photos/seed/duster/800/600" }, { name: "BMW 5 Series", type: "Премиум", supplier: "Sixt", price: "300 BYN", rating: 4.9, features: { passengers: 5, luggage: 3, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/bmw5/800/600" }, ], };
    const popularCars = baseMockCarData.recommendations.map((car, index) => ({ ...car, slug: generateSlug(car.name, index) }));

    return (
        <>
            <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center -mt-16">
                <Image
                    src={heroImage?.imageUrl || "https://picsum.photos/seed/kayleen-hero/1920/1080"}
                    alt={heroImage?.description || "Abstract background"}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={heroImage?.imageHint || "abstract background"}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col items-center text-white text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-extrabold font-headline !leading-tight tracking-tight">
                        Ваш Мир Удовольствий
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl text-white/80">
                        Найдите лучшие туры, отели и развлечения по всему миру, подобранные специально для вас.
                    </p>
                    
                    <div className="mt-8 w-full max-w-3xl p-4 bg-background/50 backdrop-blur-md rounded-lg">
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 md:items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="destination"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2 text-left">
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                    <Input placeholder="Куда едете?" className="pl-10 h-14 text-base bg-input border-0" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="text-left">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn("w-full justify-start text-left font-normal h-14 text-base bg-input border-0", !field.value && "text-muted-foreground")}
                                                        >
                                                            <CalendarIcon className="mr-2 h-5 w-5" />
                                                            {field.value ? format(field.value, "d LLL, y", { locale: ru }) : <span>Выберите дату</span>}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar initialFocus mode="single" selected={field.value} onSelect={field.onChange} locale={ru} />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="h-14 text-base font-bold md:col-span-1">
                                    <Search className="mr-2 h-5 w-5" />
                                    Найти
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </section>
            
            <div className="container mx-auto px-4 -mt-12 relative z-20">
                <div className="bg-background rounded-2xl shadow-xl p-4 flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-base font-medium text-muted-foreground">Город:</span>
                        {activeTab !== 'rental-car' && (
                             <Select value={selectedCity} onValueChange={setSelectedCity}>
                                <SelectTrigger className="w-auto md:w-[240px] text-base font-semibold bg-input border-0 focus:ring-2 focus:ring-primary h-11">
                                    <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                                    <SelectValue placeholder="Выберите город" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cityList.map(city => (
                                        <SelectItem key={city} value={city} className="text-base">{city}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                         <Button onClick={handleDetectCity} disabled={isLocating} variant="outline" className="h-11 text-base">
                            {isLocating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LocateIcon className="mr-2 h-5 w-5" />}
                            {isLocating ? 'Определение...' : 'Мой город'}
                        </Button>
                    </div>
                    {locationError && <div className="text-sm text-destructive font-medium">{locationError}</div>}
                </div>
            </div>

            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">Популярное в г. {selectedCity === 'Все города' ? 'Беларуси' : selectedCity}</h2>
                        <p className="text-lg text-muted-foreground">Ознакомьтесь с нашими лучшими предложениями в различных категориях.</p>
                    </div>

                    <div className="flex justify-center mb-12">
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
                           {categories.map(({ key, label, icon: Icon }) => {
                                const isActive = activeTab === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={cn('category-btn flex items-center gap-2 px-6 py-3 rounded-2xl font-medium whitespace-nowrap', {
                                            'active text-white': isActive,
                                            'bg-background text-foreground hover:bg-muted/50 border': !isActive,
                                        })}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        {activeTab === 'tours' && (
                            <div>
                                {popularTours.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {popularTours.map((tour, index) => (
                                            <Link href={`/tours/${tour.slug}`} key={index} className="group flex flex-col">
                                                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                                    <Image
                                                        src={tour.galleryImageUrls[0]}
                                                        alt={tour.name}
                                                        width={600}
                                                        height={400}
                                                        className="object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                                                        data-ai-hint={tour.type}
                                                    />
                                                    <div className="absolute top-4 right-4 flex items-center gap-1 text-sm font-bold text-white bg-black/50 px-2 py-1 rounded-md">
                                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                        <span>{(tour.relevanceScore / 20).toFixed(1)}</span>
                                                    </div>
                                                </div>
                                                <div className="pt-4">
                                                    <h3 className="font-bold font-headline text-xl mb-2 text-foreground group-hover:text-primary transition-colors">{tour.name}</h3>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-lg font-bold text-foreground">{tour.priceRange}</p>
                                                        <div className="text-sm text-muted-foreground">{tour.duration}</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-lg text-muted-foreground">К сожалению, в этом городе туров не найдено.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'housing' && (
                             <div>
                                {popularHousing.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {popularHousing.map((rec, index) => (
                                            <Link href={`/housing/${rec.slug}`} key={index} className="group flex flex-col">
                                                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                                    <Image src={rec.imageUrl || ''} alt={rec.name} width={600} height={400} className="object-cover aspect-[4/3] group-hover:scale-105 transition-transform" />
                                                    {rec.rating && rec.rating >= 4.8 && (
                                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-sm font-bold text-white bg-primary px-2 py-1 rounded">
                                                            <Award className="w-4 h-4" />
                                                            <span>Лучший выбор</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="pt-4">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold font-headline text-xl mb-1 text-foreground group-hover:text-primary transition-colors">{rec.name}</h3>
                                                        {rec.rating && (
                                                            <div className="flex items-center gap-1 text-sm font-bold text-amber-500 shrink-0">
                                                                <Star className="w-4 h-4 fill-current" />
                                                                <span>{rec.rating.toFixed(1)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">{rec.location}</p>
                                                    <p className="text-lg font-bold text-foreground">{rec.priceEstimate} <span className="text-sm font-normal text-muted-foreground">/ ночь</span></p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-lg text-muted-foreground">К сожалению, в этом городе жилья не найдено.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'restaurants' && (
                             <div>
                                {popularRestaurants.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {popularRestaurants.map((rec, index) => (
                                            <Link href={`/restaurants/${rec.slug}`} key={index} className="group flex flex-col">
                                                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                                    <Image src={rec.imageUrl || ''} alt={rec.name} width={600} height={400} className="object-cover aspect-[4/3] group-hover:scale-105 transition-transform" />
                                                </div>
                                                <div className="pt-4">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold font-headline text-xl mb-1 text-foreground group-hover:text-primary transition-colors">{rec.name}</h3>
                                                        {rec.rating && (
                                                            <div className="flex items-center gap-1 text-sm font-bold text-amber-500 shrink-0">
                                                                <Star className="w-4 h-4 fill-current" />
                                                                <span>{rec.rating.toFixed(1)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{rec.cuisine} • {rec.price}</p>
                                                </div>
                                            </Link>
                                    ))}
                                    </div>
                                 ) : (
                                    <div className="text-center py-12">
                                        <p className="text-lg text-muted-foreground">К сожалению, в этом городе ресторанов не найдено.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'activities' && (
                            <div>
                                {popularActivities.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {popularActivities.map((rec, index) => (
                                            <Link href={`/activities/${rec.slug}`} key={index} className="group flex flex-col">
                                                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                                    <Image src={rec.imageUrl || ''} alt={rec.name} width={600} height={400} className="object-cover aspect-[4/3] group-hover:scale-105 transition-transform" />
                                                    {rec.rating && (
                                                        <div className="absolute top-4 right-4 flex items-center gap-1 text-sm font-bold text-white bg-black/50 px-2 py-1 rounded-md">
                                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                            <span>{rec.rating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="pt-4">
                                                    <p className="text-sm text-muted-foreground">{rec.type}</p>
                                                    <h3 className="font-bold font-headline text-xl mb-2 text-foreground group-hover:text-primary transition-colors">{rec.name}</h3>
                                                    <p className="text-lg font-bold text-foreground">{rec.price}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-lg text-muted-foreground">К сожалению, в этом городе развлечений не найдено.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'rental-car' && (
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {popularCars.map((car, index) => (
                                        <Link href={`/rental-car/${car.slug}`} key={index} className="group flex flex-col">
                                            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                                <Image src={car.imageUrl || ''} alt={car.name} width={600} height={400} className="object-cover aspect-[4/3] group-hover:scale-105 transition-transform" />
                                            </div>
                                            <div className="pt-4">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold font-headline text-xl mb-1 text-foreground group-hover:text-primary transition-colors">{car.name}</h3>
                                                    {car.rating && (
                                                        <div className="flex items-center gap-1 text-sm font-bold text-amber-500 shrink-0">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span>{car.rating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">{car.type} • {car.features.transmission}</p>
                                                <p className="text-lg font-bold text-foreground">{car.price} <span className="text-sm font-normal text-muted-foreground">/ день</span></p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

             <section className="py-16 lg:py-24 bg-secondary">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Не пропустите лучшие предложения!</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Подпишитесь на нашу рассылку, чтобы первыми узнавать о новых турах, эксклюзивных скидках и получать вдохновение для следующих путешествий.
                    </p>
                    <SubscriptionDialog />
                </div>
            </section>

             <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                       <div className="relative aspect-[4/5] max-w-md mx-auto">
                         <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl bg-primary/30 transform -rotate-3 transition-transform group-hover:rotate-0"></div>
                         <Image
                            src={whyUsImage?.imageUrl || 'https://picsum.photos/seed/why-us/800/1000'}
                            alt={whyUsImage?.description || 'Happy traveler'}
                            width={800}
                            height={1000}
                            className="relative object-cover rounded-2xl w-full h-full shadow-2xl"
                            data-ai-hint={whyUsImage?.imageHint || 'happy traveler'}
                         />
                       </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6">Почему выбирают нас?</h2>
                            <p className="text-lg text-muted-foreground mb-8">Мы создаем незабываемые впечатления, сочетая экспертные знания и индивидуальный подход к каждому клиенту.</p>
                            <div className="space-y-6">
                                {whyChooseUsItems.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">Популярные направления</h2>
                        <p className="text-lg text-muted-foreground">Откройте для себя самые востребованные уголки мира, которые ждут вашего визита.</p>
                    </div>
                    <Carousel opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent>
                            {destinations.map((destination, index) => (
                                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                                    <div className="p-1">
                                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden group shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                            <Image
                                                src={destination.image?.imageUrl || `https://picsum.photos/seed/${destination.name}/600/800`}
                                                alt={destination.image?.description || destination.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                data-ai-hint={destination.image?.imageHint || destination.name.toLowerCase()}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                            <div className="absolute bottom-0 left-0 p-6">
                                                <h3 className="font-bold font-headline text-2xl text-white">{destination.name}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="ml-12" />
                        <CarouselNext className="mr-12" />
                    </Carousel>
                </div>
            </section>
        </>
    );
}
