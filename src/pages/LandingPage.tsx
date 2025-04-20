// import React from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { Facebook, BarChart, PieChart, TrendingUp, Zap, Activity } from 'lucide-react';
// import { Button } from "@/components/ui/button";

// const Landing = () => {
//   const navigate = useNavigate();

//   const handleNavigation = (e) => {
//     e.preventDefault(); // Prevent any default button behavior
//     console.log('Navigating to /index');
//     navigate('/index');
//   };
  
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.3,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//     },
//   };

//   const floatingAnimation = {
//     y: [-10, 10],
//     transition: {
//       y: {
//         duration: 2,
//         repeat: Infinity,
//         repeatType: "reverse",
//         ease: "easeInOut"
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-100 via-teal-200 to-teal-300 dark:from-teal-900 dark:via-teal-800 dark:to-teal-700 relative overflow-hidden font-sans">
//       {/* Animated background elements */}
//       <motion.div 
//         className="absolute top-20 left-10 w-64 h-64 bg-teal-200/30 dark:bg-teal-600/30 rounded-full blur-3xl"
//         animate={{
//           scale: [1, 1.2, 1],
//           opacity: [0.3, 0.5, 0.3],
//         }}
//         transition={{
//           duration: 5,
//           repeat: Infinity,
//         }}
//       />
//       <motion.div 
//         className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300/30 dark:bg-teal-500/30 rounded-full blur-3xl"
//         animate={{
//           scale: [1.2, 1, 1.2],
//           opacity: [0.5, 0.3, 0.5],
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//         }}
//       />

//       <div className="container mx-auto px-4 py-20 relative z-10">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="flex flex-col items-center text-center"
//         >
//           {/* Logo Section */}
//           <motion.div 
//             variants={itemVariants}
//             className="mb-8 flex items-center gap-4"
//           >
//             <motion.div
//               animate={floatingAnimation}
//               className="bg-white dark:bg-teal-800 p-4 rounded-2xl shadow-xl"
//             >
//               <Facebook className="w-12 h-12 text-teal-500 dark:text-teal-300" />
//             </motion.div>
//           </motion.div>

//           {/* Main Title */}
//           <motion.h1 
//             variants={itemVariants}
//             className="font-display text-6xl font-bold text-teal-800 dark:text-teal-100 mb-6 tracking-tight leading-tight"
//           >
//             Meta Campaign Dashboard
//           </motion.h1>

//           {/* Subtitle */}
//           <motion.p 
//             variants={itemVariants}
//             className="font-body text-xl text-teal-700 dark:text-teal-200 mb-12 max-w-2xl leading-relaxed"
//           >
//             Transform your Meta advertising insights into actionable strategies with our powerful analytics dashboard
//           </motion.p>

//           {/* Features Grid */}
//           <motion.div 
//             variants={containerVariants}
//             className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto"
//           >
//             {[
//               { icon: BarChart, title: "Real-time Analytics" },
//               { icon: PieChart, title: "Demographics Insights" },
//               { icon: TrendingUp, title: "Performance Metrics" },
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 variants={itemVariants}
//                 className="bg-white/30 dark:bg-teal-800/30 backdrop-blur-lg rounded-2xl p-6 text-teal-800 dark:text-teal-100 hover:bg-white/40 dark:hover:bg-teal-700/40 transition-colors"
//               >
//                 <motion.div animate={floatingAnimation}>
//                   <feature.icon className="w-10 h-10 mb-4 mx-auto text-teal-600 dark:text-teal-300" />
//                 </motion.div>
//                 <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* CTA Button */}
//           <Button
//   onClick={handleNavigation}
//   type="button"
//   role="button"
//   tabIndex={0}
//   aria-label="Launch Dashboard"
//   className="font-display bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg flex items-center gap-2 transition-all duration-300"
// >
//   <Zap className="w-5 h-5" />
//   Launch Dashboard
//   <Activity className="w-5 h-5" />
// </Button>

//           {/* Floating Elements */}
//           <motion.div className="absolute top-40 right-20" animate={floatingAnimation}>
//             <div className="w-20 h-20 bg-teal-200/40 dark:bg-teal-600/40 rounded-full blur-xl" />
//           </motion.div>
//           <motion.div className="absolute bottom-40 left-20" animate={{
//             ...floatingAnimation,
//             transition: { delay: 1 }
//           }}>
//             <div className="w-32 h-32 bg-teal-300/40 dark:bg-teal-500/40 rounded-full blur-xl" />
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Landing;

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, PieChart, TrendingUp, Zap, LightbulbIcon, Rocket } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  const handleNavigation = (e) => {
    e.preventDefault();
    navigate('/index');
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const featureItems = [
    { 
      icon: BarChart, 
      title: "Real-time Analytics",
      description: "Track performance metrics in real-time with instant updates" 
    },
    { 
      icon: PieChart, 
      title: "Demographics Insights",
      description: "Deep dive into audience demographics and behaviors" 
    },
    { 
      icon: TrendingUp, 
      title: "Performance Metrics",
      description: "Comprehensive metrics for informed decision making" 
    },
    { 
      icon: Rocket, 
      title: "Campaign Targeting",
      description: "Optimize your targeting with AI-powered insights" 
    },
    { 
      icon: LightbulbIcon, 
      title: "Smart Recommendations",
      description: "Get actionable insights to improve performance" 
    },
    { 
      icon: Zap, 
      title: "Quick Optimization",
      description: "One-click optimizations for better results" 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        {/* Header with Meta Ads Analytics Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-center mb-14"
        >
          <div className="bg-white py-3 px-6 rounded-full shadow-md flex items-center gap-2">
            <svg
              className="w-6 h-6 text-teal-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.05,19.05H5.33A1.28,1.28,0,0,1,4,17.78v-6a1.28,1.28,0,0,1,1.33-1.28H9.05a1.28,1.28,0,0,1,1.33,1.28v6A1.28,1.28,0,0,1,9.05,19.05ZM10.69,7a3.22,3.22,0,0,1-4.14.18A3.22,3.22,0,0,1,5.4,3.5a3.22,3.22,0,0,1,4.14-.18A3.22,3.22,0,0,1,10.69,7Zm8,.6a2.92,2.92,0,0,1-3.66-.4,2.92,2.92,0,0,1-.37-3.63,2.92,2.92,0,0,1,3.66.4A2.92,2.92,0,0,1,18.72,7.62Zm.76,10.5H15.9a1.17,1.17,0,0,1-1.22-1.13V11.88A1.17,1.17,0,0,1,15.9,10.75h3.58a1.17,1.17,0,0,1,1.22,1.13v5.11A1.17,1.17,0,0,1,19.48,18.12Z"
                fill="currentColor"
              />
            </svg>
            <span className="font-medium text-gray-800">Meta Ads Analytics</span>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Main Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight"
          >
            <span className="text-gray-900">Transform Your </span>
            <span className="text-teal-500">Meta Campaigns</span>
            <br />
            <span className="text-gray-900">with Powerful Analytics</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-600 mb-12 max-w-2xl"
          >
            Get instant insights into your advertising performance and make data-driven decisions with our intuitive dashboard
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20">
            <Button
              onClick={handleNavigation}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-6 rounded-md text-base font-medium flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Launch Dashboard
            </Button>
            
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-800 border-gray-200 px-6 py-6 rounded-md text-base font-medium"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {featureItems.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg p-8 shadow-sm text-left flex flex-col items-start"
              >
                <div className="text-teal-500 mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;