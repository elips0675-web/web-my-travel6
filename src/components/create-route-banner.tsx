'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function CreateRouteBanner() {
    return (
        <section className="py-16 lg:py-24 bg-primary/5">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Спланируйте свое идеальное путешествие</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    Наш интеллектуальный конструктор маршрутов поможет вам создать незабываемый отдых, учитывая все ваши пожелания.
                </p>
                <Button asChild size="lg">
                    <Link href="/routes/new">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Создать маршрут
                    </Link>
                </Button>
            </div>
        </section>
    );
}
