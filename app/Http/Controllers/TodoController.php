<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    public function index()
    {
        $tasks = Todo::where('user_id', Auth::id()) // only user’s tasks
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'text' => $task->text,
                    'completed' => $task->completed,
                    'createdAt' => $task->created_at->toDateTimeString(),
                    'dueDate' => $task->due_date ? $task->due_date->format('Y-m-d') : null,
                    'dueTime' => $task->due_time ? $task->due_time->format('H:i') : null,
                    'priority' => $task->priority,
                ];
            });

        return Inertia::render('Todo', [
            'tasks' => $tasks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:255',
            'dueDate' => 'required|date',
            'dueTime' => 'required|date_format:H:i',
            'priority' => 'required|in:High,Medium,Low',
        ]);

        Todo::create([
            'text' => $validated['text'],
            'completed' => false,
            'due_date' => $validated['dueDate'],
            'due_time' => $validated['dueTime'],
            'priority' => $validated['priority'],
            'user_id' => Auth::id(), // ✅ assign to logged-in user
        ]);

        return back()->with('success', 'Task added successfully!');
    }

    public function update(Request $request, $id)
    {
        $task = Todo::where('user_id', Auth::id())->findOrFail($id); // ✅ secure access

        $validated = $request->validate([
            'text' => 'sometimes|required|string|max:255',
            'dueDate' => 'sometimes|required|date',
            'dueTime' => 'sometimes|required|date_format:H:i',
            'priority' => 'sometimes|required|in:High,Medium,Low',
            'completed' => 'sometimes|required|boolean',
        ]);

        $task->update($validated);

        return back()->with('success', 'Task updated successfully!');
    }

    public function destroy($id)
    {
        $task = Todo::where('user_id', Auth::id())->findOrFail($id); // ✅ secure access
        $task->delete();

        return back()->with('success', 'Task deleted successfully!');
    }
}
