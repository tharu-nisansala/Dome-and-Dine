import { Card } from "@/components/ui/card";

export const ReceiptHeader = () => {
  return (
    <div className="text-center space-y-4 pb-6 border-b">
      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/bac56020-df80-4dae-9ae2-239f2a0d0894.png" 
          alt="Company Logo" 
          className="h-16 w-auto"
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-primary">Food Circle</h2>
        <p className="text-sm text-gray-600">Your Trusted Food Delivery Partner</p>
        <p className="text-xs text-gray-500">
          123 University Road, Colombo<br />
          Tel: +94 11 234 5678<br />
          Email: support@foodcircle.lk
        </p>
      </div>
    </div>
  );
};