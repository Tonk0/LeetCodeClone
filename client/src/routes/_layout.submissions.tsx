import { createFileRoute } from '@tanstack/react-router';

type SubmissionsSearch = {
  page: number,
};

function RouteComponent() {
  return <div>Hello /_layout/submissions!</div>;
}

export const Route = createFileRoute('/_layout/submissions')({
  validateSearch: (search: Record<string, unknown>): SubmissionsSearch => (
    {
      page: Number(search?.page ?? 1),
    }
  ),
  component: RouteComponent,
});
