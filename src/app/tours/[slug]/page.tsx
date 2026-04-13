import TourDetailsPageContent from '@/components/pages/tour-details-page';

export default function TourDetailsPage({ params }: { params: { slug: string } }) {
    return <TourDetailsPageContent slug={params.slug} />;
}
