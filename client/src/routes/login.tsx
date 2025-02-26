import { createFileRoute } from '@tanstack/react-router';

function Login() {
  return <div>Hello login</div>;
}

export const Route = createFileRoute('/login')({
  component: Login,
});
