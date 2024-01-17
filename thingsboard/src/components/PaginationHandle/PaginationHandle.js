import { Pagination } from 'react-bootstrap';
import classNames from 'classnames/bind';
import styles from './PaginationHandle.module.scss';
import Footer from '../Footer';
import { useCallback, useEffect, useState } from 'react';

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

function PaginationHandle({ currentPage, show, setCurrentPage, maxNum = 1, hr = true, footerStyle, paginationStyle }) {
  const [items, setItems] = useState();
  const renderItems = useCallback(() => {
    if (!show) setItems(null);
    return (
      <Pagination size="lg" className={cx('wrapper')}>
        <Pagination.First disabled={currentPage <= 1} onClick={() => setCurrentPage(1)} key={-1} />
        <Pagination.Prev disabled={currentPage <= 1} onClick={() => setCurrentPage((prev) => prev - 1)} key={0} />
        {currentPage - 2 >= 1 && (
          <Pagination.Item onClick={() => setCurrentPage(currentPage - 2)} key={`first-${currentPage - 2}`}>
            {currentPage - 2}
          </Pagination.Item>
        )}
        {currentPage - 1 >= 1 && (
          <Pagination.Item onClick={() => setCurrentPage(currentPage - 1)} key={`first-${currentPage - 1}`}>
            {currentPage - 1}
          </Pagination.Item>
        )}
        <Pagination.Item active onClick={() => setCurrentPage(currentPage)} key={`first-${currentPage}`}>
          {currentPage}
        </Pagination.Item>
        {currentPage + 1 <= maxNum && (
          <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)} key={`first-${currentPage + 1}`}>
            {currentPage + 1}
          </Pagination.Item>
        )}
        {currentPage + 2 <= maxNum && (
          <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)} key={`first-${currentPage + 2}`}>
            {currentPage + 2}
          </Pagination.Item>
        )}
        <Pagination.Next
          disabled={currentPage >= maxNum}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          key={maxNum + 1}
        />
        <Pagination.Last disabled={currentPage >= maxNum} onClick={() => setCurrentPage(maxNum)} key={maxNum + 2} />
      </Pagination>
    );
  }, [currentPage, maxNum, setCurrentPage]);
  useEffect(() => {
    setItems(renderItems());
  }, [currentPage, maxNum, setCurrentPage, renderItems]);

  return (
    <Footer style={{ height: '60px', ...footerStyle }}>
      {hr && <hr />}
      <div style={{ paginationStyle }}>{items}</div>
    </Footer>
  );
}

export default PaginationHandle;
