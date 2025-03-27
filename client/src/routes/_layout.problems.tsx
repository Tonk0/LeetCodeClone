import { createFileRoute } from '@tanstack/react-router';
import { Flex } from '@chakra-ui/react';
import { fetchProblems } from '@/helpers/api';
import SkeletonLoader from '@/components/problem/SkeletonLoader';
import Tags from '@/components/problem/Tags';
import ProblemList from '@/components/problem/ProblemList';

type ProblemsSearch = {
  page: number,
  tags?: string,
  search?: string,
  status?: string,
};

function RouteComponent() {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const problems = Route.useLoaderData();
  return (
    <Flex gap="5px" width={{ lg: '60%', base: '100%' }} direction="column" align="center" flexGrow="1">
      <Tags />
      <ProblemList problems={problems} />
    </Flex>
  );
}

export const Route = createFileRoute('/_layout/problems')({
  validateSearch: (search: Record<string, unknown>) : ProblemsSearch => (
    {
      page: Number(search?.page ?? 1),
      tags: (search.tags as string),
      search: (search.search as string),
      status: (search.status as string),
    }
  ),
  pendingComponent: () => <SkeletonLoader />,
  loaderDeps: ({
    search: {
      search, tags, page, status,
    },
  }) => ({
    search,
    tags,
    page,
    status,
  }),
  loader: async ({
    deps: {
      search, tags, page, status,
    },
  }) => fetchProblems({
    search, tags, page, status,
  }),
  component: RouteComponent,
});
