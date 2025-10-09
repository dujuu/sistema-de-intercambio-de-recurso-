<?php

namespace App\Http\Controllers;

use App\Models\Reporte;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    public function store(Request $r, $recursoId)
    {
        $data = $r->validate([
            'descripcion_reporte'=>'required|string|max:2000'
        ]);
        return Reporte::create([
            'user_id'=>$r->user()->id,
            'recurso_id'=>$recursoId,
            'descripcion_reporte'=>$data['descripcion_reporte']
        ]);
    }

    public function index(Request $r)
    {
        $this->authorizeAdmin($r->user());
        return Reporte::with(['autor:id,name','recurso:id,titulo'])
            ->when($r->estado, fn($q)=>$q->where('estado',$r->estado))
            ->latest()->paginate(20);
    }

    public function update(Request $r, Reporte $reporte)
    {
        $this->authorizeAdmin($r->user());
        $data = $r->validate([
            'estado'=>'required|in:pendiente,aprobado,rechazado'
        ]);
        $reporte->update($data);
        return $reporte->fresh();
    }

    private function authorizeAdmin($user)
    {
        if(!$user || ($user->rol ?? 'estudiante') !== 'admin') abort(403,'Solo admin');
    }
}
