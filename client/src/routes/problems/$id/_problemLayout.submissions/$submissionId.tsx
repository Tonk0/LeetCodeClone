/* eslint-disable @typescript-eslint/no-use-before-define */
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { usePanel } from '@/context/PanelContext';
import { fetchSubmission } from '@/helpers/api';
import { SubmissionDetails } from '@/components/problem/SubmissionDetails';

function RouteComponent() {
  const { setRightPanel, leftPanel } = usePanel();
  const { id, submissionId } = Route.useParams();
  const { refresh } = Route.useSearch();
  const navigate = useNavigate();
  const submission = Route.useLoaderData();
  useEffect(() => {
    if (leftPanel === null) {
      navigate({ to: '/problems/$id/desc', params: { id } });
    }
    sessionStorage.setItem('submissionId', submissionId);
    setRightPanel(<SubmissionDetails submission={submission} />);
  }, [setRightPanel, submissionId, id, leftPanel, navigate, refresh, submission]);
  return null;
}

export const Route = createFileRoute(
  '/problems/$id/_problemLayout/submissions/$submissionId',
)({
  component: RouteComponent,
  validateSearch: (search) => ({ refresh: search.refresh ?? null }),
  loader: ({ params: { submissionId } }) => fetchSubmission(submissionId),
});
