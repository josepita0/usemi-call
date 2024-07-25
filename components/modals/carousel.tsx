"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel"
import Image from 'next/image';

import dummy1 from "@/public/Comparte Ideas.png";
import dummy2 from "@/public/Ver Clase.png";
import dumm3 from "@/public/Organizate.png";

import Autoplay from "embla-carousel-autoplay"

export const CarouselHome = () => {
    return (
        <div className="p-2 flex justify-center w-full rounded-md dark:bg-[#484c52] bg-[#F2F3F5] ">
            <Carousel
                    plugins={[
                        Autoplay({
                          delay: 5000,
                        }),
                      ]}
                    opts={{
                        align: "start",
                    }}
                    orientation="horizontal"
                    className=""
            >
            <CarouselContent>
                <CarouselItem>

                    <Image
                        
                        src={dummy1}
                        alt='dumycito'
                    />

                </CarouselItem>
                <CarouselItem>  <Image
                        src={dummy2}
                        alt='dumycito'
                    /></CarouselItem>
                <CarouselItem>  <Image
                        src={dumm3}
                        alt='dumycito'
                    /></CarouselItem>
            </CarouselContent>
            {/* <CarouselPrevious />
            <CarouselNext /> */}
            </Carousel>
        </div>
    )
}

