import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { BoardingCard } from './boarding/BoardingCard';
import { UniversityFilter } from './boarding/UniversityFilter';
import { BoardingPlace } from '@/types/boardingPlaceTypes';

const BoardingPlaces = () => {
  const [boardingPlaces, setBoardingPlaces] = useState<BoardingPlace[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchBoardingPlaces = async (loadMore: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      let boardingQuery;

      if (selectedUniversity) {
        // First get all documents that match the university
        boardingQuery = query(
          collection(db, 'boardingPlaces'),
          where('universities', 'array-contains', selectedUniversity)
        );
      } else {
        // If no university selected, just order by name
        boardingQuery = query(
          collection(db, 'boardingPlaces'),
          orderBy('name')
        );
      }

      if (loadMore && lastVisible) {
        boardingQuery = query(boardingQuery, startAfter(lastVisible));
      }

      // Add limit after other conditions
      boardingQuery = query(boardingQuery, limit(6));

      const querySnapshot = await getDocs(boardingQuery);
      
      if (!querySnapshot.empty) {
        const newBoardingPlaces = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as BoardingPlace)
        }));
        
        setBoardingPlaces(prev => loadMore ? [...prev, ...newBoardingPlaces] : newBoardingPlaces);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === 6);
      } else {
        setHasMore(false);
        if (!loadMore) {
          setBoardingPlaces([]);
        }
      }
    } catch (error) {
      console.error('Error fetching boarding places:', error);
      setError('Error fetching boarding places. Please try again later.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch boarding places. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardingPlaces(false);
  }, [selectedUniversity]);

  const handleReset = () => {
    setSelectedUniversity('');
    setBoardingPlaces([]);
    setLastVisible(null);
    setHasMore(true);
  };

  const handleBookNow = (boardingPlace: BoardingPlace) => {
    navigate('/booking', { state: { boardingPlace } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2 animate-fade-in">
            Find Your Perfect Boarding Place
          </h1>
          <p className="text-center text-gray-600 mb-6 animate-fade-in">
            Browse through our selection of quality boarding places near universities
          </p>
          
          <UniversityFilter
            selectedUniversity={selectedUniversity}
            onUniversityChange={setSelectedUniversity}
            onReset={handleReset}
          />
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <ClipLoader size={50} color="#3498db" />
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-red-500 animate-fade-in">
            {error}
          </div>
        )}

        {boardingPlaces.length === 0 && !loading ? (
          <div className="text-center py-8 text-gray-500 animate-fade-in">
            {selectedUniversity 
              ? 'No boarding places available for the selected university.' 
              : 'No boarding places found.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardingPlaces.map(item => (
              <BoardingCard
                key={item.id}
                item={item}
                onBookNow={handleBookNow}
                isBookingEnabled={!!selectedUniversity}
              />
            ))}
          </div>
        )}

        {hasMore && boardingPlaces.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={() => fetchBoardingPlaces(true)}
              variant="outline"
              className="animate-fade-in"
              disabled={loading}
            >
              {loading ? 'Loading more...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardingPlaces;
