import { useEffect, useRef, useCallback, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import toast from 'react-hot-toast';
import {
  authUserAtom,
  cartAtom,
  serverCartItemsAtom,
  serverCartSubtotalAtom,
} from '~/utils/atoms';
import type { CartItem } from '~/utils/api/cart';
import {
  addCartItem,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '~/utils/api/cart';

function calcSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function useServerCart() {
  const authUser = useAtomValue(authUserAtom);
  const [localCart, setLocalCart] = useAtom(cartAtom);
  const items = useAtomValue(serverCartItemsAtom);
  const subtotal = useAtomValue(serverCartSubtotalAtom);
  const setItems = useSetAtom(serverCartItemsAtom);
  const setSubtotal = useSetAtom(serverCartSubtotalAtom);
  const [loading, setLoading] = useState(false);
  const mergedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!authUser) {
      setItems([]);
      setSubtotal(0);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCart();
      setItems(data.items);
      setSubtotal(data.subtotal);
    } catch {
      setItems([]);
      setSubtotal(0);
    } finally {
      setLoading(false);
    }
  }, [authUser, setItems, setSubtotal]);

  useEffect(() => {
    if (!authUser) {
      mergedRef.current = false;
      void refresh();
      return;
    }
    if (mergedRef.current || localCart.length === 0) {
      void refresh();
      return;
    }
    mergedRef.current = true;
    (async () => {
      for (const item of localCart) {
        try {
          await addCartItem(item.id, item.quantity);
        } catch {
          // skip invalid items
        }
      }
      setLocalCart([]);
      await refresh();
    })();
  }, [authUser, localCart, refresh, setLocalCart]);

  const applyOptimistic = (nextItems: CartItem[]) => {
    setItems(nextItems);
    setSubtotal(calcSubtotal(nextItems));
  };

  const add = async (productId: string, quantity = 1) => {
    await addCartItem(productId, quantity);
    toast.success('Đã thêm vào giỏ hàng');
    await refresh();
  };

  const updateQty = async (cartItemId: string, quantity: number) => {
    if (!cartItemId) {
      await refresh();
      return;
    }

    const prevItems = items;
    const prevSubtotal = subtotal;
    const nextItems =
      quantity <= 0
        ? items.filter((item) => item.id !== cartItemId)
        : items.map((item) => (item.id === cartItemId ? { ...item, quantity } : item));
    applyOptimistic(nextItems);

    try {
      if (quantity <= 0) {
        await removeCartItem(cartItemId);
      } else {
        await updateCartItem(cartItemId, quantity);
      }
      await refresh();
    } catch {
      setItems(prevItems);
      setSubtotal(prevSubtotal);
      throw new Error('cart-update-failed');
    }
  };

  const remove = async (cartItemId: string) => {
    if (!cartItemId) {
      await refresh();
      return;
    }
    await updateQty(cartItemId, 0);
    toast.success('Đã xóa khỏi giỏ');
  };

  const changeProductQty = async (productId: string, delta: number) => {
    const resolveItem = async () => {
      const cached = items.find((entry) => entry.product.id === productId);
      if (cached?.id) return cached;

      try {
        const data = await fetchCart();
        setItems(data.items);
        setSubtotal(data.subtotal);
        return data.items.find((entry) => entry.product.id === productId);
      } catch {
        return undefined;
      }
    };

    const item = await resolveItem();
    if (!item?.id) return;

    const nextQty = item.quantity + delta;
    if (nextQty <= 0) {
      await remove(item.id);
      return;
    }
    await updateQty(item.id, nextQty);
  };

  return {
    items,
    subtotal,
    loading,
    refresh,
    add,
    updateQty,
    remove,
    changeProductQty,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
