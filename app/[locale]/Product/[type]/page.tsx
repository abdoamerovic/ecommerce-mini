
"use client"
import Categorypadge from "@/components/Categorypadge"

 export default function ProductPage({params}: {params: {alt: string}}){
    return(
      
        <div>
            <Categorypadge category={params.alt}/>
        </div>
        
      
    )
 } 