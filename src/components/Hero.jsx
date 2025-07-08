import React, { useRef } from "react";

const Hero = ({ setSearchFilter, setIsSearched }) => {
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
  };

  return (
    <>
      {/* Hero Section with Black Background */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-900 text-white border-b border-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Launch Your <span className="text-blue-400">Career</span> With
                Confidence
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                Connect with top employers and discover opportunities that match
                your skills and ambitions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
