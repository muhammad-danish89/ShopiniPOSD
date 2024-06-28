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
use App\Models\Shipping;
use App\utils\helpers;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Stripe;

class ShippingController extends Controller
{
 
 //////////////////////////////////////////////////////////////////////////////////

    //------------ GET ALL Currency -----------\\

    public function index(Request $request)
    {
 $setting_epxress =DB::table('settings')->select('shopiniexpress')->first();
         
        if($setting_epxress->shopiniexpress==1){
         
       
		$this->OnlineShoini();
		
        $perPage = $request->limit;
        $pageStart = \Request::get('page', 1);
        // Start displaying items from this number;
        $offSet = ($pageStart * $perPage) - $perPage;
        $order = $request->SortField;
        $dir = $request->SortType;
        $helpers = new helpers();
  $Ship= DB::table('shipping')->select('shipping.id','shipping.sale_id','track_id','total_amount','warehouse_id','name','client_id','date')->join('clients', 'clients.id', '=',  'shipping.client_id' )->where('shipping.deleted_at', '=', null)

        // Search With Multiple Param
            ->where(function ($query) use ($request) {
                return $query->when($request->filled('search'), function ($query) use ($request) {
                    return $query->where('sale_id', 'LIKE', "%{$request->search}%")
                        ->orWhere('track_id', 'LIKE', "%{$request->search}%");
                });
            });
        $totalRows = $Ship->count();
        $Ship = $Ship->offset($offSet)
            ->limit($perPage)
            ->orderBy($order, $dir)
            ->get();

        return response()->json([
            'shippings' => $Ship,
            'totalRows' => $totalRows,
        ]);
    }
    else{
          return response()->json([
            'shippings' => "",
            'totalRows' => "",
        ]);
    }

    }
   
  
    public function destroy(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'delete', Currency::class);

        Currency::whereId($id)->update([
            'deleted_at' => Carbon::now(),
        ]);

        return response()->json(['success' => true]);
    }

    //-------------- Delete by selection  ---------------\\

    public function delete_by_selection(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'delete', Currency::class);
        $selectedIds = $request->selectedIds;

        foreach ($selectedIds as $Currency_id) {
            Currency::whereId($Currency_id)->update([
                'deleted_at' => Carbon::now(),
            ]);
        }
        return response()->json(['success' => true]);
    }

    //------------ GET ALL Currency WITHOUT PAGINATE -----------\\

    public function Get_Shippings()
    {
		
        $Currencies = Shipping::where('deleted_at', null)->get(['id', 'sale_id']);
        return response()->json($Currencies);
    }



//////////////////////////////////////////////////////////////// 
public function OnlineShoini()
{

$sales = DB::table('sales')->select('id', 'user_id','warehouse_id','GrandTotal','client_id','date','city_id','province_id','address')->get();  
$product_array=array();
foreach($sales as $array){
    


 if(($array->client_id !=1) || ($array->client_id ==1 && $array->city_id!=0 && $array->province_id!=0)){
 
            $order = new Shipping;
            $order->date = $array->date;
            $order->client_id = $array->client_id;
			 $order->warehouse_id = $array->warehouse_id;
            $order->sale_id = $array->id;
            $order->user_id = $array->user_id;
              $order->total_amount = $array->GrandTotal;
			  
			 
			 $order->custom_city_id = $array->city_id;
			 $order->custom_province_id = $array->province_id;
            $order->custom_address = $array->address;
			  
			  
			  
			  
          // $order->product=json_encode($product_array);
            $alreadyshipping = Shipping::where('sale_id', '=', $array->id)
            ->where('client_id', '=', $array->client_id)->first();
            
            if ($alreadyshipping == null) {
            $order->save();
            } else {
            // Update the existing record
            }
          
 }////////IF MAin
    
}
  
   
}
public function Offline()
{


  DB::update('update settings set shopiniexpress = ? where id = ?',['0','1']);

 Auth::logout();
  return redirect('/login');
    
}

