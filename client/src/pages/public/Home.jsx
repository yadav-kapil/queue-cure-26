import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import Hero from '../../components/home/Hero'
import Features from '../../components/home/Features'
import HowItWorks from '../../components/home/HowItWorks'
import Contact from '../../components/home/Contact'
import CTA from '../../components/home/CTA'
import Footer from '../../components/common/Footer'

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Contact />
      <CTA />
      <Footer />
    </>
  )
}

export default Home

