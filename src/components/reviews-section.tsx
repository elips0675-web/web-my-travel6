'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, User } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AuthDialog } from './auth-dialog';

// Mock data for reviews
const mockReviews = [
  { id: 1, author: 'Алексей', rating: 5, date: '2024-05-15', text: 'Потрясающий тур! Организация на высшем уровне, гид был очень знающим и интересным. Замки просто великолепны. Очень рекомендую!', avatar: 'https://i.pravatar.cc/150?u=alexey' },
  { id: 2, author: 'Елена', rating: 4, date: '2024-05-12', text: 'Хорошая поездка, но было немного утомительно. В целом, впечатления положительные, но хотелось бы больше свободного времени в Несвиже.', avatar: 'https://i.pravatar.cc/150?u=elena' },
  { id: 3, author: 'Дмитрий', rating: 5, date: '2024-05-10', text: 'Всё было супер! Отличный автобус, интересный рассказ гида. Обед тоже был вкусным. Обязательно поеду еще раз с этой компанией.', avatar: 'https://i.pravatar.cc/150?u=dmitry' },
];

const ratingDistribution = [
  { rating: 5, count: 68, percentage: 80 },
  { rating: 4, count: 12, percentage: 15 },
  { rating: 3, count: 5, percentage: 5 },
  { rating: 2, count: 0, percentage: 0 },
  { rating: 1, count: 0, percentage: 0 },
];
const totalReviews = ratingDistribution.reduce((acc, item) => acc + item.count, 0);
const averageRating = 4.8;


function StarRatingInput({ rating, setRating }: { rating: number, setRating: (r: number) => void }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`cursor-pointer h-7 w-7 transition-colors ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                    }`}
                    onClick={() => setRating(star)}
                />
            ))}
        </div>
    );
}

function ReviewForm() {
    return (
        <div className="text-center p-6 border rounded-lg">
            <p className="mb-4">Чтобы оставить отзыв, пожалуйста, войдите в свой аккаунт.</p>
            <AuthDialog>
                <Button>Войти или зарегистрироваться</Button>
            </AuthDialog>
        </div>
    )
}


export default function ReviewsSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Star className="text-primary" />
                    <span>Отзывы и рейтинг</span>
                </CardTitle>
                <CardDescription>Что говорят другие путешественники</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Rating Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <p className="text-6xl font-bold">{averageRating.toFixed(1)}</p>
                        <div className="flex">
                           {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-6 w-6 ${i < Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                           ))}
                        </div>
                        <p className="text-muted-foreground text-sm">На основе {totalReviews} отзывов</p>
                    </div>
                    <div className="col-span-2 space-y-2">
                        {ratingDistribution.map((item) => (
                            <div key={item.rating} className="flex items-center gap-4 text-sm">
                                <span className="w-12 text-muted-foreground">{item.rating} звезд</span>
                                <Progress value={item.percentage} className="flex-1 h-2" />
                                <span className="w-8 text-right font-medium">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <hr/>

                {/* Review List */}
                <div className="space-y-6">
                    {mockReviews.map(review => (
                        <div key={review.id} className="flex gap-4">
                             <Avatar>
                                <AvatarImage src={review.avatar} alt={review.author} />
                                <AvatarFallback><User/></AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{review.author}</p>
                                    <p className="text-xs text-muted-foreground">{review.date}</p>
                                </div>
                                <div className="flex items-center gap-0.5 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <p className="mt-2 text-muted-foreground">{review.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <hr />

                {/* Review Form */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Оставить свой отзыв</h3>
                    <ReviewForm />
                </div>
            </CardContent>
        </Card>
    );
}
