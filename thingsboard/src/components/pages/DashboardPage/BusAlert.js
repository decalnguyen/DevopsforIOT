import { Alert, Button, ToastContainer } from 'react-bootstrap';
import { formatTimestamp } from '~/utils';
import { useEffect, useState } from 'react';

import styles from './Map.module.scss';
import classNames from 'classnames/bind';
import { AnimatePresence, motion } from 'framer-motion';

const cx = classNames.bind(styles);

function BusAlert({ message }) {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onHide();
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [onHide]);

  const getVariant = () => {
    switch (message.type) {
      case 'Entered':
        return 'success';
      case 'Left':
        return 'danger';
      default:
        return '';
    }
  };

  return (
    <Alert variant={getVariant()}>
      <Alert.Heading>My Alert</Alert.Heading>
      <p>
        {message.name} has {message.type} the geofence at {formatTimestamp(message.ts)}
      </p>
      <hr />
      <div className={`d-flex justify-content-end`}></div>
    </Alert>
  );
}

export default BusAlert;
