import type { Route } from './+types/_index';

export const meta = ({}: Route.MetaArgs) => [
  { title: 'New React Router App' },
  { name: 'description', content: 'Welcome to React Router!' },
];

export default function Home({ loaderData }: Route.ComponentProps) {
  return <div className='container'>
    <h1>Welcome to React Router!</h1>
  </div>;
}
