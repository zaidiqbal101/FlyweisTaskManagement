<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'status',
        'dev_remark',
        'client_remark',
        'manager_remark',
        'overall_remark',
        'manager_remarks',
        'testing_points',
        'documents',
    ];

    protected $casts = [
        'manager_remarks' => 'array',
        'testing_points' => 'array',
        'documents' => 'array',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}