public function OnlineSync()
{
    $supplier =DB::table('settings')->first();
    if($supplier->shopiniexpress==1){
         
        
$awb='';    
$client = '';

 $product_detail='';   
$total_qty=$total_amount='';    




$array_order=array();
$shipping = DB::table('shipping')->select('sale_id','total_amount','warehouse_id','user_id','client_id','date','status','custom_city_id','custom_province_id','custom_address')->where('track_id','=',0)->get()->toArray(); 
    foreach($shipping as $array){
    
     $total_qty= SaleDetail :: where('sale_id', $array->sale_id)->count();
     $total_amount=$array->total_amount;
      $product= SaleDetail ::select('sale_id','product_id','quantity','name')->join('products', 'products.id', '=',  'sale_details.product_id' )->where('sale_id', $array->sale_id)->get()->toArray();
       $product_detail='[';
      foreach($product as $arr){
      
        //  .':''.$arr['quantity'].'','.description.':'.$arr['name'].'
$product_detail .='{"quantity":'.$arr['quantity'].',"description":"'.$arr['name'].'"},';
          
      }
      $str= rtrim($product_detail, ", ");
      $product_detail =$str.']';
        $product_detail=  urlencode($product_detail);
           

      
      $warehouse_detail=DB::table('warehouses')->where('id', $array->warehouse_id)->first();
      $client = DB::table('clients')->where('id', $array->client_id)->first();
   
   //////////////////Supplier////////////////////
   $from_country_id=1;
$from_province_id=$warehouse_detail->province_id;
$from_city_id=$warehouse_detail->city_id;
$receiver_code="123456";
//////////////////////// Client /////////////////////////


$receiver_name=$client->name;
$receiver_phone=$client->phone;
$receiver_country_id=$client->country;

if($array->custom_province_id==0 || $array->custom_city_id==0){
	
$receiver_address=$client->adresse;
$receiver_province_id=$client->province_id;
$receiver_city_id=$client->city;
}else{

$receiver_phone=$supplier->CompanyPhone;

$receiver_address=$array->custom_address;
$receiver_province_id=$array->custom_province_id;
$receiver_city_id=$array->custom_city_id;
	
}
/////////////////// Supplier ////////////////////////


$supplier_name=$supplier->CompanyName;
$supplier_phone=$supplier->CompanyPhone;
$supplier_address=$supplier->CompanyAdress;
$supplier_country=$supplier->country_id;

$awb=$array->client_id.$array->sale_id.random_int(100000, 999999);

$value_of_goods=$array->total_amount;
      

$package_description="Pcak";



$total_quantity=$total_qty;

$package_shipped_address_form_city_id=$warehouse_detail->city_id;

$package_price_main=$array->total_amount;
$quantity=$total_qty;
$curl = curl_init();


curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://www.shopini.com/apiexpresspackagetrack/create_shipment',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'PUT',
  CURLOPT_POSTFIELDS => 'marchantid=MTk4NzQ%3D&secret_key=MTk4NzQhQCMkOTg5ODk4OTg5ODg%3D&from_country_id='.$from_country_id.'&province_id='.$from_province_id.'&city_id='.$from_city_id.'&customer_name='.$receiver_name.'&package_shipped_phone_number='.$supplier_phone.'&package_shipped_address='.$supplier_address.'&receiver_country_id='.$receiver_country_id.'&receiver_province_id='.$receiver_province_id.'&package_shipped_address_form_city_id='.$package_shipped_address_form_city_id.'&supplier_name='.$supplier_name.'&supplier_phone='.$supplier_phone.'&supplier_country='.$supplier_country.'&from_city_id='.$from_country_id.'&&parcel_box=%7B%20%22awb%22%3A%22'.$awb.'%22%20%2C%22package_description%22%3A%22%22%2C%22value_of_goods%22%3A%22'.$total_amount.'%22%2C%22total_quantity%22%3A%22'.$total_quantity.'%22%2C%22weight%22%3A%222.5%22%2C%20%22weight_unit%22%3A%221.5%22%2C%22length%22%3A%222.5%22%2C%22width%22%3A%221.5%22%2C%22height%22%3A%222.5%22%2C%22dimensions_unit%22%3A%222.5%22%2C%22parcel_items%22%3A'.$product_detail.'%20%7D&from_province_id='.$from_province_id.'&receiver_city_id='.$receiver_city_id.'&receiver_name='.$receiver_name.'&receiver_address='.$receiver_address.'&receiver_phone='.$receiver_phone.'&package_price_main='.$package_price_main.'',
 CURLOPT_HTTPHEADER => array(
    'Content-Type: application/x-www-form-urlencoded',
    'Cookie: incap_ses_890_1146687=IGy5HGdF0AcfihSmqupZDGsLEmEAAAAAkDRmpok0NiesppMt46ZS4A==; visid_incap_1146687=C76pJRm8SiWQDxVwGbj+rWsLEmEAAAAAQUIPAAAAAACjolyuoV+bN70leT/cn8sF; PHPSESSID=j2udtij30onkfu0dluue7qavl6; _csrf=d85799b3f3419c14b4ecf0e04337be0db9e81aed00f4f48e8be339d9c41aa0aaa%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22fR15qVn4PpPsaMBFYE5u080nteQiJXoW%22%3B%7D'
  ),
));

 
$response = curl_exec($curl);

curl_close($curl);
$res=json_decode($response);
print_r($res);
DB::table('shipping')->where('sale_id', $array->sale_id)->update(array('track_id' =>$res->data->track_number,'status'=>'Y','awb'=>$awb));  

	 }
   
     return response()->json(['success' => true]);
	}else{
		  return response()->json(['waraning' => true]);
	}
	
  
      
     
       
 
   
}





}
