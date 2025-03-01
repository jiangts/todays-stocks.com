import { mdiArrowRight } from "@mdi/js";
import Icon from "@mdi/react";

const HowItWorks = () => {
  const steps = [
    {
      number: "️1",
      title: "Our AI scans thousands of stocks daily.",
      description: "Fundamental & technical insights powered by real-time news & data.",
    },
    {
      number: "2",
      title: "Get AI-curated stock picks or add your own watchlist.",
      description: "Choose from top gainers, losers, trending stocks, or your own custom list.",
    },
    {
      number: "3",
      title: "Set alerts & make data-driven decisions.",
      description: "Define your own investment criteria & receive actionable insights.",
    },
  ];

  return (
    <section
      className="py-24 md:py-32 bg-gradient-to-b from-base-100 to-base-200"
      id="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            How It Works
          </h2>
          <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
            Simple steps to transform your investment strategy with AI-powered insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col bg-base-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-base-300 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center">
                <span className="text-4xl font-bold">{step.number}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-4 mt-8 pr-12">
                {step.title}
              </h3>

              <div className="flex items-center mt-3 text-base-content/70">
                <Icon path={mdiArrowRight} className="h-5 w-5 text-primary mr-2" />
                <p>{step.description}</p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-secondary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>

        {/* <div className="mt-16 text-center">
          <button className="btn btn-primary btn-lg">
            Get Started Today
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default HowItWorks;
