<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'sub_category',
        'manager',
    ];

    protected $casts = [
        'sub_category' => 'string', // or null if empty
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}