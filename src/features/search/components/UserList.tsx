import testProfile from "@/assets/testProfile.png";
import UserListItem from "./UserListItem";
import { Link } from "react-router";


const demoUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", profile: testProfile },
  { id: 2, name: "Bob Smith", email: "bob@example.com", profile: testProfile },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", profile: testProfile },
  { id: 4, name: "Diana Prince", email: "diana@example.com", profile: testProfile },
  { id: 5, name: "Ethan Hunt", email: "ethan@example.com", profile: testProfile },
  { id: 6, name: "Fiona Gallagher", email: "fiona@example.com", profile: testProfile },
  { id: 7, name: "George Miller", email: "george@example.com", profile: testProfile },
  { id: 8, name: "Hannah Lee", email: "hannah@example.com", profile: testProfile },
  { id: 9, name: "Ian Curtis", email: "ian@example.com", profile: testProfile },
  { id: 10, name: "Julia Roberts", email: "julia@example.com", profile: testProfile },
  { id: 11, name: "Kevin Parker", email: "kevin@example.com", profile: testProfile },
  { id: 12, name: "Laura Palmer", email: "laura@example.com", profile: testProfile },
  { id: 13, name: "Ian Curtis", email: "ian@example.com", profile: testProfile },
  { id: 14, name: "Julia Roberts", email: "julia@example.com", profile: testProfile },
  { id: 15, name: "Kevin Parker", email: "kevin@example.com", profile: testProfile },
  { id: 16, name: "Laura Palmer", email: "laura@example.com", profile: testProfile },
  { id: 17, name: "Hannah Lee", email: "hannah@example.com", profile: testProfile },
  { id: 18, name: "Ian Curtis", email: "ian@example.com", profile: testProfile },
  { id: 19, name: "Julia Roberts", email: "julia@example.com", profile: testProfile },
  { id: 20, name: "Kevin Parker", email: "kevin@example.com", profile: testProfile },
  { id: 21, name: "Laura Palmer", email: "laura@example.com", profile: testProfile },
  { id: 22, name: "Ian Curtis", email: "ian@example.com", profile: testProfile },
  { id: 23, name: "Julia Roberts", email: "julia@example.com", profile: testProfile },
  { id: 24, name: "Kevin Parker", email: "kevin@example.com", profile: testProfile },
  { id: 25, name: "Laura Palmer", email: "laura@example.com", profile: testProfile },
  { id: 26, name: "Hannah Lee", email: "hannah@example.com", profile: testProfile },
  { id: 27, name: "Ian Curtis", email: "ian@example.com", profile: testProfile },
  { id: 28, name: "Julia Roberts", email: "julia@example.com", profile: testProfile },
  { id: 29, name: "Kevin Parker", email: "kevin@example.com", profile: testProfile },
  { id: 30, name: "Laura Palmer", email: "laura@example.com", profile: testProfile },
  { id: 31, name: "Ian Curtis", email: "ian@example.com", profile: testProfile },
  { id: 32, name: "Julia Roberts", email: "julia@example.com", profile: testProfile },
  { id: 33, name: "Kevin Parker", email: "kevin@example.com", profile: testProfile },
  { id: 34, name: "Laura Palmer", email: "laura@example.com", profile: testProfile },
];

const UserList = () => {
  
  return (
    <div className="p-5 text-lg text-white">
      {demoUsers.map((user) => (
        <Link to={`/user/${user.id}`} key={user.id}>
          <UserListItem userName={user.name} profileURL={user.profile} />
        </Link>
      ))}
    </div>
  );
};

export default UserList;
