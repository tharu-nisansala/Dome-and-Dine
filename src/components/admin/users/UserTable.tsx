import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { MoreHorizontal, Trash2, UserCheck, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { User } from "../../../types/user";

interface UserTableProps {
  users: User[];
  onDeleteUser: (userId: string) => Promise<void>;
  onUpdateUserStatus: (userId: string, status: 'active' | 'inactive' | 'suspended') => Promise<void>;
}

export const UserTable = ({ users, onDeleteUser, onUpdateUserStatus }: UserTableProps) => {
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteUserId) {
      await onDeleteUser(deleteUserId);
      setDeleteUserId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName || "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.userType === "shop_owner" ? "secondary" : "default"}
                >
                  {user.userType}
                </Badge>
              </TableCell>
              <TableCell>{user.university || "N/A"}</TableCell>
              <TableCell>{user.telephone || "N/A"}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(user.status)}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onUpdateUserStatus(user.id, 'active')}
                    >
                      <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                      Set Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdateUserStatus(user.id, 'inactive')}
                    >
                      <UserX className="mr-2 h-4 w-4 text-gray-600" />
                      Set Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdateUserStatus(user.id, 'suspended')}
                    >
                      <UserX className="mr-2 h-4 w-4 text-red-600" />
                      Suspend User
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => setDeleteUserId(user.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteUserId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};