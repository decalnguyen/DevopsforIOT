import { Pagination } from 'react-bootstrap';
import classNames from 'classnames/bind';
import styles from './PaginationHandle.module.scss';
import Footer from '../Footer';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);
let active = 2;
let items = [];
for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}

function PaginationHandle({ maxNum = 5, size }) {
  const [active, setActive] = useState(1);
  const [items, setItems] = useState([]);
  useEffect(() => {
    const newItems = (
      <Pagination size="lg" className={cx('wrapper')}>
        <Pagination.First disabled={active === 1} onClick={() => setActive(1)} key={-1} />
        <Pagination.Prev disabled={active === 1} onClick={() => setActive((prev) => prev - 1)} key={0} />
        {active - 2 >= 1 && (
          <Pagination.Item onClick={() => setActive(active - 2)} key={active - 2}>
            {active - 2}
          </Pagination.Item>
        )}
        {active - 1 >= 1 && (
          <Pagination.Item onClick={() => setActive(active - 1)} key={active - 1}>
            {active - 1}
          </Pagination.Item>
        )}
        <Pagination.Item active onClick={() => setActive(active)} key={active}>
          {active}
        </Pagination.Item>
        {active + 1 <= maxNum && (
          <Pagination.Item onClick={() => setActive(active + 1)} key={active + 1}>
            {active + 1}
          </Pagination.Item>
        )}
        {active + 2 <= maxNum && (
          <Pagination.Item onClick={() => setActive(active + 2)} key={active + 2}>
            {active + 2}
          </Pagination.Item>
        )}
        <Pagination.Next disabled={active === maxNum} onClick={() => setActive((prev) => prev + 1)} key={maxNum + 1} />
        <Pagination.Last disabled={active === maxNum} onClick={() => setActive(maxNum)} key={maxNum + 2} />
      </Pagination>
    );
    setItems(newItems);
  }, [active, maxNum]);
  return (
    <Footer style={{ height: '60px' }}>
      <hr />
      {items}
    </Footer>
  );
}

export default PaginationHandle;
