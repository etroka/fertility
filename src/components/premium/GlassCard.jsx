import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  gradient = null,
  hover = true,
  delay = 0
}) {
  const variants = {
    default: 'glass-card',
    strong: 'glass-card-strong',
    subtle: 'bg-white/20 backdrop-blur-sm border border-white/10 shadow-glass'
  };

  const cardClass = variants[variant] || variants.default;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={`
        ${cardClass}
        rounded-3xl
        relative
        overflow-hidden
        transition-all
        duration-300
        ${className}
      `}
    >
      {/* Optional gradient overlay */}
      {gradient && (
        <div
          className={`absolute inset-0 opacity-10 ${gradient}`}
          style={{ zIndex: 0 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
