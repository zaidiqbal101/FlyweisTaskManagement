<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'task',
        'employee_id',
        'client_id',
        'status',
        'due',
        'expected_timeline',
        'user_id',
    ];

    protected $casts = [
        'due' => 'date',
        'expected_timeline' => 'date',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function detail()
    {
        return $this->hasOne(TaskDetail::class);
    }

    public function testingPoints()
    {
        return $this->hasMany(TestingPoint::class);
    }
    // Relationship to the user who created the task
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}