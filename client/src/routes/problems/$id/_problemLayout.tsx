/* eslint-disable @typescript-eslint/no-use-before-define */
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PanelProvider } from '@/context/PanelContext';
import { ProblemPanel } from '@/components/problem/ProblemPanel';

function RouteComponent() {
  return (

    <PanelProvider>
      <ProblemPanel />
      <Outlet />
    </PanelProvider>
  );
}

export const Route = createFileRoute('/problems/$id/_problemLayout')({
  component: RouteComponent,
});
