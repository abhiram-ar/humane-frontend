import React from "react";
import testProfile from "@/assets/testProfile.png";

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
  { id: 9, name: "Ian Curtis", email: "ian@example.com", profile: testProfile },
  { id: 10, name: "Julia Roberts", email: "julia@example.com", profile: testProfile },
  { id: 11, name: "Kevin Parker", email: "kevin@example.com", profile: testProfile },
  { id: 12, name: "Laura Palmer", email: "laura@example.com", profile: testProfile },
  { id: 8, name: "Hannah Lee", email: "hannah@example.com", profile: testProfile },
  { id: 9, name: "Ian Curtis", email: "ian@example.com", profile: testProfile },
  { id: 10, name: "Julia Roberts", email: "julia@example.com", profile: testProfile },
  { id: 11, name: "Kevin Parker", email: "kevin@example.com", profile: testProfile },
  { id: 12, name: "Laura Palmer", email: "laura@example.com", profile: testProfile },
  { id: 9, name: "Ian Curtis", email: "ian@example.com", profile: testProfile },
  { id: 10, name: "Julia Roberts", email: "julia@example.com", profile: testProfile },
  { id: 11, name: "Kevin Parker", email: "kevin@example.com", profile: testProfile },
  { id: 12, name: "Laura Palmer", email: "laura@example.com", profile: testProfile },
  { id: 8, name: "Hannah Lee", email: "hannah@example.com", profile: testProfile },
  { id: 9, name: "Ian Curtis", email: "ian@example.com", profile: testProfile },
  { id: 10, name: "Julia Roberts", email: "julia@example.com", profile: testProfile },
  { id: 11, name: "Kevin Parker", email: "kevin@example.com", profile: testProfile },
  { id: 12, name: "Laura Palmer", email: "laura@example.com", profile: testProfile },
  { id: 9, name: "Ian Curtis", email: "ian@example.com", profile: testProfile },
  { id: 10, name: "Julia Roberts", email: "julia@example.com", profile: testProfile },
  { id: 11, name: "Kevin Parker", email: "kevin@example.com", profile: testProfile },
  { id: 12, name: "Laura Palmer", email: "laura@example.com", profile: testProfile },
];

const UserList = () => {
  return (
    <div className="h-full p-5 text-lg text-white">
      {demoUsers.map((user) => (
        <div
          key={user.id}
          className="mb-5 flex h-fit cursor-pointer items-center gap-3 hover:underline"
        >
          <div className="size-10 overflow-hidden rounded-full">
            <img className="h-full w-full object-cover" src={user.profile} alt="" />
          </div>
          <p>{user.name}</p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
