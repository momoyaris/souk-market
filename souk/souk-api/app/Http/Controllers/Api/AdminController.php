<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Middleware admin appliqué dans les routes

    // GET /admin/stats
    public function stats()
    {
        return response()->json([
            'listings'       => Listing::where('is_active', true)->count(),
            'users'          => User::count(),
            'reports'        => Report::where('status', 'pending')->count(),
            'flagged'        => Listing::where('is_flagged', true)->count(),
        ]);
    }

    // GET /admin/reports
    public function reports(Request $request)
    {
        $reports = Report::with(['listing:id,title', 'user:id,name,email'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(20);

        return response()->json($reports);
    }

    // PATCH /admin/reports/:id — traiter un signalement
    public function handleReport(Request $request, Report $report)
    {
        $data = $request->validate([
            'action' => 'required|in:dismiss,remove_listing,ban_user',
        ]);

        switch ($data['action']) {
            case 'dismiss':
                $report->update(['status' => 'dismissed']);
                break;

            case 'remove_listing':
                $report->listing->update(['is_active' => false, 'is_flagged' => true]);
                $report->update(['status' => 'reviewed']);
                break;

            case 'ban_user':
                $report->listing->user->update(['role' => 'banned']);
                $report->update(['status' => 'reviewed']);
                break;
        }

        return response()->json(['message' => 'Action effectuée.', 'report' => $report->fresh()]);
    }

    // GET /admin/users
    public function users(Request $request)
    {
        $users = User::withCount('listings')
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(20);

        return response()->json($users);
    }

    // PATCH /admin/users/:id — modifier rôle/statut
    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'role' => 'required|in:user,admin,banned',
        ]);

        $user->update($data);

        return response()->json(['message' => 'Utilisateur mis à jour.', 'user' => $user]);
    }

    // GET /admin/listings — toutes les annonces
    public function listings(Request $request)
    {
        $listings = Listing::with('user:id,name,email')
            ->when($request->flagged, fn($q) => $q->where('is_flagged', true))
            ->latest()
            ->paginate(20);

        return response()->json($listings);
    }

    // DELETE /admin/listings/:id
    public function deleteListing(Listing $listing)
    {
        $listing->delete();
        return response()->json(['message' => 'Annonce supprimée définitivement.']);
    }
}
