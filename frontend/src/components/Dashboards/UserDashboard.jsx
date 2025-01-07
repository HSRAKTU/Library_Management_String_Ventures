import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { Loader2, Search, BookOpen, RefreshCw, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrowedBooks();
  }, [currentPage]);

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/transaction/history`, {
        withCredentials: true,
      });
      console.log(response)
      setBooks(response.data.data.docs);
      setTotalPages(response.data.data.totalPages);
      setTotalBorrowed(response.data.data.totalDocs);
    } catch (err) {
      setError('Failed to fetch borrowed books. Please try again later.');
      console.error('Error fetching borrowed books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBorrowedBooks();
  };

  const handleReturn = async (bookId) => {
    try {
      await axios.post(`/api/v1/transaction/return`, { bookId }, { withCredentials: true });
      toast({
        title: "Success",
        description: "Book returned successfully",
      });
      fetchBorrowedBooks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to return the book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReBorrow = async (bookId) => {
    try {
      //await axios.post(`/api/v1/transaction/reborrow`, { bookId }, { withCredentials: true });
      toast({
        title: "Success",
        description: "Book re-borrowed successfully",
      });
      fetchBorrowedBooks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to re-borrow the book. Please try again.",
        variant: "destructive",
      });
    }
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
            Your Borrowed Books
          </h1>

          <div className="flex gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex-grow flex gap-2">
              <Input
                type="text"
                placeholder="Search your books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <Card
                key={book._id}
                className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="p-0">
                  <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden">
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="object-cover object-center w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
                    />
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
                  <Button variant="outline" onClick={() => handleReturn(book._id)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Return
                  </Button>
                  <Button variant="outline" onClick={() => handleReBorrow(book._id)}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Re-Borrow
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Pagination
            className="mt-8"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Stats</h2>
            <p>Total books borrowed: {totalBorrowed}</p>
          </div>
    </div>
  );
}

