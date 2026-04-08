import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
   <main className="flex-1">
  <section className="container mx-auto px-4 py-32">
    <div className="mx-auto max-w-4xl text-center">
    <h1 className="text-black mb-6 text-6xl font-bold">
      A better way to track your job applications. <br />
    </h1>
   
    <p className="text-muted-foreground mb-10 text-xl">
      Capture, organize, and track your job applications in one place.</p>
  <div  className="flex flex-col items-center gap-4">
    <Button size="lg" className="h-12 px-8 text-lg font-medium">Start for free</Button>
    <p className="text-muted-foreground text-sm">Free forever. No credit card required.</p>
  </div>
    </div>
  </section>
   </main>
    </div>
  );
}
