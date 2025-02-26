import { createFileRoute } from '@tanstack/react-router';

function Register() {
  return <div>Hello register</div>;
}

export const Route = createFileRoute('/register')({
  component: Register,
});
