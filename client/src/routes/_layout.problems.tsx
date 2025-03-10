import { createFileRoute } from '@tanstack/react-router';

type ProblemsSearch = {
  page: number,
  tag: string,
  search: string,
};

function RouteComponent() {
  return <div>Hello /_layout/problems!</div>;
}

export const Route = createFileRoute('/_layout/problems')({
  validateSearch: (search: Record<string, unknown>) : ProblemsSearch => (
    {
      page: Number(search?.page ?? 1),
      tag: (search.tag as string) || '',
      search: (search.search as string) || '',
    }
  ),
  component: RouteComponent,
});
