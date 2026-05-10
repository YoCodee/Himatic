import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
const Hero = () => {
  return (
   <div className="relative w-full h-screen overflow-hidden">
      <Image
        src={`/images/hero/Pixel-Artist-base-in-Taipei-Taiwan.gif`}
        alt="hero"
        width={1000}
        height={1000}
        className="w-full h-full object-cover absolute inset-0"
      />
      {/* Dark transparent overlay */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />
      {/* Bottom gradient fade to About Us section */}
      <div
        className="absolute bottom-0 left-0 w-full h-1/3 z-[2] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #0c0e17)",
        }}
      />
      <div className="z-10 absolute inset-0 flex-col  justify-center  flex items-center w-full ">
        <h1 className="text-white text-4xl md:text-5xl font-bold font-game text-center">
          UMKM <br />
          Potential with <br />{" "}
          <span
            className="text-yellow-500 text-8xl"
            style={{
              textShadow:
                "2px 2px 0 #000, -2px -2px 0 #000,2px 2px 0 #000, -2px -2px 0 #000 ",
            }}
          >
            HIMATIC
          </span>
        </h1>
        <h2 className="text-white text-xl md:text-2xl font-normal font-game text-center mt-4">
          Start Your Journey Today
        </h2>
        <Link href={"/sign-up"}>
          <Button variant={"pixel"} className="font-game text-3xl mt-8">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Hero