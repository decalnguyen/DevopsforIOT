import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useReducer, useRef } from 'react';

dayjs.extend(duration);
dayjs.extend(relativeTime);

// const Wrapper = styled.div`
//   color: #666;
// `;

const Wrapper = () => {
  return <div style={{ color: '#666' }}></div>;
};

export function TimeTracker({ createdAt }) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const intervalRef = useRef();

  // refresh value of `createdAt` every ~ 1 minute
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      forceUpdate();
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Wrapper>
      <span>{dayjs(createdAt).fromNow()}</span>
    </Wrapper>
  );
}
