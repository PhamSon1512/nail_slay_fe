import { useCallback, useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import toast from 'react-hot-toast';
import { authUserAtom, serverCartItemsAtom, serverCartSubtotalAtom } from '~/utils/atoms';
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
  const items = useAtomValue(serverCartItemsAtom);
  const subtotal = useAtomValue(serverCartSubtotalAtom);
  const setItems = useSetAtom(serverCartItemsAtom);
  const setSubtotal = useSetAtom(serverCartSubtotalAtom);
  const [loading, setLoading] = useState(false);

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
    void refresh();
  }, [refresh]);

  const applyOptimistic = (nextItems: CartItem[]) => {
    setItems(nextItems);
    setSubtotal(calcSubtotal(nextItems));
  };

  const add = async (productId: string, quantity = 1, variantId?: string) => {
    await addCartItem(productId, quantity, variantId);
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

  const changeProductQty = async (productId: string, delta: number, variantId?: string) => {
    const resolveItem = async () => {
      const cached = items.find(
        (entry) => entry.product.id === productId && (entry.variantId ?? undefined) === variantId,
      );
      if (cached?.id) return cached;

      try {
        const data = await fetchCart();
        setItems(data.items);
        setSubtotal(data.subtotal);
        return data.items.find(
          (entry) => entry.product.id === productId && (entry.variantId ?? undefined) === variantId,
        );
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
