import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  return <div>Hello /problems/$id!</div>;
}

export const Route = createFileRoute('/problems/$id')({
  component: RouteComponent,
});
