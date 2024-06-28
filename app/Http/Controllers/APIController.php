<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Client;
use App\Models\PaymentSale;
use App\Models\Product;
use App\Models\Setting;
use App\Models\ProductVariant;
use App\Models\product_warehouse;
use App\Models\PaymentWithCreditCard;
use App\Models\Role;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Warehouse;
use App\utils\helpers;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe;

class APIController extends BaseController
{
public function getCountries()
    {
        $data = DB::table('city')->get()->toArray();
  
        return response()->json($data);
    }
  
    public function getStates(Request $request)
    {
		
        $data = DB::table('province')->where('city_id', $request->country_id)->get()->toArray();
   
        return response()->json($data);
    }
}
