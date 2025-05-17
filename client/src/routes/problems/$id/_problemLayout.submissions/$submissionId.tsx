import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { usePanel } from '@/context/PanelContext';

function RouteComponent() {
  const { setRightPanel, leftPanel } = usePanel();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const { id, submissionId } = Route.useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (leftPanel === null) {
      navigate({ to: '/problems/$id/desc', params: { id } });
    }
    sessionStorage.setItem('submissionId', submissionId);
    setRightPanel(<div>Это детали попытки</div>);
  }, [setRightPanel, submissionId, id, leftPanel, navigate]);
  return null;
}

export const Route = createFileRoute(
  '/problems/$id/_problemLayout/submissions/$submissionId',
)({
  component: RouteComponent,
});
