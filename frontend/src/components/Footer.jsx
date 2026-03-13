import React from "react";
import achievrLogo from "../assets/achievr-logo.png";

export default function Footer() {
    return (
        <footer className="border-t-2 border-gray-100 py-14 md:py-14 px-4 md:px-8 bg-white mt-1">
            <div className="max-w-6xl mx-auto text-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-4">
                    <div className="col-span-full flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-3">
                            <img
                                src={achievrLogo}
                                alt="AchievR Logo"
                                className="h-12 md:h-16 w-auto" />
                        </div>
                        <p className="text-xs text-gray-600 font-light max-w-xs mx-auto">
                            Your Verified Path to Opportunities
                        </p>
                    </div>
                </div>

                {/* <div className="border-t border-gray-200 pt-4 md:pt-6"> */}
                <p className="text-xs text-gray-900 font-light">
                    © 2025 AchievR. All rights reserved. Developed by Hack Titans
                    (Shashank & Omkar)
                </p>
                {/* </div> */}
            </div>
        </footer>
    );
}

function FooterCol({ title, links }) {
    return (
        <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">
                {title}
            </p>

            <ul className="space-y-2 text-sm text-gray-600 font-light">
                {links.map((link) => (
                    <li key={link}>
                        <a href="#" className="hover:text-orange-600 transition">
                            {link}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}