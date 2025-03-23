"use client";
import Image from "next/image";

export default function ThoughtMirror() {
    return (
        <div
            className="relative flex items-center justify-center min-h-screen bg-no-repeat bg-cover px-6
            transform translate-x-0"
            style={{
                backgroundImage: `url('/Group 30.svg')`,
                backgroundSize: "100%",
                backgroundPosition: "center ",
            }}
        >

            {/* Content Box */}
            <div className="absolute bg-transparent bg-opacity-80 p-10 rounded-lg max-w-3xl text-center">
                <Image
                    src="/Group 13.svg"
                    alt="taketime-text"
                    width={600}
                    height={800}
                    className="absolute right-34 bottom-40 rotate-0 transform translate-x-100"
                />

                <div className="transform translate-y-40 translate-x-40 mx-auto" style={{ minWidth: "800px" }}>
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
