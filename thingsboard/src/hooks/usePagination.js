import { useEffect, useState } from 'react';

export default function usePagination(totalItems, itemsPerPage) {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [itemsPerPage, totalItems]);

  useEffect(() => setStartIndex((currentPage - 1) * itemsPerPage), [currentPage, itemsPerPage]);
  useEffect(() => setEndIndex(startIndex + itemsPerPage), [itemsPerPage, startIndex]);

  return { totalPages, setCurrentPage, currentPage, startIndex, endIndex };
}
