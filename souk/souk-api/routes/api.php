<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Souk Marketplace
|--------------------------------------------------------------------------
*/

// ── Public routes ──────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

// Annonces publiques
Route::get('listings',              [ListingController::class, 'index']);
Route::get('listings/{listing}',    [ListingController::class, 'show']);
Route::get('users/{userId}/listings', [ListingController::class, 'byUser']);

// ── Authenticated routes ────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    // Annonces
    Route::post('listings',                  [ListingController::class, 'store']);
    Route::put('listings/{listing}',         [ListingController::class, 'update']);
    Route::delete('listings/{listing}',      [ListingController::class, 'destroy']);
    Route::post('listings/{listing}/images', [ListingController::class, 'uploadImage']);

    // Signalement
    Route::post('listings/{listingId}/report', [ReportController::class, 'store']);

    // Conversations & messages
    Route::get('conversations',                              [ConversationController::class, 'index']);
    Route::post('conversations',                             [ConversationController::class, 'store']);
    Route::get('conversations/{conversation}/messages',      [ConversationController::class, 'messages']);
    Route::post('conversations/{conversation}/messages',     [ConversationController::class, 'sendMessage']);

    // Favoris
    Route::get('favorites',                  [FavoriteController::class, 'index']);
    Route::post('favorites',                 [FavoriteController::class, 'store']);
    Route::delete('favorites/{listingId}',   [FavoriteController::class, 'destroy']);
    Route::get('favorites/{listingId}/check',[FavoriteController::class, 'check']);

    // ── Admin routes ────────────────────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('stats',                     [AdminController::class, 'stats']);
        Route::get('reports',                   [AdminController::class, 'reports']);
        Route::patch('reports/{report}',        [AdminController::class, 'handleReport']);
        Route::get('users',                     [AdminController::class, 'users']);
        Route::patch('users/{user}',            [AdminController::class, 'updateUser']);
        Route::get('listings',                  [AdminController::class, 'listings']);
        Route::delete('listings/{listing}',     [AdminController::class, 'deleteListing']);
    });
});
