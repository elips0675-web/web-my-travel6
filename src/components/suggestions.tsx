'use server';

import { aiSuggestionsForRoute } from '@/ai/flows/ai-suggestions-for-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Route } from '@/lib/data';
import { Plus, Wand2 } from 'lucide-react';

// Assuming the output of aiSuggestionsForRoute based on other flows
type Suggestion = {
    name: string;
    description: string;
    type: string;
};

export default async function Suggestions({ route }: { route: Route }) {
    // For demo, let's hardcode interests. In a real app, this would come from user profile.
    const interests = ['history', 'art', 'food'];

    let suggestions: Suggestion[] = [];
    try {
        // The provided flow is incomplete, so we mock the function's behavior.
        // In a real scenario, the direct call would be:
        // suggestions = await aiSuggestionsForRoute({
        //     destination: route.destination,
        //     interests: interests,
        // });

        // Mock response to demonstrate functionality
        if (route.destination.toLowerCase().includes('париж')) {
            suggestions = [
                { name: 'Музей Орсе', description: 'Насладитесь искусством импрессионистов в здании бывшего вокзала.', type: 'Музей' },
                { name: 'Сент-Шапель', description: 'Полюбуйтесь на потрясающие витражи XIII века в этой готической часовне.', type: 'Достопримечательность' },
                { name: 'Квартал Маре', description: 'Прогуляйтесь по историческому району с его бутиками, галереями и особняками.', type: 'Прогулка' },
                { name: 'Круиз по Сене', description: 'Посмотрите на главные достопримечательности Парижа с воды.', type: 'Активность' }
            ];
        } else {
             suggestions = [
                { name: 'Секретный сад', description: 'Откройте для себя скрытый оазис в центре города.', type: 'Парк' },
                { name: 'Мастер-класс местной кухни', description: 'Научитесь готовить традиционные блюда у местного шеф-повара.', type: 'Мастер-класс' }
            ];
        }

    } catch (error) {
        console.error("Failed to fetch AI suggestions:", error);
        return null;
    }
    
    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Wand2 className="text-primary" />
                    <span>Интеллектуальные рекомендации</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="p-4 border rounded-lg flex flex-col gap-2 bg-background hover:bg-secondary/50 transition-colors">
                            <h3 className="font-semibold">{suggestion.name}</h3>
                            <p className="text-sm text-muted-foreground flex-grow">{suggestion.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium bg-accent/20 text-accent-foreground py-1 px-2 rounded-full">{suggestion.type}</span>
                                <Button size="sm" variant="ghost">
                                    <Plus className="mr-2 h-4 w-4"/>
                                    Добавить
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
