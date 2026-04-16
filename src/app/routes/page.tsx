'use client';

import * as React from 'react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


// Иконки
const Icons = {
    Home: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Coffee: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>,
    Gamepad: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/></svg>,
    MapPin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    Car: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/></svg>,
    Walk: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 4v6m0 0l4 4m-4-4l-4 4m4-4v6"/><circle cx="12" cy="2" r="1"/></svg>,
    Bus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="2"/><line x1="6" y1="18" x2="6" y2="21"/><line x1="18" y1="18" x2="18" y2="21"/></svg>,
    Route: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>,
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    Save: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
};

// Мок-данные с координатами Москвы
const mockData = {
    accommodation: [
        { id: 'h1', title: 'Отель "Астория"', price: 8000, rating: 4.7, coords: [55.76, 37.61], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300', type: 'Отель' },
        { id: 'h2', title: 'Лофт на Арбате', price: 4500, rating: 4.5, coords: [55.75, 37.59], image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300', type: 'Апартаменты' },
        { id: 'h3', title: 'Эко-дом Рублёвка', price: 12000, rating: 4.9, coords: [55.73, 37.25], image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=300', type: 'Дом' }
    ],
    cafes: [
        { id: 'c1', title: 'Coffee Like', price: 500, rating: 4.4, coords: [55.74, 37.58], image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300', cuisine: 'Кофейня', bestTime: '08:00-10:00' },
        { id: 'c2', title: 'Хачапурная №1', price: 1500, rating: 4.7, coords: [55.76, 37.63], image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300', cuisine: 'Грузинская', bestTime: '12:00-15:00' },
        { id: 'c3', title: 'Сыроварня', price: 2500, rating: 4.8, coords: [55.73, 37.63], image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300', cuisine: 'Русская', bestTime: '18:00-22:00' },
        { id: 'c4', title: 'Street Food', price: 800, rating: 4.3, coords: [55.78, 37.60], image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=300', cuisine: 'Фастфуд', bestTime: '12:00-18:00' }
    ],
    entertainment: [
        { id: 'e1', title: 'Картинг "Скорость"', price: 2000, rating: 4.6, coords: [55.70, 37.80], image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300', type: 'Активный отдых', duration: '1 час', bestTime: '10:00-20:00' },
        { id: 'e2', title: 'Квест "Тайна да Винчи"', price: 3500, rating: 4.8, coords: [55.74, 37.67], image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300', type: 'Квест', duration: '1.5 часа', bestTime: '10:00-23:00' },
        { id: 'e3', title: 'Океанариум', price: 1200, rating: 4.5, coords: [55.76, 37.64], image: 'https://images.unsplash.com/photo-1582967788606-a171f1080ca8?w=300', type: 'Экскурсия', duration: '2 часа', bestTime: '09:00-21:00' },
        { id: 'e4', title: 'Парк Горького', price: 0, rating: 4.9, coords: [55.73, 37.60], image: 'https://images.unsplash.com/photo-1568605114967-5b51e6a5d39c?w=300', type: 'Парк', duration: '3 часа', bestTime: '06:00-00:00' },
        { id: 'e5', title: 'Музей современного искусства', price: 800, rating: 4.7, coords: [55.75, 37.62], image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=300', type: 'Музей', duration: '2 часа', bestTime: '10:00-20:00' }
    ]
};

const categoryConfig: any = {
    accommodation: { label: 'Жильё', icon: Icons.Home, color: '#22c55e', bgClass: 'bg-green-100', textClass: 'text-green-600', maxSelect: 1 },
    cafes: { label: 'Кафе', icon: Icons.Coffee, color: '#f97316', bgClass: 'bg-orange-100', textClass: 'text-orange-600', maxSelect: 3 },
    entertainment: { label: 'Развлечения', icon: Icons.Gamepad, color: '#a855f7', bgClass: 'bg-purple-100', textClass: 'text-purple-600', maxSelect: 5 }
};

// Оптимизация маршрута (жадный алгоритм ближайшего соседа)
const optimizeRoute = (points: any[], startPoint: any) => {
    const unvisited = [...points];
    const route = [startPoint];
    let current = startPoint;

    while (unvisited.length > 0) {
        let nearest: { point: any, index: number } | null = null;
        let minDistance = Infinity;

        unvisited.forEach((point, index) => {
            const R = 6371; // Радиус Земли в км
            const dLat = (point.coords[0] - current.coords[0]) * Math.PI / 180;
            const dLon = (point.coords[1] - current.coords[1]) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(current.coords[0] * Math.PI / 180) * Math.cos(point.coords[0] * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
            
            if (distance < minDistance) {
                minDistance = distance;
                nearest = { point, index };
            }
        });

        if (nearest) {
            route.push(nearest.point);
            current = nearest.point;
            unvisited.splice(nearest.index, 1);
        }
    }
    return route;
};

// Группировка по дням
const splitByDays = (route: any[], dailyLimit = 4) => {
    if (!route || route.length === 0) return [];
    const days = [];
    let currentDay: any[] = [];
    
    route.forEach((point) => {
        if (currentDay.length >= dailyLimit) {
            days.push(currentDay);
            currentDay = [point];
        } else {
            currentDay.push(point);
        }
    });
    
    if (currentDay.length > 0) days.push(currentDay);
    return days;
};

// Карточка выбора
const SelectCard = ({ item, category, isSelected, onToggle, disabled }: any) => {
    const config = categoryConfig[category];
    
    return (
        <div 
            onClick={() => !disabled && onToggle(item)}
            className={`bg-white rounded-xl p-3 cursor-pointer border-2 transition-all duration-200 ease-in-out ${
                isSelected ? 'border-indigo-500 bg-indigo-50 scale-105' : disabled ? 'opacity-50 cursor-not-allowed border-transparent' : 'border-transparent hover:border-gray-200'
            }`}
        >
            <div className="flex gap-3">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span style={{ color: config.color }}>
                            {React.createElement(config.icon)}
                        </span>
                        <span className="text-xs text-gray-500">{category === 'cafes' ? item.cuisine : item.type}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-gray-800 truncate">{item.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-indigo-600 text-sm">{item.price.toLocaleString()} ₽</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            {item.rating}
                        </div>
                    </div>
                    {isSelected && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-indigo-600 font-medium">
                            <Icons.Check /> Выбрано
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Точка маршрута
const RoutePoint = ({ point, onRemove, travelFromPrev }: any) => {
    const getIcon = () => {
        if (point.category === 'accommodation') return <Icons.Home />;
        if (point.category === 'cafes') return <Icons.Coffee />;
        return <Icons.Gamepad />;
    };

    const getTimeInfo = () => {
        if (point.category === 'entertainment') return `⏱ ${point.duration}`;
        if (point.category === 'cafes') return `🍽 ${point.bestTime}`;
        return '🏠 Ночлег';
    };
    
    const TravelIcon = () => {
      if (!travelFromPrev) return null;
      const mode = travelFromPrev.mode || 'car';
      if (mode === 'car') return <Icons.Car />;
      if (mode === 'walk') return <Icons.Walk />;
      if (mode === 'transit') return <Icons.Bus />;
      return <Icons.Car/>;
    }

    return (
        <div className="relative pl-10 mb-4" >
             <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs font-semibold"
             >
                {point.originalIndex + 1}
             </div>
             { !point.isLast &&  <div className="absolute left-3 top-1/2 w-px h-full bg-gray-200 mt-2" /> }

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ background: categoryConfig[point.category].color }}
                        >
                            {getIcon()}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">{point.title}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{getTimeInfo()}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onRemove(point)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Icons.Trash />
                    </button>
                </div>
                
                {travelFromPrev && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">
                            <TravelIcon />
                            {travelFromPrev.minutes} мин ({travelFromPrev.distance} км)
                        </span>
                        <span className="text-xs text-gray-400">до следующей точки</span>
                    </div>
                )}
            </div>
        </div>
    );
};


const RouteMap = ({ points, transportMode, routeKey }: any) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef<any>(null);

    const initializeMap = useCallback(() => {
        if (!(window as any).ymaps || !mapRef.current) return;
        (window as any).ymaps.ready(() => {
            mapInstanceRef.current = new (window as any).ymaps.Map(mapRef.current, {
                center: [55.76, 37.61], zoom: 10, controls: ['zoomControl']
            });
        });
    }, []);

    useEffect(() => {
        if ((window as any).ymaps) initializeMap();
        return () => mapInstanceRef.current?.destroy();
    }, [initializeMap]);

    useEffect(() => {
        if (!mapInstanceRef.current || !(window as any).ymaps) return;

        mapInstanceRef.current.geoObjects.removeAll();

        if (!points || points.length === 0) return;
        
        const routeCoords = points.map((p: any) => p.coords);

        points.forEach((point: any) => {
            const config = categoryConfig[point.category];
            const placemark = new (window as any).ymaps.Placemark(point.coords, {
                balloonContent: point.title,
                iconContent: point.originalIndex + 1
            }, { preset: 'islands#circleIcon', iconColor: config.color });
            mapInstanceRef.current.geoObjects.add(placemark);
        });

        if (routeCoords.length > 1) {
            // СРАЗУ рисуем пунктирную линию как fallback
            const polyline = new (window as any).ymaps.Polyline(routeCoords, {}, {
                strokeColor: "#6366f1",
                strokeWidth: 4,
                strokeOpacity: 0.7,
                strokeStyle: 'shortdash'
            });
            mapInstanceRef.current.geoObjects.add(polyline);
            mapInstanceRef.current.setBounds(mapInstanceRef.current.geoObjects.getBounds(), { 
                checkZoomRange: true, 
                zoomMargin: 50 
            });

            const yandexRoutingMode = { car: 'auto', walk: 'pedestrian', transit: 'masstransit' }[transportMode] || 'auto';
            
            (window as any).ymaps.route(routeCoords, { mapStateAutoApply: false, routingMode: yandexRoutingMode })
            .then((builtRoute: any) => {
                    // Если API Яндекса отработало, УБИРАЕМ пунктир и СТАВИМ настоящий маршрут
                    mapInstanceRef.current.geoObjects.remove(polyline);
                    builtRoute.options.set({ strokeColor: '#6366f1', strokeWidth: 5, opacity: 0.9 });
                    builtRoute.getWayPoints().each((p: any) => p.options.set('visible', false));
                    mapInstanceRef.current.geoObjects.add(builtRoute);
                    mapInstanceRef.current.setBounds(builtRoute.getBounds(), { checkZoomRange: true, zoomMargin: 50 });
                },
                (error: any) => {
                    // Если API не сработало, пунктирная линия уже на карте. Просто выводим ошибку в консоль.
                    console.error("API маршрутизации не доступно. Отображаются пунктирные линии.", error);
                }
            );
        } else {
            mapInstanceRef.current.setCenter(routeCoords[0], 14);
        }
    }, [points, transportMode, routeKey]);

    return <div ref={mapRef} className="w-full h-full min-h-[400px] bg-gray-100" />;
};

const DynamicRouteMap = dynamic(() => Promise.resolve(RouteMap), {
  ssr: false,
});

// Главный компонент
export default function RouteBuilderPage() {
    const [selected, setSelected] = useState<{ [key: string]: any[] }>({ accommodation: [], cafes: [], entertainment: [] });
    const [transportMode, setTransportMode] = useState('car');
    const [detailedRoute, setDetailedRoute] = useState<any[]>([]);
    const [activeDay, setActiveDay] = useState<number | null>(null);
    const [showRoute, setShowRoute] = useState(false);
    const [isMapReady, setMapReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [routeTotals, setRouteTotals] = useState({distance: 0, minutes: 0});

    const toggleSelection = (category: string, item: any) => {
        setSelected(prev => {
            const current = prev[category];
            const exists = current.find(i => i.id === item.id);
            
            if (exists) {
                return { ...prev, [category]: current.filter(i => i.id !== item.id) };
            } else if (current.length < categoryConfig[category].maxSelect) {
                 return { ...prev, [category]: [...current, { ...item, category }] };
            }
            return prev;
        });
    };
    
    const buildAndCalculateRoute = useCallback(async () => {
        const allPoints = Object.values(selected).flat();
        if (allPoints.length < 2) {
            setShowRoute(false);
            setDetailedRoute([]);
            return;
        }
        
        setIsLoading(true);
        setShowRoute(true);
        setActiveDay(null);

        // 1. Оптимизация порядка точек
        const basePoint = selected.accommodation[0] || allPoints[0];
        const otherPoints = allPoints.filter(p => p.id !== basePoint.id);
        const orderedRoute = optimizeRoute(otherPoints, basePoint).map((point, index) => ({ ...point, originalIndex: index }));

        // 2. Расчет деталей маршрута через API (если карта готова)
        if (!isMapReady || !(window as any).ymaps?.route) {
            const fallbackRoute = orderedRoute.map((point, index) => (
                 index > 0 ? { ...point, travelFromPrev: null, isLast: index === orderedRoute.length - 1 } : { ...point, isLast: index === orderedRoute.length - 1 }
            ));
            setDetailedRoute(fallbackRoute);
            setRouteTotals({ distance: 0, minutes: 0 });
            setIsLoading(false);
            return;
        }
        
        const routeCoords = orderedRoute.map(p => p.coords);
        const yandexRoutingMode = { car: 'auto', walk: 'pedestrian', transit: 'masstransit' }[transportMode] || 'auto';

        try {
            const builtRoute = await (window as any).ymaps.route(routeCoords, { routingMode: yandexRoutingMode });
            
            const totalDistance = parseFloat((builtRoute.getLength() / 1000).toFixed(1));
            const totalMinutes = Math.round(builtRoute.getTime() / 60);
            setRouteTotals({ distance: totalDistance, minutes: totalMinutes });

            const newDetailedRoute = [orderedRoute[0]];
            const path = builtRoute.getPaths().get(0);
            const segments = path.getSegments();

            segments.forEach((segment: any, index: number) => {
                const distance = parseFloat((segment.getDistance() / 1000).toFixed(1));
                const minutes = Math.round(segment.getTime() / 60);
                newDetailedRoute.push({
                    ...orderedRoute[index + 1],
                    travelFromPrev: { mode: transportMode, distance, minutes }
                });
            });
            setDetailedRoute(newDetailedRoute.map((p, i) => ({...p, isLast: i === newDetailedRoute.length - 1})));

        } catch (error) {
            console.error("Ошибка API Яндекса, детали маршрута не рассчитаны:", error);
            const fallbackRoute = orderedRoute.map((point, index) => (
                index > 0 ? { ...point, travelFromPrev: null, isLast: index === orderedRoute.length - 1 } : { ...point, isLast: index === orderedRoute.length - 1 }
            ));
            setDetailedRoute(fallbackRoute);
            setRouteTotals({ distance: 0, minutes: 0 });
        } finally {
            setIsLoading(false);
        }

    }, [selected, isMapReady, transportMode]);


    const removeFromRoute = (pointToRemove: any) => {
        setSelected(prev => ({
            ...prev,
            [pointToRemove.category]: prev[pointToRemove.category].filter((p: any) => p.id !== pointToRemove.id)
        }));
    };
    
    useEffect(() => {
        if (showRoute) {
            buildAndCalculateRoute();
        }
    }, [selected, transportMode]);


    const days = useMemo(() => splitByDays(detailedRoute), [detailedRoute]);
    const totalSelected = Object.values(selected).flat().length;
    const activeRoutePoints = activeDay !== null ? (days[activeDay] || []) : detailedRoute;
    const routeKey = `${activeDay}-${transportMode}-${detailedRoute.map(p=>p.id).join('-')}`;

    return (
        <>
            <Head>
              <title>Конструктор маршрута</title>
            </Head>
            <Script 
                src="https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU&load=package.full" 
                strategy="lazyOnload"
                onLoad={() => setMapReady(true)}
            />
             <style jsx global>{`
                .day-tab.active {
                    background: #6366f1;
                    color: white;
                }
                .transport-mode.active {
                    background: #6366f1;
                    color: white;
                    border-color: #6366f1;
                }
             `}</style>

            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Icons.Route />
                            Конструктор маршрута
                        </h1>
                        <p className="text-gray-500 mt-1">Выберите жильё, места питания и развлечения, и мы построим оптимальный маршрут.</p>
                    </div>

                    <div className="space-y-6">
                        <Accordion type="single" collapsible className="w-full bg-white rounded-2xl p-5 shadow-sm">
                            {Object.keys(categoryConfig).map(category => (
                                <AccordionItem value={category} key={category}>
                                    <AccordionTrigger>
                                        <div className="flex items-center justify-between w-full pr-4">
                                            <h2 className="font-bold text-lg flex items-center gap-2">
                                                <span className={`w-8 h-8 rounded-lg ${categoryConfig[category].bgClass} ${categoryConfig[category].textClass} flex items-center justify-center`}>
                                                    {React.createElement(categoryConfig[category].icon)}
                                                </span>
                                                {categoryConfig[category].label}
                                                <span className="text-sm font-normal text-gray-400">(до {categoryConfig[category].maxSelect})</span>
                                            </h2>
                                            <span className={`text-sm font-medium ${selected[category].length >= categoryConfig[category].maxSelect ? 'text-green-600' : 'text-gray-400'}`}>
                                                {selected[category].length}/{categoryConfig[category].maxSelect}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4">
                                        <div className={`grid grid-cols-1 ${category !== 'accommodation' ? 'sm:grid-cols-2' : ''} gap-3`}>
                                            {mockData[category as keyof typeof mockData].map((item: any) => (
                                                <SelectCard
                                                    key={item.id}
                                                    item={item}
                                                    category={category}
                                                    isSelected={selected[category].some(i => i.id === item.id)}
                                                    onToggle={(i: any) => toggleSelection(category, i)}
                                                    disabled={!selected[category].some(i => i.id === item.id) && selected[category].length >= categoryConfig[category].maxSelect}
                                                />
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4">Способ передвижения</h3>
                            <div className="flex gap-2 mb-4">
                                {['walk', 'transit', 'car'].map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setTransportMode(mode)}
                                        className={`transport-mode flex-1 py-2 px-3 text-sm rounded-lg border flex items-center justify-center gap-1 transition-all ${transportMode === mode ? 'active' : 'hover:bg-gray-100'}`}
                                    >
                                        {mode === 'walk' && <><Icons.Walk /> Пешком</>}
                                        {mode === 'transit' && <><Icons.Bus /> Транспорт</>}
                                        {mode === 'car' && <><Icons.Car /> Авто</>}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={buildAndCalculateRoute}
                                disabled={totalSelected < 2 || isLoading}
                                className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                                    (totalSelected < 2 || isLoading) 
                                        ? 'bg-gray-300 cursor-not-allowed' 
                                        : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:shadow-lg'
                                }`}
                            >
                                <Icons.Route />
                                {isLoading ? 'Построение маршрута...' : (showRoute ? 'Перестроить маршрут' : 'Построить маршрут')}
                            </button>

                            {totalSelected < 2 && (
                                <p className="text-xs text-gray-400 text-center mt-2">
                                    Выберите минимум 2 точки для построения маршрута
                                </p>
                            )}
                        </div>

                        {showRoute && (
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="h-96 rounded-t-2xl overflow-hidden">
                                    {isMapReady ? <DynamicRouteMap 
                                                    points={activeRoutePoints} 
                                                    transportMode={transportMode}
                                                    routeKey={routeKey}
                                                /> : <div className='w-full h-full flex items-center justify-center text-gray-500'>Загрузка карты...</div>}
                                </div>
                                
                                {isLoading && <div className="p-5 text-center text-gray-500">Построение маршрута...</div>}

                                {!isLoading && detailedRoute.length > 0 && <div className="p-5 space-y-4">
                                    {days.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto pb-4 border-b">
                                            <button
                                                onClick={() => setActiveDay(null)}
                                                className={`day-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeDay === null ? 'active' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                            >
                                                Все дни
                                            </button>
                                            {days.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveDay(idx)}
                                                    className={`day-tab px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeDay === idx ? 'active' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                                >
                                                    День {idx + 1}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between pt-2">
                                        <h3 className="font-bold text-gray-800">
                                            {activeDay !== null ? `День ${activeDay + 1}` : 'Весь маршрут'}
                                        </h3>
                                        <div className="text-sm text-gray-500">
                                            {activeRoutePoints.length} точек
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {activeRoutePoints.map((point: any) => (
                                            <RoutePoint
                                                key={point.id}
                                                point={point}
                                                onRemove={removeFromRoute}
                                                travelFromPrev={point.travelFromPrev}
                                            />
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-500">Общее расстояние:</span>
                                            <span className="font-semibold">
                                                {routeTotals.distance || '--'} км
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-4">
                                            <span className="text-gray-500">Время в пути:</span>
                                            <span className="font-semibold">
                                                {routeTotals.minutes || '--'} мин
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <span className="text-gray-500">Примерная стоимость:</span>
                                            <span className="text-xl font-bold text-indigo-600">
                                                {detailedRoute.reduce((sum, p) => sum + p.price, 0).toLocaleString()} ₽
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                            <Icons.Save /> Сохранить маршрут
                                        </button>
                                        <button className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                                            Поделиться
                                        </button>
                                    </div>
                                </div>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}