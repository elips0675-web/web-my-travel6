'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Placeholder for the form functionality
function PlaceholderForm({ title }: { title: string }) {
  return (
    <div className="space-y-4">
        <p>Форма временно отключена.</p>
        <Button type="submit" className="w-full" disabled={true}>
            {title}
        </Button>
    </div>
  );
}


export function AuthDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="login" className="w-full">
          <DialogHeader className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
          </DialogHeader>
          <TabsContent value="login">
            <DialogTitle className="text-center mb-1">С возвращением!</DialogTitle>
            <DialogDescription className="text-center mb-4">
              Войдите в свой аккаунт, чтобы продолжить.
            </DialogDescription>
            <PlaceholderForm title="Войти" />
          </TabsContent>
          <TabsContent value="register">
             <DialogTitle className="text-center mb-1">Создать аккаунт</DialogTitle>
            <DialogDescription className="text-center mb-4">
              Присоединяйтесь, чтобы планировать путешествия или управлять бизнесом.
            </DialogDescription>
            <PlaceholderForm title="Зарегистрироваться" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
