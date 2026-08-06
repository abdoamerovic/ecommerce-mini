import Start from "../../components/Start";
import Image from "next/image";
import Arrivals from "@/components/Arrivals";
import TopSale from "@/components/TopSale";
import Form from "@/components/form";
import Reviews from "@/components/Reviews";

export default function Home() {
  const brands = [
    { id: 1, src: "/images/versace.jpg", alt: "Brand logo one" },
    { id: 2, src: "/images/zara.jpg", alt: "Brand logo two" },
    { id: 3, src: "/images/gucci.jpg", alt: "Brand logo three" },
    { id: 4, src: "/images/Prada-1.jpg", alt: "Brand logo four" },
    { id: 5, src: "/images/clievn_klien.jpg", alt: "Brand logo five" },
  ];

  return (
    <>
      <Start />
      <div id="brand" className="w-full bg-black flex flex-wrap lg:flex-nowrap justify-evenly items-center  gap-6  -mt-20  ">
        {brands.map((brand) => (
          <Image
            key={brand.id}
            src={brand.src}
            alt={brand.alt}
            width={100}
            height={100}
            
            className="w-full max-w-37 h-auto object-contain p-4"  
            
          />
        ))}
        
      </div>
      <div id="arrivals">
      <Arrivals/>
      </div>
      <div id="onsale">
      <TopSale/>
      </div>
      <Form/>
      <Reviews/>
    </>
  );
}
