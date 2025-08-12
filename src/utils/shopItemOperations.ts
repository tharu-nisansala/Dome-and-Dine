import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { CreateShopItemDTO, UpdateShopItemDTO, ShopItem } from '../types/ShopItem';

export const createShopItem = async (data: CreateShopItemDTO): Promise<string> => {
  const docRef = await addDoc(collection(db, 'shopItems'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateShopItem = async (itemId: string, data: UpdateShopItemDTO): Promise<void> => {
  const itemRef = doc(db, 'shopItems', itemId);
  await updateDoc(itemRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteShopItem = async (itemId: string): Promise<void> => {
  const itemRef = doc(db, 'shopItems', itemId);
  await deleteDoc(itemRef);
};

export const getShopItems = async (shopId: string): Promise<ShopItem[]> => {
  const q = query(
    collection(db, 'shopItems'),
    where('shopId', '==', shopId)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as ShopItem[];
};