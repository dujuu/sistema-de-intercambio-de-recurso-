<?php

namespace App\Http\Controllers;

use App\Models\Recurso;
use Illuminate\Http\Request;

class RecursoController extends Controller
{
    public function index(Request $r)
    {
        return Recurso::with(['autor:id,name','asignatura:id,nombre_asignatura','tema:id,asignatura_id,nombre_tema'])
            ->when($r->q, fn($q)=>$q->where('titulo','like','%'.$r->q.'%'))
            ->when($r->asignatura_id, fn($q)=>$q->where('asignatura_id',$r->asignatura_id))
            ->when($r->tema_id, fn($q)=>$q->where('tema_id',$r->tema_id))
            ->latest()->paginate(12);
    }

    public function show(Recurso $recurso)
    {
        return $recurso->load([
            'autor:id,name',
            'asignatura:id,nombre_asignatura',
            'tema:id,asignatura_id,nombre_tema',
            'comentarios.autor:id,name',
            'calificaciones'
        ]);
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'titulo'=>'required|string|max:255',
            'descripcion'=>'nullable|string',
            'tipo_archivo'=>'required|string|max:50',
            'ruta'=>'nullable|string|max:1024',
            'asignatura_id'=>'required|exists:asignaturas,id',
            'tema_id'=>'required|exists:temas,id',
        ]);
        return Recurso::create($data + ['user_id'=>$r->user()->id]);
    }

    public function destroy(Request $r, Recurso $recurso)
    {
        $user = $r->user();
        $isOwner = $user && $user->id === $recurso->user_id;
        $isAdmin = $user && ($user->rol ?? 'estudiante') === 'admin';
        if (!$isOwner && !$isAdmin) abort(403,'No autorizado');
        $recurso->delete();
        return response()->noContent();
    }
}
