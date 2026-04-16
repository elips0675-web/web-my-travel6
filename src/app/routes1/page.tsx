'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { Home, Coffee, Gamepad, Car, Footprints, Bus, Route, Check, Trash2, Save, Share2, Locate, Star, MapPin, Filter, Loader } from 'lucide-react';

// ======================== ИКОНКИ ========================
const Icons = {
    Home: () => <Home size={16} />,
    Coffee: () => <Coffee size={16} />,
    Gamepad: () => <Gamepad size={16} />,
    Car: () => <Car size={16} />,
    Walk: () => <Footprints size={14} />,
    Bus: () => <Bus size={14} />,
    Route: () => <Route size={18} />,
    Check: () => <Check size={16} />,
    Trash: () => <Trash2 size={14} />,
    Save: () => <Save size={16} />,
    Share: () => <Share2 size={16} />,
    Location: () => <Locate size={16} />,
    Star: () => <Star size={14} fill="currentColor" />,
    MapPin: () => <MapPin size={14} />,
    Filter: () => <Filter size={18} />,
    Loader: () => <Loader size={16} className="animate-spin" />
};

// ======================== ГОРОДА ========================
const CITIES: Record<string, { name: string; center: [number, number]; radius: number }> = {
    moscow: { name: 'Москва', center: [55.7558, 37.6176], radius: 0.04 },
    spb: { name: 'Санкт-Петербург', center: [59.9343, 30.3351], radius: 0.04 },
    kazan: { name: 'Казань', center: [55.7961, 49.1064], radius: 0.04 },
    sochi: { name: 'Сочи', center: [43.5855, 39.7231], radius: 0.03 },
    ekaterinburg: { name: 'Екатеринбург', center: [56.8389, 60.6057], radius: 0.04 }
};

const randomOffset = (center: [number, number], radius: number) => [center[0] + (Math.random() - 0.5) * radius, center[1] + (Math.random() - 0.5) * radius] as [number, number];

