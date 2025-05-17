import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { usePanel } from '@/context/PanelContext';
import { fetchSubmissionsForProblem } from '@/helpers/api';
import { SubmissionsList } from '@/components/problem/SubmissionsList';

function RouteComponent() {
  const { setLeftPanel } = usePanel();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const submissions = Route.useLoaderData();
  useEffect(() => {
    if (!submissions.success) {
      setLeftPanel(
        <Flex direction="column" gap="5" align="center">
          <p>Сначала нужно авторизоваться</p>
          <Button size="xl" w="50%" asChild>
            <Link to="/login">Войти</Link>
          </Button>
        </Flex>,
      );
    } else {
      setLeftPanel(<SubmissionsList submissions={submissions.submissions || []} />);
    }
  }, [setLeftPanel, submissions]);
  return null;
}

export const Route = createFileRoute(
  '/problems/$id/_problemLayout/submissions/',
)({
  component: RouteComponent,
  loader: async ({ params: { id } }) => {
    try {
      const submissions = await fetchSubmissionsForProblem(id);
      return { success: true, submissions };
    } catch (error) {
      return { success: false, error };
    }
  },
});
