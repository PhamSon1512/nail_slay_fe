import type { Route } from './+types/_index';

export const meta = ({}: Route.MetaArgs) => [{ title: 'Z9 Studio' }, { name: 'description', content: 'Welcome to Z9 Studio!' }];

export default function Home({ loaderData }: Route.ComponentProps) {
  return <></>;
}
