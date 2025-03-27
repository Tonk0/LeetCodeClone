import { ButtonGroup, IconButton } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot,
} from './ui/pagination';
import { fetchPagesForProblems } from '@/helpers/api';

function PageSelector() {
  const router = useRouterState();
  const prevLocation = useRef(router.location.pathname);
  const [page, setPage] = useState(router.location.search.page ?? 1);
  const navigate = useNavigate();

  const { data: pageCount } = useQuery({
    queryKey: [router.location.pathname, router.location.search],
    queryFn: () => {
      if (router.location.pathname === '/problems') {
        return fetchPagesForProblems(router.location.search);
      }
      return { numOfPages: 1 };
    },
  });

  useEffect(() => {
    if (prevLocation.current !== router.location.pathname) {
      setPage(1);
      prevLocation.current = router.location.pathname;
    }
  }, [router.location.pathname]);

  useEffect(() => {
    if (page !== 1) {
      navigate({
        from: router.location.pathname as '/problems' | '/submissions',
        search: (prev) => ({ ...prev, page }),
        replace: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, navigate]);
  return (
    <PaginationRoot
      count={pageCount?.numOfPages ?? 1}
      pageSize={1}
      onPageChange={(e) => setPage(e.page)}
      page={page}
    >
      <ButtonGroup variant="ghost" size="sm">
        <PaginationPrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </PaginationPrevTrigger>

        <PaginationItems />

        <PaginationNextTrigger asChild>
          <IconButton>
            <LuChevronRight />
          </IconButton>
        </PaginationNextTrigger>
      </ButtonGroup>
    </PaginationRoot>
  );
}

export default PageSelector;
