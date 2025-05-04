import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { usePanel } from '@/context/PanelContext';
import { ProblemDesc } from '@/components/problem/ProblemDesc';
import { fetchProblem } from '@/helpers/api';

function RouteComponent() {
  const { setLeftPanel } = usePanel();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const task = Route.useLoaderData();
  useEffect(() => {
    setLeftPanel(<ProblemDesc task={task} />);
  }, [setLeftPanel, task]);
  return null;
}

export const Route = createFileRoute('/problems/$id/_problemLayout/desc')({
  component: RouteComponent,
  loader: ({ params: { id } }) => fetchProblem(id),
});
