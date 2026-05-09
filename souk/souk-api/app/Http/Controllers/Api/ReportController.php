<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // POST /listings/:id/report
    public function store(Request $request, int $listingId)
    {
        $data = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        // Un utilisateur ne peut signaler qu'une fois la même annonce
        $existing = Report::where('user_id', $request->user()->id)
            ->where('listing_id', $listingId)
            ->exists();

        if ($existing) {
            return response()->json(['message' => 'Tu as déjà signalé cette annonce.'], 409);
        }

        $report = Report::create([
            'listing_id' => $listingId,
            'user_id'    => $request->user()->id,
            'reason'     => $data['reason'],
            'status'     => 'pending',
        ]);

        return response()->json(['message' => 'Signalement envoyé. Merci !', 'report' => $report], 201);
    }
}
