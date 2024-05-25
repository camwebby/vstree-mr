//@ts-nocheck
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedValue } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import { User } from "vst-database";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "vst-ui";
import { z } from "zod";
import {
  cpuArchitectures,
  daws,
  memoryOptions,
  operatingSystems,
  supportedDawVersions,
  supportedOsVersions,
} from "./compatibility-rate/consts";

export const userSetupSchema = z.object({
  daw: z.enum(daws).optional(),
  dawVersion: z.string().optional(),
  systemOS: z.enum(operatingSystems).optional(),
  osVersion: z.string().optional(),
  cpuArchitecture: z.enum(cpuArchitectures).optional(),
  systemMemory: z.number().optional(),
});

const YourSetup: React.FC<{
  user: Partial<User>;
}> = ({ user }) => {
  const { data: session } = useSession();
  const refersToUser = session?.user?.id === user.id;

  const form = useForm<z.infer<typeof userSetupSchema>>({
    resolver: zodResolver(userSetupSchema),
    defaultValues: {
      systemOS:
        (user.systemOS as (typeof operatingSystems)[number]) || undefined,
      osVersion: user.osVersion || undefined,
      cpuArchitecture:
        (user.cpuArchitecture as (typeof cpuArchitectures)[number]) ||
        undefined,
      systemMemory: user.systemMemory || undefined,
      daw: (user.daw as (typeof daws)[number]) || undefined,
      dawVersion: user.dawVersion || undefined,
    },
  });

  const [debouncedForm] = useDebouncedValue(form.getValues(), 200);

  const { mutate, isLoading } = api.user.updateUserSetup.useMutation({
    onSuccess: () => {
      // toast({
      //   title: "Updated",
      // });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "There was an error changing setup.",
        description: error?.message,
      });
    },
  });

  useDeepCompareEffect(() => {
    if (!refersToUser) return;
    // safe parse
    try {
      const parsedData = userSetupSchema.safeParse(debouncedForm);

      if (!parsedData.success || isLoading) {
        return;
      } else {
        mutate(debouncedForm);
      }
    } catch (error) {
      console.log(error);
    }
  }, [debouncedForm, refersToUser]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{refersToUser ? "Your" : user?.name + "'s"} setup</CardTitle>
        {refersToUser && (
          <CardDescription>
            Filling out your setup will let you see which VSTs and collections
            will work for you.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <Accordion defaultValue={["daw_spec"]} type="multiple">
            <AccordionItem className=" border-none" value="daw_spec">
              <AccordionTrigger>DAW</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="daw"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DAW</FormLabel>
                        <Select
                          disabled={!refersToUser}
                          onValueChange={(val) => {
                            field.onChange(val);
                            // Clear the version
                            form.setValue("dawVersion", "");
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                            //  className="disabled:cursor-default disabled:text-foreground disabled:opacity-100 "
                            >
                              <SelectValue placeholder="Select the DAW" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {daws.map((daw) => (
                              <SelectItem key={daw} value={daw}>
                                {daw}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dawVersion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Version</FormLabel>
                        <Select
                          disabled={!refersToUser}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the OS" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {supportedDawVersions[form.watch().daw]?.map(
                              (val: string) => (
                                <SelectItem key={val} value={val}>
                                  {val}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className=" border-none" value="os_spec">
              <AccordionTrigger>OS</AccordionTrigger>

              <AccordionContent>
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="systemOS"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OS</FormLabel>
                        <Select
                          disabled={!refersToUser}
                          onValueChange={(val) => {
                            field.onChange(val);
                            // Clear the version
                            form.setValue("osVersion", "");
                          }}
                          defaultValue={user.systemOS || field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the OS" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {operatingSystems.map((val) => (
                              <SelectItem key={val} value={val}>
                                {val}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="osVersion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Version</FormLabel>
                        <Select
                          disabled={!refersToUser}
                          onValueChange={field.onChange}
                          defaultValue={user.osVersion || field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the OS" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {supportedOsVersions[
                              form.watch().systemOS || ""
                            ]?.map((val: string) => (
                              <SelectItem key={val} value={val}>
                                {val}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className=" border-none" value="system_spec">
              <AccordionTrigger>System spec</AccordionTrigger>
              <AccordionContent>
                <div className={`grid grid-cols-2 gap-5`}>
                  <FormField
                    control={form.control}
                    name="cpuArchitecture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPU Architecture</FormLabel>
                        <Select
                          disabled={!refersToUser}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select CPU type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cpuArchitectures.map((daw) => (
                              <SelectItem key={daw} value={daw}>
                                {daw}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="systemMemory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Memory</FormLabel>
                        <Select
                          disabled={!refersToUser}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={"Select memory (GB)"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {memoryOptions.map((daw) => (
                              <SelectItem key={daw} value={daw}>
                                {daw} GB
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Form>
      </CardContent>
    </Card>
  );
};

export default YourSetup;
