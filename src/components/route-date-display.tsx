'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type RouteDateDisplayProps = {
    startDate: string;
    endDate: string;
};

export function RouteDateDisplay({ startDate, endDate }: RouteDateDisplayProps) {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        // This effect runs only on the client, after hydration
        const start = new Date(startDate).toLocaleDateString('ru-RU');
        const end = new Date(endDate).toLocaleDateString('ru-RU');
        setFormattedDate(`${start} - ${end}`);
    }, [startDate, endDate]);

    return (
        <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> 
            {formattedDate ? (
                <span>{formattedDate}</span>
            ) : (
                <Skeleton className="h-4 w-40" />
            )}
        </span>
    );
}
