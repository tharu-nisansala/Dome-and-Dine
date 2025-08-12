import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, query, onSnapshot, deleteDoc, doc, where, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BoardingPlace } from "@/utils/boardingPlaceTypes";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "@/components/owner/LoadingSpinner";
import DeleteConfirmationDialog from "@/components/owner/DeleteConfirmationDialog";
import AddBoardingRoomModal from "@/components/owner/AddBoardingRoomModal";
import EditBoardingRoomModal from "@/components/owner/EditBoardingRoomModal";
import BoardingRoomHeader from "@/components/owner/BoardingRoomHeader";
import BoardingRoomsGrid from "@/components/owner/BoardingRoomsGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ManageBoardingRooms: React.FC = () => {
    const [user] = useAuthState(auth);
    const [boardingPlaces, setBoardingPlaces] = useState<BoardingPlace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteBoardingPlaceId, setDeleteBoardingPlaceId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedBoardingPlace, setSelectedBoardingPlace] = useState<BoardingPlace | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const q = query(
            collection(db, "boardingPlaces"),
            where("ownerId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                const places = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date(),
                })) as BoardingPlace[];
                setBoardingPlaces(places);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error fetching boarding places:", error);
                toast.error("Failed to fetch boarding places");
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user, navigate]);

    const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
        try {
            const boardingRef = doc(db, "boardingPlaces", id);
            await updateDoc(boardingRef, { isAvailable });
            toast.success(`Boarding room ${isAvailable ? 'marked as available' : 'marked as booked'}`);
        } catch (error) {
            console.error("Error updating availability:", error);
            toast.error("Failed to update availability status");
        }
    };

    const handleDeleteBoardingPlace = async () => {
        if (!deleteBoardingPlaceId || !user) {
            toast.error("Unable to delete: Missing required information");
            return;
        }

        try {
            const boardingPlaceRef = doc(db, "boardingPlaces", deleteBoardingPlaceId);
            await deleteDoc(boardingPlaceRef);
            toast.success("Boarding place deleted successfully");
            setIsDeleteOpen(false);
            setDeleteBoardingPlaceId(null);
        } catch (error) {
            console.error("Error deleting boarding place:", error);
            toast.error("Failed to delete boarding place. Please try again.");
        }
    };

    const handleAddBoardingRoom = async (boardingRoom: BoardingPlace) => {
        setBoardingPlaces(prev => [...prev, boardingRoom]);
    };

    const handleEditBoardingPlace = (boardingPlace: BoardingPlace) => {
        setSelectedBoardingPlace(boardingPlace);
        setIsEditModalOpen(true);
    };

    const handleUpdateBoardingPlace = (updatedBoardingPlace: BoardingPlace) => {
        setBoardingPlaces(prev =>
            prev.map(place =>
                place.id === updatedBoardingPlace.id ? updatedBoardingPlace : place
            )
        );
    };

    const handleManageDetails = (boardingPlace: BoardingPlace) => {
        navigate(`/boarding-room/${boardingPlace.id}/details`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        onClick={() => navigate('/shop-dashboard')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </div>

                <BoardingRoomHeader onAddNew={() => setIsAddModalOpen(true)} />
                <BoardingRoomsGrid 
                    boardingPlaces={boardingPlaces}
                    onEdit={handleEditBoardingPlace}
                    onDelete={(id) => {
                        setDeleteBoardingPlaceId(id);
                        setIsDeleteOpen(true);
                    }}
                    onManageDetails={handleManageDetails}
                    onToggleAvailability={handleToggleAvailability}
                />

                <DeleteConfirmationDialog
                    isOpen={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    onConfirm={handleDeleteBoardingPlace}
                />

                <AddBoardingRoomModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddBoardingRoom}
                />

                {selectedBoardingPlace && (
                    <EditBoardingRoomModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setSelectedBoardingPlace(null);
                        }}
                        boardingPlace={selectedBoardingPlace}
                        onUpdate={handleUpdateBoardingPlace}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ManageBoardingRooms;