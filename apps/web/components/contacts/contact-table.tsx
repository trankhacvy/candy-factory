"use client"

import dayjs from "dayjs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFetchContacts } from "@/hooks/use-contact-table"
import { Skeleton } from "../ui/skeleton"
import { Typography } from "../ui/typography"

export function ContactsTable() {
  const { data, isLoading } = useFetchContacts()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 overflow-hidden rounded-2xl p-5 shadow-card">
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl shadow-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Group</TableHead>
            <TableHead>Num of Audiences</TableHead>
            <TableHead className="w-32">Create at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Typography className="font-medium">{contact.name}</Typography>
              </TableCell>
              <TableCell>{contact.audiences.length}</TableCell>
              <TableCell>
                <Typography color="secondary" level="body4">
                  {dayjs(contact.created_at).format("DD/MM/YYYY")}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
