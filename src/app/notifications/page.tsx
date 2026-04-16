'use client';
import { Bell, PackageCheck, Heart, AlertTriangle, User, Briefcase } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NotificationItem = ({ icon, title, description, time, read = false }: any) => (
    <div className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${!read ? 'bg-secondary' : 'hover:bg-muted/50'}`}>
        <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
        </div>
        <div className="flex-grow">
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap self-center">
            {time}
        </div>
        {!read && <div className="w-2.5 h-2.5 rounded-full bg-primary self-center flex-shrink-0"></div>}
    </div>
);

export default function NotificationsPage() {
    const isDemo = true;

    const demoNotifications = {
        all: [
            { icon: <PackageCheck className="h-5 w-5 text-primary" />, title: 'Бронирование подтверждено', description: 'Ваш тур «Замки Мира и Несвижа» успешно забронирован.', time: '1 час назад', read: false },
            { icon: <Heart className="h-5 w-5 text-primary" />, title: 'Новинка в избранном', description: 'Отель «Минск Марриотт» добавлен в ваш список желаний.', time: '3 часа назад', read: false },
            { icon: <AlertTriangle className="h-5 w-5 text-primary" />, title: 'Изменение в бронировании', description: 'Время вылета вашего рейса в Москву изменилось.', time: 'Вчера', read: true },
            { icon: <Briefcase className="h-5 w-5 text-primary" />, title: 'Новый отзыв о вашем объекте', description: 'Пользователь оставил 5-звездочный отзыв о вашем ресторане.', time: '2 дня назад', read: true, type: 'business'},
        ],
        bookings: [
            { icon: <PackageCheck className="h-5 w-5 text-primary" />, title: 'Бронирование подтверждено', description: 'Ваш тур «Замки Мира и Несвижа» успешно забронирован.', time: '1 час назад', read: false },
             { icon: <AlertTriangle className="h-5 w-5 text-primary" />, title: 'Изменение в бронировании', description: 'Время вылета вашего рейса в Москву изменилось.', time: 'Вчера', read: true },
        ],
        favorites: [
            { icon: <Heart className="h-5 w-5 text-primary" />, title: 'Новинка в избранном', description: 'Отель «Минск Марриотт» добавлен в ваш список желаний.', time: '3 часа назад', read: false },
        ],
        business: [
             { icon: <Briefcase className="h-5 w-5 text-primary" />, title: 'Новый отзыв о вашем объекте', description: 'Пользователь оставил 5-звездочный отзыв о вашем ресторане.', time: '2 дня назад', read: true, type: 'business'},
        ]
    };


    return (
        <div className="container mx-auto max-w-4xl py-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Bell className="h-6 w-6"/>
                                Уведомления
                            </CardTitle>
                            <CardDescription>Просмотрите ваши последние оповещения.</CardDescription>
                         </div>
                        {isDemo && <span className="text-sm font-medium text-primary py-1 px-3 rounded-full bg-primary/10">Демо-режим</span>}
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all">Все</TabsTrigger>
                            <TabsTrigger value="bookings">Бронирования</TabsTrigger>
                            <TabsTrigger value="favorites">Избранное</TabsTrigger>
                            <TabsTrigger value="business">Бизнес</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="mt-4 space-y-2">
                            {demoNotifications.all.map((n, i) => <NotificationItem key={i} {...n} />)}
                        </TabsContent>
                        <TabsContent value="bookings" className="mt-4 space-y-2">
                            {demoNotifications.bookings.map((n, i) => <NotificationItem key={i} {...n} />)}
                        </TabsContent>
                        <TabsContent value="favorites" className="mt-4 space-y-2">
                           {demoNotifications.favorites.map((n, i) => <NotificationItem key={i} {...n} />)}
                        </TabsContent>
                        <TabsContent value="business" className="mt-4 space-y-2">
                           {demoNotifications.business.map((n, i) => <NotificationItem key={i} {...n} />)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}