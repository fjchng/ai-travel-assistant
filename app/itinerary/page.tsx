export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ItineraryResults } from "@/components/itinerary/itinerary-results";
import { ItineraryLoading } from "@/components/itinerary/itinerary-loading";

export default async function ItineraryPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const { q } = await searchParams;
  const query = q || "";
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <Suspense fallback={<ItineraryLoading />}>
          <ItineraryResults query={query} />
        </Suspense>
      </div>
      
      <Footer />
    </main>
  );
}