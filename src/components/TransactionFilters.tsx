"use client"; // Esta es la línea mágica que permite usar onChange

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function TransactionFilters({
    portfolios,
    defaultType,
    defaultPortfolio,
}: {
    portfolios: { id: string; name: string }[];
    defaultType: string;
    defaultPortfolio: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Esta función actualiza la URL sin recargar toda la página
    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="card p-4">
            <div className="flex flex-wrap gap-3">
                <div>
                    <label className="label text-xs">Tipo</label>
                    <select
                        defaultValue={defaultType}
                        onChange={(e) => handleFilterChange("type", e.target.value)}
                        className="input text-sm py-2"
                    >
                        <option value="">Todos</option>
                        <option value="income">Ingresos</option>
                        <option value="expense">Gastos</option>
                        <option value="saving">Ahorros</option>
                    </select>
                </div>
                <div>
                    <label className="label text-xs">Portafolio</label>
                    <select
                        defaultValue={defaultPortfolio}
                        onChange={(e) => handleFilterChange("portfolio", e.target.value)}
                        className="input text-sm py-2"
                    >
                        <option value="">Todos</option>
                        {portfolios.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}