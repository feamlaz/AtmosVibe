import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function AnimatedButton({ className, children, ...props }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.15 }}
      className={clsx('glass-button', className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
