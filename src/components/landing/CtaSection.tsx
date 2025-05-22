
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CtaSection() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    viewport: { once: true, margin: "-100px" }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="bg-gradient-to-r from-pickle-600 to-secondary rounded-3xl p-10 md:p-16 text-white text-center overflow-hidden relative transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Background patterns */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybildIi8+PC9zdmc+')] opacity-50 mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
          
          <div className="relative z-10">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              {...fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join the Pickle Community Today
            </motion.h2>
            <motion.p 
              className="text-white/90 max-w-2xl mx-auto mb-10 text-lg"
              {...fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Create your free account and start playing!
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              {...fadeIn}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/signup">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="gap-2 text-base px-8 py-6 group shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  Sign Up Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 text-base border-white/20 bg-white/10 hover:bg-white/20 text-white px-8 py-6 transition-all w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
