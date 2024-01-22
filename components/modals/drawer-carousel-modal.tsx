"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import qs from "query-string"
import { useRouter } from 'next-nprogress-bar';
import { dismissToast, showToast } from '@/lib/showToast';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Image from 'next/image';

import dummy1 from "@/public/Comparte Ideas.png";
import dummy2 from "@/public/Ver Clase.png";
import dumm3 from "@/public/Organizate.png";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export const InfoModal = ({open, setOpen}: {open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) => {

    return (
        <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <DrawerTitle>Bienvenido!</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0">
            <Carousel
                        opts={{
                            align: "start",
                        }}
                        orientation="horizontal"
                        className="w-full"
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
                <CarouselPrevious />
                <CarouselNext />
                </Carousel>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="primary">Entiendo</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }