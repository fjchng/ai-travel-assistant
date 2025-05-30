import { Header } from "@/components/header";
import { TravelForm } from "@/components/travel-form";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-10 md:py-16">
        <section className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tight">
            Your AI Travel Assistant
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Plan your perfect trip with personalized itineraries powered by AI
          </p>
          
          <TravelForm />
        </section>
        
        <Features />
      </div>
      
      <Footer />
    </main>
  );
}