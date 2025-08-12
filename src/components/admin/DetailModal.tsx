import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { ShopDetailsView } from "./details/ShopDetailsView";
import { BoardingDetailsView } from "./details/BoardingDetailsView";

interface DetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'shops' | 'boardings';
  data: any[];
}

export const DetailModal = ({ open, onOpenChange, type, data }: DetailModalProps) => {
  if (!data || data.length === 0) return null;

  const item = data[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'shops' ? 'Food Shop Details' : 'Boarding Place Details'}
          </DialogTitle>
          <DialogDescription>
            View detailed information about this {type === 'shops' ? 'food shop' : 'boarding place'}.
          </DialogDescription>
        </DialogHeader>
        
        {type === 'shops' ? (
          <ShopDetailsView shop={item} />
        ) : (
          <BoardingDetailsView boarding={item} />
        )}
      </DialogContent>
    </Dialog>
  );
};