import { Link } from 'react-router';
import { Button } from '@mantine/core';
import LogoDark from './logo-dark.svg?react';
import LogoLight from './logo-light.svg?react';
import { FiFileText } from 'react-icons/fi';
import { GiFireAce } from 'react-icons/gi';

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex min-h-0 flex-1 flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <LogoLight className="block w-full dark:hidden" />
            <LogoDark className="hidden w-full dark:block" />
          </div>
        </header>
        <div className="w-full max-w-[300px] space-y-6 px-4">
          <nav className="space-y-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
            <p className="text-center leading-6 text-gray-700 dark:text-gray-200">What&apos;s next?</p>
            <ul>
              <li>
                <Button className="bg-red-500" variant="filled">
                  <Link to="/about">About</Link>
                </Button>
              </li>
              {resources.map(({ href, text, icon }) => (
                <li key={href}>
                  <a
                    className="group text-primary-500 flex items-center gap-3 self-stretch p-3 leading-normal hover:underline dark:text-green-600"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icon}
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}

const resources = [
  {
    href: 'https://reactrouter.com/docs',
    text: 'React Router Docs',
    icon: <GiFireAce />,
  },
  {
    href: 'https://rmx.as/discord',
    text: 'Join Discord',
    icon: <FiFileText />,
  },
];
