"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Search, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  role: z.enum(["Admin", "Staff"], { required_error: "Role is required." }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

type User = {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Staff";
    avatar: string;
    dataAiHint: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "Ahmad Prasetyo",
    email: "ahmad.prasetyo@lpkjaya.com",
    role: "Admin",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "male portrait"
  },
  {
    id: 2,
    name: "Siti Aminah",
    email: "siti.aminah@lpkjaya.com",
    role: "Staff",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "female portrait"
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi.s@lpkjaya.com",
    role: "Staff",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "male portrait"
  },
   {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi.lestari@lpkjaya.com",
    role: "Staff",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "female portrait"
  },
   {
    id: 5,
    name: "Eko Nugroho",
    email: "eko.n@lpkjaya.com",
    role: "Staff",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "male portrait"
  },
  {
    id: 6,
    name: "Fitriani",
    email: "fitriani@lpkjaya.com",
    role: "Staff",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "female portrait"
  },
];

export default function UsersPage() {
  const [users, setUsers] = React.useState(initialUsers);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [sorting, setSorting] = React.useState<{ column: keyof Pick<User, 'name' | 'email' | 'role'>; direction: 'asc' | 'desc' }>({ column: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const usersPerPage = 5;

  const addForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Staff",
    },
  });

  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
  });
  
  React.useEffect(() => {
    if (editingUser) {
        editForm.reset(editingUser);
    }
  }, [editingUser, editForm]);


  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, sorting]);

  const handleSort = (column: keyof Pick<User, 'name' | 'email' | 'role'>) => {
    setSorting(prevSorting => ({
      column,
      direction: prevSorting.column === column && prevSorting.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  function onAddUserSubmit(data: UserFormValues) {
    const newUser = {
      id: users.length + 1,
      ...data,
      avatar: "https://placehold.co/100x100.png",
      dataAiHint: "user portrait"
    };
    setUsers([...users, newUser]);

    toast({
      title: "User Added!",
      description: `${data.name} has been successfully added.`,
    });

    addForm.reset();
    setIsAddModalOpen(false);
  }

  function onEditUserSubmit(data: UserFormValues) {
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...data } : u));
    toast({
        title: "User Updated",
        description: `Profile for ${data.name} has been updated.`,
    });
    setEditingUser(null);
  }

  const processedUsers = React.useMemo(() => {
     let processed = users
      .filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(user =>
        roleFilter === "all" || user.role === roleFilter
      );
      
      processed.sort((a, b) => {
        const aValue = a[sorting.column];
        const bValue = b[sorting.column];
        if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    return processed;
  }, [users, searchQuery, roleFilter, sorting]);

  const totalPages = Math.ceil(processedUsers.length / usersPerPage);

  const paginatedUsers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return processedUsers.slice(startIndex, startIndex + usersPerPage);
  }, [processedUsers, currentPage]);


  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary">Users</h1>
          <p className="text-muted-foreground mt-2">Manage admin and staff users for your LPK.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new user to your LPK.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddUserSubmit)} className="space-y-4 py-4">
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create User</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Edit User Modal */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                    Update the details for {editingUser?.name}.
                </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditUserSubmit)} className="space-y-4 py-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all users in your LPK.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('name')} className="px-1">
                        Name
                        {sorting.column === 'name' ? (
                            sorting.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4 inline-block" /> : <ArrowDown className="ml-2 h-4 w-4 inline-block" />
                        ) : <span className="ml-2 h-4 w-4 inline-block" />}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button variant="ghost" onClick={() => handleSort('email')} className="px-1">
                        Email
                        {sorting.column === 'email' ? (
                            sorting.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4 inline-block" /> : <ArrowDown className="ml-2 h-4 w-4 inline-block" />
                        ) : <span className="ml-2 h-4 w-4 inline-block" />}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button variant="ghost" onClick={() => handleSort('role')} className="px-1">
                        Role
                        {sorting.column === 'role' ? (
                            sorting.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4 inline-block" /> : <ArrowDown className="ml-2 h-4 w-4 inline-block" />
                        ) : <span className="ml-2 h-4 w-4 inline-block" />}
                    </Button>
                  </TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.dataAiHint} />
                                <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                {user.name}
                                <div className="text-sm text-muted-foreground md:hidden break-all">{user.email}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                        {user.role}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setEditingUser(user)}>Edit Profile</DropdownMenuItem>
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No users found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
           {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6">
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                    Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                    Next
                    </Button>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
