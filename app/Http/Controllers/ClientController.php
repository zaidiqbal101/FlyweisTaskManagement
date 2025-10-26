<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['employee', 'client', 'detail'])->get();

        $formattedTasks = $tasks->map(function ($task) {
            return [
                'id' => $task->id,
                'task' => $task->task,
                'projectName' => $task->detail?->project_name ?? '',
                'projectSummary' => $task->detail?->project_summary ?? '',
                'developer' => $task->employee?->name ?? '',
                'client' => $task->client?->name ?? 'Unknown',
                'type' => $task->detail?->type ?? 'Unknown',
                'projectedTimeline' => $task->expected_timeline?->format('Y-m-d'),
                'deliveredDate' => $task->detail?->delivered_date?->format('Y-m-d') ?? null,
                'status' => $task->status,
                'due' => $task->due?->format('Y-m-d'),
                'devRemark' => $task->detail?->dev_remark ?? '',
                'clientRemark' => $task->detail?->client_remark ?? '',
            ];
        });

        return Inertia::render('Client', [
            'clientName' => null, // No specific client
            'tasks' => $formattedTasks,
        ]);
    }

    public function show(Client $client)
    {
        $tasks = $client->tasks()->with(['employee', 'detail'])->get();

        $formattedTasks = $tasks->map(function ($task) use ($client) {
            return [
                'id' => $task->id,
                'task' => $task->task,
                'projectName' => $task->detail?->project_name ?? '',
                'projectSummary' => $task->detail?->project_summary ?? '',
                'developer' => $task->employee?->name ?? '',
                'client' => $client->name,
                'type' => $task->detail?->type ?? 'Unknown',
                'projectedTimeline' => $task->expected_timeline?->format('Y-m-d'),
                'deliveredDate' => $task->detail?->delivered_date?->format('Y-m-d') ?? null,
                'status' => $task->status,
                'due' => $task->due?->format('Y-m-d'),
                'devRemark' => $task->detail?->dev_remark ?? '',
                'clientRemark' => $task->detail?->client_remark ?? '',
            ];
        });

        return Inertia::render('Client', [
            'clientName' => $client->name,
            'tasks' => $formattedTasks,
        ]);
    }
}