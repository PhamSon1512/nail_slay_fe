import type { Route } from './+types/_index';
import { Welcome } from './welcome';

export const meta = ({}: Route.MetaArgs) => [
  { title: 'New React Router App' },
  { name: 'description', content: 'Welcome to React Router!' },
];

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome />;
}
