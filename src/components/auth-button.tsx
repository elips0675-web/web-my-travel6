'use client';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthDialog } from './auth-dialog';
import { signOut } from 'firebase/auth';
import { User as UserIcon, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';
import { useAuth } from '@/firebase';
import { useUserProfile } from '@/firebase/auth/use-user-profile';

export function AuthButton() {
    const { user, isLoading: isUserLoading } = useUser();
    const { userProfile, isLoading: isProfileLoading } = useUserProfile();
    const auth = useAuth();

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
        }
    };

    const isLoading = isUserLoading || isProfileLoading;

    if (isLoading) {
        return <Skeleton className="h-10 w-10 rounded-full" />;
    }

    if (!user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button asChild variant="ghost" size="icon" className="rounded-full">
                        <div>
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    <UserIcon className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <span className="sr-only">Профиль</span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                     <DropdownMenuLabel>Демо-режим</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/profile">Профиль</Link>
                    </DropdownMenuItem>
                    <AuthDialog>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <LogIn className="mr-2 h-4 w-4" />
                            <span>Войти</span>
                        </DropdownMenuItem>
                    </AuthDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button asChild variant="ghost" size="icon" className="rounded-full">
                    <div>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || ''} />
                            <AvatarFallback>
                                <UserIcon className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Профиль</span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userProfile?.isBusinessOwner && (
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard">Панель управления</Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/profile">Профиль</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}