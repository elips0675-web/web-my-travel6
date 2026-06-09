'use client';

import Script from 'next/script';
import { useCallback, useEffect, useState } from 'react';

const YANDEX_MAPS_URL = 'https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU&load=package.full';

export function useYandexMaps() {
  const [ready, setReady] = useState(typeof window !== 'undefined' && Boolean((window as any).ymaps));

  useEffect(() => {
    if ((window as any).ymaps) {
      setReady(true);
    }
  }, []);

  return ready;
}

export function YandexMapsScript({ onLoad }: { onLoad?: () => void }) {
  const [loaded, setLoaded] = useState(typeof window !== 'undefined' && Boolean((window as any).ymaps));

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  if (loaded) return null;

  return (
    <Script
      src={YANDEX_MAPS_URL}
      strategy="lazyOnload"
      onLoad={handleLoad}
    />
  );
}
