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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [includeReturned, setIncludeReturned] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();


  useEffect(() => {
    fetchBorrowedBooks();
  }, [currentPage, includeReturned]);

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/transaction/history`, {
        params: {
          includeReturned,
          page: currentPage,
        },
        withCredentials: true,
      });
      // console.log(response)
      setBooks(response.data.data.docs);
      setTotalPages(response.data.data.totalPages);
      setTotalBorrowed(response.data.data.totalDocs);
    } catch (err) {
      setError('Failed to fetch borrowed books. Please try again later.');
      .error('Error fetching borrowed books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      // console.log("BookId:", bookId)
      await axios.patch(`/api/v1/transaction/return`, { bookId }, { withCredentials: true });
      toast({
        title: "Success",
        description: "Book returned successfully",
      });
      fetchBorrowedBooks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to return the transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReBorrow = async (bookId) => {
    try {
      await axios.post(`/api/v1/transaction/borrow`, { bookId }, { withCredentials: true });
      toast({
        title: "Success",
        description: "Book re-borrowed successfully",
      });
      fetchBorrowedBooks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to re-borrow the transaction. Please try again.",
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
      <Tabs defaultValue="yourBooks">
        <TabsContent value="yourBooks">
          <h1 className="text-4xl font-bold mb-8 text-center">
            <BookOpen className="inline-block mr-2 mb-1" />
            Your Borrowed Books
          </h1>

          <div className="flex justify-end mb-8">
            <Button
              variant={includeReturned ? "default" : "outline"}
              onClick={() => {
                setIncludeReturned(!includeReturned);
                setCurrentPage(1);
              }}
            >
              {includeReturned ? "Hide Returned" : "Show All"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((transaction, index) => (
              <Card
                key={transaction._id}
                className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="p-0">
                  <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden">
                    <img
                      src={transaction.bookDetails.thumbnail}
                      alt={transaction.bookDetails.title}
                      className="object-cover object-center w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                  <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
                    {transaction.bookDetails.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">by {transaction.bookDetails.author}</p>
                  <p className="text-sm line-clamp-3">{transaction.bookDetails.description}</p>
                  <p className="text-sm text-muted-foreground">
                  <span className='font-bold'>Borrow Date</span>:{" "}
                  {transaction.borrowDate
                    ? new Date(transaction.borrowDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className='font-bold'>Return Date</span>:{" "}
                  {transaction.returnDate
                    ? new Date(transaction.returnDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not returned yet"}
                </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4 bg-muted/50">
                  {!transaction.returnDate ? (
                    <Button variant="outline" onClick={() => handleReturn(transaction.bookId)}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Return
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => handleReBorrow(transaction._id)}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Re-Borrow
                    </Button>
                  )}
                  
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

