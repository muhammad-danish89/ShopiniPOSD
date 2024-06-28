<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name', 'code', 'adresse', 'email', 'phone', 'country', 'city','city_id','province_id',

    ];

    protected $casts = [
        'code' => 'integer',
    ];
}
