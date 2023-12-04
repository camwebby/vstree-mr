import UserProfilePage from "@/components/pages/userProfile";
import { GetServerSideProps, NextPage } from "next";
import { signIn } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async ({ ...props }) => {
  const { id } = props.params as { id: string };

  if (!id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id,
    },
  };
};

const UserPage: NextPage<{
  id: string;
}> = ({ ...props }) => {
  if (!props.id) {
    signIn().catch((e) => {
      //
    });
  }

  return <UserProfilePage id={props.id} />;
};

export default UserPage;
