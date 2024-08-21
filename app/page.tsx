import NisabList from "@/components/NisabList";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 lg:p-20">
      <Hero />
      <NisabList />
    </main>
  );
}
