import UserProfilePage from "@/components/pages/user-profile";
import { NextPage } from "next";
import { useRouter } from "next/router";

const UserPage: NextPage = () => {
  const id = useRouter().query.id as string;

  return <UserProfilePage id={id} />;
};

export default UserPage;
