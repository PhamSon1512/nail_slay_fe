import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { CartItem as ServerCartItem } from '~/utils/api/cart';
import { DEFAULT_HOMEPAGE_CONFIG, type HomepageConfig } from '~/data/homepage';

export const darkModeAtom = atomWithStorage('darkMode', false);

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  slug: string;
  imageUrl?: string;
};

export const cartAtom = atomWithStorage<CartItem[]>('nailslay_cart', []);

export const cartCountAtom = atom((get) =>
  get(cartAtom).reduce((sum, item) => sum + item.quantity, 0),
);

export const cartSubtotalAtom = atom((get) =>
  get(cartAtom).reduce((sum, item) => sum + item.price * item.quantity, 0),
);

export const cartTotalAtom = cartSubtotalAtom;

export const cartVatAtom = atom((get) => Math.round(get(cartSubtotalAtom) * 0.1));

export const cartGrandTotalAtom = atom((get) => get(cartSubtotalAtom) + get(cartVatAtom));

export const serverCartItemsAtom = atom<ServerCartItem[]>([]);
export const serverCartSubtotalAtom = atom(0);
export const serverCartCountAtom = atom((get) =>
  get(serverCartItemsAtom).reduce((sum, item) => sum + item.quantity, 0),
);

export const authTokenAtom = atomWithStorage<string | null>('nailslay_token', null);

export const authUserAtom = atomWithStorage<{
  id: string;
  email: string;
  fullName: string | null;
  phone?: string | null;
  role: string;
} | null>('nailslay_user', null);

export const homepageConfigAtom = atomWithStorage<HomepageConfig>(
  'nailslay_homepage',
  DEFAULT_HOMEPAGE_CONFIG,
);

export const authBootstrapReadyAtom = atom(false);
