"use client";
import React, {useState } from 'react';
import {Bars3Icon, XMarkIcon, HomeIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";

import BlueLogo from "@/assets/blue_logo.svg"
import { SelectedPage } from "@/utils/types";
import useMediaQuery from "@/hooks/useMediaQuery";



type NavbarProps = {
    isTopOfPage: boolean;
    selectedPage: SelectedPage;
    setSelectedPage: (value: SelectedPage) => void;
};

const Navbar: React.FC<NavbarProps> = ({ isTopOfPage, selectedPage, setSelectedPage }: NavbarProps) => {
    const flexBetween = "flex justify-between items-center"; // moves to opposite ends
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
    const navbarBackground = isTopOfPage ? "" : "bg-[#000000] drop-shadow";


    return <nav>

        <div className = {`${flexBetween} bg-[#ffffff00] fixed top-0 z-30 w-full left-0 right-0 py-6 px-6 rounded-xl`}>
            <div className = {`${flexBetween} mx-auto w-7/8`}>
                
                <div className = {`${flexBetween} w-full gap-14 hidden md:flex`}>
                        {/*LEFT*/}
                        <Image src={BlueLogo} alt="Blue Logo" width={100} height={40} priority />
                        {/*RIGHT*/}
                        <div className = {`${flexBetween} w-full`}>
                            <div className = {`${flexBetween} gap-8 text-sm`}>
                                <Link href="/pages/about" className="font-semibold">about</Link>
                                <Link href = "/pages/journal" className = " font-semibold">journal</Link>
                                <Link href = "/pages/dashboard" className = " font-semibold">dashboard</Link>
                            </div>
                            <div className = {`${flexBetween} gap-8 text-sm`}>
                                <a>Login</a>
                                <a>Join</a>
                            </div>
                        </div>
                    </div>
            </div>

            <div className = "md:hidden flex justify-end">
                <Bars3Icon className = "h-6 w-6 text-[#ff6600]" />
            </div> 
            
            

        </div>

    </nav>

}



export default Navbar;