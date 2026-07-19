"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";

export function PromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const LAST_SHOWN_KEY = "lastPromoShownAt";
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    
    const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
    const now = Date.now();

    if (!lastShown || now - parseInt(lastShown, 10) > TWENTY_FOUR_HOURS) {
      setOpen(true);
      localStorage.setItem(LAST_SHOWN_KEY, now.toString());
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-4 overflow-hidden bg-white border-none shadow-2xl rounded-2xl">
        <DialogTitle className="sr-only">Promotion</DialogTitle>
        <div className="relative w-full flex flex-col items-center justify-center gap-4">
          <Image
            src="/promotion.png"
            alt="Promotion"
            width={600}
            height={600}
            className="w-full h-auto object-contain rounded-xl"
            priority
          />
          <Button 
            onClick={() => setOpen(false)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg transition-all"
          >
            বন্ধ করুন
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
