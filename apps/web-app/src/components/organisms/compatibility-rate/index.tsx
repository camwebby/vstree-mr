//@ts-nocheck
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { ComponentProps, memo } from "react";
import { useForm } from "react-hook-form";
import { User } from "vst-database";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  toast,
} from "vst-ui";
import { z } from "zod";
import {
  cpuArchitectures,
  daws,
  experienceRateOptions,
  memoryOptions,
  operatingSystems,
  rateExpSchema,
  supportedDawVersions,
  supportedOsVersions,
} from "./consts";

function CompatibilityRateDialog(
  props: ComponentProps<typeof Dialog> & {
    vstId: number;
    userData: User;
  },
) {
  const form = useForm<z.infer<typeof rateExpSchema>>({
    resolver: zodResolver(rateExpSchema),
    defaultValues: {
      systemOS:
        (props.userData?.systemOS as (typeof operatingSystems)[number]) || "",
      osVersion: props.userData?.osVersion || "",
      cpuArchitecture:
        (props.userData
          ?.cpuArchitecture as (typeof cpuArchitectures)[number]) || "",
      systemMemory: props.userData?.systemMemory || undefined,
      daw: (props.userData?.daw as (typeof daws)[number]) || "",
      dawVersion: props.userData?.dawVersion || "",
      vstId: props.vstId,
    },
  });

  const { mutate, isLoading } = api.userVstExperience.submit.useMutation({
    onSuccess: () => {
      toast({
        title: "Thanks for your suggestion. We'll review it soon.",
      });

      // clear form
      form.reset();

      props.onOpenChange && props.onOpenChange(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "There was an error submitting your suggestion.",
        description: error?.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof rateExpSchema>) => {
    // safe parse

    // parse price as number
    try {
      const parsedData = rateExpSchema.safeParse(data);

      if (!parsedData.success) {
        toast({
          description: parsedData.error.issues[0]?.message,
        });
        return;
      } else {
        mutate({
          ...data,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "There was an error submitting your suggestion.",
        description: "Please enter a valid price.",
      });
    }
  };

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>Rate compatibility</Button>
      </DialogTrigger>
      <Form {...form}>
        <form className="space-y-8">
          <DialogContent className="flex flex-col gap-y-10 sm:max-w-[620px]">
            <DialogHeader>
              <DialogTitle>Rate your experience with this VST</DialogTitle>
              <DialogDescription>
                Provide as much or as little information as you want.
              </DialogDescription>
            </DialogHeader>

            <Accordion defaultValue={["daw_spec"]} type="multiple">
              <AccordionItem className=" border-none" value="daw_spec">
                <AccordionTrigger>
                  <CardTitle>Your DAW</CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="daw"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DAW (*)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-card text-card-foreground">
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
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-card text-card-foreground">
                                <SelectValue placeholder="Select the OS" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {supportedDawVersions[
                                form.watch().daw || ""
                              ]?.map((val) => (
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

              <AccordionItem className=" border-none" value="os_spec">
                <AccordionTrigger>
                  <CardTitle>Your OS (optional)</CardTitle>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="grid grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="systemOS"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OS</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-card text-card-foreground">
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
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-card text-card-foreground">
                                <SelectValue placeholder="Select the OS" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {form.watch().systemOS !== undefined ? (
                                supportedOsVersions[
                                  form.watch()
                                    .systemOS as (typeof operatingSystems)[number]
                                ]?.map((val: string) => (
                                  <SelectItem key={val} value={val}>
                                    {val}
                                  </SelectItem>
                                ))
                              ) : (
                                <></>
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

              <AccordionItem className=" border-none" value="system_spec">
                <AccordionTrigger>
                  <CardTitle>Your system spec (optional)</CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <div className={`grid grid-cols-2 gap-5`}>
                    <FormField
                      control={form.control}
                      name="cpuArchitecture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPU Architecture</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-card text-card-foreground">
                                <SelectValue placeholder="meow" />
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
                          <FormLabel>Memory (GB)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-card text-card-foreground">
                                <SelectValue placeholder={memoryOptions[0]} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {memoryOptions.map(
                                (daw: (typeof memoryOptions)[number]) => (
                                  <SelectItem key={daw} value={daw}>
                                    {daw} GB
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
            </Accordion>

            <Separator className="border border-border" />

            <FormField
              control={form.control}
              name="experienceRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your experience (*)</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    {experienceRateOptions.map((val) => (
                      <FormItem key={val}>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={val} id={val} />
                            <Label htmlFor={val}>{val}</Label>
                          </div>
                        </FormControl>
                      </FormItem>
                    ))}
                  </RadioGroup>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <DialogFooter> */}
            <Button
              disabled={isLoading}
              onClick={async () => {
                // touch form
                await form.trigger();

                onSubmit(form.getValues());
              }}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                "Submit"
              )}
            </Button>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

export default memo(CompatibilityRateDialog);
