import type { Route } from './+types/_me';

export const meta = ({}: Route.MetaArgs) => [{ title: 'About' }, { name: 'description', content: 'Welcome to React Router!' }];

export default function About() {
  return <div className="container">about me</div>;
}
