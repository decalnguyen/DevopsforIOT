import { useState } from 'react';

import { Icons, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

import { useNotificationCenter } from 'react-toastify/addons/use-notification-center';
import styled from 'styled-components';

import { Trigger } from './Trigger';
import { ItemActions } from './ItemActions';
import { Switch } from './Switch';
import { TimeTracker } from './TimeTracker';
import { Overlay, OverlayTrigger } from 'react-bootstrap';

// contains framer-motion variants to animate different parts of the UI
// when the notification center is visible or not
// https://www.framer.com/docs/examples/#variants
const variants = {
  container: {
    open: {
      y: 0,
      opacity: 1,
    },
    closed: {
      y: -10,
      opacity: 0,
    },
  },
  // used to stagger item animation when switching from closed to open and vice versa
  content: {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  },
  item: {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  },
};

const UnreadFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  label {
    cursor: pointer;
  }
`;

const Container = styled(motion.section)`
  width: min(60ch, 100ch);
  border-radius: 8px;
  overflow: hidden;
`;

const Footer = styled.footer`
  background: #222;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled(motion.section)`
  background: #fff;
  height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  color: #000;
  padding: 0.2rem;
  position: relative;
  h4 {
    margin: 0;
    text-align: center;
    padding: 2rem;
  }
`;

const IconWrapper = styled.div`
  width: 32px;
`;

const Item = styled(motion.article)`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  gap: 8px;
  padding: 0.8rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Header = styled.header`
  background: #222;
  color: #fff;
  margin: 0;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function NotificationCenter() {
  const { notifications, clear, markAllAsRead, markAsRead, remove, unreadCount } = useNotificationCenter();
  const [showUnreadOnly, toggleFilter] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Trigger onClick={() => setIsOpen(!isOpen)} count={unreadCount} />
      <OverlayTrigger
        show={isOpen}
        placement="right"
        overlay={
          <Container
            style={{ zIndex: '1000' }}
            initial={false}
            variants={variants.container}
            animate={isOpen ? 'open' : 'closed'}
          >
            <Header>
              <h3>Notifications</h3>
              <UnreadFilter>
                <label htmlFor="unread-filter">Only show unread</label>
                <Switch
                  id="unread-filter"
                  checked={showUnreadOnly}
                  onChange={() => {
                    toggleFilter(!showUnreadOnly);
                  }}
                />
              </UnreadFilter>
            </Header>
            <AnimatePresence>
              <Content variants={variants.content} animate={isOpen ? 'open' : 'closed'}>
                {(!notifications?.length || (unreadCount === 0 && showUnreadOnly)) && (
                  <motion.h4 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Your queue is empty! you are all set{' '}
                    <span role="img" aria-label="dunno what to put">
                      🎉
                    </span>
                  </motion.h4>
                )}
                <AnimatePresence>
                  {(showUnreadOnly ? notifications.filter((v) => !v.read) : notifications).map((notification) => {
                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ scale: 0.4, opacity: 0, y: 50 }}
                        exit={{
                          scale: 0,
                          opacity: 0,
                          transition: { duration: 0.2 },
                        }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        style={{ padding: '0.8rem' }}
                      >
                        <Item key={notification.id} variants={variants.item}>
                          <IconWrapper>
                            {notification.icon ||
                              Icons.info({
                                theme: notification.theme || 'light',
                                type: toast.TYPE.INFO,
                              })}
                          </IconWrapper>
                          <div>
                            <div>{notification.content}</div>
                            <TimeTracker createdAt={notification.createdAt} />
                          </div>
                          <ItemActions notification={notification} markAsRead={markAsRead} remove={remove} />
                        </Item>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </Content>
            </AnimatePresence>
            <Footer>
              <button onClick={clear}>Clear All</button>
              <button onClick={markAllAsRead}>Mark All as read</button>
            </Footer>
          </Container>
        }
      ></OverlayTrigger>
    </div>
  );
}
