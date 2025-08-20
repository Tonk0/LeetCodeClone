/* eslint-disable @typescript-eslint/no-use-before-define */
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { usePanel } from '@/context/PanelContext';

function RouteComponent() {
  const { setRightPanel, leftPanel } = usePanel();
  const { id, submissionId } = Route.useParams();
  const { refresh } = Route.useSearch();
  const navigate = useNavigate();
  useEffect(() => {
    if (leftPanel === null) {
      navigate({ to: '/problems/$id/desc', params: { id } });
    }
    sessionStorage.setItem('submissionId', submissionId);
    setRightPanel(<div>Это детали попытки</div>);
  }, [setRightPanel, submissionId, id, leftPanel, navigate, refresh]);
  return null;
}

export const Route = createFileRoute(
  '/problems/$id/_problemLayout/submissions/$submissionId',
)({
  component: RouteComponent,
  validateSearch: (search) => ({ refresh: search.refresh ?? null }),
});
