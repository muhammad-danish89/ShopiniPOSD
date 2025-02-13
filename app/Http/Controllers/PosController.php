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

class PosController extends BaseController
{

    //------------ Create New  POS --------------\\

    public function CreatePOS(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'Sales_pos', Sale::class);

        request()->validate([
            'client_id' => 'required',
            'warehouse_id' => 'required',
            'payment.amount' => 'required',
        ]);


        $item = \DB::transaction(function () use ($request) {
            $helpers = new helpers();
            $role = Auth::user()->roles()->first();
            $view_records = Role::findOrFail($role->id)->inRole('record_view');
            $order = new Sale;

            $order->is_pos = 1;
            $order->date = Carbon::now();
            $order->Ref = app('App\Http\Controllers\SalesController')->getNumberOrder();
            $order->client_id = $request->client_id;
			 
			$order->city_id = $request->city_id;
			$order->province_id = $request->province_id;
		    $order->address = $request->address;
			 
            $order->warehouse_id = $request->warehouse_id;
            $order->tax_rate = $request->tax_rate;
            $order->TaxNet = $request->TaxNet;
            $order->discount = $request->discount;
            $order->shipping = $request->shipping;
            $order->GrandTotal = $request->GrandTotal;
            $order->statut = 'completed';
            $order->user_id = Auth::user()->id;

            $order->save();

            $data = $request['details'];
            foreach ($data as $key => $value) {
                $orderDetails[] = [
                    'date' => Carbon::now(),
                    'sale_id' => $order->id,
                    'quantity' => $value['quantity'],
                    'product_id' => $value['product_id'],
                    'product_variant_id' => $value['product_variant_id'],
                    'total' => $value['subtotal'],
                    'price' => $value['Unit_price'],
                    'TaxNet' => $value['tax_percent'],
                    'tax_method' => $value['tax_method'],
                    'discount' => $value['discount'],
                    'discount_method' => $value['discount_Method'],
                ];

                $unit = Product::with('unitSale')
                    ->where('id', $value['product_id'])
                    ->where('deleted_at', '=', null)
                    ->first();

                if ($value['product_variant_id'] !== null) {
                    $product_warehouse = product_warehouse::where('warehouse_id', $order->warehouse_id)
                        ->where('product_id', $value['product_id'])->where('product_variant_id', $value['product_variant_id'])
                        ->first();

                    if ($unit && $product_warehouse) {
                        if ($unit['unitSale']->operator == '/') {
                            $product_warehouse->qte -= $value['quantity'] / $unit['unitSale']->operator_value;
                        } else {
                            $product_warehouse->qte -= $value['quantity'] * $unit['unitSale']->operator_value;
                        }
                        $product_warehouse->save();
                    }

                } else {
                    $product_warehouse = product_warehouse::where('warehouse_id', $order->warehouse_id)
                        ->where('product_id', $value['product_id'])
                        ->first();
                    if ($unit && $product_warehouse) {
                        if ($unit['unitSale']->operator == '/') {
                            $product_warehouse->qte -= $value['quantity'] / $unit['unitSale']->operator_value;
                        } else {
                            $product_warehouse->qte -= $value['quantity'] * $unit['unitSale']->operator_value;
                        }
                        $product_warehouse->save();
                    }
                }
            }

            SaleDetail::insert($orderDetails);

            $sale = Sale::findOrFail($order->id);
            // Check If User Has Permission view All Records
            if (!$view_records) {
                // Check If User->id === sale->id
                $this->authorizeForUser($request->user('api'), 'check_record', $sale);
            }

            try {

                $total_paid = $sale->paid_amount + $request->payment['amount'];
                $due = $sale->GrandTotal - $total_paid;

                if ($due === 0.0 || $due < 0.0) {
                    $payment_statut = 'paid';
                } else if ($due != $sale->GrandTotal) {
                    $payment_statut = 'partial';
                } else if ($due == $sale->GrandTotal) {
                    $payment_statut = 'unpaid';
                }

                if ($request->payment['Reglement'] == 'credit card') {
                    $Client = Client::whereId($request->client_id)->first();
                    Stripe\Stripe::setApiKey(config('app.STRIPE_SECRET'));

                    $PaymentWithCreditCard = PaymentWithCreditCard::where('customer_id', $request->client_id)->first();
                    if (!$PaymentWithCreditCard) {
                        // Create a Customer
                        $customer = \Stripe\Customer::create([
                            'source' => $request->token,
                            'email' => $Client->email,
                        ]);

                        // Charge the Customer instead of the card:
                        $charge = \Stripe\Charge::create([
                            'amount' => $request->payment['amount'] * 100,
                            'currency' => 'usd',
                            'customer' => $customer->id,
                        ]);
                        $PaymentCard['customer_stripe_id'] = $customer->id;

                    } else {
                        $customer_id = $PaymentWithCreditCard->customer_stripe_id;
                        $charge = \Stripe\Charge::create([
                            'amount' => $request->payment['amount'] * 100,
                            'currency' => 'usd',
                            'customer' => $customer_id,
                        ]);
                        $PaymentCard['customer_stripe_id'] = $customer_id;
                    }

                    $PaymentSale = new PaymentSale();
                    $PaymentSale->sale_id = $order->id;
                    $PaymentSale->Ref = app('App\Http\Controllers\PaymentSalesController')->getNumberOrder();
                    $PaymentSale->date = Carbon::now();
                    $PaymentSale->Reglement = $request->payment['Reglement'];
                    $PaymentSale->montant = $request->payment['amount'];
                    $PaymentSale->notes = $request->payment['notes'];
                    $PaymentSale->user_id = Auth::user()->id;
                    $PaymentSale->save();

                    $sale->update([
                        'paid_amount' => $total_paid,
                        'payment_statut' => $payment_statut,
                    ]);

                    $PaymentCard['customer_id'] = $request->client_id;
                    $PaymentCard['payment_id'] = $PaymentSale->id;
                    $PaymentCard['charge_id'] = $charge->id;
                    PaymentWithCreditCard::create($PaymentCard);

                    // Paying Method Cash
                } else {

                    PaymentSale::create([
                        'sale_id' => $order->id,
                        'Ref' => app('App\Http\Controllers\PaymentSalesController')->getNumberOrder(),
                        'date' => Carbon::now(),
                        'Reglement' => $request->payment['Reglement'],
                        'montant' => $request->payment['amount'],
                        'notes' => $request->payment['notes'],
                        'user_id' => Auth::user()->id,
                    ]);

                    $sale->update([
                        'paid_amount' => $total_paid,
                        'payment_statut' => $payment_statut,
                    ]);
                }

            } catch (Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }

            return $order->id;

        }, 10);

