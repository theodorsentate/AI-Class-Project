import { tables, tablesNote } from "@/lib/tables";

export default function DataPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Lookup tables</h1>
        <p className="mt-3 text-[var(--muted)] leading-7">{tablesNote}</p>
      </header>
      {tables.map((table) => (
        <section key={table.id} className="card overflow-x-auto p-5">
          <h2 className="text-xl font-semibold">{table.title}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{table.summary}</p>
          <table className="mt-4 w-full text-left text-sm">
            <caption className="sr-only">{table.title}</caption>
            <thead>
              <tr>
                {table.columns.map((column) => (
                  <th key={column} className="border-b border-[var(--line)] py-2 pr-4">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.join("-")}>
                  {row.map((cell) => (
                    <td key={cell} className="py-2 pr-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
