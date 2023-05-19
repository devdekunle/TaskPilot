import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const WordAnimation = ({words, className ,containerClassName}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, [words.length]);

  return (
    <div className={containerClassName}>
      <AnimatePresence mode='sync'>
              {words.map((word, index) => (
                  <motion.div
                      key={index}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{
                          y: currentWordIndex === index ? 0 : 100,
                          opacity: currentWordIndex === index ? 1 : 0,
                      }}
                      exit={{ y: -100, opacity: 1 }}
                      transition={{ duration: 1 }}
                      className={className}
          >
            {word}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WordAnimation;
