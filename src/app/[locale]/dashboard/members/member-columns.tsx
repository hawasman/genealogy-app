/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import { DataTableColumnHeader } from "@/components/column-header";
import { type fullMember } from "@/utils/types";
import { type ColumnDef, type Table } from "@tanstack/react-table";
import { type Formats, type MarkupTranslationValues, type RichTranslationValues, type TranslationValues } from "next-intl";
import { type ReactNode } from "react";

const metaData = <Meta extends object>() => (table: Table<fullMember>) => table.options.meta as Meta;

type Meta = {
    t: {
        <TargetKey>(key: TargetKey, values?: TranslationValues, formats?: Formats): string;
        rich<TargetKey>(key: TargetKey, values?: RichTranslationValues, formats?: Formats): ReactNode;
        markup<TargetKey>(key: TargetKey, values?: MarkupTranslationValues, formats?: Formats): string;
        raw<TargetKey>(key: TargetKey): unknown;
        has<TargetKey>(key: TargetKey): boolean;
    }
};

const getter = metaData<Meta>();

export const memberColumns: ColumnDef<fullMember>[] = [
    {
        accessorKey: "name",
        header: ({ column, table }) => {
            const { t } = getter(table)
            return <DataTableColumnHeader column={column} title={t("memberPage.Table.Columns.name")} />
        },
    },
    {
        accessorKey: "gender",
        header: ({ column, table }) => {
            const { t } = getter(table)
            return <DataTableColumnHeader column={column} title={t("memberPage.Table.Columns.gender")} />
        },
        cell: ({ row, table }) => {
            const { t } = getter(table)
            return <div>{row.original.gender === "male" ? t("memberPage.Table.Columns.male") : t("memberPage.Table.Columns.female")}</div>
        },
        enableHiding: false,
        enableSorting: true
    },
    {
        accessorKey: "father",
        header: ({ column, table }) => {
            const { t } = getter(table)
            return <DataTableColumnHeader column={column} title={t("memberPage.Table.Columns.father")} />
        },
        cell: ({ row, table }) => {
            const { t } = getter(table)
            if (!row.original.father) return <div>{t("memberPage.Table.Columns.nodata")}</div>;
            return <div>{row.original.father.name}</div>
        },
    },
    {
        accessorKey: "mother",
        header: ({ column, table }) => {
            const { t } = getter(table)
            return <DataTableColumnHeader column={column} title={t("memberPage.Table.Columns.mother")} />
        },
        cell: ({ row, table }) => {
            const { t } = getter(table)
            if (!row.original.mother) return <div>{t("memberPage.Table.Columns.nodata")}</div>;
            return <div>{row.original.mother.name}</div>
        },
    },
    {
        accessorKey: "spouse",
        header: ({ column, table }) => {
            const { t } = getter(table)
            return <DataTableColumnHeader column={column} title={t("memberPage.Table.Columns.spouse")} />
        },
        cell: ({ row, table }) => {
            const { t } = getter(table)
            if (!row.original.spouse) return <div>{t("memberPage.Table.Columns.nodata")}</div>;
            return <div>{row.original.spouse.name}</div>
        },
    },
]
