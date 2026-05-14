"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight} from "lucide-react";

export default function ImageTabs() {
    const [activeTab, setActiveTab] = useState("Organize");
    return (
   
  <section className="border-t bg-white  py-16">
  <div className="container mx-auto px-4">
    <div className="mx-auto max-w-6xl">
      {/* tabs */}
      <div className="mb-8 flex justify-center gap-2">
        <Button onClick={() => setActiveTab("Organize")}
          className={`rounded-lg px-6 py-3 text-sm font-medium
          transition-colors ${activeTab === "Organize" ? "bg-primary text-white " : "bg-gray-100  text-gray-700 hover:bg-gray-200"}
          `}
        >Organize Applications</Button>
        <Button onClick={() => setActiveTab("hired")}
           className={`rounded-lg px-6 py-3 text-sm font-medium
          transition-colors ${activeTab === "hired" ? "bg-primary text-white " : "bg-gray-100  text-gray-700 hover:bg-gray-200"}
          `}
        >Hired</Button>
        
        <Button onClick={() => setActiveTab("boards")}
           className={`rounded-lg px-6 py-3 text-sm font-medium
          transition-colors ${activeTab === "boards" ? "bg-primary text-white " : "bg-gray-100  text-gray-700 hover:bg-gray-200"}
          `}
        >Boards</Button>
      </div>
      <div className="relative mx-auto max-w-5xl overflow-hidden
      rounded-lg border border-gray-200 shadow-xl">
        {activeTab === "Organize" && (
        <Image
          src="/hero-images/hero1.png"
          alt="Hero Image"
          width={1200}
          height={800}
          loading="eager"
          
        />
        )}
        {activeTab === "hired" && (
            <Image
          src="/hero-images/hero2.png"
          alt="Hero Image"
          width={1200}
          height={800}
          
        />
        )}
        {activeTab === "boards" && (
            <Image
          src="/hero-images/hero3.png"
          alt="Hero Image"
          width={1200}
          height={800}
          
        />
        )}
      </div>
    </div>
  </div>
  </section>

)
}