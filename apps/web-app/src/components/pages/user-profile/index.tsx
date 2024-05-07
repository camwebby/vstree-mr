import { Card, CardContent, CardHeader, CardTitle } from "vst-ui";
import Layout from "@/components/layout/primary";
import { api } from "@/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "vst-ui";
import {
  TwoColContainer,
  TwoColFirst,
  TwoColSecond,
} from "../../layout/two-col-layout";
import { Separator } from "vst-ui";
import { User } from "vst-database";
import dynamic from "next/dynamic";
import { SkeletonCard } from "../../molecules/skeleton-card";
import Head from "next/head";

const UserVsts = dynamic(() => import("../../organisms/user-vsts"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});

const CollectionsTable = dynamic(
  () => import("../../organisms/collections-table"),
  {
    loading: () => <SkeletonCard />,
    ssr: false,
  },
);

const YourSystem = dynamic(() => import("../../organisms/your-system"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});

const UserProfilePage = ({ id }: { id?: string }) => {
  const { data: userData } = api.user.getUserPublic.useQuery(
    {
      userId: id || "",
    },
    {
      enabled: !!id,
    },
  );

  return (
    <Layout>
      <Head>
        <title>Profile | vstree</title>
      </Head>
      <TwoColContainer>
        <TwoColFirst>
          <Card className="h-fit w-full">
            <CardHeader>
              <div className="mb-4 flex cursor-pointer flex-row items-center gap-x-3">
                <Avatar>
                  <AvatarImage
                    src={userData?.image || ""}
                    alt={userData?.name || ""}
                    width={60}
                    height={60}
                    className="object-cover"
                  ></AvatarImage>
                  <AvatarFallback>
                    {userData?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{userData?.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground"></CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collections</CardTitle>
            </CardHeader>
            <Separator />
            <CollectionsTable userData={userData as unknown as User} />
          </Card>
        </TwoColFirst>

        <TwoColSecond>
          {userData && <YourSystem user={userData} />}
          <UserVsts user={userData as unknown as User} />
        </TwoColSecond>
      </TwoColContainer>
    </Layout>
  );
};

export default UserProfilePage;
