<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Asignatura;
use App\Models\Tema;

class CatalogoCompletoSeeder extends Seeder
{
    public function run(): void
    {
        // ===== 1) Asignaturas (código + nombre) =====
        $asignaturas = [
            ['codigo' => 'MA601', 'nombre' => 'CALCULO I'],
            ['codigo' => 'MA602', 'nombre' => 'CALCULO II'],
            ['codigo' => 'MA603', 'nombre' => 'CALCULO III'],
            ['codigo' => 'FI604', 'nombre' => 'ELECTROMAGNETISMO'],
            ['codigo' => 'CC052', 'nombre' => 'TECNOLOGIA WEB'],
            ['codigo' => 'CC218', 'nombre' => 'INGENIERIA DE SOFTWARE I'],
            ['codigo' => 'CC224', 'nombre' => 'INGENIERIA DE SOFTWARE II'],
            ['codigo' => 'FI601', 'nombre' => 'MECANICA CLASICA'],
            ['codigo' => 'IE078', 'nombre' => 'ELECTRICIDAD Y SISTEMAS DIGITALES'],
            ['codigo' => 'CC082', 'nombre' => 'ARQUITECTURA DE COMPUTADORES'],
            ['codigo' => 'CC359', 'nombre' => 'SISTEMAS OPERATIVOS'],
            ['codigo' => 'CC093', 'nombre' => 'COMUNICACION DE DATOS Y REDES'],
        ];

        // ===== 2) Temas comunes a todos los ramos =====
        $temasComunes = [
            'Introducción al curso',
            'Resultados de aprendizaje',
            'Material del curso y bibliografía',
            'Ejercicios / Guías',
            'Evaluaciones',
        ];

        // ===== 3) Temas específicos por código =====
        $temasEspecificos = [
            'MA601' => ['Límites y continuidad', 'Derivadas', 'Aplicaciones de la derivada', 'Integrales', 'Técnicas de integración'],
            'MA602' => ['Series y sucesiones', 'Integrales múltiples', 'Campos vectoriales', 'Ecuaciones diferenciales (intro)'],
            'MA603' => ['Funciones de varias variables', 'Gradiente y optimización', 'Integrales de línea y superficie', 'Teoremas de Green, Stokes y Gauss'],
            'FI604' => ['Campos eléctricos', 'Campos magnéticos', 'Leyes de Maxwell', 'Ondas electromagnéticas', 'Circuitos AC'],
            'CC052' => ['HTML y CSS', 'JavaScript moderno', 'Frameworks (React)', 'APIs REST y Fetch', 'Build & Deploy (Vite)'],
            'CC218' => ['Levantamiento de requisitos y UML', 'Gestión ágil (Scrum/Kanban)', 'Arquitectura y patrones', 'Pruebas unitarias', 'Control de versiones (Git)'],
            'CC224' => ['Arquitecturas distribuidas', 'CI/CD y DevOps', 'Calidad y métricas', 'DDD (domain-driven design)', 'Pruebas de integración'],
            'FI601' => ['Cinemática', 'Dinámica newtoniana', 'Trabajo y energía', 'Momento y colisiones', 'Oscilaciones'],
            'IE078' => ['Circuitos DC', 'Circuitos AC', 'Lógica digital', 'Álgebra de Boole y compuertas', 'Microcontroladores (intro)'],
            'CC082' => ['Organización de la CPU', 'Memoria y caché', 'ISA e instrucciones', 'Pipeline', 'Paralelismo'],
            'CC359' => ['Procesos e hilos', 'Planificación de CPU', 'Sincronización (mutex/semáforos)', 'Memoria virtual', 'Sistemas de archivos'],
            'CC093' => ['Modelo OSI / TCP-IP', 'Direccionamiento IP y subnetting', 'Ruteo básico', 'Conmutación y VLANs', 'Seguridad básica y Wireshark'],
        ];

        DB::transaction(function () use ($asignaturas, $temasComunes, $temasEspecificos) {
            foreach ($asignaturas as $a) {
                // Crear/reusar Asignatura
                $asig = Asignatura::firstOrCreate(
                    ['codigo' => $a['codigo']],
                    ['nombre_asignatura' => $a['nombre']]
                );

                // Temas comunes
                foreach ($temasComunes as $nombre) {
                    Tema::firstOrCreate([
                        'asignatura_id' => $asig->id,
                        'nombre_tema'   => $nombre,
                    ]);
                }

                // Temas específicos (si existen para el código)
                foreach (($temasEspecificos[$a['codigo']] ?? []) as $nombre) {
                    Tema::firstOrCreate([
                        'asignatura_id' => $asig->id,
                        'nombre_tema'   => $nombre,
                    ]);
                }
            }
        });
    }
}
