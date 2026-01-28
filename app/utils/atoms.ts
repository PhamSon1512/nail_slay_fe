import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const darkModeAtom = atomWithStorage('darkMode', false);
const countAtom = atom(0);
const countryAtom = atom('Japan');
