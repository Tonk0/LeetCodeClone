import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { usePanel } from '@/context/PanelContext';

function RouteComponent() {
  const { setRightPanel } = usePanel();

  useEffect(() => {
    setRightPanel(<div>Это детали попытки</div>);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRightPanel]);
  return null;
}

export const Route = createFileRoute(
  '/problems/$id/_problemLayout/submissions/$id',
)({
  component: RouteComponent,
});
