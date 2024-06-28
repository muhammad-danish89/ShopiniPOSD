<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipping extends Model
{
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'date',  'client_id',  'user_id', 'statut','id'
    ];
    protected $table = 'shipping';
	public $timestamps = true;

    protected $casts = [
       
      
        'user_id' => 'integer',
        'client_id' => 'integer',
        'id' => 'integer'
     
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function details()
    {
        return $this->hasMany('App\Models\SaleDetail');
    }

    public function client()
    {
        return $this->belongsTo('App\Models\Client');
    }

    public function facture()
    {
        return $this->hasMany('App\Models\PaymentSale');
    }

    

}
