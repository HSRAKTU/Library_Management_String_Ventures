import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { Loader2, BookOpen, Pencil, Trash, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const { toast } = useToast();
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isUpdateBookOpen, setIsUpdateBookOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    currentlyBorrowedBooks: 0,
    totalAvailableBooks: 0
  })

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    publicationYear: '',
    quantity: 1,
    thumbnail: null,
  });
  const [updateBook, setUpdateBook] = useState({
    _id: '',
    title: '',
    author: '',
    description: '',
    publicationYear: '',
    quantity: 1,
    thumbnail: null,
  });

  

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/book/getAll`, {
        params: {
          page: currentPage,
          limit: 12,
        },
        withCredentials: true,
      });
      getAdminDashboard();
      setBooks(response.data.data.docs);
      setTotalPages(response.data.data.totalPages);
      setTotalBooks(response.data.data.totalDocs);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
      // console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`/api/v1/book/delete/${bookId}`, { withCredentials: true });
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
      fetchBooks();
      getAdminDashboard();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  const getAdminDashboard = async () => {
    try {
      const response = await axios.get(`/api/v1/book/getStats`,{withCredentials: true})
      // console.log(response.data)
      setStats(response.data.data)
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  }

  const handleUpdate = (book) => {
    setUpdateBook({
      _id: book._id,
      title: book.title,
      author: book.author,
      description: book.description,
      publicationYear: book.publicationYear,
      quantity: book.quantity,
      thumbnail: null,
    });
    setIsUpdateBookOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in updateBook) {
        if (key !== '_id') {
          formData.append(key, updateBook[key]);
        }
      }
      await axios.patch(`/api/v1/book/update/${updateBook._id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: "Success",
        description: "Book updated successfully",
      });
      setIsUpdateBookOpen(false);
      fetchBooks();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in newBook) {
        formData.append(key, newBook[key]);
      }
      await axios.post('/api/v1/book/add', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: "Success",
        description: "Book added successfully",
      });
      setIsAddBookOpen(false);
      setNewBook({
        title: '',
        author: '',
        description: '',
        publicationYear: '',
        quantity: 1,
        thumbnail: null,
      });
      fetchBooks();
    } catch (error) {
      // console.log(error)
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBooks();
    getAdminDashboard();
  }, [currentPage,setBooks,setStats, setNewBook, setUpdateBook]);

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
      <Tabs defaultValue="manageBooks">
        <TabsContent value="manageBooks">
          <h1 className="text-4xl font-bold mb-8 text-center">
            <BookOpen className="inline-block mr-2 mb-1" />
            Manage Books
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              <div className="flex justify-end mb-8">
                <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add New Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Book</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new book here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddBook}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="title"
                            value={newBook.title}
                            onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="author" className="text-right">
                            Author
                          </Label>
                          <Input
                            id="author"
                            value={newBook.author}
                            onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            value={newBook.description}
                            onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="publicationYear" className="text-right">
                            Publication Year
                          </Label>
                          <Input
                            id="publicationYear"
                            type="number"
                            value={newBook.publicationYear}
                            onChange={(e) => setNewBook({...newBook, publicationYear: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="thumbnail" className="text-right">
                            Thumbnail
                          </Label>
                          <Input
                            id="thumbnail"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => setNewBook({...newBook, thumbnail: e.target.files[0]})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="quantity" className="text-right">
                            Quantity
                          </Label>
                          <Input
                            id="quantity"
                            value={newBook.quantity}
                            type="number"
                            onChange={(e) => setNewBook({...newBook, quantity: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className='font-bold'>Year:</span> {book.publicationYear}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className='font-bold'>Quantity:</span> {book.quantity}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-4 bg-muted/50">
                      <Button variant="outline" onClick={() => handleUpdate(book)}>
                        <Pencil className="mr-2 h-4 w-4" /> Update
                      </Button>
                      <Button variant="outline" onClick={() => handleDelete(book._id)}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
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
            </div>

            <div className="lg:w-1/4">
              <div className="sticky top-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Library Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                  <div className="flex flex-col gap-4">
      <Card className="border rounded-lg shadow-md bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Book Collection Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-muted-foreground">
            {stats.totalBooks}
          </p>
          <p className="text-sm text-muted-foreground">Unique titles in the library</p>
        </CardContent>
      </Card>

      <Card className="border rounded-lg shadow-md bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Currently Borrowed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-muted-foreground">
            {stats.currentlyBorrowedBooks}
          </p>
          <p className="text-sm text-muted-foreground">Books currently with users</p>
        </CardContent>
      </Card>

      <Card className="border rounded-lg shadow-md bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Total Available Books
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-muted-foreground">
            {stats.totalAvailableBooks}
          </p>
          <p className="text-sm text-muted-foreground">Books available in the library</p>
        </CardContent>
      </Card>
    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isUpdateBookOpen} onOpenChange={setIsUpdateBookOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Book</DialogTitle>
            <DialogDescription>
              Update the details of the book here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="updateTitle"
                  value={updateBook.title}
                  onChange={(e) => setUpdateBook({...updateBook, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateAuthor" className="text-right">
                  Author
                </Label>
                <Input
                  id="updateAuthor"
                  value={updateBook.author}
                  onChange={(e) => setUpdateBook({...updateBook, author: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateDescription" className="text-right">
                  Description
                </Label>
                <Input
                  id="updateDescription"
                  value={updateBook.description}
                  onChange={(e) => setUpdateBook({...updateBook, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updatePublicationYear" className="text-right">
                  Publication Year
                </Label>
                <Input
                  id="updatePublicationYear"
                  type="number"
                  value={updateBook.publicationYear}
                  onChange={(e) => setUpdateBook({...updateBook, publicationYear: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateThumbnail" className="text-right">
                  Thumbnail
                </Label>
                <Input
                  id="updateThumbnail"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => setUpdateBook({...updateBook, thumbnail: e.target.files[0]})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateQuantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="updateQuantity"
                  value={updateBook.quantity}
                  type="number"
                  onChange={(e) => setUpdateBook({...updateBook, quantity: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

