"use client";
import Image from "next/image";

export default function Homepage() {
  return (
      <div className="relative flex items-center justify-center min-h-screen px-6">
        <Image
            src="/colors.svg"
            alt="colors"
            width={200}
            height={200}
            className="absolute left-5 top-25 margin-bottom-10px"
        />

        <Image
            src="/ssler2.svg"
            alt="marketingimages"
            width={1000}
            height={1000}
            className="absolute left-100 top-100"
        />

        <Image
            src="/refldk2oa.svg"
            alt="marketingimages"
            width={350}
            height={350}
            className="absolute left-105 top-55"
        />

        <Image
            src="/Group 28 (1).svg"
            alt="marketingimages"
            width={420}
            height={420}
            className="absolute left-69 top-85"
        />


        <div className="text-left absolute left-45 top-34">
          <h1 className="text-6xl">welcome to <span className="font-bold"
                                                    style={{color: "black"}}>thought</span></h1>
          <h1 className="text-6xl font-bold" style={{color: "black"}}>mirror.</h1>
        </div>

        <div className="text-left absolute left-65 top-255 max-w-5xl">
          <p className="text-sm " style={{color: "#3071D2"}}>Thought Mirror is powered by advanced AI, leveraging the Gemini API to analyze your journal entries in real time. As you write, our system detects cognitive distortions and provides gentle feedback, helping you recognize unhelpful thought patterns and understand the underlying emotions driving them. By using natural language processing, Thought Mirror offers insights without judgment, allowing you to reflect on your emotions and reframe negative thinking constructively.

            This AI-driven approach ensures that each journal entry becomes an opportunity for self-discovery and personal growth. Over time, Thought Mirror helps you develop greater self-awareness, resilience, and healthier thought habits. Whether you're navigating stress, anxiety, or simply seeking clarity in your thoughts, our intelligent feedback system acts as a supportive companion in your mental wellness journey. With continuous learning and adaptation, Thought Mirror evolves with you, providing increasingly personalized and meaningful reflections to empower your mindfulness and emotional well-being.
          </p>

        </div>

        <div className="text-right absolute right-20 top-65 max-w-lg">
          <p className="text-sm" style={{color: "#3071D2"}}>Our mission at thought mirror® is to create a private environment for users to practice mindfulness and self-care though journaling. While sharing their thoughts and experiences, thought mirror®  will deliver gentle feedback about the user’s journaling, helping them understand where cognitive distortions or negative thinking patterns may lie inside of their journal. </p>
        </div>

        <div className="text-left absolute left-70 top-116 max-w-md">
          <p className="text-sm" style={{color: "#3071D2"}}>
            Our analytics tool allows the user to revisit past journals, as well as view trends in their thinking. Circles in the calender show the days when the user last edited a journal, with each colour representing a different type of cognitive distortion that the user exhibited on the given day. This allows users to visualize the trends in their thinking patterns, and use this to feel a sense of progress in their journaling and potentially identify unhealthy thoughts.
          </p>
        </div>

      </div>
  );
}
