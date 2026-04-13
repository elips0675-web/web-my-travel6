export type Place = {
  id: string;
  name: string;
  description: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'other';
  coordinates: { lat: number; lng: number };
};

export type Route = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  places: Place[];
};

export const routes: Route[] = [
  {
    id: '1',
    name: 'Весенний Париж',
    destination: 'Париж, Франция',
    startDate: '2024-05-10',
    endDate: '2024-05-17',
    places: [
      { id: 'p1', name: 'Эйфелева башня', description: 'Символ Парижа.', type: 'attraction', coordinates: { lat: 48.8584, lng: 2.2945 } },
      { id: 'p2', name: 'Лувр', description: 'Один из крупнейших и самый популярный художественный музей мира.', type: 'attraction', coordinates: { lat: 48.8606, lng: 2.3376 } },
      { id: 'p3', name: 'Le Procope', description: 'Старейшее кафе Парижа.', type: 'restaurant', coordinates: { lat: 48.8530, lng: 2.3387 } },
    ],
  },
  {
    id: '2',
    name: 'Древний Рим',
    destination: 'Рим, Италия',
    startDate: '2024-06-20',
    endDate: '2024-06-27',
    places: [
        { id: 'p4', name: 'Колизей', description: 'Амфитеатр, памятник архитектуры Древнего Рима.', type: 'attraction', coordinates: { lat: 41.8902, lng: 12.4922 } },
    ],
  },
];

export const findRouteById = (id: string) => routes.find(route => route.id === id);
