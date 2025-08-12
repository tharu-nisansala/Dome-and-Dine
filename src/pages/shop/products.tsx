import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { Product } from '@/types/Product';
import { ProductCard } from '@/components/shop/ProductCard';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
      },
      (error) => {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleUpdateProduct = async (productId: string, updatedData: Partial<Product>) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, updatedData);
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      handleUpdateProduct(productId, { quantity: newQuantity });
    }
  };

  const handleAddToCart = (productId: string) => {
    toast.success('Product added to cart');
    // Implement cart functionality here
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={product.quantity || 0}
            onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
            onAddToCart={() => handleAddToCart(product.id)}
            onSelect={() => handleSelectProduct(product.id)}
            onUpdate={(updatedData) => handleUpdateProduct(product.id, updatedData)}
            onDelete={() => handleDeleteProduct(product.id)}
            selected={selectedProducts.includes(product.id)}
          />
        ))}
      </div>
    </div>
  );
}