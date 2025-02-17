"use client"

import { DataTableColumnHeader } from "@/components/column-header"
import { type fullMember } from "@/utils/types"
import { type ColumnDef } from "@tanstack/react-table"

export const treeColumns: ColumnDef<fullMember>[] = [
    {
        accessorKey: "name",
        header: ({ column, table }) =>
            <DataTableColumnHeader column={column} title={table.options.meta?.t("treePage.Table.Columns.name")} />
        ,
    },
    {
        accessorKey: "gender",
        header: ({ column, table }) => <DataTableColumnHeader column={column} title={table.options.meta?.t("treePage.Table.Columns.gender")} />,
        cell: ({ row, table }) => {
            return <div>{row.original.gender === "male" ? table.options.meta?.t("treePage.Table.Columns.male") : table.options.meta?.t("treePage.Table.Columns.female")}</div>
        },
        enableHiding: false,
        enableSorting: true
    },
    {
        accessorKey: "father",
        header: ({ column, table }) => <DataTableColumnHeader column={column} title={table.options.meta?.t("treePage.Table.Columns.father")} />,
        cell: ({ row, table }) => {
            if (!row.original.father) return <div>{table.options.meta?.t("treePage.Table.Columns.nodata")}</div>;
            return <div>{row.original.father.name}</div>
        },
    },
    {
        accessorKey: "mother",
        header: ({ column, table }) => <DataTableColumnHeader column={column} title={table.options.meta?.t("treePage.Table.Columns.mother")} />,
        cell: ({ row, table }) => {
            if (!row.original.mother) return <div>{table.options.meta?.t("treePage.Table.Columns.nodata")}</div>;
            return <div>{row.original.mother.name}</div>
        },
    },
    {
        accessorKey: "spouse",
        header: ({ column, table }) => <DataTableColumnHeader column={column} title={table.options.meta?.t("treePage.Table.Columns.spouse")} />,
        cell: ({ row, table }) => {
            if (!row.original.spouse) return <div>{table.options.meta?.t("treePage.Table.Columns.nodata")}</div>;
            return <div>{row.original.spouse.name}</div>
        },
    },
]
