// Archivo: src/app/page.tsx
'use client'; // Usamos 'use client' porque el componente dashboard también usa hooks.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAllData } from '@/lib/notion'; // Asegúrate de que esta importación sea correcta
import { DashboardData } from '@/types';
import { CommandCenter } from '@/components/dashboard/CommandCenter';
import { WeeklyScoreboard } from '@/components/dashboard/WeeklyScoreboard';
import { ProjectsHealth } from '@/components/dashboard/ProjectsHealth';
import { SprintHealth } from '@/components/dashboard/SprintHealth';
import { CapacityBoard } from '@/components/dashboard/CapacityBoard';
import { BurnUpChart } from '@/components/dashboard/BurnUpChart';

// Importación de componentes de UI si son necesarios (ej. Skeleton)
// import { Skeleton } from '@/components/ui/skeleton'; 

export default function DashboardPage() {
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener y verificar datos
    const loadData = async () => {
        try {
            // Verifica la autenticación (si es necesario un middleware, esto es redundante, pero lo mantendremos)
            const authResponse = await fetch('/api/auth/verify');
            const authResult = await authResponse.json();
            
            if (!authResult.authenticated) {
                // Si la sesión expiró o no está autenticado, redirigir a login
                router.push('/login'); 
                return;
            }

            // Si está autenticado, cargar datos del dashboard
            const response = await fetch('/api/dashboard'); // Usa tu API de dashboard
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error || 'Error al cargar datos del dashboard.');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        
        // Configura el auto-refresh (cada 5 minutos según .env.example)
        const interval = setInterval(loadData, 300000); // 5 minutos
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        // Puedes usar un componente Skeleton aquí mientras carga
        return (
            <div className="min-h-screen p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600">Cargando dashboard...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen p-8 text-center text-red-600">
                <h2>Error de Carga</h2>
                <p>{error}</p>
                <p className="text-sm text-gray-500 mt-2">Verifica tus variables de entorno y conexión a Notion.</p>
            </div>
        );
    }

    if (!data) {
        return <div className="min-h-screen p-8 text-center">No hay datos para mostrar.</div>;
    }

    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <CommandCenter projects={data.projects} tasks={data.tasks} />
                <div className="md:col-span-2">
                    <WeeklyScoreboard tasks={data.tasks} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ProjectsHealth projects={data.projects} />
                <SprintHealth tasks={data.tasks} sprints={data.sprints} />
                <CapacityBoard tasks={data.tasks} />
            </div>

            <div className="mt-6">
                <BurnUpChart tasks={data.tasks} />
            </div>
        </main>
    );
}