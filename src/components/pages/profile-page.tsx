'use client';

import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User as UserIcon, Edit, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { AuthDialog } from '../auth-dialog';

export default function ProfilePageContent() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const demoUser = {
      displayName: 'Демо-пользователь',
      email: 'demo@example.com',
      photoURL: 'https://i.pravatar.cc/150?u=demo',
      interests: ['История', 'Архитектура', 'Гастрономия', 'Природа']
  }

  const currentUser = user || demoUser;
  const isDemo = !user;

  if (isLoading) {
    return (
        <div className="container mx-auto max-w-4xl py-8 flex justify-center items-center h-96">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || currentUser.email || ''} />
              <AvatarFallback>
                <UserIcon className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
            {!isDemo &&
              <Button variant="outline" size="icon" className="absolute bottom-1 right-1 rounded-full">
                <Edit className="w-4 h-4" />
              </Button>
            }
          </div>
          <CardTitle className="font-headline text-3xl">{currentUser.displayName || 'Пользователь'}</CardTitle>
          <CardDescription>{currentUser.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <Separator />
            <div className="space-y-4">
                <Label htmlFor="name" className="font-semibold text-lg">Личная информация</Label>
                <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Имя</Label>
                        <Input id="name" defaultValue={currentUser.displayName || ''} className="col-span-3" placeholder="Ваше имя" readOnly={isDemo} />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" defaultValue={currentUser.email || ''} className="col-span-3" readOnly/>
                    </div>
                </div>
            </div>
             <Separator />
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Мои интересы</h3>
                <div className="flex flex-wrap gap-2">
                    {demoUser.interests.map(interest => (
                        <span key={interest} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            {interest}
                        </span>
                    ))}
                    {!isDemo && 
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                            + Добавить интерес
                        </Button>
                    }
                </div>
            </div>
             <Separator />
             <div className="flex justify-end">
                {isDemo ? (
                     <AuthDialog>
                        <Button>Войти, чтобы редактировать</Button>
                    </AuthDialog>
                ) : (
                    <Button>Сохранить изменения</Button>
                )}
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
