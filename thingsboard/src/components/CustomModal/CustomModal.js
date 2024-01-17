import { AnimatePresence, motion } from 'framer-motion';

import styles from './CustomModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CustomModal({ isVisible, children, className, ...props }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="backdrop"
          className={`${cx('modal-backdrop')}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={`${cx('modal')} ${className}`}
            {...props}
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CustomModal;
