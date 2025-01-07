import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Loader2, Search, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Listings() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAvailable, setFilterAvailable] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [currentPage, filterAvailable]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`api/v1/book/getAll`, {
        params: {
          available: filterAvailable,
          page: currentPage,
          limit: 8,
          query: searchTerm,
        },
      });
      setBooks(response.data.data.docs);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const toggleAvailableFilter = () => {
    setFilterAvailable(!filterAvailable);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 animate-fade-in">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-center">
        <BookOpen className="inline-block mr-2 mb-1" />
        Library Catalog
      </h1>

      <div className="flex gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-grow flex gap-2">
          <Input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <Button
          variant={filterAvailable ? "solid" : "outline"}
          onClick={toggleAvailableFilter}
        >
          {filterAvailable ? "Show All" : "Available Only"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <div
            key={book._id}
            className="relative animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <BookCard book={book} />
          </div>
        ))}
      </div>

      <Pagination
        className="mt-8"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

function BookCard({ book }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBorrow = async () => {
    try {
      await axios.post(`/api/v1/transaction/borrow`,{bookId: book._id}, {withCredentials:true});
      toast({
        title: "Success",
        description: `You have successfully borrowed "${book.title}"`,
      });
      setIsOpen(false);
    } catch (error) {
      //console.log(error.response.data)
      toast({
        title: error.response.data?.message,
        description: "Failed to borrow the book.",
        variant: "destructive",
      });
    }
  };

  const handleBorrowClick = () => {
    if (isAuthenticated) {
      setIsOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <Card
      className={`flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 ${
        book.quantity === 0 ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <CardHeader className="p-0">
        <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden relative">
          <img
            src={book.thumbnail}
            alt={book.title}
            className="object-cover object-center w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
          />
          {book.quantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Not Available</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
          {book.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
        <p className="text-sm line-clamp-3">{book.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-muted/50">
        <span className="text-sm font-medium">Year: {book.publicationYear}</span>
        <span className="text-sm font-medium">
          Available: {book.quantity}
        </span>
      </CardFooter>
      {book.quantity > 0 && (
        <>
         {user.role === 'admin' ? ' ': (<Button className="m-4" variant="outline" onClick={handleBorrowClick}>
            Borrow
          </Button>)}
          
          {isAuthenticated && user.role === 'user' && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-4">Borrow Book</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden rounded-lg">
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">by {book.author}</p>
                      <p className="text-sm mb-4">{book.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Publication Year:</span>
                          <p>{book.publicationYear}</p>
                        </div>
                        <div>
                          <span className="font-medium">Available Copies:</span>
                          <p>{book.quantity}</p>
                        </div>
                        <div>
                          <span className="font-medium">ISBN:</span>
                          <p>{book.isbn || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Genre:</span>
                          <p>{book.genre || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBorrow}>Confirm Borrow</Button>
                    </DialogFooter>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {!isAuthenticated && (
            <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Authentication Required</DialogTitle>
                  <DialogDescription>
                    You need to be logged in to borrow books.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAuthModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => navigate('/login')}>Login/Signup</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </Card>
  );
}

