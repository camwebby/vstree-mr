import { vstUserAction } from "@/constants/vst-user-action";
import { api } from "@/utils/api";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { User } from "vst-database";
import { Card, CardContent, CardHeader, CardTitle, Table, TableCell, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger } from "vst-ui";
import { SkeletonCard } from "./skeleton-card";
import VSTAvatar from "./vst-avatar";

const VSTHoverCard = dynamic(() => import("./vst-hover-card"), {
  ssr: false,
  loading: () => <SkeletonCard />,
});

const UserVsts = ({ user }: { user?: User }) => {
  const { data: userData } = useSession();

  const refersToUser = userData?.user.id === user?.id;

  const { data: userVst } =
    api.userVst.getByUserId.useQuery(
      {
        userId: refersToUser ? userData?.user.id : user?.id,
      },
      {
        enabled: !!userData?.user.id || !!user?.id,
      },
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {refersToUser ? "Your" : user?.name + "'s"}&nbsp; VSTs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={"Like"} className="">
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(vstUserAction).map((key) => (
              <TabsTrigger key={key + "_trigger"} value={key}>
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
          {(
            Object.keys(vstUserAction) as Array<keyof typeof vstUserAction>
          ).map((key) => (
            <TabsContent
              className="max-h-[70vh] overflow-y-auto"
              key={key + "_content"}
              value={key}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>VST</TableCell>
                    <TableCell>Added</TableCell>
                  </TableRow>
                </TableHeader>
                {userVst
                  ?.filter((uv) => uv[vstUserAction[key]])
                  .sort((a, b) => {
                    return (
                      // @ts-ignore
                      new Date(b[vstUserAction[key]]) -
                      // @ts-ignore
                      new Date(a[vstUserAction[key]])
                    );
                  })
                  ?.map((uv) => (
                    <TableRow key={uv.id}>
                      <TableCell className="min-w-[180px]">
                        <VSTHoverCard vstSlug={uv.vst.slug}>
                          <Link
                            rel="noopener noreferrer"
                            target="_blank"
                            href={"/vsts/" + uv?.vst?.slug}
                            className="flex items-center gap-x-3 text-card-foreground"
                          >
                            <VSTAvatar item={uv.vst} />
                            {uv?.vst?.name}
                          </Link>
                        </VSTHoverCard>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(
                          // @ts-ignore
                          new Date(uv[vstUserAction[key]]),
                        )}{" "}
                        ago
                      </TableCell>
                    </TableRow>
                  ))}
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserVsts;
