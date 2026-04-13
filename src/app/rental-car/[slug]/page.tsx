import RentalCarDetailsPageContent from '@/components/pages/rental-car-details-page';

export default function RentalCarDetailsPage({ params }: { params: { slug: string } }) {
    return <RentalCarDetailsPageContent slug={params.slug} />;
}
