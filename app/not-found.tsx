"use client";

import { motion } from "framer-motion";
import { Compass, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="font-display text-[96px] font-bold leading-none tracking-tight text-brand-600 sm:text-[140px]"
      >
        404
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-2"
      >
        <h1 className="heading-2">This page drifted off the map</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Let&apos;s get you back to something good.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <Button href="/" variant="primary">
          <Home size={17} /> Back Home
        </Button>
        <Button href="/shop" variant="outline">
          <Compass size={17} /> Browse Shop
        </Button>
        <Button href="/search" variant="ghost">
          <Search size={17} /> Search
        </Button>
      </motion.div>
    </div>
  );
}
