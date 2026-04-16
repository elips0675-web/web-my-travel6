'use client';

import { Loader2, PlusCircle, Building, BarChart2, MessageSquare, AlertTriangle, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';
import Image from 'next/image';


interface Business {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl: string;
}

export default function DashboardPage() {
    const userBusinesses: Business[] = []; 
    const isLoading = false;

    const isDemo = true;

    const mockBusinesses: Business[] = [
        {
            id: 'demo-1',
            name: 'Тур "Замки Мира и Несвижа"',
            description: 'Посетите два самых известных замка Беларуси, внесенных в список Всемирного наследия ЮНЕСКО.',
            category: 'tours',
            imageUrl: 'https://picsum.photos/seed/mir-castle/600/400'
        },
        {
            id: 'demo-2',
            name: 'Апартаменты "Уютный лофт"',
            description: 'Современные апартаменты в центре города с прекрасным видом. Идеально для деловых поездок и отдыха.',
            category: 'housing',
            imageUrl: 'https://picsum.photos/seed/loft-apartment/600/400'
        },
        {
            id: 'demo-3',
            name: 'Ресторан "Старый город"',
            description: 'Насладитесь блюдами национальной кухни в уютной атмосфере исторического центра.',
            category: 'restaurants',
            imageUrl: 'https://picsum.photos/seed/old-town-resto/600/400'
        },
         {
            id: 'demo-4',
            name: 'Прокат велосипедов "Крути педали"',
            description: 'Откройте город с новой стороны! Большой выбор велосипедов для всей семьи.',
            category: 'activities',
            imageUrl: 'https://picsum.photos/seed/bike-rental/600/400'
        },
        {
            id: 'demo-5',
            name: 'Аренда авто "Быстрые колеса"',
            description: 'Надежные автомобили для ваших путешествий. Широкий модельный ряд и выгодные тарифы.',
            category: 'rental-car',
            imageUrl: 'https://picsum.photos/seed/car-fast/600/400'
        }
    ];

    const businessesToDisplay = isDemo ? mockBusinesses : userBusinesses;

    if (isLoading) {
        return (
            <div className="flex h-full min-h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
                    <p className="text-lg text-muted-foreground">Управляйте вашим бизнесом и предложениями</p>
                </div>
                <Button size="lg">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Добавить новый объект
                </Button>
            </div>

            {isDemo && (
                <Alert className="mb-6 bg-blue-50 border-blue-200">
                    <AlertTriangle className="h-4 w-4 !text-blue-600" />
                    <AlertTitle className="text-blue-800">Демонстрационный режим</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        Вы видите примеры объектов, так как вы не вошли в систему или еще не добавили ни одного бизнес-объекта. Войдите и добавьте свой первый объект, чтобы начать!
                    </AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="manage">
                <TabsList className="grid w-full sm:w-auto sm:grid-cols-3 mb-4 max-w-lg">
                    <TabsTrigger value="manage">Управление</TabsTrigger>
                    <TabsTrigger value="analytics">Аналитика</TabsTrigger>
                    <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                </TabsList>

                <TabsContent value="manage">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businessesToDisplay.map(business => (
                            <Card key={business.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
                                <div className="relative h-48 w-full">
                                    <Image src={business.imageUrl} alt={business.name} fill className="object-cover"/>
                                    <div className="absolute top-2 right-2 bg-secondary/80 text-secondary-foreground text-xs font-bold uppercase px-2 py-1 rounded-full backdrop-blur-sm">
                                        {business.category}
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl">{business.name}</CardTitle>
                                    <CardDescription className="line-clamp-2 h-[2.5em]">{business.description}</CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto flex justify-between gap-2">
                                    <Button variant="outline">Редактировать</Button>
                                    <Button variant="secondary" className="flex-grow">Управлять</Button>
                                </CardFooter>
                            </Card>
                        ))}
                         <Card className="border-2 border-dashed bg-muted/50 hover:border-primary/50 transition-colors flex flex-col items-center justify-center text-center p-6 min-h-[300px]">
                           <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4">
                               <PlusCircle className="w-8 h-8 text-muted-foreground"/>
                           </div>
                            <h3 className="text-lg font-semibold">Добавить новый бизнес</h3>
                            <p className="text-sm text-muted-foreground mt-1">Нажмите, чтобы создать новый тур, отель, ресторан или другую услугу.</p>
                            <Button variant="outline" className="mt-4">Добавить</Button>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="analytics">
                     <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg bg-muted/50">
                        <BarChart2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold">Аналитика скоро появится</h3>
                        <p className="text-muted-foreground mt-1 max-w-sm">Мы работаем над добавлением подробной статистики по просмотрам, бронированиям и доходам.</p>
                    </div>
                </TabsContent>

                <TabsContent value="reviews">
                     <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg bg-muted/五十">
                        <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold">Здесь будут ваши отзывы</h3>
                        <p className="text-muted-foreground mt-1 max-w-sm">Отвечайте на отзывы клиентов, чтобы повысить их лояльность и улучшить свой рейтинг.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}