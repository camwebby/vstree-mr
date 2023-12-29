import { Button } from "vst-ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "vst-ui";
import { Input } from "vst-ui";
import { Label } from "vst-ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "vst-ui";
import { ComponentProps } from "react";
import { RadioGroup, RadioGroupItem } from "vst-ui";
import { zCurrency } from "@/constants/zod/curency";
import { toast } from "vst-ui";
import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  // vendorName: z.string().nonempty(),
  currency: zCurrency,
  // price: z.string().nonempty(),
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
      // vendorName: "",
      url: "",
      // price: "",
    },
  });

  const { mutate, isLoading } = api.whereToFind.submitNew.useMutation({
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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // safe parse

    // parse price as number
    try {
      const parsedData = formSchema.safeParse(data);

      if (!parsedData.success) {
        toast({
          description: parsedData.error.issues[0]?.message,
        });
        return;
      }

      // const parsedPrice = Number(data.price);

      mutate({
        ...data,
        // price: parsedPrice,
        vstId: props.vstId,
      });
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
            {/* 
            <FormField
              control={form.control}
              name="vendorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <Input placeholder="Plugin Place" {...field} />
                  <FormControl></FormControl>
        
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
                    // defaultValue="USD"
                  >
                    {Object.values(zCurrency.Values).map((currency) => (
                      <FormItem key={currency}>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={currency} id={currency} />
                            <Label htmlFor={currency}>{currency}</Label>
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

            {/* <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ({form.watch("currency")})</FormLabel>
                  <Input prefix={""} type="number" {...field} />
                  <FormControl></FormControl>
                  <FormDescription>
                    What was the latest price you saw?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
                "Make suggestion"
              )}
            </Button>
            {/* </DialogFooter> */}
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
