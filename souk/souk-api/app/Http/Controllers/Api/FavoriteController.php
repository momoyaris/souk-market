<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Listing;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    // GET /favorites — mes favoris
    public function index(Request $request)
    {
        $favorites = $request->user()
            ->favoriteListings()
            ->with('user:id,name,avatar')
            ->active()
            ->latest()
            ->get();

        return response()->json($favorites);
    }

    // POST /favorites — ajouter un favori
    public function store(Request $request)
    {
        $data = $request->validate([
            'listing_id' => 'required|exists:listings,id',
        ]);

        $favorite = Favorite::firstOrCreate([
            'user_id'    => $request->user()->id,
            'listing_id' => $data['listing_id'],
        ]);

        return response()->json([
            'message' => 'Ajouté aux favoris.',
            'favorite' => $favorite,
        ], 201);
    }

    // DELETE /favorites/:listing_id — retirer un favori
    public function destroy(Request $request, int $listingId)
    {
        Favorite::where('user_id', $request->user()->id)
            ->where('listing_id', $listingId)
            ->delete();

        return response()->json(['message' => 'Retiré des favoris.']);
    }

    // GET /favorites/:listing_id/check — vérifier si favori
    public function check(Request $request, int $listingId)
    {
        $isFav = Favorite::where('user_id', $request->user()->id)
            ->where('listing_id', $listingId)
            ->exists();

        return response()->json(['is_favorite' => $isFav]);
    }
}