        return response()->json(['success' => true, 'id' => $item]);

    }


 public function getProv(Request $request)
    {
		
        $data = DB::table('province')->where('city_id', $request->city_id)->get([]);
   
        return response()->json($data);
    }


    //------------ Get Products--------------\\

    public function GetProductsByParametre(request $request)
    {
        $this->authorizeForUser($request->user('api'), 'Sales_pos', Sale::class);
        // How many items do you want to display.
        $perPage = 6;
        $pageStart = \Request::get('page', 1);
        // Start displaying items from this number;
        $offSet = ($pageStart * $perPage) - $perPage;
        $data = array();

        $product_warehouse_data = product_warehouse::where('warehouse_id', $request->warehouse_id)
            ->with('product', 'product.unitSale')
            ->where('deleted_at', '=', null)
            ->where(function ($query) use ($request) {
                if ($request->stock == '1') {
                    return $query->where('qte', '>', 0);
                }

            })
        // Filter
            ->where(function ($query) use ($request) {
                return $query->when($request->filled('category_id'), function ($query) use ($request) {
                    return $query->whereHas('product', function ($q) use ($request) {
                        $q->where('category_id', '=', $request->category_id);
                    });
                });
            })
            ->where(function ($query) use ($request) {
                return $query->when($request->filled('brand_id'), function ($query) use ($request) {
                    return $query->whereHas('product', function ($q) use ($request) {
                        $q->where('brand_id', '=', $request->brand_id);
                    });
                });
            });
        // Search With Multiple Param
            // ->where(function ($query) use ($request) {
            //     return $query->when($request->filled('search'), function ($query) use ($request) {
            //         return $query->Where(function ($query) use ($request) {
            //             return $query->whereHas('product', function ($q) use ($request) {
            //                 $q->where('name', 'LIKE', "%{$request->search}%")
            //                     ->orWhere('code', 'LIKE', "%{$request->search}%");
            //             });
            //         });
            //     });
            // });

        $totalRows = $product_warehouse_data->count();

        $product_warehouse_data = $product_warehouse_data
            ->offset($offSet)
            ->limit(6)
            ->get();

        foreach ($product_warehouse_data as $product_warehouse) {
            if ($product_warehouse->product_variant_id) {
                $productsVariants = ProductVariant::where('product_id', $product_warehouse->product_id)
                    ->where('id', $product_warehouse->product_variant_id)
                    ->where('deleted_at', null)
                    ->first();

                $item['product_variant_id'] = $product_warehouse->product_variant_id;
                $item['Variant'] = $productsVariants->name;
                $item['code'] = $productsVariants->name . '-' . $product_warehouse['product']->code;

            } else if ($product_warehouse->product_variant_id === null) {
                $item['product_variant_id'] = null;
                $item['Variant'] = null;
                $item['code'] = $product_warehouse['product']->code;
            }
            $item['id'] = $product_warehouse->product_id;
            $item['barcode'] = $product_warehouse['product']->code;
            $item['name'] = $product_warehouse['product']->name;
            $firstimage = explode(',', $product_warehouse['product']->image);
            $item['image'] = $firstimage[0];

            if ($product_warehouse['product']['unitSale']->operator == '/') {
                $item['qte_sale'] = $product_warehouse->qte * $product_warehouse['product']['unitSale']->operator_value;
                $price = $product_warehouse['product']->price / $product_warehouse['product']['unitSale']->operator_value;

            } else {
                $item['qte_sale'] = $product_warehouse->qte / $product_warehouse['product']['unitSale']->operator_value;
                $price = $product_warehouse['product']->price * $product_warehouse['product']['unitSale']->operator_value;

            }
            $item['unitSale'] = $product_warehouse['product']['unitSale']->ShortName;

            if ($product_warehouse['product']->TaxNet !== 0.0) {

                //Exclusive
                if ($product_warehouse['product']->tax_method == '1') {
                    $tax_price = $price * $product_warehouse['product']->TaxNet / 100;

                    $item['Net_price'] = $price + $tax_price;

                    // Inxclusive
                } else {
                    $item['Net_price'] = $price;
                }
            } else {
                $item['Net_price'] = $price;
            }

            $data[] = $item;
        }

        return response()->json([
            'products' => $data,
            'totalRows' => $totalRows,
        ]);
    }

    //--------------------- Get Element POS ------------------------\\

    public function GetELementPos(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'Sales_pos', Sale::class);

        $warehouses = Warehouse::where('deleted_at', '=', null)->get(['id', 'name']);
        $clients = Client::where('deleted_at', '=', null)->get(['id', 'name','phone']);
		 $city = DB::table('city')->get(['id', 'city_name_english']);
		 
  $province= DB::table('province')->select('province_id', 'province_name_eng','city_name_english')->join('city', 'city.id', '=',  'province.city_id' )->get([]);
    		 
		// print_r($province);exit;
		
        $settings = Setting::where('deleted_at', '=', null)->first();
        if ($settings->warehouse_id) {
            if (Warehouse::where('id', $settings->warehouse_id)->where('deleted_at', '=', null)->first()) {
                $defaultWarehouse = $settings->warehouse_id;
            } else {
                $defaultWarehouse = '';
            }
        } else {
            $defaultWarehouse = '';
        }

        if ($settings->client_id) {
            if (Client::where('id', $settings->client_id)->where('deleted_at', '=', null)->first()) {
                $defaultClient = $settings->client_id;
            } else {
                $defaultClient = '';
            }
        } else {
            $defaultClient = '';
        }
        $categories = Category::where('deleted_at', '=', null)->get(['id', 'name']);
        $brands = Brand::where('deleted_at', '=', null)->get();
        $stripe_key = config('app.STRIPE_KEY');
        
if ($settings->shopiniexpress) {
            
                $shopiniexpress = $settings->shopiniexpress;
            
        } else {
            $shopiniexpress = '0';
        }

        

        return response()->json([
            'stripe_key' => $stripe_key,
            'brands' => $brands,
            'defaultWarehouse' => $defaultWarehouse,
            'defaultClient' => $defaultClient,
            'clients' => $clients,
			'city'=>$city,
			'province'=>$province,
            'warehouses' => $warehouses,
            'shopiniexpress'=>$shopiniexpress,
            'categories' => $categories,
        ]);
    }

public function OnlineShoini()
{

$arr=Sale::all();
//print_r($arr);
//exit;

  DB::update('update settings set shopiniexpress = ? where id = ?',['1','1']);

 Auth::logout();
  return redirect('/login');
   
}
public function Offline()
{

  DB::update('update settings set shopiniexpress = ? where id = ?',['0','1']);

 Auth::logout();
  return redirect('/login');
    
}



}
