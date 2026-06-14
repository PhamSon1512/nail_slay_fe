import { useEffect, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import toast from 'react-hot-toast';
import { authUserAtom, cartAtom, serverCartItemsAtom, serverCartSubtotalAtom } from '~/utils/atoms';
import { addCartItem, fetchCart } from '~/utils/api/cart';

/** Runs once per storefront session to merge guest cart into server cart. */
export function ServerCartBootstrap() {
  const authUser = useAtomValue(authUserAtom);
  const [localCart, setLocalCart] = useAtom(cartAtom);
  const setItems = useSetAtom(serverCartItemsAtom);
  const setSubtotal = useSetAtom(serverCartSubtotalAtom);
  const mergedRef = useRef(false);

  useEffect(() => {
    if (!authUser) {
      mergedRef.current = false;
      return;
    }
    if (mergedRef.current || localCart.length === 0) return;

    mergedRef.current = true;
    void (async () => {
      let dropped = 0;
      for (const item of localCart) {
        try {
          await addCartItem(item.id, item.quantity, item.variantId);
        } catch {
          dropped += 1;
        }
      }
      setLocalCart([]);
      try {
        const data = await fetchCart();
        setItems(data.items);
        setSubtotal(data.subtotal);
      } catch {
        setItems([]);
        setSubtotal(0);
      }
      if (dropped > 0) {
        toast.error(`${dropped} sản phẩm không thêm được vào giỏ (hết hàng hoặc ngừng bán).`);
      }
    })();
  }, [authUser, localCart, setItems, setLocalCart, setSubtotal]);

  return null;
}
