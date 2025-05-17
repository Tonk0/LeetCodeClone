import { createFileRoute, Link } from '@tanstack/react-router';
import { useContext } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { AuthContext } from '@/context/AuthContext';
import { SubmissionsPage } from '@/components/submissions/SubmissionsPage';
import { fetchSubmissions } from '@/helpers/api';
import SkeletonLoader from '@/components/submissions/SkeletonLoader';

type SubmissionsSearch = {
  page: number,
  statuses?: string,
  search?: string,
};

function RouteComponent() {
  const { isAuth } = useContext(AuthContext);
  if (!isAuth) {
    return (
      <Flex direction="column" gap="5">
        <p>Сначала нужно авторизоваться</p>
        <Button size="xl" asChild>
          <Link to="/login">Войти</Link>
        </Button>
      </Flex>
    );
  }
  return (
    <SubmissionsPage />
  );
}

export const Route = createFileRoute('/_layout/submissions')({
  validateSearch: (search: Record<string, unknown>): SubmissionsSearch => (
    {
      page: Number(search?.page ?? 1),
      statuses: (search.statuses as string),
      search: (search.search as string),
    }
  ),
  pendingComponent: () => <SkeletonLoader />,
  loaderDeps: ({ search: { search, page, statuses } }) => ({ search, statuses, page }),
  loader: async ({ deps: { search, page, statuses } }) => fetchSubmissions({
    search, statuses, page,
  }),
  component: RouteComponent,
});
