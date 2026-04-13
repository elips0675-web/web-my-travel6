import RestaurantDetailsPageContent from '@/components/pages/restaurant-details-page';

export default function RestaurantDetailsPage({ params }: { params: { slug: string } }) {
    return <RestaurantDetailsPageContent slug={params.slug} />;
}
