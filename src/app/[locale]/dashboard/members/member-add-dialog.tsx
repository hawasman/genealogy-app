'use client'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { createMember, createUserMember, getPaternalLineageNames, userHasMemberId } from "@/server/actions/family-actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Check } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { type Control, type FieldValues, useForm, type UseFormReturn } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
export const MembersAddDialog = ({ open, onOpenChange, title, description, triggerText, familyId, onSuccess }:
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
                        <MembersAddForm onSuccess={onSuccess} familyId={familyId} />
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
export const MembersAddForm = ({ familyId, onSuccess }: { familyId: number, onSuccess?: () => void }) => {
    const locale = useLocale();
    const t = useTranslations('memberPage.addDialog');
    const [meCheckbox, setMeCheckbox] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })
    const { data: hasMember } = useQuery({
        queryKey: ["has-member"],
        queryFn: () => userHasMemberId(),
    })
    const { data } = useQuery<{ name: string; gender: string; id: number }[]>({
        queryKey: ["fathers", familyId],
        queryFn: () => getPaternalLineageNames(familyId)
    });

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            if (hasMember) {
                const result = await createMember(
                    {
                        ...values,
                        father_id: values.father_id ?? null,
                        mother_id: values.mother_id ?? null,
                        spouse_id: values.spouse_id ?? null
                    }, familyId)
                return result;
            }
            await createUserMember(
                {
                    ...values,
                    father_id: values.father_id ?? null,
                    mother_id: values.mother_id ?? null,
                    spouse_id: values.spouse_id ?? null,
                    family_id: familyId
                }
            )
        },
        onError: () => toast.error(t('something-went-wrong')),
        onSuccess: () => {
            onSuccess?.();
            toast.success(t('successfully-added-a-new-member'))
        },
    })

    const fathers = Array.isArray(data) ? data?.filter((f) => f.gender === "male").map((f) => ({ label: f.name, value: f.id })) : [];
    const mothers = Array.isArray(data) ? data?.filter((f) => f.gender === "female").map((f) => ({ label: f.name, value: f.id })) : [];
    const spouses = Array.isArray(data) ? data?.filter((f) => f.id !== form.getValues("mother_id") && f.id !== form.getValues("father_id")).map((f) => ({ label: f.name, value: f.id })) : [];

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        mutation.mutate(values);

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormInputField
                    form={form}
                    name="name"
                    label={t('member-name')}
                    placeholder={t('enter-members-name')}
                />
                {!hasMember && (
                    <div className="items-top flex gap-2">
                        <Checkbox checked={meCheckbox}
                            onCheckedChange={(e) => e ? setMeCheckbox(true) : setMeCheckbox(false)} />
                        <div className="grid gap-2 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-l font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {t('this-is-me')}
                            </label>
                        </div>
                    </div>
                )}
                <div className="flex justify-between gap-2">
                    <div className="w-1/2">
                        <MembersComboBox
                            control={form.control}
                            name="father_id"
                            title={t('father')}
                            description={t('search-father')}
                            data={fathers}
                            form={form}
                        />
                    </div>
                    <div className="w-1/2">
                        <MembersComboBox
                            control={form.control}
                            name="mother_id"
                            title={t('mother')}
                            description={t('search-mother')}
                            data={mothers}
                            form={form}
                        />
                    </div>
                </div>

                <div className="flex justify-between gap-2">
                    <div className="w-1/2">
                        <MembersComboBox
                            control={form.control}
                            name="spouse_id"
                            title={t('spouse')}
                            description={t('search-spouse')}
                            data={spouses}
                            form={form}
                        />
                    </div>
                    <div className="w-1/2">
                        <FormSelectField
                            form={form}
                            name="gender"
                            label={t('gender')}
                            placeholder={t('select-gender')}
                            options={
                                [{ value: "male", label: t('male') },
                                { value: "female", label: t('female') },]}
                            dir={locale === "ar" ? "rtl" : "ltr"}
                        />
                    </div>
                </div>

                <Button type="submit">{t('add-member')}</Button>
            </form>
        </Form>
    )
}

const MembersComboBox = ({ title, control, name, description, data, form }:
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
                                        : ""}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput
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

interface FormInputFieldProps {
    form: UseFormReturn<z.infer<typeof formSchema>>; // Or specify your form schema type if you have one
    name: keyof z.infer<typeof formSchema>;
    label: string;
    placeholder?: string;
    description?: string;
    // Add any other props you might need to customize Input further, like type, etc.
    type?: React.HTMLInputTypeAttribute;
    className?: string; // For additional styling
    labelClassName?: string;
    controlClassName?: string;
    descriptionClassName?: string;
    messageClassName?: string;
    inputClassName?: string;
}

const FormInputField: React.FC<FormInputFieldProps> = ({
    form,
    name,
    label,
    placeholder,
    description,
    type = "text", // Default to text input
    className,
    labelClassName,
    controlClassName,
    descriptionClassName,
    messageClassName,
    inputClassName,
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel className={labelClassName}>{label}</FormLabel>
                    <FormControl className={controlClassName}>
                        <Input
                            placeholder={placeholder}
                            type={type}
                            className={inputClassName}
                            {...field}
                        />
                    </FormControl>
                    {description && (
                        <FormDescription className={descriptionClassName}>
                            {description}
                        </FormDescription>
                    )}
                    <FormMessage className={messageClassName} />
                </FormItem>
            )}
        />
    );
};

interface SelectOption {
    value: string;
    label: string;
}

interface FormSelectFieldProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    name: keyof z.infer<typeof formSchema>;
    label: string;
    placeholder?: string;
    description?: string;
    options: SelectOption[];
    dir?: 'ltr' | 'rtl';
    className?: string;
    labelClassName?: string;
    controlClassName?: string;
    descriptionClassName?: string;
    messageClassName?: string;
    selectClassName?: string;
    selectTriggerClassName?: string;
    selectContentClassName?: string;
    selectItemClassName?: string;
}

const FormSelectField: React.FC<FormSelectFieldProps> = ({
    form,
    name,
    label,
    placeholder,
    description,
    options,
    dir,
    className,
    labelClassName,
    controlClassName,
    descriptionClassName,
    messageClassName,
    selectClassName,
    selectTriggerClassName,
    selectContentClassName,
    selectItemClassName,
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={`${className} flex flex-col`}>
                    <FormLabel className={labelClassName}>{label}</FormLabel>
                    <div className={selectClassName}>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value as string}
                            dir={dir}

                        >
                            <FormControl className={controlClassName}>
                                <SelectTrigger className={selectTriggerClassName}>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className={selectContentClassName}>
                                {options.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className={selectItemClassName}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {description && (
                        <FormDescription className={descriptionClassName}>
                            {description}
                        </FormDescription>
                    )}
                    <FormMessage className={messageClassName} />
                </FormItem>
            )}
        />
    );
};