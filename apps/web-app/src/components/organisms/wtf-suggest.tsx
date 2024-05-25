import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { ComponentProps, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
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
  Input,
  RadioGroup,
  RadioGroupItem,
  toast,
} from "vst-ui";
import { zCurrency } from "vst-utils";
import { z } from "zod";

const formSchema = z.object({
  currency: zCurrency,
  url: z.string().url().nonempty(),
});

export default function WTFSuggest(
  props: ComponentProps<typeof Dialog> & {
    vstId: number;
  },
) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: "USD",
      url: "",
    },
  });

  const { mutate, isLoading } = api.whereToFind.submitNew.useMutation({
    onSuccess: () => {
      toast({
        title: "Thanks for your suggestion. We'll review it soon.",
      });

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

  const onSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      // parse price as number
      try {
        const parsedData = formSchema.safeParse(data);

        if (!parsedData.success) {
          toast({
            description: parsedData.error.issues[0]?.message,
          });
          return;
        }

        mutate({
          ...data,
          vstId: props.vstId,
        });
      } catch {
        toast({
          variant: "destructive",
          title: "There was an error submitting your suggestion.",
          description: "Please enter a valid price.",
        });
      }
    },
    [formSchema, mutate, props.vstId],
  );

  return (
    <Dialog {...props}>
      <DialogTrigger>
        <Button variant="ghost">
          <p className="text-sm text-muted-foreground underline">
            Suggest a new place
          </p>
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <form className="space-y-8">
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Suggest a new place to find this VST</DialogTitle>
              <DialogDescription>
                Know of a place to find this VST?
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <RadioGroup
                    className="flex flex-wrap gap-5"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {Object.values(zCurrency.Values).map((currency) => (
                      <FormItem key={currency}>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={currency} id={currency} />
                            <FormLabel htmlFor={currency}>{currency}</FormLabel>
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

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <Input
                    prefix="https://"
                    type="url"
                    placeholder=""
                    {...field}
                  />
                  <FormControl></FormControl>
                  <FormDescription>
                    Where can people find this VST?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                "Make suggestion"
              )}
            </Button>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
