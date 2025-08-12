import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import AddListingModal from "@/components/owner/AddListingModal";
import EditListingModal from "@/components/owner/EditListingModal";
import { BoardingPlace } from "@/utils/boardingPlaceTypes";

interface Listing extends BoardingPlace {
  type: 'boarding';
  address: string;
}

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          navigate("/login");
          return;
        }

        const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          if (userData.userType !== 'shopOwner' && userData.userType !== 'boardingOwner') {
            navigate("/dashboard");
            toast.error("Access denied. Owner privileges required.");
            return;
          }
        }

        fetchListings(user.uid);
      });

      return () => unsubscribe();
    };

    checkAuth();
  }, [navigate]);

  const fetchListings = async (userId: string) => {
    try {
      const q = query(collection(db, "listings"), where("ownerId", "==", userId));
      const querySnapshot = await getDocs(q);
      const listingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[];
      setListings(listingsData);
    } catch (error) {
      toast.error("Failed to fetch listings");
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    try {
      await deleteDoc(doc(db, "listings", listingId));
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      toast.success("Listing deleted successfully");
    } catch (error) {
      toast.error("Failed to delete listing");
      console.error("Error deleting listing:", error);
    }
  };

  const handleEdit = (listing: Listing) => {
    setSelectedListing(listing);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedListing: Partial<Listing>) => {
    if (!selectedListing) return;

    try {
      const listingRef = doc(db, "listings", selectedListing.id);
      await updateDoc(listingRef, updatedListing);
      
      setListings(prev => prev.map(listing => 
        listing.id === selectedListing.id ? { ...listing, ...updatedListing } : listing
      ));
      
      toast.success("Listing updated successfully");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Listings</h1>
          <Button onClick={() => setShowAddModal(true)}>Add New Listing</Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>{listing.name}</TableCell>
                  <TableCell className="capitalize">{listing.type}</TableCell>
                  <TableCell>Rs. {listing.price}</TableCell>
                  <TableCell>{listing.address}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(listing)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(listing.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      <Footer />

      <AddListingModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(newListing) => {
          setListings(prev => [...prev, newListing as Listing]);
          setShowAddModal(false);
        }}
      />

      {selectedListing && (
        <EditListingModal
          open={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedListing(null);
          }}
          listing={selectedListing}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;
