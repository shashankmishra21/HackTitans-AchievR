import React from "react";
import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import Steps from "../components/Landing/Steps";
import Problem from "../components/Landing/Problem";
import Testimonials from "../components/Landing/Testimonials";
import CTA from "../components/Landing/CTA";
import Footer from "../components/Landing/Footer";
import "../components/Landing/Animations.css";

export default function PremiumAchievRLanding({ user, setUser }) {
  return (
    <div className="bg-white text-gray-900 overflow-hidden font-sans">
      <Navbar user={user} setUser={setUser} />
      <Hero user={user} />
      <Divider />
      <Steps />
      <Divider />
      <Problem />
      <Divider />
      <Testimonials />
      <CTA user={user} />
      <Footer />
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
  );
}