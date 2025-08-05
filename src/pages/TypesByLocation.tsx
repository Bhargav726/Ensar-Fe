import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ChartData {
    name: string;
    value: number;
}

// Sample data
const statesData: ChartData[] = [
    { name: 'Illinois', value: 55741 },
    { name: 'Noord-Brabant', value: 3986 },
    { name: 'New York', value: 3874 },
    { name: 'Telangana', value: 3597 },
    { name: 'California', value: 1858 },
    { name: 'Florida', value: 1623 },
    { name: 'Texas', value: 1621 },
];

const citiesData: ChartData[] = [
    { name: 'Chicago', value: 23114 },
    { name: 'Naperville', value: 6079 },
    { name: 'Aurora', value: 5324 },
    { name: 'Rijen', value: 3984 },
    { name: 'Hyderabad', value: 3541 },
    { name: 'City of New York', value: 3171 },
    { name: 'Downers Grove', value: 890 },
];

const businessTypesData: ChartData[] = [
    { name: 'Restaurant', value: 1 },
    { name: 'Manufacturer', value: 1 },
    { name: 'Non-profit organization', value: 1 },
    { name: 'Auto repair shop', value: 1 },
    { name: 'Medical clinic', value: 1 },
    { name: 'Chinese restaurant', value: 1 },
    { name: 'Insurance agency', value: 1 },
];

const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#f97316', '#84cc16',
];

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        payload: ChartData;
    }>;
    label?: string;
    total: number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, total }) => {
    if (active && payload && payload.length > 0) {
        const { name, value } = payload[0];
        const percent = ((value / total) * 100).toFixed(2);

        return (
            <div className="bg-white p-2 border border-gray-300 rounded shadow text-sm text-gray-800">
                <div><strong>{name}</strong></div>
                <div>Value: {value.toLocaleString()}</div>
                <div>{percent}%</div>
            </div>
        );
    }
    return null;
};

interface DonutChartCardProps {
    title: string;
    data: ChartData[];
}

const DonutChartCard: React.FC<DonutChartCardProps> = ({ title, data }) => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <div className="text-right">
                    <p className="text-2xl font-bold">{total.toLocaleString()}</p>
                </div>
            </CardHeader>
            <CardContent className="flex-1 relative">
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip total={total} />} />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconSize={10}
                                wrapperStyle={{ bottom: 10, left: 0, right: 0 }}
                                formatter={(value) => (
                                    <span className="text-xs text-gray-500">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export function TypesByLocation() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <span style={{
                    fontFamily: `'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif`,
                    fontSize: '20px',
                    fontWeight: 400,
                    color: '#111827',
                }}>
                    Business Types by Location
                </span>
                <p className="text-sm font-medium text-muted-foreground">
                    Explore business distribution across states, cities, and types
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DonutChartCard title="States" data={statesData} />
                <DonutChartCard title="Cities" data={citiesData} />
                <DonutChartCard title="Business Types" data={businessTypesData} />
            </div>
        </div>
    );
}

export default TypesByLocation;