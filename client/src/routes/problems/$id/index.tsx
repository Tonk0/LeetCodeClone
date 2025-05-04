import { createFileRoute, redirect } from '@tanstack/react-router';

function RouteComponent() {
  return null;
}

export const Route = createFileRoute('/problems/$id/')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw redirect({
      to: '/problems/$id/desc',
      params: { id: params.id },
    });
  },
});