// Генерация данных под город (жильё, кафе, развлечения)
const generateCityData = (cityKey: string) => {
    const city = CITIES[cityKey];
    if (!city) return { accommodation: [], cafes: [], entertainment: [] };
    const { center, radius } = city;
    return {
        accommodation: [
            { id: 'h1', title: `Отель "Центральный"`, price: 8000, rating: 4.7, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop', type: 'Отель', amenities: ['WiFi', 'SPA'] },
            { id: 'h2', title: `Лофт в центре`, price: 4500, rating: 4.5, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop', type: 'Апартаменты', amenities: ['WiFi', 'Кухня'] },
            { id: 'h3', title: `Загородный дом`, price: 12000, rating: 4.9, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=300&h=200&fit=crop', type: 'Дом', amenities: ['Баня', 'Барбекю'] }
        ],
        cafes: [
            { id: 'c1', title: `Кофейня "Аромат"`, price: 500, rating: 4.4, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop', cuisine: 'Кофейня', features: ['WiFi', 'Завтрак'] },
            { id: 'c2', title: `Ресторан "Вкус"`, price: 1500, rating: 4.7, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop', cuisine: 'Европейская', features: ['Живая музыка'] },
            { id: 'c3', title: `Сыроварня`, price: 2500, rating: 4.8, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop', cuisine: 'Русская', features: ['Панорамный вид'] },
            { id: 'c4', title: `Street Food Plaza`, price: 800, rating: 4.3, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=300&h=200&fit=crop', cuisine: 'Разная', features: ['Быстро'] }
        ],
        entertainment: [
            { id: 'e1', title: `Картинг`, price: 2000, rating: 4.6, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&h=200&fit=crop', type: 'Активный отдых', duration: '1 час', ageGroup: '12+' },
            { id: 'e2', title: `Квест "Тайна"`, price: 3500, rating: 4.8, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=200&fit=crop', type: 'Квест', duration: '1.5 часа', ageGroup: '16+' },
            { id: 'e3', title: `Океанариум`, price: 1200, rating: 4.5, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1582967788606-a171f1080ca8?w=300&h=200&fit=crop', type: 'Экскурсия', duration: '2 часа', ageGroup: '0+' },
            { id: 'e4', title: `Центральный парк`, price: 0, rating: 4.9, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1568605114967-5b51e6a5d39c?w=300&h=200&fit=crop', type: 'Парк', duration: '3 часа', ageGroup: '0+' },
            { id: 'e5', title: `Музей современного искусства`, price: 800, rating: 4.7, coords: randomOffset(center, radius), image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=300&h=200&fit=crop', type: 'Музей', duration: '2 часа', ageGroup: '6+' }
        ]
    };
};

const extraData = {
    tours: [
        { id: 't1', category: 'tours', title: 'Горный поход на Эльбрус', type: 'Экстрим', price: 25000, duration: '3 дня', rating: 4.8, location: 'Кабардино-Балкария', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=200&fit=crop', seats: 12 },
        { id: 't2', category: 'tours', title: 'Золотое кольцо России', type: 'Культурный', price: 15000, duration: '5 дней', rating: 4.6, location: 'Центральная Россия', image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=300&h=200&fit=crop', seats: 20 }
    ],
    cars: [
        { id: 'car1', category: 'cars', title: 'Toyota Camry', type: 'Седан', price: 3500, transmission: 'Автомат', seats: 5, rating: 4.6, location: 'Москва', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop' },
        { id: 'car2', category: 'cars', title: 'BMW X5', type: 'Внедорожник', price: 7000, transmission: 'Автомат', seats: 5, rating: 4.8, location: 'Сочи', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop' }
    ]
};

const allCategories: Record<string, { label: string; icon: React.FC; color: string; maxSelect: number; filterFields: string[] }> = {
    accommodation: { label: 'Жильё', icon: Icons.Home, color: 'bg-green-500', maxSelect: 1, filterFields: ['type', 'amenities', 'priceRange'] },
    cafes: { label: 'Кафе', icon: Icons.Coffee, color: 'bg-orange-500', maxSelect: 3, filterFields: ['cuisine', 'features', 'priceRange'] },
    entertainment: { label: 'Развлечения', icon: Icons.Gamepad, color: 'bg-purple-500', maxSelect: 5, filterFields: ['type', 'ageGroup', 'priceRange'] },
    tours: { label: 'Туры', icon: Icons.Route, color: 'bg-blue-500', maxSelect: 0, filterFields: ['type', 'duration', 'priceRange'] },
    cars: { label: 'Авто', icon: Icons.Car, color: 'bg-red-500', maxSelect: 0, filterFields: ['type', 'transmission', 'priceRange'] }
};

const filterConfig: any = {
    accommodation: {
        fields: [
            { key: 'type', label: 'Тип', options: ['Отель', 'Апартаменты', 'Дом'] },
            { key: 'amenities', label: 'Удобства', options: ['WiFi', 'SPA', 'Кухня', 'Баня', 'Барбекю'] },
            { key: 'priceRange', label: 'Цена за ночь', type: 'range', min: 0, max: 20000 }
        ]
    },
    cafes: {
        fields: [
            { key: 'cuisine', label: 'Кухня', options: ['Кофейня', 'Европейская', 'Русская', 'Разная'] },
            { key: 'features', label: 'Особенности', options: ['WiFi', 'Завтрак', 'Живая музыка', 'Панорамный вид', 'Быстро'] },
            { key: 'priceRange', label: 'Средний чек', type: 'range', min: 0, max: 5000 }
        ]
    },
    entertainment: {
        fields: [
            { key: 'type', label: 'Тип', options: ['Активный отдых', 'Квест', 'Экскурсия', 'Парк', 'Музей'] },
            { key: 'ageGroup', label: 'Возраст', options: ['0+', '6+', '12+', '16+'] },
            { key: 'priceRange', label: 'Цена', type: 'range', min: 0, max: 20000 }
        ]
    },
    tours: {
        fields: [
            { key: 'type', label: 'Тип тура', options: ['Экстрим', 'Культурный'] },
            { key: 'duration', label: 'Длительность', options: ['3 дня', '5 дней'] },
            { key: 'priceRange', label: 'Цена', type: 'range', min: 0, max: 100000 }
        ]
    },
    cars: {
        fields: [
            { key: 'type', label: 'Тип авто', options: ['Седан', 'Внедорожник'] },
            { key: 'transmission', label: 'Коробка', options: ['Автомат', 'Механика'] },
            { key: 'priceRange', label: 'Цена в сутки', type: 'range', min: 0, max: 15000 }
        ]
    }
};

const toRad = (deg: number) => deg * Math.PI / 180;
const calculateDistance = (coord1: [number, number], coord2: [number, number]) => {
    const R = 6371;
    const dLat = toRad(coord2[0] - coord1[0]);
    const dLon = toRad(coord2[1] - coord1[1]);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(coord1[0])) * Math.cos(toRad(coord2[0])) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
const calculateTravelTime = (from: [number, number], to: [number, number], mode: string) => {
    const distance = calculateDistance(from, to);
    const speeds: Record<string, number> = { walk: 5, car: 30, transit: 20 };
    const minutes = Math.round((distance / speeds[mode]) * 60);
    return { distance: distance.toFixed(1), minutes: Math.max(1, minutes) };
};
const optimizeRoute = (points: any[], startPoint: any, mode: string) => {
    const unvisited = [...points];
    const route = [startPoint];
    let current = startPoint;
    while (unvisited.length) {
        let nearestIdx = -1, minTime = Infinity;
        unvisited.forEach((p, idx) => {
            const t = calculateTravelTime(current.coords, p.coords, mode).minutes;
            if (t < minTime) { minTime = t; nearestIdx = idx; }
        });
        if (nearestIdx !== -1) {
            const next = unvisited[nearestIdx];
            route.push({ ...next, travelFromPrev: { mode, ...calculateTravelTime(current.coords, next.coords, mode) } });
            current = next;
            unvisited.splice(nearestIdx, 1);
        }
    }
    return route;
};
const splitByDays = (route: any[], dailyLimit = 4) => {
    const days = [];
    let cur: any[] = [];
    route.forEach((p, idx) => {
        if (cur.length >= dailyLimit && idx !== route.length - 1) { days.push(cur); cur = [p]; }
        else cur.push(p);
    });
    if (cur.length) days.push(cur);
    return days;
};

const RouteMap = ({ route, activeDay, cityCenter }: { route: any[], activeDay: number | null, cityCenter: [number, number] | undefined }) => {
    const mapRef = useRef(null);
    const mapInst = useRef<any>(null);

    useEffect(() => {
        if (!(window as any).ymaps) return;
        let map: any;
        (window as any).ymaps.ready(() => {
            if (mapInst.current) mapInst.current.destroy();
            map = new (window as any).ymaps.Map(mapRef.current, { center: cityCenter || route[0]?.coords || [55.7558, 37.6176], zoom: 12, controls: ['zoomControl'] });
            mapInst.current = map;
        });
        return () => map?.destroy();
    }, [cityCenter]);

    useEffect(() => {
        if (!mapInst.current || !(window as any).ymaps) return;
        mapInst.current.geoObjects.removeAll();
        let points = route;
        if (activeDay !== null) { const days = splitByDays(route); if (days[activeDay]) points = days[activeDay]; }

        if (!points || points.length === 0) {
            if(cityCenter) mapInst.current.setCenter(cityCenter, 11);
            return;
        }

        const coords = points.map(p => p.coords);
        if (coords.length >= 2) {
            const poly = new (window as any).ymaps.Polyline(coords, {}, { strokeColor: '#6366f1', strokeWidth: 5, strokeOpacity: 0.8 });
            mapInst.current.geoObjects.add(poly);
            mapInst.current.setBounds(poly.geometry.getBounds(), { checkZoomRange: true, zoomMargin: 40 });
        } else if (coords.length === 1) {
            mapInst.current.setCenter(coords[0], 14);
        }
        points.forEach((p, idx) => {
            const catColor = allCategories[p.category]?.color.replace('bg-', '').replace('-500','') || '#6366f1';
            const place = new (window as any).ymaps.Placemark(p.coords, { balloonContentHeader: p.title, hintContent: `${idx + 1}. ${p.title}` }, { preset: 'islands#circleIcon', iconColor: catColor, iconCaption: (idx + 1).toString() });
            mapInst.current.geoObjects.add(place);
        });
    }, [route, activeDay, cityCenter]);

    return <div ref={mapRef} className="w-full h-full min-h-[350px] rounded-xl bg-gray-100" />;
};
const DynamicRouteMap = dynamic(() => Promise.resolve(RouteMap), { ssr: false });


const ResultCard = ({ item, onSelect, isSelected, disabled }: { item: any, onSelect: (item: any) => void, isSelected: boolean, disabled: boolean }) => {
    const cat = allCategories[item.category];
    if (!cat) return null;
    const Icon = cat.icon;
    return (
        <div className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}>
            <div className="relative h-40 overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                <div className={`absolute top-2 left-2 ${cat.color} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}><Icon /> {cat.label}</div>
                {cat.maxSelect > 0 && (
                    <button onClick={() => onSelect(item)} disabled={disabled && !isSelected} className={`absolute bottom-2 right-2 px-3 py-1 rounded-lg text-sm font-medium ${isSelected ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'} disabled:opacity-50`}>{isSelected ? 'Убрать' : 'В маршрут'}</button>
                )}
            </div>
            <div className="p-3">
                <h3 className="font-bold text-gray-800">{item.title}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1"><Icons.MapPin /> {item.location || (item.coords ? 'Город' : '—')}</div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-amber-500"><Icons.Star /><span className="text-gray-700">{item.rating}</span></div>
                    <div><span className="font-bold text-indigo-600">{item.price.toLocaleString()} ₽</span>{item.category === 'accommodation' && <span className="text-xs text-gray-400">/ночь</span>}</div>
                </div>
            </div>
        </div>
    );
};

export default function Routes1Page() {
    const [currentCity, setCurrentCity] = useState('moscow');
    const [cityData, setCityData] = useState(() => generateCityData('moscow'));
    const [selectedCategories, setSelectedCategories] = useState(['accommodation', 'cafes', 'entertainment']);
    const [activeFilters, setActiveFilters] = useState<any>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const [selectedRoutePoints, setSelectedRoutePoints] = useState<Record<string, any[]>>({ accommodation: [], cafes: [], entertainment: [] });
    const [transportMode, setTransportMode] = useState('car');
    const [optimizedRoute, setOptimizedRoute] = useState<any[]>([]);
    const [activeDay, setActiveDay] = useState<number | null>(null);
    const [showRoute, setShowRoute] = useState(false);
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [isMapReady, setMapReady] = useState(false);

    const changeCity = (cityKey: string) => {
        setCurrentCity(cityKey);
        const newData = generateCityData(cityKey);
        setCityData(newData);
        setSelectedRoutePoints({ accommodation: [], cafes: [], entertainment: [] });
        setShowRoute(false);
        setOptimizedRoute([]);
        setActiveDay(null);
        setActiveFilters({});
        setSearchQuery('');
    };

    const detectCity = () => {
        if (!isMapReady) { setLocationError('Карта еще не загружена'); return; }
        setLocating(true);
        setLocationError('');
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const resp = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=&geocode=${pos.coords.longitude},${pos.coords.latitude}&format=json`);
                const data = await resp.json();
                const addr = data.response.GeoObjectCollection.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text || '';
                let found = null;
                for (const [key, city] of Object.entries(CITIES)) if (addr.includes(city.name)) { found = key; break; }
                if (found) changeCity(found);
                else setLocationError(`Город не определён (${addr.substring(0, 30)})`);
            } catch { setLocationError('Ошибка геокодирования'); }
            setLocating(false);
        }, () => { setLocationError('Геолокация недоступна'); setLocating(false); });
    };

    const allItems = useMemo(() => {
        const cityItems = [
            ...cityData.accommodation.map(i => ({ ...i, category: 'accommodation', location: CITIES[currentCity].name })),
            ...cityData.cafes.map(i => ({ ...i, category: 'cafes', location: CITIES[currentCity].name })),
            ...cityData.entertainment.map(i => ({ ...i, category: 'entertainment', location: CITIES[currentCity].name }))
        ];
        const extra = [...extraData.tours, ...extraData.cars];
        return [...cityItems, ...extra];
    }, [cityData, currentCity]);

    const filteredItems = useMemo(() => {
        return allItems.filter(item => {
            if (!selectedCategories.includes(item.category)) return false;
            if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            const f = activeFilters[item.category];
            if (f) {
                if (f.priceRange && item.price > f.priceRange) return false;
                const checkMultiOption = (key: string) => f[key] && f[key].length && !f[key].includes(item[key]);
                if (checkMultiOption('type')) return false;
                if (checkMultiOption('cuisine')) return false;
                if (checkMultiOption('transmission')) return false;
                if (checkMultiOption('ageGroup')) return false;
                if (checkMultiOption('duration')) return false;
                if (f.amenities && f.amenities.length && !f.amenities.every((a: string) => item.amenities?.includes(a))) return false;
                if (f.features && f.features.length && !f.features.every((ft: string) => item.features?.includes(ft))) return false;
            }
            return true;
        }).sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            return b.rating - a.rating;
        });
    }, [allItems, selectedCategories, activeFilters, searchQuery, sortBy]);

    const toggleRoutePoint = (item: any) => {
        const cat = item.category;
        if (!['accommodation', 'cafes', 'entertainment'].includes(cat)) return;
        const max = allCategories[cat].maxSelect;
        setSelectedRoutePoints(prev => {
            const current = prev[cat];
            const exists = current.find(i => i.id === item.id);
            if (exists) return { ...prev, [cat]: current.filter(i => i.id !== item.id) };
            if (current.length >= max) return prev;
            return { ...prev, [cat]: [...current, { ...item, category: cat }] };
        });
    };

    const buildRoute = useCallback(() => {
        const points = [...selectedRoutePoints.accommodation, ...selectedRoutePoints.cafes, ...selectedRoutePoints.entertainment];
        if (points.length < 2) return;
        const base = selectedRoutePoints.accommodation[0] || points[0];
        const others = points.filter(p => p.id !== base.id);
        const route = optimizeRoute(others, base, transportMode);
        setOptimizedRoute(route);
        setShowRoute(true);
        setActiveDay(0);
    }, [selectedRoutePoints, transportMode]);

    useEffect(() => { if (showRoute) buildRoute(); }, [selectedRoutePoints, transportMode, showRoute, buildRoute]);

    const removeFromRoute = (point: any) => {
        setSelectedRoutePoints(prev => ({ ...prev, [point.category]: prev[point.category].filter(p => p.id !== point.id) }));
    };

    const days = splitByDays(optimizedRoute);
    const totalSelectedCount = Object.values(selectedRoutePoints).flat().length;
    const cityCenter = CITIES[currentCity]?.center;

    return (
        <>
            <Head>
                <title>TravelFinder + Маршруты</title>
            </Head>
            <Script
                src="https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU"
                strategy="lazyOnload"
                onLoad={() => setMapReady(true)}
            />
             <style jsx global>{`
                .route-card.selected { border: 2px solid #6366f1; background: #eef2ff; transform: scale(1.02); }
                .route-point { position: relative; padding-left: 40px; }
                .route-point::before { content: attr(data-index); position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; z-index: 2; }
                .route-point:not(:last-child)::after { content: ''; position: absolute; left: 13px; top: 40px; width: 2px; height: calc(100% - 20px); background: #e5e7eb; z-index: 1; }
                .transport-mode.active { background: #6366f1; color: white; border-color: #6366f1; }
                .day-tab.active { background: #6366f1; color: white; box-shadow: 0 2px 6px rgba(99,102,241,0.3); }
                .category-btn.active { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
                .filter-chip.active { background: #6366f1; color: white; }
                .range-slider { -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; background: #e5e7eb; outline: none; }
                .range-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #6366f1; cursor: pointer; }
            `}</style>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">TravelFinder + Маршруты</h1>
                        <div className="flex items-center gap-2">
                            <select value={currentCity} onChange={e => changeCity(e.target.value)} className="bg-white border border-gray-200 rounded-full px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300">
                                {Object.entries(CITIES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                            </select>
                            <button onClick={detectCity} disabled={locating} className="flex items-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 disabled:opacity-50">
                                {locating ? <Icons.Loader /> : <Icons.Location />} {locating ? '...' : 'Мой город'}
                            </button>
                        </div>
                        {locationError && <div className="text-xs text-red-500">{locationError}</div>}
                    </div>
                    <div className="max-w-7xl mx-auto px-4 pb-3 flex flex-wrap gap-2">
                        {Object.entries(allCategories).map(([key, { label, icon: Icon }]) => (
                            <button key={key} onClick={() => setSelectedCategories(prev => prev.includes(key) ? (prev.length > 1 ? prev.filter(c => c !== key) : prev) : [...prev, key])} className={`category-btn px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 border transition-colors ${selectedCategories.includes(key) ? 'active' : 'bg-white text-gray-600'}`}>
                                <Icon /> {label}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <aside className="lg:col-span-1 space-y-4">
                            <div className="bg-white rounded-2xl p-4 shadow-sm">
                                <input type="text" placeholder="Поиск по названию..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            {selectedCategories.map(cat => {
                                const cfg = filterConfig[cat];
                                if (!cfg) return null;
                                return (
                                    <div key={cat} className="bg-white rounded-2xl p-4 shadow-sm">
                                        <h3 className="font-bold mb-3">{allCategories[cat].label}</h3>
                                        {cfg.fields.map((field: any) => (
                                            <div key={field.key} className="mb-4">
                                                <label className="text-base font-medium text-gray-600">{field.label}</label>
                                                {field.type === 'range' ? (
                                                    <div>
                                                        <input type="range" min={field.min} max={field.max} step={500} value={activeFilters[cat]?.[field.key] || field.max} onChange={e => setActiveFilters(prev => ({ ...prev, [cat]: { ...prev[cat], [field.key]: parseInt(e.target.value) } }))} className="range-slider mt-1" />
                                                        <div className="flex justify-between text-xs text-gray-500"><span>{field.min} ₽</span><span>до {(activeFilters[cat]?.[field.key] || field.max).toLocaleString()} ₽</span></div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {field.options.map((opt: string) => {
                                                            const active = activeFilters[cat]?.[field.key]?.includes(opt);
                                                            return <button key={opt} onClick={() => { const cur = activeFilters[cat]?.[field.key] || []; const upd = active ? cur.filter(o => o !== opt) : [...cur, opt]; setActiveFilters(prev => ({ ...prev, [cat]: { ...prev[cat], [field.key]: upd } })); }} className={`filter-chip px-3 py-1.5 rounded-full text-sm ${active ? 'active' : 'bg-gray-100'}`}>{opt}</button>;
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                            <button onClick={() => setActiveFilters({})} className="w-full py-2 text-indigo-600 text-sm font-medium">Сбросить все фильтры</button>
                        </aside>

                        <main className="lg:col-span-2 min-w-0">
                            <div className="flex justify-between items-center mb-4"><span className="text-gray-600">Найдено: {filteredItems.length}</span><select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border rounded-xl px-3 py-1 text-sm bg-white"><option value="rating">По рейтингу</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option></select></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredItems.map(item => {
                                    const isRoutable = ['accommodation', 'cafes', 'entertainment'].includes(item.category);
                                    const isSelected = isRoutable && selectedRoutePoints[item.category]?.some(i => i.id === item.id);
                                    const disabled = isRoutable && !isSelected && selectedRoutePoints[item.category]?.length >= allCategories[item.category].maxSelect;
                                    return <ResultCard key={item.id} item={item} onSelect={toggleRoutePoint} isSelected={isSelected} disabled={disabled} />;
                                })}
                            </div>
                            <div className="bg-white rounded-2xl p-4 shadow-sm mt-6">
                                <h2 className="font-bold text-lg mb-2">Конструктор маршрута</h2>
                                <div className="flex gap-2 mb-3">{['walk', 'transit', 'car'].map(m => <button key={m} onClick={() => setTransportMode(m)} className={`transport-mode flex-1 py-1 text-sm rounded-full border flex items-center justify-center gap-1.5 transition-colors ${transportMode === m ? 'active' : 'hover:bg-gray-100'}`}>{m === 'walk' ? <><Icons.Walk />Пешком</> : m === 'transit' ? <><Icons.Bus />Транспорт</> : <><Icons.Car />Авто</>}</button>)}</div>
                                <button onClick={buildRoute} disabled={totalSelectedCount < 2} className={`w-full py-2 rounded-xl font-semibold text-white transition-colors ${totalSelectedCount < 2 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg'}`}>Построить маршрут</button>
                                <div className="mt-3 text-sm text-gray-500">Выбрано: {totalSelectedCount} (Жильё: {selectedRoutePoints.accommodation.length}/{allCategories.accommodation.maxSelect}, Кафе: {selectedRoutePoints.cafes.length}/{allCategories.cafes.maxSelect}, Развлечения: {selectedRoutePoints.entertainment.length}/{allCategories.entertainment.maxSelect})</div>

                                {showRoute && optimizedRoute.length > 0 && (
                                     <div className="mt-4 pt-4 border-t">
                                        <div className="bg-gray-100 rounded-xl p-1 h-96 mb-4"><DynamicRouteMap route={optimizedRoute} activeDay={activeDay} cityCenter={cityCenter} /></div>
                                        <div>
                                            {days.length > 1 && <div className="flex gap-2 overflow-x-auto mb-2"><button onClick={() => setActiveDay(null)} className={`day-tab text-xs px-3 py-1 rounded-lg ${activeDay === null ? 'active' : ''}`}>Все дни</button>{days.map((_, idx) => <button key={idx} onClick={() => setActiveDay(idx)} className={`day-tab text-xs px-3 py-1 rounded-lg ${activeDay === idx ? 'active' : ''}`}>День {idx + 1}</button>)}</div>}
                                            <h3 className="font-bold mb-2">{activeDay !== null ? `День ${activeDay + 1}` : 'Весь маршрут'}</h3>
                                            <div className="space-y-2 max-h-80 overflow-auto pr-2">
                                                {(activeDay !== null ? days[activeDay] : optimizedRoute).map((p, idx) => (
                                                    <div key={p.id} className="route-point" data-index={idx + 1}>
                                                        <div className="bg-gray-50 p-2 rounded-lg text-sm">
                                                            <div className="flex justify-between items-start">
                                                                <span className="font-medium pr-2">{p.title}</span>
                                                                <button onClick={() => removeFromRoute(p)} className="text-red-400 hover:text-red-600 flex-shrink-0"><Icons.Trash /></button>
                                                            </div>
                                                            {p.travelFromPrev && <div className="text-xs text-gray-500 mt-1">🚗 {p.travelFromPrev.minutes} мин ({p.travelFromPrev.distance} км)</div>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 pt-2 border-t"><div className="flex justify-between text-sm"><span>Общая стоимость:</span><span className="font-bold">{optimizedRoute.reduce((s, p) => s + p.price, 0).toLocaleString()} ₽</span></div></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
