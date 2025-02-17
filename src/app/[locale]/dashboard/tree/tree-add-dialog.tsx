'use client'
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { createMember, getPaternalLineageNames } from "@/server/actions/family-actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Check } from "lucide-react"
import { useLocale } from "next-intl"
import { type Control, type FieldValues, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
export const TreeAddDialog = ({ open, onOpenChange, title, description, triggerText, familyId, onSuccess }:
    {
        open: boolean,
        onOpenChange?: (open: boolean) => void
        title: string,
        description?: string,
        triggerText: string,
        familyId: number,
        onSuccess?: () => void
    }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button >{triggerText}</Button>
            </DialogTrigger>
            <DialogHeader>
                <DialogTitle></DialogTitle>
            </DialogHeader>
            <DialogContent >
                <div className="flex flex-col gap-2 pt-4">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
                <div className="grid gap-4 py-4">
                    <div className="grid items-center gap-4">
                        <TreeAddForm onSuccess={onSuccess} familyId={familyId} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const formSchema = z.object({
    name: z.string().min(2).max(50),
    gender: z.enum(["male", "female"]),
    father_id: z.number().optional(),
    mother_id: z.number().optional(),
    spouse_id: z.number().optional(),
})
export const TreeAddForm = ({ familyId, onSuccess }: { familyId: number, onSuccess?: () => void }) => {
    const locale = useLocale();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })
    const { data } = useQuery<{ name: string; gender: string; id: number }[]>({
        queryKey: ["fathers", familyId],
        queryFn: () => getPaternalLineageNames(familyId)
    });

    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => createMember(
            {
                ...values,
                father_id: values.father_id ?? null,
                mother_id: values.mother_id ?? null,
                spouse_id: values.spouse_id ?? null
            }, familyId),
        onError: () => toast.error("something went wrong"),
        onSuccess: () => {
            onSuccess?.();
            toast.success('Successfully added a new member!')
        },
    })

    const fathers = Array.isArray(data) ? data?.filter((f) => f.gender === "male").map((f) => ({ label: f.name, value: f.id })) : [];
    const mothers = Array.isArray(data) ? data?.filter((f) => f.gender === "female").map((f) => ({ label: f.name, value: f.id })) : [];
    const spouses = Array.isArray(data) ? data?.filter((f) => f.gender === "female" && f.id !== form.getValues("mother_id")).map((f) => ({ label: f.name, value: f.id })) : [];

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        mutation.mutate(values);

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Member's Name" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter your member name here.
                            </FormDescription>
                            <FormMessage />

                        </FormItem>

                    )}
                />
                <div className="flex justify-between gap-2">
                    <div className="w-1/2">
                        <TreeComboBox
                            control={form.control}
                            name="father_id"
                            title="Father"
                            description="Search from member's father"
                            data={fathers}
                            form={form}
                        />
                    </div>
                    <div className="w-1/2">
                        <TreeComboBox
                            control={form.control}
                            name="mother_id"
                            title="Mother"
                            description="Search from member's mother"
                            data={mothers}
                            form={form}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center gap-2">
                    <div className="w-1/2">
                        <TreeComboBox
                            control={form.control}
                            name="spouse_id"
                            title="Spouse"
                            description="Search from member's spouse"
                            data={spouses}
                            form={form}
                        />
                    </div>
                    <div className="w-1/2">
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Gender</FormLabel>
                                    <Select dir={locale === "ar" ? "rtl" : "ltr"} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select member&apos;s gender
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit">Add Member</Button>
            </form>
        </Form>
    )
}

const TreeComboBox = ({ title, control, name, description, data, form }:
    {
        title: string,
        description: string,
        control: Control<z.infer<typeof formSchema>>,
        name: keyof z.infer<typeof formSchema>,
        data: {
            label: string,
            value: string | number
        }[],
        form: FieldValues,
    }) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{title}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "justify-between",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value
                                        ? data.find(
                                            (value) => value.value === field.value
                                        )?.label
                                        : "Select a member..."}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput
                                    placeholder={`Search for a member...`}
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>No Data</CommandEmpty>
                                    <CommandGroup>
                                        {data.map((value) => (
                                            <CommandItem
                                                value={value.label}
                                                key={value.value}
                                                onSelect={() => {
                                                    form.setValue(name, value.value)
                                                }}
                                            >
                                                {value.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        value.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormDescription>
                        {description}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
