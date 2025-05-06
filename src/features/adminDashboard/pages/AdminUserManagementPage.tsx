import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

const AdminUserManagementPage = () => {
  return (
    <div>
      <h2 className="text-almost-white mb-10 font-sans text-2xl font-semibold">User management</h2>
      <div className="">
        <Table>
          <TableHeader>
            <TableHead>FirstName</TableHead>
            <TableHead>LastName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>isBlocked</TableHead>
            <TableHead className="max-w-10 w-10">Actions</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
