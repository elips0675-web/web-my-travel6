import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Calendar, MapPin } from 'lucide-react';
import { routes } from '@/lib/data';

export default function MyRoutesPage() {
  return (
    <div className="container mx-auto px-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline font-bold">Мои Маршруты</h1>
        <Button asChild>
          <Link href="/routes/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Создать маршрут
          </Link>
        </Button>
      </div>

      {routes.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">У вас пока нет маршрутов</h2>
            <p className="text-muted-foreground mb-4">Начните планировать свое следующее приключение!</p>
            <Button asChild>
              <Link href="/routes/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Создать первый маршрут
              </Link>
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Card key={route.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="font-headline">{route.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-2">
                  <MapPin className="h-4 w-4" />
                  {route.destination}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(route.startDate).toLocaleDateString('ru-RU')} - {new Date(route.endDate).toLocaleDateString('ru-RU')}</span>
                 </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/routes/${route.id}`}>Посмотреть</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
