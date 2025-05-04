import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { usePanel } from '@/context/PanelContext';

function RouteComponent() {
  const { setLeftPanel } = usePanel();
  useEffect(() => {
    setLeftPanel(<div>Это попытки</div>);
  }, [setLeftPanel]);
  return null;
}

export const Route = createFileRoute(
  '/problems/$id/_problemLayout/submissions/',
)({
  component: RouteComponent,
});
