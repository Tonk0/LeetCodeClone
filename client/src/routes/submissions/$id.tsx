import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <div>Hello /submissions/$id!</div>;
}

export const Route = createFileRoute('/submissions/$id')({
  component: RouteComponent,
});
