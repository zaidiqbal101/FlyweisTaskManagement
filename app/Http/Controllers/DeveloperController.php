<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use App\Models\Employee;
use App\Models\Client;
use App\Models\TaskDetail;

class DeveloperController extends Controller
{
    private function getDeveloperData()
    {
        $employees = Employee::where('category', 'Developers')
            ->select('id', 'name', 'sub_category')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'subCategory' => $employee->sub_category,
                ];
            });

        $tasks = Task::with([
            'employee:id,name,category,sub_category',
            'client:id,name',
            'detail'
        ])
        ->whereHas('employee', function ($query) {
            $query->where('category', 'Developers');
        })
        ->get()
        ->map(function ($task) {
            return [
                'id' => $task->id,
                'task' => $task->task,
                'developer' => $task->employee->name ?? 'Unknown',
                'client' => $task->client->name ?? 'Unknown',
                'status' => $task->status ?? 'Pending',
                'due' => $task->due ? $task->due->format('Y-m-d') : null,
                'projectedTimeline' => $task->due ? $task->due->format('Y-m-d') : null,
                'deliveredDate' => $task->detail && $task->detail->delivered_date ? $task->detail->delivered_date->format('Y-m-d') : '',
                'devRemark' => $task->detail ? ($task->detail->dev_remark ?? '') : '',
                'clientRemark' => $task->detail ? ($task->detail->client_remark ?? '') : '',
            ];
        });

        return [
            'tasks' => $tasks,
            'employees' => $employees,
        ];
    }

    public function index()
    {
        return Inertia::render('Developer', $this->getDeveloperData());
    }

    public function updateTask(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $detail = $task->detail ?? new TaskDetail(['task_id' => $id]);

        $validated = $request->validate([
            'devRemark' => 'nullable|string|max:1000',
            'status' => 'nullable|in:Pending,In Progress,Completed',
            'delivered_date' => 'nullable|date',
        ]);

        $updates = [];

        if (isset($validated['status'])) {
            $updates['status'] = $validated['status'];
            if ($validated['status'] === 'Completed' && isset($validated['delivered_date'])) {
                $detail->delivered_date = $validated['delivered_date'];
                $detail->save();
            }
        }

        if (!empty($updates)) {
            $task->update($updates);
        }

        if (isset($validated['devRemark'])) {
            $detail->dev_remark = $validated['devRemark'];
            $detail->save();
        }

        $request->session()->flash('success', 'Task updated successfully!');

        return back();
    }
}