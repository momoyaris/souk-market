<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Listing;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    // GET /conversations — mes conversations
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::with([
                'listing:id,title,price',
                'buyer:id,name,avatar',
                'seller:id,name,avatar',
                'lastMessage',
            ])
            ->where('buyer_id', $userId)
            ->orWhere('seller_id', $userId)
            ->latest()
            ->get();

        return response()->json($conversations);
    }

    // POST /conversations — démarrer une conversation
    public function store(Request $request)
    {
        $data = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'message'    => 'required|string|max:1000',
        ]);

        $listing = Listing::findOrFail($data['listing_id']);
        $buyer   = $request->user();

        // Empêcher le vendeur de se contacter lui-même
        if ($listing->user_id === $buyer->id) {
            return response()->json(['message' => 'Tu ne peux pas contacter ta propre annonce.'], 403);
        }

        // Trouver ou créer la conversation
        $conversation = Conversation::firstOrCreate([
            'listing_id' => $listing->id,
            'buyer_id'   => $buyer->id,
            'seller_id'  => $listing->user_id,
        ]);

        // Ajouter le premier message
        $conversation->messages()->create([
            'user_id' => $buyer->id,
            'text'    => $data['message'],
        ]);

        $conversation->load(['listing:id,title,price', 'buyer:id,name,avatar', 'seller:id,name,avatar', 'messages.user:id,name,avatar']);

        return response()->json($conversation, 201);
    }

    // GET /conversations/:id/messages
    public function messages(Request $request, Conversation $conversation)
    {
        $userId = $request->user()->id;

        // Sécurité : seuls les participants voient les messages
        if ($conversation->buyer_id !== $userId && $conversation->seller_id !== $userId) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $messages = $conversation->messages()
            ->with('user:id,name,avatar')
            ->get();

        return response()->json($messages);
    }

    // POST /conversations/:id/messages — envoyer un message
    public function sendMessage(Request $request, Conversation $conversation)
    {
        $userId = $request->user()->id;

        if ($conversation->buyer_id !== $userId && $conversation->seller_id !== $userId) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'text' => 'required|string|max:1000',
        ]);

        $message = $conversation->messages()->create([
            'user_id' => $userId,
            'text'    => $data['text'],
        ]);

        $message->load('user:id,name,avatar');

        return response()->json($message, 201);
    }
}
