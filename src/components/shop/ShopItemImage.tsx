import { Package2 } from "lucide-react";

interface ShopItemImageProps {
  imageUrl: string;
  name: string;
}

export const ShopItemImage = ({ imageUrl, name }: ShopItemImageProps) => {
  return (
    <div className="aspect-square overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <Package2 className="h-12 w-12 text-gray-400" />
        </div>
      )}
    </div>
  );
};