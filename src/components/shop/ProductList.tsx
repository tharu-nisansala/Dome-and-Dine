import { Product } from "@/types/Product";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
  onQuantityChange: (productId: string, increment: boolean) => void;
  quantities: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onProductSelect: (product: Product) => void;
}

const ProductList = ({
  products,
  onQuantityChange,
  quantities,
  onAddToCart,
  onProductSelect
}: ProductListProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={quantities[product.id] || 0}
          onQuantityChange={(quantity: number) => onQuantityChange(product.id, quantity > quantities[product.id])}
          onAddToCart={() => onAddToCart(product)}
          onSelect={() => onProductSelect(product)}
          onUpdate={() => {}} // Providing empty function as it's required by the type
          onDelete={() => {}} // Providing empty function as it's required by the type
          selected={false} // Default value as it's required by the type
        />
      ))}
    </div>
  );
};

export default ProductList;