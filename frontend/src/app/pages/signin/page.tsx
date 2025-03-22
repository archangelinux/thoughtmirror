"use client";

import React, { useEffect, useState } from "react";
import { signInWithGoogle } from "@/app/firebase/authService";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/firebaseConfig";

function SendEmail(userEmail: string) {
  const sendEmailToBackend = async (userEmail: string) => {
    try {
      const response = await fetch(
        "localhost:8000/get_email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
      } else {
        console.log(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending number:", error);
      console.log("An error occurred while sending the number.");
    }
  };
  return sendEmailToBackend(userEmail);
}

const SignInWithGoogle: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/pages/dashboard"); // redirect to fashboard
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const user_credential = await signInWithGoogle();

      if (user_credential) {
        const email = user_credential.user.email;
        if (email) {
          SendEmail(email);
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-14 pb-2 pt-10 rounded-2xl shadow-lg max-w-96 w-full flex flex-col justify-start">
        <h2 className="text-2xl font-bold mb-4">Start journaling today!</h2>

        <img
          src="/blue_squiggle.png"
          className="mx-auto mb-3 w-44 h-4"  // Centers the image and adds margin below it
        />

        <h2 className="text-lg mb-12">Login or sign up to start your first journal entry:</h2>

        <button
          onClick={handleGoogleSignIn}
          className="px-6 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition duration-300 mb-3 flex items-center justify-between"
        >
          <img
            src="/google_logo.png"
            alt="Icon"
            className="w-6 h-6 mr-2"
          />
          <span className="flex-grow text-center mr-7">Sign In</span>
        </button>

        <a
          className="text-sm py-0 hover:text-gray-500 transition duration-300"
          href="/pages/signup"
        >
          or Sign Up
        </a>
        <div className="h-14"></div>
        <p className="text-sm mt-2 pt-0 hover:text-gray-500 hover:underline transition duration-300 cursor-pointer">
          Forgot password?
        </p>
      </div>
    </div>

  );
};

export default SignInWithGoogle;
