import { Accordion, AccordionItem, Autocomplete, AutocompleteItem, Button } from '@heroui/react';
import LogoDark from './logo-dark.svg?react';
import LogoLight from './logo-light.svg?react';
import { FiFileText } from 'react-icons/fi';
import { GiFireAce } from 'react-icons/gi';

export function Welcome() {
  const defaultContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
  const animals = [
    { label: 'Cat', key: 'cat', description: 'The second most popular pet in the world' },
    { label: 'Dog', key: 'dog', description: 'The most popular pet in the world' },
    { label: 'Elephant', key: 'elephant', description: 'The largest land animal' },
    { label: 'Lion', key: 'lion', description: 'The king of the jungle' },
    { label: 'Tiger', key: 'tiger', description: 'The largest cat species' },
    { label: 'Giraffe', key: 'giraffe', description: 'The tallest land animal' },
  ];

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex min-h-0 flex-1 flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <LogoLight className="block w-full dark:hidden" />
            <LogoDark className="hidden w-full dark:block" />
          </div>
        </header>
        <div className="w-full max-w-1/2 space-y-6 px-4">
          <Autocomplete className="max-w-xs" label="Select an animal">
            {animals.map((animal) => (
              <AutocompleteItem key={animal.key}>{animal.label}</AutocompleteItem>
            ))}
          </Autocomplete>
          <Accordion>
            <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
              {defaultContent}
            </AccordionItem>
            <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
              {defaultContent}
            </AccordionItem>
            <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
              {defaultContent}
            </AccordionItem>
          </Accordion>
          <div className="flex flex-wrap items-center gap-4">
            <Button color="default">Default</Button>
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="success">Success</Button>
            <Button color="warning">Warning</Button>
            <Button color="danger">Danger</Button>
          </div>
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
