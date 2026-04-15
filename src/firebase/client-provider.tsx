'use client';

import { type ReactNode } from 'react';
import { getFirebase } from './index';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
    const firebase = getFirebase();
    return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}
