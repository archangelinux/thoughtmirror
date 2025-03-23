"use client";
import Image from "next/image";

export default function ThoughtMirror() {
    return (
        <div
            className="relative flex items-center justify-center min-h-screen bg-no-repeat bg-cover px-6
            transform translate-x-0"
            style={{
                backgroundImage: `url('/torn.webp')`,
                backgroundSize: "112%",
                backgroundPosition: "center 90px",
            }}
        >
            {/* Pencil (Kalem) on the left */}
            <Image
                src="/kalem.svg"
                alt="Kalem Pencil"
                width={600}
                height={700}
                className="absolute right-240 bottom-0 rotate-15"
            />

            <Image
                src="/silgi.svg"
                alt="Kalem Pencil"
                width={500}
                height={700}
                className="absolute left-10 top-90 rotate-0"
            />

            {/* Content Box */}
            <div className="absolute bg-transparent bg-opacity-80 p-10 rounded-lg max-w-3xl text-center">
                <Image
                    src="/taketime.png"
                    alt="taketime-text"
                    width={600}
                    height={800}
                    className="absolute right-20 bottom-50 rotate-0 transform translate-x-100"
                />


                <div className="transform translate-y-40 translate-x-40 mx-auto" style={{ minWidth: "800px" }}>
                    <p className="text-xs text-gray-700 mt-4 text-right rotate-90 translate-y-[-118px] translate-x-110 mx-sm"
                       style={{ fontSize: "16.7px", color: "#0099FF" }}>
                        <strong>Reflect. Recognize. Reframe.</strong>
                    </p>
                    <p className="text-xs text-gray-700 mt-4 text-right" style={{fontSize: "19px"}}>
                        <strong>ThoughtMirror</strong> is your personal space for self-reflection and mental clarity.
                        Designed to help
                        you recognize cognitive distortions in your writing, it underlines unhelpful thought patterns in
                        real time—
                        empowering you to challenge and reframe them.
                    </p>
                    <p className="text-xs text-gray-700 mt-4 text-right" style={{fontSize: "19px"}}>
                        With an integrated calendar, you can track your progress, observe trends in your thinking, and
                        celebrate personal growth over time. Whether you're looking to build healthier thought habits,
                        cultivate self-awareness, or gain insight into your mindset, ThoughtMirror supports you—one
                        journal entry at a time.
                    </p>
                    <p className="text-xs text-gray-700 mt-4 text-right" style={{fontSize: "19px"}}>
                        Start your journey toward clearer thinking today.
                    </p>
                </div>
            </div>
        </div>
    );
}
